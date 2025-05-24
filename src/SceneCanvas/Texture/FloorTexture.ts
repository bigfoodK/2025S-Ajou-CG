import FloorTextureImage from "./Floor.png";
import Texture from "./Texture";

export default class FloorTexture extends Texture {
  protected getImageSrc(): string {
    return FloorTextureImage;
  }
}
