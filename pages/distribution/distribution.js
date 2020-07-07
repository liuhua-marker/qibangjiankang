// pages/distribution/distribution.js
var util = require('../../utils/util.js');
const http = require('../../utils/http')
const api = require('../../utils/server.api.js')

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    speechArr: [],
    index:null, // 话术索引
    personalArr: [], //所有执行者
    showPersonal:false, //执行者弹框
    personal:[],  //执行者
    personalId:[],
    startDate:util.formatTime2(new Date()),
    start_s:util.formatTime2(new Date()),
    endDate:'',
    perSonalChecked:[],
    speechcraftPackagePlanEntities:[],
    speechcraftPackageUserEntities:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('organId'))
    this.getSpeechcraftUser()
    this.querySpeechcraftByOrganId()
    this.getSystemType()
  },
  // 获取店员    执行者
  getSpeechcraftUser:function(){
    var that = this
    http.get({
      url: api.getSpeechcraftUser(),
      showLoading: false,
      data: {
           organId:wx.getStorageSync('organId'),
        // organId:'1255106912773472256'
      },
      success: (res)=>{
        console.error(res)
        this.setData({
          personalArr:res.data.data
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
    getSystemType(){
      var that = this;
    wx.getSystemInfo({
      success:function(res){
          that.setData({
          systemType:res.platform,
        })
        if(res.platform == "devtools"){
                     
        }else if(res.platform == "ios"){
            IOS
        }else if(res.platform == "android"){
            android
        }
      }
    })
    },
  // 获取所有话术包
  querySpeechcraftByOrganId:function(){
    var that = this
    http.get({
      url: api.querySpeechcraftByOrganId(),
      showLoading: false,
      data: {
        organId:wx.getStorageSync('organId'),
        // organId:'1255106912773472256'
      },
      success: (res)=>{
        console.log('获取所有话术包',res)
        this.setData({
          speechArr:res.data.data
        })
      },
      fail: (err)=> {
        console.error("fail",err)
        if(page!=0) {
          loadMoreView.loadMoreFail() 
        }
      }
    })
  },
  bindPickerChange: function(e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let setData = {}
    setData[type] = e.detail.value
    console.log(setData)
    this.setData(setData)

  },
  handlePersonal:function(){
    let perSonalChecked = []
    this.data.personalArr.forEach((item,i)=>{
      this.data.personalId.some((perItem,index)=>{
        if(item.id ===perItem ){
          perSonalChecked[i] = true
        }
      })
    })
    this.setData({
      showPersonal:true,
      perSonalChecked:perSonalChecked
    })
  },
  cancelPersonal:function(){
    this.setData({
      showPersonal:false,
      // personalId:[]
    })
  },
  personal:function(){},
  surePersonal:function(){
    
    
  },
  checkboxChange:function(e){
    console.log(e)
    this.setData({
      personalId:e.detail.value
    })
    let personal = []
    let speechcraftPackageUserEntities=[]
    this.data.personalArr.forEach(item=>{
      this.data.personalId.some((perItem,index)=>{
        if(item.id ===perItem ){
          personal.push(item.name)
          speechcraftPackageUserEntities.push(item)
        }
      })
    })
    // console.log(personal)
    this.setData({
      // showPersonal:false,
      personal:personal,
      speechcraftPackageUserEntities:speechcraftPackageUserEntities
    })
  },
  cancel:function(){
    wx.navigateBack()
  },
  submit:function(){
    var that = this
    if(that.data.index===null){
      wx.showToast({
        title: '请选择话术包',
        icon:'none'
      })
      return
    }
    if(that.data.speechcraftPackageUserEntities.length===0){
      wx.showToast({
        title: '请选择执行者',
        icon:'none'
      })
      return
    }
    if(!that.data.startDate){
      wx.showToast({
        title: '请选择开始时间',
        icon:'none'
      })
      return
    }
    if(!that.data.endDate){
      wx.showToast({
        title: '请选择结束时间',
        icon:'none'
      })
      return
    }
    let data = {}
    data.speechcraftPackageUserEntities = that.data.speechcraftPackageUserEntities.map(item=>{
      return {
        organId:item.bid,
        userId:item.username,
        username:item.name
      }
    })
    data.speechcraftPackagePlanEntities = [that.data.speechArr[that.data.index]]
    data.speechcraftPackagePlanEntities[0].packageId = data.speechcraftPackagePlanEntities[0].id
    data.organId =wx.getStorageSync('organId')
    data.startTime = new Date(that.data.startDate + ' 00:00:00')
    data.endTime = new Date(that.data.endDate + ' 23:59:59')
    
    if(this.data.systemType ==='ios'){
      data.startTime = new Date(that.data.startDate.replace(/\-/g, "/") + ' 00:00:00')
      data.endTime = new Date(that.data.endDate.replace(/\-/g, "/") + ' 23:59:59')
    }
    console.log('params',data)
    http.post({
      url: api.saveSpeechcraftuser(),
      showLoading: true,
      data: data,
      success: (res)=>{
        console.log('获取所有话术包',res)
        if(res.data.code === 200){
          wx.showToast({
            title: '分配成功',
            mask:true,
            duration:2500
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 500);
        }else{
          wx.showToast({
            title: res.data.msg,
            mask:true,
            duration:2500,
            icon:'none'
          })
        }
      },
      fail: (err)=> {
        console.error("fail",err)
      
      }
    })
  
  }
})