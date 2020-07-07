// pages/mine/mine.js
const urlApi = require('../../utils/server.api.js')
const { $Message } = require('../../iview/base/index');
const util = require("../../utils/util.js")
const app = getApp();
Page({
  data: {
    showModal: false, //销售二维码弹框
    userRolelist: [],
    pitchon: "", //当前选定的角色编号
    pageData: [],
    crrentidentity: "", //角色名字
    homeRole: "", //主页面传过来的当前角色编号
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'), //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    openid: '',
    upverpass: true,
    isShopMan:null,
    isShowMoney:null
  },
  onLoad: function(options) {
    console.log('isShopMan',getApp().globalData.isShopMan)
   
  },
  onShow:function(options){
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let hasUserInfo = wx.getStorageSync('hasUserInfo');
    if(userInfo != null && userInfo !='' && userInfo != undefined){
      that.setData({
        userInfo:userInfo,
       
      })
    }
    if(hasUserInfo != null && hasUserInfo !='' && hasUserInfo != undefined){
      that.setData({
        hasUserInfo:hasUserInfo
      })
    }
    that.setData({
      isShopMan:getApp().globalData.isShopMan,
      isShowMoney:getApp().globalData.curentRole == 16 ? true:false
    })
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
  //个人中心的我的余额,点击跳转到我的余额
  restMoney() {
    wx.navigateTo({
      url: '../restMoney/restMoney',
    })
  },
  //个人中心的意见反馈,点击跳转到意见反馈
  view() {
    wx.navigateTo({
      url: '../view/view',
    })
  },
  //我的地址
  addr() {
    wx.navigateTo({
      url: '../../pages/shoppingMall/address/address',
    })
  },
  //退出登录
  signOut() {
    wx.navigateTo({
      url: '../logs/log',
    })
  },

  // 销售出现弹窗
  changeRole: function(e) {
    let that = this;

    that.setData({
      showModal: true
    })
  },
  // 月租扣费
  toMonthly:function(){
    wx.navigateTo({
      url:'../monthlyRentDeduction/monthlyRentDeduction'
    })
  },
    // 我的余额
    myMoney:function(){
      console.log(111)
      wx.navigateTo({
        url:'/pages/userRecharge/myBalance/index'
      })
    },
  
  getUserInfo: function(e) {
  
    let that = this;
    app.globalData.userInfo = e.detail.userInfo
    if (e.detail.userInfo) {
      //调用登录接口，获取 code
      wx.login({
        success: function(loginres) {
          //获取用户信息
          wx.getUserInfo({
            lang: "zh_CN",
            success: function(userRes) {
              util.loading();
              //发起网络请求
              wx.request({
                url: urlApi.getOnLogin(),
                data: {
                  code: loginres.code,
                  encryptedData: userRes.encryptedData,
                  iv: userRes.iv
                },
                header: {
                  "Content-Type": "application/json"
                },
                method: 'POST',
                //服务端的回掉
                success: function(result) {
                  console.log('服务端的回掉 3333333333333');
                  var data = result.data.data.userInfo;
                  wx.setStorageSync("userInfoData", data);
                  wx.setStorageSync('openid', data.openId); //存储openid
                  wx.setStorageSync('unionId', data.unionId); //存储unionId
                  wx.setStorageSync('sessionKey', result.data.data.sessionKey); //存储unionId
                  wx.setStorageSync('userImgUrl', data.avatarUrl);
                  let scanData = wx.getStorageSync('scanData');
                  console.log("scanData",scanData);
                  if(scanData != null && scanData !="" && scanData != undefined){
                    wx.navigateTo({
                      url: '/pages/home/home?scanData=' + scanData
                    })
                  }
                  //用户按了允许授权按钮
                  that.setData({
                    userInfo: e.detail.userInfo,
                    hasUserInfo: true
                  })
                  wx.setStorageSync("userInfo", e.detail.userInfo);
                  wx.setStorageSync('hasUserInfo', true); //存储openid
                  util.closeload();
                  wx.showToast({
                    title: "授权成功",
                    icon: "success",
                    duration: 1000
                  })
                  
                  wx.request({
                    url: urlApi.getWechatToken() + wx.getStorageSync('openid'),
                    header: {
                      "Content-Type": "application/json"
                    },
                    method: 'GET',
                    //服务端的回掉
                    success: function (result) {
                      wx.setStorageSync("token", result.data.data);
                      console.log(wx.getStorageSync("token"));
                    }
                    })
                }
              })
            }
          })
        }
      })
    } else {
      util.closeload();
      //用户按了拒绝按钮
      wx.showToast({
        title: "请同意授权",
        icon: "none",
        duration: 2000
      })
      
    }
  },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function( options ){
    　　var that = this;
    　　// 设置菜单中的转发按钮触发转发事件时的转发内容
    　　var shareObj = {
    　　　　title: "祺邦健康体检案例分享",        // 默认是小程序的名称(可以写slogan等)
    　　　　path: '/pages/home/home',      // 默认是当前页面，必须是以‘/’开头的完整路径
    　　　　imgUrl: 'https://health.qbjiankang.com/cureimg/fenxiang.png',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    　　　　success: function(res){
    　　　　　　// 转发成功之后的回调
    　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
    　　　　　　}
    　　　　},
    　　　　fail: function(){
    　　　　　　// 转发失败之后的回调
    　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
    　　　　　　　　// 用户取消转发
    　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
    　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
    　　　　　　}
    　　　　},
    　　　　complete: function(){
    　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
    　　　　}
    　　};
    　　// 返回shareObj
    　　return shareObj;
    }
})