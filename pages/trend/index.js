import {getStatistics} from "../../utils/api";
import {getDayDate, getTimeDate, showToast} from "../../utils/util";
import {STATUS_COLORS} from "../../utils/config";


const app = getApp()

Page({
    data: {
        durationChartData: {},
        durationOpts: {
            color: [],
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
        },
        opts: {
            color: STATUS_COLORS,
            padding: [5,5,5,5],
            enableScroll: false,
            legend: {
                show: true,
                position: "left",
                lineHeight: 25
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
        let that = this,
            times = that.data.time_selected,
            datetime = that.data.datetime
        that.onLoadData()
    },
    onLoadData: function() {
        let that = this,
            times = that.data.time_selected
        wx.showLoading()
        getStatistics(times.period_time, times.status_time, times.duration_time).then(res => {
            console.log('getStatistics', res)
            let data = res.data,
                code = res.code
            if (code !== 200) {
                showToast("数据拉取失败", {icon: "error"})
                return false
            }
            let status = data.status ?? [],
                duration = data.duration ?? []

            let chartData= status.map((item) => {
                return {
                    "name": item.name,
                    "value": item.percentage,
                    "labelShow": true,
                    "labelText": `${item.percentage}%`
                }
            }),
                durationChartData = duration.map((item) => {
                    return {
                        "name": item.name,
                        "value": item.percentage,
                        "labelShow": true,
                        "labelText": `${item.percentage}%`
                    }
                })

            console.log('chartData', chartData, 'status', status)
            that.setData({
                chartData: {
                    series: [
                        {
                            data: chartData,
                        }
                    ],
                },
                durationChartData: {
                    series: [
                        {
                            data: durationChartData,
                        }
                    ],
                },
                in_month: data.in_month ?? {},
                periods: data.periods ?? [],
            })
        }).finally(() => {
            wx.hideLoading()
        })
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
    }
});
