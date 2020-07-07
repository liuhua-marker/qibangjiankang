// pages/HealthAssessment/evaluationReport/index.js
const api = require('../../../utils/server.api.js')
const http = require('../../../utils/http')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    healthResult: {},
    storeId:'',
    nickName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nickName = ''
    if (wx.getStorageSync('organId')) {
      this.setData({
        storeId: wx.getStorageSync('organId')
      })
    } else {
      nickName = wx.getStorageSync('userName')
    }
    // const nickName = wx.getStorageSync('userName')
    this.getHealthResult(nickName)
  },
  getHealthResult(nickName) {
    let that = this
    http.post({
      url: api.getqbEvalReportByCreateBy(),
      showLoading: true,
      data: {
        nickName: that.data.nickName,
        evalType: 1,
        storeId: that.data.storeId,
      },
      success: (res) => {
        this.setData({
          healthResult:res.data
        })
        console.log(res.data.data);
        
      },
      fail: () => {
        console.error("fail")
      }
    })
  },
  changeInput:function(e){
    this.setData({
      nickName:e.detail.value
    })
  },
  search: function (e) {
    const nickName = e.detail.value
    this.getHealthResult(nickName)
  },
  healthResult(e) {
    let datas = this.data.healthResult[e.currentTarget.dataset.index]
    wx.setStorageSync('healthResult', datas)
    wx.navigateTo({
      url: '/pages/HealthAssessment/healthResult/index'
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