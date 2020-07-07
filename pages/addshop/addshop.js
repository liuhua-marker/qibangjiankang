// pages/addcard/addcard.js
const { $Message } = require('../../iview/base/index');
const urlApi = require('../../utils/server.api.js');
const util = require("../../utils/util.js")
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    card: '',
    phone: '',
    addrs: '',
    fruit: [{
      id: 0,
      name: '女',
    }, {
      id: 1,
      name: '男'
    }],
    position: 'left',
    animal: '熊猫',
    sex:"",
    checked: false,
    disabled: false,
    update:"",
    yesButton:"立即注册",
    dates:'',
    openid:'',
    sexpass:"",
    currentBid:"",
  },

    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      currentBid:  options.currentBid
    })
  },

  //姓名验证发放
  nameVerifyFun: function ({ detail }){
    let that = this;
    var name = detail.detail.value
    if (name == undefined || name == "" || name == null){
      $Message({
        content: "名字不能为空"
      });
    }else{
      console.log(name);
      that.setData({
        name:name
      })
    }
  },



  //电话验证发放
  phoneVerifyFun: function ({ detail }) {
    let that = this;
    var phone = detail.detail.value
    if (phone == undefined || phone == "" || phone == null) {
      $Message({
        content: "电话不能为空"
      });
    } else {
      that.setData({
        phone:phone
      })
    }
  },
  bindDateChange: function ({ detail = {} }){
    let that = this;
    console.log(detail.value);
    //this.dates = detail.value;
    that.setData({
      dates: detail.value
    });
    console.log(this.dates);
  },
  //地址验证发放
  addrVerifyFun: function ({ detail }) {
    let that = this;
    var addrs = detail.detail.value
    if (addrs == undefined || addrs == "" || addrs == null) {
      $Message({
        content: "详细地址不能为空"
      });
    } else {
      console.log("地址",addrs);
      that.setData({
        addrs:addrs
      })
    }
  },

  //获取性别
  handleFruitChange({ detail = {} }) {
    let that = this;
    that.setData({
      current: detail.value,
      sexpass: detail.value
    });
  },

  handleDisabled() {
    this.setData({
      disabled: !this.data.disabled
    });
  },

  handleClick:function(){
    let that = this;
    setTimeout(function () {
      let name = that.data.name;
      if (name == undefined || name == "" || name == null) {
        $Message({
          content: "姓名不能为空"
        });
        return false;
      }

      let dates = that.data.dates;
      if (dates == undefined || dates == "" || dates == null) {
        $Message({
          content: "出生日期不能为空"
        });
        return false;
      }

      let phone = that.data.phone
      if (phone == undefined || phone == "" || phone == null) {
        $Message({
          content: "电话不能为空"
        });
        return false;
      }
      console.log("that.sexpass########################" + that.data.sexpass);
      var sex = that.data.sexpass === "女" ? "1" : "0";
    
      let sexpass = that.data.sexpass;
      if (sexpass == undefined || sexpass == "" || sexpass == null) {
        $Message({
          content: "性别不能为空"
        });
        return false;
      }
      that.setData({
        openid: wx.getStorageSync('openid'),
      })
      console.log(wx.getStorageSync('openid'))
      console.log(that.data.openid)
      wx.navigateTo({
        url: '../../pages/QRcode/QRcode?userName=' + that.data.name + "&socetype=" + "addshop" + "&sex=" + sex + "&adress=" + that.data.addrs + "&dates=" + that.data.dates
            + "&openid=" + that.data.openid + "&phone=" + that.data.phone +"&currentBid=" +that.data.currentBid
      })


    }, 200) /*定时器240毫秒后，执行括号内部代码*/
    console.log("定时执行完成");
  
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})