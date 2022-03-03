// pages/home/index.js
const {
    homeList
} = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 1,
        notice: "这是有优惠。",
        swiperList: [],
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 500,
        goodList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestData()
    },
    requestData() {
        homeList().then(res => {
            this.setData({
                swiperList: res.swiperList,
                goodList: res.goodList,
                notice: res.notice,
                responseList: res.goodsCategoryDetailResponseList
            })
        })
    },
    search() {
        wx.navigateTo({
            url: '/pages/search-list/index'
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