import {convertSecondsToTime, getTimeDate, showToast} from "../../utils/util";

const app = getApp()
Page({
    data: {
        datetime: "00:00:00",
        is_show_submit: false,
        action: 'play',
        setInter: null,
        list: app.globalData.tabbar,
        times: 1,
        duration: 1,
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
            partner: "",
        },
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
    onOptionsTap: function(e) {
        let that = this,
            action = e.currentTarget.dataset.action ?? 'play'
        console.log('action', action)
        if (action === 'play') {
            that.onStart()
        } else if (action === 'pause') {
            that.onDone()
        } else if (action === 'replay') {
            that.onReplay()
        }
    },
    onStart() {
        let that = this
        that.queryTime()
        that.setData({
            action: 'pause',
        })
    },
    onCleanTimer() {
        let that = this
        clearInterval(that.data.setInter)
        that.setData({
            setInter: null,
            action: 'play',
            datetime: "00:00:00"
        })
    },
    onReplay() {
        let that = this
        that.onCleanTimer()
        that.onStart()
    },
    onDone() {
        let that = this,
            times = that.data.times,
            duration = Math.floor((times % 3600) / 60)

        duration = duration <= 0 ? 1 : duration
        duration = duration >= 180 ? 180 : duration
        clearInterval(that.data.setInter)
        that.setData({
            setInter: null,
            action: 'play',
            times: 1,
        })
        console.log('duration', duration)
        that.setData({
            is_show_submit: true,
            ['recode.duration']: duration,
            ['recode.create_time']: getTimeDate(),
        })
    },
    queryTime(){
        let that = this

        that.data.setInter = setInterval(function(){
            let times = that.data.times + 1,
                datetime = convertSecondsToTime(times)
            that.setData({
                times: times,
                datetime: datetime,
            })
            console.log('times', times, 'datetime', datetime)
        },1000)
    },
    onSubmit: function(e) {
        let that = this,
            data = e.detail

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
