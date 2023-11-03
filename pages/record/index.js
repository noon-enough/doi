
const app = getApp()
Page({
    data: {
        is_show_record: false,
        action: 'play',
        h:'00',
        m:'00',
        s:'00',
        setInter: null,
        list: app.globalData.tabbar,
        num: 1,
        duration: 1,
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
            that.onReplay()
        }
    },
    onStart() {
        let that = this
        that.queryTime()
        that.setData({
            action: 'pause',
        })
    },
    onCleanTimer() {
        let that = this
        clearInterval(that.data.setInter)
        that.setData({
            setInter: null,
            action: 'play',
            num: 1,
            h:'00',
            m:'00',
            s:'00',
        })
    },
    onReplay() {
        let that = this
        that.onCleanTimer()
        that.onStart()
    },
    onDone() {
        let that = this,
            h = parseInt(that.data.h),
            m = parseInt(that.data.m),
            s = parseInt(that.data.s),
            duration = 0
        clearInterval(that.data.setInter)
        that.onCleanTimer()
        if (h > 0) {
            duration += h * 60
        }
        if (m > 0) {
            duration += m
        }
        if (s > 0) {
            duration += 1
        }
        console.log('h', h, 'm', m, 's', s, 'duration', duration)
    },
    queryTime(){
        let that = this,
            hou=that.data.h,
            min=that.data.m,
            sec=that.data.s

        that.data.setInter = setInterval(function(){
            sec++
            if(sec>=60){
                sec=0
                min++
                if(min>=60){
                    min = 0
                    hou++
                    that.setData({
                        h:(hou<10? '0' + min:min)
                    })
                }else{
                    that.setData({
                        m:(min<10?'0'+min:min)
                    })
                }
            }else{
                that.setData({
                    s:(sec<10?'0'+sec:sec)
                })
            }

            let numVal = that.data.num + 1;
            that.setData({ num: numVal })
        },1000)
    },
});
