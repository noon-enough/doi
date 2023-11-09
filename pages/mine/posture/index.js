import {getPosture} from "../../../utils/api";
import {showToast} from "../../../utils/util";

Page({
    data: {
        right: [
            {
                text: '编辑',
                className: 'btn edit-btn',
            },
            {
                text: '删除',
                className: 'btn delete-btn',
            },
        ],
        fabButton: {
            icon: 'plus',
        },
        isRefresh: false,
        loadingProps: {
            size: '50rpx',
        },
        postures: [],
    },
    onLoadLogin(options){
        let that = this
        that.onLoadData()
    },
    onLoad: function (options) {

    },
    onLoadData(){
        let that = this
        getPosture().then(res => {
            console.log('getPosture', res)
            let code = res.code,
                data = res.data
            if (code !== 200) {
                showToast('数据拉取失败', {icon: 'error'})
                return false
            }
            data = data.map((item) => {
                item.is_system = item.uid === 1
                return item
            })
            that.setData({
                postures: data,
                isRefresh: false,
            })
        }).finally(() => {
            that.setData({
                isRefresh: false,
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
    onScroll() {},
    onAddClick() {},
    onSwipeCellClick(e) {
        console.log('onSwipeCellClick', e)
    },
});
