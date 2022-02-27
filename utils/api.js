const baseURL = 'http://hm.adznb.com';

function request(method, url, data) {
    return new Promise(function (resolve, reject) {
        let header = {
            'content-type': 'application/json',
        };
        header['sid'] = wx.getStorageSync('sid') || ''
        wx.showLoading({
            title: '加载中...',
        })
        wx.request({
            url: baseURL + url,
            method: method,
            // data: method === POST ? JSON.stringify(data) : data,
            data: data,
            header: header,
            success(res) {
                //请求成功
                if (res.data.code === 0) {
                    resolve(res.data.data);
                } else if (res.data.code === 200) {
                    let router = getCurrentPages()[0]
                    wx.reLaunch({
                        url: '/pages/login/index?url=' + JSON.stringify(router.route),
                    })
                } else {
                    //其他异常
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                    })
                    reject(res);
                }
            },
            fail(err) {
                //请求失败
                reject(err)
                wx.showToast({
                    title: "请求异常",
                    icon: 'none',
                })
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    })
}

// 首页列表
export const homeList = (data) => {
    return request("GET", "/app/main", data)
}
// 商品列表
export const goodsList = (data) => {
    return request("GET", "/app/goods/list", data)
}
// 商品详情
export const goodsDetail = (data) => {
    return request("GET", "/app/goods/info", data)
}

// 验证码登陆
export const login = (data) => {
    return request("POST", "/app/user/login", data)
}
// 验证码
export const sendVerifyCode = (data) => {
    return request("GET", "/app/user/sendVerifyCode", data)
}

// 用户信息
export const userInfo = (data) => {
    return request("GET", "/app/user/mine", data)
}

// 地址列表
export const addressList = (data) => {
    return request("GET", "/app/address/list", data)
}
// 新增地址
export const addAddress = (data) => {
    return request("POST", "/app/address/add", data)
}

// 提交订单
export const submitOrder = (data) => {
    return request("POST", "/app/order/submit", data)
}

// 订单列表
export const orderList = (data) => {
    return request("GET", "/app/order/list", data)
}

// 取消订单
export const cancelOrder = (data) => {
    return request("GET", "/app/order/cancel", data)
}

// 订单详情
export const getOrder = (data) => {
    return request("GET", "/app/order/getOrder", data)
}

// 订单支付
export const payOrder = (data) => {
    return request("GET", "/app/order/pay", data)
}