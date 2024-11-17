import { normalColorCalculation, getModuloColorCalculation, getColorFnWithBackground } from "./colorFn";
import { MandelbrotParams } from "./mandelbrot";
import { calculateAndDrawMandelbrot, createCanvas, zoomAndDrawMandelbrot } from "./mandelbrotUI";
import { doXTimesEveryYms, enterFullscreen } from "./utils";

// HTML Elements
const red = document.getElementById("red") as HTMLInputElement;
const green = document.getElementById("green") as HTMLInputElement;
const blue = document.getElementById("blue") as HTMLInputElement;
const backgroundRed = document.getElementById("backgroundRed") as HTMLInputElement;
const backgroundGreen = document.getElementById("backgroundGreen") as HTMLInputElement;
const backgroundBlue = document.getElementById("backgroundBlue") as HTMLInputElement;
const maxIterations = document.getElementById("MaxIterations") as HTMLInputElement;
const zoomFactor = document.getElementById("zoomFactor") as HTMLInputElement;
const zoomSteps = document.getElementById("zoomSteps") as HTMLInputElement;
const zoomDelay = document.getElementById("zoomDelay") as HTMLInputElement;
const activateModuloColor = document.getElementById("activateModuloColor") as HTMLInputElement;


// States
let controller: AbortController = new AbortController();
let signal: AbortSignal = controller.signal;
let currentMaxIterations: number = +maxIterations.value;
let currentZoomOptions = { factor: +zoomFactor.value, steps: +zoomSteps.value, delay: +zoomDelay.value };
let backgroundColor = { r: +backgroundRed.value, g: +backgroundGreen.value, b: +backgroundBlue.value };
let currentColorFunction = getColorFnWithBackground(normalColorCalculation);


// Initial Canvas Setup and controller
const canvas = createCanvas(1000, 1000);
const initialMandelbrot: MandelbrotParams = { 
  maxRealPart: 1,
  minRealPart: -2,
  maxImaginaryPart: 1.5,
  minImaginaryPart: -1.5,
  maxIterations: currentMaxIterations, 
  getColorFn: currentColorFunction(backgroundColor), 
  imageData: canvas.imageData, 
  width: canvas.canvas.width, 
  height: canvas.canvas.height
};
let waitingMandelbrot: Promise<MandelbrotParams> = calculateAndDrawMandelbrot(canvas, initialMandelbrot);

async function pipeline(callback: (parameter: MandelbrotParams) => Promise<MandelbrotParams>) {
  waitingMandelbrot = waitingMandelbrot.then((prefMandelbrot: MandelbrotParams) => { return callback(prefMandelbrot) });
}

async function changeMandelbrotParams(change: Record<string, any> | null) {
  pipeline((data: MandelbrotParams) => { return calculateAndDrawMandelbrot(canvas, { ...data, ...change }) });
}


// Event Listeners
function updateZoomOptions(event: any) {
  const target = event.target as HTMLInputElement;
  if (!target || !target.value) return;
  currentZoomOptions = { factor: +zoomFactor.value, steps: +zoomSteps.value, delay: +zoomDelay.value };
}

function updateModuloDivisors(event: any) {
  const target = event.target as HTMLInputElement;
  if (!target || !target.value) return;
  changeMandelbrotParams({
    getColorFn: getColorFnWithBackground(getModuloColorCalculation(+red.value, +green.value, +blue.value))(backgroundColor)
  });
}

function updateBackGroundColor(event: any) {
  const target = event.target as HTMLInputElement;
  if (!target || !target.value) return;
  backgroundColor = { r: +backgroundRed.value, g: +backgroundGreen.value, b: +backgroundBlue.value };
  changeMandelbrotParams({ getColorFn: currentColorFunction(backgroundColor) });
};

// Function to perform multiple zoom steps with delay
function multiZoom(zoomFactor: number): void {
  controller = new AbortController();
  signal = controller.signal;
  doXTimesEveryYms(() =>
    pipeline((mandelbrotParams: MandelbrotParams) => {
      return zoomAndDrawMandelbrot(
        { factor: zoomFactor, xPosition: 500, yPosition: 500 },
        mandelbrotParams,
        canvas
      );
    })
    , currentZoomOptions.steps - 1, 
    currentZoomOptions.delay,
    signal
  );
}

// Event listeners to update divisors for modulo coloring
red.addEventListener("input", updateModuloDivisors);
green.addEventListener("input", updateModuloDivisors);
blue.addEventListener("input", updateModuloDivisors);

// Event listeners to update background color
backgroundRed.addEventListener("input", updateBackGroundColor);
backgroundBlue.addEventListener("input", updateBackGroundColor);
backgroundGreen.addEventListener("input", updateBackGroundColor);

// Event listeners to update zoom options (factor, steps, and delay)
zoomDelay.addEventListener("input", updateZoomOptions);
zoomSteps.addEventListener("input", updateZoomOptions);
zoomFactor.addEventListener("input", updateZoomOptions);

// Event listener for left click to zoom in
canvas.canvas.addEventListener('click', function (event) {
  const rect = canvas.canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  enterFullscreen();
  controller.abort();
  pipeline((mandelbrotParams: MandelbrotParams) => { return zoomAndDrawMandelbrot({ factor: currentZoomOptions.factor, xPosition: x, yPosition: y }, mandelbrotParams, canvas) });
  if (currentZoomOptions.steps == 1) return;
  multiZoom(currentZoomOptions.factor);
});

// Event listener for right click to zoom out
canvas.canvas?.addEventListener("contextmenu", (event: MouseEvent) => {
  event.preventDefault();
  const reversedZoomFactor = 1 / currentZoomOptions.factor;
  controller.abort();
  pipeline((mandelbrotParams: MandelbrotParams) => { return zoomAndDrawMandelbrot({ factor: reversedZoomFactor, xPosition: 500, yPosition: 500 }, mandelbrotParams, canvas) });
  if (currentZoomOptions.steps == 1) return;
  multiZoom(reversedZoomFactor);
});

// Event listener to update the maximum iterations for rendering
maxIterations?.addEventListener("input", (event) => {
  const target = event.target as HTMLInputElement;
  if (!target || !target.value) return;
  changeMandelbrotParams({ maxIterations: +target.value });
});

// Event listener to toggle between normal and modulo coloring
activateModuloColor?.addEventListener('change', function () {
  if (activateModuloColor && activateModuloColor.checked) {
    currentColorFunction = getColorFnWithBackground(getModuloColorCalculation(+red.value, +blue.value, +green.value));
    changeMandelbrotParams({ getColorFn: currentColorFunction(backgroundColor) });
  } else {
    currentColorFunction = getColorFnWithBackground(normalColorCalculation);
    changeMandelbrotParams({ getColorFn: currentColorFunction(backgroundColor) });
  }
});