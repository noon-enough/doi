import {FEEDBACK_APPID} from "./config";
import {updateEmotion} from "./api";

/**
 * 跳转
 * @param url
 */
function goto(url) {
    console.log("goto", url)
    wx.navigateTo({
        url: url,
    })
}

function gotoDetail(id = 0) {
    goto(`/pages/detail/index?id=${id}`)
}

/**
 * 打开意见反馈
 */
function gotoFeedback() {
    wx.openEmbeddedMiniProgram({
        appId: FEEDBACK_APPID,
        envVersion: "release",
        extraData: {
            "id": OBJECT
        }
    })
}

function historyBack(success = function (){} ) {
    const pages = getCurrentPages();
    if (pages.length >= 2) {
        wx.navigateBack({
            delta: 1,
            success: success,
        })
    } else {
        wx.switchTab({
            url: "/pages/index/index"
        })
    }
}

/**
 * 弹窗
 * @param msg
 * @param icon
 */
function showToast(msg, {icon = 'success'}) {
    wx.showToast({
        title: msg,
        icon: icon,
    })
}

function previewImage(e = {}, views = []) {
    console.log('previewImage', e)
    let that = this,
        url = e.currentTarget.dataset.url ?? "",
        id = e.currentTarget.dataset.id ?? 0,
        urls = views.length <= 0 ? [url] : views
    updateEmotion(id).then(res => {
        wx.previewImage({
            referrerPolicy: true,
            current: url, // 当前显示图片的http链接
            urls: urls, // 需要预览的图片http链接列表
            success: function(res ){
                console.log('previewImage success', res)
            },
        })
    }).catch(res => {})
}

/**
 *
 * @type {{goto: goto, heroDetail: heroDetail, getSessionName: (function(string=): string), showToast: showToast, getSession: (function(*): string), gotoFeedback: gotoFeedback, getSessionFromStorage: (function(): *), lineupDetail: lineupDetail}}
 */
module.exports = {goto, gotoFeedback, showToast, gotoDetail, historyBack, previewImage}
