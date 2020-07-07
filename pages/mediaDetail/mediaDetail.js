// pages/mediaDetail/mediaDetail.js
const urlApi = require('../../utils/server.api.js')
const util = require("../../utils/util.js")
const app = getApp();
const http = require('../../utils/http')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'https://health.qbjiankang.com/curevideo/肩周炎报告解读.mp4',
    topImg:'http://file-best.qbjiankang.com/bang/null/image/2020/06/03/bcfddc25-a49f-4e65-b182-3f46d437bdc3.png',
    img_flag:true,
    type:'video',
    id:'',
    loadData:{},
    index:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id:options.id
    })
    this.getMaterialDetail()
  },
  getMaterialDetail(){
    http.get({
      url: urlApi.getMaterialDetail()+this.data.id,
      showLoading: true,
      data: {},
      success: (val) => {
        console.log('getMaterialDetail', val.data)
        this.setData({
          loadData:val.data.data
        })
        wx.setNavigationBarTitle({
          title: val.data.data.name,
        })
      },
      fail: () => {
        console.error("fail")
      }
    })
  },
  imgError(){
    let img = 'loadData.imageList[' + this.data.index + '].frontImage'
    this.setData({
      [img]: '/images/error.jpg'
    })    
  },
  play(){
    let video = wx.createVideoContext('video')
    console.log(video)
    this.setData({
      img_flag:false
    })
    video.play()
  
  },
  changeImg(e){
    console.log(e.currentTarget.dataset.index)
    let type = e.currentTarget.dataset.type
    let src = e.currentTarget.dataset.downurl
    if(type === 'image'){
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: [src] // 需要预览的图片http链接列表
      })
    }
    let video = wx.createVideoContext('video')
    video.pause()
    this.setData({
      index:e.currentTarget.dataset.index,
      img_flag:true
    })
  }
})