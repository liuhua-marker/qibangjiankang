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
    page:''
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      page:options.page
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
                  // if(scanData != null && scanData !="" && scanData != undefined){
        
                  // }
                
                  if(that.data.page){
                    wx.navigateBack()
                  }else{
                    wx.switchTab({
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
  }
})