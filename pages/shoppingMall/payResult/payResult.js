var app = getApp();
var util = require('../../../utils/util.js');
const http = require('../../../utils/http')
const api = require('../../../utils/server.api.js')

var app = getApp();
Page({
   
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.info(options)
    this.setData({
      orderId: options.orderId,
      status: options.status
    })
    this.updateSuccess()
  },
  
  updateSuccess: function () {
    
  },

  payOrder() {
    pay.payOrder(parseInt(this.data.orderId)).then(res => {
      this.setData({
        status: true
      });
    }).catch(res => {
      util.showErrorToast('支付失败');
    });
  }
})