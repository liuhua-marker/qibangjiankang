// 团队管理
var loadMoreView, page
const http = require('../../utils/http')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    items:[],
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
  
  },
  bindInput:function (e) {
    this.setData({
      name:e.detail.value
    })
    this.loadData()
  },
  search:function () {
    console.log(this.data.name)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  bindscrolltolower: function () {
    console.log(111)
    loadMoreView.loadMore()
  },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.loadData()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
  loadData: function(showLoading) {
    let openid = wx.getStorageSync('openid');
    var that = this
    http.post({
      showLoading: showLoading,
      data:{
        "code": "20026",
        "whereValue": {
          organId:that.data.currentBid,
          orgName:that.data.name,
        }
      },
      success: (res)=>{
        console.log(res.data)
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

})