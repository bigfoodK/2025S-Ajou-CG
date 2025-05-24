import type { Scene } from "../Scene";

export default abstract class Texture {
  protected abstract getImageSrc(): string;

  public async load(): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        resolve(img);
      };
      img.onerror = (e) => reject(e);
      img.src = this.getImageSrc();
    });
  }

  public async register(scene: Scene): Promise<void> {
    if (scene.textures.has(this.constructor.name)) {
      return;
    }
    const image = await this.load();
    const gl = scene.gl;
    const texture = gl.createTexture();
    if (!texture) throw new Error("Failed to create WebGLTexture");
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    scene.textures.set(this.constructor.name, texture);
  }
}
