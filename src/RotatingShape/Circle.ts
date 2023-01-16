import { Coordinates } from './types';

export class Circle {
  #ctx;
  #radius;
  #fillColor = 'red';

  center;
  // #strokeColor;

  constructor(
    point: Coordinates,
    radius: number,
    ctx: CanvasRenderingContext2D
  ) {
    this.center = point;
    this.#radius = radius;
    this.#ctx = ctx;
  }

  draw() {
    this.#ctx.beginPath();
    this.#ctx.arc(this.center.x, this.center.y, this.#radius, 0, Math.PI * 2);
    this.#ctx.fillStyle = this.#fillColor;
    this.#ctx.fill();
  }
}
