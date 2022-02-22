// pages/order-list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 1,
        "cartArray": [{
            id: "3a4c8b8e4d8c22a97a94b46f58c1f3b9",
            pic: "/image/classify/phone.png",
            price: 9999,
            properties: "颜色:白色;内存:16G;版本:公开版",
            select: true,
            skuId: 1788,
            skuName: "白色 16G 公开版",
            stocks: 999,
            title: "荣耀8X Max 7.12英寸90%屏占比珍珠屏 4GB+64GB 魅海蓝 移动联通电信4G全面屏手机 双卡双待",
            total: 1,
        }],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            active: Number(options.active)
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