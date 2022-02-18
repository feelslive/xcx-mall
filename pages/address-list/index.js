// pages/address-list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressList: [{
            name: "张三",
            phone: "18810881022",
            default: true,
            address: "将省市区数据保存在云开发的数据库中，并在小程序中使用云开发的接口异步获取数据。",
            city: "北京市北京市朝阳区"
        }, {
            name: "张三",
            phone: "18810881022",
            default: false,
            address: "将省市区数据保开发",
            city: "北京市北京市朝阳区"
        }]
    },
    upAddress(e) {
        console.log('e', e.currentTarget.dataset.info)
        let addressInfo = e.currentTarget.dataset.info ? e.currentTarget.dataset.info : {}
        wx.navigateTo({
            url: '/pages/address-up/index?addressInfo=' + JSON.stringify(addressInfo)
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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