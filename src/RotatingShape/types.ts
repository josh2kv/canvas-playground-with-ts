export interface Coordinates {
  x: number;
  y: number;
}

export interface CanvasOptions {
  width: number;
  height: number;
}

export interface Mouse {
  x: number;
  y: number;
  button: boolean;
  boundBox: DOMRect | null;
}
