// pages/speechTraining/speechTraining.js
var util = require('../../utils/util.js');
const http = require('../../utils/http')
const api = require('../../utils/server.api.js')

var app = getApp();

var pageSelf = undefined;

var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showVice: false,
    allData: {},
    speechcraft: {},
    practiseType: {
      1: '每日',
      7: '每周',
      30: '每月',
    },
    index: 0,
    speechcraftDetail: {},
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    let speechcraft = JSON.parse(options.speechcraft)
    console.log(speechcraft)
    this.setData({
      speechcraft: speechcraft,
      // speechPackageId:speechcraft.speechcraftPackagePlanEntities[0].id
    })
    // this.loadData()
    this.getSpeechcraftId()
    manager.onRecognize = function (res) {
      // console.log("current result", res.result)
    }
    
    manager.onError = function (res) {
      wx.hideLoading()
      wx.showToast({
        title: '语音识别异常',
        icon:'none',
        mask:true,
        duration:2000
      })
      // console.log("语音识别异常", res.msg)
    }
    manager.onStop = function (res) {

      wx.hideLoading()
      if(!res.result){
        wx.showToast({
          title: '未接收到语音信息',
          icon:'none'
        })
        return
      }
      //res.result is the asr result, change the follow step to your source
      //NLI.process(res.result, pageSelf);
    
      that.saveSpeechcraftusertrainlog(res.result)
    }
  },
  // 通过话术包ID获取话术包详情
  loadData(packageId) {
    http.get({
      url: api.getspeechcraftpackageInfo(this.data.speechcraft.packageId),
      showLoading: true,
      data: {},
      success: (res) => {
        console.error(res)
        this.setData({
          allData: res.data.data
        })
      },
      fail: (err) => {
        console.error("通过话术包ID获取话术包详情", err)

      }
    })
  },
  // 通过话术id获取话术详情
  getSpeechcraftId(id) {

    let that =this
    let index = that.data.index
    let params = {
      planId:that.data.speechcraft.planId,
      packageId:that.data.speechcraft.packageId,
      userId:wx.getStorageSync('openid'),
      organId:wx.getStorageSync('organId'),
    }
    http.post({
      url: api.getSpeechcraftinit(),
      showLoading: true,
      data: params,
      success: (res) => {
        console.error(res)
        that.setData({
          speechcraftDetail: res.data.data
        })
        console.log('speechcraftDetail',that.data.speechcraftDetail)
      },
      fail: (err) => {
        console.error("通过话术id获取话术详情fail", err)

      }
    })
  },
  // 保存话术训练
  saveSpeechcraftusertrainlog: function (recordContent) {
      let that =this
      let index = that.data.index;
      let data = {
        organId:wx.getStorageSync('organId'),
        userId:wx.getStorageSync('openid') ,
        planId:that.data.speechcraft.planId,
        practiseType:that.data.speechcraftDetail[index].trainType,
        practisedCount:that.data.speechcraftDetail[index].trainAllCount,
        recordContent:recordContent,
        speechContent:that.data.speechcraftDetail[index].speechRemarks,
        speechId:that.data.speechcraftDetail[index].speechId,
        planCount:that.data.speechcraftDetail[index].planCount,
        speechPackageId:that.data.speechcraft.packageId,
        speechcraftInitEntity:that.data.speechcraftDetail[index]
        // startTime:this.data.speechcraftDetail[index].startTime,
        // endTime:this.data.speechcraftDetail[index].endTime,
      }
      console.log('保存话术训练参数:',data)
      http.post({
        url: api.saveSpeechcraftusertrainlog(),
        showLoading: true,
        data: data,
        success: (res) => {
          console.log(res)
         if(res.data.code === 200){
           wx.showToast({
             title: '训练成功',
             icon:'none',
             mask:true,
             duration:2000
           })

           that.getSpeechcraftId()
           
         }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            mask:true,
            duration:2000
          })
         }
        },
        fail: (err) => {
          console.error("保存话术训练接口失败返回", err)
  
        }
      })
    
  },

  touchStart: function () {
    this.setData({
      showVice: true
    })
    var _this = this
    util.stopTTS();
    manager.start({
      duration: 60000,
      lang: "zh_CN"
    })
  },
  touchEnd: function () {
    let that = this
    this.setData({
      showVice: false
    })
    wx.showToast({
      title:'识别中...',
      mask:true,
      icon:'loading',
      duration:4000
    })
    manager.stop(() => {
      wx.hideLoading()
      console.log(111)
    });

   
  },
  changeData: function (e) {
    console.log(e)
    let type = e.currentTarget.dataset.type;
    type === 'up' ? this.getUpData() : this.getDownData()
  },
  //上一条数据
  getUpData: function () {
    let index = this.data.index;
    if (index === 0) {
      wx.showToast({
        title: '当前为第一条',
        icon: "none"
      })
      return
    }
    index--
    this.setData({
      index: index
    })
  },
  getDownData: function () {
    let index = this.data.index;
    if (index === this.data.speechcraftDetail.length - 1) {
      wx.showToast({
        title: '当前为最后一条',
        icon: "none"
      })
      return
    }
    index++
    this.setData({
      index: index
    })
  },
})