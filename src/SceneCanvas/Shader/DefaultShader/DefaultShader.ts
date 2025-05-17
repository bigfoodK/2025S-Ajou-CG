import type { Scene } from "../../Scene";
import VertexShader from "./DefaultShader.vs?raw";
import FragmentShader from "./DefaultShader.fs?raw";
import Shader from "../Shader";

export default class DefaultShader extends Shader {
  constructor() {
    super();
  }

  public register(scene: Scene) {
    return super.register(scene, VertexShader, FragmentShader);
  }

  public setLightingUniforms(
    scene: Scene,
    lightingUniforms: {
      ambientProduct?: [number, number, number, number];
      diffuseProduct?: [number, number, number, number];
      specularProduct?: [number, number, number, number];
      shininess?: number;
      lightPosition?: [number, number, number, number];
    }
  ) {
    const gl = scene.gl;
    const {
      ambientProduct,
      diffuseProduct,
      specularProduct,
      shininess,
      lightPosition,
    } = lightingUniforms;

    if (ambientProduct) {
      const loc = scene.getUniformLocation("ambientProduct");
      gl.uniform4fv(loc, ambientProduct);
    }
    if (diffuseProduct) {
      const loc = scene.getUniformLocation("diffuseProduct");
      gl.uniform4fv(loc, diffuseProduct);
    }
    if (specularProduct) {
      const loc = scene.getUniformLocation("specularProduct");
      gl.uniform4fv(loc, specularProduct);
    }
    if (shininess !== undefined) {
      const loc = scene.getUniformLocation("shininess");
      gl.uniform1f(loc, shininess);
    }
    if (lightPosition) {
      const loc = scene.getUniformLocation("lightPosition");
      gl.uniform4fv(loc, lightPosition);
    }

    return this;
  }
}
