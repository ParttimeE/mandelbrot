interface CanvasContext {
  mandelbrotCanvas: HTMLCanvasElement;
  drawingContext: CanvasRenderingContext2D;
}

interface ComplexNumber {
  realPart: number;
  imaginaryPart: number;
}

export interface MandelbrotParams {
  maxIterations: number;
  maxRealPart: number;
  minRealPart: number;
  maxImaginaryPart: number;
  minImaginaryPart: number;
  getColorFn: (interations:number,maxIterations:number)=>{r:number,g:number,b:number}
}

export interface Mandelbrot {
  parameter: MandelbrotParams;
  canvas: CanvasContext;
}

interface ZoomParameter {
  factor: number,
  xPosition:number, 
  yPosition:number,
}

export function zoom(zoomParameter: ZoomParameter, parameter: MandelbrotParams, canvas: CanvasContext): any {
  const { maxIterations, maxRealPart, minRealPart, maxImaginaryPart, minImaginaryPart, getColorFn } = parameter;
  const { factor, xPosition, yPosition } = zoomParameter;

  if(factor == 0) return {parameter:parameter,canvas:canvas}
  const middleReal = minRealPart + (maxRealPart - minRealPart) * (xPosition / canvas.mandelbrotCanvas.width);
  const middleImag = minImaginaryPart + (maxImaginaryPart - minImaginaryPart) * (yPosition / canvas.mandelbrotCanvas.height);

  const deltaReal = Math.abs(maxRealPart - minRealPart) / factor;
  const deltaImag = Math.abs(maxImaginaryPart - minImaginaryPart) / factor;

  const newMinRealPart = middleReal - deltaReal / 2;
  const newMaxRealPart = middleReal + deltaReal / 2;
  const newMinImaginaryPart = middleImag - deltaImag / 2;
  const newMaxImaginaryPart = middleImag + deltaImag / 2;

  return drawMandelbrot({
    maxIterations,
    maxRealPart: newMaxRealPart,
    minRealPart: newMinRealPart,
    maxImaginaryPart: newMaxImaginaryPart,
    minImaginaryPart: newMinImaginaryPart,
    getColorFn: getColorFn
  }, canvas);
}



function calculateMandelbrot(c: ComplexNumber, maxIterations: number): number {
  let z = { realPart: 0, imaginaryPart: 0 };
  let iterations = 0;

  while (iterations < maxIterations) {
    const newRealPart = z.realPart * z.realPart - z.imaginaryPart * z.imaginaryPart + c.realPart;
    const newImaginaryPart = 2 * z.realPart * z.imaginaryPart + c.imaginaryPart;

    z.realPart = newRealPart;
    z.imaginaryPart = newImaginaryPart;

    if (z.realPart * z.realPart + z.imaginaryPart * z.imaginaryPart > 2) {
      return iterations;
    }

    iterations++;
  }

  return maxIterations;
}

export function createCanvas(width: number, height: number): CanvasContext {
  const mandelbrotCanvas: HTMLCanvasElement = document.createElement("canvas");
  mandelbrotCanvas.className = "canvas" 
  const drawingContext = mandelbrotCanvas.getContext("2d")!;
  mandelbrotCanvas.width = width;
  mandelbrotCanvas.height = height;
  document.body.appendChild(mandelbrotCanvas);
  return { mandelbrotCanvas: mandelbrotCanvas, drawingContext: drawingContext };
}

export function drawMandelbrot(parameter: MandelbrotParams, canvas: CanvasContext) {
  const { maxIterations, maxRealPart, minRealPart, maxImaginaryPart, minImaginaryPart, getColorFn } = parameter;
  const stepWidth = (maxRealPart - minRealPart) / canvas.mandelbrotCanvas.width;
  const stepHeight = (maxImaginaryPart - minImaginaryPart) / canvas.mandelbrotCanvas.height;
  const imageData = canvas.drawingContext.createImageData(canvas.mandelbrotCanvas.width, canvas.mandelbrotCanvas.height);
  const pixels = imageData.data;

  for (let yPixel = 0; yPixel < canvas.mandelbrotCanvas.width; yPixel += 1) {
    for (let xPixel = 0; xPixel < canvas.mandelbrotCanvas.height; xPixel += 1) {
      const realPart = minRealPart + xPixel * stepWidth;
      const imaginaryPart = minImaginaryPart + yPixel * stepHeight;
      const complexNumber = { realPart, imaginaryPart };

      const iterations = calculateMandelbrot(complexNumber, maxIterations);
      const color = getColorFn(iterations, maxIterations);
      const pixelIndex = (yPixel * canvas.mandelbrotCanvas.width + xPixel) * 4;
      pixels[pixelIndex] = color.r
      pixels[pixelIndex + 1] = color.g  
      pixels[pixelIndex + 2] = color.b  
      pixels[pixelIndex + 3] = 255; 
    }
  }

  canvas.drawingContext.putImageData(imageData, 0, 0);
  return { parameter: parameter, canvas: canvas };
}