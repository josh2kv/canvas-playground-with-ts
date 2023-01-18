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
      centerPoint?: fabric.Point;
    }
    interface ExtendedTransform extends fabric.Transform {
      target: ExtendedObject;
    }

    interface ExtendedIEvent extends IEvent {
      target?: ExtendedObject;
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

canvas.on('object:moving', handleObjectMove);

poly.on('mousedown', (e: fabric.ExtendedIEvent) => {
  if (e.target) {
    e.target.centerPoint = e.target.getCenterPoint();
  }
});

canvas.renderAll();

function centerPositionHandler(
  dim: { x: number; y: number },
  finalMatrix: transformMatrix,
  obj: fabric.ExtendedObject
): fabric.Point {
  const vpt = canvas.viewportTransform as transformMatrix;
  const center: fabric.Point = obj.getCenterPoint();
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

  return true;
}

function handleObjectMove(e: fabric.IEvent<MouseEvent>) {
  const { x, y } = e.pointer as fabric.Point;
  rotateObjectWithSnapping(e.e, e.transform as fabric.ExtendedTransform, x, y);
}

function rotateObjectWithSnapping(eventData: any, t: any, x: any, y: any) {
  const { target, ex, ey, theta } = t;

  if (!target.pivotPoint) {
    target.pivotPoint = target.getCenterPoint();
    return;
  }

  const pivotPoint = target.pivotPoint;

  const lastAngle = Math.atan2(ey - pivotPoint.y, ex - pivotPoint.x);
  const curAngle = Math.atan2(y - pivotPoint.y, x - pivotPoint.x);
  let angle = fabric.util.radiansToDegrees(curAngle - lastAngle + theta);

  if (target.snapAngle && target.snapAngle > 0) {
    const snapAngle = target.snapAngle,
      snapThreshold = target.snapThreshold || snapAngle,
      rightAngleLocked = Math.ceil(angle / snapAngle) * snapAngle,
      leftAngleLocked = Math.floor(angle / snapAngle) * snapAngle;

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

  const hasRotated = target.angle !== angle;
  target.angle = angle;

  const afterPoint = fabric.util.rotatePoint(
    target.centerPoint,
    pivotPoint,
    curAngle - lastAngle
  );

  target.setPositionByOrigin(afterPoint, 'center', 'center');

  return hasRotated;
}

poly.set({
  controls: {
    ...fabric.Object.prototype.controls,
    centerPoint: new fabric.Control({
      actionName: 'centerPoint',
    }),
    pivotPoint: new fabric.Control({
      positionHandler: centerPositionHandler,
      actionHandler: actionHandler,
      actionName: 'pivotPoint',
    }),
  },
});
