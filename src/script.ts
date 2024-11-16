import { normalColorCalculation, getModuloColorCalculation, getColorFnWithBackground } from "./colorFn";
import { initialMandelbrotParams } from "./data";
import { MandelbrotParams} from "./mandelbrot";
import { calculateAndDrawMandelbrot, createCanvas, zoomAndDrawMandelbrot } from "./mandelbrotUI";
import { delay, doXTimesEveryYms, enterFullscreen } from "./utils";

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
let currentMaxInterations = +maxIterations.value
let signal = controller.signal;
let currentZoomOptions = {factor: +zoomFactor.value,steps:+zoomSteps.value,delay: +zoomDelay.value}
let backgroundColor = {r: +backgroundRed.value, g:+backgroundGreen.value, b:+backgroundBlue.value}
let currentColorFunction = getColorFnWithBackground(normalColorCalculation)
let currentMandelbrot:MandelbrotParams = calculateAndDrawMandelbrot(canvas,
  {...initialMandelbrotParams,maxIterations:currentMaxInterations, getColorFn: currentColorFunction(backgroundColor), imageData: canvas.imageData, width:canvas.canvas.width, height: canvas.canvas.height})


//searching for smarter way
let waitingMandelBrot = new Promise<boolean>((r)=>{r(true)})
const pipeline =async (callback:any) =>{
  if(await waitingMandelBrot.then()){
    waitingMandelBrot = new Promise<boolean> ((resolve)=>{callback(); resolve(true)})
  }
}

function updateHtml(newMandelbrot: MandelbrotParams){
  currentMandelbrot = newMandelbrot
  return newMandelbrot
}

function changeMandelbrotParams(change: Record<string,any>| null){
  if(!currentMandelbrot) return
  const newParams: MandelbrotParams = {...currentMandelbrot,...change}
  pipeline(()=>updateHtml(calculateAndDrawMandelbrot(canvas,newParams)))
}

canvas.canvas.addEventListener('click', function(event) {
  const rect = canvas.canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  enterFullscreen()
  controller.abort()
  const zoomFN = ()=>pipeline(()=>updateHtml(zoomAndDrawMandelbrot({factor: currentZoomOptions.factor, xPosition:x, yPosition:y}, currentMandelbrot,canvas)))
  if(currentZoomOptions.steps == 1)
  {
  zoomFN()
  return
  }
  zoomFN()
  controller = new AbortController()
  signal = controller.signal
  doXTimesEveryYms(()=>pipeline(()=>updateHtml(zoomAndDrawMandelbrot({factor: currentZoomOptions.factor, xPosition:500, yPosition:500}, currentMandelbrot,canvas)))
  ,currentZoomOptions.steps-1, currentZoomOptions.delay,signal)
})

canvas.canvas?.addEventListener("contextmenu", (event: MouseEvent) => {
  event.preventDefault(); 
  const reversedZoomFactor = 1/currentZoomOptions.factor
  controller.abort()
  if(currentZoomOptions.steps == 1)
  {
    pipeline(()=>updateHtml(zoomAndDrawMandelbrot({factor: reversedZoomFactor, xPosition:500, yPosition:500}, currentMandelbrot,canvas)))
  }
  controller = new AbortController()
  signal = controller.signal
  doXTimesEveryYms(()=>pipeline(()=>updateHtml(zoomAndDrawMandelbrot({factor: reversedZoomFactor , xPosition:500, yPosition:500}, currentMandelbrot,canvas)))
  ,currentZoomOptions.steps-1, currentZoomOptions.delay,signal)
})

maxIterations?.addEventListener("input", (event) => {
  const target = event.target as HTMLInputElement;
  if (!target || !target.value) return;
  changeMandelbrotParams({ maxIterations: +target.value });
})

const updateZoomOptions = (event:any) => {
  const target = event.target as HTMLInputElement;
  if (!target || !target.value) return;
  currentZoomOptions = {factor: +zoomFactor.value,steps:+zoomSteps.value,delay: +zoomDelay.value}
}

activateModuloColor?.addEventListener('change', function() {
  if (activateModuloColor && activateModuloColor.checked) {
    currentColorFunction = getColorFnWithBackground(getModuloColorCalculation(+red.value,+blue.value,+green.value))
    changeMandelbrotParams({ getColorFn: currentColorFunction(backgroundColor)});
  } else {
    currentColorFunction = getColorFnWithBackground(normalColorCalculation)
    changeMandelbrotParams({getColorFn:currentColorFunction(backgroundColor)})
  }
});

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

zoomDelay.addEventListener("input",updateZoomOptions)
zoomSteps.addEventListener("input",updateZoomOptions)
zoomFactor.addEventListener("input",updateZoomOptions)