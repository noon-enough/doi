let fnLog = function (msg) {
  if (debug) {
    console.log(msg)
  }
}

//config
let debug = false; //是否启用调试，默认值为false。true：打印过程日志；false：关闭过程日志
let outputFileType = 'jpg'; //目标文件的类型。默认值为jpg，jpg：输出jpg格式图片；png：输出png格式图片
let quality = 1; //图片的质量。默认值为1，即最高质量。目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
let aspectRatio = null; //目标图片的宽高比，默认null，即不限制剪裁宽高比。aspectRatio需大于0
//

let canvas, ctx, img, step = 0

let layoutLeft = 0;
let layoutTop = 0;
let layoutWidth = 0;
let layoutHeight = 0;

let stageLeft = 0;
let stageTop = 0;
let stageWidth = 0;
let stageHeight = 0;

let orginImagePath = '';
let imageWidth = 0;
let imageHeight = 0;


let pixelRatio = 1; //todo设备像素密度//暂不使用//

let imageStageRatio = 1; //图片实际尺寸与剪裁舞台大小的比值，用于尺寸换算。

let minBoxWidth = 0;
let minBoxHeight = 0;

//initial
let minBoxWidthRatio = 0.15; //最小剪裁尺寸与原图尺寸的比率，默认0.15，即宽度最小剪裁到原图的0.15宽。
let minBoxHeightRatio = 0.15; //同minBoxWidthRatio，当设置aspectRatio时，minBoxHeight值设置无效。minBoxHeight值由minBoxWidth 和 aspectRatio自动计算得到。

let initialBoxWidthRatio = 0.6; //剪裁框初始大小比率。默认值0.6，即剪裁框默认宽度为图片宽度的0.6倍。
let initialBoxHeightRatio = 0.6; //同initialBoxWidthRatio，当设置aspectRatio时，initialBoxHeightRatio值设置无效。initialBoxHeightRatio值由initialBoxWidthRatio 和 aspectRatio自动计算得到。
//


let touchStartBoxLeft = 0;
let touchStartBoxTop = 0;
let touchStartBoxWidth = 0;
let touchStartBoxHeight = 0;

let touchStartX = 0;
let touchStartY = 0;


Component({
  properties: {
    imagePath: {
      type: String,
      value: '',
      observer: function (newImg) {
        wx.getImageInfo({
          src: newImg,
          success: res => {
            imageWidth = res.width
            imageHeight = res.height
            // this.setData({
            //   canvasWidth: res.width,
            //   canvasHeight: res.height
            // })
          }
        })
      }
    },
    options: {
      type: Object,
      value: {
        colors: ['#fff', '#f00']
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    stage: '',


    stageLeft: 0,
    stageTop: 0,
    stageWidth: 0,
    stageHeight: 0,


    boxWidth: 0,
    boxHeight: 0,
    boxLeft: 0,
    boxTop: 0,

    canvasWidth: 0,
    canvasHeight: 0,

    drawtype: 'line',
    selectedColor: '#fff',
    selectedSize:20
  },

  attached() {
    orginImagePath = this.data.imagePath

    this.rotateInit()
    this.cropInit()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //初始化旋转
    rotateInit() {
      let that = this,
        query = that.createSelectorQuery(),
        imagePath = that.data.imagePath
      query.select('.myCanvas')
        .fields({
          node: true,
          size: true
        })
        .exec((res) => {
          canvas = res[0].node;
          canvas.width = imageWidth;
          canvas.height = imageHeight;
          ctx = canvas.getContext('2d');
          img = canvas.createImage();
          img.src = imagePath;
          img.width = imageWidth;
          img.height = imageHeight
          img.onload = () => {
            ctx.drawImage(img, 0, 0)
          }
        })

    },
    //初始化剪裁旋转
    cropInit: function () {

      let that = this,
        opts = that.data.options,
        imagePath = that.data.imagePath


      if (opts.debug) {
        debug = opts.debug;
      }

      if (opts.minBoxWidthRatio) {
        minBoxWidthRatio = opts.minBoxWidthRatio;
      }

      if (opts.minBoxHeightRatio) {
        minBoxHeightRatio = opts.minBoxHeightRatio;
      }

      if (opts.initialBoxWidthRatio) {
        initialBoxWidthRatio = opts.initialBoxWidthRatio;
      }

      if (opts.initialBoxHeightRatio) {
        initialBoxHeightRatio = opts.initialBoxHeightRatio;
      }

      if (opts.aspectRatio) {
        aspectRatio = opts.aspectRatio;
      }

      //初始化剪切框
      wx.createSelectorQuery().in(this).select('.layout').boundingClientRect(function (rect) {
        fnLog(rect);
        layoutLeft = rect.left;
        layoutTop = rect.top;
        layoutWidth = rect.width;
        layoutHeight = rect.height;
        wx.getImageInfo({
          src: imagePath,
          success: function (imageInfo) {
            fnLog(imageInfo)

            imageWidth = imageInfo.width;
            imageHeight = imageInfo.height;

            let imageWH = imageWidth / imageHeight;
            let layoutWH = layoutWidth / layoutHeight;
            if (imageWH >= layoutWH) {
              stageWidth = layoutWidth;
              stageHeight = stageWidth / imageWH;
              imageStageRatio = imageHeight / stageHeight;
            } else {
              stageHeight = layoutHeight;
              stageWidth = layoutHeight * imageWH;
              imageStageRatio = imageWidth / stageWidth;
            }
            stageLeft = (layoutWidth - stageWidth) / 2;
            stageTop = (layoutHeight - stageHeight) / 2;


            minBoxWidth = stageWidth * minBoxWidthRatio;
            minBoxHeight = stageHeight * minBoxHeightRatio;

            let boxWidth = stageWidth * initialBoxWidthRatio;
            let boxHeight = stageHeight * initialBoxHeightRatio;

            if (aspectRatio) {
              boxHeight = boxWidth / aspectRatio;
            }
            if (boxHeight > stageHeight) {
              boxHeight = stageHeight;
              boxWidth = boxHeight * aspectRatio;
            }

            let boxLeft = (stageWidth - boxWidth) / 2;
            let boxTop = (stageHeight - boxHeight) / 2;


            that.setData({

              imagePath: imagePath,

              canvasWidth: boxWidth,
              canvasHeight: boxHeight,

              stageLeft: stageLeft,
              stageTop: stageTop,
              stageWidth: stageWidth,
              stageHeight,
              stageHeight,

              boxWidth: boxWidth,
              boxHeight: boxHeight,
              boxLeft: boxLeft,
              boxTop: boxTop
            })
          }
        })

      }).exec();

    },
    //开始拖动剪裁框
    cropTouchStart: function (e) {
      fnLog('start')
      fnLog(e)

      let that = this;


      let touch = e.touches[0];
      let pageX = touch.pageX;
      let pageY = touch.pageY;

      touchStartX = pageX;
      touchStartY = pageY;

      touchStartBoxLeft = that.data.boxLeft;
      touchStartBoxTop = that.data.boxTop;
      touchStartBoxWidth = that.data.boxWidth;
      touchStartBoxHeight = that.data.boxHeight;


    },
    //开始拖动剪裁框
    cropTouchMove: function (e) {
      fnLog('move')
      fnLog(e)
      let that = this;

      let targetId = e.target.id;
      let touch = e.touches[0];
      let pageX = touch.pageX;
      let pageY = touch.pageY;

      let offsetX = pageX - touchStartX;
      let offsetY = pageY - touchStartY;





      if (targetId == 'box') {
        let newBoxLeft = touchStartBoxLeft + offsetX;
        let newBoxTop = touchStartBoxTop + offsetY;

        if (newBoxLeft < 0) {
          newBoxLeft = 0;
        }
        if (newBoxTop < 0) {
          newBoxTop = 0;
        }
        if (newBoxLeft + touchStartBoxWidth > stageWidth) {
          newBoxLeft = stageWidth - touchStartBoxWidth;
        }
        if (newBoxTop + touchStartBoxHeight > stageHeight) {
          newBoxTop = stageHeight - touchStartBoxHeight;
        }
        that.setData({
          boxLeft: newBoxLeft,
          boxTop: newBoxTop
        });
      } else if (targetId == 'lt') {

        if (aspectRatio) {
          offsetY = offsetX / aspectRatio
        }

        let newBoxLeft = touchStartBoxLeft + offsetX;
        let newBoxTop = touchStartBoxTop + offsetY;

        if (newBoxLeft < 0) {
          newBoxLeft = 0;
        }
        if (newBoxTop < 0) {
          newBoxTop = 0;
        }

        if ((touchStartBoxLeft + touchStartBoxWidth - newBoxLeft) < minBoxWidth) {
          newBoxLeft = touchStartBoxLeft + touchStartBoxWidth - minBoxWidth;
        }
        if ((touchStartBoxTop + touchStartBoxHeight - newBoxTop) < minBoxHeight) {
          newBoxTop = touchStartBoxTop + touchStartBoxHeight - minBoxHeight;
        }

        let newBoxWidth = touchStartBoxWidth - (newBoxLeft - touchStartBoxLeft);
        let newBoxHeight = touchStartBoxHeight - (newBoxTop - touchStartBoxTop);


        //约束比例
        if (newBoxTop == 0 && aspectRatio && newBoxLeft != 0) {
          newBoxWidth = newBoxHeight * aspectRatio;
          newBoxLeft = touchStartBoxWidth - newBoxWidth + touchStartBoxLeft;
        }
        if (newBoxLeft == 0 && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
          newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop;
        }

        if (newBoxWidth == minBoxWidth && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
          newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop;
        }

        that.setData({
          boxTop: newBoxTop,
          boxLeft: newBoxLeft,
          boxWidth: newBoxWidth,
          boxHeight: newBoxHeight
        });

      } else if (targetId == 'rt') {

        if (aspectRatio) {
          offsetY = -offsetX / aspectRatio
        }



        let newBoxWidth = touchStartBoxWidth + offsetX;
        if (newBoxWidth < minBoxWidth) {
          newBoxWidth = minBoxWidth;
        }
        if (touchStartBoxLeft + newBoxWidth > stageWidth) {
          newBoxWidth = stageWidth - touchStartBoxLeft;
        }


        let newBoxTop = touchStartBoxTop + offsetY;

        if (newBoxTop < 0) {
          newBoxTop = 0;
        }

        if ((touchStartBoxTop + touchStartBoxHeight - newBoxTop) < minBoxHeight) {
          newBoxTop = touchStartBoxTop + touchStartBoxHeight - minBoxHeight;
        }
        let newBoxHeight = touchStartBoxHeight - (newBoxTop - touchStartBoxTop);


        //约束比例
        if (newBoxTop == 0 && aspectRatio && newBoxWidth != stageWidth - touchStartBoxLeft) {
          newBoxWidth = newBoxHeight * aspectRatio;
        }

        if (newBoxWidth == stageWidth - touchStartBoxLeft && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
          newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop;
        }

        if (newBoxWidth == minBoxWidth && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
          newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop;
        }




        that.setData({
          boxTop: newBoxTop,
          boxHeight: newBoxHeight,
          boxWidth: newBoxWidth
        });
      } else if (targetId == 'lb') {

        if (aspectRatio) {
          offsetY = -offsetX / aspectRatio
        }
        let newBoxLeft = touchStartBoxLeft + offsetX;

        if (newBoxLeft < 0) {
          newBoxLeft = 0;
        }
        if ((touchStartBoxLeft + touchStartBoxWidth - newBoxLeft) < minBoxWidth) {
          newBoxLeft = touchStartBoxLeft + touchStartBoxWidth - minBoxWidth;
        }

        let newBoxWidth = touchStartBoxWidth - (newBoxLeft - touchStartBoxLeft);


        let newBoxHeight = touchStartBoxHeight + offsetY;
        if (newBoxHeight < minBoxHeight) {
          newBoxHeight = minBoxHeight;
        }
        if (touchStartBoxTop + newBoxHeight > stageHeight) {
          newBoxHeight = stageHeight - touchStartBoxTop;
        }

        //约束比例
        if (newBoxHeight == stageHeight - touchStartBoxTop && aspectRatio && newBoxLeft != 0) {
          newBoxWidth = newBoxHeight * aspectRatio;
          newBoxLeft = touchStartBoxWidth - newBoxWidth + touchStartBoxLeft;
        }
        if (newBoxLeft == 0 && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
        }

        if (newBoxWidth == minBoxWidth && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
        }




        that.setData({

          boxLeft: newBoxLeft,
          boxWidth: newBoxWidth,
          boxHeight: newBoxHeight
        });
      } else if (targetId == 'rb') {
        if (aspectRatio) {
          offsetY = offsetX / aspectRatio
        }
        let newBoxWidth = touchStartBoxWidth + offsetX;
        if (newBoxWidth < minBoxWidth) {
          newBoxWidth = minBoxWidth;
        }
        if (touchStartBoxLeft + newBoxWidth > stageWidth) {
          newBoxWidth = stageWidth - touchStartBoxLeft;
        }

        let newBoxHeight = touchStartBoxHeight + offsetY;
        if (newBoxHeight < minBoxHeight) {
          newBoxHeight = minBoxHeight;
        }
        if (touchStartBoxTop + newBoxHeight > stageHeight) {
          newBoxHeight = stageHeight - touchStartBoxTop;
        }


        //约束比例
        if (newBoxHeight == stageHeight - touchStartBoxTop && aspectRatio && newBoxWidth != stageWidth - touchStartBoxLeft) {
          newBoxWidth = newBoxHeight * aspectRatio;
        }

        if (newBoxWidth == stageWidth - touchStartBoxLeft && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
        }

        if (newBoxWidth == minBoxWidth && aspectRatio) {
          newBoxHeight = newBoxWidth / aspectRatio;
        }


        that.setData({

          boxWidth: newBoxWidth,
          boxHeight: newBoxHeight
        });

      }


    },
    //结束拖动剪裁框
    cropTouchEnd: function (e) {
      fnLog('end')
    },
    //取消拖动剪裁框
    cropTouchCancel: function (e) {
      fnLog('cancel')
    },
    //执行剪裁
    doCrop: function (opts) {
      let that = this;
      let imagePath = that.data.imagePath;


      let boxLeft = that.data.boxLeft;
      let boxTop = that.data.boxTop;
      let boxWidth = that.data.boxWidth;
      let boxHeight = that.data.boxHeight;

      let sx = Math.ceil(boxLeft * imageStageRatio);
      let sy = Math.ceil(boxTop * imageStageRatio);

      let sWidth = Math.ceil(boxWidth * imageStageRatio);
      let sHeight = Math.ceil(boxHeight * imageStageRatio);
      let dx = 0;
      let dy = 0;


      let dWidth = Math.ceil(sWidth * pixelRatio);
      let dHeight = Math.ceil(sHeight * pixelRatio);

      canvas.width = dWidth
      canvas.height = dHeight
      img.src = imagePath
      img.onload = () => {
       fnLog(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        // 生成临时图片
        wx.canvasToTempFilePath({
          canvas: canvas,
          fileType: outputFileType,
          quality: quality,
          success: function (res) {
           fnLog('剪裁成功')
            orginImagePath = res.tempFilePath
            step = 0
            that.setData({
              canvasWidth: boxWidth,
              canvasHeight: boxHeight,
              imagePath: res.tempFilePath,
              stage: ''
            })

          },
          fail: function (res) {
           fnLog(res);
          }
        });
      }
    },
    //执行旋转
    doRotate(e) {
      let direction = e.currentTarget.dataset.direction
     fnLog(img)
      let that = this,
        width = img.width,
        height = img.height
      //  step = this.step

      var min_step = 0;
      var max_step = 3;


      if (step == null) {
        step = min_step;
      }

      if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值  
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
     fnLog('step:', step)
      //  this.step = step
      let degree = step * 90 * Math.PI / 180;

      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }

      // 生成临时图片
      wx.canvasToTempFilePath({
        canvas: canvas,
        fileType: outputFileType,
        quality: quality,
        success: function (res) {
          that.setData({
            imagePath: res.tempFilePath
          })
          that.cropInit()
        },
        fail: function (res) {
         fnLog(res);
        }
      });


    },
    doMirror(e){      
      let canvasWidth = this.data.canvasWidth,canvasHeight = this.data.canvasHeight
      img.src=this.data.imagePath
      ctx.translate(canvasWidth, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    },
    //执行涂鸦
    doDraw(e) {
      let that = this
     fnLog('画完了')
      // 生成临时图片
      wx.canvasToTempFilePath({
        canvas: canvas,
        fileType: outputFileType,
        quality: quality,
        success: function (res) {
          orginImagePath = res.tempFilePath
          that.setData({
            imagePath: res.tempFilePath,
            stage: ''
          })

        },
        fail: function (res) {
         fnLog(res);
        }
      });
    },
    drawStart(e) {
     fnLog('开始画', e, imageStageRatio)
      let x = e.touches[0].x * imageStageRatio;
      let y = e.touches[0].y * imageStageRatio;
      let drawtype = this.data.drawtype,
        selectedColor = this.data.selectedColor,
        selectedSize = this.data.selectedSize
      if (drawtype == 'line') {
        ctx.beginPath();
        ctx.lineWidth = selectedSize;
        ctx.strokeStyle = selectedColor; // Green path
        ctx.moveTo(x, y);
      } else if (drawtype == 'rect') {
        this.startX = x
        this.startY = y
      }
    },
    drawMove(e) {
     fnLog('正在画')
      let x = e.touches[0].x * imageStageRatio;
      let y = e.touches[0].y * imageStageRatio;
      let drawtype = this.data.drawtype,
        selectedColor = this.data.selectedColor
      if (drawtype == 'line') {
        ctx.lineCap = "round";
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (drawtype == 'rect') {
        this.w = x - this.startX, this.h = y - this.startY
        ctx.fillStyle = selectedColor;
        ctx.fillRect(this.startX, this.startY, this.w, this.h);
      }
    },
    drawEnd(e) {
     fnLog('结束画')
      // let drawtype = this.data.drawtype
      // if (drawtype == 'rect') {
      //   // let w = x-this.startX,h=y-this.startY
      //   ctx.fillRect(this.startX, this.startY, this.w, this.h);
      // }
    },
    //菜单操作
    togglestage(e) {
      let stage = e.currentTarget.dataset.stage

      if (stage == 'crop') {
       fnLog('初始化剪裁')
        this.setData({
          stage: 'crop'
        })
        this.cropInit()
        this.rotateInit()
      } else if (stage == 'tuya') {
       fnLog('初始化涂鸦', orginImagePath)
        //   fnLog(this.data.canvasWidth, this.data.canvasHeight)
        img = canvas.createImage();
        img.src = orginImagePath
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
        }
        this.setData({
          stage: 'tuya'
        })
      } else if (stage == '' && this.data.stage == 'crop') {
       fnLog('取消剪裁', orginImagePath)
        step = 0
        this.setData({
          imagePath: orginImagePath,
          stage: ''
        })
        this.rotateInit()
        this.cropInit()
      } else if (stage == '' && this.data.stage == 'tuya') {
       fnLog('取消涂鸦')
        this.setData({
          imagePath: orginImagePath,
          stage: ''
        })

      }
      this.setData({
        stage
      })
    },
    toggleDrawType(e) {
      let type = e.currentTarget.dataset.type
      this.setData({
        drawtype: type
      })
    },
    toggleColor(e) {
      let selectedColor = e.currentTarget.dataset.color
      this.setData({
        selectedColor
      })
    },
    // changeColor(e){
    // // fnLog(e.detail.value)
    //   this.setData({
    //     selectedColor:`hsl(${e.detail.value}deg 100% 50%)`
    //   })
    // },
    toggleSize(e){
      let selectedSize = e.currentTarget.dataset.size
      this.setData({
        selectedSize
      })
    },
    editCancel() {
     fnLog('取消编辑')
      this.triggerEvent('cancel')
    },
    editSave() {
     fnLog('保存编辑')
      this.triggerEvent('success',{url:this.data.imagePath})
    }

  }


})