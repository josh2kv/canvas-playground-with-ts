import { CanvasOptions } from './types';

export class Canvas {
  canvas;
  ctx;

  constructor(id: string, options: CanvasOptions) {
    this.canvas = document.getElementById(id) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvas.width = options.width;
    this.canvas.height = options.height;
  }
}
