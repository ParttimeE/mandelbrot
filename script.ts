interface CanvasContext {
  mandelbrotCanvas: HTMLCanvasElement;
  zeichnungsKontext: CanvasRenderingContext2D;
}

interface KomplexeZahl {
  realTeil: number;
  imaginaerTeil: number;
}

interface MandelbrotParams {
  maxAnzahlIterationen: number;
  maxRealTeil: number;
  minRealTeil: number;
  maxImaginaerTeil: number;
  minImaginaerTeil: number;
}

interface MandelbrotInCanvas{
  parameter:MandelbrotParams,
  canvas:CanvasContext
}

function zoom(factor: number, parameter: MandelbrotParams, canvas: CanvasContext): any {
  const { maxAnzahlIterationen, maxRealTeil, minRealTeil, maxImaginaerTeil, minImaginaerTeil } = parameter;

  const middleReal = (minRealTeil + maxRealTeil) / 2;
  const middleImag = (minImaginaerTeil + maxImaginaerTeil) / 2;

  const deltaReal = (maxRealTeil - minRealTeil) / factor;
  const deltaImag = (maxImaginaerTeil - minImaginaerTeil) / factor;

  const newMinRealTeil = middleReal - deltaReal / 2;
  const newMaxRealTeil = middleReal + deltaReal / 2;
  const newMinImaginaerTeil = middleImag - deltaImag / 2;
  const newMaxImaginaerTeil = middleImag + deltaImag / 2;

  return zeichneMandelbrot({
    maxAnzahlIterationen,
    maxRealTeil: newMaxRealTeil,
    minRealTeil: newMinRealTeil,
    maxImaginaerTeil: newMaxImaginaerTeil,
    minImaginaerTeil: newMinImaginaerTeil
  }, canvas);
}


function berechneMandelbrot(c: KomplexeZahl, maxAnzahlIterationen: number): number {
  let z = { realTeil: 0, imaginaerTeil: 0 };
  let iterationen = 0;

  while (iterationen < maxAnzahlIterationen) {
    const neuerRealTeil = z.realTeil * z.realTeil - z.imaginaerTeil * z.imaginaerTeil + c.realTeil;
    const neuerImaginaerTeil = 2 * z.realTeil * z.imaginaerTeil + c.imaginaerTeil;

    z.realTeil = neuerRealTeil;
    z.imaginaerTeil = neuerImaginaerTeil;

    if (z.realTeil * z.realTeil + z.imaginaerTeil * z.imaginaerTeil > 2) {
      return iterationen;
    }

    iterationen++;
  }

  return maxAnzahlIterationen;
}


const getColor = (iterationen: number, maxAnzahlIterationen: number): string => {
  const farbeRatio = 1-(iterationen / maxAnzahlIterationen)

  if (iterationen === maxAnzahlIterationen) return '#000000';
  const color = Math.floor(255 *  farbeRatio)
  const rotWert = iterationen % 3 === 0 ?0:  color
  const gruenWert =iterationen % 8 === 0 ?0:  color 
  const blauWert = iterationen % 2 === 0 ?0: color
  return `rgb(${rotWert},${gruenWert},${blauWert})`;
}

function erstelleCanvas(width:number,heigth:number): CanvasContext {
  const mandelbrotCanvas: HTMLCanvasElement = document.createElement("canvas");
  const zeichnungsKontext = mandelbrotCanvas.getContext("2d")!; 
  mandelbrotCanvas.width = width;  
  mandelbrotCanvas.height = heigth; 
  document.body.appendChild(mandelbrotCanvas); 
  return { mandelbrotCanvas: mandelbrotCanvas, zeichnungsKontext: zeichnungsKontext };
}


function zeichneMandelbrot(parameter: MandelbrotParams, canvas: CanvasContext) {
  const { maxAnzahlIterationen, maxRealTeil, minRealTeil, maxImaginaerTeil, minImaginaerTeil } = parameter;

  const schrittBreite = (maxRealTeil - minRealTeil) / canvas.mandelbrotCanvas.width;
  const schrittHoehe = (maxImaginaerTeil - minImaginaerTeil) / canvas.mandelbrotCanvas.height;
  

  for (let xPixel = 0; xPixel < canvas.mandelbrotCanvas.width; xPixel++) {
    for (let yPixel = 0; yPixel < canvas.mandelbrotCanvas.height; yPixel++) {
      const realTeil = minRealTeil + xPixel * schrittBreite;
      const imaginaerTeil = minImaginaerTeil + yPixel * schrittHoehe;
      const komplexeZahl = { realTeil, imaginaerTeil };

      const iterationen = berechneMandelbrot(komplexeZahl, maxAnzahlIterationen);
      canvas.zeichnungsKontext.fillStyle = getColor(iterationen, maxAnzahlIterationen);
      canvas.zeichnungsKontext.fillRect(xPixel, yPixel, 1, 1);
    }
  }
  return { parameter: parameter, canvas: canvas };
}


const initialMandelbrotCanvas = zeichneMandelbrot({
  maxAnzahlIterationen: 100,
  maxRealTeil: 1,
  minRealTeil: -2,
  maxImaginaerTeil: 1.5,
  minImaginaerTeil: -1.5
}, erstelleCanvas(1000,1000));

function zoomXTimesByFactorY(x: number, y: number, mandelbrotCanvas: MandelbrotInCanvas) {
  if (x <= 0) return
  zoom(y, mandelbrotCanvas.parameter, mandelbrotCanvas.canvas)
    .then(() => delay(1000))
    .then(() => zoomXTimesByFactorY(x - 1, y, mandelbrotCanvas))
}

function delay(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const button = document.createElement("button")
button.addEventListener("click",()=>{
  zoomXTimesByFactorY(10,1.2,initialMandelbrotCanvas)
})
button.style.width = "200px"
button.style.height = "200px"

document.body.append(button)