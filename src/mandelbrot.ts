export interface CanvasContext {
  canvas: HTMLCanvasElement;
  drawingContext: CanvasRenderingContext2D;
  imageData: ImageData,

}

export interface ComplexNumber {
  realPart: number;
  imaginaryPart: number;
}

export interface MandelbrotParams {
  maxIterations: number;
  maxRealPart: number;
  minRealPart: number;
  maxImaginaryPart: number;
  minImaginaryPart: number;
  height: number,
  width: number,
  imageData: ImageData,
  getColorFn: (interations:number,maxIterations:number)=>{r:number,g:number,b:number}
}

export interface Mandelbrot {
  parameter: MandelbrotParams;
  canvas: CanvasContext;
}

export interface ZoomParameter {
  factor: number,
  xPosition:number, 
  yPosition:number,
}

export function zoom(zoomParameter: ZoomParameter, parameter: MandelbrotParams): MandelbrotParams {
  const { maxIterations, maxRealPart, minRealPart, maxImaginaryPart, minImaginaryPart, getColorFn,width,height} = parameter;
  const { factor, xPosition, yPosition } = zoomParameter;

  if(factor == 0) return parameter
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
    getColorFn: getColorFn
  })
}



function calculateInterationsPerPixel(c: ComplexNumber, maxIterations: number): number {
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

export function calculateMandelbrot(parameter: MandelbrotParams):MandelbrotParams {
  const { maxIterations, maxRealPart, minRealPart, maxImaginaryPart, minImaginaryPart, getColorFn,width,height,imageData} = parameter;
  const stepWidth = (maxRealPart - minRealPart) / width;
  const stepHeight = (maxImaginaryPart - minImaginaryPart) / height;
  const pixels= imageData.data

  for (let yPixel = 0; yPixel < width; yPixel += 1) {
    for (let xPixel = 0; xPixel < height; xPixel += 1) {
      const realPart = minRealPart + xPixel * stepWidth;
      const imaginaryPart = minImaginaryPart + yPixel * stepHeight;
      const complexNumber = { realPart, imaginaryPart };

      const iterations = calculateInterationsPerPixel(complexNumber, maxIterations);
      const color = getColorFn(iterations, maxIterations);
      const pixelIndex = (yPixel * width + xPixel) * 4;
      pixels[pixelIndex] = color.r
      pixels[pixelIndex + 1] = color.g  
      pixels[pixelIndex + 2] = color.b  
      pixels[pixelIndex + 3] = 255; 
    }
  }
  return {...parameter,imageData:imageData};
}