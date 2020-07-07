// pages/mine/mine.js
const urlApi = require('../../utils/server.api.js')
const {
  $Message
} = require('../../iview/base/index');
const util = require("../../utils/util.js")
const app = getApp();
const http = require('../../utils/http')
Page({
  data: {
    showModal: false, //销售二维码弹框
    userRolelist: [],

    userName: "",
    phone: '',
    ctNormal: [],
    listNormal: [],
    'cant': 'none',
    'cantbt': 'none',
    'canone': '',
    'cantone': 'hover',
    'cantthree': '',
    'hidden': 'block',
    'threevi': 'none',

    adviseList: [], //小程序返回的建议
    noticeList: [], //小程序返回的注意事项
    marketList: [], //小程序返回的销售推荐。
    preceptList: [], //小程序返回的方案信息
    servicehsList: [], //服务话术描述
    currentCase: {}, //点击当前案例
    ctNormalName: "", //当前选中的标准结果名称
    state: "",
    showModalCase: false,
    showModalGoods: false,
    goodsList: [],
    speechcraftText: [], //销售话术分行修改
    currentEnlarge: '', //放大文字
    showModalEnlarge: false, //放大镜默认关闭
    EnlargeTitle: '', //放大框的标题
    ellipsis: true, // 文字是否收起，默认收起
    adviseText: [], //健康建议分割后的集合
    salesGuideuce: false,
    prosGuideuce: [],
    isClose:false,
    healthResult: {
      qbEvalResultVoList: [{
        evalLableItemName: '未检测'
      }]
    },
    evalId: '',
    diseaseId: '',
    isShow: [],
    isShow1: [],
    isShow2: [],
    isShow3: [],
    isShow4: [],
    isShow5: [],
    isShow6: [],
    isShow7: [],
    isShow8: []
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      ctNormal: options.ctNormal ? JSON.parse(decodeURIComponent(options.ctNormal)) : {},
      listNormal: options.listNormal ? JSON.parse(decodeURIComponent(options.listNormal)) : {},
      userName: decodeURIComponent(options.userName),
      phone: decodeURIComponent(options.phone),
      isClose:true,
      state: decodeURIComponent(options.index),
      diseaseId: options.ctNormal ? JSON.parse(decodeURIComponent(options.ctNormal)).id : '',
      perorationId: options.ctNormal ? JSON.parse(decodeURIComponent(options.ctNormal)).perorationId : '',
      bid: options.bid,
      headImg: decodeURIComponent(options.headImg),
      openid: options.openid
    })
    that.setData({
      ctNormalName: that.data.ctNormal.name
    })
    that.getByPersionId();
    that.cantbt();
  },
 /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getByPersionId(this.data.ctNormal.id);
    console.log('this.data.isClose',this.data.isClose)
    if (!this.data.isClose) {
      this.getQbEvalNaireVoByDiseaseId(this.data.preceptList)
    }else{
      this.setData({
        isClose:false
      })
    }

  },

  // 人工检测
  getQbEvalNaireVoByDiseaseId(preceptList) {
    let that = this
    this.setData({
      evalId: ''
    })
    let datas = {
      createdBy: that.data.openid,
      diseaseId: that.data.perorationId
      // diseaseId: '1217276543865192490'
    }
    http.post({
      url: urlApi.getQbEvalNaireVoByDiseaseId(),
      showLoading: true,
      data: datas,
      success: (val) => {

        this.setData({
          preceptList: preceptList
        })
        if (val.data.data && val.data.data.length !== 0) {
          this.setData({
            evalId: val.data.data[0].id
          })

          this.setData({
            healthResult: val.data.data[0]
          })
          this.isShowZan()
        } else {

          this.setData({
            healthResult: {
              qbEvalResultVoList: [{
                evalLableItemName: '未检测'
              }]
            },
            evalId: ''
          })

        }
      },
      fail: () => {
        this.setData({
          preceptList: preceptList
        })
        console.error("fail")
      }
    })
  },
  isShowZan() {
    let preceptList = this.data.preceptList
    let name = this.data.healthResult.qbEvalResultVoList[0].evalLableItemName
    preceptList.forEach(item => {
      let recomOption = item.recomOption || ""
      let recomOptionArr = recomOption.split(/,|，/)
      let flag
      flag = recomOptionArr.some(reItem => {
        if (reItem === name) {
          return true
        }
      })
      if (!flag) {
        item.isHidden = true
      } else {
        item.isHidden = false
      }
    })
    this.setData({
      preceptList: preceptList
    })
  },
 
  // 开始人工检测
  begainTest(e) {
    // this.data.evalId = 49
    var evalId = this.data.evalId
    wx.navigateTo({
      url: "/pages/HealthAssessment/evaluationForm/evaluationForm?id=" + evalId + '&bid=' + this.data.bid + '&openid=' + this.data.openid + '&userName=' + this.data.userName,
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        // res.eventChannel.emit('acceptDataFromOpenerPage', { data: evalId })
      }
    })
  },
  loadMore(e) {
    let type = e.currentTarget.dataset.type
    let index = e.currentTarget.dataset.index
    let isShow = this.data[type]
    isShow[index] = !isShow[index] ? 'show' : ''
    let data = {}
    data[type] = isShow
    this.setData(data)
  },
  //个人中心的消息,点击跳转到我的消息
  info() {
    wx.navigateTo({
      url: '../info/info',
    })
  },
  //个人中心的实名认证,点击跳转到实名认证
  realName() {
    wx.navigateTo({
      url: '../realName/realName',
    })
  },

  cant: function (e) {
    this.setData({
      cant: 'flex',
      cantbt: 'none',
      cantone: 'hover',
      cantthree: '',
      'hidden': 'block',
      'threevi': 'none',
    })
  },

  cantbt: function (e) {
    let that = this;
    this.setData({
      cant: 'none',
      cantbt: 'flex',
      cantone: '',
      cantthree: 'hover',
      'hidden': 'none',
      'threevi': 'block',
    })
  },

  getNormal(e) {
    let that = this;
    let index = e.currentTarget.dataset.index; //获取当前的下标
    let id = e.currentTarget.dataset.id; //获取当前的下标
    let name = e.currentTarget.dataset.name; //获取当前的下标
    let perorationId = e.currentTarget.dataset.perorationid
    that.setData({
      ctNormalName: name,
      state: e.currentTarget.dataset.key,
      preceptList: [],
      diseaseId: id,
      perorationId: perorationId,
      prosGuideuce: [],
      isShow: [],
      isShow1: [],
      isShow2: [],
      isShow3: [],
      isShow4: [],
      isShow5: [],
      isShow6: [],
      isShow7: [],
      isShow8: [],
      isShow9: []
    })
    that.getByPersionId();


  },
  getByPersionId: function () {
    let that = this;
    that.setData({
      isSHowNoData: false
    })
    //根据标准结果Id，获取健康建议、注意事项、销售推荐
    util.loading();
    wx.request({
      url: urlApi.getNormDetail() + that.data.diseaseId,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (resdata) {
        let rdata = resdata.data.data;
        let preceptList = rdata.cureList.map(item => {
          return {
            ...item,
            pullDown: true,
          }
        });

        // preceptList[0].pullDown = false; //默认第一个打开
        that.setData({
          adviseList: rdata.healthRecommend, //小程序返回的建议
          noticeList: rdata.notice, //小程序返回的注意事项
          marketList: rdata.recommend || '', //小程序返回的销售推荐。
          // preceptList: preceptList, //小程序返回的方案信息
          isSHowNoData: preceptList.length === 0
        })
        that.getQbEvalNaireVoByDiseaseId(preceptList)
        //将方案默认的销售话术进行分割

        // let speechcraftName = preceptList[0].speechcraftName || '';

        // let speechcraftText = speechcraftName.split("*")
        // that.setData({
        //   preceptList: preceptList,
        //   speechcraftText: speechcraftText
        // })
        //adviseText
        if (that.data.adviseList && that.data.adviseList.length > 0) {
          let adviseName = that.data.adviseList;
          let adviseText = adviseName.split("*")
          that.setData({
            adviseText: adviseText
          })
        } else {
          that.setData({
            adviseText: ''
          })
        }
        util.closeload();
      },
      fail: function () {
        wx.showToast({
          title: "请求失败",
          icon: "none",
          duration: 2000
        })
        util.closeload();
      }
    })
  },
  //方案点击事件的点击事件

  storageIntroduce(e) {
    let that = this;


    let index = e.currentTarget.dataset.index; //获取当前的下标
    let preceptList = that.data.preceptList; //获取方案结果list的值
    let curePreceptId = e.currentTarget.dataset.curepreceptid
    if (preceptList[index].pullDown != true) {
      preceptList[index].pullDown = true;
      that.setData({
        preceptList: preceptList,
      })
    } else {
      for (let i = 0; i < preceptList.length; i++) {
        preceptList[i].pullDown = true;
      }
      preceptList[index].pullDown = false;

      let speechcraftName = preceptList[index].speechcraftName || '';
      let speechcraftText = speechcraftName.split("*")
      http.get({
        url: urlApi.getQbcurepreceptByID() + curePreceptId,
        showLoading: true,
        data: {},
        success: (res) => {

          preceptList[index].cureServiceList = res.data.data.serviceList
          preceptList[index].curegoodsList = res.data.data.goodsList
          preceptList[index].preceptDetail = res.data.data.preceptDetail
          preceptList[index].preceptEffect = res.data.data.preceptEffect
          preceptList[index].zyzsList = res.data.data.zyzsList
          preceptList[index].fwznList = res.data.data.fwznList
          that.setData({

            preceptList: preceptList,
            speechcraftText: speechcraftText
          })

        },
        fail: () => {
          console.error("fail")
        }
      })
    }

  },

  servicehs(e) {
    let that = this;

    let index = e.currentTarget.dataset.index; //获取当前的下标
    let serviceId = e.currentTarget.dataset.id; //获取服务Id
    wx.request({
      url: urlApi.getServiceSpeechData() + serviceId,
      method: "get",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync("token")
      },
      data: {},
      success: function (reponse) {
        that.setData({

          servicehsList: reponse.data.data,
          showModal: true
        })
      }
    })

  },

  hsok: function () {
    let that = this;
    that.setData({

      showModal: false
    })
  },

  storageCase: function (e) {
    let that = this;

    let caseId = e.currentTarget.dataset.id; //获取本次点击的Id
    wx.request({
      url: urlApi.getCaseById() + caseId,
      header: {
        "Content-Type": "application/json",
        'Authorization': wx.getStorageSync("token")
      },
      method: 'GET',
      //服务端的回掉
      success: function (result) {
        that.setData({

          currentCase: result.data.data,
          showModalCase: true
        })
      }
    })
  },

  caseok: function () {
    let that = this;
    that.setData({

      showModalCase: false
    })
  },

  ok: function () {
    let that = this;
    that.setData({

      showModal: false
    })
  },

  cant: function (e) {
    this.setData({
      cant: 'flex',
      cantbt: 'none',
      cantone: 'hover',
      cantthree: '',
      'hidden': 'block',
      'threevi': 'none',
    })
  },

  cantbt: function (e) {
    let that = this;
    this.setData({
      cant: 'none',
      cantbt: 'flex',
      cantone: '',
      cantthree: 'hover',
      'hidden': 'none',
      'threevi': 'block',
    })
  },

  checkboxChange: function (e) {},

  previewImg: function (e) {
    var index = e.currentTarget.dataset.index;
    let downList = e.currentTarget.dataset.downlist;
    let imgArr = [];

    for (let i = 0; i < downList.length; i++) {
      imgArr.push(downList[i].downUrl)
    }
    wx.previewImage({

      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    })
  },

  getGoodsDetail(e) {
    let that = this;

    let index = e.currentTarget.dataset.index; //获取当前的下标
    let goodsId = e.currentTarget.dataset.id; //获取服务Id
    wx.request({
      url: urlApi.getGoodsById(),
      method: "get",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync("token")
      },
      data: {

        id: goodsId
      },
      success: function (reponse) {

        that.setData({

          goodsList: reponse.data.data,
          showModalGoods: true
        })
      }
    })
  },

  goodok: function () {
    let that = this;
    that.setData({

      showModalGoods: false
    })
  },

  // 长按tap
  longTap: function (e) {
    let that = this;
    // wx.showModal({
    //   title: e.currentTarget.dataset.title,
    //   content: e.currentTarget.dataset.text,
    //   showCancel: false
    // })

    that.setData({
      currentEnlarge: e.currentTarget.dataset.text, //放大文字
      EnlargeTitle: e.currentTarget.dataset.title, //放大框的标题
      showModalEnlarge: true //放大镜开启
    })



  },
  enlargeOk: function () {
    let that = this;
    that.setData({
      showModalEnlarge: false
    })
  },
  /**
   * 收起/展开按钮点击事件
   */

  ellipsis: function () {
    var value = !this.data.ellipsis;
    this.setData({
      ellipsis: value

    })
  },

  //销售指引
  salesGuide() {
    // var salesGuideuce = !this.data.salesGuideuce
    // this.setData({
    //   salesGuideuce: salesGuideuce
    // })
  },
  //专业视频
  prosSalesGuide(e) {
    let index = e.currentTarget.dataset.index;
    var prosGuideuce = this.data.prosGuideuce
    prosGuideuce[index] = !this.data.prosGuideuce[index]
    this.setData({
      prosGuideuce: prosGuideuce
    })
  },
  toDetail(e) {
    let id = e.currentTarget.dataset.materialid
    wx.navigateTo({
      url: '/pages/mediaDetail/mediaDetail?id=' + id,
    })
  },
  imgError(e) {
    let type = e.currentTarget.dataset.type
    let index = e.currentTarget.dataset.index
    console.log(type, index)
    let img = 'precep[' + type + '][' + index + '].downUrl'
    this.setData({
      [img]: '/images/error.jpg'
    })
  },
})