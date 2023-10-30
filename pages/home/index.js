
const app = getApp()
Page({
    data: {
        spot: ["2023/09/22"],
        list: app.globalData.tabbar,
    },
    onLoad: function (options) {

    },
    onDateChange: function(e) {
        console.log('onDateChange', e)
    }
});
