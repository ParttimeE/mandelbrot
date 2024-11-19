
const calculations = await import('../calculations/pkg/calculations_bg.wasm');

export interface CanvasContext {
  canvas: HTMLCanvasElement;
  drawingContext: CanvasRenderingContext2D;
  imageData: ImageData;
}

export interface MandelbrotParams {
  maxIterations: number;
  maxRealPart: number;
  minRealPart: number;
  maxImaginaryPart: number;
  minImaginaryPart: number;
  height: number;
  width: number;
  imageData: ImageData;
  getColorFn: (iterations: number, maxIterations: number) => { r: number, g: number, b: number };
}

export interface Mandelbrot {
  parameter: MandelbrotParams;
  canvas: CanvasContext;
}

export interface ZoomParameter {
  factor: number;
  xPosition: number;
  yPosition: number;
}

export function zoom(zoomParameter: ZoomParameter, parameter: MandelbrotParams): MandelbrotParams {
  const { maxIterations, maxRealPart, minRealPart, maxImaginaryPart, minImaginaryPart, getColorFn, width, height } = parameter;
  const { factor, xPosition, yPosition } = zoomParameter;

  if (factor === 0) return parameter;

  const x = maxRealPart - minRealPart;
  const y = maxImaginaryPart - minImaginaryPart;
  const factorReciprocal = 1 / factor;
  
  const middleReal = minRealPart + x * (xPosition / width);
  const middleImag = minImaginaryPart + y * (yPosition / height);
  
  const deltaReal = (x * factorReciprocal) * 0.5;
  const deltaImag = (y * factorReciprocal) * 0.5;
  
  const newMinRealPart = middleReal - deltaReal;
  const newMaxRealPart = middleReal + deltaReal;
  const newMinImaginaryPart = middleImag - deltaImag;
  const newMaxImaginaryPart = middleImag + deltaImag;

  return calculateMandelbrot({
    ...parameter,
    maxIterations,
    maxRealPart: newMaxRealPart,
    minRealPart: newMinRealPart,
    maxImaginaryPart: newMaxImaginaryPart,
    minImaginaryPart: newMinImaginaryPart,
    getColorFn,
  });
}


export function calculateMandelbrot(parameter: MandelbrotParams): MandelbrotParams {
  const { maxIterations, maxRealPart, minRealPart, maxImaginaryPart, minImaginaryPart, getColorFn, width, height, imageData } = parameter;
  const stepWidth = (maxRealPart - minRealPart) / width;
  const stepHeight = (maxImaginaryPart - minImaginaryPart) / height;
  const pixels = imageData.data;

  for (let yPixel = 0; yPixel < height; yPixel++) {  
    const imaginaryPart = minImaginaryPart + yPixel * stepHeight;
    const yPixelIndex = yPixel * width * 4
    for (let xPixel = 0; xPixel < width; xPixel++) {  
      const realPart = minRealPart + xPixel * stepWidth;
      const iterations =  calculations.calculate_iterations_per_pixel(realPart,imaginaryPart, maxIterations); 
      const { r, g, b }  = getColorFn(iterations, maxIterations);
      const pixelIndex = yPixelIndex + xPixel*4 ;
      pixels[pixelIndex] = r;
      pixels[pixelIndex + 1] = g;
      pixels[pixelIndex + 2] = b;
      pixels[pixelIndex + 3] = 255;
    }
  }
  return { ...parameter, imageData };
}