export function enterFullscreen() {
  const element = document.documentElement; 
  if (!element.requestFullscreen) return; 
  element.requestFullscreen(); 
}

export function delay(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}