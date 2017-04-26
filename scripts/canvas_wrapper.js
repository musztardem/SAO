let instance = null;

class CanvasWrapper {
  constructor() {
    if (!instance) {
      instance = this;
    }

    this._canvas = document.getElementById('board');
    this._ctx = this._canvas.getContext('2d');

    return instance;
  }

  getWidth() {
    return this._canvas.width;
  }

  getHeight() {
    return this._canvas.height;
  }

  getCanvas() {
    return this._canvas;
  }

  getContext() {
    return this._ctx;
  }
}
