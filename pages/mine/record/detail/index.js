import {recordCommented, recordComments, recordDetail} from "../../../../utils/api";
import {goto, showToast} from "../../../../utils/util";
import {RATE_ARRAY} from "../../../../utils/config";
import moment from "moment";

const app = getApp()
Page({
    data: {
        width: app.globalData.system.width ?? 0,
        id : 0,
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        allow: {},
        data: {},
        rateTexts: RATE_ARRAY,
        chartData: {},
        opts: {
            width: "100px",
            height: "100px",
            color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
            padding: undefined,
            title: {
                name: "1%",
                fontSize: 35,
                color: "#2fc25b"
            },
            subtitle: {
                name: "持久度超过",
                fontSize: 23,
                color: "#666666"
            },
            extra: {
                arcbar: {
                    type: "default",
                    width: 12,
                    backgroundColor: "#E9E9E9",
                    startAngle: 0.75,
                    endAngle: 0.25,
                    gap: 2,
                    linearType: "custom"
                }
            }
        },
        comments: {
            content: "",
            data: [],
            count: 0,
            page: 1,
            totalCount: 0,
        },
        show_send_icon: false,
        show_submit_event: false,
        submitLoading: false,
        disable: false,
    },
    onLoad: function (options) {
        let id = options.id ?? 0,
            that = this,
            invite = options.invite ?? ''
        console.log('id', id, 'invite', invite)
        that.setData({
            id: id,
        })

        if (invite !== "") {

        }
        that.onLoadData()
    },
    onLoadData() {
        let that = this,
            id = that.data.id,
            page = that.data.comments.page
        if (page <= 1) {
            page = 1
        }
        if (page >= 100) {
            page = 100
        }
        wx.showLoading()
        Promise.all([
            recordDetail(id),
            recordComments(id, page, 20),
        ]).then(([
            res,
            commentsRes
        ]) =>  {
            console.log('recordDetail', res, 'recordComments', commentsRes)
            let code = res.code,
                msg = res.message ?? '数据拉取失败',
                data = res.data,
                extra = res.extra,
                percentage = extra.percentage ?? 0,
                allow = {
                    'delete': extra.allow_delete ?? false,
                    'edit': extra.allow_edit ?? false,
                    'share': extra.allow_share ?? false,
                },
                commentsCode = commentsRes.code

            if (code !== 200 && commentsCode !== 200) {
                showToast(msg, {icon: 'error'})
                return false
            }

            let datetime = new Date(data.create_time),
                comments = commentsRes.data,
                totalCount = commentsRes.extra.totalCount ?? 0,
                count = commentsRes.extra.count ?? 0

            comments = comments.map((item) => {
                let d = new Date(item.create_time * 1000)
                item.datetime = moment(d).fromNow()
                return item
            })
            data.datetime = moment(datetime).fromNow()
            wx.hideLoading()
            that.setData({
                chartData: {
                    series: [
                        {
                            name: "持久度超过",
                            color: "#2fc25b",
                            data: percentage,
                        }
                    ]
                },
                [`opts.title.name`]:  `${percentage * 100} %`,
                isRefresh: false,
                data: data,
                allow: allow,
                [`comments.data`]: comments,
                ['comments.page']: 1,
                ['comments.count']: count,
                ['comments.totalCount']: totalCount,
            })
        })
    },
    onPullDownRefresh() {
        let that = this
        that.setData({
            ['comments.page']: 1,
            isRefresh: true,
        })
        that.onLoadData()
    },
    onScrollToBottom(e) {
        let that = this
        that.onReachBottom()
    },
    onReachBottom() {
        let that = this,
            page = that.data.comments.page,
            totalCount = that.data.comments.totalCount,
            nextPage = page + 1,
            id = that.data.id
        wx.showLoading()
        console.log('onReachBottom', 'start', 'currPage', page, 'nextPage', nextPage, 'totalCount', totalCount)
        if (nextPage >= totalCount) {
            //done
            wx.hideLoading()
        } else {
            recordComments(id, nextPage, 20).then(res => {
                console.log('onReachBottom', 'recordComments', res)
                let data = res.data ?? [],
                    extra = res.extra ?? {},
                    code = res.code
                if (code !== 200) {
                    showToast(res.message ?? '数据拉取失败', {icon: "error"})
                    return false
                }

                data = data.map((item) => {
                    let d = new Date(item.create_time * 1000)
                    item.datetime = moment(d).fromNow()
                    return item
                })
                that.setData({
                    [`comments.data`]: that.data.comments.data.concat(data),
                    ['comments.page']: nextPage,
                    ['comments.totalCount']: extra.totalCount,
                    ['comments.count']: extra.count,
                })
                wx.hideLoading()
            })
        }
    },
    onScroll(e) {
        let that = this,
            { scrollTop } = e.detail,
            windowHeight = app.globalData.system.height

        if (scrollTop >= 400) {
            that.setData({
            })
        }
    },
    onRecordShare(e) {
        let that = this,
            id = e.currentTarget.dataset.id ?? 0
        goto(`/pages/record/share/index?id=${id}`)
    },
    onRecordModify(e) {
        let that = this,
            id = e.currentTarget.dataset.id ?? 0
        goto(`/pages/mine/record/modify/index?id=${id}`)
    },
    onCommentSend(e) {
        let that = this,
            content = that.data.comments.content,
            id = that.data.id

        content = content.trim()
        if (content === "") {
            showToast('请输入要评论的内容', {icon: "error"})
            return false
        }

        that.setData({
            disable: true,
            submitLoading: true,
        })


        recordCommented(id, {
            content: content,
        }).then(res => {
            console.log('recordCommented', res)
            let code = res.code,
                data = res.data ?? {},
                message = res.message ?? '评论发布失败'

            if (code !== 200) {
                showToast(message, {icon: 'error'})
                return false
            }

            data.datetime = "刚刚"
            that.data.comments.data.unshift(data)
            that.setData({
                ['comments.count']: that.data.comments.count + 1,
                ['comments.data']: that.data.comments.data,
                disable: false,
                submitLoading: false,
                show_submit_event: false,
            })
            showToast('评论成功', {icon: 'success'})
        })
    },
    onCommentContentBlur(e) {
        let that = this

        that.setData({
            // show_submit_event: false,
        })
    },
    onCommentContentChange(e) {
        let that = this,
            content = e.detail.value ?? ""

        that.setData({
            ['comments.content']: content,
            show_submit_event: true,
            submitLoading: false,
            disable: false,
            show_send_icon: !!content,
        })
    },
    onCommentContentFocus(e) {
        let that = this
        that.setData({
            show_submit_event: true,
        })
    },
    onCommentTap(e) {
        console.log('onCommentTap', e)
    },
});
