import { ICanvasOptions, TransformMatrix } from './types';

export class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(id: string, options: ICanvasOptions) {
    this.canvas = document.getElementById(id) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvas.width = options.width;
    this.canvas.height = options.height;
  }
}
