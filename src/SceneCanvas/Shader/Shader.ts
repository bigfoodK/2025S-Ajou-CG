import type { VertexInfo } from "../Model/Model";
import type Model from "../Model/Model";
import type { Scene } from "../Scene";

export default abstract class Shader {
  public modelVertexInfo: Map<string, VertexInfo> = new Map();
  public program: WebGLProgram | null = null;

  constructor() {}

  private getProgram(): WebGLProgram {
    if (!this.program) {
      throw new Error("Shader program is not registered");
    }
    return this.program;
  }

  public register(
    scene: Scene,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    const registeredShader = scene.shaders.get(this.constructor.name);
    if (registeredShader) {
      return registeredShader;
    }

    const gl = scene.gl;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) {
      throw new Error("Unable to create vertex shader");
    }
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(vertexShader);
      gl.deleteShader(vertexShader);
      throw new Error("Error compiling vertex shader: " + info);
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
      throw new Error("Unable to create fragment shader");
    }
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(fragmentShader);
      gl.deleteShader(fragmentShader);
      throw new Error("Error compiling fragment shader: " + info);
    }

    const program = gl.createProgram();
    if (!program) {
      throw new Error("Unable to create shader program");
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    this.program = program;

    scene.shaders.set(this.constructor.name, this);
    return this;
  }

  public registerModels(scene: Scene, models: Model[]): void {
    const vertices: number[][] = [];
    models.forEach((model) => {
      const modelVertices = model.vertices();
      const vertexInfo = {
        index: vertices.length,
        length: modelVertices.length,
      };
      this.modelVertexInfo.set(model.constructor.name, vertexInfo);
      vertices.push(...modelVertices);
    });

    const normals: number[][] = [];
    let normalIndex = 0;
    while (normalIndex < vertices.length) {
      const v1 = vertices[normalIndex];
      const v2 = vertices[normalIndex + 1];
      const v3 = vertices[normalIndex + 2];
      const u = subtract(v1, v2) as [number, number, number];
      const v = subtract(v3, v1) as [number, number, number];
      const normal = normalize(cross(u, v));
      normals.push(normal);
      normals.push(normal);
      normals.push(normal);
      normalIndex += 3;
    }

    const gl = scene.gl;
    gl.useProgram(this.getProgram());

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      throw new Error("Unable to create vertex buffer");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    const vPosition = gl.getAttribLocation(this.getProgram(), "vPosition");
    if (vPosition === -1) {
      throw new Error("Unable to get attribute location for vPosition");
    }
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    const normalBuffer = gl.createBuffer();
    if (!normalBuffer) {
      throw new Error("Unable to create normal buffer");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
    const vNormal = gl.getAttribLocation(this.getProgram(), "vNormal");
    if (vNormal === -1) {
      throw new Error("Unable to get attribute location for vNormal");
    }
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
  }

  public setModelViewMatrixUniform(scene: Scene, matrix: number[][]) {
    const modelViewMatrixLocation = scene.getUniformLocation("modelViewMatrix");
    scene.gl.uniformMatrix4fv(modelViewMatrixLocation, false, flatten(matrix));
    return this;
  }

  public setProjectionMatrixUniform(scene: Scene, matrix: number[][]) {
    const projectionMatrixLocation =
      scene.getUniformLocation("projectionMatrix");
    scene.gl.uniformMatrix4fv(projectionMatrixLocation, false, flatten(matrix));
    return this;
  }
}
