import {classify} from "../../utils/api";
import {goto, gotoDetail, showToast} from "../../utils/util";

const app = getApp()
Page({
    data: {
        classify: [],
        list: app.globalData.tabbar,
        everyRowNumber: 3,
        multipleSize: 220,
        itemHeight: 280,
        gapRow: 20,
        gapColumn: 20,
        multipleMode: "aspectFill",
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
    },
    onLoad: function (options) {
        let that = this

        wx.showLoading()
        that.getClassify()
    },
    getClassify() {
        let that = this
        classify().then(res => {
            console.log('data', res)
            let data = res.data ?? [],
                code = res.code ?? 200,
                message = res.message ?? ""

            if (code !== 200) {
                showToast(message, {icon: "error"})
                return false
            }

            that.setData({
                classify: data,
                isRefresh: false,
            })
        }).catch(res => {
            showToast("非法操作", {icon: "error"})
        })
        wx.hideLoading()
    },
    onPullDownRefresh() {
        let that = this
        that.setData({
            classify: [],
            isRefresh: true,
        })
        that.getClassify()
    },
    onScroll(e) {
        const { scrollTop } = e.detail;

        this.setData({
            backTopVisible: scrollTop > 100,
        });
    },
    onClassifyDetail(e) {
        let that = this,
            id = e.currentTarget.dataset.id ?? 0

        gotoDetail(id)
    },
    onShareAppMessage(options) {
        let that = this
        return {
            title: `全网热门表情包公社，上班聊天都用她`,
            path: `/pages/category/index`,
        }
    }
});
