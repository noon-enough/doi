import {historyBack, previewImage, showToast} from "../../utils/util";
import {classifyDetail, updateEmotion} from "../../utils/api";

Page({
    data: {
        id: 0,
        info: {},
        emotions: [],
        everyRowNumber: 4,
        multipleSize: 160,
        itemHeight: 160,
        gapRow: 20,
        gapColumn: 20,
        multipleMode: "aspectFill",
        is_show_image_viewer: false,
        viewers: [],
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        urls: [],
    },
    onLoad: function (options) {
        let that = this,
            id = options.id  ?? 0
        if (id === 0) {
            historyBack()
            return
        }
        that.setData({
            id: id,
        })

        that.getDetail()
    },
    getDetail() {
        let that = this,
            id = that.data.id ?? 0
        wx.showLoading()
        classifyDetail(id).then(res => {
            console.log('classifyDetail', res)
            let code = res.code ?? 200,
                data = res.data ?? {},
                message = res.message ?? ""
            if (code !== 200) {
                showToast(message, {icon: "error"})
                return
            }

            let urls = data.emotions.map((item) => {
                return item.url
            })

            that.setData({
                urls: urls,
                info: data.info,
                emotions: data.emotions,
                isRefresh: false,
            })
            wx.setNavigationBarTitle({
                title: data.info.name
            })
        }).catch(res => {
            showToast("数据拉取失败", {icon: "error"})
        }).finally(() => {
            wx.hideLoading()
        })
    },
    onShowPicture(e) {
        previewImage(e)
    },
    onLongTap(e) {
        previewImage(e)
    },
    onPullDownRefresh() {
        let that = this
        that.setData({
            classify: [],
            isRefresh: true,
        })
        that.getDetail()
    },
    onScroll(e) {
        const { scrollTop } = e.detail;

        this.setData({
            backTopVisible: scrollTop > 100,
        });
    },
    onShareAppMessage(options) {
        let that = this,
            info = that.data.info
        return {
            title: `【${info.name}】最全最热表情包，上班聊天都用她`,
            path: `/pages/ detail/index?id=${info.id}`,
        }
    }
});
