import {
    areaList
} from '@vant/area-data';
import {
    vailPhone,
    showToast
} from '../../utils/util.js'
//获取app实例
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        concatPerson: "", //联系人
        phone: "", //手机号
        city: "请选择", //城市
        provinceName: "", //国标收货地址第一级地址
        cityName: "", //国标收货地址第二级地址
        countyName: "", //国标收货地址第三级地址
        address: "", //详细地址
        show: false,
        areaList,
        checked: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},
    showPopup() {
        this.setData({
            show: true
        });
    },
    onClose() {
        this.setData({
            show: false
        });
    },
    confirmCity(val) {
        console.log('val', val.detail.values[0])
        console.log('val', val.detail.values[1])
        console.log('val', val.detail.values[2])
        this.setData({
            provinceName: val.detail.values[0].name,
            cityName: val.detail.values[1].name,
            countyName: val.detail.values[2].name,
            city: val.detail.values[0].name + val.detail.values[1].name + val.detail.values[2].name
        })
        this.onClose()
    },
    changeCity() {

    },
    onChangDefault(event) {
        this.setData({
            checked: event.detail,
        });
    },
    onChange(e) {
        console.log(e)
        let type = e.currentTarget.dataset.type
        if (type == "concatPerson") {
            this.data.concatPerson = e.detail
        } else if (type == "phone") {
            this.data.phone = e.detail
        } else if (type == "address") {
            this.data.address = e.detail
        }
    },
    //保存
    save: function () {
        let concatPerson = this.data.concatPerson
        let phone = this.data.phone
        let address = this.data.address
        if (!concatPerson) {
            wx.showToast({
                title: "请输入联系人姓名",
                icon: 'none' //success、loading、none 
            })
            return
        }
        let isPhone = vailPhone(phone)
        if (!phone) {
            wx.showToast({
                title: "请输入手机号",
                icon: 'none' //success、loading、none 
            })
            return
        } else {
            if (!isPhone) {
                wx.showToast({
                    title: "请输入合法的手机号",
                    icon: 'none' //success、loading、none 
                })
                return
            }
        }
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
})