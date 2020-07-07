// pages/goods/goods.js
const urlApi = require('../../utils/server.api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面切换
    currentIndex1: true, //待入仓
    currentIndex2: false, //在仓

    loadNum: 2, //待入仓个数
    inNum: 3, //在仓个数
    outNum: 3, //出仓个数
    finishNum: 3, //已完成个数
    //checkbox是否显示
    isCheckbox: false,
    //是否全选
    select_all: false,
    shpass: false,//判断是否重复点击收货按钮
    //待入仓数据
    loadList: [{
      id: 1,
      num: "D19060122",
      time: "2019-03-02"
    },
    {
      id: 2,
      num: "D19060123",
      time: "2019-03-02"
    }
    ],
    //在仓数据
    inList: [{
      id: 1,
      num: "A19060122",
      time: "2019-03-02"
    },
    {
      id: 2,
      num: "A19060123",
      time: "2019-03-02"
    },
    {
      id: 3,
      num: "A19060124",
      time: "2019-03-02"
    },
    {
      id: 4,
      num: "A19060124",
      time: "2019-03-02"
    },
    ],

    //在仓的导航栏样式
    kong2: false,
    fhwclist: [], //接受后台返回的所有数据

    shhwclist: [],
    'fahuodis': 'block',
    currentBid:'',
  },
  //待入仓
  currentIndex1: function (e) {
    // this.onShow()
    this.setData({
      kong2: false,
      currentIndex1: true,
      currentIndex2: false,
      currentIndex3: false,
      currentIndex4: false
    })
  },
  //在仓
  currentIndex2: function (e) {
    let that = this;
    // this.onShow(),
    if (that.data.shpass == false) {
      this.getshData();
    }
    this.setData({
      kong2: true,
      currentIndex1: false,
      currentIndex2: true,
      currentIndex3: false,
      currentIndex4: false
    })

  },
  onLoad: function (options) {
    let that = this;
    // if(homerole != 7 && homerole !=6 && homerole != 5){//当前角色不等于 公司 渠道商  以及代理商的时候不需要发货
    //    that.setData({
    //      'fahuodis':'none',
    //      currentIndex2: true
    //    })
    // }
    that.setData({
      currentBid:  options.currentBid
    })
    console.log("currentBid",options.currentBid);
    wx.request({
      url: urlApi.getfhHistory(),
      header: {
        "Content-Type": "application/json"
      },
      data: {
          openid: wx.getStorageSync("openid"),
       // openid: 'owZ0449nD9rkIY876nYkMLQIicuY',
          bId:that.data.currentBid
      },
      method: 'POST',
      //服务端的回掉
      success: function (result) {
        if (result.data.code == 200) {
          console.log(result);
          that.setData({
            fhwclist: result.data.data
          })
          console.log(that.data.fhwclist);
          that.getshData();

        }
      }
    })

  },
  getshData: function () {
    let that = this;
    wx.request({
      url: urlApi.getshhouHistory(),
      header: {
        "Content-Type": "application/json"
      },
      data: {
        openid: wx.getStorageSync("openid"),
        //openid: 'owZ0449nD9rkIY876nYkMLQIicuY',
        bId:that.data.currentBid
      },
      method: 'POST',
      //服务端的回掉
      success: function (result) {
        if (result.data.code == 200) {
          console.log(result);
          that.setData({
            shhwclist: result.data.data
          })
          console.log(that.data.shhwclist);
        }
      }
    })
    that.setData({
      shpass: true
    })
  },
  lookfahuo: function (e) {
    let that = this;
    let batch = e.currentTarget.dataset.batch;//获取批次号
    wx.navigateTo({
      url: '../../pages/goodsDetail/goodsDetail?batch=' + batch
    })
  },
  lookshouhuo: function (e) {
    let that = this;
    let batch = e.currentTarget.dataset.batch;//获取批次号
    wx.navigateTo({
      url: '../../pages/goodsDetail/goodsDetail?batch=' + batch
    })

  }
})