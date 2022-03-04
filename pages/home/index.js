// pages/home/index.js
const { homeList } = require('../../utils/api.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    notice: '这是有优惠。',
    swiperList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    goodList: [],
    goodShow: false,
    winHeight: '100%',
    toView: 'good0',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestData()
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight - (res.windowWidth * 90) / 750 + 'px',
        })
      },
    })
  },
  // 页面滑动到相应位置 对应导航提示
  scroll: function (e) {
    console.log(e)
    var that = this
    var height = 0
    var number = 0
    var hightArr = []
    for (var i = 0; i < that.data.responseList.length; i++) {
      //这里的goodlist指对应商品集合
      //获取元素所在位置

      wx.createSelectorQuery()
        .select('#good' + i)
        .boundingClientRect(function (rect) {
          number = rect.height + number + 400
          hightArr.push(number)

          that.setData({
            hightArr: hightArr,
          })
        })
        .exec()
      console.log('hightArr', that.data.hightArr)
    }
    console.log(e.detail.scrollTop)
    var scrollTop = e.detail.scrollTop
    var scrollArr = that.data.hightArr
    for (var i = 0; i < scrollArr.length; i++) {
      if (scrollTop >= 0 && scrollTop < scrollArr[0]) {
        console.log('第一个啊')
        if (0 != this.data.lastActive) {
          this.setData({
            active: 0,
          })
        }
      } else if (scrollTop >= scrollArr[i - 1] && scrollTop <= scrollArr[i]) {
        console.log('这是第' + i + '个')
        if (i != this.data.lastActive) {
          this.setData({
            active: Number(i),
          })
        }
      }
    }
  },

  changeTab(e) {
    console.log('active', e.detail)
    this.setData({
      active: e.detail.name,
      toView: 'good' + e.detail.name,
    })
  },
  toList(e) {
    console.log('toList', e.currentTarget.dataset.type)
    wx.switchTab({
      url: '/pages/good-list/index?type=' + e.currentTarget.dataset.type,
    })
  },
  requestData() {
    homeList().then((res) => {
      this.setData({
        swiperList: res.swiperList,
        notice: res.notice,
        responseList: res.goodsCategoryDetailResponseList,
      })
      this.selectComponent('#tabs').resize()
    })
  },
  search() {
    wx.navigateTo({
      url: '/pages/search-list/index',
    })
  },
  onPullDownRefresh: function () {
    // 请求数据
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.requestData()
    setTimeout(() => {
      // 隐藏加载状态
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 500)
  },
})
