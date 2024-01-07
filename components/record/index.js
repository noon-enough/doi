import {getTimeDate, showToast} from "../../utils/util";
import {RATE_ARRAY} from "../../utils/config";
import moment from "moment";
import {addPosture} from "../../utils/api";

Component({
    properties: {
        posture: {
            type: Array,
            value: [],
        },
        status: {
            type: Array,
            value: [],
        },
        recode: {
            type: Object,
            value: {
                create_time: getTimeDate(),
                watcher: false,
                duration: 10,
                comment: "",
                star: 3,
                status: 4,
                posture: [],
                partner: "",
            },
        }
    },
    data: {
        rateTexts: RATE_ARRAY,
        datetime_visible: false,
        last_start_event_time: "",
        show_add_dialog: false,
        content: "",
        type: "add",
        id: 0,
    },
    methods: {
        onEventTimeChange: function(e) {
            let that = this,
                create_time = e.detail.value
            that.setData({
                ['recode.create_time'] : create_time,
            })
        },
        onEventTimePick: function(e) {
            console.log('onEventTimePick', e)
        },
        onShowEventTime: function(e) {
            let that = this
            that.setData({
                datetime_visible: true,
            })
        },
        onEventTimeHide: function() {
            let that = this
            that.setData({
                datetime_visible: false,
            })
        },
        onDurationChange: function(e) {
            let that = this,
                duration = e.detail.value ?? 10

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

            that.setData({
                ['recode.star']: star,
            })
        },
        onStatusChange: function(e) {
            let that = this,
                status = e.detail.value ?? 3

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
        onPartnerChange: function(e) {
            let that = this,
                partner = e.detail.value ?? ""
            partner = partner.trim()

            that.setData({
                ['recode.partner']: partner,
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
            console.log('components onsubmit', e)
            this.triggerEvent('submit',  data);
        },
        onAddPosture(e) {
            let that = this
            // 可以弹窗一下。

            console.log('onAddPosture', e)
            that.setData({
                show_add_dialog: true,
            })
            that.triggerEvent('onPosture', e)
        },
        closeAddDialog(e) {
            let that = this
            that.setData({
                show_add_dialog: false,
            })
        },
        onContentChange(e) {
            let that = this,
                content = e.detail.value ?? ''
            content = content.trim()
            that.setData({
                content: content,
            })
        },
        confirmAddDialog(e) {
            let that = this,
                content = that.data.content ?? '',
                type = that.data.type,
                id = that.data.id,
                idx = that.data.idx
            if (content === '') {
                showToast('类名不能为空', {icon: "error"})
                return false
            }
            wx.showLoading()
            if (type === 'edit') {
            } else if (type === 'add') {
                addPosture(content).then(res => {
                    let code = res.code,
                        data = res.data
                    if (code !== 200) {
                        showToast('添加失败', {icon: 'error'})
                        wx.hideLoading()
                        return false
                    }
                    that.properties.posture.unshift(data)
                    that.setData({
                        posture: that.properties.posture,
                        type: 'add',
                        id: 0,
                        idx: 0,
                        content: '',
                        show_add_dialog: false,
                    })
                    showToast('添加成功', {icon: "success"})
                    that.triggerEvent('onPosture', {
                        type: type,
                        content: content,
                    })
                    wx.hideLoading()
                })
            }

        },
    },
    observers: {
        "posture": function(posture) {
            let that = this
        },
        "recode": function(recode) {
            console.log('observers recode', recode)
        }
    },
    lifetimes: {
        attached() {
            let that = this,
                create_time = that.properties.recode.create_time,
                lastDay = moment(create_time).add(-30, 'days').format('YYYY-MM-DD HH:mm:ss')

            that.setData({
                last_start_event_time: lastDay,
            })
        }
    },
});
