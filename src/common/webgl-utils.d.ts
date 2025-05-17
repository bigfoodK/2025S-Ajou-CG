declare interface WebGLUtilsType {
  create3DContext(
    canvas: HTMLCanvasElement,
    opt_attribs?: WebGLContextAttributes
  ): WebGLRenderingContext | null;
  setupWebGL(
    canvas: HTMLCanvasElement,
    opt_attribs?: WebGLContextAttributes
  ): WebGLRenderingContext | null;
}

declare var WebGLUtils: WebGLUtilsType;

declare global {
  interface Window {
    requestAnimFrame(callback: FrameRequestCallback, element?: Element): number;
  }
}
