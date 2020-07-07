// pages/main/index.js
var QR = require("../../utils/qrcode.js");
Page({
  data: {
    canvasHidden: false,
    maskHidden: true,
    imagePath: '',
    placeholder: '奇点创智',//默认二维码生成文本
    userName: '',
    sex: 0,
    adress: '',
    dates: '',
    userData: '',
    openid: '',
    currentBid: "",
    vCode:"",
  },
  onLoad: function (options) {
    let that = this;
    console.log(options);
    if (options.socetype == "adduser") {//新用户注册接口 userRole=4代表新顾客注册
      that.setData({
        userName: options.userName,
        sex: options.sex,
        adress: options.adress,
        dates: options.dates,
        currentBid:options.currentBid,
        vCode:options.vCode,
        userData: 'https://health.qbjiankang.com/wechat/index.html?'+'scanType='+ options.socetype + '&userName=' + options.userName + '&sex=' + options.sex + '&adress=' + options.adress + '&dates=' + options.dates + "&mangerAffiliationId=" + options.openid + "&phone=" + options.phone 
        + "&userRole=" + "4" +"&currentBid=" +options.currentBid + "&vCode=" + options.vCode
      });
    }
    if (options.socetype == "addshop") {//新用户注册接口 userRole=4代表新顾客注册
      that.setData({
        userName: options.userName,
        sex: options.sex,
        adress: options.adress,
        dates: options.dates,
        currentBid:options.currentBid,
        userData: 'https://health.qbjiankang.com/wechat/index.html?'+'scanType=' + options.socetype + '&userName=' + options.userName + '&sex=' + options.sex + '&adress=' + options.adress + '&dates=' + options.dates + "&mangerAffiliationId=" + options.openid + "&phone=" + options.phone 
        + "&userRole=" + "3" +"&currentBid=" +options.currentBid

      });
      console.log(that.data.userData);
    }


    // 页面初始化 options为页面跳转所带来的参数
    var size = this.setCanvasSize();//动态设置画布大小
    // var initUrl = this.data.placeholder;
    //console.log(initUrl);

    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 2000
    });
    console.log(that.data.userData);
    that.createQrCode(this.data.userData, "mycanvas", size.w, size.h);

  },
  onReady: function () {

  },
  onShow: function () {

    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },

  onUnload: function () {
    // 页面关闭

  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => { this.canvasToTempImage(); }, 1000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          // canvasHidden:true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  formSubmit: function (e) {
    var that = this;
    var url = e.detail.value.url;
    console.log(url)
    that.setData({
      maskHidden: false,
    });
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 2000
    });
    var st = setTimeout(function () {
      wx.hideToast()
      var size = that.setCanvasSize();
      //绘制二维码
      that.createQrCode(url, "mycanvas", size.w, size.h);
      that.setData({
        maskHidden: true
      });
      clearTimeout(st);
    }, 2000)

  }

})