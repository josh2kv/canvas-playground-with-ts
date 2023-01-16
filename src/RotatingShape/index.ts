import { Coordinates, Mouse } from "./types";
import { Rectangular } from "./Square";
import { Circle } from "./Circle";
import { Canvas } from "./Canvas";
import { radianToDegree, degreeToRadian } from '../utils';

export class RotatingShape {
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;
  pivotPoint: Circle;
  shape: Rectangular;
  timerID: number | null = null;
  radianTheta: number = 0;
  mouse: Mouse;

  constructor() {
    this.canvas = new Canvas("canvas", { width: 600, height: 600 });
    this.ctx = this.canvas.ctx;
    this.pivotPoint = new Circle({ x: 300, y: 300 }, 5, this.ctx);
    this.shape = new Rectangular({ x: 300, y: 200 }, 100, 50, this.ctx);
    this.mouse = { x: 0, y: 0, button: false, boundBox: null };
  }

  init(): void {
    this.pivotPoint.draw();
    this.shape.draw();
    ["down", "up", "move"].forEach(name => {
      this.canvas.canvas.addEventListener(
        `mouse${name}`,
        this.setMouse.bind(this)
      );
    });
  }

  setMouse(e: MouseEvent) {
    this.mouse.boundBox = this.canvas.canvas.getBoundingClientRect() as DOMRect;
    // this.mouse.x = e.pageX - this.mouse.boundBox.left - window.scrollY;
    // this.mouse.y = e.pageY - this.mouse.boundBox.top - window.scrollX;
    this.mouse.x = e.clientX - this.mouse.boundBox.left;
    this.mouse.y = e.clientY - this.mouse.boundBox.top;
    this.mouse.button =
      e.type === "mousedown"
        ? true
        : e.type === "mouseup"
        ? false
        : this.mouse.button;
    if (e.type === "mousemove") this.startAnimation();
  }

  update(): void {
    if (!this.mouse.button) return;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.globalAlpha = 1;
    this.ctx.clearRect(
      0,
      0,
      this.canvas.canvas.width,
      this.canvas.canvas.height
    );

    this.pivotPoint.draw();
    this.rotateAroundPivot();
    this.startAnimation();
  }

  rotateAroundPivot(): void {
    const dx = this.mouse.x - this.pivotPoint.center.x;
    console.log(
      "🚀 > M.x - P.x = dx",
      this.mouse.x,
      "-",
      this.pivotPoint.center.x,
      "=",
      dx
    );
    const dy = this.mouse.y - this.pivotPoint.center.y;
    console.log(
      "🚀 > M.y - P.y = dy",
      this.mouse.y,
      "-",
      this.pivotPoint.center.y,
      "=",
      dy
    );

    this.radianTheta = Math.atan2(dy, dx) ;
    // if (this.radianTheta < 0) {
    //   this.radianTheta = this.radianTheta + Math.PI * 2;
    // }
    console.log("degree: ", Math.floor(radianToDegree(this.radianTheta)));
    this.rotateShape();
  }

  rotateShape(): void {
    this.ctx.setTransform(
      1,
      0,
      0,
      1,
      this.pivotPoint.center.x,
      this.pivotPoint.center.y
    );
    this.ctx.rotate(this.radianTheta);

    // this.shape.center = { x: this.mouse.x, y: this.mouse.y };
    this.shape.center = { x: 100, y: 100 };
    this.shape.draw();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  startAnimation(): void {
    this.stopAnimation();

    this.timerID = requestAnimationFrame(this.update.bind(this));
  }

  stopAnimation(): void {
    if (!this.timerID) return;

    cancelAnimationFrame(this.timerID);
  }
}
