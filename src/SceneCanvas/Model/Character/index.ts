import Model, { type ModelInit, type XYZ } from "../Model";
import CharacterSpine from "./CharacterSpine";
import CharacterChest from "./CharacterChest";
import CharacterNeck from "./CharacterNeck";
import CharacterHead from "./CharacterHead";
import CharacterShoulderL from "./CharacterShoulderL";
import CharacterUpperArmL from "./CharacterUpperArmL";
import CharacterForearmL from "./CharacterForearmL";
import CharacterHandL from "./CharacterHandL";
import CharacterThighL from "./CharacterThighL";
import CharacterShinL from "./CharacterShinL";
import CharacterFootL from "./CharacterFootL";
import CharacterToeL from "./CharacterToeL";
import CharacterShoulderR from "./CharacterShoulderR";
import CharacterUpperArmR from "./CharacterUpperArmR";
import CharacterForearmR from "./CharacterForearmR";
import CharacterHandR from "./CharacterHandR";
import CharacterThighR from "./CharacterThighR";
import CharacterShinR from "./CharacterShinR";
import CharacterFootR from "./CharacterFootR";
import CharacterToeR from "./CharacterToeR";
import parseBVH from "./parseBVH";
import toothlessDance from "./toothlessDance.bvh?raw";
import { CharacterPart } from "./CharacterPart";
import type { Scene } from "../../Scene";

const bvhNodeModelMap = new Map([
  ["B_spine", CharacterSpine],
  ["B_chest", CharacterChest],
  ["B_neck", CharacterNeck],
  ["B_head", CharacterHead],
  ["B_shoulder_L", CharacterShoulderL],
  ["B_upperArm_L", CharacterUpperArmL],
  ["B_forearm_L", CharacterForearmL],
  ["B_hand_L", CharacterHandL],
  ["B_thigh_L", CharacterThighL],
  ["B_shin_L", CharacterShinL],
  ["B_foot_L", CharacterFootL],
  ["B_toe_L", CharacterToeL],
  ["B_shoulder_R", CharacterShoulderR],
  ["B_upperArm_R", CharacterUpperArmR],
  ["B_forearm_R", CharacterForearmR],
  ["B_hand_R", CharacterHandR],
  ["B_thigh_R", CharacterThighR],
  ["B_shin_R", CharacterShinR],
  ["B_foot_R", CharacterFootR],
  ["B_toe_R", CharacterToeR],
]);

export default class Character extends CharacterPart {
  public globalPosition: XYZ = {
    x: 0,
    y: 0,
    z: 0,
  };

  constructor(init: ModelInit = {}) {
    const bvhNode = parseBVH(toothlessDance);
    super({
      ...init,
      position: bvhNode.offset,
      bvhNode,
      bvhNodeModelMap,
    });
  }

  public tick(
    scene: Scene,
    deltaTime: number,
    initialModelViewMatrix: number[][] = mat4()
  ): void {
    if (this.bvhNode.frames.length > 0) {
      const frameCount = this.bvhNode.frames.length;
      const frameTime = this.bvhNode.frameTime;
      const totalDuration = frameCount * frameTime;
      this.animationTime = (this.animationTime + deltaTime) % totalDuration;

      const previousFrameIdx = Math.floor(this.animationTime / frameTime);
      const nextFrameIdx = Math.ceil(this.animationTime / frameTime);
      const interpolationFactor = (this.animationTime % frameTime) / frameTime;

      const previousFrame = this.bvhNode.frames[previousFrameIdx % frameCount];
      const nextFrame = this.bvhNode.frames[nextFrameIdx % frameCount];
      this.setFrameWithInterpolation(
        previousFrame,
        nextFrame,
        interpolationFactor
      );
      this.position = {
        x: this.position.x * 100,
        y: this.position.y * 100,
        z: this.position.z * 100,
      };
    }
    Model.prototype.tick.call(
      this,
      scene,
      deltaTime,
      mult(
        mult(initialModelViewMatrix, scalem(0.01, 0.01, 0.01)),
        translate(
          this.globalPosition.x,
          this.globalPosition.y,
          this.globalPosition.z
        )
      ) as number[][]
    );
  }
}
