import {historyBack, showToast} from "../../../utils/util";
import {recordDetail, recordInvite} from "../../../utils/api";

Page({
    data: {
        id: 0,
        record: {},
        inviteCode: ''
    },
    onLoad: function (options) {
        let that = this,
            id = options.id ?? 0
        if (id === 0) {
            historyBack()
        }
        that.setData({
            id: id,
        })
        that.onLoadData()
    },
    onLoadData() {
        let that = this,
            id = that.data.id
        wx.showLoading()
        Promise.all([
            recordDetail(id),
            recordInvite(id)
        ]).then(([res, inviteRes])  => {
            console.log('inviteRes', inviteRes, 'res', res)
            let code = res.code,
                data = res.data,
                msg = res.message ?? '数据拉取失败',
                inviteCode = inviteRes.data.invite_code ?? ''

            if (code !== 200 || inviteCode === '') {
                showToast(msg, {icon: 'error'})
                return false
            }
            that.setData({
                record: data,
                inviteCode: inviteCode,
            })
        }).finally(res => {
            wx.hideLoading()
        })
    },
    onShareAppMessage(options) {
        let that = this,
            id = that.data.id,
            inviteCode = that.data.inviteCode,
            record = that.data.record
        return {
            title: `【你有一个${record['duration']}分钟的Doi记录急需查看】`,
            path: `/pages/mine/record/detail/index?id=${id}&invite=${inviteCode}`
        }
    }
});
