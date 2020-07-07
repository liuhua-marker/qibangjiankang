// pages/distribution/distribution.js
var util = require('../../utils/util.js');
const http = require('../../utils/http')
const api = require('../../utils/server.api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: '',
    start_s: util.formatTime2(new Date()),
    allData: {},
    timeQuantumId: '',
    customerName: '',
    phoneNumber: '',
    projectIndex: '', //服务项目
    assistantIndex: '', //可选人员
    assistantVos:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('isShopMan',app.globalData.isShopMan)
    console.log('isShopMan',wx.getStorageSync('userInfo'))
    this.setData({
      isShopMan:app.globalData.isShopMan
    })
    this.getAppointmentMsgVo()
    if(app.globalData.isShopMan){
      this.getSpeechcraftUser()
    }else{
      this.setData({
        assistantVos:[{name:wx.getStorageSync('userName'),username:wx.getStorageSync('openid')}]
      })
    }
    
  },
  getAppointmentMsgVo: function (showLoading) {
    var that = this
    http.post({
      url: api.getAppointmentMsgVo(),
      showLoading: showLoading,
      data: {
        // openId:wx.getStorageSync('openid')
        openId: wx.getStorageSync('openid'),
        storeId:wx.getStorageSync('organId'),
      },
      success: (res) => {
        console.error(res)
        if (res.data.code === 500) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true,
            duration: 2500
          })
          return
        }
        that.setData({
          allData: res.data.data,
        })

      },
      fail: () => {
        console.error("fail")
      }
    })
  },
    // 获取店员    执行者
    getSpeechcraftUser:function(){
      var that = this
      http.get({
        url: api.getSpeechcraftUser(),
        showLoading: false,
        data: {
             organId:wx.getStorageSync('organId'),
          openId:wx.getStorageSync('openid'),
        },
        success: (res)=>{
          console.error(res)
          this.setData({
            assistantVos:res.data.data
          })
        },
        fail: (err)=> {
          console.error("获取店员 执行者fail",err)
          if(page!=0) {
            loadMoreView.loadMoreFail() 
          }
        }
      })
    },
  bindPickerChange: function (e) {
    let type = e.currentTarget.dataset.type
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let setData = {}
    setData[type] = e.detail.value
        this.setData(setData)
  },
  changeTime: function (e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      timeQuantumId: id
    })
  },
  bindSubmit: function () {
    var that = this
    let text = ''
    if(!that.data.customerName){
      text = text || '请输入顾客姓名'
    }
    if(!that.data.phoneNumber){
      text = text ||'请输入手机号码'
    }
    if(!that.data.projectService){
      text = text ||'请输入服务项目'
    }
    if(!that.data.assistantVos[that.data.assistantIndex]){
      text = text ||'请选择服务人员'
    }
    if(!that.data.startDate){
      text = text ||'请选择预约时间'
    }
    if(!that.data.timeQuantumId){
      text = text ||'请选择预约时间段'
    }
    if(text){
      wx.showToast({
        title: text,
        icon:'none',
        duration:2500
      })
      return
    }
    var params = {
      openId:wx.getStorageSync('openid'),
      storeId:wx.getStorageSync('organId'),
      customerName:that.data.customerName,
      phoneNumber:that.data.phoneNumber,
      projectService:that.data.projectService,
      clerkName:that.data.assistantVos[that.data.assistantIndex].name,
      // clerkId:that.data.assistantVos[that.data.assistantIndex].bid,
      clerkOpenId:that.data.assistantVos[that.data.assistantIndex].username,
      time:that.data.startDate,
      timeQuantumId:that.data.timeQuantumId
    }
    console.log('params',params)
  
    http.post({
      url: api.appointmentCommit(),
      showLoading: true,
      data: params,
      success: (res) => {
        console.error(res)
        if (res.data.code === 500) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true,
            duration: 2500
          })
          return
        }
        if(res.data.data===1){
          setTimeout(()=>{
            wx.showToast({
              title: "预约成功",
              icon: 'none',
              mask: true,

              duration: 2500,
              success: function(){
                setTimeout(()=>{
                  wx.navigateBack()
                },2500)
              }
            })
          },10)
        
        
      
        }else{
          setTimeout(()=>{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              mask: true,
              duration: 2500})
          },10)
        }
      
      },
      fail: () => {
        console.error("fail")
      }
    })
  }

})