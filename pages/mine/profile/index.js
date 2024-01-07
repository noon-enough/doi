import region from "../../../utils/region";
import {
    ASSETS_DOMAIN,
    COS_BUCKET, COS_REGION, DEFAULT_ASSETS_DOMAIN,
    DELISTING_ARRAY,
    EDUCATION_ARRAY,
    HEIGHT_ARRAY,
    JOB_ARRAY,
    MARITAL_ARRAY, ROLE_ARRAY, UPLOAD_COS_METHOD,
    WEIGHT_ARRAY,
    YEARLY_SALARY
} from "../../../utils/config";
import {getCOSAuthorization, getProfiles, setProfiles} from "../../../utils/api";
import {getConfigLabel, getLocalUid, getUploadFileKey, setLocalInfo, showToast} from "../../../utils/util";
import COS from "../../../miniprogram_npm/cos-wx-sdk-v5/index"

const app = getApp()
Page({
    data: {
        dateVisible: false,
        show_modify_username_input: false,
        users: {},
        uid: 0,
        regions: region,
        areaVisible: false,
        areaValue: [],
        provinces: region,
        cities: region[0].cities,
        commonVisible: false,
        commonType: "",
        commonDefault: "",
        commonData: [],
    },
    onLoadLogin(options){
    },
    onLoadUsers() {
        let that = this,
            uid = getLocalUid()

        that.setData({
            uid: uid,
        })
        that.onLoadData(uid)
    },
    onLoadData(uid = 0) {
        let that = this
        wx.showLoading()
        getProfiles(uid).then(res => {
            console.log('getProfiles', res)
            let data = res.data,
                code = res.code
            if (code !== 200) {
                showToast("数据拉取失败", {icon: "error"})
                return false
            }
            data.roleString = getConfigLabel(data.role ?? 0, 'role')
            data.username = data.username ? data.username : '(纯爱战士)'
            that.setData({
                users: data,
            })
            // 同步更新一下
            setLocalInfo(data)
            app.globalData.users = data
        }).finally(() => {
            wx.hideLoading()
        })
    },
    onLoad: function (options) {
    },
    onHometownPicker(e) {
        let that = this
        that.setData({
            commonType: "hometown",
            commonData: [],
            commonDefault: "",
            commonTitle: "家乡",
            commonVisible: true,
        })
    },
    onCitiesPicker(e) {
        let that = this
        that.setData({
            commonType: "city_selected",
            commonData: [],
            commonDefault: "",
            commonTitle: "居住地",
            commonVisible: true,
        })
    },
    onPickerChange(e) {
        let type = e.currentTarget.dataset.type,
            label = e.detail.label,
            value = e.detail.value,
            data = {},
            that = this,
            profile = that.data.users,
            uid = that.data.uid

        console.log('type', type, "e", e, "uid", uid)
        switch (type) {
            case "hometown":
                data = {
                    "hometown": value[1],
                }
                profile.hometown = value[1]
                break
            case "city_selected":
                data = {
                    "city_selected": value[1],
                }
                profile.city_selected = value[1]
                break
            case "job":
                data = {
                    "job": value[0]
                }
                profile.job = value[0]
                profile.jobString = getConfigLabel(value[0], "job")
                break
            case "yearly_salary":
                data = {
                    "salary": value[0]
                }
                profile.salary = value[0]
                profile.salaryString = getConfigLabel(value[0], "salary")
                break
            case "education":
                data = {
                    "education": value[0]
                }
                profile.education = value[0]
                profile.educationString = getConfigLabel(value[0], "education")
                break
            case "marital":
                data = {
                    "marital": value[0]
                }
                profile.marital = value[0]
                profile.maritalString = getConfigLabel(value[0], "marital")
                break
            case "delisting-target":
                data = {
                    "delisting": value[0]
                }
                profile.delisting = value[0]
                profile.delistingString = getConfigLabel(value[0], "delisting")
                break
            case "birthday":
                data = {
                    "birthday": value
                }
                profile.birthday = value
                break
            case "height":
                data = {
                    "height": value[0]
                }
                profile.height = value[0]
                break
            case "weight":
                data = {
                    "weight": value[0]
                }
                profile.weight = value[0]
                break
            case "role":
                data = {
                    "role": value[0]
                }
                profile.role = value[0]
                break
            default:
                showToast("非法操作", {icon : "error"})
                return
        }

        wx.showLoading()
        setProfiles(uid, data).then(res => {
            let code = res.code,
                data = res.data ?? {}
            if (code !== 200) {
                showToast(res.message ?? "数据更新失败", {icon: "error"})
                return false
            }
            data.username = data.username ? data.username : '(纯爱战士)'
            data.roleString = getConfigLabel(data.role, 'role')
            that.setData({
                users: data
            })
            showToast("更新成功", {icon: "success"})
            setLocalInfo(data)
            app.globalData.users = data
            wx.hideLoading()
        }).catch(res => {
            showToast(res.message ?? "数据更新失败", {icon: "error"})
            wx.hideLoading()
            return false
        }).finally(() => {
        })
    },
    onPickerCancel(e) {},
    onColumnChange(e) {
        let that = this,
            column = e.detail.column,
            index = e.detail.index,
            value = e.detail.value,
            cities = []
        // 切换省份
        if (column === 0) {
            cities = that.data.provinces[index].cities ?? []
        }

        that.setData({
            cities: cities,
        })
    },
    onHeight(e) {
        let that = this,
            height = e.currentTarget.dataset.height ?? 170

        that.setData({
            commonType: "height",
            commonData: HEIGHT_ARRAY,
            commonDefault: height,
            commonTitle: "身高",
            commonVisible: true,
        })
    },
    onWeight(e) {
        let that = this,
            weight = e.currentTarget.dataset.weight ?? 170

        that.setData({
            commonType: "weight",
            commonData: WEIGHT_ARRAY,
            commonDefault: weight,
            commonTitle: "体重",
            commonVisible: true,
        })
    },
    onJob(e) {
        let that = this,
            job = e.currentTarget.dataset.job ?? 26

        that.setData({
            commonType: "job",
            commonData: JOB_ARRAY,
            commonDefault: job,
            commonTitle: "行业/职业",
            commonVisible: true,
        })
    },
    onYearlySalary(e) {
        let that = this,
            yearlySalary = e.currentTarget.dataset.yearlySalary ?? 0

        that.setData({
            commonType: "yearly_salary",
            commonData: YEARLY_SALARY,
            commonDefault: yearlySalary,
            commonTitle: "年薪",
            commonVisible: true,
        })
    },
    onEducation(e) {
        let that = this,
            education = e.currentTarget.dataset.education ?? 0

        that.setData({
            commonType: "education",
            commonData: EDUCATION_ARRAY,
            commonDefault: education,
            commonTitle: "学历",
            commonVisible: true,
        })
    },
    onDelistingTarget(e) {
        let that = this,
            delistingTarget = e.currentTarget.dataset.delistingTarget ?? 0

        console.log('onDelistingTarget', e)
        that.setData({
            commonType: "delisting-target",
            commonData: DELISTING_ARRAY,
            commonDefault: delistingTarget,
            commonTitle: "脱单目标",
            commonVisible: true,
        })
    },
    onMarital(e) {
        let that = this,
            marital = e.currentTarget.dataset.marital ?? 0

        that.setData({
            commonType: "marital",
            commonData: MARITAL_ARRAY,
            commonDefault: marital,
            commonTitle: "婚姻状况",
            commonVisible: true,
        })
    },
    onEmotionalState(e) {},
    modifyUsername(e){
        let that = this
        that.setData({
            show_modify_username_input: true,
        })
    },
    onBirthday(e) {
        let that = this
        console.log('onBirthday', e)
        that.setData({
            dateVisible: true,
        })
    },
    onRole(e) {
        let that = this,
            role = e.currentTarget.dataset.role ?? -1

        if (role !== -1) {
            return false
        }
        that.setData({
            commonType: "role",
            commonData: ROLE_ARRAY,
            commonDefault: role,
            commonTitle: "角色（取向）",
            commonVisible: true,
        })
    },
    onUsersNameModify(uid, username) {
        let that = this,
            users = that.data.users
        if (username === users.username) {
            that.setData({
                show_modify_username_input: false,
            })
            return false
        }
        wx.showLoading()
        setProfiles(uid, {
            "username": username,
        }).then(res => {
            let code = res.code,
                data = res.data ?? {}
            if (code !== 200) {
                showToast(res.message ?? "数据更新失败", {icon: "error"})
                return false
            }
            data.username = data.username ? data.username : '(纯爱战士)'
            data.roleString = getConfigLabel(data.role, 'role')
            that.setData({
                users: data,
                show_modify_username_input: false,
            })
            showToast("更新成功", {icon: "success"})

            // 这里需要更新用户数据
            setLocalInfo(data)
            app.globalData.users = data
            wx.hideLoading()
        }).catch(res => {
            showToast(res.message ?? "数据更新失败", {icon: "error"})
            wx.hideLoading()
            return false
        }).finally(() => {
        })
    },
    onUsernameBlur(e) {
        let that = this,
            username = e.detail.value ?? '',
            uid = that.data.uid
        if (username === '') {
            that.setData({
                show_modify_username_input: false,
            })
            return false
        }

        that.onUsersNameModify(uid, username)
    },
    onUsernameDone(e) {
        let that = this,
            username = e.detail.value ?? '',
            uid = that.data.uid
        if (username === '') {
            showToast('昵称不可为空', {icon: "error"})
            return false
        }

        that.onUsersNameModify(uid, username)
    },
    onAvatarChoose(e) {
        let that = this,
            avatarUrl = e.detail.avatarUrl ?? '',
            uid = that.data.uid
        if (avatarUrl === '') {
            showToast('头像选择/上传失败', {icon: "error"})
            return false
        }

        wx.showLoading({
            title: '头像上传中'
        })

        let client = new COS({
            SimpleUploadMethod: UPLOAD_COS_METHOD,
            getAuthorization: getCOSAuthorization
        })

        let updateKey = getUploadFileKey("avatar")
        client.uploadFile({
            Bucket: COS_BUCKET, /* 填写自己的 bucket，必须字段 */
            Region: COS_REGION, /* 存储桶所在地域，必须字段 */
            Key: updateKey,    /* 存储在桶里的对象键（例如:1.jpg，a/b/test.txt，图片.jpg）支持中文，必须字段 */
            FilePath: avatarUrl, /* 上传文件路径，必须字段 */
            SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
            onProgress: function(progressData) {
                console.log(JSON.stringify(progressData));
            }
        }, function(err, data) {
            if (err) {
                console.log('error', err)
                showToast("上传失败", {icon: "error"})
                wx.hideLoading()
                return false
            }
            let url = data.Location,
                code = data.statusCode ?? 200
            if (code !== 200) {
                showToast("头像选择/上传失败", {icon: "error"})
                wx.hideLoading()
                return
            }
            url = url.replace(DEFAULT_ASSETS_DOMAIN, ASSETS_DOMAIN)

            setProfiles(uid, {
                avatar: url,
            }).then(res => {
                let code = res.code,
                    data = res.data
                if (code !== 200) {
                    showToast("头像选择/上传失败", {icon: "error"})
                    wx.hideLoading()
                    return false
                }

                showToast('头像选择/上传成功', {icon: "success"})
                setLocalInfo(data)
                app.globalData.users = data
                that.setData({
                    users: data,
                    show_modify_username_input: false,
                })

                wx.hideLoading()
            })
            console.log('data', data, 'url', url)
        })
    }
});
