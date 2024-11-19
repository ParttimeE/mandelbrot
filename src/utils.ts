export function enterFullscreen() {
  const element = document.documentElement; 
  if (!element.requestFullscreen) return; 
  element.requestFullscreen(); 
}

export function delay(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function doXTimesEveryYms(callback: () => any, Xtime: number, Ydelay: number, signal: AbortSignal) {
  for (let count = 0; count < Xtime && !signal.aborted; count++) {
    callback();
    await delay(Ydelay);
  } 
  return
}