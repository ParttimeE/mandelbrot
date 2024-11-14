interface Color {
  r:number,
  g:number,
  b:number
}

export const getColorFnWithBackground=(colorCalculator:(i:number,m:number)=>Color)=>{
  return (backgroundColor:Color)=>{ return (i:number,m:number)=> {if (i === m) return backgroundColor; return colorCalculator(i,m)
}}}

export const normalColorCalculation = (i:number,m:number)=>{
    const colorRatio = 1 - (i / m);
    const color = Math.floor(255 * colorRatio);
    const redValue = color;
    const greenValue =color;
    const blueValue =color;
    return {r:redValue,g:greenValue,b:blueValue}
}

export const getModuloColorCalculation = (redDivider: number ,greenDivider: number,blueDivider: number) => {
  return (i:number,m:number)=>
  {
    const colorRatio = 1-(i / m);
    const color = Math.floor((255 * colorRatio));
    const redValue = i % redDivider === 0 ? 0 : color;
    const greenValue = i % greenDivider === 0 ? 0 : color;
    const blueValue = i % blueDivider === 0 ? 0 : color;
    return {r:redValue,g:greenValue,b:blueValue}
  }
}

export const getBaseFactorCalorCalculation = (redBaseValue: number ,greenBaseValue: number,blueBaseValue: number) => {
  return (i:number,m:number)=>
  {
    const colorRatio = 1-(i / m);
    const redValue = colorRatio*redBaseValue;
    const greenValue = colorRatio*greenBaseValue;
    const blueValue = colorRatio*blueBaseValue ;
    return {r:redValue,g:greenValue,b:blueValue}
  }
}