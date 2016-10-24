import _ from 'lodash'

export class Dot {
  constructor(centerX, centerY, centerZ, radius) {
    this.dx = centerX // 最后的位置，真正要进场到的位置
    this.dy = centerY
    this.dz = centerZ
    this.tx = 0 // 出场后的停留位置
    this.ty = 0
    this.tz = 0
    this.x = centerX
    this.y = centerY
    this.z = centerZ
    this.zMax = centerZ // 用于计算alpha值
    this.radius = radius
  }

  paint(canvas, focallength) {
    let context = canvas.getContext('2d')
    let scale = focallength / (focallength + this.z)
    let alpha = _.round(1 - Math.abs(this.z / this.zMax), 2)

    context.save()
    context.beginPath()
    context.arc(canvas.width / 2 + (this.x - canvas.width / 2) * scale, canvas.height / 2 + (this.y - canvas.height / 2) * scale, this.radius * scale, 0, 2 * Math.PI)
    context.fillStyle = `rgba(255,255,255,${alpha})`
    context.fill()
    context.restore()
  }
}

export default class StarsText {
  focallength = 100 // z轴的深度
  animateRunning = false
  requestId = 0 //animate frame request id
  lastTime = 0
  direction = true //方向进场还是出场
  pause = false

  constructor(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
  }

  // 入场某个文字或者图片
  animateContent(text) {
    window.cancelAnimationFrame(this.requestId)
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.dots = this._getContentData(text)
    this.direction = true
    this.pause = false

    // 初始化点位置
    _.each(this.dots, dot => {
      dot.x = Math.random() * this.canvas.width
      dot.y = Math.random() * this.canvas.height
      dot.z = Math.random() * this.focallength * 2 - this.focallength

      dot.zMax = dot.z

      dot.tx = Math.random() * this.canvas.width
      dot.ty = Math.random() * this.canvas.height
      dot.tz = Math.random() * this.focallength * 2 - this.focallength
      dot.paint(this.canvas, this.focallength)
    })

    // 开始进场
    this._animate()
  }

  // 点运动
  _animate() {
    this.animateRunning = true
    let thisTime = +new Date()
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    _.each(this.dots, dot => {
      // console.log(this.direction)
      if (this.direction) {
        if (Math.abs(dot.dx - dot.x) < 0.1 && Math.abs(dot.dy - dot.y) < 0.1 && Math.abs(dot.dz - dot.z) < 0.1) {
          dot.x = dot.dx
          dot.y = dot.dy
          dot.z = dot.dz

          if (thisTime - this.lastTime > 300) {
            this.direction = false
          }
        } else {
          dot.x = dot.x + (dot.dx - dot.x) * 0.1
          dot.y = dot.y + (dot.dy - dot.y) * 0.1
          dot.z = dot.z + (dot.dz - dot.z) * 0.1
          this.lastTime = +new Date()
        }
      } else {
        if (Math.abs(dot.tx - dot.x) < 0.1 && Math.abs(dot.ty - dot.y) < 0.1 && Math.abs(dot.tz - dot.z) < 0.1) {
          dot.x = dot.tx
          dot.y = dot.ty
          dot.z = dot.tz
          this.pause = true
        } else {
          dot.zMax = dot.tz // 出场目标z值

          dot.x = dot.x + (dot.tx - dot.x) * 0.1
          dot.y = dot.y + (dot.ty - dot.y) * 0.1
          dot.z = dot.z + (dot.tz - dot.z) * 0.1
            // this.pause = false
        }
      }
      dot.paint(this.canvas, this.focallength)
    })

    if (!this.pause) {
      if ('requestAnimationFrame' in window) {
        this.requestId = window.requestAnimationFrame(this._animate.bind(this))
      }
    }
  }

  // 从文字获取信息生成点
  _getContentData(text) {
    if (text.toString() === '[object HTMLImageElement]') {
      this._drawImg(text)
    } else {
      this._drawText(text)
    }

    let imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    let dots = []

    for (let x = 0; x < imgData.width; x += 5) { // 6是step
      for (let y = 0; y < imgData.height; y += 5) {
        let i = (y * imgData.width + x) * 4 // x列 y行的点
        if (imgData.data[i] >= 128) { // rgb的r值大于128
          let dot = new Dot(x - 3, y - 3, 0, 1)
          dots.push(dot)
        }
      }
    }
    return dots
  }

  _drawText(text) {
    let { context, canvas } = this
    context.save()
    context.font = '200px 微软雅黑 bold'
    context.fillStyle = 'rgba(168,168,168,1)'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(text, canvas.width / 2, canvas.height / 2)
    context.restore()
  }

  _drawImg(img) {
    let { context, canvas } = this
    let width = img.width
    let height = img.height
    let x = 0
    let y = 0

    if (img.width > canvas.width || img.height > canvas.height) {
      let wgth = img.width / canvas.width - img.height / canvas.height
      if (wgth) {
        width = parseInt(canvas.width / 3, 10)
        height = img.height * width / img.width
      } else {
        width = parseInt(canvas.height / 3, 10)
        height = img.width * height / img.height
      }
    }

    x = (canvas.width - width) / 2
    y = (canvas.height - height) / 2

    context.save()
    context.drawImage(img, 0, 0, img.width, img.height, x, y, width, height)
    context.restore()
  }

}
