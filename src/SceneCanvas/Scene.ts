import Camera from "./Camera";
import Character from "./Model/Character";
import DefaultShader from "./Shader/DefaultShader/DefaultShader";
import type Shader from "./Shader/Shader";

export class Scene {
  public gl: WebGLRenderingContext;
  private shouldStopRendering: boolean = false;
  private lastRenderTime: number = 0;
  public shaders: Map<string, Shader> = new Map();
  private camera: Camera = new Camera();
  private currentShaderName: string = "";
  private character: Character = new Character({
    position: { x: 0, y: 0, z: 0 },
  });

  constructor(canvas: HTMLCanvasElement) {
    this.gl = WebGLUtils.setupWebGL(canvas)!;

    if (!this.gl) {
      throw new Error(
        "Unable to initialize WebGL. Your browser may not support it."
      );
    }
    this.lastRenderTime = performance.now();
    this.initGl(canvas);
  }

  private initGl(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  private render() {
    if (this.shouldStopRendering) {
      return;
    }

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastRenderTime;
    this.lastRenderTime = currentTime;

    // Tick
    this.camera.tick(this, deltaTime);
    this.character.tick(this, deltaTime, this.camera.viewMatrix);

    // Clear
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Render
    // TODO: Move lighting to somewhere else
    const lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
    const lightDiffuse = vec4(1.0, 1.0, 0.0, 1.0);
    const lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

    const materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
    const materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
    const materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);

    const ambientProduct = mult(lightAmbient, materialAmbient) as [
      number,
      number,
      number,
      number
    ];
    const diffuseProduct = mult(lightDiffuse, materialDiffuse) as [
      number,
      number,
      number,
      number
    ];
    const specularProduct = mult(lightSpecular, materialSpecular) as [
      number,
      number,
      number,
      number
    ];
    this.useShader(new DefaultShader())
      .setLightingUniforms(this, {
        ambientProduct,
        diffuseProduct,
        specularProduct,
        shininess: 100.0,
        lightPosition: [0, 0, -4, 1],
      })
      .setProjectionMatrixUniform(this, this.camera.projectionMatrix);

    this.character.render(this);

    requestAnimationFrame(this.render.bind(this));
  }

  public startRendering() {
    this.camera.setProjectionProperty();
    this.registerShaders();
    this.render();
  }

  public stopRendering() {
    this.shouldStopRendering = true;
  }

  private registerShaders() {
    new DefaultShader().register(this).registerModels(this, [this.character]);
  }

  public useShader<T extends Shader>(shader: T): T {
    const registeredShader = this.shaders.get(shader.constructor.name);
    if (!registeredShader) {
      throw new Error(`Shader ${shader.constructor.name} is not registered.`);
    }

    if (shader.constructor.name === this.currentShaderName) {
      return registeredShader as T;
    }

    this.currentShaderName = shader.constructor.name;
    this.gl.useProgram(registeredShader.program);
    return registeredShader as T;
  }

  public getUniformLocation(uniformName: string) {
    const program = this.currentShader().program;
    if (!program) {
      throw new Error("No shader program is currently in use.");
    }
    const location = this.gl.getUniformLocation(program, uniformName as string);
    if (!location) {
      throw new Error(
        `Uniform ${uniformName as string} not found in shader program.`
      );
    }
    return location;
  }

  public currentShader() {
    const shader = this.shaders.get(this.currentShaderName);
    if (!shader) {
      throw new Error(`Shader ${this.currentShaderName} is not registered.`);
    }
    return shader;
  }
}
