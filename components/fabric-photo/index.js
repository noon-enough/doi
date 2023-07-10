import CanvasDraw from "./canvasDraw";

Component({
    properties: {},
    data: {
        canvasDraw: null, // 绘图对象
        canvasEle:  null, // canvas元素对象
        imgs:  {
            star: '../../../static/images/starActive.png',
            delete: '../../../static/images/cancel.png',
        },
        startPoint: null, // 手绘起点
        createId: null, // 手绘id
        fingers: 1, // 手指数量
        isDrawing: false, // 是否正在绘图
    },
    attached() {
        let that = this
        this.initCanvas()
    },
    methods: {
        initCanvas() {
            let that = this
            const query = wx.createSelectorQuery().in(that)
            query
                .select('#canvas')
                .fields({ node: true, size: true, rect: true })
                .exec((res) => {
                    const ele = res[0]
                    this.canvasEle = ele

                    // 配置项
                    const option = {
                        ele: ele, // canvas元素
                        drawCallBack: this.draw, // 必须：用户自定义绘图方法
                        scale: 1, // 当前缩放倍数
                        scaleStep: 0.1, // 缩放步长（按钮)
                        touchScaleStep: 0.005, // 缩放步长（手势）
                        maxScale: 2, // 缩放最大倍数（缩放比率倍数）
                        minScale: 0.5, // 缩放最小倍数（缩放比率倍数）
                        translate: { x: 0, y: 0 }, // 默认画布偏移
                        isThrottleDraw: true, // 是否开启节流绘图（建议开启，否则安卓调用频繁导致卡顿）
                        throttleInterval: 20, // 节流绘图间隔，单位ms
                        pixelRatio: wx.getSystemInfoSync().pixelRatio, // 像素比（高像素比可以解决高清屏幕模糊问题）
                        controls: {
                            delete: {
                                radius: 20,
                                fill: '#f00',
                                customDraw: this.drawDeleteControl,
                            },
                        },
                    }
                    this.canvasDraw = new CanvasDraw(option) // 创建CanvasDraw实例后就可以使用实例的所有方法了
                    this.addEvents() // 添加事件监听
                    this.canvasDraw.draw() // 可以按实际需要调用绘图方法
                    console.log('this.canvasDraw', this.canvasDraw)
                })
        },

        /** 绑定组件内置事件 */
        addEvents() {
            this.canvasDraw.on('selection:updated', this.onSelectionUpdated)
            this.canvasDraw.on('selection:cleared', this.onSelectionCleared)
            this.canvasDraw.on('touchstart', this.onTouchstart)
            this.canvasDraw.on('touchmove', this.onTouchmove)
            this.canvasDraw.on('touchend', this.onTouchend)
            this.canvasDraw.on('tap', this.onTap)
            this.canvasDraw.on('deleteControl:tap', this.onDeleteControl)
        },

        /** 用户自定义绘图内容 */
        draw() {
            // 1.默认绘图方式-圆形
            // const { ctx } = this.canvasDraw
            // ctx.beginPath()
            // ctx.strokeStyle = '#000'
            // ctx.arc(50, 50, 50, 0, 2 * Math.PI)
            // ctx.stroke()
            // ctx.closePath()
        },

        /** 中心放大 */
        zoomIn() {
            this.canvasDraw.zoomIn()
        },

        /** 中心缩小 */
        zoomOut() {
            this.canvasDraw.zoomOut()
        },

        /** 重置画布（回复初始效果） */
        reset() {
            this.canvasDraw.reset()
        },

        /** 清空画布 */
        clear() {
            this.canvasDraw.clear()
        },

        /** 组件方法-绘制多边形 */
        addShape() {
            const opt = {
                points: [
                    { x: 148, y: 194 },
                    { x: 196, y: 191 },
                    { x: 215, y: 244 },
                    { x: 125, y: 249 },
                ],
                style: { strokeWidth: 2, stroke: '#000', lineDash: [2, 2], fill: 'red' },
            }
            this.canvasDraw.drawShape(opt)
        },

        /** 组件方法-绘制多线段 */
        addLines() {
            const opt = {
                points: [
                    { x: 53, y: 314 },
                    { x: 116, y: 283 },
                    { x: 166, y: 314 },
                    { x: 224, y: 283 },
                    { x: 262, y: 314 },
                ],
                style: { strokeWidth: 2, stroke: '#000', lineDash: [2, 2] },
                angle: 45,
            }
            this.canvasDraw.drawLines(opt)
        },

        /** 组件方法-绘制文字 */
        addText() {
            const opt = {
                text: '组件方法-绘制文字',
                points: [{ x: 175, y: 150 }],
                style: {
                    fill: '#000',
                    textAlign: 'center',
                    textBaseline: 'middle',
                },
            }
            this.canvasDraw.drawText(opt)
        },

        /** 组件方法-绘制点 */
        addPoint() {
            const opt = {
                points: [{ x: 150, y: 50 }],
                style: { radius: 20, strokeWidth: 2, stroke: '#00f', lineDash: [2, 2], fill: '#0f0' },
            }
            this.canvasDraw.drawPoint(opt)
        },

        /** 组件方法-绘制图片点 */
        addImagePoint() {
            const opt = {
                points: [{ x: 300, y: 50 }],
                style: { radius: 40, img: this.imgs.star },
                angle: 45,
            }
            this.canvasDraw.drawPoint(opt)
        },

        /** 用户手绘矩形 */
        handDraw() {
            // 如果是手绘则禁止拖拽画布，否则启动拖拽画布
            this.isDrawing = !this.isDrawing
            this.canvasDraw.canDragCanvas = !this.isDrawing
        },

        /** 组件内置事件 */
        onSelectionUpdated(item) {
            if (this.isDrawing) return
            console.log('选中元素：', item)
            item.style.fill = 'green'
            item.controlsVis = { delete: true }
            item.zIndex = 1
            this.canvasDraw.draw()
        },
        onSelectionCleared(item) {
            if (this.isDrawing) return
            console.log('取消选中：', item)
            if (!item) return
            item.style.fill = 'red'
            item.controlsVis = { delete: false }
            item.zIndex = 0
            this.canvasDraw.draw()
        },
        onTouchstart(e) {
            console.log('触摸开始：', e)
            this.startPoint = e.point
            this.createId = `user_${new Date().getTime()}`
            this.fingers = e.event.touches.length
        },
        onTouchmove(e) {
            // console.log('触摸移动：', e)
            // 如果是绘制状态，触摸移动则进行矩形绘制
            if (this.fingers !== 1 || !this.isDrawing) return
            const tsPoint = this.startPoint
            const tmPoint = e.point
            // 两点距离小于5，不进行绘制
            if (Math.abs(tmPoint.x - tsPoint.x) <= 5 || Math.abs(tmPoint.y - tsPoint.y) <= 5) return
            // 先移除，再绘制
            this.canvasDraw.removeChild(this.createId)
            this.canvasDraw.draw()
            const opt = {
                id: this.createId,
                points: [tsPoint, { x: tmPoint.x, y: tsPoint.y }, tmPoint, { x: tsPoint.x, y: tmPoint.y }],
                style: { strokeWidth: 2, stroke: 'rgba(0,0,0,.4)', fill: 'rgba(255,0,0,.4)' },
            }
            this.canvasDraw.drawShape(opt)
        },
        onTouchend(e) {
            console.log('触摸结束：', e)
            // 如果是绘制状态，设置最后一个绘制的为选中状态，及显示删除控制点
            if (!this.isDrawing) return
            this.canvasDraw.children.forEach((item) => {
                if (item.id === this.createId) {
                    item.style.stroke = 'blue'
                    item.isSelect = true
                    item.controlsVis = { delete: true }
                } else {
                    item.style.stroke = 'black'
                    item.isSelect = false
                    item.controlsVis = { delete: false }
                }
            })
            this.canvasDraw.draw()
        },
        onTap(e) {
            console.log('点击坐标：', e.point)
            console.log('所有canvas子对象：', this.canvasDraw.children)
        },
        onDeleteControl(e) {
            console.log('点击删除控制点', e)
            this.canvasDraw.removeChild(e.id)
            this.canvasDraw.draw()
        },
        // 自定义绘制删除控制点
        drawDeleteControl(opt) {
            this.canvasDraw.drawPoint(
                {
                    id: 'delete',
                    points: opt.points,
                    style: {
                        img: this.imgs.delete,
                        radius: 20,
                    },
                },
                false
            )
        },

        /** canvas事件绑定 */
        touchstart(e) {
            this.canvasDraw.touchstart(e)
        },
        touchmove(e) {
            this.canvasDraw.touchmove(e)
        },
        touchend(e) {
            this.canvasDraw.touchend(e)
        },
    }
});
