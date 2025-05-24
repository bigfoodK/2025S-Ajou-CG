import type { Scene } from "../../Scene";
import { characterTextureMap } from "../../Texture/Character";
import type { ModelInit, XYZ } from "../Model";
import Model from "../Model";
import { modelObjectMeshMap } from "../obj/modelObjectMeshMap";
import type { BVHMotionFrame, BVHNode } from "./parseBVH";

export interface CharacterPartInit extends ModelInit {
  bvhNode: BVHNode;
  bvhNodeModelMap: Map<string, new (init: CharacterPartInit) => CharacterPart>;
}
export class CharacterPart extends Model {
  protected bvhNode: BVHNode;
  protected animationTime: number;
  public rotation: XYZ;

  constructor(init: CharacterPartInit) {
    super(init);
    this.bvhNode = init.bvhNode;
    this.animationTime = 0;
    this.rotation = {
      x: 0,
      y: 0,
      z: 0,
    };
    const children = this.bvhNode.children.map((child) => {
      const ChildClass = init.bvhNodeModelMap.get(child.name);
      if (!ChildClass) {
        console.warn(`No class found for ${child.name}`);
        return null;
      }
      return new ChildClass({
        position: child.offset,
        bvhNode: child,
        bvhNodeModelMap: init.bvhNodeModelMap,
      });
    });
    this.children = children.filter((child) => child !== null) as Model[];
  }

  public tick(
    scene: Scene,
    deltaTime: number,
    initialModelViewMatrix: number[][] = mat4()
  ) {
    if (this.bvhNode.frames.length > 0) {
      const frameCount = this.bvhNode.frames.length;
      const frameTime = this.bvhNode.frameTime;
      const totalDuration = frameCount * frameTime;
      this.animationTime = (this.animationTime + deltaTime) % totalDuration;

      const previousFrameIdx = Math.floor(this.animationTime / frameTime);
      const nextFrameIdx = Math.ceil(this.animationTime / frameTime);
      const interpolationFactor = (this.animationTime % frameTime) / frameTime;

      const previousFrame =
        this.bvhNode.frames[(frameCount + previousFrameIdx) % frameCount];
      const nextFrame =
        this.bvhNode.frames[(frameCount + nextFrameIdx) % frameCount];
      this.setFrameWithInterpolation(
        previousFrame,
        nextFrame,
        interpolationFactor
      );
    }
    super.tick(scene, deltaTime, initialModelViewMatrix);
  }

  public texture() {
    return characterTextureMap.get(this.constructor.name)!;
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
    this.children.forEach((child) => {
      child.render(scene);
    });
  }

  protected setFrameWithInterpolation(
    previousFrame: BVHMotionFrame,
    nextFrame: BVHMotionFrame,
    interpolationFactor: number
  ) {
    this.position = {
      x: previousFrame.positionX || this.position.x,
      y: previousFrame.positionY || this.position.y,
      z: previousFrame.positionZ || this.position.z,
    };

    if (
      previousFrame.rotationX !== undefined &&
      nextFrame.rotationX !== undefined
    ) {
      this.rotation.x =
        previousFrame.rotationX +
        interpolationFactor * (nextFrame.rotationX - previousFrame.rotationX);
    }
    if (
      previousFrame.rotationY !== undefined &&
      nextFrame.rotationY !== undefined
    ) {
      this.rotation.y =
        previousFrame.rotationY +
        interpolationFactor * (nextFrame.rotationY - previousFrame.rotationY);
    }
    if (
      previousFrame.rotationZ !== undefined &&
      nextFrame.rotationZ !== undefined
    ) {
      this.rotation.z =
        previousFrame.rotationZ +
        interpolationFactor * (nextFrame.rotationZ - previousFrame.rotationZ);
    }
  }
}
