var app = getApp();
var util = require('../../../utils/util.js');
const http = require('../../../utils/http')
const api = require('../../../utils/server.api.js')
Page({
  data: {
    picPath: api.picPath,
    picStyle: api.picStyle(),
    orderStatus:{
      '0': "待支付",
      "1": "待发货",
      "2": "已发货",
      "3": "已签收",
      "4": "已取消",
      "5": "关闭"
    },
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    handleOption: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },
  getOrderDetail() {
    let that = this;
    http.get({
      url: api.OrderDetail(that.data.orderId),
      showLoading: true,
      data: {},
      success: (res) => {
        console.log(res)
        // if (res.data.code !== 200) {
        //   wx.showToast({
        //     title: res.data.msg,
        //     icon: 'none'
        //   })
        //   return
        // }
        that.setData({
          orderInfo: res.data,
          orderGoods: res.data.orderdetailList
        });
        //that.payTimer();
      },
      fail: () => {
        console.error("fail")
      }
    })
    // var greeting = api.OrderDetail;
    // var url = greeting.render({ 'id': that.data.orderId });
    // util.requestMall(url).then(function (res) {
    //   if (res.statusCode == 200) {
    //     console.log(res.data);
    //     that.setData({
    //       orderInfo: res.data,
    //       orderGoods: res.data.orderdetailList
    //     });
    //     //that.payTimer();
    //   }
    // });
  },
  payTimer() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    setInterval(() => {
      console.log(orderInfo);
      orderInfo.add_time -= 1;
      that.setData({
        orderInfo: orderInfo,
      });
    }, 1000);
  },
  aftersaleCheck(orderInfo) {
    var status = orderInfo.status
    var errorMessage = '';
    switch (status) {
      case 0: {
        console.log('订单未支付，不可退货');
        errorMessage = '订单已发货，不能取消';
        break;
      }
      case 4: {
        console.log('已经取消');
        errorMessage = '订单已收货，不能取消';
        break;
      }
      case 5: {
        console.log('已经关闭');
        errorMessage = '订单已关闭，不能取消';
        break;
      }
      case 6: {
        console.log('已经删除');
        errorMessage = '订单已删除，不能取消';
        break;
      }
    }
  
    if (errorMessage != '') {
      console.log(errorMessage);
      util.showErrorToast(errorMessage);
      return false;
    }
    return true;
  },
  aftersaleOrder() {
    console.log('开始取消订单');
    let that = this;
    let orderInfo = that.data.orderInfo;
    if (this.aftersaleCheck(orderInfo)) {
      console.log('可以取消订单的情况');
      wx.showModal({
        title: '',
        content: '确定要取消此订单？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            // var url = api.AfterSaleApply();
            // url = url.render({
            //   'id': orderInfo.id
            // });
            var after = {
              orderId: orderInfo.id,
              type: 2,
              amount: orderInfo.updateAmount,
              cutAmount: 0,
              picture: orderInfo.picture,
              mode: 1,
              list: [],
            }
            for (var i = 0; i < orderInfo.orderdetailList.length; i++) {
              var item = {};
              item['did'] = orderInfo.orderdetailList[i].id;
              item['num'] = orderInfo.orderdetailList[i].number;
              after.list[i] = item;
            }
            http.get({
              url: api.auditBack(that.data.orderId),
              showLoading: true,
              data: {},
              success: (res) => {
                console.log(res)
                if (res.data.code !== 200) {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                  return
                }
                wx.showModal({
                  title: '提示',
                  content: "订单取消成功",
                  showCancel: false,
                  confirmText: '继续',
                  success: function (res) {
                    //  util.redirect('/pages/ucenter/order/order');
                    wx.navigateBack({
                      url: 'pages/ucenter/order/order',
                    });
                  }
                });
              },
              fail: () => {
                console.error("fail")
              }
            })
            // util.requestMall(url, after, "POST").then(function (res) {
            //   console.log(res.errno);
            //   if (res.statusCode == 200) {
            //     console.log(res.data);
            //     wx.showModal({
            //       title: '提示',
            //       content: "订单取消成功",
            //       showCancel: false,
            //       confirmText: '继续',
            //       success: function (res) {
            //         //  util.redirect('/pages/ucenter/order/order');
            //         wx.navigateBack({
            //           url: 'pages/ucenter/order/order',
            //         });
            //       }
            //     });
            //   }
            // });

          }
        }
      });
    }
  },
  cancelCheck:function(orderInfo) {
    var status = orderInfo.status
    var errorMessage = '';
    switch (status) {
      case 0: {
        return true;
      } 
    }
    wx.showToast({
      title: '订单不可关闭',
      icon:'none'
    })
    return false; 
  },
  cancelOrder() {
    console.log('开始关闭订单');
    let that = this;
    let orderInfo = that.data.orderInfo;
    console.log(orderInfo);
    if (that.cancelCheck(orderInfo)) {
      console.log('可以取消订单的情况');
      wx.showModal({
        title: '',
        content: '确定要取消此订单？',
        success: function (res) {
          if (res.confirm) {
            http.post({
              url: api.OrderCancel(),
              showLoading: true,
              data: {
                "orderId": orderInfo.id
              },
              success: (res) => {
                console.log(res)
                if (res.data.code !== 200) {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                  return
                }
                wx.showModal({
                  title: '提示',
                  content: "订单取消成功",
                  showCancel: false,
                  confirmText: '继续',
                  success: function (res) {
                    //  util.redirect('/pages/ucenter/order/order');
                    wx.navigateBack({
                      url: 'pages/shoppingMall/order/order',
                    });
                  }
                });
              },
              fail: () => {
                console.error("fail")
              }
            })
            // util.requestMall(api.OrderCancel, {
            //   "orderId": orderInfo.id
            // }).then(function (res) {
            //   console.log(res.errno);
            //   if (res.statusCode == 200) {
            //     console.log(res.data);
            //     wx.showModal({
            //       title: '提示',
            //       content: "订单取消成功",
            //       showCancel: false,
            //       confirmText: '继续',
            //       success: function (res) {
            //         //  util.redirect('/pages/ucenter/order/order');
            //         wx.navigateBack({
            //           url: 'pages/ucenter/order/order',
            //         });
            //       }
            //     });
            //   }
            // });

          }
        }
      });
    }
  },
  payOrder() {
    let that = this;
    console.info('payorder===>',that.data.orderInfo)
    wx.redirectTo({
      url: '/pages/shoppingMall/pay/pay?orderId=' + that.data.orderId + "&actualPrice=" + that.data.orderInfo.amount
    });
  },
  cancelCheck(orderInfo) {
    var status = orderInfo.status
    var errorMessage = '';
    switch (status) {
      case 0: {
        return true;
      } 
    }
    util.showErrorToast("订单不可关闭");
    return false; 
  },
confirmCheck(orderInfo){
    var status = orderInfo.status
    var errorMessage = '';
    switch (status) {
      // case 300: {
      //   console.log('已发货，不能取消');
      //   errorMessage = '订单已发货';
      //   break;
      // }
      case 4: {
        console.log('已关闭，不能再签收');
        errorMessage = '订单已关闭，不能再签收';
        break;
      }
      case 5: {
        console.log('已经取消');
        errorMessage = '订单已取消，不能再签收';
        break;
      }
      case 6: {
        console.log('已经删除');
        errorMessage = '订单已删除，不能再签收';
        break;
      }
      case 4: {
        console.log('已经退款');
        errorMessage = '订单已退款，不能再签收';
        break;
      }
    }
  
    if (errorMessage != '') {
      console.log(errorMessage);
      util.showErrorToast(errorMessage);
      return false;
    }
    return true;
  },
  confirmOrder() {
    //确认收货
    console.log('开始确认收货');
    let that = this;
    let orderInfo = that.data.orderInfo;
    console.log(orderInfo);
    if (that.confirmCheck(orderInfo)) {
      console.log('可以取消订单的情况');
      wx.showModal({
        title: '',
        content: '确定已经收到商品？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            http.get({
              url: api.OrderConfirm(),
              showLoading: true,
              data: {
                "orderId": orderInfo.id
              },
              success: (res) => {
                console.log(res)
                if (res.data.code !== 200) {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                  return
                }
                wx.showModal({
                  title: '提示',
                  content: "订单签收成功",
                  showCancel: false,
                  confirmText: '继续',
                  success: function (res) {
                    wx.navigateBack({
                      url: 'pages/ucenter/order/order',
                    });
                  }
                });
              },
              fail: () => {
                console.error("fail")
              }
            })
            // util.requestMall(api.OrderConfirm, {
            //   orderId: orderInfo.id
            // }).then(function (res) {
            //   console.log(res.errno);
            //   if (res.statusCode == 200) {
            //     console.log(res.data);
            //     wx.showModal({
            //       title: '提示',
            //       content: "订单签收成功",
            //       showCancel: false,
            //       confirmText: '继续',
            //       success: function (res) {
            //         //  util.redirect('/pages/ucenter/order/order');
            //         wx.navigateBack({
            //           url: 'pages/ucenter/order/order',
            //         });
            //       }
            //     });
            //   }
            // });

          }
        }
      });
    }
  },
})