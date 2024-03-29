import {getStatistics} from "../../utils/api";
import {getDayDate, getTimeDate, showToast} from "../../utils/util";
import {STATUS_COLORS} from "../../utils/config";


const app = getApp(),
    defaultOpts = {
        padding: [5,5,5,5],
        enableScroll: false,
        extra: {
            pie: {
                activeOpacity: 0.5,
                activeRadius: 10,
                offsetAngle: 0,
                labelWidth: 15,
                border: true,
                borderWidth: 3,
                borderColor: "#FFFFFF"
            }
        }
    }
Page({
    data: {
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        opts: {
            color: STATUS_COLORS,
            padding: [5,5,5,5],
            enableScroll: false,
            legend: {
                show: true,
                position: "left",
                lineHeight: 30,
            },
            extra: {
                rose: {
                    type: "area",
                    minRadius: 50,
                    activeOpacity: 0.5,
                    activeRadius: 10,
                    offsetAngle: 0,
                    labelWidth: 15,
                    border: false,
                    borderWidth: 2,
                    borderColor: "#FFFFFF"
                }
            }
        },
        durationOpts: {
            color: [],
            padding: [5,5,5,5],
            enableScroll: false,
            legend: {
                show: true,
                position: "bottom",
                lineHeight: 30,
            },
            extra: {
                pie: {
                    activeOpacity: 0.5,
                    activeRadius: 10,
                    offsetAngle: 0,
                    labelWidth: 15,
                    border: true,
                    borderWidth: 3,
                    borderColor: "#FFFFFF"
                }
            }
        },
        placeOpts: defaultOpts,
        postureOpts: defaultOpts,
        postureChartData: {},
        placeChartData: {},
        durationChartData: {},
        chartData: {},
        status: [],
        datetime: getDayDate(),
        list: app.globalData.tabbar,
        in_month: {},
        periods: [],
        times: {
            "3months": "近3个月",
            "6months": "近6个月",
            "12months": "近1年",
        },
        time_selected: {
            period_time: '3months',
            status_time: '3months',
            duration_time: '3months',
            posture_time: '3months',
            place_time: '3months',
        },
    },
    onLoadStatus() {
        let that = this,
            status = app.globalData.statusData ?? []

        that.setData({
            status: status,
        })
    },
    onLoad: function (options) {
        let that = this

        that.onLoadData()
        console.log('datetime', that.data.datetime)
    },
    onLoadData: function() {
        let that = this,
            times = that.data.time_selected
        wx.showLoading()
        Promise.all([
            getStatistics(),
            getStatistics('periods', times.period_time),
            getStatistics('status', times.status_time),
            getStatistics('duration', times.duration_time),
            getStatistics('posture', times.posture_time),
            getStatistics('place', times.place_time),
        ]
        ).then(([
            inMonthRes,
            periodsRes,
            statusRes,
            durationRes,
            postureRes,
            placeRes,
        ]) => {
            console.log('inMonthRes', inMonthRes,
                'periodsRes', periodsRes,
                'statusRes', statusRes,
                'durationRes', durationRes,
                'postureRes', postureRes,
                'placeRes', placeRes)
            let data = {
                isRefresh: false,
                in_month: {
                    count: 0,
                    durationPre: 0,
                    sumDuration: 0,
                },
                chartData: {},
                durationChartData: {},
                postureChartData: {},
                placeChartData: {},
            }

            if (inMonthRes.code === 200) {
                data.in_month.count = Math.round(inMonthRes.data.count)
                data.in_month.durationPre = Math.round(inMonthRes.data.durationPre)
                data.in_month.sumDuration = Math.round(inMonthRes.data.sumDuration)
            }

            // 时段
            if (periodsRes.code === 200) {
                data.periods = periodsRes.data ?? {}
            }

            // 状态
            if (statusRes.code === 200) {
                let statusData = statusRes.data ?? []
                let chartData= statusData.map((item) => {
                        return {
                            "name": item.name,
                            "value": item.percentage,
                            "labelShow": true,
                            "labelText": `${item.percentage}%`
                        }
                    })
                data.chartData = {
                    series: [
                        {
                            data: chartData,
                        }
                    ],
                }
            }

            // 时长
            if (durationRes.code === 200) {
                let durationData = durationRes.data ?? []
                let durationChartData = durationData.map((item) => {
                        return {
                            "name": item.name,
                            "value": item.percentage,
                            "labelShow": true,
                            "labelText": `${item.percentage}%`
                        }
                    })

                data.durationChartData = {
                    series: [
                        {
                            data: durationChartData,
                        }
                    ],
                }
            }

            // 姿势
            if (postureRes.code === 200) {
                let postureData = postureRes.data ?? [],
                    postureChartData = postureData.map((item) => {
                    return {
                        "name": item.data.name,
                        "value": item.percentage,
                        "labelShow": true,
                        "labelText": `${item.percentage}%`
                    }
                })

                data.postureChartData = {
                    series: [
                        {
                            data: postureChartData,
                        }
                    ],
                }
            }

            // 场所
            if (placeRes.code === 200) {
                let placeData = placeRes.data ?? [],
                    placeChartData = placeData.map((item) => {
                        return {
                            "name": item.data.name,
                            "value": item.percentage,
                            "labelShow": true,
                            "labelText": `${item.percentage}%`
                        }
                    })

                data.placeChartData = {
                    series: [
                        {
                            data: placeChartData,
                        }
                    ],
                }
            }

            console.log('trend.js set UCharts data', data)
            that.setData(data)
            wx.hideLoading()
        }).finally(() => {})
    },
    onTimeChange: function(e) {
        console.log('onTimeChange', e)
        let that = this,
            type = e.currentTarget.dataset.type,
            value = e.currentTarget.dataset.value

        that.setData({
            [`time_selected.${type}`]: value,
        })
        that.onLoadData()
    },
    onPullDownRefresh() {
        let that = this
        that.setData({
            isRefresh: true,
        })
        that.onLoadData()
    },
    onScrollToBottom(e) {
    },
    onScroll(e) {
        let that = this,
            { scrollTop } = e.detail,
            windowHeight = app.globalData.system.height

        if (scrollTop >= 400) {
            that.setData({
                show_backtop: true,
            })
        }
    },
});
