export class BasicClock {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private FONT_HEIGHT: number;
  private MARGIN: number;
  private HAND_TRUNCATION: number;
  private HOUR_HAND_TRUNCATION: number;
  private NUMERAL_SPACING: number;
  private RADIUS: number;
  private HAND_RADIUS: number;
  private intervalID: number | null = null;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.canvas.width = 300;
    this.canvas.height = 300;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.FONT_HEIGHT = 15;
    // canvas와 circle 사이 gap
    this.MARGIN = 40;
    this.HAND_TRUNCATION = this.canvas.width / 30;
    this.HOUR_HAND_TRUNCATION = this.canvas.width / 10;
    this.NUMERAL_SPACING = 20;
    this.RADIUS = this.canvas.width / 2 - this.MARGIN;
    this.HAND_RADIUS = this.RADIUS + this.NUMERAL_SPACING;

    this.init();
  }

  init() {
    this.context.font = this.FONT_HEIGHT + 'px Arial';
    this.intervalID = window.setInterval(this.drawClock.bind(this), 1000);
  }

  private drawClock() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawCircle();
    this.drawCenter();
    this.drawHands();
    this.drawNumerals();
  }

  private drawCircle() {
    this.context.beginPath();
    this.context.arc(
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.RADIUS,
      0,
      Math.PI * 2,
      true
    );
    this.context.stroke();
  }

  private drawNumerals() {
    const numerals: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let angle = 0;
    let numeralWidth = 0;

    numerals.forEach(numeral => {
      const strNumeral = numeral.toString();
      // arc의 시작점은 3시위치
      angle = (Math.PI / 6) * (numeral - 3);
      // 각 숫자의 글자너비를 측정함
      numeralWidth = this.context.measureText(strNumeral).width;
      // this.HAND_RADIUS = this.RADIUS(150 - 40) + this.NUMERAL_SPACING(20);
      // x = 0부터 중점.x의 거리 + 중점.x부터 글자left.x의 거리 - 글자left부터 글자 중점x의 거리
      // 중점.x부터 글자left.x의 거리(밑변)  = 중점부터 글자까지 직선거리(빗변) * cos(빗변과 밑변사이 각도)
      this.context.fillText(
        strNumeral,
        this.canvas.width / 2 +
          Math.cos(angle) * this.HAND_RADIUS -
          numeralWidth / 2,
        this.canvas.height / 2 +
          Math.sin(angle) * this.HAND_RADIUS +
          this.FONT_HEIGHT / 3
      );
    });
  }

  private drawCenter() {
    this.context.beginPath();
    this.context.arc(
      this.canvas.width / 2,
      this.canvas.height / 2,
      5,
      0,
      Math.PI * 2,
      true
    );
    this.context.fill();
  }

  private drawHand(loc: number, isHour: boolean) {
    const angle = Math.PI * 2 * (loc / 60) - Math.PI / 2;
    const handRadius = isHour
      ? this.RADIUS - this.HAND_TRUNCATION - this.HOUR_HAND_TRUNCATION
      : this.RADIUS - this.HAND_TRUNCATION;
    this.context.moveTo(this.canvas.width / 2, this.canvas.height / 2);
    this.context.lineTo(
      this.canvas.width / 2 + Math.cos(angle) * handRadius,
      this.canvas.height / 2 + Math.sin(angle) * handRadius
    );
    this.context.stroke();
  }

  private drawHands() {
    const date = new Date();
    let hour = date.getHours();
    hour = hour > 12 ? hour - 12 : hour;
    this.drawHand(hour * 5 + (date.getMinutes() / 60) * 5, true);
    this.drawHand(date.getMinutes(), false);
    this.drawHand(date.getSeconds(), false);
  }
}
