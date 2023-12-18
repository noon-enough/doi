import {getTimeDate, goto, redirect, showToast} from "../../utils/util";
import {record, recordList} from "../../utils/api"
import {STATUS_COLORS} from "../../utils/config";

const app = getApp()
Page({
    data: {
        uid: 0,
        markCalendarList: [{ date: '2023-12-10', pointColor: '#333' }, { date: '2023-12-06', pointColor: 'red' }, { date: '2023-12-13', pointColor: 'red' }],
        calendarView: 'week',
        weekText: ['日', '一', '二', '三', '四', '五', '六'],
        today: [],
        range_records: [],
        last_ten_records: [],
        marks: [],
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
    onLoadLogin(){
    },
    onLoadUsers(){
        // 拿到用户信息了，可以走依赖用户信息的逻辑了
        let that = this,
            timestamp = getTimeDate(),
            users =  app.globalData.users,
            uid = app.globalData.users.uid ?? 0

        // 看看是不是申请注销状态？
        let is_cancel = users.is_cancel ?? 0
        is_cancel = parseInt(is_cancel)

        if (is_cancel === 1) {
            redirect('/pages/mine/status/index')
            return
        }

        // that.onLoadData(uid, timestamp)
        that.setData({
            uid: uid,
        })

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
    onLoad: function (options) {
        let that = this
    },
    onShow() {
        let that = this
        that.onLoadStatus()
        that.onLoadPosture()
    },
    onLoadData(uid, begin, end) {
        let that = this,
            status = app.globalData.statusData
        wx.showLoading()
        recordList(uid, begin, end).then(res => {
            console.log('recodeList', res)
            let code = res.code,
                data = res.data,
                last_record = data.last_record ?? [],
                last_ten_records = data.last_ten_records ?? [],
                range_records = data.range_records ?? {},
                today = [],
                marks = {}
                
            if (code !== 200) {
                wx.hideLoading()
                showToast(res.message ?? "数据获取失败", {icon: "error"})
                return false
            }

            for (const key in range_records) {
                marks[key] = range_records[key].map((item) => {
                    let comment = item.comment
                    if (comment === "") {
                        comment = `一个${item.duration}''的做爱事件`
                    }
                        return  {
                                    year: item.Y,
                                    month: item.m,
                                    day: item.d,
                                    type: 'schedule',
                                    text: comment,
                                    color: STATUS_COLORS[item.status]
                                }
                })
            }

            that.setData({
                last_record: last_record,
                marks: marks,
                last_ten_records: last_ten_records,
                range_records: range_records,
                today: today,
            })
            console.log('marks', marks, 'status', status, 'today', today)
        }).finally(() => {
            wx.hideLoading()
        })
    },
    onDateChange: function(e) {
        console.log('onDateChange', e)
    },
    onCalendarLoad: function(e) {
        const calendar = this.selectComponent('#calendar');
        console.log('calendar-load', calendar);
    },
    onCalendarChange: function(e) {
        console.log('onCalendarChange', e)
        let that = this,
            last_30_records = that.data.last_30_records,
            today = !!e.detail.checked.today,
            year = e.detail.checked.year,
            month = e.detail.checked.month,
            day = e.detail.checked.day,
            date = `${year}-${month}-${day}`,
            todayData = []

        // date = formatDateToYYYYMMDD(date)
        console.log('today', today, 'year', year, 'month', month, 'day', day, 'date', date)
        last_30_records.forEach((item) => {
            console.log('date', date, 'item.date', item.date)
            if (date === item.date) {
                todayData.push(item)
            }
        })

        that.setData({
            today: todayData,
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
    onRangeDate(e) {
        let {beginTime, endTime} = e.detail,
            that = this,
            uid = app.globalData.users.uid ?? 0
        
        wx.showLoading()

        console.log('onRangeDate', beginTime, endTime)
        that.onLoadData(uid, beginTime, endTime)
    },
    onSelect(e) {
        console.log('onSelect', e)
    }
});
