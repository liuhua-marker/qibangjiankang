// pages/logisticsInformation/logisticsInformation.js
var app = getApp();
var util = require('../../utils/util.js');
const http = require('../../utils/http')
const api = require('../../utils/server.api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList: [],
    postId:"",
    deliveryType:'',
    deliveryName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let newsList = [{"time":"2020-05-11 17:52:35","ftime":"2020-05-11 17:52:35","context":"湖南长沙新望城公司 快件已被 长沙银星小区A7栋商铺店(快件已暂存至长沙银星小区A7栋商铺店菜鸟驿站如有疑问请联系18890368386) 代签收。","location":""},{"time":"2020-05-11 15:51:09","ftime":"2020-05-11 15:51:09","context":"湖南长沙新望城公司 进行派件扫描；派送业务员：李栋；联系电话：17608485334","location":""},{"time":"2020-05-11 13:09:00","ftime":"2020-05-11 13:09:00","context":"湖南长沙新望城公司 到达目的地网点，快件很快进行派送","location":""},{"time":"2020-05-11 09:10:36","ftime":"2020-05-11 09:10:36","context":"湖南长沙分拨中心 从站点发出，本次转运目的地：湖南长沙新望城公司","location":""},{"time":"2020-05-11 09:01:21","ftime":"2020-05-11 09:01:21","context":"湖南长沙分拨中心 在分拨中心进行卸车扫描","location":""},{"time":"2020-05-10 17:19:25","ftime":"2020-05-10 17:19:25","context":"浙江义乌分拨中心 进行装车扫描，发往：湖南长沙分拨中心","location":""},{"time":"2020-05-10 17:18:23","ftime":"2020-05-10 17:18:23","context":"浙江义乌分拨中心 在分拨中心进行称重扫描","location":""},{"time":"2020-05-10 14:24:02","ftime":"2020-05-10 14:24:02","context":"浙江义乌凌云公司 进行下级地点扫描，发往：湖南长沙地区包","location":""},{"time":"2020-05-10 14:22:36","ftime":"2020-05-10 14:22:36","context":"浙江义乌洪华公司 进行揽件扫描","location":""}]
    this.setData({
      newsList: newsList,
      postId:options.postId ,
      deliveryType:options.deliveryType || 'ems'
    })
    this.getType()
  },
  getType:function(){
    http.get({
      url: api.getDictByTypeCode('dict_express_code'),
      showLoading: true,
      data: {},
      success: (res) => {
        console.log('getType',res)
        let name = ''
        res.data.data.some(item=>{
          console.log(this.data.deliveryType)
          if(item.code === this.data.deliveryType){
            name = item.name
          }
        })
        this.setData({
          deliveryName:name
        })
      },
      fail: () => {
        console.error("fail")
      }
    })
  },
  copy:function(){
    console.log(111)
    wx.setClipboardData({
      data: this.data.postId,
      success: function (res) {
    
      },
      fail:function (err) {
        console.error(err)
      }
      })
  }
})