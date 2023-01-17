export interface ICoordinates {
  x: number;
  y: number;
}

export interface ICanvasOptions {
  width: number;
  height: number;
}

export interface IMouse {
  x: number;
  y: number;
  isDragging: boolean;
  boundBox: DOMRect | null;
}

export type TransformMatrix = [number, number, number, number, number, number];
