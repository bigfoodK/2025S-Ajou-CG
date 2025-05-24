export interface ObjMeshFacePoint {
  vertexIndex: number;
  texcoordIndex: number;
  normalIndex: number;
}
export default class ObjMesh {
  private vertices: [number, number, number][];
  private normals: [number, number, number][];
  private texcoords: [number, number][];
  private faces: [ObjMeshFacePoint, ObjMeshFacePoint, ObjMeshFacePoint][];

  constructor(init: {
    vertices: [number, number, number][];
    normals: [number, number, number][];
    texcoords: [number, number][];
    faces: [ObjMeshFacePoint, ObjMeshFacePoint, ObjMeshFacePoint][];
  }) {
    this.vertices = init.vertices;
    this.normals = init.normals;
    this.texcoords = init.texcoords;
    this.faces = init.faces;
  }

  public getVertices(): number[][] {
    return this.faces.flatMap((face) => {
      return face.map((point) => {
        const vertex = this.vertices[point.vertexIndex];

        return vec4(vertex[0], vertex[1], vertex[2], 1);
      });
    });
  }
  public getNormals() {
    return this.faces.flatMap((face) => {
      return face.map((point) => {
        const normal = this.normals[point.normalIndex];
        return vec3(normal[0], normal[1], normal[2]);
      });
    });
  }
  public getTexcoords(): number[][] {
    return this.faces.flatMap((face) => {
      return face.map((point) => {
        const texcoord = this.texcoords[point.texcoordIndex];
        return texcoord ? [texcoord[0], texcoord[1]] : [0, 0];
      });
    });
  }
}
