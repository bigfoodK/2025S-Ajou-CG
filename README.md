# 2025S-Ajou-CG

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
