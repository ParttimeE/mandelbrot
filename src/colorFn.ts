interface Color {
  r:number,
  g:number,
  b:number
}

const black = {r:0,g:0,b:0} as Color
export const getColorFn=(iterations: number,maxIterations:number, getBackgroundColor:(i:number,m:number)=>Color | null, getColor:(i:number,m:number)=>Color)=>{
  return getBackgroundColor(iterations,maxIterations) ?? getColor(iterations,maxIterations)
}

export const getColorFnWithBackground=(iterations: number,maxIterations:number, backgroundColor:Color, getColor:(i:number,m:number)=>Color)=>{
  return getColorFn(
    iterations,
    maxIterations,
    (i:number,m:number)=>
      {
        if (i === m) return backgroundColor as Color
        return null
      },
    getColor
  )
}


export const getNormalColorFn = (iterations: number, maxIterations: number, backgroundColor:Color): Color => {
  return getColorFnWithBackground(
    iterations,
    maxIterations,
    backgroundColor
    ,
    (i:number,m:number)=>{
      const colorRatio = 1 - (i / m);
      const color = Math.floor(255 * colorRatio);
      const redValue = color;
      const greenValue =color;
      const blueValue =color;
      return {r:redValue,g:greenValue,b:blueValue}
    }
  )
}


export const getColorWithModulo = (iterations: number, maxIterations:number, redDivider: number ,greenDivider: number,blueDivider: number,backgroundColor: Color): Color => {
  return getColorFnWithBackground(
    iterations,
    maxIterations,
    backgroundColor ?? black
    ,
    (i:number,m:number)=>
    {
      const colorRatio = 1-(i / m);
      const color = Math.floor((255 * colorRatio));
      const redValue = i % redDivider === 0 ? 0 : color;
      const greenValue = i % greenDivider === 0 ? 0 : color;
      const blueValue = i % blueDivider === 0 ? 0 : color;
      return {r:redValue,g:greenValue,b:blueValue}
    }
  )
}


export const getColorWithBaseFaktors = (iterations: number, maxIterations:number, redBaseValue: number ,greenBaseValue: number,blueBaseValue: number,backgroundColor: Color): Color => {
  return getColorFnWithBackground(
    iterations,
    maxIterations,
    backgroundColor ?? black
    ,
    (i:number,m:number)=>
    {
      const colorRatio = 1-(i / m);
      const redValue = colorRatio*redBaseValue;
      const greenValue = colorRatio*greenBaseValue;
      const blueValue = colorRatio*blueBaseValue ;
      return {r:redValue,g:greenValue,b:blueValue}
    }
  )
}