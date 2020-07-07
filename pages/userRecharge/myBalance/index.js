// pages/userRecharge/myBalance/index.js
const api = require('../../../utils/server.api.js')
const http = require('../../../utils/http')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: '0.00',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = {
      organId: wx.getStorageSync("organId")
    }
    // 获取初始数据
    http.post({
      url: api.walletaccountInfo(),  //页面账号信息
      showLoading: true,
      data: data,
      success: (res) => {
        this.setData({
          balance: res.data.data.amount
        })
      },
      fail: () => {
        console.error("fail")
      }
    })
  },
  viewingProgress: function (options) {
    wx.navigateTo({
      url: "/pages/userRecharge/recharge/index"
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