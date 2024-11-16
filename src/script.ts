import { normalColorCalculation, getModuloColorCalculation, getColorFnWithBackground } from "./colorFn";
import { initialMandelbrotParams } from "./data";
import { createCanvas, drawMandelbrot, Mandelbrot, MandelbrotParams, zoom } from "./mandelbrot";
import { doXTimesEveryYms, enterFullscreen } from "./utils";

const canvas = createCanvas(1000, 1000)
const red = document.getElementById("red") as HTMLInputElement
const green = document.getElementById("green") as HTMLInputElement
const blue = document.getElementById("blue") as HTMLInputElement
const backgroundRed = document.getElementById("backgroundRed") as HTMLInputElement
const backgroundGreen = document.getElementById("backgroundGreen") as HTMLInputElement
const backgroundBlue= document.getElementById("backgroundBlue") as HTMLInputElement
const maxIterations = document.getElementById("MaxInterations") as HTMLInputElement
const zoomFactor = document.getElementById("zoomFactor") as HTMLInputElement
const zoomSteps = document.getElementById("zoomSteps") as HTMLInputElement
const zoomDelay = document.getElementById("zoomDelay") as HTMLInputElement
const activateModuloColor = document.getElementById("activatModuloColor") as HTMLInputElement

let controller = new AbortController();
let signal = controller.signal;
let currentZoomFactor = 1.2
let currentZoomSteps = 1
let currentZoomDelay = 1000
let backgroundColor = {r: +backgroundRed.value, g:+backgroundGreen.value, b:+backgroundBlue.value}
let currentColorFunction = getColorFnWithBackground(normalColorCalculation)
let currentMandelbrot:Mandelbrot = drawMandelbrot({
  ...initialMandelbrotParams,
  getColorFn: currentColorFunction(backgroundColor)
}, canvas)
let waitingMandelBrot = new Promise<boolean>((r)=>{r(true)})

const pipeline =async (callback:any) =>{
  if(await waitingMandelBrot.then()){
    waitingMandelBrot = new Promise<boolean> ((resolve)=>{callback(); resolve(true)})
  }
}

function updateHtml(newMandelbrot: Mandelbrot){
  currentMandelbrot = newMandelbrot
  return newMandelbrot
}

function changeMandelbrotParams(change: Record<string,any>| null){
  if(!currentMandelbrot) return
  const newParams: MandelbrotParams = {...currentMandelbrot.parameter,...change}
  pipeline(()=>updateHtml(drawMandelbrot(newParams,canvas)))
}

updateHtml(currentMandelbrot)

canvas.mandelbrotCanvas.addEventListener('click', function(event) {
  const rect = canvas.mandelbrotCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  enterFullscreen()
  controller.abort()
  const zoomFN = ()=>pipeline(()=>updateHtml(zoom({factor: currentZoomFactor, xPosition:x, yPosition:y}, currentMandelbrot.parameter,currentMandelbrot.canvas)))
  if(currentZoomSteps == 1)
  {
  zoomFN()
  return
  }
  zoomFN()
  controller = new AbortController()
  signal = controller.signal
  doXTimesEveryYms(()=>pipeline(()=>updateHtml(zoom({factor: currentZoomFactor, xPosition:500, yPosition:500}, currentMandelbrot.parameter,currentMandelbrot.canvas)))
  ,currentZoomSteps-1, currentZoomDelay,signal)
})

maxIterations?.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;
    changeMandelbrotParams({ maxIterations: +target.value });
})

zoomFactor?.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;
    currentZoomFactor = (+target.value) 
})

zoomSteps?.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;
    currentZoomSteps = (+target.value) 
})

zoomDelay?.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;
    currentZoomDelay = (+target.value) 
})

activateModuloColor?.addEventListener('change', function() {
  if (activateModuloColor && activateModuloColor.checked) {
    currentColorFunction = getColorFnWithBackground(getModuloColorCalculation(+red.value,+blue.value,+green.value))
    changeMandelbrotParams({ getColorFn: currentColorFunction(backgroundColor)});
  } else {
    currentColorFunction = getColorFnWithBackground(normalColorCalculation)
    changeMandelbrotParams({getColorFn:currentColorFunction(backgroundColor)})
  }
});

canvas.mandelbrotCanvas?.addEventListener("contextmenu", (event: MouseEvent) => {
  event.preventDefault(); 
  const reversedZoomFactor = 1/currentZoomFactor
  controller.abort()
  if(currentZoomSteps == 1)
  {
    pipeline(()=>updateHtml(zoom({factor: reversedZoomFactor, xPosition:500, yPosition:500}, currentMandelbrot.parameter,currentMandelbrot.canvas)))
  }
  controller = new AbortController()
  signal = controller.signal
  doXTimesEveryYms(()=>pipeline(()=>updateHtml(zoom({factor: reversedZoomFactor , xPosition:500, yPosition:500}, currentMandelbrot.parameter,currentMandelbrot.canvas)))
  ,currentZoomSteps-1, currentZoomDelay,signal)
})

const handleKeyPress = (event:any) => {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;
    changeMandelbrotParams({
      getColorFn: getColorFnWithBackground(getModuloColorCalculation(+red.value, +green.value,+blue.value))(backgroundColor)
    });
}


const handleBackGroundColorChange = (event:any) => {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;
    backgroundColor = {r: +backgroundRed.value, g:+backgroundGreen.value, b:+backgroundBlue.value}
    changeMandelbrotParams({getColorFn:currentColorFunction(backgroundColor)})
};

red.addEventListener("input", handleKeyPress);
green.addEventListener("input", handleKeyPress);
blue.addEventListener("input", handleKeyPress);

backgroundRed.addEventListener("input", handleBackGroundColorChange);
backgroundBlue.addEventListener("input", handleBackGroundColorChange);
backgroundGreen.addEventListener("input", handleBackGroundColorChange);
