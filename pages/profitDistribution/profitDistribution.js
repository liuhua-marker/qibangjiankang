// pages/salesAnalysis/salesAnalysis.js
var loadMoreView, page
const http = require('../../utils/http')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:new Date(),
    years:new Date().getFullYear(),
    months:(new Date().getMonth()+1)<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1)
    ,
    dialogFlag:false,
    items:[],
    recoverItems:[],
    dialogItems:[
      {type:'套盒产品',money:'23431',number:'20'},
    ],
    active:'0',
    total:0,
    totalMoney:0,
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
    this.loadData(true,'20058','items')
    this.loadData(true,'20060','recoverItems')
    this.loadTopData()
  },
  
  hanldClick(e){
    console.log(e.currentTarget.dataset.index)
    var type = e.currentTarget.dataset.type
    var data={}
    data['active'] = e.currentTarget.dataset.index
    this.setData(data)
  },
  getDateTime:function (e) {
    var splitArr = e.detail.value.split('-')
    this.setData({
      years:splitArr[0],
      months:splitArr[1]
    })
    page = 0
    this.loadTopData()
    this.loadData(true,'20058','items')
    this.loadData(true,'20060','recoverItems')
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.loadData(true,'20014','items')
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
        "code": "20057",
        "whereValue": {
          organId:wx.getStorageSync('organId'),
          accountTime:that.data.years+'-'+that.data.months,
        }
      },
      success: (res)=>{
        console.log(res)
        this.setData({
          total:res.data[0].order_num || 0,
          totalMoney:res.data[0].sep_value || 0,
        })
      },
      fail: ()=> {
        console.error("fail")
      }
    })
  },
  loadData: function(showLoading,code,type) {
    let openid = wx.getStorageSync('openid');
    var that = this
    http.post({
      showLoading: showLoading,
      data:{
        "code": code,
        "whereValue": {
          organId:wx.getStorageSync('organId'),
          accountTime:that.data.years+'-'+that.data.months,
          settleAccount:that.data.years+'-'+that.data.months,
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
          var obj = {}
          obj[type] = items
          that.setData(obj)
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
  showDialog:function(){
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