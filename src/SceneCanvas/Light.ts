export type LightingUniforms = {
  ambientProduct: [number, number, number, number];
  diffuseProduct: [number, number, number, number];
  specularProduct: [number, number, number, number];
  shininess: number;
  lightPosition: [number, number, number, number];
};

export default class Light {
  public ambientProduct: [number, number, number, number] = [0, 0, 0, 1];
  public diffuseProduct: [number, number, number, number] = [0, 0, 0, 1];
  public specularProduct: [number, number, number, number] = [0, 0, 0, 1];
  public shininess: number = 0;
  public lightPosition: [number, number, number, number] = [0, 0, 0, 1];

  constructor() {}

  public tick(timeProgress: number, viewMatrix: number[][] = mat4()) {
    this.ambientProduct = this.interpolateThreeColor(
      [0.1, 0.0, 0.2, 1],
      [0.7, 0.7, 0.7, 1],
      [0.2, 0.1, 0.0, 1],
      timeProgress
    );
    this.diffuseProduct = this.interpolateThreeColor(
      [0.05, 0.0, 0.3, 1],
      [0.9, 0.9, 0.9, 1],
      [0.3, 0.0, 0.05, 1],
      timeProgress
    );
    this.specularProduct = this.interpolateThreeColor(
      [0.0, 0.0, 0.0, 1],
      [1.0, 1.0, 1.0, 1],
      [0.1, 0.1, 0.2, 1],
      timeProgress
    );
    this.shininess = 1000 * (0.5 - Math.abs(timeProgress - 0.5));
    this.lightPosition = mult(viewMatrix, [
      10 * Math.cos(timeProgress * Math.PI),
      10 * Math.sin(timeProgress * Math.PI),
      1,
      1,
    ]) as [number, number, number, number];
  }

  private interpolateThreeColor(
    start: [number, number, number, number],
    middle: [number, number, number, number],
    end: [number, number, number, number],
    progress: number
  ): [number, number, number, number] {
    if (progress < 0.5) {
      const t = progress * 2;
      return [
        start[0] + (middle[0] - start[0]) * t,
        start[1] + (middle[1] - start[1]) * t,
        start[2] + (middle[2] - start[2]) * t,
        1,
      ];
    } else {
      const t = (progress - 0.5) * 2;
      return [
        middle[0] + (end[0] - middle[0]) * t,
        middle[1] + (end[1] - middle[1]) * t,
        middle[2] + (end[2] - middle[2]) * t,
        1,
      ];
    }
  }

  public getLightingUniforms(): LightingUniforms {
    return {
      ambientProduct: this.ambientProduct,
      diffuseProduct: this.diffuseProduct,
      specularProduct: this.specularProduct,
      shininess: this.shininess,
      lightPosition: this.lightPosition,
    };
  }
}
