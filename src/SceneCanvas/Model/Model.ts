import type { Scene } from "../Scene";

export default abstract class Model {
  public position: XYZ;
  public rotation?: XYZ;
  public scale?: XYZ;
  protected modelViewMatrix: number[][];
  protected children: Model[];

  constructor(init: ModelInit = {}) {
    this.position = init.position || { x: 0, y: 0, z: 0 };
    this.rotation = init.rotation;
    this.scale = init.scale;
    this.modelViewMatrix = mat4();
    this.children = [];
  }

  public addChild(child: Model) {
    this.children.push(child);
  }

  public abstract vertices(): number[][];

  public tick(
    scene: Scene,
    deltaTime: number,
    initialModelViewMatrix: number[][] = mat4()
  ) {
    this.updateModelViewMatrix(initialModelViewMatrix);
    this.children.forEach((child) => {
      child.tick(scene, deltaTime, this.modelViewMatrix);
    });
  }

  public abstract render(scene: Scene): void;

  protected getVertexInfo(scene: Scene): VertexInfo {
    const vertexInfo = scene
      .currentShader()
      .modelVertexInfo.get(this.constructor.name);
    if (!vertexInfo) {
      throw new Error("Vertex info not found");
    }
    return vertexInfo;
  }

  private updateModelViewMatrix(initialModelViewMatrix: number[][]) {
    let modelViewMatrix = mult(
      initialModelViewMatrix,
      translate(this.position.x, this.position.y, this.position.z)
    ) as number[][];

    if (this.rotation) {
      modelViewMatrix = mult(
        modelViewMatrix,
        rotateX(this.rotation.x)
      ) as number[][];
      modelViewMatrix = mult(
        modelViewMatrix,
        rotateY(this.rotation.y)
      ) as number[][];
      modelViewMatrix = mult(
        modelViewMatrix,
        rotateZ(this.rotation.z)
      ) as number[][];
    }

    if (this.scale) {
      const scaleMatrix = scalem(this.scale.x, this.scale.y, this.scale.z);
      modelViewMatrix = mult(this.modelViewMatrix, scaleMatrix) as number[][];
    }

    this.modelViewMatrix = modelViewMatrix;
  }
}

export type ModelInit = {
  position?: XYZ;
  rotation?: XYZ;
  scale?: XYZ;
  vertices?: number[][];
};

export type VertexInfo = {
  index: number;
  length: number;
};

export type XYZ = {
  x: number;
  y: number;
  z: number;
};
