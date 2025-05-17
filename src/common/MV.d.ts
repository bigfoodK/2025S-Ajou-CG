declare function radians(degrees: number): number;

declare function vec2(...args: number[]): [number, number];
declare function vec3(...args: number[]): [number, number, number];
declare function vec4(...args: number[]): [number, number, number, number];

declare function mat2(...args: number[]): number[][];
declare function mat3(...args: number[]): number[][];
declare function mat4(...args: number[]): number[][];

declare function equal(
  u: number[] | number[][],
  v: number[] | number[][]
): boolean;
declare function add(
  u: number[] | number[][],
  v: number[] | number[][]
): number[] | number[][];
declare function subtract(
  u: number[] | number[][],
  v: number[] | number[][]
): number[] | number[][];
declare function mult(
  u: number[] | number[][],
  v: number[] | number[][]
): number[] | number[][];

declare function translate(
  x: number | number[],
  y?: number,
  z?: number
): number[][];
declare function rotate(angle: number, axis: number[]): number[][];
declare function rotateX(theta: number): number[][];
declare function rotateY(theta: number): number[][];
declare function rotateZ(theta: number): number[][];
declare function scalem(
  x: number | number[],
  y?: number,
  z?: number
): number[][];

declare function lookAt(
  eye: [number, number, number],
  at: [number, number, number],
  up: [number, number, number]
): number[][];
declare function ortho(
  left: number,
  right: number,
  bottom: number,
  top: number,
  near: number,
  far: number
): number[][];
declare function perspective(
  fovy: number,
  aspect: number,
  near: number,
  far: number
): number[][];

declare function transpose(m: number[][]): number[][];
declare function dot(u: number[], v: number[]): number;
declare function negate(u: number[]): number[];
declare function cross(
  u: [number, number, number],
  v: [number, number, number]
): [number, number, number];
declare function length(u: number[]): number;
declare function normalize(
  u: number[],
  excludeLastComponent?: boolean
): number[];
declare function mix(u: number[], v: number[], s: number): number[];

declare function scale(s: number, u: number[]): number[];
declare function flatten(v: number[] | number[][]): Float32Array;

declare const sizeof: {
  vec2: number;
  vec3: number;
  vec4: number;
  mat2: number;
  mat3: number;
  mat4: number;
};

declare function printm(m: number[][]): void;
declare function det(m: number[][]): number;
declare function inverse(m: number[][]): number[][];
declare function normalMatrix(
  m: number[][],
  flag?: boolean
): number[][] | number[][];
