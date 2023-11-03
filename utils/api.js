import {get, post, put} from './http'

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

function recodeList(uid, date = "") {
    date = encodeURIComponent(date)
    return get(`/recode/users/${uid}?date=${date}`)
}

function recode(payload = {}) {
    return post('/recode', payload)
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

module.exports = {classify, classifyDetail, updateEmotion, hot, recommend, login,
    recode, recodeList, getStatus, getPosture, getStatistics}
