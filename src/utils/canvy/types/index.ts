export type FigureType = 'circle' | 'rect' | 'polygon' | 'text' | 'pie' | 'image'

export interface Params {
  strokeColor: string,
  strokeWidth: number,
  fillColor: string,
  rotate: number
}

export interface CircleParams extends Params {
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
}

export interface RectParams extends Params {
  x: number,
  y: number,
  width: number,
  height: number,
}

export interface PolyParams extends Params {
  vertex: [number, number][]
}

export interface PieParams extends Omit<CircleParams, 'fillColor'> {
  fillColors: string[],
  data: number[],
  hole: boolean,
  holeRadius: number,
  holeFillColor: string,
  holeStrokeColor: string,
  holeStrokeWidth: number
}

export interface TextParams extends Params {
  font: string,
  text: string,
  x: number,
  y: number,
  maxWidth?: number,
  variant: 'fill' | 'stroke'
  textAlign: 'start' | 'end' | 'left' | 'right' | 'center',
  direction: 'ltr' | 'rtl'
}

export interface ImageParams {
  src: string
  sourceX: number
  sourceY: number
  sourceWidth: number
  sourceHeight: number
  x: number
  y: number
  width: number
  height: number
  rotate: number
}

export interface Listener {
  handler: string,
  callback: (arg0: unknown) => void
}

export type FigureParams = CircleParams | RectParams | PolyParams | PieParams | TextParams | ImageParams

export interface AnimationOptions {
  params: Partial<FigureParams>
  startParams?: Partial<FigureParams>
  duration: number
}

export interface Element {
  name: string
  params: Partial<FigureParams>,
  listeners: Listener[],
  type: FigureType,
  animationQueue: AnimationOptions[],
  inCycle: boolean,
  element?: Path2D,
}

export interface Group {
  group: string
  elements: Element[]
}
