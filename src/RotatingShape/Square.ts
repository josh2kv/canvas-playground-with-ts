import { Coordinates } from "./types";

export class Rectangular {
  #ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  #fillColor = "rgba(0, 0, 111, .3)";

  _center: Coordinates;

  constructor(
    point: Coordinates,
    width: number,
    height: number,
    ctx: CanvasRenderingContext2D
  ) {
    this._center = point;
    this.width = width;
    this.height = height;
    this.#ctx = ctx;
  }

  draw() {
    const halfOfWidth = this.width / 2;
    const halfOfHeight = this.height / 2;
    this.#ctx.beginPath();
    this.#ctx.moveTo(this.center.x - halfOfWidth, this.center.y - halfOfHeight);
    this.#ctx.lineTo(this.center.x + halfOfWidth, this.center.y - halfOfHeight);
    this.#ctx.lineTo(this.center.x + halfOfWidth, this.center.y + halfOfHeight);
    this.#ctx.lineTo(this.center.x - halfOfWidth, this.center.y + halfOfHeight);
    this.#ctx.closePath();
    this.#ctx.fillStyle = this.#fillColor;
    this.#ctx.fill();
    this.indicateTop();
  }

  indicateTop() {
    this.#ctx.beginPath();
    this.#ctx.arc(
      this.center.x,
      this.center.y - this.height / 2,
      3,
      0,
      Math.PI * 2
    );
    this.#ctx.fillStyle = "orange";
    this.#ctx.fill();
  }

  get center(): Coordinates {
    return this._center;
  }

  set center(point: Coordinates) {
    this._center = point;
  }
}
