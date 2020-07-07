const urlApi = require('../../utils/server.api.js')
const downurl = "https://health.qbjiankang.com/pdf/";
var app = getApp()
Page({
  data:{
    current: 0,
    listgoods:[],  
    'passSize':'none',
  swiper:{
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 1000
      },
    userCode:'',
    userName:'',
    imgArr:[]
  },
  
  onLoad:function(options){
    console.log(options);
    var that = this;
    let batch = options.batch
    
    // 页面初始化 options为页面跳转所带来的参数    156905936531702
    wx.request({//根据批次获取该批次的所有信息
      url: urlApi.getFlowListByBatic(),
      header: {
        "Content-Type": "application/json",
        'Authorization': wx.getStorageSync("token")
      },
      data: {
        batch: batch
      },
      method: 'GET',
      //服务端的回掉
      success: function (result) {
        if (result.data.code == 200) {
          console.log( result.data.data);
          that.setData({
            listgoods:  result.data.data
          })
          console.log(that.data.listgoods);
           //这里是物流单的图片展示
          
        }
        wx.request({
          url: urlApi.getImageByBatch(),
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            batch: batch 
          },
          method: 'POST',
          //服务端的回掉
          success: function (resimg) {
            if (resimg.data.code == 200) {
              console.log( resimg.data.data);
              that.setData({
                imgArr:  resimg.data.data
              })
              console.log(that.data.imgArr);
            }
          }

        })
      }

    })

   
    
  },

  previewImg:function(e){
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgArr;
    console.log('imgarr'+imgArr)
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  switchSlider:function(e){
    this.setData({
      current:e.target.dataset.index
    })
  },
  changeSlider:function(e){
    this.setData({
      current: e.detail.current
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }

})
