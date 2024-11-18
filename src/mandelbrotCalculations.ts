
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

  const middleReal = minRealPart + (maxRealPart - minRealPart) * (xPosition / width);
  const middleImag = minImaginaryPart + (maxImaginaryPart - minImaginaryPart) * (yPosition / height);

  const deltaReal = Math.abs(maxRealPart - minRealPart) / factor;
  const deltaImag = Math.abs(maxImaginaryPart - minImaginaryPart) / factor;

  const newMinRealPart = middleReal - deltaReal / 2;
  const newMaxRealPart = middleReal + deltaReal / 2;
  const newMinImaginaryPart = middleImag - deltaImag / 2;
  const newMaxImaginaryPart = middleImag + deltaImag / 2;

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
    for (let xPixel = 0; xPixel < width; xPixel++) {   
      const realPart = minRealPart + xPixel * stepWidth;
      const imaginaryPart = minImaginaryPart + yPixel * stepHeight;
      const complexNumber = calculations.new_complex_number(realPart,imaginaryPart)
      const iterations =  calculations.calculate_iterations_per_pixel(complexNumber, maxIterations); 
      const color = getColorFn(iterations, maxIterations);
      const pixelIndex = (yPixel * width + xPixel) * 4;
      pixels[pixelIndex] = color.r;
      pixels[pixelIndex + 1] = color.g;
      pixels[pixelIndex + 2] = color.b;
      pixels[pixelIndex + 3] = 255;
    }
  }

  return { ...parameter, imageData };
}