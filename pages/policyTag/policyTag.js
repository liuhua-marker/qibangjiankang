// pages/mine/mine.js
const urlApi = require('../../utils/server.api.js')
const { $Message } = require('../../iview/base/index');
const util = require("../../utils/util.js")
const app = getApp();
const http = require('../../utils/http')
Page({
  data: {
    showModal: false, //销售二维码弹框
    userRolelist: [],
    userName:"",
    phone:'',
    ctNormal:[],
    listNormal:[],
    'cant': 'none',
    'cantbt': 'none',
    'canone': '',
    'cantone': 'hover',
    'cantthree': '',
    'hidden': 'block',
    'threevi': 'none',
    adviseList:[],//小程序返回的建议
    noticeList:[],//小程序返回的注意事项
    marketList:[],//小程序返回的销售推荐。
    preceptList:[],//小程序返回的方案信息
    servicehsList:[],//服务话术描述
    currentCase:{},//点击当前案例
    ctNormalName:"",//当前选中的标准结果名称
    state:"",
    showModalCase:false,
    showModalGoods:false,
    goodsList:[],
    // healthResult: { evalLableName: '未检测'},
    // diseaseData: {}
  },
  onLoad: function(options) {
    // console.log("options",options);
    var that = this;
    this.getOpenerEventChannel().on?this.getOpenerEventChannel().on('acceptDataFromOpenerPage', function (data) {
      console.error("data", data)
      if(data.data.qbEvalResultVolist.length>0){
        that.setData({
          healthResult: {
            evalLableName: data.data.qbEvalResultVolist[0].evalLableItemName }
        })
      }
    }):''
    that.setData({
      ctNormal: JSON.parse(decodeURIComponent(options.ctTag)),
      listNormal: JSON.parse(decodeURIComponent(options.listpolicyTag)),
      userName: decodeURIComponent(options.userName),
      phone: decodeURIComponent(options.phone),
    })
    that.setData({
      ctNormalName:that.data.ctNormal.name,
    })
    console.log(that.data.listNormal);
    that.getByPersionId(that.data.ctNormal.tagItemId);
    that.cantbt();
    // that.data.diseaseData = {
    //   createdBy: wx.getStorageSync("openid"),
    //   diseaseId: that.data.ctNormal.tagItemId
    //   // diseaseId: '1217276543865192453'
    // }
    // that.getQbEvalNaireVoByDiseaseId(that.data.diseaseData)
 
  },
  // 人工检测
  // getQbEvalNaireVoByDiseaseId(datas) {
  //   http.post({
  //     url: api.getQbEvalNaireVoByDiseaseId(),
  //     showLoading: true,
  //     data: datas,
  //     success: (val) => {
  //      console.log(val)
  //      this.setData({
  //        healthResult: val.data[0].qbEvalResultVoList[0]
  //      })
  //     },
  //     fail: () => {
  //       console.error("fail")
  //     }
  //   })
  // },
  //个人中心的消息,点击跳转到我的消息
  info() {
    wx.navigateTo({
      url: '../info/info',
    })
  },
  // 开始人工检测
  // begainTest() {
  //   let id = 49
  //   wx.navigateTo({
  //     url: "/pages/HealthAssessment/evaluationForm/evaluationForm",
  //     success: function (res) {
  //       // 通过eventChannel向被打开页面传送数据
  //       res.eventChannel.emit('acceptDataFromOpenerPage', { data: id })
  //     }
  //   })
  // },
  //个人中心的实名认证,点击跳转到实名认证
  realName() {
    wx.navigateTo({
      url: '../realName/realName',
    })
  },
  cant: function(e) {
    console.log(e)
    this.setData({
      cant: 'flex',
      cantbt: 'none',
      cantone: 'hover',
      cantthree: '',
      'hidden': 'block',
      'threevi': 'none',
    })
  },
  cantbt: function(e) {
    let that = this;
    console.log(e)
    this.setData({
      cant: 'none',
      cantbt: 'flex',
      cantone: '',
      cantthree: 'hover',
      'hidden': 'none',
      'threevi': 'block',
    })
  },
getNormal(e){
  let that = this;
  console.log(e)
  let index = e.currentTarget.dataset.index;//获取当前的下标
  let id = e.currentTarget.dataset.id;//获取当前的下标
  let name = e.currentTarget.dataset.name;//获取当前的下标
  that.setData({
    ctNormalName:name,
    state: e.currentTarget.dataset.key
  })
  this.data.diseaseData.diseaseId = id
  that.getQbEvalNaireVoByDiseaseId(this.data.diseaseData)
  that.getByPersionId(id)
},
getByPersionId:function(id){
      let that = this;
      //根据标准结果Id，获取健康建议、注意事项、销售推荐
      console.log("id",id);
      wx.request({
        url: urlApi.getPolicyTagDetail() + id,
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        success: function (resdata) {
          let rdata = resdata.data.data;
          let preceptList = rdata.precept;
          preceptList[0].pullDown = false;//默认第一个打开
          console.log(rdata);
           that.setData({
            preceptList:preceptList,//小程序返回的方案信息
           })
        },
        fail: function () {
          wx.showToast({
            title: "请求失败",
            icon: "none",
            duration: 2000
          })
        }
      })
},

getByPagTag:function(id){
  let that = this;
  //根据标准结果Id，获取健康建议、注意事项、销售推荐
  console.log("id",id);
  wx.request({
    url: urlApi.getNormDetail() + id,
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (resdata) {
      let rdata = resdata.data.data;
      console.log(rdata);

       that.setData({
        adviseList:rdata.advise,//小程序返回的建议
        noticeList:rdata.notice,//小程序返回的注意事项
        marketList:rdata.market,//小程序返回的销售推荐。
        preceptList:rdata.precept,//小程序返回的方案信息
       })
       console.log("adviseList",that.data.adviseList);
    },
    fail: function () {
      wx.showToast({
        title: "请求失败",
        icon: "none",
        duration: 2000
      })
    }
  })
},
  //方案点击事件的点击事件
  storageIntroduce(e){
    let that = this;
    console.log(e)
    let index = e.currentTarget.dataset.index;//获取当前的下标
    let preceptList = that.data.preceptList;//获取方案结果list的值
    if(preceptList[index].pullDown != true){
      preceptList[index].pullDown = true;
    }else{
      for(let i=0;i<preceptList.length;i++){
        preceptList[i].pullDown = true;
      }
      preceptList[index].pullDown = false;
    }
    that.setData({
      preceptList:preceptList
    })
  },
  servicehs(e){
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;//获取当前的下标
    let serviceId = e.currentTarget.dataset.id;//获取服务Id
    wx.request({
      url: urlApi.getServiceSpeechData(),
      method: "get",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync("token")
      },
      data: {
        serviceId:serviceId
      },
      success: function (reponse) {
        console.log(reponse);
        that.setData({
          servicehsList:reponse.data.data,
          showModal:true
        })
      }
    })

  },
  hsok:function(){
    let that = this;
    that.setData({
      showModal:false
    })
  },
  storageCase:function(e){
    let that = this;
    let caseId = e.currentTarget.dataset.id;//获取本次点击的Id
    wx.request({
      url: urlApi.getCaseById() + caseId,
      header: {
        "Content-Type": "application/json",
        'Authorization': wx.getStorageSync("token")
      },
      method: 'GET',
      //服务端的回掉
      success: function (result) {
        console.log(result);
        that.setData({
          currentCase:result.data.data,
          showModalCase:true
        })
      }
    })
  },
  caseok:function(){
    let that = this;
    that.setData({
      showModalCase:false
    })
  },
  ok:function(){
    let that = this;
    that.setData({
      showModal:false
    })
  },
  cant: function(e) {
    console.log(e)
    this.setData({
      cant: 'flex',
      cantbt: 'none',
      cantone: 'hover',
      cantthree: '',
      'hidden': 'block',
      'threevi': 'none',
    })
  },
  cantbt: function(e) {
    let that = this;
    console.log(e)
    this.setData({
      cant: 'none',
      cantbt: 'flex',
      cantone: '',
      cantthree: 'hover',
      'hidden': 'none',
      'threevi': 'block',
    })
  },
  checkboxChange:function(e){
    console.log(e.detail.value)
  },
  previewImg:function(e){
    console.log(e);
    var index = e.currentTarget.dataset.index;
    let downList = e.currentTarget.dataset.downlist;
    let imgArr = [];
    for(let i=0;i<downList.length;i++){
      imgArr.push(downList[i].downUrl)
    }
    console.log(downList);
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  getGoodsDetail(e){
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;//获取当前的下标
    let goodsId = e.currentTarget.dataset.id;//获取服务Id
    wx.request({
      url: urlApi.getGoodsById(),
      method: "get",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync("token")
      },
      data: {
        id:goodsId
      },
      success: function (reponse) {
        console.log(reponse);
        that.setData({
          goodsList:reponse.data.data,
          showModalGoods:true
        })
      }
    })
  },
  goodok:function(){
    let that = this;
    that.setData({
      showModalGoods:false
    })
  },
})