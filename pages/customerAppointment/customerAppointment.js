// pages/customerAppointment/customerAppointment.js
var util = require('../../utils/util.js');
const http = require('../../utils/http')
const api = require('../../utils/server.api.js')

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    monthArr:[
      {name:'一月',value:1},
      {name:'二月',value:2},
      {name:'三月',value:3},
      {name:'四月',value:4},
      {name:'五月',value:5},
      {name:'六月',value:6},
      {name:'七月',value:7},
      {name:'八月',value:8},
      {name:'九月',value:9},
      {name:'十月',value:10},
      {name:'十一月',value:11},
      {name:'十二月',value:12},
    ],
    index:new Date().getMonth(),
    week:['日','一','二','三','四','五','六'],
    allMonthData:[],
    isActive:new Date().getDate(),
    hidden:'',
    btnActive:'0',
    allData:{},
    isShopMan:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('userName', app.globalData.isShopMan)
    this.setData({
      isShopMan:app.globalData.isShopMan,
      btnActive:app.globalData.isShopMan?'0':'1'
    })
    this.getDayData(true)
    this.getMonthByMonth(true)
  },
  changeList:function(e){
    this.setData({
      btnActive:e.currentTarget.dataset.index
    })
  },
  changeDay:function(e){
    if(e.currentTarget.dataset.day===undefined){
      return
    }
    this.setData({
      isActive:e.currentTarget.dataset.day
    })
    this.getDayData(true)
  },
  // 展开收起日历
  toggleDate(){
    this.setData({
      hidden:this.data.hidden?'':'hidden'
    })
  },
  getMonthByMonth: function (showLoading) {
    var that = this
    http.post({
      url: api.getMonthByMonth(),
      showLoading: showLoading,
      data: {
        "month": parseInt(this.data.index) +1,
        "year": new Date().getFullYear(),
        storeId:wx.getStorageSync('organId'),
      },
      success: (res) => {
        console.error(res)
        if(res.data.code === 500){
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            mask:true,
            duration:2500
          })
          return
        }
        that.setData({
          allMonthData: res.data.data.weekVos,
        })

      },
      fail: () => {
        console.error("fail")
      }
    })
  },
  getDayData: function (showLoading) {
    var that = this
    let params = {
      "day":this.data.isActive,
      "month": parseInt(this.data.index) +1,
      "year": new Date().getFullYear(),
      openId:wx.getStorageSync('openid'),
      storeId:wx.getStorageSync('organId'),
      name:wx.getStorageSync('userName'),
      position:app.globalData.isShopMan?1:0
    }
    http.post({
      url: api.getDayData(),
      showLoading: showLoading,
      data: params,
      success: (res) => {
        console.error(res)
        if(res.data.code === 500){
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            mask:true,
            duration:2500
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
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // let isActive=''
    // if(new Date().getMonth() ==e.detail.value){
    //   isActive=new Date().getDate()
    // }
    this.setData({
      index: e.detail.value,
      // isActive:isActive
    })
    this.getMonthByMonth(true)
    this.getDayData()
  },
})