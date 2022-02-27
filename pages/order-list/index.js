// pages/order-list/index.js
const {
    orderList,
    cancelOrder
} = require('../../utils/api.js');
const {
    regFenToYuan
} = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 1,
        orderList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            active: Number(options.active)
        })
        this.getList()
    },
    getList() {
        orderList().then(res => {
            console.log(res)
            res.orderList.forEach(order => {
                order.totalPrice = regFenToYuan(order.totalPrice)
                order.skuList.forEach(sku => {
                    sku.skuPrice = regFenToYuan(sku.skuPrice)
                    sku.totalPrice = regFenToYuan(sku.totalPrice)
                });
                this.setData({
                    orderList: res.orderList
                })
            })


        })
    },
    pay(e) {
        console.log(e.currentTarget.dataset.info)
        wx.navigateTo({
            url: '/pages/accounts/index?accountInfo=' + JSON.stringify(e.currentTarget.dataset.info) + '&type=order&orderId=' + e.currentTarget.dataset.info.id
        })
    },
    cancel(e) {
        let params = {
            id: e.currentTarget.dataset.id
        }
        cancelOrder(params).then(res => {
            console.log(res)
            // this.setData({
            //     orderList: res.orderList
            // })
            this.getList()
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
        // 请求数据
        wx.showNavigationBarLoading() //在标题栏中显示加载
        this.getList()
        setTimeout(() => {
            // 隐藏加载状态
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh();
        }, 500)
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