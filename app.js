import tabbar from "./tabbar";
import {getLocalInfo, getToken, goto, setLocalInfo, setToken, showToast} from "./utils/util";
import {getPlaces, getPosture, getStatus, login} from "./utils/api";
import CustomHook from "spa-custom-hooks";

let globalData =  {
    token: "",
    openid: "",
    users: {},
    uid: 0,
    tabbar: tabbar,
    system_info: {},
    system: {
        sdk_version: '',
        width: 0,
        height: 0
    },
    statusData: [],
    postureData: [],
    placeData: [],
}

CustomHook.install({
    'Login':{
        name:'Login',
        watchKey: 'token',
        onUpdate(val){
            //有token则触发此钩子
            return !!val;
        }
    },
    'Users':{
        name:'Users',
        watchKey: 'users',
        onUpdate(users){
            return !!(users.uid ?? 0);
        }
    },
    'Status': {
        name: 'statusData',
        watchKey: 'statusData',
        onUpdate(statusData) {
            return statusData.length >= 1
        }
    },
    'Posture': {
        name: 'postureData',
        watchKey: 'postureData',
        onUpdate(postureData) {
            return postureData.length >= 1
        }
    },
    'Place': {
        name: 'placeData',
        watchKey: 'placeData',
        onUpdate(placeData) {
            return placeData.length >= 1
        }
    },
}, globalData || 'globalData')

App({
    globalData,
    onLaunch(options) {
        let system = wx.getSystemInfoSync(),
            width = system.windowWidth,
            height = system.windowHeight,
            sdk_version = system.SDKVersion,
            that = this,
            account = wx.getAccountInfoSync(),
            accountInfo = {
                'appid': account.miniProgram.appId ?? '',
                'version': account.miniProgram.version ?? '',
                'envVersion': account.miniProgram.envVersion ?? '',
            },
            systemInfo = {
                "sdk_version": sdk_version,
                "brand": system.brand,
                "model": system.model,
                "language": system.language,
                "platform": system.platform,
                "system": system.system,
                "version": system.version,
                'appid': accountInfo.appid,
                'app': accountInfo.version,
                'envVersion': accountInfo.envVersion,
            }

        wx.onNetworkStatusChange(function(res) {
            console.log('wx.onNetworkStatusChange', res)
        })

        console.log('wx.getAccountInfoSync()', wx.getAccountInfoSync(), 'systemInfo', systemInfo)
        let token = getToken()
        if (token === "") {
            wx.login({
                success: res => {
                    let code = res.code
                    console.log('code', code)
                    login({
                        code: code,
                        system: systemInfo,
                        type: 1,
                    }).then(res => {
                        console.log('res', res)
                        let code = res.code,
                            data = res.data,
                            message = res.message ?? "数据加载失败"
                        if (code !== 200) {
                            showToast(message, {icon: "error"})
                            return false
                        }
                        let users = data.users ?? {},
                            token = data.token ?? "",
                            uid = users.uid ?? 0

                        setToken(token)
                        setLocalInfo(users)

                        that.globalData.token = token
                        that.globalData.users = users

                        that.onStatusData()
                        that.onPostureData()
                        that.onPlaceData()
                    })
                },
            });
        } else {
            let users = getLocalInfo()

            that.globalData.token = token
            that.globalData.users = users

            that.onStatusData()
            that.onPostureData()
            that.onPlaceData()
        }

        that.globalData.system = {
            width: width,
            height: height,
            sdk_version: sdk_version,
            system_info: systemInfo,
            is_login: !!token,
        }
    },
    onError(error) {
        console.error('got Error', error)
    },
    onPageNotFound(options) {
    },
    onShowLogin(){
        console.log('app.js页onShowLogin');
    },
    onStatusData() {
        let that = this
        getStatus().then(res => {
            let data = res.data,
                code = res.code ?? 200

            console.log('app.js', 'getStatus', data)
            that.globalData.statusData = data
        })
    },
    onPostureData() {
        let that = this
        getPosture().then(res => {
            let data = res.data,
                code = res.code ?? 200
            console.log('app.js', 'getPosture', data)
            that.globalData.postureData = data
        })
    },
    onPlaceData() {
        let that = this
        getPlaces().then(res => {
            let data = res.data,
                code = res.code ?? 200
            console.log('app.js', 'getPlaces', data)
            that.globalData.placeData = data
        })
    },
})
