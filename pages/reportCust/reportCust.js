const urlApi = require('../../utils/server.api.js')
const util = require("../../utils/util.js")
const downurl = "https://health.qbjiankang.com/pdf/";
var app = getApp()
Page({
  data: {
    current: 0,
    'passSize': 'none',
    swiper: {
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 1000
    },
    userCode: '',
    userName: '',
    curentRole: '',
    dzdisplay: false,
    currentBid: '',
    sessionKey: '',
    authentication: '0',//判断是否真实手机号
    bodyview: false,
    phone: '',
    currentPage: '1',// 当前页数
    dataArray: [],//循环总数组
    nodataview: true,//判断是否有数据 默认有
    statusType: [
      { name: "病症", id: 1, page: 0, swiperHg: '255px' },
      { name: "时间", id: 2, page: 0, swiperHg: '100px' },
      { name: "年龄", id: 3, page: 0, swiperHg: '100px' },
      { name: "姓名", id: 4, page: 0, swiperHg: '100px' },
    ],
    currentType: 0,
    windowHeight: '',
    isCaseProject: '',//当前点击的一级Id
    isCaseDesc: '',//当前点击的二级Id
    caseFirstProject: [],//一级病症，循环系统、呼吸系统.....
    swiperHg: '0px',
    caseScondDesc: [],//二级病症，耳鼻喉...
    scrollTop: 0,//记录屏幕高度
    selectDesc: [],//选中的所有二级数据
    cqbutton: false,
    startDate: '',//筛选开始时间
    endDate: '',//筛选截止时间
    inputStartDate: '1950-08-08',//筛选截止时间中的目标开始时间
    startAge: '',//开始年龄
    endAge: '',//结束年龄
    needselct:false,//默认不需要赛选
    probably:'0',//大概总数多少件
    passpro:false,
  },

  onLoad: function (options) {
    var that = this;
    // console.log("that.data.options", options);
    that.setData({
      userCode: wx.getStorageSync('userCode'),
      userName: wx.getStorageSync('userName'),
      curentRole: options.curentRole,
      currentBid: options.currentBid,
      sessionKey: decodeURIComponent(options.sessionKey),
      authentication: decodeURIComponent(options.authentication),
      // bodyview: decodeURIComponent(options.authentication) == 1 ? true : false
    })
    that.setData({
      dzdisplay: that.data.curentRole == 2 || that.data.curentRole == 3 ? true : false
    })
    // if (that.data.bodyview) {//如果获取过手机号，调用查询接口
    //   that.getCases();
    // }
    that.getCases();
    var systemInfo = wx.getSystemInfoSync()
    this.setData({
      windowHeight: systemInfo.windowHeight,
      currentType: options.id ? options.id : 5
    })
    if (that.data.dzdisplay) {
      that.getFirstProject();
    }
    // 页面初始化 options为页面跳转所带来的参数    156905936531702
  },
  // 点击tab切换 
  swichNav: function (res) {
    let that = this;
    if (this.data.currentType == res.detail.currentNum) return;
    this.setData({
      currentType: res.detail.currentNum,
      swiperHg: that.data.statusType[res.detail.currentNum].swiperHg,
    })
    that.setData({
      cqbutton: that.data.currentType!=5 ?true:false
    })
  },
  bindChange: function (e) {
    let that = this;
    this.setData({
      currentType: e.detail.current,
      swiperHg: that.data.statusType[e.detail.current].swiperHg,
    })
    that.setData({
      cqbutton: that.data.currentType!=5 ?true:false
    })
  },
   // 点击关闭按钮 
  guan_bi:function(){
    let that = this;
    that.setData({
      currentType: 5,
      swiperHg: '0px',
      cqbutton:false
    })
  },
  onPullDownRefresh: function () {
    console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var that = this;
    // console.log(that.data.userCode);
    // 页面初始化 options为页面跳转所带来的参数    156905936531702
    if (!that.data.bodyview) {//如果未获取过手机号，返回禁止下拉请求
      return false;
    }
    that.getCases();

    wx.stopPullDownRefresh;
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  //PDF页跳转
  downReport: function (e) {
    console.log(e.currentTarget.dataset.id);
  
    wx.navigateTo({
      url: '../../pages/casehtml/casehtml?caseId=' + encodeURIComponent(e.currentTarget.dataset.id) ,
      // success:function() {
      // },       //成功后的回调；
      // fail:function() { 
      //   console.log('--------shibai-------')
      // },         //失败后的回调；
      // complete:function() { }      //结束后的回调(成功，失败都会执行)
    })
    // console.log(e.currentTarget.dataset.id);
    // console.log(e.currentTarget.dataset.userid);
    // let Path = "/images/pdfview.pdf";
    // let aurl = downurl + e.currentTarget.dataset.id;
    // // console.log(aurl);
    // util.loading();
    // wx.downloadFile({
    //   url: aurl,
    //   success: function (res) {
    //     // console.log(res)
    //     var Path = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
    //     wx.openDocument({
    //       filePath: Path,
    //       fileType: "pdf",
    //       success: function (res) {
    //         // console.log('打开成功');
    //         util.closeload();
    //       },
    //       fail: function (res) {
    //         // console.log(res);
    //         util.closeload();
    //       }
    //     })
    //   },
    //   fail: function (res) {
    //     // console.log(res);
    //     util.closeload();
    //   }
    // })
    
  },
  phoneCall(e) {
    let query = e.currentTarget.dataset['call'];
    wx.makePhoneCall({
      phoneNumber: query.toString() //仅为示例，并非真实的电话号码
    })
  },
  switchSlider: function (e) {
    this.setData({
      current: e.target.dataset.index
    })
  },
  changeSlider: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  loadEdit: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '../../pages/treatment/treatment?caseId=' +encodeURIComponent( e.currentTarget.dataset.caseid) 
      + "&downadress=" + encodeURIComponent( e.currentTarget.dataset.downadress)//当前的体检案例Id
      + "&shareType=normal&headImg="+encodeURIComponent( e.currentTarget.dataset.userimgurl)+"&bid="+encodeURIComponent( e.currentTarget.dataset.bid)
      +"&openid="+encodeURIComponent( e.currentTarget.dataset.openid)
    })
  },
  onReady: function () {
    // 页面渲染完成
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

  getPhoneNumber: function (e) {
    let that = this;
    wx.checkSession({
      success: function () {
        // console.log(e.detail.errMsg)
        // console.log(e.detail.iv)
        // console.log(e.detail.encryptedData)
        // console.log("that.data.sessionKey", that.data.sessionKey)
        var ency = e.detail.encryptedData;
        var iv = e.detail.iv;
        var sessionk = that.data.sessionKey;
        console.log("e.detail.errMsg",e.detail.errMsg)
        if (e.detail.errMsg == 'getPhoneNumber:user deny' || e.detail.errMsg == 'getPhoneNumber:fail user deny'|| e.detail.errMsg == 'getPhoneNumber:fail:user deny') {
          wx.showToast({
            title: "为了您更好的用户体验，请同意授权登录",
            icon: "none",
            duration: 3000
          })
        } else {//同意授权
          wx.request({
            method: "GET",
            url: urlApi.getDeciphering(),
            data: {
              encrypdata: ency,
              ivdata: iv,
              sessionkey: sessionk
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: (res) => {
              // console.log("解密成功~~~~~~~将解密的号码保存到本地~~~~~~~~");
              // console.log(res);
              let phone = res.data.phoneNumber;
              that.setData({
                phone: phone
              })
              that.insertPhone();
              // console.log(phone);
            }, fail: function (res) {
              // console.log("解密失败~~~~~~~~~~~~~");
              // console.log(res);
            }
          });
        }
      },
      fail: function () {
        // console.log("session_key 已经失效，需要重新执行登录流程");
        that.wxlogin(); //重新登录
      }
    });
  },
  getCases: function () {//获取所有有关案例
    let that = this;
    that.loadInitData();
  },
  insertPhone: function () {
    let that = this;
    util.loading();
    wx.request({//openid请求后台，获取用户角色。
      url: urlApi.insertPhone(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        phone: that.data.phone,
        openid: wx.getStorageSync('openid')
      },
      success: function (resdata) {
        // console.log(resdata);
        if (resdata.data.data > 0) {
          that.getCases();
          that.setData({
            bodyview: true
          })
        } else {
          util.closeload();
        }

      },
      fail: function () {
        util.closeload();
        wx.showToast({
          title: "请求失败",
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  loadInitData: function () {

    var that = this
    var currentPage = 1;
    var tips = "正在加载";
    // console.log("load page " + (currentPage));
    wx.showLoading({
      title: tips,
    })
    // 刷新时，清空dataArray，防止新数据与原数据冲突
    that.setData({
      dataArray: []
    })
    // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request.
    wx.request({
      url: urlApi.getUserDoweUrl(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        userCode: that.data.userCode,
        bId: that.data.currentBid,
        openid: wx.getStorageSync('openid'),
        currentPage: currentPage,
        selectDesc: that.data.selectDesc,
        startDate: that.data.startDate,
        endDate: that.data.endDate,
        startAge: that.data.startAge,
        endAge: that.data.endAge,
        caseUserName: that.data.sname
      },
      success: function (res) {
        wx.hideLoading();
        var data = res.data; // 接口相应的json数据
        var listgoods = data.data; // 接口中的data对应了一个数组，这里取名为 articles
        var totalDataCount = listgoods.length;
        // console.log("listgoods:", listgoods);
        // console.log(listgoods);
        // console.log("totalDataCount:" + totalDataCount);
        that.setData({
          ["dataArray[" + currentPage + "]"]: listgoods,
          currentPage: currentPage,
          totalDataCount: totalDataCount,
          bodyview: true
        })
        console.log("dataArray:", that.data.dataArray);
        if (that.data.dataArray[1].length <= 0) {
          that.setData({
            nodataview: false,
          })
        } else {
          that.setData({
            nodataview: true,
          })
        }

      }
    })
  },
  /**
   * 加载下一页数据
   */
  loadMoreData: function () {
    var that = this
    var currentPage = that.data.currentPage; // 获取当前页码
    var tips = "正在加载";
    console.log("that.data.startDate " + that.data.startDate);
    wx.showLoading({
      title: tips,
    })
    // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request.
    wx.request({
      url: urlApi.getUserDoweUrl(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        userCode: that.data.userCode,
        bId: that.data.currentBid,
        openid: wx.getStorageSync('openid'),
        currentPage: currentPage,
        selectDesc: that.data.selectDesc,
        startDate: that.data.startDate,
        endDate: that.data.endDate,
        startAge: that.data.startAge,
        endAge: that.data.endAge,
        caseUserName: that.data.sname
      },
      success: function (res) {
        wx.hideLoading();
        var data = res.data; // 接口相应的json数据
        var listgoods = data.data; // 接口中的data对应了一个数组，这里取名为 listgoods

        // 计算当前共加载了多少条数据，来证明这种方式可以加载更多数据
        var totalDataCount = that.data.totalDataCount;
        totalDataCount = totalDataCount + listgoods.length;
        // console.log("totalDataCount:" + totalDataCount);

        // 直接将新一页的数据添加到数组里
        that.setData({
          ["dataArray[" + currentPage + "]"]: listgoods,
          currentPage: currentPage,
          totalDataCount: totalDataCount
        })
        // console.log("dataArray:", that.data.dataArray);
        if (that.data.dataArray[1].length <= 0) {
          that.setData({
            nodataview: false,
          })
        } else {
          that.setData({
            nodataview: true,
          })
        }
      }
    })
  },
  /**
 * 页面   上拉触底事件的处理函数
 */
  onReachBottom: function () {
    var pageNum = this.data.currentPage;
    // console.log(pageNum * 10)
    if (pageNum * 10 == this.data.totalDataCount) {
      this.setData({
        currentPage: pageNum + 1 //设置下一页
      })
      this.loadMoreData(); //查询数据
    } else {
      wx.showToast({
        title: "没有更多数据了",
        duration: 1000,
        icon: 'none',
        mask: true
      })
    }

  },
  //查询一级系统病症
  getFirstProject: function () {
    let that = this;
    wx.request({
      url: urlApi.getFirstProject(),
      method: "post",
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync("token")
      },
      data: {
      },
      success: function (res) {
        var data = res.data; // 接口相应的json数据
        // console.log(data)
        // 接口中的data对应了一个数组，这里取名为 listgoods
        that.setData({
          caseFirstProject: data.data,
          isCaseProject: data.data[0].id
        })
        that.getSecondDesc(data.data[0].id);
      }
    })
  },
  //查询二级病症
  getSecondDesc: function (id) {

    let that = this;
    wx.request({
      url: urlApi.getSecondDesc(),
      method: "post",
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync("token")
      },
      data: {
        parentId: id
      },
      success: function (res) {
        var data = res.data; // 接口相应的json数据
        // console.log(data)
        // 接口中的data对应了一个数组
        let caseScondDesc = data.data;//当前二级集合data.data
        // console.log("----------------1caseScondDesc", caseScondDesc);
        let selectDesc = that.data.selectDesc;
        for (let y = 0; y < caseScondDesc.length; y++) {
          for (let i = 0; i < selectDesc.length; i++) {
            if (selectDesc[i].id == caseScondDesc[y].id) {
              caseScondDesc[y].checked = true;//将勾选改为false
              break;
            }
          }
        }
        that.setData({
          caseScondDesc: caseScondDesc,
        })
        // console.log("----------------1caseScondDesc", that.data.caseScondDesc);
      }
    })
  },
  //一级点击事件 
  caseproject: function (e) {

    let that = this;
    // console.log(e)
    var id = e.target.dataset.id;
    let index = e.target.dataset.index;
    this.setData({
      isCaseProject: id
    })
    // console.log("111caseScondDesc", that.data.caseScondDesc);
    this.getSecondDesc(id);
    // console.log("222caseScondDesc", that.data.caseScondDesc);
    let caseFirstProject = that.data.caseFirstProject;//当前二级集合
    let selectDesc = that.data.selectDesc;

    for (let c = 0; c < caseFirstProject.length; c++) {
      let passPro = false;//默认一级没有包含
      for (let s = 0; s < selectDesc.length; s++) {
        if (selectDesc[s].parentId == caseFirstProject[c].id) {
          passPro = true;
          break;
        }
      }
      if (passPro) {
        caseFirstProject[c].checked = true;
      } else {
        caseFirstProject[c].checked = false;
      }
    }
    that.setData({
      isCaseProject: id,
      caseFirstProject: caseFirstProject,
    })
     console.log("主主主selectDesc", that.data.selectDesc);
     console.log("主主主caseFirstProject", that.data.caseFirstProject);
  },
  //点击二级之后直接查询相关数据selectDesc
  casedesc: function (e) {
    let that = this;
    let id = e.target.dataset.id;
    let index = e.target.dataset.index;
     console.log(e)
    let caseScondDesc = that.data.caseScondDesc;//当前二级集合
    let selectDesc = that.data.selectDesc;
    let passDesc = false;//默认没有包含
    for (let i = 0; i < selectDesc.length; i++) {
      if (selectDesc[i].id == caseScondDesc[index].id) {
        selectDesc.splice(i, 1)//包含元素则直接删除元素
        caseScondDesc[index].checked = false;//将勾选改为false
        passDesc = true
        break;
      }
    }
    if (!passDesc) {//不包含则添加元素
      caseScondDesc[index].checked = true;//将勾选改为true，选中状态
      selectDesc.push(caseScondDesc[index])
    }
    that.setData({
      isCaseDesc: id,
      selectDesc: selectDesc,
      caseScondDesc: caseScondDesc
    })
    that.probablySumSize();
     console.log("selectDesc", selectDesc);
     console.log("caseScondDesc", caseScondDesc);
  },
  //监听页面滑动事件
  onPageScroll: function (ev) {
    let that = this;
    
    if (ev.scrollTop >100) {
      this.setData({
        scrollTop: ev.scrollTop,
        swiperHg: '0px',
        cqbutton: false
      })
    }
    if (ev.scrollTop < 5) {
      this.setData({
        scrollTop: ev.scrollTop,
        swiperHg: that.data.currentType!=5 ? that.data.statusType[that.data.currentType].swiperHg:'0px',
        cqbutton: that.data.currentType!=5 ?true:false
      })
    }
  },
  //重置操作
  chong_zhi: function () {
    let that = this;
    that.getFirstProject();
    that.setData({
      selectDesc: [],
      startDate: '',
      inputStartDate: '',
      endDate: '',
      startAge: '',
      endAge: '',
      sname: ''
    })
  },
  //点击确定，直接查询
  que_ding: function () {
    let that = this;
    that.getCases();
  },
  bindDateChange: function ({ detail = {} }) {
    let that = this;
    console.log(detail.value);
    that.setData({
      startDate: detail.value,
      inputStartDate: detail.value
    });
    console.log(that.data.startDate);
  },
  bindEndDateChange: function ({ detail = {} }) {
    let that = this;
    console.log(detail.value);
    that.setData({
      endDate: detail.value
    });
    console.log(that.data.endDate);
  },
  //开始年龄验证发放
  startAgeVerifyFun: function ({ detail }) {
    let that = this;
    let startAge = detail.detail.value
    that.setData({
      startAge: startAge
    })
    console.log(that.data.startAge);
  },
  //结束年龄验证发放
  endAgeVerifyFun: function ({ detail }) {
    let that = this;
    let endAge = detail.detail.value
    that.setData({
      endAge: endAge
    })
    console.log(that.data.endAge);
  },
  //姓名验证发放
  nameVerifyFun: function ({ detail }) {
    let that = this;
    let sname = detail.detail.value
    that.setData({
      sname: sname
    })
    console.log(that.data.sname);
  },
  //二级病症点击事件，将大概条数显示出来
  probablySumSize:function(){
    let that = this;
    util.loading();
    wx.request({
      url: urlApi.getProbablySumSize(),
      method: "post",
      header: {
        'content-type': 'application/json',
      },
      data: {
        userCode: that.data.userCode,
        bId: that.data.currentBid,
        openid: wx.getStorageSync('openid'),
        selectDesc: that.data.selectDesc,
        startDate: that.data.startDate,
        endDate: that.data.endDate,
        startAge: that.data.startAge,
        endAge: that.data.endAge,
        caseUserName: that.data.sname
      },
      success: function (res) {
        util.closeload();
        var data = res.data; // 接口相应的json数据
        // console.log(data)
        // 接口中的data对应了一个数组，这里取名为 listgoods
        that.setData({
          probably: data.data,
          passpro:true,
        })
      }
    })
  }

})
