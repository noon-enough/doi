import {getTimeDate, showToast} from "../../utils/util";

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
            }
        }
    },
    data: {},
    methods: {
        onDurationChange: function(e) {
            let that = this,
                duration = e.detail.value ?? 10
            duration = parseInt(duration)
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
            star = parseInt(star)

            that.setData({
                ['recode.star']: star,
            })
        },
        onStatusChange: function(e) {
            let that = this,
                status = e.detail.value ?? 3
            status = parseInt(status)

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
    }
});
