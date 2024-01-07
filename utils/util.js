import {
    DELISTING_ARRAY,
    EDUCATION_ARRAY,
    FEEDBACK_APPID,
    JOB_ARRAY,
    MARITAL_ARRAY,
    OPEN_ID,
    ROLE_ARRAY,
    TOKEN,
    USERS,
    YEARLY_SALARY
} from "./config";
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

function switchTab(url) {
    console.log('switch-tab', url)
    wx.switchTab({
        url: url,
    })
}

function redirect(url) {
    console.log('redirect', url)
    wx.redirectTo({
        url: url,
    })
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
    return uid
}

function getDayDate() {
    // 获取当前时间
    let now = new Date();

    // 格式化当前时间为 "xx日 时:分"
    return  ('0' + now.getDate()).slice(-2)  + '日' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2)
}

function getTimeDate(timestamp = 0) {
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

function getConfigLabel(value, type = "delisting") {
    console.log('type', type, 'value', value)
    switch (type) {
        case "delisting":
            return DELISTING_ARRAY[value].label ?? ""
        case "marital":
            return MARITAL_ARRAY[value].label ?? ""
        case "job":
            return JOB_ARRAY[value].label ?? ""
        case "salary":
            return YEARLY_SALARY[value].label ?? ""
        case "education":
            return EDUCATION_ARRAY[value].label ?? ""
        case "role":
            return ROLE_ARRAY[value].label ?? ""
    }
}

/**
 *
 * @param inputDate
 * @returns {string}
 */
function formatDateToYYYYMMDD(inputDate) {
    console.log('inputDate', inputDate)
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 增加零填充
    const day = date.getDate().toString().padStart(2, '0'); // 增加零填充
    return `${year}-${month}-${day}`;
}


// 生成一个长度为10的随机字符串
function generateRandomString(length) {
    // 定义所有可能的字符
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // 定义一个空字符串用来存放结果
    let result = '';
    // 循环length次，每次从characters中随机选一个字符并拼接到result中
    for (let i = 0; i < length; i++) {
        result += characters.charAt (Math.floor (Math.random () * characters.length));
    }
    // 返回结果
    return result;
}


function getUploadFileKey(action = "avatar"){
    let uid = getLocalUid(),
        format = 'png'

    let string = formatUid(uid),
        path = ""
    if (action === "avatar") {
        path = `public/doi/avatar/${string}`
    } else {
        path = `public/doi/default/${string}`
    }

    return `${path}/${generateRandomString(20)}.${format}`
}

function formatUid (uid) {
    // 先用padStart方法在前面补0，然后用split方法按每4位分割成数组，最后用join方法用/连接
    return String (uid).padStart (10, '0').split (/(.{4})/).filter (x => x).join ('/');
}

/**
 *
 * @param seconds
 * @returns {string}
 */
function convertSecondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + secs.toString().padStart(2, '0');
}

module.exports = {goto, gotoFeedback, showToast, historyBack, previewImage,
    getOpenID, setToken, getToken, getTimeDate, setLocalInfo, getLocalInfo, getLocalUid,
    formatDateToYYYYMMDD, getDayDate, getConfigLabel, generateRandomString, getUploadFileKey,
    convertSecondsToTime, switchTab, redirect}
