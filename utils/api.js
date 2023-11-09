import {d, get, post, put} from './http'
import {showToast} from "./util";

function classify() {
    return get("https://tft.qizue.com/emotions/classify")
}

function classifyDetail(id = 0) {
    return get(`https://tft.qizue.com/emotions/classify/${id}`)
}

function updateEmotion(id = 0) {
    return post(`https://tft.qizue.com/emotions/${id}`, "[]")
}

function hot(query = "", page = 1, size = 20) {
    return get(`https://tft.qizue.com/emotions/hot?query=${query}&page=${page}&size=${size}`);
}

function recommend(size = 10) {
    return get(`https://tft.qizue.com/emotions/recommend?size=${size}`);
}

/**
 *
 * @param data
 * @returns {Promise<SuccessParam<wx.RequestOption>>}
 */
function login(data) {
    return post(`/passport/login`, data)
}

function recordList(uid, date = "") {
    date = encodeURIComponent(date)
    return get(`/record/users/${uid}?date=${date}`)
}

function getRecord() {
    return get(`/record`)
}

function record(payload = {}) {
    return post('/record', payload)
}

function getStatus() {
    return get("/status")
}

function getPosture() {
    return get("/posture")
}

function getStatistics(period_time = '3months', status_time = '3months', duration_time = "3months") {
    return get(`/statistics?period_time=${period_time}&status_time=${status_time}&duration_time=${duration_time}`)
}


function getRecordDetail(action = 'count', page = 1) {
    return get(`/record/detail?active=${action}&page=${page}&limit=20`)
}

function getProfiles(uid = 0) {
    return get(`/users/${uid}`)
}

function setProfiles(uid = 0, payload = {}) {
    return put(`/users/${uid}`, payload)
}

function recordDelete(id) {
    return d(`/record/${id}`)
}

function getRecordItem(id) {
    return get(`/record/${id}`)
}

function putRecordItem(id, payload = {}) {
    return put(`/record/${id}`, payload)
}

function getCOSToken(key, action = "avatar") {
    return get(`/tencent/cos?action=${action}&key=` + encodeURI(key))
}

function getCOSAuthorization(options, callback) {
    // 初始化时不会调用，只有调用 cos 方法（例如 cos.putObject）时才会进入
    getCOSToken(options.Key, "avatar").then(res => {
        let data = res.data,
            code = res.code ?? 200,
            credentials = data.credentials;
        console.log('data', data)
        if (code !== 200) {
            showToast("图片上传失败", {icon: "error"})
            return
        }
        let func = {
            TmpSecretId: credentials.tmpSecretId,
            TmpSecretKey: credentials.tmpSecretKey,
            SecurityToken: credentials.sessionToken,
            // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
            StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
            ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000900
        }
        callback(func);
    }).catch(res => {
        console.log("getOSSToken error", res)
    })
}

function cancel(uid) {
    return post(`/users/${uid}/cancel`)
}

function unCancel(uid) {
    return post(`/users/${uid}/uncancel`)
}

function getPlaces() {
    return get('/places')
}

module.exports = {classify, classifyDetail, updateEmotion, hot, recommend, login,
    record, recordList, getStatus, getPosture, getStatistics, getRecord, getRecordDetail,
    getProfiles, setProfiles, recordDelete, getRecordItem, putRecordItem,
    getCOSAuthorization, cancel, unCancel, getPlaces}
