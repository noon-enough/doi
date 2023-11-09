import {addPosture, getPosture, putPosture} from "../../../utils/api";
import {showToast} from "../../../utils/util";

const app = getApp()
Page({
    data: {
        type: 'add',
        id: 0,
        idx: 0,
        content: '',
        show_add_dialog: false,
        right: [
            {
                id: 'edit',
                text: '编辑',
                className: 'btn edit-btn',
            },
            {
                id: 'delete',
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
    onLoad: function (options) {},
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
            app.globalData.postureData = data
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
    onSwipeCellClick(e) {
        console.log('onSwipeCellClick', e)
        let that = this,
            type = e.detail.id ?? 'edit',
            data = e.currentTarget.dataset.posture ?? {},
            idx = e.currentTarget.dataset.idx ?? 0,
            id = data.id ?? 0,
            is_system = data.is_system ?? false
        if (is_system) {
            showToast('系统数据', {icon: 'error'})
            return false
        }

        switch (type) {
            case 'edit':
                that.setData({
                    type: 'edit',
                    id: id,
                    idx: idx,
                    content: data.name,
                    show_add_dialog: true,
                })
                break
            case 'delete':
                break
        }
    },
    onScrollToBottom(e) {},
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
            showToast('类名不能为空', {icon: "error"})
            return false
        }
        console.log('content', content)

        wx.showLoading()
        if (type === 'edit') {
            putPosture(id, content).then(res => {
                let code = res.code,
                    data = res.data
                if (code !== 200) {
                    showToast('修改失败', {icon: 'error'})
                    wx.hideLoading()
                    return false
                }
                that.data.postures[idx] = data
                that.setData({
                    postures: that.data.postures,
                    type: 'add',
                    id: 0,
                    idx: 0,
                    content: '',
                    show_add_dialog: false,
                })
                app.globalData.postureData = that.data.postures
                wx.hideLoading()
            })
        } else if (type === 'add') {
            addPosture(content).then(res => {
                let code = res.code,
                    data = res.data
                if (code !== 200) {
                    showToast('添加失败', {icon: 'error'})
                    wx.hideLoading()
                    return false
                }
                that.data.postures.unshift(data)
                that.setData({
                    postures: that.data.postures,
                    type: 'add',
                    id: 0,
                    idx: 0,
                    content: '',
                    show_add_dialog: false,
                })
                app.globalData.postureData = that.data.postures
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
    }
});
