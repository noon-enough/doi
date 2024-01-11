import {getDayDate, getTimeDate, goto, gotoRecordDetail, redirect, showToast, switchTab} from "../../utils/util";
import {getStatistics, record, recordList} from "../../utils/api"
import {STATUS_COLORS} from "../../utils/config";

const app = getApp()
Page({
    data: {
        countdown: {
            days: "NaN天",
            hours: "NaN小时",
            minutes: "NaN分钟",
            seconds: "NaN秒",
        },
        in_month: {
            count: 0,
            durationPre: 0,
            sumDuration: 0,
        },
        datetime: getDayDate(),
        timer: null,
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        uid: 0,
        calendarView: 'week',
        weekText: ['日', '一', '二', '三', '四', '五', '六'],
        today: [],
        last_ten_records: [],
        list: app.globalData.tabbar,
        status: [],
        posture: [],
        place: [],
        recode: {
            create_time: getTimeDate(),
            watcher: false,
            duration: 10,
            comment: "",
            star: 3,
            status: 4,
            place: [],
            posture: [],
        },
        submit_loading: false,
        hasRecord: false,
    },
    onLoadLogin(){
    },
    onLoadUsers(){
        // 拿到用户信息了，可以走依赖用户信息的逻辑了
        let that = this,
            timestamp = getTimeDate(),
            users =  app.globalData.users,
            uid = app.globalData.users.uid ?? 0,
            is_cancel = users.is_cancel ?? 0

        // 看看是不是申请注销状态？
        is_cancel = parseInt(is_cancel)

        if (is_cancel === 1) {
            redirect('/pages/mine/status/index')
            return
        }

        that.setData({
            uid: uid,
        })

        that.onLoadData(uid)
        console.log('users', users, 'uid', uid)
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
    onLoad: function (options) {
        let that = this
    },
    onShow() {
        let that = this
        that.onLoadStatus()
        that.onLoadPosture()
        that.onLoadPlace()
    },
    onUnload: function() {
        clearInterval(this.timer);
    },
    onPullDownRefresh() {
        let that = this
        that.setData({
            isRefresh: true,
        })
        that.onLoadData(that.data.uid)
    },
    onScroll() {},
    onScrollToBottom(e) {},
    onLoadData(uid) {
        let that = this,
            status = app.globalData.statusData
        wx.showLoading()
        Promise.all([
            recordList(uid),
            getStatistics(),
        ]).then(([res, inMonthRes]) => {
            console.log('recodeList', res, 'getStatistics', res)

            let code = res.code,
                data = res.data,
                last_record = data.last_record ?? {},
                last_ten_records = data.last_ten_records ?? []

            if (code !== 200) {
                wx.hideLoading()
                that.setData({
                    isRefresh: false
                })
                showToast(res.message ?? "数据获取失败", {icon: "error"})
                return false
            }

            console.log('last_record', last_record, 'Object.prototype.isPrototypeOf(last_record)', Object.prototype.isPrototypeOf({}))
            let in_month = {},
                setData = {
                in_month: in_month,
                last_record: last_record,
                last_ten_records: last_ten_records,
                isRefresh: false,
                hasRecord: false,
            }

            if (Object.keys(last_record).length <= 0) {
                setData.hasRecord = false
            } else {
                if (inMonthRes.code === 200) {
                    in_month.count = Math.round(inMonthRes.data.count)
                    in_month.durationPre = Math.round(inMonthRes.data.durationPre)
                    in_month.sumDuration = Math.round(inMonthRes.data.sumDuration)
                }
                let createDate = new Date(last_record.create_time) * 1000

                setData.in_month = in_month
                setData.timer = setInterval(() => {
                    that.getTimeDifference(createDate);
                }, 1000)
                setData.hasRecord = true
            }

            that.setData(setData)
            wx.hideLoading()
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
    onRecordClick(e) {
        console.log('onRecordClick', e)
        switchTab('/pages/record/index')
    },
    onPosture(e) {
        console.log('onPosture', e)
    },
    getTimeDifference(createDate) {
        const now = new Date(), // 当前时间,
              that = this,
              diff = now - createDate; // 差异（毫秒）

        // 计算天数、小时数、分钟数和秒数
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);


        let msg =  `${days}天，${hours}小时，${minutes}分钟，${seconds}秒`
        that.setData({
            countdown: {
                days: `${days}天`,
                hours: `${hours}小时`,
                minutes: `${minutes}分钟`,
                seconds: `${seconds}秒`,
            },
        })
    },
    onRecordDetail(e) {
        let that = this,
            id = e.currentTarget.dataset.id  ?? 0

        gotoRecordDetail(id)
    }
});
