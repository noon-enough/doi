import {hot, recommend, updateEmotion} from "../../utils/api";
import {previewImage, showToast} from "../../utils/util";

const app = getApp()
Page({
    data: {
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        hot: [],
        query: "",
        page: 1,
        size: 50,
        actionText: "",
        everyRowNumber: 4,
        multipleSize: 160,
        itemHeight: 160,
        gapRow: 20,
        gapColumn: 20,
        multipleMode: "aspectFill",
        list: app.globalData.tabbar,
        totalPage: 1,
        isDone: false,
        show_backtop: false,
        recommend: [],
    },
    onLoad(query) {
        let that = this
        that.getHot()
        that.getRecommend()
    },
    clearHandle(e) {
        const that = this
        that.setData({
            page: 1,
            query: "",
            isDone: false,
        })
        that.getHot()
    },
    changeHandle(e) {
        const { value } = e.detail,
            that = this
        that.setData({
            page: 1,
            query: value,
            isDone: false,
        })
        that.getHot()
    },
    focusHandle() {
        this.setData({
            actionText: '取消',
        });
    },
    blurHandle() {
        this.setData({
            actionText: '',
        });
    },
    actionHandle() {
        this.setData({
            value: '',
            actionText: '',
        });
    },
    submitHandle(e) {
        const { value } = e.detail,
            that = this
        that.setData({
            query: value,
        })
        console.log('submitHandle', value)

        that.getHot()
    },
    getRecommend() {
        const that = this,
            size = 10

        recommend(size).then(res => {
            console.log('recommend', res)
            let code = res.code ?? 200,
                message = res.message ?? "",
                data = res.data ?? []

            if (code !== 200) {
                showToast(message, {icon: "error"})
                return
            }

            data = data.map((item) => {
                item.url = {
                    "url": `/pages/detail/index?id=${item.id}`
                }
                return item
            })
            that.setData({
                recommend: data,
            })
        }).catch(()=> {
            showToast("数据拉取失败", {icon: "error"})
        })
    },
    getHot() {
        const that = this,
            query = that.data.query ?? "",
            page = that.data.page ?? 1,
            size = that.data.size ?? 20,
            isDone = that.data.isDone

        if (isDone === true) {
            return
        }
        wx.showLoading()
        hot(query, page, size).then(res => {
            console.log('hot', res)
            let code = res.code ?? 200,
                message = res.message ?? "",
                data = res.data ?? []

            if (code !== 200) {
                showToast(message, {icon: "error"})
                return
            }

            if (page > 1) {
                data = that.data.hot.concat(data)
            }

            that.setData({
                isRefresh: false,
                hot: data,
                totalPage: res.extra.totalPage ?? 1,
            })
        }).catch(res => {
            showToast("数据拉取失败", {icon: "error"})
        })
        wx.hideLoading()
    },
    onPullDownRefresh() {
        let that = this
        wx.startPullDownRefresh()
        that.setData({
            page: 1,
            isDone: false,
            isRefresh: true,
        })
        that.getRecommend()
        that.getHot()
        wx.stopPullDownRefresh()
    },
    onReachBottom() {
        const
            that = this,
            totalPage = that.data.totalPage,
            page = that.data.page

        const nextPage = page + 1
        console.log('onReachBottom', nextPage)
        if (nextPage > totalPage) {
            that.setData({
                isDone: true,
            })
            return
        }
        that.setData({
            isDone: false,
            page: nextPage,
        })
        that.getHot()
    },
    onShowPicture(e) {
        previewImage(e)
    },
    onToTop(e) {
        console.log('backToTop', e)
        wx.pageScrollTo({
            scrollTop: 0
        })
    },
    onPageScroll(e) {
        let that = this,
            scrollTop = e.scrollTop
        if (scrollTop >= 100) {
            that.setData({
                show_backtop: true,
            })
        }
    },
    onShareAppMessage(options) {
        let that = this
        return {
            title: `全网热门表情包公社，上班聊天都用她`,
            path: `/pages/index/index`,
        }
    },
    onLongTap(e) {
        previewImage(e)
    },
})
