// pages/address-list/index.js
const {
    addressList
} = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressList: [],
        select: false
    },
    upAddress(e) {
        console.log('e', e.currentTarget.dataset.info)
        let addressInfo = e.currentTarget.dataset.info || {}
        wx.navigateTo({
            url: '/pages/address-up/index?addressInfo=' + JSON.stringify(addressInfo)
        })
    },
    selectAddress(e) {
        if (this.data.select) {
            console.log(e.currentTarget.dataset.info)
            var pages = getCurrentPages();
            var currPage = pages[pages.length - 1]; //当前页面
            var prevPage = pages[pages.length - 2]; //上一个页面
            // //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
            prevPage.setData({
                addressInfo: e.currentTarget.dataset.info,
            })
            wx.navigateBack();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('select', options.select === "true")
        this.setData({
            select: options.select === "true"
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
        this.requestData()
    },
    requestData() {
        addressList().then(res => {
            this.setData({
                addressList: res.addressList
            })
            this.data.addressList.forEach(address => {
                if (address.default) {
                    wx.setStorageSync('defaultAddress', address)
                }
            });
        })
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
        this.requestData()
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