import type { XYZ } from "../Model";

export interface BVHNode {
  name: string;
  offset: XYZ;
  children: BVHNode[];
  frameTime: number;
  frames: BVHMotionFrame[];
}

export interface BVHMotionFrame {
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
}

export default function parseBVH(bvhText: string): BVHNode {
  const lines = bvhText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  let index = 0;

  interface NodeWithChannels {
    name: string;
    offset: number[];
    channels: string[];
    children: NodeWithChannels[];
    ref?: BVHNode;
  }

  function parseNode(name: string): NodeWithChannels {
    let offset: number[] = [];
    let channels: string[] = [];
    let children: NodeWithChannels[] = [];
    while (index < lines.length) {
      const line = lines[index];
      const keyword = line.split(/\s+/)[0];
      switch (keyword) {
        case "OFFSET": {
          offset = line.split(/\s+/).slice(1).map(Number);
          index++;
          break;
        }
        case "CHANNELS": {
          channels = line.split(/\s+/).slice(2);
          index++;
          break;
        }
        case "ROOT":
        case "JOINT": {
          const name = line.split(/\s+/)[1];
          index++;
          children.push(parseNode(name));
          break;
        }
        case "End": {
          const name = "End Site";
          index++;
          children.push(parseNode(name));
          break;
        }
        case "}": {
          index++;
          return { name, offset, channels, children };
        }
        case "{": {
          index++;
          // do nothing
          break;
        }
        default: {
          throw new Error(`BVH: Unexpected keyword "${keyword}"`);
        }
      }
    }
    return { name, offset, channels, children };
  }

  if (lines[index++] !== "HIERARCHY")
    throw new Error("BVH: HIERARCHY expected");
  const rootLine = lines[index++];
  if (!rootLine.startsWith("ROOT")) throw new Error("BVH: ROOT expected");
  const hierarchyWithChannels = parseNode(rootLine.split(/\s+/)[1]);

  while (index < lines.length && lines[index] !== "MOTION") index++;
  if (lines[index++] !== "MOTION") throw new Error("BVH: MOTION expected");
  const frames = parseInt(lines[index++].split(/\s+/)[1], 10);
  const frameTime = parseFloat(lines[index++].split(/\s+/)[2]) * 1000;
  const motion: number[][] = [];
  while (index < lines.length) {
    const frame = lines[index++].split(/\s+/).map(Number);
    if (frame.length > 0) motion.push(frame);
  }

  function collectNodes(node: NodeWithChannels, arr: NodeWithChannels[]) {
    arr.push(node);
    for (const child of node.children) {
      collectNodes(child, arr);
    }
  }
  const nodeList: NodeWithChannels[] = [];
  collectNodes(hierarchyWithChannels, nodeList);

  const channelCounts = nodeList.map((n) => n.channels.length);

  function toBVHNode(node: NodeWithChannels): BVHNode {
    const bvhNode: BVHNode = {
      name: node.name,
      offset: {
        x: node.offset[0] || 0,
        y: node.offset[1] || 0,
        z: node.offset[2] || 0,
      },
      children: node.children.map(toBVHNode),
      frameTime,
      frames: [],
    };
    node.ref = bvhNode;
    return bvhNode;
  }
  const rootNode = toBVHNode(hierarchyWithChannels);

  for (
    let frameIndex = 0, channelIndex = 0;
    frameIndex < nodeList.length;
    frameIndex++
  ) {
    const node = nodeList[frameIndex];
    const cnt = channelCounts[frameIndex];
    if (!node.ref) continue;
    node.ref.frames = [];
    for (let f = 0; f < frames; f++) {
      const values = motion[f].slice(channelIndex, channelIndex + cnt);
      const frame: BVHMotionFrame = {};
      for (let c = 0; c < node.channels.length; c++) {
        const ch = node.channels[c];
        const v = values[c];
        switch (ch) {
          case "Xposition":
            frame.positionX = v;
            break;
          case "Yposition":
            frame.positionY = v;
            break;
          case "Zposition":
            frame.positionZ = v;
            break;
          case "Xrotation":
            frame.rotationX = v;
            break;
          case "Yrotation":
            frame.rotationY = v;
            break;
          case "Zrotation":
            frame.rotationZ = v;
            break;
        }
      }
      node.ref.frames.push(frame);
    }
    channelIndex += cnt;
  }

  rootNode.frameTime = frameTime;

  return rootNode;
}
