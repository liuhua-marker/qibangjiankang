var app = getApp();
var util = require('../../utils/util.js');
const http = require('../../utils/http')
const api = require('../../utils/server.api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[{test:111}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  showDialog:function(){
    console.log(111)
    wx.navigateTo({
      url: '/pages/logisticsInformation/logisticsInformation',
    })
  }
})