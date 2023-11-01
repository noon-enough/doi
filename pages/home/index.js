import {getTimeDate, showToast} from "../../utils/util";
import {recode} from "../../utils/api";

const app = getApp()
Page({
    data: {
        spot: ["2023/09/22"],
        list: app.globalData.tabbar,
        status: [],
        posture: [],
        recode: {
            create_time: getTimeDate(),
            watcher: false,
            duration: 10,
            comment: "",
            star: 3,
            status: 4,
            posture: [],
        },
        submit_loading: false,
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
    onLoad: function (options) {
        let that = this

    },
    onDateChange: function(e) {
        console.log('onDateChange', e)
    },
    onDurationChange: function(e) {
        let that = this,
            duration = e.detail.value ?? 10
        duration = parseInt(duration)
        that.setData({
            ['recode.duration']: duration
        })
    },
    onWatcherChange: function(e) {
        let that = this,
            watcher = !!e.detail.value
        that.setData({
            ['recode.watcher']: watcher
        })
    },
    onStarChange: function(e) {
        let that = this,
            star = e.detail.value ?? 3
        star = parseInt(star)

        that.setData({
            ['recode.star']: star,
        })
    },
    onStatusChange: function(e) {
        let that = this,
            status = e.detail.value ?? 3
        status = parseInt(status)

        that.setData({
            ['recode.status']: status,
        })
    },
    onPostureChange: function(e) {
        let that = this,
            posture = e.detail.value ?? 3

        that.setData({
            ['recode.posture']: posture,
        })
    },
    onCommentChange: function(e) {
        let that = this,
            comment = e.detail.value ?? ""
        comment = comment.trim()

        that.setData({
            ['recode.comment']: comment,
        })
    },
    onSubmit: function(e) {
        let that = this,
            data = that.data.recode

        wx.showLoading()
        that.setData({
            submit_loading: true,
        })
        data.create_time = (new Date(data.create_time)).getTime() / 1000;

        console.log('data', data)
        recode(data).then(res => {
            console.log('recode', res)
            let code = res.code,
                data = res.data
            if (code !== 200) {
                showToast(res.message ?? "非法操作", {icon: "error"})
                return false
            }
            showToast("记录成功，保持哦～～", {icon: "success"})
            // 还原
            that.setData({
                recode: {
                    create_time: getTimeDate(),
                    watcher: false,
                    duration: 10,
                    comment: "",
                    star: 3,
                    status: 4,
                    posture: [],
                },
            })
        }).finally(() => {
            wx.hideLoading()
            that.setData({
                submit_loading: false,
            })
        })
    },
});
