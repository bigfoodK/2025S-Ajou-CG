import type { Scene } from "../../Scene";
import type { ModelInit } from "../Model";
import Model from "../Model";
import { modelObjectMeshMap } from "../obj/modelObjectMeshMap";
import type { BVHNode } from "./parseBVH";

export interface CharacterPartInit extends ModelInit {
  bvhNode: BVHNode;
  animationStartedAt: number;
  bvhNodeModelMap: Map<string, new (init: CharacterPartInit) => CharacterPart>;
}
export class CharacterPart extends Model {
  private bvhNode: BVHNode;
  private animationStartedAt: number;

  constructor(init: CharacterPartInit) {
    super(init);
    this.bvhNode = init.bvhNode;
    this.animationStartedAt = init.animationStartedAt;
    const children = this.bvhNode.children.map((child) => {
      const ChildClass = init.bvhNodeModelMap.get(child.name);
      if (!ChildClass) {
        console.warn(`No class found for ${child.name}`);
        return null;
      }
      return new ChildClass({
        position: child.offset,
        bvhNode: child,
        animationStartedAt: this.animationStartedAt,
        bvhNodeModelMap: init.bvhNodeModelMap,
      });
    });
    this.children = children.filter((child) => child !== null) as Model[];
  }

  public vertices() {
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
    this.children.forEach((child) => {
      child.render(scene);
    });
  }
}
