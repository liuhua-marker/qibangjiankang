var app = getApp();
var util = require('../../../utils/util.js');
const http = require('../../../utils/http')
const api = require('../../../utils/server.api.js')

Page({
  data: {
    orderId: 0,
    second: 0,
    payType: 1,
    code: null,
    updateAmount: 0.00,
    sendPhone: '加载中',
    restCode: '点击获取验证码'
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.error(options)
    this.setData({
      orderId: options.orderId,
      updateAmount: options.actualPrice,
      amount: 0
    })
    this.wallel();
  },
  wallel: function () {
    console.log(app.globalData)
    var userInfo = app.globalData.userInfo;
    var that = this;
    http.post({
      url: api.wattel(),
      showLoading: true,
      data: {
        userId:wx.getStorageSync('organId')
      },
      success: (res) => {
        console.log('wallel',res)
        that.setData({
          amount: res.data.amount,
          sendPhone: '您绑定手机号码是' + res.data.phone
        });
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.requestMall(api.WATTEL, { userId: app.userInfo().userId }, "POST").then(function (res) {

    //     that.setData({
    //       amount: res.data.amount,
    //       sendPhone: '您绑定手机号码是'+res.data.phone
    //     });

    // });
  },
  setCodeValue: function (value) {
    this.setData({
      code: value.detail.value
    });
  },
  addPay: function () {
    console.log(this.data.code,this.data.orderId, this.data.payType)
    var url = api.PayPrepayId(this.data.code,this.data.orderId, this.data.payType);
    console.log(url)
    // url = url.render({ 'id': this.data.orderId, type: this.data.payType });
    if (this.data.payType == 1) { //积分支付
      this.wallelPay(url)
    }
  },
  wallelPay: function (url) {
    if (!this.data.code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let that = this;
    http.post({
        url: url,
        showLoading: true,
        data: {
        },
        success: (res) => {
          console.log(res)
          if (res.data.code !== 0) {
            wx.showToast({
              title: res.data.code===50003005?'验证码无效':res.data.msg,
              icon: 'none',
              duration: 2000
            })
            return
          }
          wx.setStorageSync("buyData", JSON.stringify(res.data));
          console.log('res.data.data.paystatus',res.data.data.paystatus)
          if (res.data.data.paystatus == 1) { //支付完成
            wx.redirectTo({
              url: '/pages/shoppingMall/payResult/payResult?status=true&orderId=' + res.data.data.orderId,
            })
          
        } else {
          wx.redirectTo({
            url: '/pages/paystatus/payResult/payResult?status=false&orderId=' + that.data.orderId,
          })
        }
      },
      fail: () => {
        console.error("fail")
      }
    })
  // util.requestMall(url, {
  //   "code": that.data.code
  // }, "POST").then(function (res) {
  //   console.info(JSON.stringify(res))
  //   console.info("res.data.code:" + res.data.code)
  //   if (res.data.code == 0) {
  //     console.info("res.data.data.payStatus:" + res.data.data.paystatus)
  //     if (res.data.data.paystatus == 1) { //支付完成
  //       wx.redirectTo({
  //         url: '/pages/mall/payResult/payResult?status=true&orderId=' + res.data.data.orderId,
  //       })
  //     }
  //   } else {
  //     wx.redirectTo({
  //       url: '/pages/mall/payResult/payResult?status=false&orderId=' + that.data.orderId,
  //     })
  //   }
  // });
},
validate: function () {
  let that = this;
  var userId = wx.getStorageSync('userInfo').userId;
  http.get({
    url: api.UserValidate(),
    showLoading: true,
    data: {
      userId: wx.getStorageSync('organId')
    },
    success: (res) => {
      // if (res.data.code !== 200) {
      //   wx.showToast({
      //     title: res.data.msg,
      //     icon: 'none'
      //   })
      //   return
      // }

        that.setData({
          second: 60
        })
        that.setRestCode();
      
    },
    fail: () => {
      console.error("fail")
    }
  })
  // util.requestMall(api.UserValidate, {
  //   'userId': userId
  // }, "GET").then(function (res) {
  //   console.info(JSON.stringify(res))
  //   if (res.data.code == 0) {
  //     that.setData({
  //       second: 60
  //     })
  //     that.setRestCode();
  //   }
  // });
},
setRestCode: function () {
  let that = this;
  // console.info(that.data.second)
  if (that.data.second > 0) {
    that.setData({
      second: that.data.second - 1
    })
    setTimeout(function () {
      // console.info(that.data.second + "=>回掉")
      that.setRestCode()
    }, 1000);

  }
},
//向服务请求支付参数
requestPayParam() {
  let that = this;
  // 微信支付  是否走微信支付待确定

  // var url = api.PayPrepayId;
  // url = url.render({
  //   'id': this.data.orderId,
  //   type: 2
  // });
  // util.request(api.PayPrepayId, {
  //   orderId: that.data.orderId,
  //   payType: 1
  // }).then(function (res) {
  //   if (res.errno === 0) {
  //     let payParam = res.data;
  //     wx.requestPayment({
  //       'timeStamp': payParam.timeStamp,
  //       'nonceStr': payParam.nonceStr,
  //       'package': payParam.package,
  //       'signType': payParam.signType,
  //       'paySign': payParam.paySign,
  //       'success': function (res) {
  //         wx.redirectTo({
  //           url: '/pages/payResult/payResult?status=true&orderId=' + that.data.orderId,
  //         })
  //       },
  //       'fail': function (res) {
  //         wx.redirectTo({
  //           url: '/pages/payResult/payResult?status=false&orderId=' + that.data.orderId,
  //         })
  //       }
  //     })
  //   }
  // });
},
startPay() {
  this.requestPayParam();
}
})