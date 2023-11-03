import {FEEDBACK_APPID, OPEN_ID, TOKEN, USERS} from "./config";
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

/**
 *
 * @param id
 */
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

function getOpenID() {
    return wx.getStorageSync(OPEN_ID) ?? ""
}

function setToken(token = "") {
    wx.setStorageSync(TOKEN, token)
}

function getToken() {
    return wx.getStorageSync(TOKEN) ?? ""
}


function setLocalInfo(users = {}) {
    wx.setStorageSync(USERS, users)
}

function getLocalInfo() {
    return wx.getStorageSync(USERS) ?? {}
}

function getLocalUid() {
    let users = getLocalInfo(),
        uid = users.uid ?? 0

    console.log('getLocalUid users', users)
    uid = parseInt(uid)
    return uid
}

function getDayDate() {
    // 获取当前时间
    let now = new Date();

    // 格式化当前时间为 "xx日 时:分"
    return  ('0' + now.getDate()).slice(-2)  + '日' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2)
}

function getTimeDate() {
    // 获取当前时间
    let now = new Date();

    // 格式化当前时间为 "年/月/日 时:分:秒"
    return now.getFullYear() + '/' +
        ('0' + (now.getMonth() + 1)).slice(-2) + '/' +
        ('0' + now.getDate()).slice(-2) + ' ' +
        ('0' + now.getHours()).slice(-2) + ':' +
        ('0' + now.getMinutes()).slice(-2) + ':' +
        ('0' + now.getSeconds()).slice(-2)
}

function formatDateToYYYYMMDD(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 增加零填充
    const day = date.getDate().toString().padStart(2, '0'); // 增加零填充
    return `${year}-${month}-${day}`;
}

module.exports = {goto, gotoFeedback, showToast, gotoDetail, historyBack, previewImage,
    getOpenID, setToken, getToken, getTimeDate, setLocalInfo, getLocalInfo, getLocalUid,
    formatDateToYYYYMMDD, getDayDate}
