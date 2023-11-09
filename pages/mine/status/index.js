import {goto, setLocalInfo, showToast, switchTab} from "../../../utils/util";
import {unCancel} from "../../../utils/api";

const app = getApp()
Page({
    data: {
        users: {},
        button: {
            theme: 'text',
            size: 'small',
            name: '重新激活'
        },
    },
    onUsersLoad() {
        let that = this,
            users = app.globalData.users

        that.setData({
            users: users,
        })
    },
    onLoad: function (options) {

    },
    onUnCancel(e) {
        console.log('onUnCancel', e)
        let that = this,
            uid = that.data.users.uid ?? 0
        if (uid === 0) {
            showToast("重新激活失败", {icon: "error"})
            return false
        }

        unCancel(uid).then(res => {
            let code = res.code,
                message = res.message ?? '重新激活失败',
                data = res.data ?? {}

            if (code !== 200) {
                showToast(message, {icon: "error"})
                return false
            }

            showToast("激活成功", {icon: "success"})
            setLocalInfo(data)
            app.globalData.users = data
            setTimeout(function() {
                switchTab("/pages/home/index")
            }, 2000)
        })
    }
});
