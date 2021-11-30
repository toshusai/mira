export class UndoManager {
  public static main: UndoManager = new UndoManager();

  private undoStack: Function[] = [];
  private redoStack: Function[] = [];

  get undoLength() {
    return this.undoStack.length;
  }

  get redoLength() {
    return this.redoStack.length;
  }

  public push(f: Function) {
    this.undoStack.push(f);
  }

  public pushRedo(f: Function) {
    this.redoStack.push(f);
  }

  public clearRedo() {
    this.redoStack = [];
  }

  public undo() {
    if (this.undoStack.length > 0) {
      const i = this.undoStack[this.undoStack.length - 1];
      i();
      this.undoStack.splice(this.undoStack.length - 1, 1);
    }
  }

  public redo() {
    if (this.redoStack.length > 0) {
      const i = this.redoStack[this.redoStack.length - 1];
      i();
      this.redoStack.splice(this.redoStack.length - 1, 1);
    }
  }
}
