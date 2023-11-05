import {formatDateToYYYYMMDD, getTimeDate, showToast} from "../../utils/util";
import {recode, recodeList} from "../../utils/api"
import {STATUS_COLORS} from "../../utils/config";

const app = getApp()
Page({
    data: {
        today: [],
        last_30_records: [],
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
    onLoadLogin(options){
        // 已经登录，可以走依赖token的逻辑了
        console.log('首页的onLoadLogin',options,`{"token":"${app.globalData.token}"}`);
    },
    onShowLogin(options){
        // 每次显示页面时都会执行的逻辑在这里
        console.log('首页的onShowLogin',options,`{"token":"${app.globalData.token}"}`);
    },
    onLoadUsers(options){
        const userinfo = JSON.stringify(app.globalData.users)
        // 拿到用户信息了，可以走依赖用户信息的逻辑了
        console.log('首页的onLoadUsers', options, userinfo)
        // let that = this,
        //     timestamp = getTimeDate(),
        //     uid = app.globalData.users.uid ?? 0
        // uid = parseInt(uid)
        // that.onLoadData(uid, timestamp)
    },
    onReadyUsers(options){
        const userinfo = JSON.stringify(app.globalData.users)
        // 渲染完毕，并且拿到了用户信息，可以去走类似在canvas上渲染用户头像的逻辑了
        console.log('首页的onReadyUser',options,userinfo);
    },
    onReadyShowUsers(options){
        const userinfo = JSON.stringify(app.globalData.users)
        // 渲染完完毕 && 每次显示页面 && 拿到用户信息
        console.log('首页的onReadyShowUser',options,userinfo);
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
        let that = this,
            timestamp = getTimeDate(),
            uid = app.globalData.users.uid ?? 0
        uid = parseInt(uid)
        // that.onLoadData(uid, timestamp)
    },
    onLoadData(uid, timestamp) {
        let that = this,
            status = app.globalData.statusData
        wx.showLoading()
        recodeList(uid, timestamp).then(res => {
            console.log('recodeList', res)
            let code = res.code,
                data = res.data,
                last_30_records = data.last_30_records ?? [],
                last_ten_records = data.last_ten_records ?? [],
                today = []
            if (code !== 200) {
                wx.hideLoading()
                showToast(res.message ?? "数据获取失败", {icon: "error"})
                return false
            }

            let marks = last_30_records.map((item) => {
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
                    color: STATUS_COLORS[item.status],
                }
            })

            const uniqueData = {}
            const now = new Date()
            const todayDate = now.toISOString().split('T')[0]

            console.log('todayDate', todayDate)
            last_30_records.forEach((item) => {
                const date = new Date(item.create_time);
                const formattedDate = date.toISOString().split('T')[0] // 格式化为YYYY-MM-DD
                if (!uniqueData[formattedDate] || date > new Date(uniqueData[formattedDate].create_time)) {
                    uniqueData[formattedDate] = item;
                }

                if (todayDate === item.date) {
                    today.push(item)
                }
            })

            // 转回数组形式
            const result = Object.values(uniqueData);
            result.forEach((item) => {
                marks.push({
                    year: item.Y,
                    month: item.m,
                    day: item.d,
                    type: 'corner',
                    text: "F",
                    color: STATUS_COLORS[item.status],
                })
            })

            that.setData({
                marks: marks,
                last_ten_records: last_ten_records,
                last_30_records: last_30_records,
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
