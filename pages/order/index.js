const interfaces = require("../../utils/urlconfig.js");
// pages/order/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        accountInfo: null
    },

    getOpenid: function () {
        // 1.获取openid
        wx.showLoading({
            title: '加载中...',
        })

        wx.login({
            success: res => {
                // res.code appid secret = openid
                // console.log(res.code);
                let self = this;
                const appid = "wx54d2f36a69316d6c";
                const secret = "c5a8fb41d83c2d2805821a91d7be443b";

                wx.request({
                    url: interfaces.getOpenid + appid + "/" + secret + "/" + res.code,
                    success(res) {
                        const openid = res.data.openid;
                        self.wechatPay(openid);
                    }
                })
            }
        })
    },

    wechatPay: function (openid) {
        console.log('this.data.accountInfo', this.data.accountInfo)
        // 对后端支付接口发起请求
        wx.request({
            url: interfaces.wechatPay,
            method: "POST",
            data: {
                openid: openid,
                body: JSON.stringify(this.data.accountInfo),
                timeStamp: new Date().getTime().toString(),
            },
            success(res) {
                wx.hideLoading()
                console.log(res);
                // 发起支付
                wx.requestPayment({
                    appId: res.data.appId,
                    timeStamp: res.data.timeStamp,
                    nonceStr: res.data.nonceStr,
                    package: res.data.package,
                    signType: res.data.signType,
                    paySign: res.data.paySign,
                    success(res) {
                        wx.showToast({
                            title: '支付成功',
                        })

                        // 页面跳转
                        wx.switchTab({
                            url: '/pages/me/index',
                        })
                    },
                    fail() {
                        wx.showToast({
                            title: '支付失败',
                        })
                    }
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            accountInfo: JSON.parse(options.accountInfo)
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})