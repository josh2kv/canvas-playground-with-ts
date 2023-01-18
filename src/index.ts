import '../css/index.css';

import { fabric } from 'fabric';

type transformMatrix = number[];
declare module 'fabric' {
  namespace fabric {
    //@ts-ignore

    interface ExtendedObject extends Object {
      pivotPoint?: fabric.Point;
      normalized?: number | null;
      inversionAngle?: number | null;
    }
    interface ExtendedTransform extends fabric.Transform {
      target: ExtendedObject;
    }

    interface ExtendedIEvent extends IEvent {
      target?: ExtendedObject | undefined;
    }
  }
}
// import {
//   Canvas,
//   IPoint,
//   IStaticCanvasOptions,
//   Point,
//   Polygon,
//   Object,
//   Transform,
//   IEvent,
// } from 'fabric/fabric-impl';

// document.getElementById('rotate').addEventListener('click', Rotate);

const canvas: fabric.Canvas = new fabric.Canvas('canvas', {
  width: 800,
  height: 800,
});

// create a polygon object
const points: fabric.IPoint[] = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 200,
    y: 0,
  },
  {
    x: 200,
    y: 100,
  },
  {
    x: 0,
    y: 100,
  },
  //   {
  //     x: 100,
  //     y: 200,
  //   },
];

const poly: fabric.Polygon = new fabric.Polygon(points, {
  left: 100,
  top: 100,
  fill: '#00000033',
  strokeWidth: 2,
  stroke: 'green',
  scaleX: 1,
  scaleY: 1,
  objectCaching: false,
  transparentCorners: false,
  cornerColor: 'blue',
});

// canvas.viewportTransform = [2, 0, 0, 2, 0, 0];
canvas.add(poly);
const mCanvas = canvas.viewportTransform as transformMatrix;
const mObject = poly.calcTransformMatrix() as transformMatrix;
const mTotal = fabric.util.multiplyTransformMatrices(
  mCanvas,
  mObject
) as transformMatrix;

console.log('🚀 > mCanvas', mCanvas);
console.log('🚀 > mObject', mObject);
console.log('🚀 > mTotal', mTotal);
// const mInverse = fabric.util.invertTransform(mTotal);
// console.log('🚀 > qrDecompose', fabric.util.qrDecompose(mObject));
// var pointInObjectPixels = fabric.util.transformPoint(pointClicked, mInverse);
// console.log('🚀 > pointInObjectPixels', pointInObjectPixels);

canvas.on('object:moving', handleObjectMove);
canvas.on('object:modified', handleObjectModified);

function handleObjectModified(e: fabric.ExtendedIEvent) {
  if (e.target?.inversionAngle) {
    e.target.inversionAngle = undefined;
  }
  console.log('🚀 > e.target.inversionAngle', e.target?.inversionAngle);
}

canvas.renderAll();

function centerPositionHandler(
  dim: { x: number; y: number },
  finalMatrix: transformMatrix,
  obj: fabric.ExtendedObject
): fabric.Point {
  const vpt = canvas.viewportTransform as transformMatrix;
  const center: fabric.Point = obj.getCenterPoint();
  //캔버스의 vpt에 따라 패닝값 + 줌비율 까지 곱해서 적용
  return obj.pivotPoint
    ? fabric.util.transformPoint(obj.pivotPoint, vpt)
    : fabric.util.transformPoint(center, vpt);
}

function actionHandler(
  e: MouseEvent,
  t: fabric.ExtendedTransform,
  x: number,
  y: number
): boolean {
  t.target.pivotPoint = new fabric.Point(x, y);
  t.target.normalized = null; //센터 포인트가 이동했을때마다 벡터 길이 새로 구해야해서 초기화
  //true 리턴해야 컨트롤러가 리렌더링됨(화면에서 움직임)
  return true;
}

function handleObjectMove(e: fabric.IEvent<MouseEvent>) {
  const vpt = canvas.viewportTransform as transformMatrix;
  //const {x,y}=fabric.util.transformPoint(e.pointer,vpt)
  const { x, y } = e.pointer as fabric.Point;
  rotationWithSnapping(e.e, e.transform as fabric.ExtendedTransform, x, y);
}

function rotationWithSnapping(
  eventData: MouseEvent,
  t: fabric.ExtendedTransform,
  x: number,
  y: number
) {
  console.log('🚀 > t', t);
  console.log('시작--------------------------------');
  const target = t.target;
  const vpt = target.canvas?.viewportTransform as transformMatrix;
  //pivotPoint = fabric.util.transformPoint(target.currentPosition,vpt) //target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY);
  target.snapAngle = 0;

  if (!target.normalized) {
    //처음 벡터 길이를 구할때는 마우스 포인터가 아닌 객체의 실제 중심을 기준으로 정해야함
    const center = target.getCenterPoint();
    const vx = target?.pivotPoint?.x ? center.x - target.pivotPoint.x : 0;
    const vy = target?.pivotPoint?.y ? center.y - target.pivotPoint.y : 0;

    const vector = Math.sqrt(vx ** 2 + vy ** 2);
    target.normalized = vector;
  }

  //중심점이 설정되지 않았다면 객체의 중심을 중점으로 설정하고 리턴
  if (!target.pivotPoint) {
    target.pivotPoint = target.getCenterPoint();
    return;
  }

  if (target.lockRotation) {
    return false;
  }

  // t.ex, t.ey: 드래그 시작시 마우스좌표
  // x, y: 드래그 중인 현재 마우스좌표
  // t.theta: 객체의 중심을 회전축으로 회전한 각도

  console.log('🚀 > (t.ex, t.ey)', Math.round(t.ex), Math.round(t.ey));
  console.log('🚀 > (x, y)', Math.round(x), Math.round(y));
  console.log('🚀 >  t.theta', Math.round(radianToDegree(t.theta)));

  var lastAngle = Math.atan2(
      t.ey - target.pivotPoint.y,
      t.ex - target.pivotPoint.x
    ),
    curAngle = Math.atan2(y - target.pivotPoint.y, x - target.pivotPoint.x),
    angle = fabric.util.radiansToDegrees(curAngle - lastAngle + t.theta),
    hasRotated = true;
  console.log(
    '🚀 > (lastAngle, curAngle)',
    radianToDegree(lastAngle),
    radianToDegree(curAngle)
  );
  console.log(
    '🚀 > target.snapAngle',
    Math.round(radianToDegree(target.snapAngle))
  );
  console.log('🚀 > angle', Math.round(angle));
  if (target.snapAngle > 0) {
    var snapAngle = target.snapAngle,
      snapThreshold = target.snapThreshold || snapAngle,
      rightAngleLocked = Math.ceil(angle / snapAngle) * snapAngle,
      leftAngleLocked = Math.round(angle / snapAngle) * snapAngle;
    if (Math.abs(angle - leftAngleLocked) < snapThreshold) {
      angle = leftAngleLocked;
    } else if (Math.abs(angle - rightAngleLocked) < snapThreshold) {
      angle = rightAngleLocked;
    }
  }
  // normalize angle to positive value
  if (angle < 0) {
    angle = 360 + angle;
  }
  angle %= 360;
  console.log('🚀 > angle', Math.round(angle));
  hasRotated = target.angle !== angle;
  target.angle = angle;

  //객체의 중심과 회전 점의 길이 계산
  //이때 객체의 벡터는 고정값이어야 해서 만약에 벡터가 없다면 초기화 하는식으로

  //const center=target.getCenterPoint()

  //*vpt[3]+vpt[4]
  const vx = x - target.pivotPoint.x;
  const vy = y - target.pivotPoint.y;
  const v = Math.sqrt(vx ** 2 + vy ** 2);
  const vector = target.normalized;
  // console.log('🚀 > 회전중심-커서', v);
  // console.log('🚀 > 회전중심-객체중심', vector);

  /*
      아래의 식이 대체 왜 이렇게 되어야하고, 동작하는건지 모르겠다
      다른 누가 알아내면 알아서 쓰셈
  */

  const currentX = target.pivotPoint.x + (vx / v) * vector;
  const currentY = target.pivotPoint.y + (vy / v) * vector;

  const beforePoint = new fabric.Point(currentX, currentY);
  console.log('🚀 > beforePoint', beforePoint);
  console.log('🚀 > target.pivotPoint', target.pivotPoint);

  if (!target.inversionAngle) {
    target.inversionAngle = getAngleBetween2Points(
      target.getCenterPoint(),
      new fabric.Point(x, y),
      target.pivotPoint
    );
    // target.inversionAngle = getAngleBetween2Points(
    //   new fabric.Point(x, y),
    //   target.getCenterPoint(),
    //   target.pivotPoint
    // );
  }

  console.log(
    '🚀 > %c invertAngle',
    'color: red',
    Math.round(radianToDegree(target.inversionAngle))
  );
  const afterPoint = fabric.util.rotatePoint(
    beforePoint,
    target.pivotPoint,
    target.inversionAngle
  );

  console.log('🚀 > afterPoint', afterPoint);
  //위의 currentXY는 회전점에서 정해진 길이만큼 떨어진 좌표인데 여기서 추가적으로 마우스 좌표값을 계산해줘야함
  //그니까  current 좌표 - 마우스를 클릭한 좌표 문제는 이 마우스 좌표를 어떻게 구하지?
  console.log(
    '🚀 >   target.getCenterPoint()',
    Math.round(target.getCenterPoint().x),
    Math.round(target.getCenterPoint().y)
  );
  console.log(
    '🚀 > (currentX, currentY)',
    Math.round(currentX),
    Math.round(currentY)
  );
  console.log(
    '🚀 > (vx / v) * vector',
    `${Math.round((vx / v) * vector)} = (${Math.round(vx)} / ${Math.round(
      v
    )}) * ${Math.round(vector)}`
  );
  console.log(
    '🚀 > (vy / v) * vector',
    `${Math.round((vy / v) * vector)} = (${Math.round(vy)} / ${Math.round(
      v
    )}) * ${Math.round(vector)}`
  );

  // console.log('🚀 > currentPoint', currentX, currentY);

  target.setPositionByOrigin(afterPoint, 'center', 'center');

  console.log('끝--------------------------------');

  return hasRotated;
}

poly.set({
  controls: {
    ...fabric.Object.prototype.controls,

    centerPoint: new fabric.Control({
      //render: renderIcon(cloneImg),
      // positionHandler: centerPositionHandler,
      // actionHandler: actionHandler,
      actionName: 'centerPoint',
      //cornerSize: 24
    }),
    pivotPoint: new fabric.Control({
      //render: renderIcon(cloneImg),
      positionHandler: centerPositionHandler,
      actionHandler: actionHandler,
      actionName: 'pivotPoint',
      //cornerSize: 24
    }),
  },
});

function radianToDegree(radian: number): number {
  return Math.round((radian / Math.PI) * 180);
}

function rotatePoint(
  point: fabric.Point,
  origin: fabric.Point,
  radians: number
): fabric.Point {
  const sinus = Math.sin(radians),
    cosinus = Math.cos(radians);
  const p = new fabric.Point(point.x - origin.x, point.y - origin.y);
  return new fabric.Point(
    p.x * cosinus - p.y * sinus,
    p.x * sinus + p.y * cosinus
  );
}

function getAngleBetween2Points(
  p0: fabric.Point,
  p1: fabric.Point,
  c: fabric.Point
): number {
  var p0c = Math.sqrt(Math.pow(c.x - p0.x, 2) + Math.pow(c.y - p0.y, 2)); // p0->c (b)
  var p1c = Math.sqrt(Math.pow(c.x - p1.x, 2) + Math.pow(c.y - p1.y, 2)); // p1->c (a)
  var p0p1 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)); // p0->p1 (c)
  return Math.acos((p1c * p1c + p0c * p0c - p0p1 * p0p1) / (2 * p1c * p0c));
}
