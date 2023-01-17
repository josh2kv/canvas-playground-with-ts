import { ICoordinates, IMouse } from './types';
import { Rectangular } from './Square';
import { Circle } from './Circle';
import { Canvas } from './Canvas';
import { radianToRoundedDegree, degreeToRadian } from '../utils';

export class RotatingShape {
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;
  pivotPoint: Circle;
  shape: Rectangular;
  timerID: number | null = null;
  radianTheta: number = 0;
  mouse: IMouse;
  startAngle: number | null = null;
  endAngle: number | null = null;

  constructor() {
    this.canvas = new Canvas('canvas', { width: 600, height: 600 });
    this.ctx = this.canvas.ctx;
    this.pivotPoint = new Circle({ x: 300, y: 300 }, 5, this.ctx);
    this.shape = new Rectangular({ x: 300, y: 200 }, 100, 50, this.ctx);
    this.mouse = { x: 0, y: 0, isDragging: false, boundBox: null };
  }

  init(): void {
    this.pivotPoint.draw();
    this.shape.draw();
    ['down', 'up', 'move'].forEach(name => {
      this.canvas.canvas.addEventListener(
        `mouse${name}`,
        this.setMouse.bind(this)
      );
    });
  }

  setMouse(e: MouseEvent) {
    const boundBox = this.canvas.canvas.getBoundingClientRect() as DOMRect;
    // this.mouse.x = e.pageX - this.mouse.boundBox.left - window.scrollY;
    // this.mouse.y = e.pageY - this.mouse.boundBox.top - window.scrollX;
    this.mouse.x = e.clientX - boundBox.left;
    this.mouse.y = e.clientY - boundBox.top;
    this.mouse.isDragging =
      e.type === 'mousedown'
        ? true
        : e.type === 'mouseup'
        ? false
        : this.mouse.isDragging;
    if (e.type === 'mousemove') this.update();
  }

  update(): void {
    if (!this.mouse.isDragging) return;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.globalAlpha = 1;
    this.ctx.clearRect(
      0,
      0,
      this.canvas.canvas.width,
      this.canvas.canvas.height
    );

    this.pivotPoint.draw();
    this.rotateShapeAroundPivot();
    this.startAnimation();
  }

  rotateShapeAroundPivot(): void {
    const dx = this.mouse.x - this.pivotPoint.center.x;
    console.log(
      '🚀 > M.x - P.x = dx',
      this.mouse.x,
      '-',
      this.pivotPoint.center.x,
      '=',
      dx
    );
    const dy = this.mouse.y - this.pivotPoint.center.y;
    console.log(
      '🚀 > M.y - P.y = dy',
      this.mouse.y,
      '-',
      this.pivotPoint.center.y,
      '=',
      dy
    );

    if (this.startAngle === null) {
      this.startAngle = Math.atan2(dy, dx);
    }

    this.endAngle = Math.atan2(dy, dx);
    const deltaAngle = this.endAngle - this.startAngle;
    // if (this.radianTheta < 0) {
    //   this.radianTheta = this.radianTheta + Math.PI * 2;
    // }
    console.log('degree: ', radianToRoundedDegree(deltaAngle));
    // console.log('🚀 > this.ctx.getTransform()', this.ctx.getTransform());

    // this.rotateShape();
    this.rotateAbout(deltaAngle);
    console.log('🚀 > this.shape.center', this.shape.center);

    // position(
    //   this.ctx,
    //   this.pivotPoint.center.x,
    //   this.pivotPoint.center.y,
    //   1,
    //   1,
    //   this.radianTheta
    // );
    // function position(
    //   ctx: CanvasRenderingContext2D,
    //   x: number,
    //   y: number,
    //   scaleX: number,
    //   scaleY: number,
    //   rotation: number
    // ) {
    //   var scaleRatio = scaleY / scaleX;
    //   var rx = Math.cos(rotation) * scaleX;
    //   var ry = Math.sin(rotation) * scaleX;
    //   ctx.setTransform(rx, ry, -ry * scaleRatio, rx * scaleRatio, x, y);
    // }
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

    // pivot point에서 0도로 하고 싶은 직선의 점 중에 하나를 shape의 중점으로 해야함
    this.shape.center = { x: 300, y: 200 };
    this.shape.draw();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  rotateAbout(deltaAngle: number): void {
    const pivotX = this.pivotPoint.center.x;
    const pivotY = this.pivotPoint.center.y;
    const cosineTheta = Math.cos(-deltaAngle);
    const sinTheta = Math.sin(-deltaAngle);
    this.ctx.transform(
      cosineTheta,
      -sinTheta,
      sinTheta,
      cosineTheta,
      -pivotX * cosineTheta - pivotY * sinTheta + pivotX,
      pivotX * sinTheta - pivotY * cosineTheta + pivotY
    );
    this.shape.center = { x: 300, y: 200 };
    this.shape.draw();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    console.log('🚀 > this.ctx.getTransform()', this.ctx.getTransform());

    // this.shape.center = { x: this.mouse.x, y: this.mouse.y };
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
