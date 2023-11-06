import {getRecordDetail} from "../../../utils/api";
import {showToast} from "../../../utils/util";
import moment from "moment";

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
            active = that.data.active

        wx.showLoading()
        that.setData({
            isRefresh: true,
        })
        getRecordDetail(active).then(res => {
            console.log('getRecordDetail', res)
            let code = res.code,
                data = res.data
            if (code !== 200) {
                showToast("数据拉取失败", {icon: "error"})
                return false
            }

            data = data.map((item) => {
                let datetime = new Date(item.create_time)
                item.datetime = moment(datetime).fromNow()
                return item
            })
            let page = that.data.pages[active]
            if (page >= 1) {
                data = data.concat(that.data.record[active])
            }

            that.setData({
                [`record.${active}`]: data,
                isRefresh: false,
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
            totalPage = that.data.totalPage,
            active = that.data.active,
            page = that.data.pages[active]

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
            active = that.data.active
        that.setData({
            [`pages.${active}`]: 1,
            isDone: false,
            isRefresh: true,
        })
        that.onLoadData()
    },
});
