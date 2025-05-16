export class Scene {
  private gl: WebGLRenderingContext;
  private shouldStopRendering: boolean = false;
  private lastRenderTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext("webgl") as WebGLRenderingContext;
    if (!this.gl) {
      throw new Error(
        "Unable to initialize WebGL. Your browser may not support it."
      );
    }
    this.lastRenderTime = performance.now();
    this.initGl(canvas);
  }

  private initGl(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  render() {
    if (this.shouldStopRendering) {
      return;
    }

    const currentTime = performance.now();
    const _deltaTime = currentTime - this.lastRenderTime;
    this.lastRenderTime = currentTime;

    // TODO: Tick Objects
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // TODO: Render Objects

    requestAnimationFrame(this.render.bind(this));
  }
  startRendering() {
    this.render();
  }
  stopRendering() {
    this.shouldStopRendering = true;
  }
}
