import type { Scene } from "../Scene";
import FloorTexture from "../Texture/FloorTexture";
import Model, { type ModelInit } from "./Model";
import { modelObjectMeshMap } from "./obj/modelObjectMeshMap";

export default class Floor extends Model {
  constructor(init: ModelInit = {}) {
    super(init);
  }

  public texture() {
    return new FloorTexture();
  }

  public vertices() {
    return modelObjectMeshMap.get(this.constructor.name)!.getVertices();
  }

  public normals() {
    return modelObjectMeshMap.get(this.constructor.name)!.getNormals();
  }

  public texcoords() {
    return modelObjectMeshMap.get(this.constructor.name)!.getTexcoords();
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
