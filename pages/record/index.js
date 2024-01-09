import {convertSecondsToTime, getTimeDate, showToast} from "../../utils/util"
import dayjs from "dayjs"
import {record} from "../../utils/api";

const app = getApp()
Page({
    data: {
        hours: '00',
        minutes: '00',
        seconds: '00',
        running: false,
        timer: null,
        startTime: null,
        elapsedTime: 0,
        is_show_submit: false,
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
            that.resetTimer()
        }
    },
    onStart() {
        let that = this,
            running = !!that.data.running

        // 暂停
        if (running === true) {
            clearInterval(that.data.timer)
            that.setData({
                running: false,
                elapsedTime: dayjs().diff(this.data.startTime) + this.data.elapsedTime
            })
        } else {
            // 每次开始前，需要 clean一下
            clearInterval(that.data.timer)
            // 开始
            that.setData({
                running: true,
                startTime: dayjs(),
                timer: setInterval(that.updateTime, 1000)
            });
        }
    },
    stopTimer(cleanAll = true) {
        let that = this,
            data = {
                running: false,
                timer: null,
                startTime: null,
                elapsedTime: 0
            }
        if (cleanAll === true) {
            data.hours = '00'
            data.minutes = '00'
            data.seconds = '00'
        }
        clearInterval(that.data.timer);
        that.setData(data)
    },
    resetTimer() {
        let that = this
        that.stopTimer()
        that.onStart()
    },
    updateTime() {
        let that = this,
            {startTime, elapsedTime, running} =  that.data
        if (startTime !== null && elapsedTime !== null) {
            const now = dayjs();
            const diff = now.diff(startTime) + elapsedTime;

            const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
            const minutes = Math.floor(diff / 60000).toString().padStart(2, '0');
            const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');

            that.setData({
                hours,
                minutes,
                seconds
            }, () => {
                console.log('running', running, 'startTime', startTime, 'elapsedTime', elapsedTime)
            });
        }
    },
    onDone() {
        let that = this,
            {hours, minutes, seconds} = that.data

        // 转换为数字类型
        hours = Number(hours);
        minutes = Number(minutes);
        seconds = Number(seconds);

        // 计算总分钟数
        let duration = (hours * 60) + minutes + (seconds / 60);

        duration = Math.round(duration)

        duration = duration <= 0 ? 1 : duration

        that.stopTimer(false)
        that.setData({
            is_show_submit: true,
            ['recode.duration']: duration,
            ['recode.create_time']: getTimeDate(),
        })
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
        record(data).then(res => {
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
