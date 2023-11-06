import {getTimeDate, goto, showToast} from "../../utils/util";
import {getRecord} from "../../utils/api";

const app = getApp()
Page({
    data: {
        users: {},
        uid: 0,
        list: app.globalData.tabbar,
        is_profile_full: false,
        count: 0,
        share_count: 0,
        watcher_count: 0,
    },
    onLoadLogin(options){
        let that = this
        that.onLoadData()
    },
    onLoadUsers(options){
        // 拿到用户信息了，可以走依赖用户信息的逻辑了
        let users = app.globalData.users ?? {},
            uid = users.uid ?? 0,
            that = this

        // 如果什么都获取不到就需要退出登录了
        // 我可以主动获取一次信息？
        that.setData({
            users: users,
            uid: parseInt(uid)
        })

        console.log('users', users)
    },
    onLoad: function (options) {
    },
    onLoadData() {
        let that = this
        wx.showLoading()
        getRecord().then(res => {
            console.log('getRecord', res)
            let code = res.code,
                data = res.data

            if (code !== 200) {
                wx.hideLoading()
                showToast("数据加载失败", {icon: "error"})
                return false
            }

            that.setData({
                count: data.count ?? 0,
                share_count: data.share_count ?? 0,
                watcher_count: data.watcher_count ?? 0,
            })
        }).finally(() => {
            wx.hideLoading()
        })
    },
    gotoModify() {
    },
    gotoMyProfile() {
    },
    onGotoChange(e) {
        let that = this,
            type = e.currentTarget.dataset.type ?? 'my-count'

        goto(`/pages/mine/record/index?active=${type}`)
    },
});
