import { normalColorCalculation, getModuloColorCalculation, getColorFnWithBackground } from "./colorFn";
import { initialMandelbrotParams } from "./data";
import { createCanvas, drawMandelbrot, Mandelbrot, MandelbrotParams, zoom } from "./mandelbrot";
import { enterFullscreen } from "./utils";

const canvas = createCanvas(1000, 1000)
const red = document.getElementById("red") as HTMLInputElement
const green = document.getElementById("green") as HTMLInputElement
const blue = document.getElementById("blue") as HTMLInputElement
const backgroundRed = document.getElementById("backgroundRed") as HTMLInputElement
const backgroundGreen = document.getElementById("backgroundGreen") as HTMLInputElement
const backgroundBlue= document.getElementById("backgroundBlue") as HTMLInputElement
const maxIterations = document.getElementById("MaxInterations") as HTMLInputElement
const zoomFactor = document.getElementById("zoomFactor") as HTMLInputElement
const activateModuloColor = document.getElementById("activatModuloColor") as HTMLInputElement

let currentZoomFactor = 1.2
let backgroundColor = {r: +backgroundRed.value, g:+backgroundGreen.value, b:+backgroundBlue.value}
let currentColorFunction = getColorFnWithBackground(normalColorCalculation)
let currentMandelbrot:Mandelbrot = drawMandelbrot({
  ...initialMandelbrotParams,
  getColorFn: currentColorFunction(backgroundColor)
}, canvas)

function updateHtml(newMandelbrot: Mandelbrot){
  currentMandelbrot = newMandelbrot
  maxIterations.value = currentMandelbrot.parameter.maxIterations+""
  return newMandelbrot
}

function changeMandelbrotParams(change: Record<string,any>| null){
  if(!currentMandelbrot) return
  const newParams: MandelbrotParams = {...currentMandelbrot.parameter,...change}
  updateHtml(drawMandelbrot(newParams,canvas))
}

updateHtml(currentMandelbrot)

canvas.mandelbrotCanvas.addEventListener('click', function(event) {
  const rect = canvas.mandelbrotCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  enterFullscreen()
  updateHtml(zoom({factor: currentZoomFactor, xPosition:x, yPosition:y}, currentMandelbrot.parameter,currentMandelbrot.canvas))
})

canvas.mandelbrotCanvas.addEventListener('dblclick', function(event) {
  const rect = canvas.mandelbrotCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  enterFullscreen()
  updateHtml(zoom({factor: currentZoomFactor, xPosition:x, yPosition:y}, currentMandelbrot.parameter,currentMandelbrot.canvas))
})

maxIterations?.addEventListener("keypress", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;
    changeMandelbrotParams({ maxIterations: +target.value });
  }
})

zoomFactor?.addEventListener("keypress", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;
    currentZoomFactor = (+target.value) 
  }
})

activateModuloColor?.addEventListener('change', function() {
  if (activateModuloColor && activateModuloColor.checked) {
    currentColorFunction = getColorFnWithBackground(getModuloColorCalculation(+red.value,+blue.value,+green.value))
    console.log(backgroundColor)
    changeMandelbrotParams({ getColorFn: currentColorFunction(backgroundColor)});
  } else {
    currentColorFunction = getColorFnWithBackground(normalColorCalculation)
    changeMandelbrotParams({getColorFn:currentColorFunction(backgroundColor)})
  }
});

canvas.mandelbrotCanvas?.addEventListener("contextmenu", (event: MouseEvent) => {
  event.preventDefault(); 
  updateHtml(zoom({factor: 1/currentZoomFactor, xPosition:500, yPosition:500}, currentMandelbrot.parameter,currentMandelbrot.canvas))
})

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;
    changeMandelbrotParams({
      getColorFn: getColorFnWithBackground(getModuloColorCalculation(+red.value, +green.value,+blue.value))(backgroundColor)
    });
  }
};

const handleBackGroundColorChange = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;
    console.log(currentColorFunction)
    backgroundColor = {r: +backgroundRed.value, g:+backgroundGreen.value, b:+backgroundBlue.value}
    changeMandelbrotParams({getColorFn:currentColorFunction(backgroundColor)})
  }
};

red.addEventListener("keypress", handleKeyPress);
green.addEventListener("keypress", handleKeyPress);
blue.addEventListener("keypress", handleKeyPress);

backgroundRed.addEventListener("keypress", handleBackGroundColorChange);
backgroundBlue.addEventListener("keypress", handleBackGroundColorChange);
backgroundGreen.addEventListener("keypress", handleBackGroundColorChange);