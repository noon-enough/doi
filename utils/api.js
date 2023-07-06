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

module.exports = {classify, classifyDetail, updateEmotion, hot, recommend}
