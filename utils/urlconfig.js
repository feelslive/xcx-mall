const domain = 'https://enigmatic-island-47099.herokuapp.com'; 
const domain2 = "https://www.thenewstep.cn"
const interfaces = {
  // 返回的首页请求的json数据
  homepage: domain + '/api/profiles/homepage',
  
  // 返回的商品的json数据
  productions: domain + '/api/profiles/productions',
  
  // 返回的商品列表的json数据
  productionsList: domain + '/api/profiles/productionsList',

  // 返回的商品详情的json数据
  productionDetail: domain + '/api/profiles/productionDetail',

  // 获取openid 参数: code appid secret
  getOpenid: domain + "/api/profiles/getOpenid/",

  // 微信支付
  wechatPay: domain2 + "/xcxzf/jsapi.php"

}

module.exports = interfaces;