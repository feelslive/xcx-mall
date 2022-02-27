// pages/home/index.js

const {
    goodsList
} = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
         this.requestData()
    },
    requestData() {
        goodsList().then(res => {
            this.setData({
                goodList: res.goodList
            })
        })
    },
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
})