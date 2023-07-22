import {
  AnimationOptions,
  CircleParams,
  Element, FigureParams,
  ImageParams,
  Params,
  PieParams,
  PolyParams,
  RectParams,
  TextParams
} from '@/utils/canvy/types'

export default class Canvy {
  public canvas: {
    canvas: HTMLCanvasElement | null
    left: number
    top: number
    context: CanvasRenderingContext2D
  }

  public elements: Element[]

  constructor (element: HTMLCanvasElement | null | string) {
    this.canvas = {
      canvas: null,
      left: 0,
      top: 0,
      context: {} as CanvasRenderingContext2D
    }

    this.elements = []

    this.#init(element)
  }

  #init (element: HTMLCanvasElement | null | string) {
    if (!element) {
      this.#throwError('Please pass the element parameter')
      return
    }
    const canvas = typeof element === 'string' ? document.querySelector(element) as HTMLCanvasElement : element || null
    if (!canvas) this.#throwError('Can not find canvas element')

    this.canvas = {
      canvas,
      left: (canvas?.offsetLeft || 0) + (canvas?.clientLeft || 0),
      top: (canvas?.offsetTop || 0) + (canvas?.clientTop || 0),
      context: canvas?.getContext('2d') || {} as CanvasRenderingContext2D
    }
    this.elements = []
    this.#initListeners()
  }

  #throwError (errorText: string) {
    throw new Error(errorText)
  }

  #addFigure (figure: Element) {
    this.elements.push(figure)
  }

  // some figures

  drawCircle (name: string, params: Partial<CircleParams> = {} as CircleParams, isPiePart?: boolean) {
    if (
      this.elements.filter(item => item.name === name).length !== 0
    ) { this.#throwError(`Element with same name (${name}) already exists`) }

    const standardParams: CircleParams = {
      centerX: 15,
      centerY: 15,
      radius: 15,
      startAngle: this.#changeAngle(0),
      endAngle: this.#changeAngle(360),
      strokeColor: '#000000',
      strokeWidth: 1,
      fillColor: '#000000',
      rotate: 0
    }

    if (params.endAngle) {
      params.endAngle = this.#changeAngle(params.endAngle)
    }
    if (params.startAngle) {
      params.startAngle = this.#changeAngle(params.startAngle)
    }

    Object.assign(standardParams, params)

    this.elements.push({
      name, params: standardParams, listeners: [], type: isPiePart ? 'pie' : 'circle', animationQueue: [], inCycle: false
    })

    this.#draw()
  }

  drawRect (name: string, params: Partial<RectParams> = {} as RectParams) {
    if (
      this.elements.filter(item => item.name === name).length !== 0
    ) { this.#throwError(`Element with same name (${name}) already exists`) }

    const standardParams: RectParams = {
      x: 15,
      y: 15,
      width: 15,
      height: 15,
      strokeColor: '#000000',
      strokeWidth: 1,
      fillColor: '#000000',
      rotate: 0
    }

    Object.assign(standardParams, params)

    this.elements.push({
      name, params: standardParams, listeners: [], type: 'rect', animationQueue: [], inCycle: false
    })

    this.#draw()
  }

  drawPolygon (name: string, params: Partial<PolyParams> = {} as PolyParams) {
    if (
      this.elements.filter(item => item.name === name).length !== 0
    ) { this.#throwError(`Element with same name (${name}) already exists`) }

    const standardParams: PolyParams = {
      vertex: [
        [15, 15],
        [25, 25],
        [50, 50]
      ],
      strokeColor: '#000000',
      strokeWidth: 1,
      fillColor: '#000000',
      rotate: 0
    }

    Object.assign(standardParams, params)

    this.elements.push({
      name, params: standardParams, listeners: [], type: 'polygon', animationQueue: [], inCycle: false
    })

    this.#draw()
  }

  drawPie (namePrefix: string, params: Partial<PieParams> = {} as PieParams) {
    if (
      this.elements.filter(item => item.name.startsWith(namePrefix)).length !== 0
    ) { this.#throwError(`Element with same prefix (${namePrefix}) already exists`) }

    const standardParams: PieParams = {
      centerX: 300,
      centerY: 250,
      radius: 150,
      startAngle: this.#changeAngle(0),
      endAngle: this.#changeAngle(360),
      strokeColor: '#000000',
      strokeWidth: 1,
      fillColors: ['#ff0000', '#00ff00', '#0000ff'],
      data: [100, 200, 300],
      hole: true,
      holeRadius: 130,
      holeFillColor: '#ffffff',
      holeStrokeColor: '#ffffff',
      holeStrokeWidth: 0,
      rotate: 0
    }

    if (params.endAngle) {
      params.endAngle = this.#changeAngle(params.endAngle)
    }
    if (params.startAngle) {
      params.startAngle = this.#changeAngle(params.startAngle)
    }

    Object.assign(standardParams, params)

    let myTotal = 0
    let lastEnd = standardParams.startAngle

    for (let i = 0; i < standardParams.data.length; i++) {
      myTotal += standardParams.data[i]
    }

    for (let i = 0; i < standardParams.data.length; i++) {
      this.drawCircle(`${namePrefix}${i}`, {
        fillColor: standardParams.fillColors[i],
        radius: standardParams.radius,
        centerX: standardParams.centerX,
        centerY: standardParams.centerY,
        strokeWidth: standardParams.strokeWidth,
        strokeColor: standardParams.strokeColor,
        startAngle: lastEnd,
        endAngle: (standardParams.data[i] * 360 / myTotal) + lastEnd
      }, true)

      lastEnd += (standardParams.data[i] * 360 / myTotal)
    }

    if (standardParams.hole) {
      this.drawCircle(`${namePrefix}InnerHole`, {
        fillColor: standardParams.holeFillColor,
        radius: standardParams.holeRadius,
        centerX: standardParams.centerX,
        centerY: standardParams.centerY,
        strokeWidth: standardParams.holeStrokeWidth,
        strokeColor: standardParams.holeStrokeColor,
        startAngle: 0,
        endAngle: 360
      }, true)
    }
  }

  drawText (name: string, params: Partial<TextParams> = {} as TextParams) {
    if (
      this.elements.filter(item => item.name === name).length !== 0
    ) { this.#throwError(`Element with same name (${name}) already exists`) }

    const standardParams: TextParams = {
      fillColor: 'black',
      strokeColor: 'black',
      strokeWidth: 1,
      font: '16px serif',
      text: 'Hello world',
      x: 0,
      y: 0,
      variant: 'fill',
      textAlign: 'start',
      direction: 'ltr',
      rotate: 0
    }

    Object.assign(standardParams, params)

    this.#addFigure({
      name, params: standardParams, listeners: [], type: 'text', animationQueue: [], inCycle: false
    })

    this.#draw()
  }

  async #loadImage (src: string) {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = src
    })
  }

  async drawImage (name: string, params: Partial<ImageParams> = {} as ImageParams) {
    if (
      this.elements.filter(item => item.name === name).length !== 0
    ) { this.#throwError(`Element with same name (${name}) already exists`) }

    const standardParams: ImageParams = {
      src: '',
      sourceX: 0,
      sourceY: 0,
      sourceWidth: 0,
      sourceHeight: 0,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotate: 0
    }

    Object.assign(standardParams, params)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    standardParams.src = await this.#loadImage(standardParams.src)

    this.#addFigure({
      name, params: standardParams, listeners: [], type: 'image', animationQueue: [], inCycle: false
    })

    this.#draw()
  }

  remove (name: string) {
    const index = this.elements.findIndex(x => x.name === name)
    this.elements.splice(index, 1)

    this.#draw()
  }

  //

  // some technics

  #draw () {
    this.#clear()
    this.elements.forEach(item => {
      this.canvas.context.beginPath()
      const index = this.elements.findIndex(x => x.name === item.name)
      const figure = new Path2D()

      switch (item.type) {
        case 'rect': {
          const params: RectParams = item.params as RectParams
          figure.moveTo(params.x, params.y)
          figure.rect(
            params.x,
            params.y,
            params.width,
            params.height
          )
          break
        }
        case 'circle': {
          const params: CircleParams = item.params as CircleParams
          figure.arc(
            params.centerX,
            params.centerY,
            params.radius,
            params.startAngle,
            params.endAngle,
            false)
          break
        }
        case 'pie': {
          const params: CircleParams = item.params as CircleParams
          figure.moveTo(params.centerX, params.centerY)
          figure.arc(
            params.centerX,
            params.centerY,
            params.radius,
            params.startAngle,
            params.endAngle,
            false)
          figure.lineTo(params.centerX, params.centerY)
          break
        }
        case 'polygon': {
          const params: PolyParams = item.params as PolyParams
          figure.moveTo(params.vertex[0][0], params.vertex[0][1])
          params.vertex.forEach((vert) => {
            figure.lineTo(vert[0], vert[1])
          })
          figure.lineTo(params.vertex[0][0], params.vertex[0][1])
          break
        }
        case 'text': {
          const params: TextParams = item.params as TextParams
          figure.moveTo(params.x + 25, params.y)
          this.canvas.context.font = params.font
          break
        }
        case 'image': {
          const params: ImageParams = item.params as ImageParams
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.canvas.context.drawImage(params.src, params.x, params.y, params.width, params.height)
          break
        }
      }

      const params = item.params

      this.canvas.context.fillStyle = (params as Params).fillColor
      this.canvas.context.fill(figure)
      this.canvas.context.lineWidth = (params as Params).strokeWidth
      this.canvas.context.strokeStyle = (params as Params).strokeColor
      this.canvas.context.stroke(figure)

      if (item.type === 'text') {
        if ((params as TextParams).variant === 'fill') {
          this.canvas.context.fillText((params as TextParams).text, (params as TextParams).x, (params as TextParams).y, (params as TextParams).maxWidth)
        } else if ((params as TextParams).variant === 'stroke') {
          this.canvas.context.strokeText((params as TextParams).text, (params as TextParams).x, (params as TextParams).y, (params as TextParams).maxWidth)
        }
      }

      this.canvas.context.closePath()
      this.elements[index].element = figure
    })
  }

  #colorString (color: string | [number, number, number]): string | number[] {
    function colorNameToHex (color: string) {
      const colours: Record<string, string> = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        indianred: '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrodyellow: '#fafad2',
        lightgrey: '#d3d3d3',
        lightgreen: '#90ee90',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370d8',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#d87093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32'
      }

      if (typeof colours[color.toLowerCase()] !== 'undefined') { return colours[color.toLowerCase()] }

      return ''
    }
    if (typeof color === 'string') {
      if (colorNameToHex(color)) {
        return colorNameToHex(color)
      }
      return color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        , (m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)?.map(x => parseInt(x, 16)) || []
    } else {
      return '#' + [color[0], color[1], color[2]].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')
    }
  }

  #changeAngle (angle: number) {
    return Math.PI / 180 * angle
  }

  #clear () {
    this.canvas.context.clearRect(0, 0, this.canvas.canvas?.width || 0, this.canvas.canvas?.height || 0)
  }

  #initListeners () {
    this.canvas.canvas?.addEventListener('click', (e) => {
      const x = e.offsetX; const y = e.offsetY
      for (let i = this.elements.length - 1; i >= 0; i--) {
        if (this.canvas.context.isPointInPath(this.elements[i].element || {} as Path2D, x, y)) {
          const clickCallback = this.elements[i].listeners.findIndex(x => x?.handler === 'click')
          if (!(this.elements[i].listeners[clickCallback]?.handler === 'click')) {
            break
          }
          this.elements[i].listeners[clickCallback].callback(this.elements[i])
          break
        }
      }
    })

    const MOUT = (name?: string) => {
      this.stopCycle(name)
      const elementsWithMOUT = this.elements.filter(item => item.listeners.map(listener => listener.handler === 'mouseout').length > 0)
      elementsWithMOUT.forEach(item => {
        const MOUTCallback = item.listeners.findIndex(x => x?.handler === 'mouseout')

        if (MOUTCallback !== -1) item.listeners[MOUTCallback].callback(item)
      })
    }

    this.canvas.canvas?.addEventListener('mousemove', (e) => {
      const x = e.offsetX; const y = e.offsetY

      for (let j = this.elements.length - 1; j >= 0; j--) {
        if (this.canvas.context.isPointInPath(this.elements[j].element || {} as Path2D, x, y)) {
          const MOVERCallback = this.elements[j].listeners.findIndex(x => x?.handler === 'mouseover')
          if (MOVERCallback === -1) {
            MOUT(this.elements[j].name)
            break
          }
          this.elements[j].listeners[MOVERCallback].callback(this.elements[j])
        } else {
          for (let i = this.elements.length - 1; i >= 0; i--) {
            if (this.elements[i].name === this.elements[j].name) {
              const MOUTCallback = this.elements[i].listeners.findIndex(x => x?.handler === 'mouseout')
              if (MOUTCallback !== -1) {
                this.elements[i].listeners[MOUTCallback].callback(this.elements[i])
              }
            }
          }
        }
      }
    })

    this.canvas.canvas?.addEventListener('mouseout', () => {
      MOUT()
    })
  }

  //

  on (name: string, handler: string, callback: (arg0: unknown) => void) {
    if (!name || !handler || !callback || typeof callback !== 'function') return
    const elementIndex = this.elements.findIndex(x => x.name === name)
    this.elements[elementIndex].listeners.push({
      handler,
      callback
    })
  }

  hasName (name: string) {
    return this.elements.findIndex(item => item.name === name) !== -1
  }

  // level manipulate

  levelUp (name: string) {
    const index = this.elements.findIndex(x => x.name === name)

    if (index === this.elements.length - 1) {
      return
    }

    const element = this.elements[index]
    this.elements.splice(index, 1)
    this.elements.splice(index + 1, 0, element)

    this.#draw()
  }

  levelDown (name: string) {
    const index = this.elements.findIndex(x => x.name === name)

    if (index === 0) {
      return
    }

    const element = this.elements[index]

    this.elements.splice(index, 1)
    this.elements.splice(index - 1, 0, element)

    this.#draw()
  }

  toTop (name: string) {
    const index = this.elements.findIndex(x => x.name === name)

    if (index === this.elements.length - 1) {
      return
    }

    const element = this.elements[index]
    this.elements.splice(index, 1)
    this.elements.push(element)

    this.#draw()
  }

  toBottom (name: string) {
    const index = this.elements.findIndex(x => x.name === name)

    if (index === 0) {
      return
    }

    const element = this.elements[index]
    this.elements.splice(index, 1)
    this.elements.unshift(element)

    this.#draw()
  }

  setLevel (name: string, level: number) {
    const index = this.elements.findIndex(x => x.name === name)

    if (index === level) {
      return
    }
    if (level > this.elements.length - 1) {
      level = this.elements.length - 1
    }
    if (level < 0) {
      level = 0
    }

    const element = this.elements[index]

    this.elements.splice(index, 1)
    this.elements.splice(level, 0, element)

    this.#draw()
  }

  //

  // params manipulate

  set (name: string, params = {}) {
    const index = this.elements.findIndex(x => x.name === name)
    const element = this.elements[index]

    const oldParams = element.params
    Object.assign(oldParams, params)
    element.params = oldParams

    this.#draw()
  }

  animate (name: string, params: Partial<FigureParams> = {}, duration = 1000, callback?: () => void) {
    const index = this.elements.findIndex(x => x.name === name)
    const element = this.elements[index]

    const startParams = this.get(name).params

    const calcStep = (oldVal: number, newVal: number, progress: number) => {
      return Math.floor(progress * (newVal - oldVal) + oldVal)
    }

    const animate = (options: AnimationOptions) => {
      const { params, startParams, duration } = options

      let startTimestamp = performance.now()
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        for (const key in params) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (typeof params[key] === 'string') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            element.params[key] = this.#colorString([
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              calcStep(this.#colorString(startParams[key])[0] as number, this.#colorString(params[key])[0] as number, progress),
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              calcStep(this.#colorString(startParams[key])[1] as number, this.#colorString(params[key])[1] as number, progress),
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              calcStep(this.#colorString(startParams[key])[2] as number, this.#colorString(params[key])[2] as number, progress)
            ])
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
          } else if (Array.isArray(params[key])) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            for (let i = 0; i < params[key].length; i++) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              element.params[key][i][0] = calcStep(startParams[key][i][0], params[key][i][0], progress)
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              element.params[key][i][1] = calcStep(startParams[key][i][1], params[key][i][1], progress)
            }
          } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            element.params[key] = calcStep(startParams[key], params[key], progress)
          }

          this.#draw()
        }

        if (progress < 1) {
          window.requestAnimationFrame(step)
        } else {
          if (element.inCycle) {
            element.animationQueue.splice(0, 1)
            if (element.animationQueue.length > 0) {
              animate(
                element.animationQueue[0]
              )
            }
          } else {
            if (typeof callback === 'function') {
              callback()
            }
            element.animationQueue = []
          }
        }
      }
      window.requestAnimationFrame(step)
    }

    if (element.animationQueue.length === 0) {
      element.animationQueue.push({
        params,
        startParams,
        duration
      })
      animate(element.animationQueue[0])
    } else {
      element.animationQueue.push({
        params,
        startParams: element.animationQueue[element.animationQueue.length - 1].params,
        duration
      })
    }
  }

  startCycle (name: string, animations: AnimationOptions[]) {
    const elementIndex = this.elements.findIndex(x => x.name === name)
    const element = this.elements[elementIndex]
    element.inCycle = true

    const calcDuration = () => {
      return animations.reduce((acc, item) => {
        return item.duration + acc
      }, 0)
    }

    let allDuration = calcDuration()

    if (!element.inCycle) return

    animations.forEach(animation => {
      this.animate(name, animation.params, animation.duration)
    })

    const interval = setInterval(() => {
      if (!element.inCycle) {
        clearInterval(interval)
        return
      }
      animations.forEach(animation => {
        this.animate(name, animation.params, animation.duration)
      })
      allDuration = calcDuration()
    }, allDuration)
  }

  stopCycle (name?: string, clearQueue = false) {
    if (!name) {
      return
    }
    const elementIndex = this.elements.findIndex(x => x.name === name)
    const element = this.elements[elementIndex]
    element.inCycle = false
    if (clearQueue) {
      element.animationQueue = []
    }
  }

  //

  get (name: string): Element {
    const index = this.elements.findIndex(x => x.name === name)
    if (index === -1) return {} as Element
    return JSON.parse(JSON.stringify(this.elements[index]))
  }
}
