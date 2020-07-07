var util = require('../../../utils/util.js');
const http = require('../../../utils/http')
const api = require('../../../utils/server.api.js')

Page({
  data: {
    picPath: api.picPath,
    state: '',
    orderStatus: {
      '0': "待支付",
      "1": "待发货",
      "2": "已发货",
      "3": "已签收",
      "4": "已取消",
      "5": "关闭"
    },
    orderList: [],
    page: 1,
    size: 10,
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    totalPages: 1
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      state: options.state
    });
    // wx.showLoading({
    //   title: '加载中...',
    //   success: function () {

    //   }
    // });
    this.getOrderList();
  },

  switchCate: function (event) {
    // wx.showLoading({
    //   title: '加载中...'
    // });
    var currentTarget = event.currentTarget;
    this.setData({
      state: currentTarget.dataset.id,
      totalPages: 1,
      page: 1,
      orderList: []
    });
    console.log(this.data.orderId)
    this.getOrderList();
  },


  bindscrolltolower: function () {
    this.getOrderList()
  },
  onPullDownRefresh() {
    // 增加下拉刷新数据的功能
    wx.showNavigationBarLoading();
    var self = this;
    self.setData({
      orderList: [],
      page: 1,
      totalPages: 1
    });
    self.getOrderList();
  },

  getOrderList() {
    let that = this;
    if (that.data.totalPages <= that.data.page - 1) {
      that.setData({
        nomore: true
      })
      return;
    }
    that.data.state = that.data.state == -1 ? "" : that.data.state;
    http.post({
      url: api.OrderList(),
      showLoading: true,
      data: {
        page: that.data.page,
        pageSize: that.data.size,
        status: that.data.state
      },
      success: (res) => {
        console.log(res)
        that.setData({
          orderList: that.data.orderList.concat(res.data.rows),
          page: res.data.page + 1,
          totalPages: res.data.total
        });
        wx.hideLoading();

        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.requestMall(api.OrderList, { page: that.data.page, pageSize: that.data.size, order_status: that.data.state},"POST").then(function (res) {
    //   if (res.statusCode == 200) {
    //     that.setData({
    //       orderList: that.data.orderList.concat(res.data.rows),
    //       page: res.data.page + 1,
    //       totalPages: res.data.total
    //     });
    //     wx.hideLoading();
    //   }
    //   wx.hideNavigationBarLoading() //完成停止加载
    //   wx.stopPullDownRefresh() //停止下拉刷新
    // });
  },
  payOrder(event) {
    let that = this;
    let orderIndex = event.currentTarget.dataset.orderIndex;
    let order = that.data.orderList[orderIndex];
    wx.redirectTo({
      url: '/pages/shoppingMall/pay/pay?orderId=' + order.id + '&actualPrice=' + order.amount,
    })
  },
  toOrder(event) {
    let that = this;
    let orderIndex = event.currentTarget.dataset.orderIndex;
    let order = that.data.orderList[orderIndex];
    console.log(order);
    wx.redirectTo({
      url: '/pages/shoppingMall/orderDetail/orderDetail?id=' + order.id,
    })
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
  confirmOrder(event) {
    //确认收货
    console.log('开始确认收货');
    let that = this;
    let orderIndex = event.currentTarget.dataset.orderIndex;
    let order = that.data.orderList[orderIndex];
    console.log('可以取消订单的情况');
    if (orderUtil.confirmCheck(order)) {
      wx.showModal({
        title: '',
        content: '确定已经收到商品？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            http.post({
              url: api.OrderConfirm(),
              showLoading: true,
              data: {
                page: that.data.page,
                pageSize: that.data.size,
                order_status: that.data.state
              },
              success: (res) => {
                console.log(res)
                wx.showModal({
                  title: '提示',
                  content: "签收操作成功",
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
            // util.requestMall(api.OrderConfirm, {
            //   orderId: order.id
            // }).then(function (res) {
            //   console.log(res.errno);
            //   if (res.statusCode == 200) {
            //     console.log(res.data);
            //     wx.showModal({
            //       title: '提示',
            //       content: "签收操作成功",
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
  buyOrder(event) {
    let that = this;
    let orderIndex = event.currentTarget.dataset.orderIndex;
    let order = that.data.orderList[orderIndex];
    console.log("------------------")
    console.log(order.goods_id)
    wx.navigateTo({
      url: '/pages/goods/goods?id=' + order.goods_id,
    });
  },
  commentOrder(event) {
    let that = this;
    let orderIndex = event.currentTarget.dataset.orderIndex;
    let order = that.data.orderList[orderIndex];
    wx.navigateTo({
      url: '/pages/commentPost/commentPost?typeId=0&valueId=' + order.goods_id,
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})