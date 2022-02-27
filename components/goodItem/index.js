const {
    regFenToYuan
} = require("../../utils/util");
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
    data: {},
    lifetimes: {
        attached: function () {
            console.log('partDgoodItemata', this.data.goodItem)
            // 在组件实例进入页面节点树时执行
            this.data.goodItem.price = regFenToYuan(this.data.goodItem.price)
            this.data.goodItem.originalPrice = regFenToYuan(this.data.goodItem.originalPrice)
            this.setData({
                goodInfo: this.data.goodItem
            })
        },
    },
    methods: {
        toDetail() {
            const str = JSON.stringify(this.data.goodInfo)
            wx.navigateTo({
                url: '../../pages/detail/index?item=' + str
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
                    let partData = self.data.goodInfo
                    let isExit = false; // 判断数组是否存在该商品
                    cartArray.forEach(cart => {
                        if (cart.skuId == partData.skuId) { // 存在该商品
                            isExit = true
                            cart.total += 1
                            wx.setStorage({
                                key: 'cartInfo',
                                data: cartArray,
                            })
                        }
                    })
                    if (!isExit) { // 不存在该商品
                        partData.total = 1
                        cartArray.push(partData)
                        wx.setStorage({
                            key: 'cartInfo',
                            data: cartArray,
                        })
                    }
                },
                fail() {
                    let partData = self.data.goodInfo
                    partData.total = 1
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
        }
    }
})