import ObjMesh, { type ObjMeshFacePoint } from "./ObjMesh";

export default function parseObjFile(objText: string): Map<string, ObjMesh> {
  const lines = objText.split(/\r?\n/);
  let vertices: [number, number, number][] = [];
  let normals: [number, number, number][] = [];
  let texcoords: [number, number][] = [];
  let faces: ObjMesh["faces"] = [];
  let vertexOffset = 0;
  let normalOffset = 0;
  let texcoordOffset = 0;

  let currentObjectName = "";
  function createObjMesh() {
    if (currentObjectName === "") {
      return;
    }
    const mesh = new ObjMesh({
      vertices,
      normals,
      texcoords,
      faces,
    });
    vertexOffset += vertices.length;
    normalOffset += normals.length;
    texcoordOffset += texcoords.length;
    vertices = [];
    normals = [];
    texcoords = [];
    faces = [];
    meshes.set(currentObjectName, mesh);
  }

  const meshes = new Map<string, ObjMesh>();
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const type = trimmed.split(/\s+/)[0];
    switch (type) {
      case "#": {
        break;
      }
      case "o": {
        createObjMesh();
        const name = trimmed.substring(2).trim();
        currentObjectName = name;
        break;
      }
      case "s": {
        break;
      }
      case "v": {
        const [, x, y, z] = trimmed.split(/\s+/);
        vertices.push([parseFloat(x), parseFloat(y), parseFloat(z)]);
        break;
      }
      case "vn": {
        const [, x, y, z] = trimmed.split(/\s+/);
        normals.push([parseFloat(x), parseFloat(y), parseFloat(z)]);
        break;
      }
      case "vt": {
        const [, u, v] = trimmed.split(/\s+/);
        texcoords.push([parseFloat(u), parseFloat(v)]);
        break;
      }
      case "f": {
        const tokens = trimmed.slice(2).split(/\s+/);

        const face = [];
        for (const token of tokens) {
          const [vertex, vertexTexture, vertexNormal] = token.split("/");
          const vertexIndex = parseInt(vertex, 10) - 1 - vertexOffset;
          const texcoordIndex =
            parseInt(vertexTexture, 10) - 1 - texcoordOffset;
          const normalIndex = parseInt(vertexNormal, 10) - 1 - normalOffset;
          face.push({ vertexIndex, texcoordIndex, normalIndex });
        }
        if (face.length !== 3) {
          throw new Error("Only triangles are supported");
        }
        faces.push(
          face as [ObjMeshFacePoint, ObjMeshFacePoint, ObjMeshFacePoint]
        );
        break;
      }
      default:
        throw new Error(`Unknown line type: ${type}`);
    }
  }
  createObjMesh();

  return meshes;
}
