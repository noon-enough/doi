import {get, post, put} from './http'

function classify() {
    return get("/emotions/classify")
}

function classifyDetail(id = 0) {
    return get(`/emotions/classify/${id}`)
}

function updateEmotion(id = 0) {
    return post(`/emotions/${id}`, "[]")
}

function hot(query = "", page = 1, size = 20) {
    return get(`/emotions/hot?query=${query}&page=${page}&size=${size}`);
}

function recommend(size = 10) {
    return get(`/emotions/recommend?size=${size}`);
}

/**
 *
 * @param data
 * @returns {Promise<SuccessParam<wx.RequestOption>>}
 */
function login(data) {
    return post(`/passport/login`, data)
}

function recodeList() {}

function recode() {}

function me() {
    return get('/recode/me')
}

module.exports = {classify, classifyDetail, updateEmotion, hot, recommend, login,
    recode, recodeList, me}
