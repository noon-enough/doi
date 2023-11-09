import {cancel} from "../../../utils/api";
import {goto, redirect, setLocalInfo, showToast} from "../../../utils/util";

const app = getApp()
Page({
    data: {
        submit_loading: false,
        uid: 0,
    },
    onUsersLoad() {
        let that = this,
            uid = app.globalData.users.uid ?? 0
        that.setData({
            uid: uid,
        })
    },
    onLoad: function (options) {

    },
    onSubmit() {
        let that = this,
            uid = that.data.uid

        that.setData({
            submit_loading: true,
        })

        cancel(uid).then(res => {
            let code = res.code,
                data = res.data
            if (code !== 200) {
                showToast('注销申请失败', {icon: 'error'})
                return false
            }

            app.globalData.users = data
            setLocalInfo(data)
            showToast('注销申请成功', {icon: 'success'})
            setTimeout(function() {
                redirect('/pages/mine/status/index')
            }, 2000)
        })
    },
});
