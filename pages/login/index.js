// pages/login/index.js
import {
    vailPhone
} from '../../utils/util.js'
const {
    login,
    sendVerifyCode
} = require('../../utils/api.js');
const app = getApp()

Page({
    data: {
        phone: '',
        code: '',
        sign: '',
        disabled: true,
        url: ''
        // url: '/pages/home/index'
    },
    onLoad: function (options) {
        if (options.url) {
            this.setData({
                url: JSON.parse(options.url)
            })
        }

    },
    getPhoneNumber(e) {
        console.log(e.detail.code)
    },
    toHome: function () {
        wx.switchTab({
            url: "/pages/home/index"
        })
    },
    toLogin: function () {
        let result = this.validate()
        if (result.success) {
            const {
                phone,
                code,
                sign,
                url
            } = this.data
            let params = {
                mobile: phone,
                sign,
                code,
            }
            login(params).then(res => {
                console.log('content', res)
                wx.setStorageSync('sid', res.token)
                wx.switchTab({
                    url: "/" + url
                })
            })
        } else {
            wx.showToast({
                title: result.msg,
                icon: 'none',
            })
        }
    },
    getSmsCodeByPhone: function () {
        let params = {
            mobile: this.data.phone
        }
        // 登录
        wx.login({
            success: res => {
                console.log('wx.login', res)
                this.setData({
                    code: res.code
                })
            }
        })
        sendVerifyCode(params).then(res => {
            wx.showToast({
                title: '发送成功',
                icon: 'success',
                duration: 2000
            })
        })
    },
    changeInput: function (e) {
        let type = e.target.dataset.type
        switch (type) {
            case 'phone':
                this.setData({
                    phone: e.detail
                })
                let isPhone = vailPhone(this.data.phone)
                if (isPhone) {
                    this.setData({
                        disabled: false
                    })
                } else {
                    this.setData({
                        disabled: true
                    })
                }
                break
            case 'sign':
                this.setData({
                    sign: e.detail
                })
                break
        }
    },
    validate: function () {
        let result = {
            success: true,
            msg: ''
        }
        const {
            phone,
            sign
        } = this.data
        if (!phone.trim()) {
            result.success = false
            result.msg = '手机号不能为空'
            return result
        }
        let isPhone = vailPhone(phone)
        if (!isPhone) {
            result.success = false
            result.msg = '手机号不正确'
            return result
        } else {
            if (!sign) {
                result.success = false
                result.msg = '验证码不正确'
                return result
            }
        }
        return result
    },
    getUserInfo: function (e) {
        console.log('e.detail',e.detail)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },

})