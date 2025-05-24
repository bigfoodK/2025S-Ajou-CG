import type { XYZ } from "./Model/Model";
import type { Scene } from "./Scene";

export default class Camera {
  private targetPosition: XYZ = { x: 0, y: 1.7, z: 0 };
  private targetGaze: XYZ = { x: 0, y: 1.7, z: -1 };
  private position: XYZ = { x: 3, y: 1.7, z: 3 };
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

  public setTarget({ position, gaze }: { position: XYZ; gaze: XYZ }) {
    this.targetPosition = position;
    this.targetGaze = gaze;
  }

  public tick(_scene: Scene, deltaTime: number) {
    const affectRatio = deltaTime / 100;
    this.position.x += (this.targetPosition.x - this.position.x) * affectRatio;
    this.position.y += (this.targetPosition.y - this.position.y) * affectRatio;
    this.position.z += (this.targetPosition.z - this.position.z) * affectRatio;
    this.gaze.x += (this.targetGaze.x - this.gaze.x) * affectRatio;
    this.gaze.y += (this.targetGaze.y - this.gaze.y) * affectRatio;
    this.gaze.z += (this.targetGaze.z - this.gaze.z) * affectRatio;

    const viewMatrix = lookAt(
      vec3(this.position.x, this.position.y, this.position.z),
      vec3(this.gaze.x, this.gaze.y, this.gaze.z),
      vec3(0, 1, 0)
    );
    this.viewMatrix = viewMatrix;
  }
}
