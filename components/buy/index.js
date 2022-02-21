// components/buy/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        hideBuy: {
            type: Boolean,
            value: false
        },
        partData: Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        prodNum: 1,
        // skuShow: false,
        commentShow: false,
        couponList: [],
        skuList: [{
                pic: null,
                price: 9999,
                properties: "颜色:白色;内存:16G;版本:公开版",
                skuId: 1788,
                skuName: "白色 16G 公开版",
                stocks: 999
            },
            {
                pic: null,
                price: 9999,
                properties: "颜色:红色;内存:64G;版本:绑定版",
                skuId: 17889,
                skuName: "红色 64G 公开版",
                stocks: 56
            }
        ],
        skuGroup: {},
        findSku: true,
        defaultSku: undefined,
        selectedProp: [],
        selectedPropObj: {},
        propKeys: [],
        allProperties: [],
    },
    lifetimes: {
        attached: function () {
            // 在组件实例进入页面节点树时执行
            this.groupSkuProp()
        },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        hideBuyView: function (e) { // 隐藏商品弹框
            if (e.target.dataset.target == 'self')
                this.setData({
                    hideBuy: true
                })
        },
        getCount: function (e) {
            this.triggerEvent('onGetCount', e.detail)
        },
        buy: function () {
            this.setData({
                hideBuy: true
            })
            this.triggerEvent('buyEvent')
        },
        /**
         * 根据skuList进行数据组装
         */
        groupSkuProp: function () {
            var skuList = this.data.skuList;

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

            var findSku = false;
            for (var i = 0; i < this.data.skuList.length; i++) {
                if (this.data.skuList[i].properties == selectedProperties) {
                    findSku = true;
                    this.setData({
                        defaultSku: this.data.skuList[i],
                    });
                    break;
                }
            }
            this.setData({
                findSku: findSku
            });
        },
        //点击选择规格
        toChooseItem: function (e) {
            var val = e.currentTarget.dataset.val;
            var key = e.currentTarget.dataset.key;
            var selectedPropObj = this.data.selectedPropObj;
            selectedPropObj[key] = val;
            this.setData({
                selectedPropObj: selectedPropObj
            });
            console.log('selectedPropObj',this.data.selectedPropObj)
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
        }

    }

})