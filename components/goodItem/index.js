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
        total: 1,
        defaultSku: {}
    },
    lifetimes: {
        attached: function () {
            console.log('partDgoodItemata', this.data.goodItem)
            // 在组件实例进入页面节点树时执行
            this.data.goodItem.skuList[0].id = this.data.goodItem.id
            this.data.goodItem.skuList[0].title = this.data.goodItem.title
            this.setData({
                defaultSku: this.data.goodItem.skuList[0],
            });
        },
    },
    methods: {
        toDetail() {
            const str = JSON.stringify(this.data.defaultSku)
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
            const str = JSON.stringify(this.data.defaultSku)
            // this.triggerEvent('myevent',{params: data[index]},{})
            wx.navigateTo({
                // url: '/pages/detail/index?id=' + this.data.prolist[index].id,
                url: '/pages/detail/index?id=' + this.data.defaultSku.id,
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
                    let partData = self.data.defaultSku
                    let isExit = false; // 判断数组是否存在该商品
                    cartArray.forEach(cart => {
                        if (cart.skuId == partData.skuId) { // 存在该商品
                            isExit = true
                            cart.total += self.data.total
                            wx.setStorage({
                                key: 'cartInfo',
                                data: cartArray,
                            })
                        }
                    })
                    if (!isExit) { // 不存在该商品
                        partData.total = self.data.total
                        cartArray.push(partData)
                        wx.setStorage({
                            key: 'cartInfo',
                            data: cartArray,
                        })
                    }
                },
                fail() {
                    let partData = self.data.defaultSku
                    partData.total = self.data.total
                    let cartArray = []
                    cartArray.push(partData)
                    wx.setStorage({
                        key: 'cartInfo',
                        data: cartArray,
                    })
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