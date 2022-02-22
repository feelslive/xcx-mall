// pages/detail/index.js
// 引入接口配置文件urlconfig
const interfaces = require('../../utils/urlconfig.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        "partData": {
            "id": "3a4c8b8e4d8c22a97a94b46f58c1f3b9",
            "loopImgUrl": [
                "/image/classify/phone.png",
                "/image/classify/miphone.png",
                "/image/classify/huawei.png"
            ],
            "title": "荣耀8X Max 7.12英寸90%屏占比珍珠屏 4GB+64GB 魅海蓝 移动联通电信4G全面屏手机 双卡双待",
            "price": "1499.00",
            "count": 1,
            skuList: [{
                    pic: '/image/classify/phone.png',
                    price: 9999,
                    properties: "颜色:白色;内存:16G;版本:公开版",
                    skuId: 1788,
                    skuName: "白色 16G 公开版",
                    stocks: 999
                },
                {
                    pic: '/image/classify/miphone.png',
                    price: 9999,
                    properties: "颜色:红色;内存:64G;版本:绑定版",
                    skuId: 17889,
                    skuName: "红色 64G 绑定版",
                    stocks: 56
                }
            ],
        },
        total: 1,
        hideBuy: false, // 是否购买的遮罩
        badgeCount: 0,
        prodNum: 1,
        commentShow: false,
        couponList: [],
        skuGroup: {},
        findSku: true,
        defaultSku: undefined,
        selectedProp: [],
        selectedPropObj: {},
        propKeys: [],
        allProperties: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('options', options);
        // options = JSON.parse(options.item)
        // const id = options.id
        const id = "3a4c8b8e4d8c22a97a94b46f58c1f3b9"
        const self = this
        // 发送接口请求
        // wx.showLoading({
        //     title: '加载中...',
        // })
        // wx.request({
        //     url: interfaces.productionDetail,
        //     success(res) {
        //         let result = null
        //         res.data.forEach(data => {
        //             if (data.partData.id == id)
        //                 result = data
        //         })

        //         self.setData({
        //             partData: result.partData,
        //         })
        //         wx.hideLoading()
        //     }
        // })
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
        const self = this
        wx.getStorage({
            key: 'cartInfo',
            success: function (res) {
                const cartArray = res.data
                self.setBadge(cartArray)
            },
        })
        this.groupSkuProp()
    },
    /**
     * 显示商品弹框
     */
    popBuyView: function () {
        this.setData({
            hideBuy: true
        })
    },
    hideBuyView: function (e) { // 隐藏商品弹框
        this.setData({
            hideBuy: false
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
                self.setBadge(cartArray)
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
                self.setBadge(cartArray)
            }
        })
        // 购物车提醒
        wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 3000
        })
    },
    /**
     * 设置购物车图标
     */
    setBadge(cartArray) {
        this.setData({
            badgeCount: cartArray.length
        })
    },
    /**
     * 显示购物车
     */
    showCartView: function () {
        wx.switchTab({
            url: '/pages/cart/index'
        })
    },
    /**
     * 根据skuList进行数据组装
     */
    groupSkuProp: function () {
        var skuList = this.data.partData.skuList;

        //当后台返回只有一个SKU时，且SKU属性值为空时，即该商品没有规格选项，该SKU直接作为默认选中SKU
        if (skuList.length == 1 && skuList[0].properties == "") {
            this.setData({
                defaultSku: skuList[0]
            });
            return;
        }

        var skuGroup = {}; //所有的规格名(包含规格名下的规格值集合）对象，如 {"颜色"：["金色","银色"],"内存"：["64G","256G"]}
        var allProperties = []; //所有SKU的属性值集合，如 ["颜色:金色;内存:64GB","颜色:银色;内存:64GB"]
        var propKeys = []; //所有的规格名集合，如 ["颜色","内存"]

        for (var i = 0; i < skuList.length; i++) {

            //找到和商品价格一样的那个SKU，作为默认选中的SKU
            var defaultSku = this.data.defaultSku;
            var isDefault = false;
            if (!defaultSku && skuList[i].price == this.data.price) {
                defaultSku = skuList[i];
                isDefault = true;
                this.setData({
                    defaultSku: defaultSku
                });
            }

            var properties = skuList[i].properties; //如：版本:公开版;颜色:金色;内存:64GB
            allProperties.push(properties);
            var propList = properties.split(";"); // 如：["版本:公开版","颜色:金色","内存:64GB"]

            var selectedPropObj = this.data.selectedPropObj;
            for (var j = 0; j < propList.length; j++) {

                var propval = propList[j].split(":"); //如 ["版本","公开版"]
                var props = skuGroup[propval[0]]; //先取出 规格名 对应的规格值数组

                //如果当前是默认选中的sku，把对应的属性值 组装到selectedProp
                if (isDefault) {
                    propKeys.push(propval[0]);
                    selectedPropObj[propval[0]] = propval[1];
                }

                if (props == undefined) {
                    props = []; //假设还没有版本，新建个新的空数组
                    props.push(propval[1]); //把 "公开版" 放进空数组
                } else {
                    if (!this.array_contain(props, propval[1])) { //如果数组里面没有"公开版"
                        props.push(propval[1]); //把 "公开版" 放进数组
                    }
                }
                skuGroup[propval[0]] = props; //最后把数据 放回版本对应的值
            }
            this.setData({
                selectedPropObj: selectedPropObj,
                propKeys: propKeys
            });
        }
        this.parseSelectedObjToVals();
        this.setData({
            skuGroup: skuGroup,
            allProperties: allProperties
        });
        console.log('skuGroup', this.data)
    },

    //将已选的 {key:val,key2:val2}转换成 [val,val2]
    parseSelectedObjToVals: function () {
        var selectedPropObj = this.data.selectedPropObj;
        var selectedProperties = "";
        var selectedProp = [];
        for (var key in selectedPropObj) {
            selectedProp.push(selectedPropObj[key]);
            selectedProperties += key + ":" + selectedPropObj[key] + ";";
        }
        selectedProperties = selectedProperties.substring(0, selectedProperties.length - 1);
        this.setData({
            selectedProp: selectedProp
        });
        // console.log('selectedProperties',selectedProperties)
        var findSku = false;
        for (var i = 0; i < this.data.partData.skuList.length; i++) {
            var propList = selectedProperties.split(";");
            var skuPropList = this.data.partData.skuList[i].properties.split(";");
            // if (this.data.partData.skuList[i].properties === selectedProperties) {
            if (this.equalsIgnoreOrder(propList, skuPropList)) {
                // TODO:
                // this.data.partData.skuList[i].skuId
                findSku = true;
                this.data.partData.skuList[i].id = this.data.partData.id
                this.data.partData.skuList[i].title = this.data.partData.title
                this.setData({
                    defaultSku: this.data.partData.skuList[i],
                });
                break;
            }
        }
        this.setData({
            findSku: findSku
        });
        console.log('findSku', this.data.findSku)
    },
    equalsIgnoreOrder: function (a, b) {
        if (a.length !== b.length) return false
        const uniqueValues = new Set([...a, ...b])
        for (const v of uniqueValues) {
            const aCount = a.filter(e => e === v).length
            const bCount = b.filter(e => e === v).length
            if (aCount != bCount) return false
        }
        return true
    },
    //点击选择规格
    toChooseItem: function (e) {
        var val = e.currentTarget.dataset.val;
        var key = e.currentTarget.dataset.key;
        var selectedPropObj = this.data.selectedPropObj;
        selectedPropObj[key] = val;
        this.data.partData.selectedPropObj = selectedPropObj
        this.data.partData.selectedPropObj = selectedPropObj
        this.setData({
            selectedPropObj: selectedPropObj,
            partData: this.data.partData,
            total: 1
        });
        this.parseSelectedObjToVals();
    },

    //判断数组是否包含某对象
    array_contain: function (array, obj) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == obj) //如果要求数据类型也一致，这里可使用恒等号===
                return true;
        }
        return false;
    },
    closePopup: function () {
        this.setData({
            hideBuy: false
        });
    },
    onChangeCount(e) {
        console.log(e.detail)
        // console.log(this.data.defaultSku.stocks)
        if (e.detail > (this.data.defaultSku && this.data.defaultSku.stocks)) {
            this.setData({
                total: this.data.defaultSku.stocks
            })
        } else {
            this.setData({
                total: e.detail
            })
        }
    },
})