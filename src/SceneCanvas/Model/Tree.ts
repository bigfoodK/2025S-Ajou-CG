import type { Scene } from "../Scene";
import type Texture from "../Texture/Texture";
import TreeTexture from "../Texture/TreeTexture";
import Model from "./Model";
import { modelObjectMeshMap } from "./obj/modelObjectMeshMap";

export default class Tree extends Model {
  public vertices() {
    return modelObjectMeshMap.get(this.constructor.name)!.getVertices();
  }

  public normals() {
    return modelObjectMeshMap.get(this.constructor.name)!.getNormals();
  }

  public texcoords() {
    return modelObjectMeshMap.get(this.constructor.name)!.getTexcoords();
  }

  public texture(): Texture {
    return new TreeTexture();
  }

  public render(scene: Scene): void {
    scene
      .useTexture(this.texture())
      .currentShader()
      .setModelViewMatrixUniform(scene, this.modelViewMatrix);
    const vertexInfo = this.getVertexInfo(scene);
    scene.gl.drawArrays(
      scene.gl.TRIANGLES,
      vertexInfo.index,
      vertexInfo.length
    );
  }
}
