import {getDayDate, getTimeDate, historyBack, showToast} from "../../../../utils/util";
import {getRecordItem, putRecordItem, record} from "../../../../utils/api";

const app = getApp()
Page({
    data: {
        status: [],
        postureL: [],
        place: [],
        record: {},
        id: 0,
        show_modify_record: false,
    },
    onLoadStatus() {
        let that = this,
            status = app.globalData.statusData ?? []

        that.setData({
            status: status,
        })
    },
    onLoadPosture() {
        let that = this,
            posture = app.globalData.postureData ?? []

        that.setData({
            posture: posture,
        })
    },
    onLoadPlace() {
        let that = this,
            place = app.globalData.placeData ?? []

        that.setData({
            place: place,
        })
    },
    onLoadUsers(){
        // 拿到用户信息了，可以走依赖用户信息的逻辑了
        let that = this
        that.onLoadData()
    },
    onLoad: function (options) {
        let that = this,
            id = options.id ?? 0
        if (id === 0) {
            showToast("数据加载失败", {icon: "error"})
            setTimeout(function() {
                historyBack()
            }, 2000)
            return false
        }

        that.setData({
            id: id,
        })
    },
    onLoadData() {
        let that = this,
            id = that.data.id

        wx.showLoading()
        getRecordItem(id).then(res => {
            console.log('getRecordItem', res)
            let code = res.code,
                data = res.data
            if (code !== 200) {
                showToast('数据加载失败', {icon: "error"})
                wx.hideLoading()
                return false
            }

            data.create_time = getTimeDate(data.create_time)
            that.setData({
                record: data,
                show_modify_record: true,
            })
            wx.hideLoading()
            console.log('that.data.record', that.data.record)
        })
    },
    onSubmit: function(e) {
        let that = this,
            data = e.detail,
            id = that.data.id

        wx.showLoading()
        data.create_time = (new Date(data.create_time)).getTime() / 1000;

        console.log('payload', data)
        putRecordItem(id, data).then(res => {
            console.log('recode', res)
            let code = res.code,
                data = res.data
            if (code !== 200) {
                showToast(res.message ?? "非法操作", {icon: "error"})
                return false
            }
            showToast("记录修改成功", {icon: "success"})
            setTimeout(function() {
                historyBack()
            }, 2000)
        }).finally(() => {
            wx.hideLoading()
        })
    },
});
