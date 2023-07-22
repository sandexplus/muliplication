interface Params {
  strokeColor: string,
  strokeWidth: number,
  fillColor: string,
  rotate: number,
  x: number,
  y: number,
  z?: number
}

export interface CircleParams extends Params {
  radius: number,
  startAngle: number,
  endAngle: number,
}

export interface RectParams extends Params {
  width: number
  height: number
}

export interface ImageParams {
  src: string
  x: number
  y: number
  z?: number
  rotate: number
  width: number
  height: number
}

export interface Element {
  id: string,
  draw: () => Promise<void>
  params: any
  animate: (params: Partial<RectParams>, duration?: number, callback?: () => void) => void
  animationQueue: any[]
}
