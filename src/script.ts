import { getNormalColorFn, getColorWithModulo } from "./colorFn";
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
const maxReal = document.getElementById("MaxReal") as HTMLInputElement
const minReal = document.getElementById("MinReal") as HTMLInputElement
const maxImg = document.getElementById("MaxImg") as HTMLInputElement
const minImg = document.getElementById("MinImg") as HTMLInputElement
const maxIterations = document.getElementById("MaxInterations") as HTMLInputElement
const zoomFactor = document.getElementById("zoomFactor") as HTMLInputElement
const activateModuloColor = document.getElementById("activatModuloColor") as HTMLInputElement
const mirrorCanvas = document.getElementById("mirrorCanvas")

let currentZoomFactor = 1.2
const getBackgroundColor =()=> {return {r: +backgroundRed.value, g:+backgroundGreen.value, b:+backgroundBlue.value}}
let currentMandelbrot:Mandelbrot = drawMandelbrot({
  ...initialMandelbrotParams,
  getColorFn: (interations:number, maxIterations:number)=>{ 
    return getNormalColorFn(
    interations,
    maxIterations,
    getBackgroundColor()
  )}
}, canvas)

function updateHtml(newMandelbrot: Mandelbrot){
  currentMandelbrot = newMandelbrot
  maxIterations.value = currentMandelbrot.parameter.maxIterations+""
  maxImg.value = currentMandelbrot.parameter.maxImaginaryPart+""
  minImg.value = currentMandelbrot.parameter.minImaginaryPart+""
  maxReal.value = currentMandelbrot.parameter.minRealPart+""
  minReal.value = currentMandelbrot.parameter.minRealPart+""
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

maxIterations?.addEventListener("keypress", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;
    changeMandelbrotParams({ maxIterations: target.value });
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
    red.value = 3+""
    blue.value = 9+""
    green.value = 7+""
    changeMandelbrotParams({ getColorFn: 
      (interations: number, maxIterations: number)=>{ return getColorWithModulo(interations,maxIterations,3,7,9, getBackgroundColor())}
    });
  } else {
    red.value = 0+""
    blue.value = 0+""
    green.value = 0+""
    changeMandelbrotParams({ getColorFn: (iterations: number, maxIterations: number) => {
      return getNormalColorFn(
        iterations,
        maxIterations,
        getBackgroundColor()
      );
    },});
  }
});

mirrorCanvas?.addEventListener("click",()=>{
  updateHtml(zoom({factor: -1*Math.sign(currentZoomFactor), xPosition:500, yPosition:500}, currentMandelbrot.parameter,currentMandelbrot.canvas))
  currentZoomFactor *= -1
})


canvas.mandelbrotCanvas?.addEventListener("contextmenu", (event: MouseEvent) => {
  event.preventDefault(); 
  updateHtml(zoom({factor: 1/currentZoomFactor, xPosition:500, yPosition:500}, currentMandelbrot.parameter,currentMandelbrot.canvas))
})

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;
    changeMandelbrotParams({
      getColorFn: (iterations: number, maxIterations: number) => {
        return getColorWithModulo(
          iterations,
          maxIterations,
          +red.value,
          +green.value,
          +blue.value,
          getBackgroundColor()
        );
      },
    });
  }
};

const handleBackGroundColorChange = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    const target = event.target as HTMLInputElement;
    if (!target || !target.value) return;
    changeMandelbrotParams(null)
  }
};

red.addEventListener("keypress", handleKeyPress);
green.addEventListener("keypress", handleKeyPress);
blue.addEventListener("keypress", handleKeyPress);

backgroundRed.addEventListener("keypress", handleBackGroundColorChange);
backgroundBlue.addEventListener("keypress", handleBackGroundColorChange);
backgroundGreen.addEventListener("keypress", handleBackGroundColorChange);