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

function recordList(uid) {
   //  beginTime = encodeURIComponent(beginTime)
   // endTime = encodeURIComponent(endTime)
    return get(`/record/users/${uid}`)
}

function getRecord() {
    return get(`/record`)
}

function record(payload = {}) {
    return post('/record', payload)
}

function recordDetail(id) {
    return get(`/record/${id}`)
}

function recordComments(id, page = 1, limit = 20) {
    return get(`/record/${id}/comments?page=${page}&limit=${limit}`)
}

function recordCommented(id, data = {}) {
    return post(`/record/${id}/comments`, data)
}

function recordInvite(id) {
    return get(`/record/${id}/invite`)
}

function getStatus() {
    return get("/status")
}

function addPosture(name = '') {
    return post("/posture",  {
        'content': name,
    })
}

function deletePosture(id) {
    return d(`/posture/${id}`)
}

function getPosture() {
    return get("/posture")
}

function getStatistics(type = 'month', time = '3months') {
    let action_type = ''
    switch (type) {
        case 'status':
            action_type = 'status_time'
            break;
        case 'posture':
            action_type = 'posture_time'
            break;
        case 'place':
            action_type = 'place_time'
            break;
        case 'duration':
            action_type = 'duration_time'
            break;
        case 'periods':
            action_type = 'period_time'
            break
        case 'month':
        default:
            action_type = 'time'
            break
    }
    return get(`/statistics/${type}?${action_type}=${time}`)
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
    return get('/place')
}


function putPlace(id, name) {
    return put(`/place/${id}`, {
        content: name
    })
}

function deletePlace(id) {
    return d(`/place/${id}`)
}

function addPlace(name) {
    return post("/place",  {
        'content': name,
    })
}

function putPosture(id, name) {
    return put(`/posture/${id}`, {
        content: name
    })
}

module.exports = {classify, classifyDetail, updateEmotion, hot, recommend, login,
    record, recordList, getStatus, getPosture, getStatistics, getRecord, getRecordDetail,
    getProfiles, setProfiles, recordDelete, getRecordItem, putRecordItem,
    getCOSAuthorization, cancel, unCancel, getPlaces, addPosture, deletePosture, putPosture,
    recordDetail, putPlace, addPlace, recordInvite, recordComments, recordCommented, deletePlace}
