(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{266:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.readAbr=void 0;var n=t(239),o=t(233),c=["off","fade","pen pressure","pen tilt","stylus sheel","initial direction","direction","initial rotation","rotation"];function d(desc){return{control:c[desc.bVTy],steps:desc.fStp,jitter:n.parsePercent(desc.jitter),minimum:n.parsePercent(desc["Mnm "])}}function h(desc){var e={size:n.parseUnitsToNumber(desc.Dmtr,"Pixels"),angle:n.parseAngle(desc.Angl),roundness:n.parsePercent(desc.Rndn),spacingOn:desc.Intr,spacing:n.parsePercent(desc.Spcn),flipX:desc.flipX,flipY:desc.flipY};return desc["Nm  "]&&(e.name=desc["Nm  "]),desc.Hrdn&&(e.hardness=n.parsePercent(desc.Hrdn)),desc.sampledData&&(e.sampledData=desc.sampledData),e}r.readAbr=function(e,r){var t;void 0===r&&(r={});var c=o.createReader(e.buffer,e.byteOffset,e.byteLength),l=o.readInt16(c),m=[],f=[],v=[];if(1===l||2===l)throw new Error("Unsupported ABR version ("+l+")");if(6!==l&&7!==l&&10!==l)throw new Error("Unsupported ABR version");var y=o.readInt16(c);if(1!==y&&2!==y)throw new Error("Unsupported ABR minor version");for(;c.offset<c.view.byteLength;){o.checkSignature(c,"8BIM");var P=o.readSignature(c),w=o.readUint32(c),D=c.offset+w;switch(P){case"samp":for(;c.offset<D;){for(var S=o.readUint32(c);3&S;)S++;var B=c.offset+S,x=o.readPascalString(c,1);o.skipBytes(c,1===y?10:264);var A=o.readInt32(c),I=o.readInt32(c),T=o.readInt32(c)-A,U=o.readInt32(c)-I;if(U<=0||T<=0)throw new Error("Invalid bounds");var M=o.readInt16(c),O=o.readUint8(c),E=new Uint8Array(U*T);if(8===M)if(0===O)E.set(o.readBytes(c,E.byteLength));else{if(1!==O)throw new Error("Invalid compression");o.readDataRLE(c,{width:U,height:T,data:E},U,T,1,[0],!1)}else{if(16!==M)throw new Error("Invalid depth");if(0!==O)throw 1===O?new Error("not implemented (16bit RLE)"):new Error("Invalid compression");for(var i=0;i<E.byteLength;i++)E[i]=o.readUint16(c)>>8}m.push({id:x,bounds:{x:I,y:A,w:U,h:T},alpha:E}),c.offset=B}break;case"desc":for(var C=0,R=(desc=n.readVersionAndDescriptor(c)).Brsh;C<R.length;C++){var V=R[C],b={name:V["Nm  "],shape:h(V.Brsh),spacing:n.parsePercent(V.Spcn),wetEdges:V.Wtdg,noise:V.Nose,useBrushSize:V.useBrushSize};null!=V.interpretation&&(b.interpretation=V.interpretation),null!=V.protectTexture&&(b.protectTexture=V.protectTexture),V.useTipDynamics&&(b.shapeDynamics={tiltScale:n.parsePercent(V.tiltScale),sizeDynamics:d(V.szVr),angleDynamics:d(V.angleDynamics),roundnessDynamics:d(V.roundnessDynamics),flipX:V.flipX,flipY:V.flipY,brushProjection:V.brushProjection,minimumDiameter:n.parsePercent(V.minimumDiameter),minimumRoundness:n.parsePercent(V.minimumRoundness)}),V.useScatter&&(b.scatter={count:V["Cnt "],bothAxes:V.bothAxes,countDynamics:d(V.countDynamics),scatterDynamics:d(V.scatterDynamics)}),V.useTexture&&(b.texture={id:V.Txtr.Idnt,name:V.Txtr["Nm  "],blendMode:n.BlnM.decode(V.textureBlendMode),depth:n.parsePercent(V.textureDepth),depthMinimum:n.parsePercent(V.minimumDepth),depthDynamics:d(V.textureDepthDynamics),scale:n.parsePercent(V.textureScale),invert:V.InvT,brightness:V.textureBrightness,contrast:V.textureContrast});var k=V.dualBrush;k&&k.useDualBrush&&(b.dualBrush={flip:k.Flip,shape:h(k.Brsh),blendMode:n.BlnM.decode(k.BlnM),useScatter:k.useScatter,spacing:n.parsePercent(k.Spcn),count:k["Cnt "],bothAxes:k.bothAxes,countDynamics:d(k.countDynamics),scatterDynamics:d(k.scatterDynamics)}),V.useColorDynamics&&(b.colorDynamics={foregroundBackground:d(V.clVr),hue:n.parsePercent(V["H   "]),saturation:n.parsePercent(V.Strt),brightness:n.parsePercent(V.Brgh),purity:n.parsePercent(V.purity),perTip:V.colorDynamicsPerTip}),V.usePaintDynamics&&(b.transfer={flowDynamics:d(V.prVr),opacityDynamics:d(V.opVr),wetnessDynamics:d(V.wtVr),mixDynamics:d(V.mxVr)}),V.useBrushPose&&(b.brushPose={overrideAngle:V.overridePoseAngle,overrideTiltX:V.overridePoseTiltX,overrideTiltY:V.overridePoseTiltY,overridePressure:V.overridePosePressure,pressure:n.parsePercent(V.brushPosePressure),tiltX:V.brushPoseTiltX,tiltY:V.brushPoseTiltY,angle:V.brushPoseAngle});var L=V.toolOptions;L&&(b.toolOptions={brushPreset:L.brushPreset,flow:L.flow,smooth:L.Smoo,mode:n.BlnM.decode(L["Md  "]),opacity:L.Opct,smoothing:L.smoothing,smoothingValue:L.smoothingValue,smoothingRadiusMode:L.smoothingRadiusMode,smoothingCatchup:L.smoothingCatchup,smoothingCatchupAtEnd:L.smoothingCatchupAtEnd,smoothingZoomCompensation:L.smoothingZoomCompensation,pressureSmoothing:L.pressureSmoothing,usePressureOverridesSize:L.usePressureOverridesSize,usePressureOverridesOpacity:L.usePressureOverridesOpacity,useLegacy:L.useLegacy}),f.push(b)}break;case"patt":c.offset<D&&(v.push(o.readPattern(c)),c.offset=D);break;case"phry":var desc=n.readVersionAndDescriptor(c);r.logMissingFeatures&&(null===(t=desc.hierarchy)||void 0===t?void 0:t.length)&&console.log("unhandled phry section",desc);break;default:throw new Error("Invalid brush type: "+P)}for(;w%4;)c.offset++,w++}return{samples:m,patterns:v,brushes:f}}},267:function(e,r,t){"use strict";var n=this&&this.__assign||function(){return(n=Object.assign||function(e){for(var s,i=1,r=arguments.length;i<r;i++)for(var p in s=arguments[i])Object.prototype.hasOwnProperty.call(s,p)&&(e[p]=s[p]);return e}).apply(this,arguments)};Object.defineProperty(r,"__esModule",{value:!0}),r.readCsh=void 0;var o=t(238),c=t(233);r.readCsh=function(e){var r=c.createReader(e.buffer,e.byteOffset,e.byteLength),t={shapes:[]};if(c.checkSignature(r,"cush"),2!==c.readUint32(r))throw new Error("Invalid version");for(var d=c.readUint32(r),i=0;i<d;i++){for(var h=c.readUnicodeString(r);r.offset%4;)r.offset++;if(1!==c.readUint32(r))throw new Error("Invalid shape version");var l=c.readUint32(r),m=r.offset+l,f=c.readPascalString(r,1),v=c.readUint32(r),y=c.readUint32(r),P=c.readUint32(r),w=c.readUint32(r)-y,D=P-v,mask={paths:[]};o.readVectorMask(r,mask,w,D,m-r.offset),t.shapes.push(n({name:h,id:f,width:w,height:D},mask)),r.offset=m}return t}}}]);