import {getPlaces} from "../../../utils/api";
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
        places: [],
    },
    onLoadLogin(options){
        let that = this
        that.onLoadData()
    },
    onLoad: function (options) {

    },
    onLoadData(){
        let that = this
        getPlaces().then(res => {
            console.log('getPlaces', res)
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
                places: data,
                isRefresh: true,
            })
        })
    },
    onPullDownRefresh() {
        let that = this
        that.setData({
            isRefresh: false,
        })
        that.onLoadData()
    },
    onScroll() {},
    onAddClick() {},
    onSwipeCellClick(e) {
        console.log('onSwipeCellClick', e)
    },
});
