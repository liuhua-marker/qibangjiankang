var QR = require("../../utils/qrcode.js");
const urlApi = require('../../utils/server.api.js')
var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'can_bg': '../images/new.jpg',
    'cant_bg': '../images/old.jpg',
    toView: 'red',
    scrollTop: 100,
    'cant': 'none',
    'cantbt': 'none',
    'cantone': 'hover',
    'cantthree': '',
    'hidden': 'block',
    'threevi': 'none',
    canvasHidden: false,
    maskHidden: true,
    imagePath: '',
    placeholder: '奇点创智', //默认二维码生成文本
    userName: '',
    sex: 0,
    adress: '',
    dates: '',
    userData: '',
    openid: '',
    boxname: '',
    time: '0',
    affname: '',
    latitude: 39.93574,
    longitude: '黄泽军',
    boxIdentity: "",
    mangerOpenId: '',
    boxId: "29883940583",
    display: 'fixed',
    listserve: [{

    }],
    projectName: '',
    storecode: '',
    passBinding: '',
    loadList: [],
    timer: '', //定时器名字
    countDownNum: '3', //倒计时初始值
    showModal: false, //销售二维码弹框
    passQrCode: false, //判断本页面的二维码是否生成
    selectProject:"",
    userTimes:'0',//该套盒剩余使用次数
    currentBid:''
   
  },
  can: function(e) {
    console.log(e)
    this.setData({
      'cant': 'none',
      'cantbt': 'none',
      'cantone': '',
      'cantthree': '',
      'hidden': 'none',
      'threevi': 'none',
      'sellbuton': 'block',
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
    wx.request({ //请求后台获取该套盒所有服务历史记录
      url: urlApi.getServicesHistory(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        boxId: that.data.boxId
      },
      success: function(resdata) {
        console.log(resdata);
        that.setData({
          loadList: resdata.data.data
        })
      },
      fail: function() {
        wx.showToast({
          title: "请求失败",
          icon: "none",
          duration: 2000
        })
      }
    });
  },
  upper: function(e) {
    console.log(e)
  },
  lower: function(e) {
    console.log(e)
  },
  scroll: function(e) {
    console.log(e)
  },
  tap: function(e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.lkai();
    //生成二维码
    console.log(options);
    if (options.scanType == "affiliation") { //新用户注册接口 userRole=4代表新顾客注册
      if (options.boxname != null && options.boxname != ""){
        that.setData({
          boxname: options.boxname,
        })
      }
      if (options.time != null && options.time !="") {
        that.setData({
          time: options.time,
        })
      }
      if (options.affname != null && options.affname !="") {
        that.setData({
          affname: options.affname,
        })
      }
      that.setData({
        boxIdentity: options.boxIdentity,
        mangerOpenId: options.mangerOpenId,
        boxId: options.newboxId,
        userTimes:options.userTimes,
        openid: wx.getStorageSync('openid'),
        passBinding: options.passBinding,
        currentBid:options.currentBid,
        userData: 'https://health.qbjiankang.com/wechat/index.html?' +   'scanType=' + options.scanType + '&boxname=' + options.boxname + '&time=' + options.time + '&affname=' + options.affname + '&boxId=' + options.newboxId + '&boxIdentity=' + options.boxIdentity + '&mangerOpenId=' + options.mangerOpenId
      });
    }
    if (that.data.passBinding == "Y") {
      that.setData({
        'can': 'none',
        'sellbuton':'none',
        'sellbuton': 'none'
      })
      that.cant();
    } else {

    }
    console.log("boxId ===============" + that.data.boxId);
    wx.request({ //请求后台获取该套盒所有服务项
      url: urlApi.getAffiliationServices(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        boxId: that.data.boxId
      },
      success: function(resdata) {
        console.log(resdata);
        that.setData({
          listserve: resdata.data.data,
          selectProject: resdata.data.data[0].projectId
        })
      },
      fail: function() {
        wx.showToast({
          title: "请求失败",
          icon: "none",
          duration: 2000
        })
      }
    });
  },
  countDown: function() { //定时任务
    let that = this;
    
    let timesRun = 0;
    let countDownNum = that.data.countDownNum; //获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function() { //这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        timesRun += 1;
        if(timesRun === 120){    
          clearInterval(interval);    
      }
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum
        })
        wx.request({ //获取套盒是否被绑定
          url: urlApi.getPassAffiliation(),
          method: "post",
          header: {
            'content-type': 'application/json'
          },
          data: {
            boxId: that.data.boxId
          },
          success: function(resdata) {//销售成功
            console.log(resdata);
            let timeData = resdata.data.data;
            if (timeData != null) {
              clearInterval(that.data.timer);
              if (timeData.user.name != null && timeData.user.name != "") {
                that.setData({
                  affname: timeData.user.name,
                })
              }
              that.ok();
              wx.request({ //绑定成功之后请求后台获取该套盒绑定的服务项
                url: urlApi.getAffiliationServices(),
                method: "post",
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  boxId: that.data.boxId
                },
                success: function (resdata) {
                  console.log(resdata);
                  that.setData({
                    listserve: resdata.data.data,
                    selectProject: resdata.data.data[0].projectId
                  })
                },
                fail: function () {
                  wx.showToast({
                    title: "请求失败",
                    icon: "none",
                    duration: 2000
                  })
                }
              });
            }

          },
          fail: function() {
            wx.showToast({
              title: "获取套盒是否被绑定失败",
              icon: "none",
              duration: 2000
            })
          }
        });
        console.log("定时任务测试");
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
      }, 3000)
    })
  },

  //这里是生成二维码的代码 ####开始
  setCanvasSize: function() {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;
      var width = res.windowWidth / scale;
      var height = width; //canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => {
      this.canvasToTempImage();
    }, 1000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function() {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          // canvasHidden:true
        });
      },
      fail: function(res) {
        console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function(e) {
    var img = this.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  //这里是生成二维码的代码 ####结束



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  //方案点击事件的点击事件
  storageIntroduce(e){
    let that = this;
    console.log(e)
    let index = e.currentTarget.dataset.index;//获取当前的下标
    let listserve = that.data.listserve;//获取方案结果list的值

    if(listserve[index].pullDown != true){
      listserve[index].pullDown = true;
    }else{
      for(let i=0;i<listserve.length;i++){
        listserve[i].pullDown = true;
      }
      listserve[index].pullDown = false;
    }
    that.setData({
      listserve:listserve
    })
    console.log("that.data.listserve",that.data.listserve);
  },

  lkai: function() {
    var that = this;
    var screenHeight, heights
    wx.getSystemInfo({
      success: function(res) {
        screenHeight = res.screenHeight
        // console.log(res.screenHeight)
      }
    });
    //创建节点选择器
    var query = wx.createSelectorQuery();
    query.select('.usage').boundingClientRect()
    query.exec(function(res) {
      //res就是 所有标签为usage的元素的信息 的数组
      // console.log(res);
      //取高度
      heights = res[0].height;
      if (screenHeight - heights <= 200) {
        that.setData({
          display: ''
        })
      } else {
        that.setData({
          display: 'fixed'
        })
      }
    })
  },
  executeServe: function() {
    this.userBoxScan();
  },
  //套盒扫描事件
  userBoxScan: function() {
    let that = this;
    if(that.data.userTimes <= 0){
      wx.showToast({
        title: "该套盒剩余次数不足",
        icon: "none",
        duration: 2000
      })
      return;
    }
    wx.request({ //openid请求后台，获取用户角色。
      url: urlApi.insertServices(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        boxIdentity: that.data.boxIdentity,
        openid: wx.getStorageSync('openid'),
        boxId: that.data.boxId,
      },
      success: function(resdata) {
        console.log(resdata);
        let sundata = resdata.data.data;
        if (resdata.data.code == 200) {
          wx.showToast({
            title: "添加成功",
            icon: "none",
            duration: 2000
          })
          wx.scanCode({
            success: (res) => {
              console.log(res); //获取扫码后的数据
      
              console.log(res)
              var path = res.result
              //微信开发者工具 在开发者工具里出现乱码需要decodeURIComponent转义,真机不需要,可以直接使用
             path= path.split('?');   //分割字符串 path[0]等于pages/me/me,path[1]等于scene=table_id%3D8%26shop_id%3D1
             var scene = path[1];                 
             scene = scene.split("&");
              var list = {};
              for(var i = 0; i<scene.length; i++){
                  var b = scene[i].split("=");
                  list[b[0]] = b[1];
              }
              if(list.scanType != "deviceId"){
                wx.showToast({
                  title: "请扫描设备启动二维码",
                  icon: "none",
                  duration: 2000
                })
                return false;
              }
              that.userDeiveScan(list); //设备扫描
            }
          })
        } else {
          wx.showToast({
            title: resdata.data.msg,
            icon: "none",
            duration: 2000
          })
         
        }
      },
      fail: function() {
        wx.showToast({
          title: "扫描套盒出错",
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  //设备扫描事件
  userDeiveScan: function(res) {
    console.log("res",res);
    let that = this;
    wx.request({ //openid请求后台，获取用户角色。
      url: urlApi.getDeviceIdScan(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        deviceIdentity: res.deviceIdentity,
        bId:that.data.currentBid,
        openid:wx.getStorageSync('openid')
      },
      success: function(resdata) {
        console.log(resdata);
        if (resdata.data.code == 200) {
          wx.showToast({
            title: "启动成功",
            icon: "none",
            duration: 2000
          })
        } else {
          wx.showToast({
            title: resdata.data.msg,
            icon: "none",
            duration: 2000
          })
         
        }
      },
      fail: function() {
        wx.showToast({
          title: "扫描设备出错",
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  // 销售出现弹窗
  wqd: function(e) {
    let that = this;
    if (that.data.passQrCode != true) {
      wx.showToast({
        title: '生成中...',
        icon: 'loading',
        duration: 2000
      });
      // 页面初始化 options为页面跳转所带来的参数
      var size = that.setCanvasSize(); //动态设置画布大小
      // var initUrl = this.data.placeholder;
      //console.log(initUrl);
      let sell = that.data.userData + "&selectProject=" + that.data.selectProject;
      that.createQrCode(sell, "mycanvas", size.w, size.h);
      that.countDown();
    }

    that.setData({
      showModal: true,
      passQrCode: true
    })
  },
  ok: function() {
    let that = this;
    this.setData({
      showModal: false
    })
    clearInterval(that.data.timer);
  },
  getGenderChange: function (e) {
    let that = this;
    console.log(e);
    that.setData({
      selectProject: e.detail.value,
      passQrCode:false
    })
  }
})