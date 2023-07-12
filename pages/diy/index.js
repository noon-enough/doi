import emojiData from '../../miniprogram_npm/@emoji-mart/data/index'
import CanvasDrag from '../../components/canvas-drag/canvas-drag';
import {showToast} from "../../utils/util";

const app = getApp()
// index.js
Page({
    data: {
        rgb: 'red',
        canvas_height: 500,
        graph: {},
        emojiData: emojiData,
        list: app.globalData.tabbar,
        show_add_text_input: false,
        show_color_picker: false,
        text: "",
        colorData: {
            //基础色相，即左侧色盘右上顶点的颜色，由右侧的色相条控制
            hueData: {
                colorStopRed: 255,
                colorStopGreen: 0,
                colorStopBlue: 0,
            },
            //选择点的信息（左侧色盘上的小圆点，即你选择的颜色）
            pickerData: {
                x: 0, //选择点x轴偏移量
                y: 480, //选择点y轴偏移量
                red: 0,
                green: 0,
                blue: 0,
                hex: '#000000'
            },
            //色相控制条的位置
            barY: 0
        },
        rpxRatio: 1
    },
    onLoad() {
    },
    onEmoji(e) {
        let that = this,
            text = e.detail.emoji ?? ""
        if (text) {
            that.setData({
                graph: {
                    type: 'text',
                    text: text,
                }
            })
        }
    },
    /**
     * 添加文本
     */
    onAddText() {
        let that = this
        that.setData({
            show_add_text_input: true,
        })
        // this.setData({
        //     graph: {
        //         type: 'text',
        //         text: '🎅🏼',
        //     }
        // });
    },
    /**
     * 改变文字颜色
     */
    onChangeColor() {
        let that = this
        that.setData({
            show_color_picker: true,
        })
        // CanvasDrag.changFontColor('blue');
    },
    /**
     * 添加图片
     */
    onAddImage() {
        let that = this
        wx.chooseImage({
            success: (res) => {
                that.setData({
                    graph: {
                        w: 200, h: 200,
                        type: 'image',
                        url: res.tempFilePaths[0],
                    }
                });
            }
        })
    },
    /**
     * 导出图片
     */
    onExport() {
        CanvasDrag.export().then((filePath) => {
                console.log(filePath);
                wx.previewImage({
                    urls: [filePath]
                })
            }).catch((e) => {
                console.error(e);
            })
    },
    /**
     * 改变背景颜色
     */
    onChangeBgColor() {
        CanvasDrag.changeBgColor('yellow');
    },

    /**
     * 改变背景照片
     */
    onChangeBgImage() {
        CanvasDrag.changeBgImage('../../assets/images/test.jpg');
    },
    onClearCanvas:function(event){
        let that = this;
        that.setData({canvasBg:null});
        CanvasDrag.clearCanvas();
    },
    onUndo:function(event){
        CanvasDrag.undo();
    },
    closeDialog() {
        let that = this
        that.setData({
            show_add_text_input: false,
        })
    },
    submitDialog(e) {
        let that = this,
            text = that.data.text
        if (text === "") {
            showToast("输入文本为空", {icon: "error"})
            return
        }
        that.setData({
            graph: {
                type: 'text',
                text: text,
            },
            show_add_text_input: false,
        })
    },
    onInputBlur(e) {
        let that = this,
            text = e.detail.value ?? ""
        if (text) {
            that.setData({
                text: text,
            })
        }
    },
    pickColor(e) {},
});
