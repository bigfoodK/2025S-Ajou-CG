import Texture from "../Texture";
import CharacterTextureImage from "./Character.png";
import CharacterSpineTextureImage from "./CharacterSpine.png";
import CharacterChestTextureImage from "./CharacterChest.png";
import CharacterNeckTextureImage from "./CharacterNeck.png";
import CharacterHeadTextureImage from "./CharacterHead.png";
import CharacterShoulderLTextureImage from "./CharacterShoulderL.png";
import CharacterUpperArmLTextureImage from "./CharacterUpperArmL.png";
import CharacterForearmLTextureImage from "./CharacterForearmL.png";
import CharacterHandLTextureImage from "./CharacterHandL.png";
import CharacterThighLTextureImage from "./CharacterThighL.png";
import CharacterShinLTextureImage from "./CharacterShinL.png";
import CharacterFootLTextureImage from "./CharacterFootL.png";
import CharacterToeLTextureImage from "./CharacterToeL.png";
import CharacterShoulderRTextureImage from "./CharacterShoulderR.png";
import CharacterUpperArmRTextureImage from "./CharacterUpperArmR.png";
import CharacterForearmRTextureImage from "./CharacterForearmR.png";
import CharacterHandRTextureImage from "./CharacterHandR.png";
import CharacterThighRTextureImage from "./CharacterThighR.png";
import CharacterShinRTextureImage from "./CharacterShinR.png";
import CharacterFootRTextureImage from "./CharacterFootR.png";
import CharacterToeRTextureImage from "./CharacterToeR.png";

export class CharacterTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterTextureImage;
  }
}
export class CharacterSpineTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterSpineTextureImage;
  }
}
export class CharacterChestTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterChestTextureImage;
  }
}
export class CharacterNeckTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterNeckTextureImage;
  }
}
export class CharacterHeadTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterHeadTextureImage;
  }
}
export class CharacterShoulderLTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterShoulderLTextureImage;
  }
}
export class CharacterUpperArmLTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterUpperArmLTextureImage;
  }
}
export class CharacterForearmLTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterForearmLTextureImage;
  }
}
export class CharacterHandLTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterHandLTextureImage;
  }
}
export class CharacterThighLTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterThighLTextureImage;
  }
}
export class CharacterShinLTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterShinLTextureImage;
  }
}
export class CharacterFootLTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterFootLTextureImage;
  }
}
export class CharacterToeLTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterToeLTextureImage;
  }
}
export class CharacterShoulderRTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterShoulderRTextureImage;
  }
}
export class CharacterUpperArmRTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterUpperArmRTextureImage;
  }
}
export class CharacterForearmRTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterForearmRTextureImage;
  }
}
export class CharacterHandRTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterHandRTextureImage;
  }
}
export class CharacterThighRTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterThighRTextureImage;
  }
}
export class CharacterShinRTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterShinRTextureImage;
  }
}
export class CharacterFootRTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterFootRTextureImage;
  }
}
export class CharacterToeRTexture extends Texture {
  protected getImageSrc(): string {
    return CharacterToeRTextureImage;
  }
}

export const characterTextureMap = new Map<string, Texture>([
  ["Character", new CharacterTexture()],
  ["CharacterSpine", new CharacterSpineTexture()],
  ["CharacterChest", new CharacterChestTexture()],
  ["CharacterNeck", new CharacterNeckTexture()],
  ["CharacterHead", new CharacterHeadTexture()],
  ["CharacterShoulderL", new CharacterShoulderLTexture()],
  ["CharacterUpperArmL", new CharacterUpperArmLTexture()],
  ["CharacterForearmL", new CharacterForearmLTexture()],
  ["CharacterHandL", new CharacterHandLTexture()],
  ["CharacterThighL", new CharacterThighLTexture()],
  ["CharacterShinL", new CharacterShinLTexture()],
  ["CharacterFootL", new CharacterFootLTexture()],
  ["CharacterToeL", new CharacterToeLTexture()],
  ["CharacterShoulderR", new CharacterShoulderRTexture()],
  ["CharacterUpperArmR", new CharacterUpperArmRTexture()],
  ["CharacterForearmR", new CharacterForearmRTexture()],
  ["CharacterHandR", new CharacterHandRTexture()],
  ["CharacterThighR", new CharacterThighRTexture()],
  ["CharacterShinR", new CharacterShinRTexture()],
  ["CharacterFootR", new CharacterFootRTexture()],
  ["CharacterToeR", new CharacterToeRTexture()],
]);
