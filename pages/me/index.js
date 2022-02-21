// pages/me/index.js
//获取应用实例
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        phone: '',
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }

    },
    onShow: function (options) {
        if (!wx.getStorageSync('X-Token')) {
            let router = getCurrentPages()[0]
            wx.reLaunch({
                url: '/pages/login/index?url=' + JSON.stringify(router.route),
            })
        } else {
            let info = wx.getStorageSync('USER_INFO')
            this.setData({
                phone: info.phone
            })
        }
    },
    getUserInfo: function (e) {
        // wx.navigateTo({
        //     url: '/pages/login/index',
        // })
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    upAddress() {
        wx.navigateTo({
            url: '/pages/address-list/index'
        })
    },
    toOrderList() {
        wx.navigateTo({
            url: '/pages/order-list/index'
        })
    },
    exit() {
        wx.removeStorageSync('X-Token')
        wx.removeStorageSync('USER_INFO')
        wx.switchTab({
            url: '/pages/home/index',
        })
    }
})