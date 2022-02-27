// pages/cart/index.js

Page({
    /**
     * 页面的初始数据
     */
    data: {
        cartArray: [],
        totalMoney: '0.00', // 金额总计
        totalCount: 0, // 结算商品数量总和
        selectAll: false, // 是否全选
        isEditing: false
    },

    setAccount: function () {
        let shoppingList = [];
        this.data.cartArray.forEach(cart => {
            if (cart.select) {
                shoppingList.push(cart)
            }
        })
        // 总价 + 商品
        const accountInfo = {
            skuList: shoppingList,
            totalMoney: this.data.totalMoney
        }
        wx.navigateTo({
            url: '/pages/accounts/index?accountInfo=' + JSON.stringify(accountInfo) + '&type=cart'
        })
        // let params = []
        // shoppingList.forEach(item => {
        //     params.push({
        //         skuId: item.skuId,
        //         count: item.total
        //     })
        // })
        // submitOrder(params).then(res => {
        //     console.log('submitOrder', res)
        //     // 跳转
        //     wx.navigateTo({
        //         url: '/pages/accounts/index?accountInfo=' + JSON.stringify(res)
        //     })
        // })


    },
    changeIsEditing: function (e) {
        const operation = e.currentTarget.dataset.operation
        this.data.cartArray.forEach(cart => {
            (cart.select = false) // 选中
        });
        this.setData({
            cartArray: this.data.cartArray,
            selectAll: false,
            totalMoney: '0.00',
            totalCount: 0,
            isEditing: operation === 'complete' ? false : true
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (!wx.getStorageSync('sid')) {
            let router = getCurrentPages()[0]
            wx.reLaunch({
                url: '/pages/login/index?url=' + JSON.stringify(router.route),
            })
        }
        var self = this;
        wx.getStorage({
            key: 'cartInfo',
            success: function (res) {
                const cartArray = res.data;
                // cartArray.forEach(cart => {
                //   (cart.select = true) // 选中
                // });
                // self.setData({
                //   cartArray: cartArray,
                //   selectAll: true,
                //   // totalMoney: '0.00',
                //   totalCount: 0
                // });
                let totalMoney = 0; // 合计初始化为0
                let totalCount = 0; // 结算个数初始化为0
                cartArray.forEach(cart => {
                    // 设置选中或不选中状态 每个商品的选中状态和全选按钮一致
                    cart.select = true;
                    // 计算总金额和商品个数
                    if (cart.select) {
                        // 如果选中计算
                        totalMoney += Number(cart.price) * cart.total;
                        totalCount++;
                    } else {
                        // 全不选中置为0
                        totalMoney = 0;
                        totalCount = 0;
                    }
                });
                // 更新data
                self.setData({
                    cartArray: cartArray,
                    totalMoney: String(totalMoney.toFixed(2)),
                    totalCount: totalCount,
                    selectAll: true
                });
                // self.selectAll()
                // // 设置Tabbar图标
                // cartArray.length > 0
                //   ? wx.setTabBarBadge({
                //       index: 2,
                //       text: String(cartArray.length)
                //     })
                //   : wx.removeTabBarBadge({
                //       index: 2
                //     });
            }
        });
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        // 更新Storage
        const cartArray = this.data.cartArray;
        wx.setStorage({
            key: 'cartInfo',
            data: cartArray
        });
        this.setData({
            isEditing: false
        })
    },
    /**
     * 子组件修改count触发
     */
    onGetCount: function (e) {
        const index = e.currentTarget.dataset.index;
        const cartArray = this.data.cartArray;
        cartArray[index].total = e.detail.val;
        // 更新data
        this.setData({
            cartArray: cartArray
        });
    },
    /**
     * 点击进入详情页面
     */
    switchGoodDetail(e) {
        const index = e.currentTarget.dataset.index;
        const cartArray = this.data.cartArray;
        wx.navigateTo({
            url: '/pages/detail/index?item=' + JSON.stringify(cartArray[index])
        });
    },
    /**
     * 选中单个商品
     */
    selectGood(e) {
        const index = e.currentTarget.dataset.index;
        const cartArray = this.data.cartArray;
        let totalMoney = Number(this.data.totalMoney); // 字符串转为number来进行计算
        let totalCount = this.data.totalCount;
        let selectAll = this.data.selectAll;
        // 设置选中或不选中状态
        cartArray[index].select = !cartArray[index].select;
        // 计算总金额和商品个数
        if (cartArray[index].select) {
            totalMoney += Number(cartArray[index].price) * cartArray[index].total;
            totalCount++;
        } else {
            totalMoney -= Number(cartArray[index].price) * cartArray[index].total;
            totalCount--;
            selectAll = false;
        }
        // 更新data
        this.setData({
            cartArray: cartArray,
            totalMoney: String(totalMoney.toFixed(2)),
            totalCount: totalCount,
            selectAll: selectAll
        });
    },
    /**
     * count -1
     */
    subCount(e) {
        const index = e.currentTarget.dataset.index;
        const cartArray = this.data.cartArray;
        let totalMoney = Number(this.data.totalMoney);
        // 计算金额
        if (cartArray[index].select) {
            totalMoney -= Number(cartArray[index].price);
        }
        this.setData({
            totalMoney: String(totalMoney.toFixed(2))
        });
    },
    /**
     * count +1
     */
    addCount(e) {
        const index = e.currentTarget.dataset.index;
        const cartArray = this.data.cartArray;
        let totalMoney = Number(this.data.totalMoney);
        // 计算金额
        if (cartArray[index].select) {
            totalMoney += Number(cartArray[index].price);
        }
        this.setData({
            totalMoney: String(totalMoney.toFixed(2))
        });
    },
    /**
     * 全选
     */
    selectAll() {
        const cartArray = this.data.cartArray;
        let totalMoney = 0; // 合计初始化为0
        let totalCount = 0; // 结算个数初始化为0
        let selectAll = this.data.selectAll;
        selectAll = !selectAll; // 全选按钮置反

        cartArray.forEach(cart => {
            // 设置选中或不选中状态 每个商品的选中状态和全选按钮一致
            cart.select = selectAll;
            // 计算总金额和商品个数
            if (cart.select) {
                // 如果选中计算
                totalMoney += Number(cart.price) * cart.total;
                totalCount++;
            } else {
                // 全不选中置为0
                totalMoney = 0;
                totalCount = 0;
            }
        });
        // 更新data
        this.setData({
            cartArray: cartArray,
            totalMoney: String(totalMoney.toFixed(2)),
            totalCount: totalCount,
            selectAll: selectAll
        });
    },

    /**
     * 删除事件
     */
    delAccount: function (e) {
        console.log('delAccount e', e);
        console.log('this.data.cartArray', this.data.cartArray);
        if (this.data.selectAll) {
            wx.setStorage({
                key: 'cartInfo',
                data: []
            });
            this.setData({
                cartArray: [],
                totalMoney: '0.00',
                totalCount: 0
            });
            return false
        }
        var index = e.currentTarget.dataset.index;
        var self = this;
        const partData = this.data.cartArray;
        partData.forEach((cart, i) => {
            if (cart.select) {
                partData.splice(i, 1);
            }
        });
        this.setData({
            cartArray: partData,
            totalMoney: '0.00',
            totalCount: 0
        });
        wx.setStorage({
            key: 'cartInfo',
            data: partData
        });
        // self.update(index);
        // 删除storage
        // wx.getStorage({
        //   key: 'cartInfo',
        //   success: function (res) {
        //     const partData = res.data;
        //     partData.forEach((cart, i) => {
        //       if (cart.select) {
        //         partData.splice(i, 1);
        //       }
        //     });
        //     wx.setStorage({
        //       key: 'cartInfo',
        //       data: partData
        //     });
        //     self.update(index);
        //   }
        // });
    },
    update: function (index) {
        var cartArray = this.data.cartArray;
        let totalMoney = Number(this.data.totalMoney);
        let totalCount = this.data.totalCount;
        // 计算价格和数量
        if (cartArray[index].select) {
            totalMoney -= Number(cartArray[index].price) * cartArray[index].total;
            totalCount--;
        }
        // 删除
        cartArray.splice(index, 1);
        // 更新数据
        this.setData({
            cartArray: this.data.cartArray,
            totalCount: totalCount,
            totalMoney: String(totalMoney.toFixed(2))
        });
    }
});