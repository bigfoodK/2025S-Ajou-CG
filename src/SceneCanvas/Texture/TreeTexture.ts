import Texture from "./Texture";
import TreeTextureImage from "./Tree.png";

export default class TreeTexture extends Texture {
  protected getImageSrc(): string {
    return TreeTextureImage;
  }
}
