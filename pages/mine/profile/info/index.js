import {getUsersInfo, historyBack, setUsersInfo, showToast} from "../../../../../utils/util";
import {modified} from "../../../../../utils/api";

Page({
    data: {
        title: "关于我",
        description: "说说你的经历和性格吧",
        type: "about",
        content: "",
        value: "",
    },
    onLoad: function (options) {
        let type = options.type ?? 'about',
            that = this,
            title = "关于我",
            description = "说说你的经历和性格吧",
            value = options.value ?? ""

        value = decodeURI(value)

        switch (type) {
            case "about":
                title = "关于我"
                description = "说说你的经历和性格吧！"
                break
            case "hobbies":
                title = "兴趣爱好"
                description = "生活中，你有什么兴趣爱好？"
                break
            case "emotional":
                title = "感情观"
                description = "对于爱情和婚姻，你的观点、态度是什么？"
                break
            case "dream":
                title = "心仪的TA"
                description = "关于TA，应该是什么样的？"
                break
        }

        that.setData({
            title: title,
            description: description,
            type: type,
            value: value,
        })
    },
    history() {
        let that = this,
            type = that.data.type,
            content = that.data.content,
            data = {
            }

        if (content === "") {
            historyBack()
            return false
        }

       that.update()
    },
    onSubmit() {
        let that = this
        that.update()
    },
    update() {
        let that = this,
            type = that.data.type,
            content = that.data.content,
            data = {
            },
            info = getUsersInfo(),
            users = info.users,
            uid = info.uid

        wx.showLoading({
            title: "数据保存中"
        })
        switch (type) {
            case "about":
                data = {
                    "about": content,
                }
                users.about = content
                break
            case "hobbies":
                data = {
                    "hobbies": content,
                }
                users.hobbies = content
                break
            case "emotional":
                data = {
                    "emotional": content,
                }
                users.emotional = content
                break
            case "dream":
                data = {
                    "dream": content,
                }
                users.dream = content
                break
        }
        modified(JSON.stringify(data)).then(res => {
            // 先提交保存
            let code = res.code
            if (code !== 200) {
                showToast(res.message ?? "数据保存失败", {icon: "error"})
                return false
            }

            wx.hideLoading()
            setUsersInfo({
                users: users,
                uid: uid,
            })
            // 这里开始update缓存
            historyBack()
        })
    },
    onContentChange(e) {
        let that = this,
            content = e.detail.value ?? ""

        that.setData({
            content: content,
        })
    },
});
