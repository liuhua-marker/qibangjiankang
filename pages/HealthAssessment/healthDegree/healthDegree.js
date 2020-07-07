// pages/HealthAssessment/healthDegree/healthDegree.js
const api = require('../../../utils/server.api.js')
const http = require('../../../utils/http')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:["http://file-best.qbjiankang.com/mall/1592360176338.png?OSSAccessKeyId=LTAI4G62NTFZPavPhV5uG55e&Signature=c3J3PpaNsBvMRDACgye6gQ%2BSmUo%3D&Expires=1907720172",'http://file-best.qbjiankang.com/mall/1592360182403.png?OSSAccessKeyId=LTAI4G62NTFZPavPhV5uG55e&Signature=luoBBPN%2FMozEvRoZK0mfYLyD3zs%3D&Expires=1907720172'] ,
    healthFrom: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    http.post({
      url: api.qbEvalList(),
      showLoading: true,
      data: {
        status: 1,
        evalType: 1
      },
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            healthFrom: res.data.data
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:"none"
          })
        }
      },
      fail: () => {
        console.error("fail")
      }
    })
  },
  questionnaire: function (res) {
    let id = res.currentTarget.dataset.id
    wx.redirectTo({
      url: "/pages/HealthAssessment/evaluationForm/evaluationForm?id="+ id,
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        // res.eventChannel.emit('acceptDataFromOpenerPage', { data: id })
      }
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