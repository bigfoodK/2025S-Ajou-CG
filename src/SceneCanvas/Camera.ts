import type { XYZ } from "./Model/Model";
import type { Scene } from "./Scene";

export default class Camera {
  private position: XYZ = { x: 3, y: 0, z: 3 };
  private gaze: XYZ = { x: 0, y: 0, z: 0 };
  public projectionMatrix: number[][] = mat4();
  public viewMatrix: number[][] = mat4();

  constructor() {}

  public setProjectionProperty() {
    this.projectionMatrix = perspective(
      103 * (9 / 16),
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
  }

  public tick(_scene: Scene, _deltaTime: number) {
    const viewMatrix = lookAt(
      vec3(this.position.x, this.position.y, this.position.z),
      vec3(this.gaze.x, this.gaze.y, this.gaze.z),
      vec3(0, 1, 0)
    );
    this.viewMatrix = viewMatrix;
  }
}
