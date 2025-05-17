import parseObjFile from "./parseObjFile";
import objText from "./objects.obj?raw";

export const modelObjectMeshMap = parseObjFile(objText);
