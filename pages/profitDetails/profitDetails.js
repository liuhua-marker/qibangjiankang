// pages/salesAnalysis/salesAnalysis.js
var loadMoreView, page
const http = require('../../utils/http')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:0,
    items:[],
    dialogFlag:false,
    profit:0,
    a_turnover:0,
    order_num:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 0
    var that = this
    loadMoreView = that.selectComponent("#loadMoreView");
    that.setData({
      organId:options.id,
      name:options.name,
      date:options.date
    })
    console.log(options)
    this.loadData(true)
    this.loadTopData()
  },
  /**
   * 页面下拉刷新事件的处理函数
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.loadData()
    this.loadTopData()
    setTimeout(function()
    {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    },1000);
  },
  loadTopData: function(showLoading) {
    let openid = wx.getStorageSync('openid');
    var that = this
    http.post({
      showLoading: showLoading,
      data:{
          "code": "20057",
          "whereValue": {
            organId:this.data.organId,
            accountTime:that.data.date,
          }
      },
      success: (res)=>{
        console.log(res)
          this.setData(res.data[0])
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
        "code": "20059",
        "whereValue": {
          organId:this.data.organId,
          accountTime:that.data.date,
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
  },
  loadMoreListener: function(e) {
    page += 1
    this.loadData(false)
  },
  clickLoadMore: function(e) {
    this.loadData(false)
  },
  showDialog:function(e){
    this.setData({
      dialogFlag:true
    })
  },
  closeDialog:function(){
    this.setData({
      dialogFlag:false
    })
  }
})