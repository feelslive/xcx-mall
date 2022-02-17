// pages/home/index.js

// 引入接口配置文件urlconfig
const interfaces = require('../../utils/urlconfig.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        notice:"这是一段公告，本店有优惠。",
        swiperList: [{
                "id": "4a4c8b8e4d8c22a97a94b46f58c1f3b9", // 商品id
                "image": "https://img01.yzcdn.cn/vant/apple-1.jpg" //商品封面
            },
            {
                "id": "5a4c8b8e4d8c22a97a94b46f58c1f3b9",
                "image": "https://img01.yzcdn.cn/vant/apple-2.jpg"
            }
        ],
        logos: [],
        quicks: [],
        pageRow: [],
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 500,
        goodList: [{
            "id": "4a4c8b8e4d8c22a97a94b46f58c1f3b9",
            "cover": "/image/classify/miphone.png",
            "title": "黑莓（BlackBerry）KEY2标准版 6GB+64GB双卡双待 4G全网通手机 黑色 移动联通电信手机",
            "price": "3388.00",
            "originalPrice": "4000",
            "monthlySales": "35",
            "count": 1,
        }, {
            "id": "5a4c8b8e4d8c22a97a94b46f58c1f3b9",
            "cover": "/image/classify/huawei.png",
            "title": "HUAWEI P20 Pro 全面屏徕卡三摄游戏手机 6GB+128GB 亮黑色 全网通移动联通电信4G手机 双卡双待",
            "price": "1499.00", // 商品现价格
            "originalPrice": "4000", // 原价
            "monthlySales": "35",   // 月销量
            "count": 1, // 最小购买数量
        }, {
            "id": "3a4c8b8e4d8c22a97a94b46f58c1f3b9",// 商品id
            "cover": "/image/classify/phone.png", // 商品封面
            "title": "荣耀8X Max 7.12英寸90%屏占比珍珠屏", // 商品标题
            "price": "1499.00", // 商品现价格
            "originalPrice": "4000", // 原价
            "monthlySales": "35",   // 月销量
            "count": 1, // 最小购买数量
        }, ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const self = this
        wx.showLoading({
            title: '加载中...',
        })
        wx.request({
            url: interfaces.homepage,
            header: {
                'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
            },
            success(res) {
                self.setData({
                    // swipers: res.data.swipers,
                    logos: res.data.logos,
                    quicks: res.data.quicks,
                    pageRow: res.data.pageRow
                })
                wx.hideLoading()
            }
        })
    },
})