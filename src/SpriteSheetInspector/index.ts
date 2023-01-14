import './running-sprite-sheet.png';
import './styles.css';
import { addElement } from '../utils/addElement';

/**
 * Core HTML5 Canvas
 * Example 1.6 A sprite sheet inspector
 */

export class SpriteSheetInspector {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private readout: HTMLElement;
  private spriteSheet: HTMLImageElement;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.canvas.width = 600;
    this.canvas.height = 300;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.readout = addElement('p', 'readout', 'app');
    this.spriteSheet = new Image();
    this.canvas.addEventListener('mousemove', e => {
      const relativePoint = this.windowToCanvas(
        this.canvas,
        e.clientX,
        e.clientY
      );
      if (relativePoint.x < 0 || relativePoint.y < 0) return;

      this.drawBackground();
      this.drawSpriteSheet();
      this.drawGuidelines(relativePoint.x, relativePoint.y);
      this.updateReadout(relativePoint.x, relativePoint.y);
    });
    this.spriteSheet.src = require('./running-sprite-sheet.png');
    this.spriteSheet.addEventListener('load', e => {
      this.drawSpriteSheet();
    });
    this.drawBackground();
  }

  private windowToCanvas(
    canvas: HTMLCanvasElement,
    x: number,
    y: number
  ): { x: number; y: number } {
    //  canvas의 bounding box정보를 가져옴
    const boundingBox = canvas.getBoundingClientRect() as DOMRect;

    return {
      x: x - boundingBox.left - (boundingBox.width - this.canvas.width) / 2,
      y: y - boundingBox.top - (boundingBox.height - this.canvas.height) / 2,
      // x: x - boundingBox.left * (this.canvas.width / boundingBox.width),
      // y: y - boundingBox.top * (this.canvas.height / boundingBox.height),
    };
  }

  private drawBackground() {
    const VERTICAL_LINE_SPACING = 12;
    let i = this.context.canvas.height;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.strokeStyle = 'lightgray';
    this.context.lineWidth = 0.5;

    while (i > VERTICAL_LINE_SPACING * 5) {
      this.context.beginPath();
      this.context.moveTo(0, i);
      this.context.lineTo(this.context.canvas.width, i);
      this.context.stroke();
      i -= VERTICAL_LINE_SPACING;
    }
  }

  private drawSpriteSheet() {
    this.context.drawImage(this.spriteSheet, 0, 0);
  }

  private drawGuidelines(x: number, y: number) {
    this.context.strokeStyle = 'rgba(0, 0, 230, 0.8)';
    this.context.lineWidth = 0.5;
    this.drawVerticalLine(x);
    this.drawHorizontalLine(y);
  }

  private updateReadout(x: number, y: number) {
    this.readout.innerText = '(' + x.toFixed(0) + ', ' + y.toFixed(0) + ')';
  }

  private drawHorizontalLine(y: number) {
    this.context.beginPath();
    this.context.moveTo(0, y + 0.5);
    this.context.lineTo(this.context.canvas.width, y + 0.5);
    this.context.stroke();
  }
  private drawVerticalLine(x: number) {
    this.context.beginPath();
    this.context.moveTo(x + 0.5, 0);
    this.context.lineTo(x + 0.5, this.context.canvas.height);
    this.context.stroke();
  }
}
