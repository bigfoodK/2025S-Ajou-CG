import Camera from "./Camera";
import Light from "./Light";
import Character from "./Model/Character";
import Floor from "./Model/Floor";
import Tree from "./Model/Tree";
import DefaultShader from "./Shader/DefaultShader/DefaultShader";
import type Shader from "./Shader/Shader";
import type Texture from "./Texture/Texture";

export class Scene {
  public gl: WebGLRenderingContext;
  private shouldStopRendering: boolean = false;
  private lastRenderTime: number = 0;
  public shaders: Map<string, Shader> = new Map();
  private currentShaderName: string = "";
  public textures: Map<string, WebGLTexture> = new Map();
  public keyState: Map<string, boolean> = new Map();
  private camera: Camera = new Camera();
  private light: Light = new Light();
  private character: Character = new Character({
    position: { x: 0, y: 0, z: 0 },
  });
  private npcs: Character[] = createNpcs();
  private plane: Floor = new Floor();
  private trees: Tree[] = [];
  public cameraDistance: number;
  public cameraSensitivity: number;
  public timeProgress: number;

  constructor(
    canvas: HTMLCanvasElement,
    init: {
      cameraDistance: number;
      cameraSensitivity: number;
      timeProgress: number;
    }
  ) {
    this.gl = WebGLUtils.setupWebGL(canvas)!;
    this.cameraDistance = init.cameraDistance;
    this.cameraSensitivity = init.cameraSensitivity;
    this.timeProgress = init.timeProgress;

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
    this.camera.setTarget(this.character.getCameraTarget(this.cameraDistance));
    this.camera.tick(this, deltaTime);
    this.light.tick(this.timeProgress, this.camera.viewMatrix);
    this.character.moveWithKeyState(this, deltaTime);
    this.character.tick(this, deltaTime, this.camera.viewMatrix);
    this.npcs.forEach((npc) => {
      npc.tick(this, deltaTime, this.camera.viewMatrix);
    });
    this.plane.tick(this, deltaTime, this.camera.viewMatrix);
    this.trees.forEach((tree) => {
      tree.tick(this, deltaTime, this.camera.viewMatrix);
    });

    // Clear
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Render
    this.useShader(new DefaultShader())
      .setLightingUniforms(this, this.light.getLightingUniforms())
      .setProjectionMatrixUniform(this, this.camera.projectionMatrix);

    this.character.render(this);
    this.npcs.forEach((npc) => {
      npc.render(this);
    });
    this.plane.render(this);
    this.trees.forEach((tree) => {
      tree.render(this);
    });

    requestAnimationFrame(this.render.bind(this));
  }

  public async startRendering() {
    this.camera.setProjectionProperty();
    await this.registerShaders();
    this.trees = Array.from({ length: 50 }).map(
      () =>
        new Tree({
          position: {
            x: (Math.random() - 0.5) * 40,
            y: 0,
            z: (Math.random() - 0.5) * 40,
          },
          rotation: {
            x: 0,
            y: Math.random() * 360,
            z: 0,
          },
        })
    );
    this.render();
  }

  public stopRendering() {
    this.shouldStopRendering = true;
  }

  private async registerShaders() {
    await new DefaultShader()
      .register(this)
      .registerModels(this, [this.character, this.plane, new Tree()]);
  }

  public useShader<T extends Shader>(shader: T): T {
    const registeredShader = this.shaders.get(shader.constructor.name);
    if (!registeredShader) {
      throw new Error(`Shader ${shader.constructor.name} is not registered.`);
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

  public useTexture(texture: Texture): Scene {
    const registeredTexture = this.textures.get(texture.constructor.name);
    if (!registeredTexture) {
      throw new Error(`Texture ${texture.constructor.name} is not registered.`);
    }

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, registeredTexture);
    this.gl.uniform1i(this.getUniformLocation("texture"), 0);

    return this;
  }

  public handleMouseMove(props: { x: number; y: number }) {
    const { x, y } = props;
    if (x) {
      this.character.cameraRotate.y =
        (this.character.cameraRotate.y - x * this.cameraSensitivity) % 360;
    }
    if (y) {
      this.character.cameraRotate.x += y * this.cameraSensitivity;
      // Clamp the vertical rotation to prevent flipping
      this.character.cameraRotate.x = Math.max(
        -22.5,
        Math.min(22.5, this.character.cameraRotate.x)
      );
    }
  }

  public handleKeyDown(code: string) {
    this.keyState.set(code, true);
  }
  public handleKeyUp(code: string) {
    this.keyState.set(code, false);
  }
}

function createNpcs(): Character[] {
  return [
    [1, 2, -90],
    [2, 4, 190],
    [-2, -2, 30],
    [5, 5, 90],
    [5, -5, -90],
  ].map(([x, z, rotate]) => {
    const npc = new Character();
    npc.globalPosition = { x, y: 0, z };
    npc.cameraRotate = { x: 0, y: rotate };
    return npc;
  });
}
