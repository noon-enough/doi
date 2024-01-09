import {addPlace, addPosture, getPlaces, putPlace, putPosture} from "../../../utils/api";
import {showToast} from "../../../utils/util";

const app = getApp()
Page({
    data: {
        id: 0,
        type: 'add',
        idx: 0,
        content: '',
        show_add_dialog: false,
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
    onAddClick() {
        let that = this
        that.setData({
            show_add_dialog: true,
            id: 0,
            type: 'add',
            idx: 0,
            content: '',
        })
    },
    closeAddDialog(e) {
        let that = this
        that.setData({
            show_add_dialog: false,
        })
    },
    confirmAddDialog(e) {
        let that = this,
            content = that.data.content ?? '',
            type = that.data.type,
            id = that.data.id,
            idx = that.data.idx
        if (content === '') {
            showToast('场所名不能为空', {icon: "error"})
            return false
        }
        console.log('content', content)

        wx.showLoading()
        if (type === 'edit') {
            putPlace(id, content).then(res => {
                let code = res.code,
                    data = res.data
                if (code !== 200) {
                    showToast('修改失败', {icon: 'error'})
                    wx.hideLoading()
                    return false
                }
                that.data.places[idx] = data
                that.setData({
                    places: that.data.places,
                    type: 'add',
                    id: 0,
                    idx: 0,
                    content: '',
                    show_add_dialog: false,
                })
                app.globalData.placeData = that.data.places
                wx.hideLoading()
            })
        } else if (type === 'add') {
            addPlace(content).then(res => {
                let code = res.code,
                    data = res.data
                if (code !== 200) {
                    showToast('添加失败', {icon: 'error'})
                    wx.hideLoading()
                    return false
                }
                that.data.places.unshift(data)
                that.setData({
                    places: that.data.places,
                    type: 'add',
                    id: 0,
                    idx: 0,
                    content: '',
                    show_add_dialog: false,
                })
                app.globalData.places = that.data.places
                showToast('添加成功', {icon: "success"})
                wx.hideLoading()
            })
        }

    },
    onContentChange(e) {
        let that = this,
            content = e.detail.value ?? ''
        content = content.trim()
        that.setData({
            content: content,
        })
    },
    onSwipeCellClick(e) {
        console.log('onSwipeCellClick', e)
    },
});
