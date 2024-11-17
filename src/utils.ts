export function enterFullscreen() {
  const element = document.documentElement; 
  if (!element.requestFullscreen) return; 
  element.requestFullscreen(); 
}

export function delay(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function doXTimesEveryYms(callback: () => any, Xtime: number, Ydelay: number, signal: AbortSignal) {
  if(Xtime == 0)return
  callback()
  await delay(Ydelay)
  if(!signal.aborted){
  doXTimesEveryYms(callback,Xtime-1,Ydelay,signal)}
}