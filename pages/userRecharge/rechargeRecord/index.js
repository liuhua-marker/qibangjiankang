// pages/userRecharge/rechargeRecord/index.js
const api = require('../../../utils/server.api.js')
const http = require('../../../utils/http')
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    listHead: ['充值金额', '付款方式', '充值凭证', '当前状态'],
    dialogShow: false,
    imgUrl: '',
    dataTime: '',
    isHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let organId = {organId: wx.getStorageSync('organId')}
    http.post({
      url: api.rechargeaudit(), //获取充值记录页面信息
      showLoading: true,
      data: organId,
      success: (res) => {
        // console.log(res.data.row)
        res.data.row.forEach((item) => {
          item.createdTime = util.formatTime2(item.createdTime)
        })
        that.setData({
          listData: res.data.row
        })
      },
      fail: () => {
        console.error("fail")
      }
    })
  },
  // bindDateChange: function (e) {
  //   this.setData({
  //     dataTime: e.detail.value
  //   })
  // },
  peopleIsHidden() {
    wx.showToast({
      title: '请联系客服人员',
      duration: 2000,
      mask: true
    })
  },
  handleShow(e) {
    this.setData({
      dialogShow: true,
      imgText: e.currentTarget.dataset.id,
      imgUrl: ''
    })
  },
  seeVoucher(e) {
    let index = e.currentTarget.dataset.index
    if (this.data.listData[index].rechargeVoucher === '') {
      this.setData({
        dialogShow: true,
        imgText: this.data.listData[index].voucherType,
        imgUrl: ''
      })
    } else {
      wx.previewImage({
        current: this.data.listData[index].rechargeVoucher, // 当前显示图片的http链接  
        urls: [this.data.listData[index].rechargeVoucher] // 需要预览的图片http链接列表  
      })
    }
  },
  handleDialog() {
    this.setData({
      dialogShow: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})