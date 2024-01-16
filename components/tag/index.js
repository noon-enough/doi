Component({
    properties: {
        message: String,
        textColor: {
            type: String,
            value: "black"
        },
        bgColor: String,
        fontSize: {
            type: Number,
            value: 24
        },
        icon: String,
        iconSize: {
            type: Number,
            value: 12
        },
        isBorder: {
            type: Boolean,
            value: false
        },
        padding: {
            type: Number,
            value: 4
        },
        radius: {
            type: Number,
            value: 8
        },
        isBolder: Boolean,
        type: {
            type: Number,
            value: 0
        },
        textWidth: Number,
    },
    data: {
        backgroundColor: "",
        contentColor: "",
        leftIcon: "",
        leftIconSize: 0,
        content: "",
        contentSize: 0,
    },
    methods: {
        tapTag: function(e) {
            this.triggerEvent("mantap",e,{bubbles:!0,composed:!0})
        }
    },
    attached() {
        let that = this,
            properties = that.properties,
            type = properties.type,
            config = {
                backgroundColor: "",
                contentColor: "",
                leftIcon: "",
                leftIconSize: 0,
                content: "",
                contentSize: 0,
            }

        // 0 自定义
        // 1 编辑资料
        // 2 已认证
        // 3 管理员
        // 4 同城
        // 5 话题
        // 6 hot
        // 7 推荐
        // 8 new
        switch (type) {
            case 1:
                config.backgroundColor = "#e5fcf7"
                config.contentColor = "#12977a"
                config.leftIcon = ""
                config.leftIconSize = 12
                config.contentSize = 28
                config.content = "编辑资料"
                break;
            case 3:
                config.backgroundColor = "orange"
                config.contentColor = "#fff"
                config.leftIcon = "umbrella"
                config.leftIconSize = 12
                config.contentSize = 20
                config.content = "管理员"
                break;
            case 2:
                config.backgroundColor = "#e7f0fe"
                config.contentColor = "#5a8eee"
                config.leftIcon = "verity"
                config.leftIconSize = 12
                config.contentSize = 20
                config.content = "已认证"
                break;
            case 4:
                config.backgroundColor = "#ee823c"
                config.contentColor = "#fff"
                config.leftIcon = ""
                config.leftIconSize = 0
                config.contentSize = 20
                config.content = "同城"
                break
            case 5:
                config.backgroundColor = "#f5f7fa"
                config.contentColor = "#1B1C1B"
                config.leftIcon = "topic"
                config.leftIconSize = 12
                config.contentSize = 26
                config.content = that.properties.message
                break;
            case 6:
                config.backgroundColor = "#fd7e14"
                config.contentColor = "#fff"
                config.leftIcon = ""
                config.leftIconSize = 0
                config.contentSize = 20
                config.content = "HOT"
                break
            case 7:
                config.backgroundColor = "#007bff"
                config.contentColor = "#fff"
                config.leftIcon = ""
                config.leftIconSize = 0
                config.contentSize = 20
                config.content = "推荐"
                break
            case 8:
                config.backgroundColor = "#28a745"
                config.contentColor = "#fff"
                config.leftIcon = ""
                config.leftIconSize = 0
                config.contentSize = 20
                config.content = "NEW"
                break
            case 9:
                config.backgroundColor = "#47977c"
                config.contentColor = "#fff"
                config.leftIcon = ""
                config.leftIconSize = 0
                config.contentSize = 20
                config.content = "关注"
                break
            case 0:
            default:
                config.backgroundColor = that.properties.bgColor
                config.contentColor = that.properties.textColor
                config.leftIcon = that.properties.icon
                config.leftIconSize = that.properties.iconSize
                config.contentSize = that.properties.fontSize
                config.content = that.properties.message
                break;
        }
        that.setData(config)
        console.log('set Config', config)
    }
});
