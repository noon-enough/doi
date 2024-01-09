import {recordDetail} from "../../../../utils/api";
import {goto, showToast} from "../../../../utils/util";
import {RATE_ARRAY} from "../../../../utils/config";
import moment from "moment";

Page({
    data: {
        id : 0,
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
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
        comments: [],
    },
    onLoad: function (options) {
        let id = options.id ?? 0,
            that = this
        console.log('id', id)
        that.setData({
            id: id,
        })

        that.onLoadData()
    },
    onLoadData() {
        let that = this,
            id = that.data.id
        wx.showLoading()
        recordDetail(id).then(res => {
            console.log('recordDetail', res)
            let code = res.code,
                msg = res.message ?? '数据拉取失败',
                data = res.data,
                extra = res.extra,
                percentage = extra.percentage ?? 0

            if (code !== 200) {
                showToast(msg, {icon: 'error'})
                return false
            }

            let datetime = new Date(data.create_time)
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
            })
        })

    },
    onPullDownRefresh() {
        let that = this
        that.setData({
            isRefresh: true,
        })
        that.onLoadData()
    },
    onRecordShare(e) {
        console.log('e', e)
        let that = this,
            id = e.currentTarget.dataset.id ?? 0
        goto(`/pages/record/share/index?id=${id}`)
    },
});
