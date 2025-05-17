import type { Scene } from "../../Scene";
import Model, { type ModelInit } from "../Model";
import { WMPVertices } from "./WMPVertices";

export default class WMP extends Model {
  constructor(init: ModelInit = {}) {
    super(init);
  }

  public vertices() {
    return WMPVertices;
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
