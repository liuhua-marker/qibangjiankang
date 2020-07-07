// pages/salesAnalysis/salesAnalysis.js
var loadMoreView, page
const http = require('../../utils/http')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total:0,
    addWeek:0,
    addMonth:0,
    items:[
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 0
    var that = this
    this.setData({
      currentOrgName: options.currentOrgName,
      currentBid: options.currentBid,
      roleCode: options.roleCode,
    })
    loadMoreView = that.selectComponent("#loadMoreView");
    this.loadData(true)
    this.loadTopData()
  },
  getDateTime:function () {

  },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.loadData()
    this.loadTopData()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
  loadTopData: function(showLoading) {
    let openid = wx.getStorageSync('openid');
    var that = this
    http.post({
      showLoading: showLoading,
      data:{
        "code": "20061",
        "whereValue": {
          organId:wx.getStorageSync('organId'),
          "organId": "1252900609858732032"
        }
      },
      success: (res)=>{
        console.log(res)
        this.setData({
          total:res.data[0].all_shop_num || 0,
          addMonth:res.data[0].month_new_shop_num || 0,
          addWeek:res.data[0].week_new_shop_num || 0,
        })
      },
      fail: ()=> {
        console.error("fail")
      }
    })
  },
  loadData: function(showLoading) {
    let openid = wx.getStorageSync('openid');
    var that = this
    http.post({
      showLoading: showLoading,
      data:{
        "code": "20062",
        "whereValue": {
          organId:wx.getStorageSync('organId'),
          "organId": "1252900609858732032"
        }
      },
      success: (res)=>{
          var items = that.data
          if(page == 0) {
            items = res.data
            wx.stopPullDownRefresh()
          } else {
            items = items.concat(res.data)
          }
          that.setData({
            items: items,
          })
          if(loadMoreView){
            loadMoreView.loadMoreComplete(res)
          }
          
      },
      fail: ()=> {
        console.error("fail")
        if(page!=0) {
          loadMoreView.loadMoreFail() 
        }
      }
    })
  },  loadMoreListener: function(e) {
    page += 1
    this.loadData(false)
  },
  clickLoadMore: function(e) {
    this.loadData(false)
  },

})