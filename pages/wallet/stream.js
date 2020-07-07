var app = getApp();
var util = require('../../utils/util.js');
const http = require('../../utils/http')
const api = require('../../utils/server.api.js')

Page({
  data: {
    picPath: util.picPath,
    typeId: 0,
    page: 1,
    size: 20,
    collectList: []
  },
  getCollectList() {
    let that = this;
    http.post({
      url: api.walletStream(),
      showLoading: true,
      data: { page: that.data.page, pageSize: that.data.size},
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
        collectList: that.data.collectList.concat(res.data.page.rows),
        amount: res.data.amount,
        page: res.data.page.page + 1,
        totalPages: res.data.page.total
      });
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.requestMall(api.WATTELSTREAM, { page: that.data.page, pageSize: that.data.size}, "POST").then(function (res) {
    //   console.log(res.data);
    //   that.setData({
    //     collectList: that.data.collectList.concat(res.data.page.rows),
    //     amount: res.data.amount,
    //     page: res.data.page.page + 1,
    //     totalPages: res.data.page.total
    //   });
    //   wx.hideNavigationBarLoading() //完成停止加载
    //   wx.stopPullDownRefresh() //停止下拉刷新
    // });
  },
  /**
       * 页面上拉触底事件的处理函数
       */
  onReachBottom: function () {
    this.getCollectList()
  },
  onPullDownRefresh() {
    // 增加下拉刷新数据的功能
    wx.showNavigationBarLoading();
    var self = this;
    self.setData({
      collectList: [],
      page: 1,
      totalPages: 1
    });
    self.getCollectList();
  },

  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    this.getCollectList();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  openGoods(event) {

    let that = this;
    let goodsId = this.data.collectList[event.currentTarget.dataset.index].product.id;
    console.log(goodsId);

    //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touch_end - that.data.touch_start;
    console.log(touchTime);
    //如果按下时间大于350为长按  
    if (touchTime > 350) {
      wx.showModal({
        title: '',
        content: '确定取消收藏吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确认');
            util.requestMall(api.CollectAddOrDelete, { productId: goodsId }, 'GET').then(function (res) {
              console.log(res.data);
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 2000
              });
              that.getCollectList();

            });
          }
        }
      })
    } else {

      wx.navigateTo({
        url: '/pages/goods/goods?id=' + goodsId,
      });
    }
  },
  //按下事件开始  
  touchStart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-start')
  },
  //按下事件结束  
  touchEnd: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-end')
  },
})