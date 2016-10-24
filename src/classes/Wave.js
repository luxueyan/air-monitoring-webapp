const PI2 = Math.PI * 2
const HALFPI = Math.PI / 2

export default class Wave {
  el = null
  speed = 10  // 速度
  amplitude = 50 // 振幅
  wavelength = 50 // 波长
  segmentLength = 10 // 波片段
  lineWidth = 2 // 线宽
  time = 0 // 周期
  strokeStyle = 'rgba(255, 255, 255, 0.2)'
  resizeEvent = function() {}
  canvasHeight = 200

  constructor(options = {}) {
    Object.assign(this, options)

    if (!this.el) {
      console.error('No Canvas Selected')
    }
    this.ctx = this.el.getContext('2d')

    if (!this.waves.length) {
      console.log('No waves specified')
    }

    // Internal
    this._resizeWidth()
    window.addEventListener('resize', this._resizeWidth.bind(this))
      // User
    this.resizeEvent()
    window.addEventListener('resize', this.resizeEvent.bind(this))

    if (typeof this.initialize === 'function') {
      this.initialize()
    }
  }

  _resizeWidth() {
    this.dpr = window.devicePixelRatio || 1

    this.width = this.el.width = window.innerWidth * this.dpr
    this.height = this.el.height = this.canvasHeight * this.dpr
    this.el.style.width = window.innerWidth + 'px'
    this.el.style.height = this.canvasHeight + 'px'

    this.waveWidth = this.width * 0.95
    this.waveLeft = this.width * 0.025
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  update(time) {
    this.time = this.time - 0.007
    if (typeof time === 'undefined') {
      time = this.time
    }

    let index = -1
    let length = this.waves.length

    while (++index < length) {
      let timeModifier = this.waves[index].timeModifier || 1
      this.drawSine(time * timeModifier, this.waves[index])
    }
    index = void 0
    length = void 0
  }

  ease(percent, amplitude) {
    return amplitude * (Math.sin(percent * PI2 - HALFPI) + 1) * 0.5
  }

  drawSine(time, options = {}) {
    let amplitude = options.amplitude || this.amplitude
    let wavelength = options.wavelength || this.wavelength
    let lineWidth = options.lineWidth || this.lineWidth
    let strokeStyle = options.strokeStyle || this.strokeStyle
    let segmentLength = options.segmentLength || this.segmentLength

    let x = time
    let y = 0
    let amp = this.amplitude

    // Center the waves
    let yAxis = this.height / 2

    // Styles
    this.ctx.lineWidth = lineWidth * this.dpr
    this.ctx.strokeStyle = strokeStyle
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    this.ctx.beginPath()

    // Starting Line
    this.ctx.moveTo(0, yAxis)
    this.ctx.lineTo(this.waveLeft, yAxis)

    for (let i = 0; i < this.waveWidth; i += segmentLength) {
      x = (time * this.speed) + (-yAxis + i) / wavelength
      y = Math.sin(x)

      // Easing
      amp = this.ease(i / this.waveWidth, amplitude)

      this.ctx.lineTo(i + this.waveLeft, amp * y + yAxis)

      amp = void 0
    }

    // Ending Line
    this.ctx.lineTo(this.width, yAxis)

    // Stroke it
    this.ctx.stroke()
  }

  run() {
    this.clear()
    this.update()

    window.requestAnimationFrame(this.run.bind(this))
  }
}
