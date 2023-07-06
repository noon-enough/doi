import tabbar from "./tabbar";

App({
    onLaunch(options) {
        // 无网络
        wx.onNetworkStatusChange((res) => {

        })

        let width = wx.getSystemInfoSync().windowWidth,
            height = wx.getSystemInfoSync().windowHeight,
            sdk_version = wx.getSystemInfoSync().SDKVersion,
            that = this

        that.globalData.system = {
            width: width,
            height: height,
            sdk_version: sdk_version,
        }
    },
    onError(error) {
        console.error('got Error', error)
    },
    onPageNotFound(options) {
    },
    globalData: {
        users: {},
        tabbar: tabbar,
        system: {
            sdk_version: '',
            width: 0,
            height: 0
        }
    }

})
