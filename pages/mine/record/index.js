import {getRecordDetail} from "../../../utils/api";

Page({
    data: {
        active: 'count',
        record: {
            'count': [],
            'watcher': [],
            'share': [],
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
        getRecordDetail(active).then(res => {
            console.log('getRecordDetail', res)
        }).finally(() => {
            wx.hideLoading()
        })
    },
    onTabsChange(e) {
        let that = this,
            value = e.detail.value ?? 'count'

        that.setData({
            active: value,
        })
    },
});
