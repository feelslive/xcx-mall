// pages/accounts/index.js
const {
    regFenToYuan
} = require("../../utils/util.js");
const {
    submitOrder,
    getOrder,
    payOrder
} = require('../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addressInfo: {},
        accountInfo: {
            // totalPrice: 9999,
            // "skuList": [{
            //     "skuPrice": 99,
            //     "properties": "颜色:白色;内存:64G;版本:公开版",
            //     "skuId": 2,
            //     "skuImg": "https://img01.yzcdn.cn/vant/apple-2.jpg",
            //     "skuName": "白色 64G 公开版",
            //     "stocks": 5,
            //     "skuTitle": "荣耀8X Max 7.12英寸90%屏占比珍珠屏",
            //     "totalCount": 1
            // }]
        },
        orderType: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('options', options)
        let accountInfo = JSON.parse(options.accountInfo)
        console.log('accountInfo', accountInfo)
        console.log('options.type', options.type)
        // cart 购物车
        // order 订单 0
        // buy 立即购买
        // detail 订单详情
        this.setData({
            orderType: options.type
        })
        if (options.type === 'cart') {
            // price: 9999
            // properties: "颜色:白色;内存:64G;版本:公开版"
            // select: true
            // skuId: 2
            // skuImg: "https://img01.yzcdn.cn/vant/apple-2.jpg"
            // skuName: "白色 64G 公开版"
            // stocks: 5
            // title: "荣耀8X Max 7.12英寸90%屏占比珍珠屏"
            // total: 3
            // if (options.type === 'cart') {
            //     accountInfo.totalPrice = accountInfo.totalMoney
            // } else {
            //     accountInfo.totalPrice = accountInfo.totalMoney
            // }
            accountInfo.totalPrice = accountInfo.totalMoney
            accountInfo.skuList.forEach(sku => {
                sku.skuPrice = sku.price
                sku.totalPrice = sku.totalPrice
                sku.skuTitle = sku.title
                sku.totalCount = sku.total
            });
            this.setData({
                accountInfo: accountInfo,
            })
        }
        if (options.type === 'buy') {
            accountInfo.totalPrice = 0
            accountInfo.skuList.forEach(sku => {
                sku.skuPrice = sku.price
                sku.totalPrice = sku.totalPrice
                sku.skuTitle = sku.title
                sku.totalCount = sku.total
                accountInfo.totalPrice += Number(sku.price) * sku.total
            });
            // accountInfo.totalPrice = regFenToYuan(accountInfo.totalPrice)
            this.setData({
                accountInfo: accountInfo,
            })
        }


        // if (options.orderDetail === 'true') {
        // accountInfo.totalMoney = regFenToYuan(accountInfo.totalPrice)
        // accountInfo.totalMoney = accountInfo.totalPrice
        // accountInfo.skuList.forEach(sku => {
        // sku.skuPrice = regFenToYuan(sku.skuPrice)
        // sku.totalPrice = regFenToYuan(sku.totalPrice)

        // sku.price = sku.skuPrice
        // sku.total = sku.totalCount
        // sku.loopImgUrl = [
        //     sku.skuImg
        // ]
        // });
        // }
        // options.totalPrice = regFenToYuan(options.totalPrice)
        // options.skuList.forEach(sku => {
        //     sku.skuPrice = regFenToYuan(sku.skuPrice)
        //     sku.totalPrice = regFenToYuan(sku.totalPrice)
        // });
        // let addressInfo = wx.setStorageSync('defaultAddress') || null
        // if (options.type === 'detail' || options.type === 'order') {
        //     addressInfo = accountInfo.address
        // }
        // this.setData({
        // orderDetail: options.orderDetail === 'true',
        // accountInfo: accountInfo,
        // addressInfo: addressInfo
        // })
        if (options.type === 'detail' || options.type === 'order') {
            this.setData({
                orderId: options.orderId
            })
            this.getOrderDetail()
        }
    },
    selectAddress() {
        if (!this.data.accountInfo.status) {
            wx.navigateTo({
                url: '/pages/address-list/index?select=true'
            })
        }
    },
    getOrderDetail() {
        let params = {
            id: this.data.orderId
        }
        getOrder(params).then(res => {
            console.log('getOrderDetail', res)
            res.totalPrice = regFenToYuan(res.totalPrice)
            res.skuList.forEach(sku => {
                sku.skuPrice = regFenToYuan(sku.skuPrice)
                sku.totalPrice = regFenToYuan(sku.totalPrice)
            });
            this.setData({
                accountInfo: res,
                addressInfo: res.address,
                orderId: res.id
            })
        })
    },
    submitOrder() {
        if (!this.data.addressInfo || !this.data.addressInfo.id) {
            wx.showToast({
                title: "请先选择收货地址",
                icon: 'none',
            })
            return false
        }


        let params = {
            skuList: [],
            addressId: this.data.addressInfo.id
        }
        this.data.accountInfo.skuList.forEach(item => {
            params.skuList.push({
                skuId: item.skuId,
                count: item.total
            })
        })
        submitOrder(params).then(res => {
            console.log('submitOrder', res)
            this.setData({
                orderInfo: res,
                orderId: res.id
            })
            let cartInfo = wx.getStorageSync('cartInfo')
            if (cartInfo) {
                cartInfo.forEach((cart, i) => {
                    if (cart.select) {
                        cartInfo.splice(i, 1);
                    }
                });
            }
            wx.setStorageSync('cartInfo', cartInfo);
            //支付
            this.WeChatPay()
            // 跳转
            // wx.redirectTo({
            //     url: '/pages/accounts/index?accountInfo=' + JSON.stringify(this.data.orderInfo) + '&type=detail&orderId=' + this.data.orderId
            // })

        })
    },
    WeChatPay: function () {
        console.log('this.data.accountInfo', this.data.accountInfo)
        let params = {
            orderId: this.data.orderId,
        }
        payOrder(params).then(res => {
            console.log('payOrder res', res)
            // 发起支付
            wx.requestPayment({
                timeStamp: res.timestamp,
                nonceStr: res.nonceStr,
                package: "prepay_id=" + res.prepayId,
                signType: res.signType || 'MD5',
                paySign: res.paySign,
                success: (res) => {
                    console.log("requestPayment", res)
                    wx.showToast({
                        title: '支付成功',
                    })
                    // wx.redirectTo({
                    //     url: '/pages/accounts/index?accountInfo=' + JSON.stringify(this.data.orderInfo) + '&type=detail'
                    // })
                },
                fail: (err) => {
                    console.log('requestPayment err', err)
                    wx.showToast({
                        title: '支付失败',
                    })
                },
                complete: () => {
                    this.getOrderDetail()
                }
            })
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
        // 请求数据
        wx.showNavigationBarLoading() //在标题栏中显示加载
        if (this.data.orderId) {
            this.getOrderDetail()
        }
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