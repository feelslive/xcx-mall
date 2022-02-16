Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    goodItem: {
      type: Object,
      value: {}
    }
  },
  data: {

  },
  methods: {
    toDetail() {
      const str = JSON.stringify(this.data.goodItem)
      wx.navigateTo({
        url: '../../pages/goodDetail/index?item=' + str
      })
    },
    /**
     * 点击查看详情
     */
    switchProlistDetail: function (e) {
      console.log('e', e);
      var index = e.currentTarget.dataset.index
      const str = JSON.stringify(this.data.goodItem)
      // this.triggerEvent('myevent',{params: data[index]},{})
      wx.navigateTo({
        // url: '/pages/detail/index?id=' + this.data.prolist[index].id,
        url: '/pages/detail/index?id=' + this.data.goodItem.id,
      })
    },
    /**
     * 加入购物车
     */
    addCart() {
      var self = this
      wx.getStorage({
        key: 'cartInfo',
        success(res) {
          const cartArray = res.data
          console.log('self.data.goodItem', self.data.goodItem);
          let partData = self.data.goodItem
          console.log('partData', partData);
          let isExit = false; // 判断数组是否存在该商品
          cartArray.forEach(cart => {
            if (cart.id == partData.id) { // 存在该商品
              isExit = true
              cart.total += partData.count
              wx.setStorage({
                key: 'cartInfo',
                data: cartArray,
              })
            }
          })
          console.log('partData', partData);
          if (!isExit) { // 不存在该商品
            partData.total = partData.count
            cartArray.push(partData)
            wx.setStorage({
              key: 'cartInfo',
              data: cartArray,
            })
          }
          // self.setBadge(cartArray)
        },
        fail() {
          let partData = self.data.goodItem
          partData.total = partData.count
          let cartArray = []
          cartArray.push(partData)
          wx.setStorage({
            key: 'cartInfo',
            data: cartArray,
          })
          // self.setBadge(cartArray)
        }
      })
      // 购物车提醒
      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 3000
      })
    },
    // setBadge(cartArray) {
    //   // 设置Tabbar图标
    //   cartArray.length > 0 ?
    //     wx.setTabBarBadge({
    //       index: 2,
    //       text: String(cartArray.length)
    //     }) :
    //     wx.removeTabBarBadge({
    //       index: 2
    //     });
    // }
  }
})