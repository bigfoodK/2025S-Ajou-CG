import type { Scene } from "../Scene";
import Model, { type ModelInit } from "./Model";
import { modelObjectMeshMap } from "./obj/modelObjectMeshMap";

export default class Floor extends Model {
  constructor(init: ModelInit = {}) {
    super(init);
  }

  public vertices() {
    console.log(modelObjectMeshMap.get(this.constructor.name)!.getVertices());
    return modelObjectMeshMap.get(this.constructor.name)!.getVertices();
  }

  public normals() {
    return modelObjectMeshMap.get(this.constructor.name)!.getNormals();
  }

  public render(scene: Scene): void {
    scene
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
