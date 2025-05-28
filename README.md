# 2025S-Ajou-CG

## 1. System Overview

```
Scene
├── Camera
├── Light
├── Character
│   └── CharacterPart (Bone Hierarchy)
├── Floor
└── Trees
```

The main components are as follows:

- **Scene**: Manages the main rendering loop and all objects
- **Model**: Abstract class and hierarchy for 3D objects
- **Character**: BVH-based animated character
- **Shader**: WebGL shader management
- **Texture**: Texture management
- **ObjMesh**: .obj file parsing and mesh data management

---

## 2. Rendering System

### 2.1 Registration Process

- Before the rendering loop starts, `registerShaders()` is called to initialize and register all shader programs.
- `registerModels()` is then called to register all models' vertex, normal, and texture data into GPU buffers.
- At this stage, fragment and vertex shaders are registered, textures are created, and the vertex and normal data of all models are aggregated and registered for rendering.

### 2.2 Rendering Loop

- The `render()` method in `Scene.ts` manages the rendering loop.
- `requestAnimationFrame` is used to repeatedly call the loop in sync with the browser's refresh rate.
- On each frame, the `tick()` and `render()` methods of the camera, light, character, floor, trees, and all objects are called.

### 2.3 Model Rendering And Matrix Stacks

- Each model (a class inheriting from `Model`) is rendered via its `render(scene)` method.
- The vertex buffer index and length for each model are obtained using `getVertexInfo()`, and actual drawing is performed with `gl.drawArrays()`.
- Child models are rendered recursively, enabling hierarchical rendering.
- Matrix stacks are achieved through recursive function calls, allowing each model to inherit and accumulate transformation matrices from its parent.

### 2.4 Shader and Buffer Management

- `Shader.ts` is responsible for creating, compiling, and linking shader programs.
- In `registerModels()`, all models' vertex, normal, and texture coordinate data are flattened and stored in a single buffer.
- For each model, the starting index and length (`VertexInfo`) are managed, ensuring the correct vertex range is referenced during rendering.

### 2.5 Mesh Data Management

- The `objects.obj` file is parsed by `parseObjFile.ts`, creating an `ObjMesh` instance for each object name.
- Each mesh stores vertex, normal, texture coordinate, and face information, accessible via `getVertices()`, `getNormals()`, and `getTexcoords()`.
- Each bone, floor, and tree references its corresponding mesh data for rendering.

---

## 3. Animation System

### 3.1 BVH File Parsing

- The file `src/SceneCanvas/Model/Character/parseBVH.ts` parses BVH files to extract a hierarchical bone structure (`BVHNode`) and per-frame motion data (`BVHMotionFrame`).
- Each node contains a name, offset, child nodes, frame time, and an array of frames.
- The parsed data is converted into the character's bone structure and animation frames, enabling animation to be applied to each bone.

### 3.2 Character Bone Structure and Hierarchy

- The `CharacterPart` class (`CharacterPart.ts`) represents each bone (body part) and maps 1:1 to a BVH node.
- Each bone recursively creates its child bones, forming a tree structure.
- Each bone manages its own position, rotation, and animation time.

### 3.3 Animation Application and Interpolation

- The `CharacterPart.tick()` method updates the position and rotation of each bone by linearly interpolating BVH frame data based on the current animation time.
- Interpolation between the previous and next frame values creates smooth motion.
- The `tick()` method is called recursively for all bones, applying animation to the entire character.

### 3.4 Hierarchical Transformation

- In each bone's `tick()`, calling `super.tick()` passes the parent's model transformation matrix (`modelViewMatrix`) to its children.
- The `Model` class's `updateModelViewMatrix()` accumulates position, rotation, and scale transformations via matrix multiplication.
- This enables natural hierarchical transformations between parent and child bones.

## Development Environment Setup & Running Instructions

### 1. Install Bun

This project uses [Bun](https://bun.sh/).
After installation, restart your terminal or check if Bun is installed correctly:

```
bun --version
```

### 2. Install Dependencies

In the project root directory, run:

```
bun install
```

### 3. Run Development Server

Start the development server with:

```
bun dev
```

Open your browser and go to `http://localhost:5173` (or the address shown in your terminal) to view the web app.

For more details, see each script and the [Bun documentation](https://bun.sh/docs).

## Modeling

1. Edit `objects.blend` file with [Blender](https://www.blender.org/)
1. Export obj file to `src/SceneCanvas/Model/obj/objects.obj`. You can export obj file with `File > Export > Wavefront (.obj)`.
   - Scale: 10
   - Forward Axis: Y
   - Up Axis: Z
   - UV Coordinates: on
   - Normals: on
   - Triangulated Mesh: on
   - Apply Modifiers: on
   - ... off for else
