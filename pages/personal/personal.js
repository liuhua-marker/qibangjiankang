// pages/personal/personal.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sickCard:"",
    show:"show",
    userName :"",
    userInfo:{}
  },

  //记录查询
  registerLog: function (e) {
    wx.navigateTo({
      url: '/pages/registerLog/registerLog?type=' + e.currentTarget.dataset.type
    })
  },

  addVisitCard: function () {
    app.addVisitCard()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let getName = wx.getStorageSync("userName");
    that.setData({
      userName: getName,
      userInfo: wx.getStorageSync("userInfoData")
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})