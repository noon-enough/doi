import {getRecordDetail, login, recordDelete} from "../../../utils/api";
import {goto, gotoRecordDetail, showToast} from "../../../utils/util";
import moment from "moment";
import {RATE_ARRAY} from "../../../utils/config";

const app = getApp()
moment.defineLocale('zh-cn', {
    relativeTime: {
        future: '%s内',
        past: '%s前',
        s: '几秒',
        m: '1分钟',
        mm: '%d分钟',
        h: '1小时',
        hh: '%d小时',
        d: '1天',
        dd: '%d天',
        M: '1个月',
        MM: '%d个月',
        y: '1年',
        yy: '%d年'
    },
})

Page({
    data: {
        rateTexts: RATE_ARRAY,
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        active: 'count',
        record: {
            'count': [],
            'watcher': [],
            'share': [],
        },
        pages: {
            'count': 1,
            'watcher': 1,
            'share': 1,
        },
        isDone: {
            'count': false,
            'watcher': false,
            'share': false,
        },
        totalPage: {
            'count': 1,
            'watcher': 1,
            'share': 1,
        }
    },
    onLoadLogin(options){
        let that = this
        that.onLoadData()
    },
    onLoad: function (options) {
        let that = this,
            active = options.active ?? 'count'

        that.setData({
            active: active,
        })
    },
    onLoadData() {
        let that = this,
            active = that.data.active,
            isDone = that.data.isDone[active],
            page = that.data.pages[active]

        if (isDone === true) {
            return
        }
        wx.showLoading()
        that.setData({
            isRefresh: true,
        })
        getRecordDetail(active, page).then(res => {
            console.log('getRecordDetail', res)
            let code = res.code,
                data = res.data.data ?? [],
                isDone = false,
                totalPage = res.data.totalPage ?? 1
            if (code !== 200) {
                showToast("数据拉取失败", {icon: "error"})
                return false
            }

            data = data.map((item) => {
                let datetime = new Date(item.create_time * 1000)
                item.datetime = moment(datetime).fromNow()
                return item
            })
            let page = that.data.pages[active]
            if (page > 1) {
                data = data.concat(that.data.record[active])
            }
            if (page >= totalPage) {
                isDone = true
            }
            that.setData({
                [`record.${active}`]: data,
                isRefresh: false,
                [`totalPage.${active}`]: totalPage,
                [`isDone.${active}`]: isDone,
            })
        }).finally(() => {
            wx.hideLoading()
            that.setData({
                isRefresh: false,
            })
        })
    },
    onTabsChange(e) {
        let that = this,
            value = e.detail.value ?? 'count'

        that.setData({
            active: value,
        })

        that.onLoadData()
    },
    onReachBottom() {
        let that = this,
            active = that.data.active,
            totalPage = that.data.totalPage[active],
            page = that.data.pages[active]

        const nextPage = page + 1
        console.log('onReachBottom', nextPage)
        if (nextPage > totalPage) {
            that.setData({
                [`isDone.${active}`]: true,
            })
            return
        }
        that.setData({
            isDone: false,
            [`pages.${active}`]: nextPage,
        })
        that.onLoadData()
    },
    onScrollToBottom(e) {
        let that = this
        that.onReachBottom()
    },
    onScroll(e) {
        let that = this,
            { scrollTop } = e.detail,
            windowHeight = app.globalData.system.height

        if (scrollTop >= 400) {
            that.setData({
                show_backtop: true,
            })
        }
    },
    onPullDownRefresh() {
        let that = this,
            active = that.data.active,
            isDone = that.data.isDone[active]
        that.setData({
            [`pages.${active}`]: 1,
            [`isDone.${active}`]: false,
            isRefresh: true,
        })
        that.onLoadData()
    },
    onRecordModify(e) {
        let that = this,
            id = e.currentTarget.dataset.id ?? 0
        goto(`/pages/mine/record/modify/index?id=${id}`)
    },
    onRecordDelete(e) {
        let that = this,
            id = e.currentTarget.dataset.id ?? 0,
            active = that.data.active,
            idx = e.currentTarget.dataset.idx ?? 0,
            data = that.data.record[active]
        id = parseInt(id)
        if (id === 0) {
            showToast("删除失败", {icon: "error"})
            return false
        }

        wx.showLoading()
        recordDelete(id).then(res => {
            let code = res.code
            if (code !== 200) {
                showToast("删除失败", {icon: "error"})
                return false
            }
            showToast("删除成功", {icon:"success"})
            data = data.splice(idx, 1)
            console.log('data', data, 'idx', idx)
            that.setData({
                [`recode.${active}`]: data,
            })
            wx.hideLoading()
        })
    },
    onRecordDetail(e) {
        let that = this,
            id = e.currentTarget.dataset.id  ?? 0

        gotoRecordDetail(id)
    },
    onRecordShare(e) {
        let that = this,
            id = e.currentTarget.dataset.id ?? 0
        goto(`/pages/record/share/index?id=${id}`)
    },
});
