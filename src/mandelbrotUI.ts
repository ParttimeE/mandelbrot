import { calculateMandelbrot, CanvasContext, MandelbrotParams, zoom, ZoomParameter, } from "./mandelbrot";

export function createCanvas(width: number, height: number): CanvasContext {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  canvas.className = "canvas" 
  const drawingContext = canvas.getContext("2d")!;
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);
  const imagedata = drawingContext.createImageData(canvas.width,canvas.height)
  return { canvas: canvas, drawingContext: drawingContext, imageData: imagedata};
}

export function drawMandelbrot(canvas:CanvasContext, parameter: MandelbrotParams){
  canvas.drawingContext.putImageData(parameter.imageData, 0, 0);
  return parameter
}

export async function calculateAndDrawMandelbrot(canvas:CanvasContext, parameter: MandelbrotParams){
  const calculateteMandelBrot = calculateMandelbrot(parameter)
  return drawMandelbrot(canvas,calculateteMandelBrot)
}

export async function zoomAndDrawMandelbrot(zoomParameter:ZoomParameter, parameter: MandelbrotParams, canvas:CanvasContext,){
  const calculateteMandelBrot = zoom(zoomParameter,parameter)
  return drawMandelbrot(canvas,calculateteMandelBrot)
}