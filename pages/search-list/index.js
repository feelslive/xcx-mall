// pages/list/index.js
const {
    goodsList
} = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: '',
        goodShow: false,
        goodList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // wx.setNavigationBarTitle({
        //     title: options.title
        // })
    },
    search() {
        this.requestData()
    },
    cancel() {
        wx.navigateBack({
            delta: 1
        })
    },
    requestData() {
        let params = {}
        goodsList(params).then(res => {
            this.setData({
                goodShow: true,
                goodList: res.goodList,
            })
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        // 请求数据
        wx.showNavigationBarLoading() //在标题栏中显示加载

        // 隐藏加载状态
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh();
    },
    toDetail(e) {
        console.log('toDetail', e.currentTarget.dataset.info)
        const str = JSON.stringify(e.currentTarget.dataset.info)
        wx.navigateTo({
            url: '/pages/detail/index?item=' + str
        })
    },
})