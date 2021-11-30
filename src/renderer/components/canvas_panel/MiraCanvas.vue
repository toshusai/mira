<template>
  <div style="height: 100vh">
    <div class="alpha-background" :style="style">
      <canvas ref="canvasEl" :width="width" :height="height" />
    </div>
    <div class="log">
      <div v-for="(x, i) in vlogs" :key="i">{{ x }}</div>
    </div>
  </div>
</template>

<style scoped>
.log {
  left: 0;
  top: 0;
  position: absolute;
  pointer-events: none;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, Watch } from "vue-property-decorator";
import {
  Eraser,
  IPencil,
  Layer,
  Pencil,
  Project,
  Tool,
} from "../../models/ie/Project";
import { getXY } from "../../utils/draw";
import { getDistance, getAngle } from "../../models/math/utils";
import { UndoManager } from "../../models/UndoManager";
import { Vector3 } from "~/mira/math/Vector3";

interface History {
  layer: Layer;
  stroke: Vector3[];
}

@Component({ components: {} })
export default class MiraCanvas extends Vue {
  @Prop({ default: () => new Pencil() }) pencil!: Pencil;
  @Prop({ default: () => new Eraser() }) eraser!: Pencil;
  @Prop({ default: Tool.Pencil }) tool!: Tool;
  @Prop({ default: () => [] }) layers!: Layer[];
  @Prop({ default: null }) currentLayer!: Layer | null;
  @Prop({ default: false }) flipH!: boolean;
  @Prop() project!: Project;

  @Ref() canvasEl!: HTMLCanvasElement;

  canvasElCtx!: CanvasRenderingContext2D;

  pageTop: number = 0;
  pageLeft: number = 0;

  scale: number = 1;
  pos = { x: 100, y: 100 };
  base = { x: 0, y: 0 };

  baseScale: number = 1;
  pinching = false;
  prevTouchList: TouchList | null = null;
  logs: string[] = [];
  isMousedown: boolean = false;

  prevD = Number.NaN;
  doneFP = false;

  tempCtx: CanvasRenderingContext2D | null = null;

  prevPoint: Vector3 | null = null;
  stroke: Vector3[] = [];

  history: History[] = [];

  get width() {
    return this.project.width;
  }

  get height() {
    return this.project.height;
  }

  get ctx() {
    if (this.tempCtx) return this.tempCtx;
    if (this.currentLayer) return this.currentLayer.ctx;
  }

  get canvas() {
    if (this.currentLayer) return this.currentLayer.canvas;
  }

  get style(): Partial<CSSStyleDeclaration> {
    let x = this.pos.x;
    let scale = this.scale;
    if (this.flipH) {
      x = this.pos.x + this.width * this.scale;
      scale = -scale;
    }

    return {
      transform: `translate(${x}px, ${this.pos.y}px) scale(${scale}, ${Math.abs(
        scale
      )})`,
      transformOrigin: `top left`,
      width: this.width + "px",
      height: this.height + "px",
    };
  }

  get vlogs() {
    return this.logs.reverse();
  }

  @Watch("currentLayer")
  init() {
    if (!this.currentLayer) return;

    this.layers.forEach((l) => {
      const img = l.ctx.getImageData(0, 0, 512, 512);
      l.ctx.putImageData(img, 0, 0);
    });
  }

  /**
   * renderCanvas
   * draw all layers to single canvas context.
   */
  @Watch("layers")
  renderCanvas() {
    this.canvasElCtx.globalCompositeOperation = "source-over";
    this.canvasElCtx.clearRect(0, 0, this.width, this.height);
    this.layers.forEach((l) => {
      this.canvasElCtx.globalAlpha = l.opacity;
      this.canvasElCtx.drawImage(l.canvas, 0, 0);
    });
  }

  mounted() {
    this.canvasElCtx = this.canvasEl.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    this.clear();

    const eventEl = this.$el as HTMLElement;
    eventEl.addEventListener("mousedown", this.start);
    eventEl.addEventListener("touchstart", this.start, { passive: false });

    eventEl.addEventListener("mousemove", this.move);
    eventEl.addEventListener("touchmove", this.move, { passive: false });

    eventEl.addEventListener("mouseup", this.end);
    // eventEl.addEventListener("mouseleave", this.end);
    eventEl.addEventListener("touchend", this.end, { passive: false });
    // eventEl.addEventListener("touchcancel", this.end, { passive: false });
    this.resize();
    this.init();
    if (this.layers.length > 0) {
      // this.width = this.layers[0].canvas.width;
      // this.height = this.layers[0].canvas.height;
    }
    this.$nextTick(() => this.init());
    this.renderCanvas();

    // setInterval(() => {
    //   this.zoom(1.01, { x: 1, y: 1 });
    // }, 100);
  }

  clear() {
    if (!this.ctx) return;
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.width, this.height);
    // this.ctx.clearRect(0, 0, this.width, this.height);
  }

  resize() {
    if (!this.canvasEl) return;
    const rect = this.canvasEl.getBoundingClientRect();
    this.pageTop = rect.top;
    this.pageLeft = rect.left;
  }

  drawOnCanvas(point: Vector3, disableRender: boolean = false) {
    if (!this.ctx) return;
    this.ctx.strokeStyle = this.pencil.color.toHex();
    this.ctx.fillStyle = this.pencil.color.toHex();
    this.ctx.globalCompositeOperation = "source-over";
    if (this.tool == Tool.Eraser) {
      this.ctx.globalCompositeOperation = "destination-out";
    }

    let iPencil: IPencil = this.pencil;
    if (this.tool == Tool.Eraser) {
      iPencil = this.eraser;
    }

    this.ctx.lineWidth = 0;

    if (this.prevPoint == null) {
      const p = point;
      this.ctx.beginPath();
      const w = iPencil.size * p.z;
      this.ctx.arc(p.x, p.y, w / 2, 0, Math.PI * 2, false);
      this.ctx.fill();
      this.ctx.stroke();
    } else {
      const pp = this.prevPoint;
      const p = point;
      const dist = getDistance(p, pp);
      const a = getAngle(p, pp);
      for (let i = 0; i < dist; i += 0.5) {
        let rate = i / dist;
        if (rate <= 0.1) rate = 0;
        if (rate >= 1) rate = 1;
        if (p.z < 0.1) p.z = 0.1;
        const leap = (a: number, b: number, v: number) => {
          return a * (1 - v) + b * v;
        };
        const prevW = iPencil.size * leap(1, pp.z, iPencil.pressureSizeWeight);
        const nowW = iPencil.size * leap(1, p.z, iPencil.pressureSizeWeight);
        const w = leap(nowW, prevW, rate);
        this.ctx.globalAlpha =
          iPencil.opacity * leap(1, p.z, iPencil.pressureOpacityWeight);
        this.ctx.beginPath();
        this.ctx.arc(
          p.x + Math.sin(a) * i,
          p.y + Math.cos(a) * i,
          w / 2,
          0,
          Math.PI * 2,
          false
        );
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
      }
    }
    this.stroke.push(point);
    this.prevPoint = point;
    if (!disableRender) {
      this.renderCanvas();
    }
  }

  handle(e: TouchEvent | MouseEvent) {
    if (!(e instanceof TouchEvent)) return;
    if (e.touches.length == 2) {
      if (!this.doneFP) {
        this.doneFP = true;
        this.prevD = Number.NaN;
        this.pinching = true;
        return;
      }
      const a = e.touches[0];
      const b = e.touches[1];
      const av = { x: a.pageX, y: a.pageY };
      const bv = { x: b.pageX, y: b.pageY };
      const c = {
        x: (av.x + bv.x) / 2,
        y: (av.y + bv.y) / 2,
      };
      const center = {
        x: c.x - this.pageLeft,
        y: c.y - this.pageTop,
      };
      center.x /= this.width * this.scale;
      center.y /= this.height * this.scale;
      // distance of tow points.
      const d = Math.sqrt(Math.pow(av.x - bv.x, 2) + Math.pow(av.y - bv.y, 2));
      if (!isNaN(this.prevD)) {
        // delta scale of "scale"
        const rate = d / this.prevD;
        this.zoom(rate, center);
      }
      this.resize();
      this.prevD = d;
    }
  }

  zoom(rate: number, center: any) {
    const prev = this.scale;
    // 1. change scalse
    this.scale *= rate;
    // 2. move pos for change scale
    // scale origin is left-top
    const diff = -this.scale + prev;
    this.pos.x += this.width * center.x * diff;
    this.pos.y += this.height * center.y * diff;
  }

  start(e: MouseEvent | TouchEvent) {
    if (e instanceof TouchEvent && e.touches.length > 0) {
      this.base.x = e.touches[0].pageX;
      this.base.y = e.touches[0].pageY;
    }

    this.doneFP = false;
    this.isMousedown = true;
    if (!this.isFingerTouch(e)) {
      const p = getXY(this.canvasEl, this.scale, e);
      if (this.flipH) p.x = this.width - p.x;
      this.drawOnCanvas(p);
    }

    if (e instanceof TouchEvent) {
      this.prevTouchList = e.touches;
    }
    this.renderCanvas();
    e.preventDefault();
  }

  move(e: MouseEvent | TouchEvent) {
    if (e instanceof TouchEvent) {
      if (e.touches[0] && e.touches[0].touchType != "stylus") {
        if (e.touches.length == 1 && this.prevTouchList?.length == 1) {
          this.pos.x += e.touches[0].pageX - this.base.x;
          this.pos.y += e.touches[0].pageY - this.base.y;
          this.base.x = e.touches[0].pageX;
          this.base.y = e.touches[0].pageY;
          this.resize();
        }
        if (e.touches.length == 1) {
          this.base.x = e.touches[0].pageX;
          this.base.y = e.touches[0].pageY;
        }
      }
    }

    this.handle(e);
    if (!this.isMousedown) return;
    if (!this.isFingerTouch(e)) {
      const p = getXY(this.canvasEl, this.scale, e);
      if (this.flipH) p.x = this.width - p.x;
      if (e instanceof TouchEvent) this.prevTouchList = e.touches;
      this.drawOnCanvas(p);
    }
    e.preventDefault();
  }

  isFingerTouch(e: MouseEvent | TouchEvent) {
    return (
      e instanceof TouchEvent &&
      e.touches.length > 0 &&
      e.touches[0].touchType != "stylus"
    );
  }

  end(e: MouseEvent | TouchEvent) {
    this.handle(e);
    this.pinching = false;
    const isFinger =
      this.prevTouchList &&
      this.prevTouchList.length > 0 &&
      this.prevTouchList[0].touchType == "direct";
    if (!isFinger && this.stroke.length > 0) {
      if (!this.currentLayer) return;
      this.history.push({ layer: this.currentLayer, stroke: this.stroke });
      this.$store.commit("setRedo", false);
      UndoManager.main.clearRedo();

      const undo = () => {
        // add Pencil
        this.layers.forEach((l) =>
          l.ctx.clearRect(0, 0, this.width, this.height)
        );

        const redoStroke = this.history.splice(this.history.length - 1, 1);
        this.drawStrokes(this.history);

        UndoManager.main.pushRedo(() => {
          if (redoStroke.length > 0) {
            this.layers.forEach((l) =>
              l.ctx.clearRect(0, 0, this.width, this.height)
            );
            this.history.push(redoStroke[0]);
            this.drawStrokes(this.history);
            UndoManager.main.push(undo);
            this.$store.commit("setUndo", true);
          }
        });
        this.$store.commit("setRedo", true);
      };
      UndoManager.main.push(undo);
      this.$store.commit("setUndo", true);
    }
    this.stroke = [];
    this.prevPoint = null;
    this.isMousedown = false;
    this.renderCanvas();
    e.preventDefault();
  }

  drawStrokes(histories: History[]) {
    if (!this.currentLayer) return;
    for (let i = 0; i < histories.length; i++) {
      const history = histories[i];
      this.tempCtx = history.layer.ctx;
      this.prevPoint = null;

      for (let j = 0; j < history.stroke.length; j++) {
        const point = history.stroke[j];
        this.drawOnCanvas(point, true);
      }
      this.stroke = [];
      this.prevPoint = null;
    }
    this.renderCanvas();
    this.tempCtx = null;
  }
}
</script>