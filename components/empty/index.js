Component({
    properties: {
        type: {
            type: Number,
            value: 0,
        },
    },
    data: {
        image: '',
        description: '',
    },
    methods: {},
    attached() {
        let that = this,
            type = that.properties.type,
            image = '',
            description = ''

        switch (type) {
            case 0:
                image = 'https://ak48.qizue.com/doi/tips/404.svg'
                description = '没有找到相关信息'
                break;
            case 1:
                image = 'https://ak48.qizue.com/doi/tips/505.svg'
                description = '出现了一个致命错误'
                break;
            case 2:
                image = 'https://ak48.qizue.com/doi/tips/account.svg'
                description = '请授权绑定/登录用户账号'
                break;
            case 3:
                image = 'https://ak48.qizue.com/doi/tips/audited-pass.svg'
                description = '审核通过'
                break;
            case 4:
                image = 'https://ak48.qizue.com/doi/tips/error.svg'
                description = '加载错误'
                break;
            case 5:
                image = 'https://ak48.qizue.com/doi/tips/laoding.svg'
                description = '加载中'
                break;
            case 6:
                image = 'https://ak48.qizue.com/doi/tips/map.svg'
                description = '地图绘制中'
                break;
            case 7:
                image = 'https://ak48.qizue.com/doi/tips/no-access.svg'
                description = '拒绝访问'
                break;
            case 8:
                image = 'https://ak48.qizue.com/doi/tips/no-goods.svg'
                description = '无品商品信息'
                break;
            case 9:
                image = 'https://ak48.qizue.com/doi/tips/no-jobs.svg'
                description = '无任务列表'
                break;
            case 10:
                image = 'https://ak48.qizue.com/doi/tips/no-message.svg'
                description = '未收到任何消息'
                break;
            case 11:
                image = 'https://ak48.qizue.com/doi/tips/no-orders.svg'
                description = '无订单信息'
                break;
            case 12:
                image = 'https://ak48.qizue.com/doi/tips/no-wifi.svg'
                description = '无网络连接'
                break;
            case 13:
                image = 'https://ak48.qizue.com/doi/tips/searching.svg'
                description = '搜索中'
                break;
            case 14:
                image = 'https://ak48.qizue.com/doi/tips/success.svg'
                description = '操作成功'
                break;
        }

        that.setData({
            description: description,
            image: image,
        })
    }
});
