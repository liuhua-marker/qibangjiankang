// pages/mine/mine.js
const urlApi = require('../../utils/server.api.js')
const {
  $Message
} = require('../../iview/base/index');
const util = require("../../utils/util.js")
const app = getApp();
Page({
  data: {
    showModal: false, //销售二维码弹框
    codeModal: false, //串码弹窗
    pitchon: "", //当前选定的角色编号
    pageData: [],
    crrentidentity: "", //角色名字
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    statusType: [], //顾客角色是每个人都拥有的角色
    currentType: 0,
    goodsMap: [{}, {}, {}, {}, {}],
    logisticsMap: [{}, {}, {}, {}, {}],
    windowHeight: '',
    cores: [],
    current: 0,
    listgoods: [],
    swiper: {
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 1000
    },
    currentBid: "", //当前Id
    currentOrgName: "", //当前组织组织名
    pitchon: "", //当前选定的角色编号
    userRoleOrg: [], //当前角色所拥有的组织
    curentRole: '4', //当前角色
    pitchon: "", //当前选定的组织编号
    pensorShowTop: "show",
    pensorShowBottom: "hidden",
    pensorName: "",
    pensorNumber: "",
    visible1: false,
    code: "",
    userData: "",
    newButton: "",
    openid: "",
    ghostdisabled: true,
    topBuSty: 'block',
    passPage: false,
    sessionKey: '',
    authentication: '0', //0为未认证，1为已认证
    businessFun: [], //业务中心功能
    personFun: [], //个人中心功能
    teamFun: [], //团队功能
  },
  onLoad: function (options) {
    var that = this;
    var systemInfo = wx.getSystemInfoSync();
    this.setData({
      windowHeight: systemInfo.windowHeight,
      currentType: options.id ? options.id : 0
    })
    that.getAuto();
    //用户用微信扫一扫系统业务二维码进入页面，进入小程序
    var autopath = decodeURIComponent(options.q)
    // console.log("autopath", autopath);
    if (autopath != "undefined" && autopath != "" && autopath != null) {
      //微信开发者工具 在开发者工具里出现乱码需要decodeURIComponent转义,真机不需要,可以直接使用
      autopath = autopath.split('?'); //分割字符串 path[0]等于pages/me/me,path[1]等于scene=table_id%3D8%26shop_id%3D1
      var scene = autopath[1];
      scene = scene.split("&");
      var autolist = {};
      for (var i = 0; i < scene.length; i++) {
        var b = scene[i].split("=");
        autolist[b[0]] = b[1];
      }
      if (autolist.scanType == "adduser") { //顾客注册的入口 1
        that.userLogon(autolist);
      }
      if (autolist.scanType == "addshopUser") { //店员注册的入口 1
        that.addshopUser(autolist);
      }
      if (autolist.scanType == "sysAddUser") { //系统人员注册的入口 1
        that.sysAddUser(autolist);
      }
    }
    let openid = wx.getStorageSync('openid');
    if (openid == null || openid == "") {
      that.setData({
        statusType: [{
          name: "顾客",
          userRole: "4",
          page: 0
        }]
      })
      that.getFunctionList(4);
      return false;
    }

  },
  onShow: function (options) {
    let that = this;
    // console.log("wx.getStorageSync('openid')", wx.getStorageSync('openid'));
    if (that.data.curentRole == '4') {
      that.getRoleList();
    }
    let scanData = wx.getStorageSync('scanData');
    if (scanData != null && scanData != "" && scanData != undefined) {
     
       if (scanData.scanType == "adduser") { //顾客注册的入口 1
                that.userLogon(scanData);
              }
              if (scanData.scanType == "addshopUser") { //店员注册的入口 1
                that.addshopUser(scanData);
              }
              if (scanData.scanType == "sysAddUser") { //系统人员注册的入口 1
                that.sysAddUser(scanData);
              }
    }
    that.getUser();
  },
  getRoleList: function () {
    let that = this;
    let openid = wx.getStorageSync('openid');
    if (openid == null || openid == "") {
      wx.showToast({
        title: "为了您更好的用户体验，建议您前往个人中心授权",
        icon: "none",
        duration: 4000
      })
      // wx.navigateTo({
      //   url: '/pages/login/login'
      // })
      return false;
    }
    let curentRole = that.data.curentRole;
    util.loading();
    //查询所有去重复的绑定角色
    wx.request({
      url: urlApi.getRoleDistinctByOpenId(),
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openId: openid != null && openid != "" ? openid : ' '
      },
      success: function (resdata) {
        util.closeload();
        if (resdata.data.code == 200) {
          let reslist = resdata.data.data; //后台返回该用户的所有去重复的角色
          if (reslist.length > 0) {
            that.setData({
              statusType: []
            })
            curentRole = reslist[0].userRole; //初始化时管理员的角色
            that.getOrganization(curentRole);
            for (let i = 0; i < reslist.length; i++) {
              let puList = [{
                name: reslist[i].roleName,
                userRole: reslist[i].userRole,
                page: 0
              }];
  
              that.data.statusType = that.data.statusType.concat(puList);
            }
          } else {
            curentRole = 4; //初始化时顾客的角色

            that.setData({
              statusType: [{
                name: "顾客",
                userRole: "4",
                page: 0
              }]
            })
          }

          that.setData({
            statusType: that.data.statusType,
            curentRole: curentRole,

          })
          // console.log("that.data.statusType", that.data.statusType);
          that.getFunctionList(curentRole);

        } else {
          util.closeload();
          wx.showToast({
            title: resdata.data.msg,
            icon: "none",
            duration: 2000
          })

        }

      },
      fail: function () {
        util.closeload();
        wx.showToast({
          title: "系统错误",
          icon: "none",
          duration: 2000
        })

      }
    })
  },


  // 点击tab切换 
  swichNav: function (res) {
    let that = this;
    if (this.data.currentType == res.detail.currentNum) return;
    that.setData({
      currentType: res.detail.currentNum
    })
    let index = res.currentTarget.dataset.id; //当前滑动的下标

    let curentRole = that.data.statusType[index].userRole; //当前选中的角色
    that.setData({
      curentRole: curentRole
    })
    // console.log("that.data.statusType", that.data.statusType);
    app.globalData.curentRole = curentRole
    that.getFunctionList(curentRole);
    if (curentRole != 4) { //顾客身份不需要切换组织，后台根据openid直接决定他归属于哪个门店
      that.getOrganization(curentRole);
    }

  },

  bindChange: function (e) { //滑动切换
    let that = this;
    that.setData({
      currentType: e.detail.current
    })
    let index = e.detail.current; //当前滑动的下标
    let curentRole = that.data.statusType[index].userRole; //当前选中的角色
    that.setData({
      curentRole: curentRole
    })
    that.getFunctionList(curentRole);
    if (curentRole != 4) { //顾客身份不需要切换组织，后台根据openid直接决定他归属于哪个门店
      that.getOrganization(curentRole);
    }
  },
  //详情页跳转
  lookdetail: function (e) {
    var lookid = e.currentTarget.dataset;
    wx.navigateTo({
      url: "/pages/yiguo/detail/detail?id=" + lookid.id
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
  getFunctionList: function (curentRole) {
    let that = this;
    //查询所有去重复的绑定角色
    that.setData({
      curentRole: curentRole
    })
    wx.request({
      url: urlApi.getFunctionByUserRole(),
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userRole: curentRole
      },
      success: function (resdata) {
        if (resdata.data.code == 200) {
          // console.log("reslist",reslist)
          let reslist = resdata.data.data; //后台返回该用户的所有去重复的角色
          that.setData({
            personFun: reslist.person,
            businessFun: reslist.business,
            teamFun: reslist.team
          })
          // that.data.businessFun.some(item => {
          //   if (item.functionName === '商城采购') {
          //     wx.setTabBarItem({
          //       index:1,
          //       text: '商城采购',
          //       iconPath: '/path/to/iconPath',
          //       selectedIconPath: '/path/to/selectedIconPath'
          //     })
          //   }
          // })
        } else {
          wx.showToast({
            title: resdata.data.msg,
            icon: "none",
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: "系统错误",
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  getOrganization: function (curentRole) { //获取当前组织，1：从history表中查询 如果为空 则直接插角色关系表最小的那条数据
    let that = this;
    that.setData({
      curentRole: curentRole
    })
    wx.request({
      url: urlApi.getOrganization(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        userrole: curentRole,
        openid: wx.getStorageSync("openid")
      },

      success: function (resdata) {
        if (resdata.data.code == 200) {
          that.setData({
            currentBid: resdata.data.data.bid, //修改当前组织名和组织Id
            currentOrgName: resdata.data.data.orgName,
            roleCode: resdata.data.data.roleCode,
          })
          if (that.data.curentRole === "2") {
            app.globalData.isShopMan = true
          } else {
            app.globalData.isShopMan = false
          }
          wx.setStorageSync('organId', resdata.data.data.bid)
        } else {
          console.error("getOrganization",resdata)
          wx.showToast({
            title: resdata.data.msg,
            icon: "none",
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: "系统错误",
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  //健康码，弹出窗
  codeOpen: function () {
    let that = this;
    that.setData({
      codeModal: true
    })
  },
  closecode: function () {
    let that = this;
    that.setData({
      codeModal: false
    })
  },
  // 弹出框，修改组织

  // 销售出现弹窗
  changeRole: function (e) {
    let that = this;
    that.setData({
      showModal: true
    })
    //查询所有去重复的绑定角色
    wx.request({
      url: urlApi.getRoleAllOrg(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        userrole: that.data.curentRole,
        openid: wx.getStorageSync("openid")
      },
      success: function (resdata) {
        if (resdata.data.code == 200) {
          that.setData({
            userRoleOrg: resdata.data.data
          })
          let userRoleOrg = that.data.userRoleOrg;
          for (let i = 0; i < userRoleOrg.length; i++) { //这部只是为了，将组织在页面上显示出来    
            if (userRoleOrg[i].bid === that.data.currentBid) {
              userRoleOrg[i].checked = "true"
              that.setData({
                userRoleOrg: userRoleOrg,
                pitchon: that.data.currentBid
              })
            }
          }
        } else {
          wx.showToast({
            title: resdata.data.msg,
            icon: "none",
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: "系统错误",
          icon: "none",
          duration: 2000
        })
      }
    })

  },
  ok: function () {
    let that = this;
    that.setData({
      showModal: false
    })
    if (that.data.pitchon == "" || that.data.pitchon == null) {
      $Message({
        content: "请正确选择角色"
      });
      return;
    }
    //这里要将新的bid带上openid带上userRole插入到后台去。
    //然后根据openid 和 userRole直接查history表，将最近的一条openid 和 userRole查出来。
    //数据渲染完成
    // console.log("bid   ————————————————   " + that.data.pitchon);
    wx.request({ //点击确定按钮，将选中的值存入到历史表中
      url: urlApi.insertRoleHistory(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: wx.getStorageSync('openid'),
        userrole: that.data.curentRole,
        bId: that.data.pitchon, //当前选中的组织

      },
      success: function (resdata) {
        if (resdata.data.code == 200) {
          that.getOrganization(that.data.curentRole);
        } else {
          wx.showToast({
            title: resdata.data.msg,
            icon: "none",
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: "系统错误",
          icon: "none",
          duration: 2000
        })
      }
    })

  },

  getGenderChange: function (e) { //radio点击事件
    let that = this;
    let rolelist = that.data.userRoleOrg;
    if (e.detail.value != null && e.detail.value != "") {
      that.setData({
        pitchon: e.detail.value,
      })
    }
  },
  scanOnclick: function () { //点击扫一扫触发事件
    var that = this;
    wx.scanCode({
      success: (res) => {

        var path = res.result
        //微信开发者工具 在开发者工具里出现乱码需要decodeURIComponent转义,真机不需要,可以直接使用
        path = path.split('?'); //分割字符串 path[0]等于pages/me/me,path[1]等于scene=table_id%3D8%26shop_id%3D1
        if (path == "undefined" || path == "" || path == null) {
          util.noService();
          return false;
        }
        var scene = path[1];
        if (scene == "undefined" || scene == "" || scene == null) {
          util.noService();
          return false;
        }
        scene = scene.split("&");
        if (scene == "undefined" || scene == "" || scene == null) {
          util.noService();
          return false;
        }
        var list = {};
        for (var i = 0; i < scene.length; i++) {
          var b = scene[i].split("=");
          list[b[0]] = b[1];
        }
        if (list.scanType == "undefined" || list.scanType == "" || list.scanType == null) {
          util.noService();
          return false;
        }
        if (list.scanType == "adduser") { //注册的入口 1
          that.userLogon(list);
        } else if (list.boxStart == "start") { //套盒扫描 1
          if (that.data.userRole == "4") {
            wx.showToast({
              title: "请联系店员使用服务",
              icon: "none",
              duration: 2000
            })
            return false;
          }
          that.userBoxScan(list);
        } else if (list.scanType == "affiliation") { //扫描销售二维码调用用户绑定接口，建立用户和商品绑定关系。 1
          that.affiliation(list);
        } else if (list.scanType == "addshop") { //验货收货确认接口 1
          that.addshopUser(list);
        } else if (list.scanType == "examine") { // 1
          if (that.data.userRole == "4") {
            wx.showToast({
              title: "请联系店员使用服务",
              icon: "none",
              duration: 2000
            })
            return false;
          } else {
            wx.showToast({
              title: "请使用收货功能进行操作",
              icon: "none",
              duration: 3000
            })
            return false;
          }
        } else if (list.scanType == "sysAddUser") { // 1
          that.sysAddUser(list);
        } else { //系统之外的二维码扫描
          let other = 0;
          util.noService();
        }
      }
    })
  },

  //套盒扫描事件
  userBoxScan: function (res) {
    let that = this;
    if (that.data.curentRole != 2 && that.data.curentRole != 3) {
      wx.showToast({
        title: "只有店员身份才能扫描",
        icon: "none",
        duration: 2000
      })
      return;
    }
    wx.request({ //openid请求后台，获取用户角色。
      url: urlApi.getBoxScan(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        boxIdentity: res.boxidentity,
        openid: wx.getStorageSync('openid'),
        bId: that.data.currentBid
      },
      success: function (resdata) {
        let sundata = resdata.data.data;
        if (resdata.data.code == 200) {
          if (sundata.boxIdentity == null) {
            wx.showToast({
              title: "当前门店无该套盒信息",
              icon: "none",
              duration: 2000
            })
            return;
          }
          wx.showToast({
            title: "扫描套盒成功",
            icon: "none",
            duration: 2000
          })
          wx.navigateTo({
            url: '../../pages/consumption/consumption?boxname=' + sundata.boxName + "&scanType=" + "affiliation" +
              "&time=" + sundata.projectDuration + "&affname=" + sundata.name + "&newboxId=" + sundata.newboxId +
              "&boxIdentity=" + sundata.boxIdentity + "&mangerOpenId=" + wx.getStorageSync('openid') + "&passBinding=" +
              sundata.passBinding + "&userTimes=" + sundata.userTimes + '&currentBid=' + that.data.currentBid
          })
        } else {
          wx.showToast({
            title: resdata.data.msg,
            icon: "none",
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: "扫描套盒出错",
          icon: "none",
          duration: 2000
        })
      }
    })
  },

  affiliation: function (res) { //顾客扫描店员生成的销售二维码
    let that = this;
    wx.request({ //openid请求后台，获取用户角色。
      url: urlApi.affiliationScan(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        boxId: res.boxId,
        openid: wx.getStorageSync('openid'),
        boxIdentity: res.boxIdentity,
        mangerOpenid: res.mangerOpenId,
        selectProject: res.selectProject
      },
      success: function (resdata) {
        if (resdata.data.code == 200) {
          wx.showToast({
            title: "扫描套盒成功",
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
      fail: function () {
        wx.showToast({
          title: "扫描套盒出错",
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  examine: function (exlist) { //验货收货确认接口
    let that = this;
    if (exlist.getType == "deviceType") { //设备收货
      wx.request({ //openid请求后台，获取用户角色。
        url: urlApi.scanExamine(),
        method: "post",
        header: {
          'content-type': 'application/json'
        },
        data: {
          deviceId: exlist.deviceId,
          openId: wx.getStorageSync('openid'),
          getType: exlist.getType
        },
        success: function (resdata) {
          if (resdata.data.code == 200) {
            wx.showToast({
              title: "收货成功",
              icon: "success",
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
        fail: function () {
          wx.showToast({
            title: "收货出错",
            icon: "none",
            duration: 2000
          })
        }
      })
    } else if (exlist.getType == "goodsType") { //商品发货
      wx.request({ //openid请求后台，获取用户角色。
        url: urlApi.scanExamine(),
        method: "post",
        header: {
          'content-type': 'application/json'
        },
        data: {
          goodsId: exlist.goodsId,
          boxId: exlist.boxId,
          openId: wx.getStorageSync('openid'),
          getType: exlist.getType
        },
        success: function (resdata) {
          if (resdata.data.code == 200) {
            wx.showToast({
              title: "收货成功",
              icon: "success",
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
        fail: function () {
          wx.showToast({
            title: "收货出错",
            icon: "none",
            duration: 2000
          })
        }
      })
    }
  },
  //体检报告
  report: function () {
    let that = this;
    let page = '/pages/reportCust/reportCust'
    if (that.data.curentRole == 2 || that.data.curentRole == 3) {
      //店长店员角色
      page = '/pages/report/report'
    }
    wx.navigateTo({
      url: page + '?curentRole=' + that.data.curentRole + '&currentBid=' + that.data.currentBid + '&sessionKey=' +
        encodeURIComponent(wx.getStorageSync('sessionKey')) + '&authentication=' + encodeURIComponent(that.data.authentication)
    })
  },
  //中控平台
  zhongkong: function () {
    let that = this;

    wx.navigateTo({
      url: '/pages/menuPage/menuPage?currentOrgName=' + that.data.currentOrgName + '&curentRole=' + that.data.curentRole + '&currentBid=' + that.data.currentBid + '&roleCode=' +
        that.data.roleCode
    })
  },
  // 采购商城
  mallShopping: function () {
    let that = this;
    wx.navigateTo({
      url: '/pages/shoppingMall/shop/index?currentOrgName' + that.data.currentOrgName + 'curentRole=' + that.data.curentRole + '&currentBid=' + that.data.currentBid + '&roleCode=' +
        that.data.roleCode
    })
  },
  // 健康测评
  healthEvaluation: function () {
    let that = this;
    wx.navigateTo({
      url: '/pages/HealthAssessment/healthDegree/healthDegree?currentOrgName' + that.data.currentOrgName + 'curentRole=' + that.data.curentRole + '&currentBid=' + that.data.currentBid + '&roleCode=' +
        that.data.roleCode
    })
  },

  getUser: function () {
    let that = this;
    let openid = wx.getStorageSync('openid');
    wx.request({ //openid请求后台，获取用户角色。
      url: urlApi.getUserDataByOpenId(),
      method: "post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        openid: openid != null && openid != "" ? openid : ' '
      },
      success: function (resdata) { //获取该用户的所有信息
        let ifAdd = resdata.data.data.ifAdd;
        if (resdata.data.code == 200) {
          if (ifAdd == "0") { //0为已注册，1为未注册 ,已注册的话显示他的 “健康码”
            wx.setStorageSync('userCode', resdata.data.data.userCode); //存储userCode
            wx.setStorageSync('userName', resdata.data.data.name); //存储userCode
            that.setData({
              newButton: resdata.data.data.userCode,
              authentication: resdata.data.data.authentication
            })
            if (that.data.curentRole == "4") {
              wx.setStorageSync('currentBid', resdata.data.data.bid); //存储bid
            } else {
              wx.setStorageSync('currentBid', ""); //存储bid
            }

          } else if (ifAdd == "1") { //未注册的话显示 "欢迎光临，新用户请注册" 
            that.setData({
              newButton: "欢迎光临，新用户请注册"
            })
            that.setData({
              ghostdisabled: true
            })
          }
        } else {
          wx.showToast({
            title: "页面信息加载失败",
            icon: "none",
            duration: 2000
          })
        }
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
  goodsReceiving: function () { //发货
    wx.navigateTo({
      url: '../../pages/goodsReceiving/goodsReceiving?currentBid=' + this.data.currentBid
    })
  },
  addshop: function () {
    wx.navigateTo({
      url: '../../pages/addshop/addshop?currentBid=' + this.data.currentBid
    })
  },
  newRegister: function () {
    wx.navigateTo({
      url: '../../pages/addcard/addcard?currentBid=' + this.data.currentBid
    })
  },
  /**
   * 店员注册
   */
  addshopUser: function (res) { //扫码添加店员
    let that = this;
    let openid = wx.getStorageSync('openid')
    if (openid == "" || openid == null || openid == undefined) {
      // wx.showToast({
      //   title: "请前往个人中心授权",
      //   icon: "none",
      //   duration: 3000
      // })
      wx.navigateTo({
        url: '/pages/login/login'
      })
      wx.setStorageSync('scanData', res);
      return false;
    }
    wx.request({
      url: urlApi.addshop(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        name: res.userName,
        sex: res.sex,
        phone: res.phone,
        adress: res.adress,
        openid: wx.getStorageSync('openid'),
        mangerAffiliationId: res.mangerAffiliationId,
        userRole: res.userRole,
        bId: res.currentBid,
        dates: res.dates,
        unionId: wx.getStorageSync('unionId') //获取unionId
      },
      success: function (resdata) {
        let ifAdd = resdata.data.data.ifAdd;
        if (resdata.data.code == 200) {

          if (ifAdd == "0") { //0为已注册，1为未注册
            wx.showToast({
              title: "请勿重复注册",
              icon: "none",
              duration: 2000
            })
            that.setData({
              newButton: "健康码：" + resdata.data.data.userCode
            });
          } else {
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              newButton: "健康码：" + resdata.data.data.userCode
            });
          }

        }
        //         else {

        // =======

        //           that.getRoleList();
        //           that.getUser();
        // } 
        else {

          // >>>>>>> 01f9a5720992d8837f38b2faf689fb5e1b9be4d7
          wx.showToast({
            title: "注册失败",
            icon: "none",
            duration: 2000
          })

        }
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
  goodsHistory: function () {
    wx.navigateTo({
      url: '../../pages/goods/goods?currentBid=' + this.data.currentBid
    })
  },
  sysAddUser: function (res) { //扫码添加后台人员，店长 渠道  代理
    let that = this;
    console.log("openid ===================", openid)
    let openid = wx.getStorageSync('openid')
    if (openid == "" || openid == null || openid == undefined) {
      // wx.showToast({
      //   title: "请前往个人中心授权",
      //   icon: "none",
      //   duration: 3000
      // })
      wx.navigateTo({
        url: '/pages/login/login'
      })
      wx.setStorageSync('scanData', res);
      return false;
    }
    wx.request({ //openid请求后台，获取用户角色。
      url: urlApi.insertWechatRole(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        addType: res.addType,
        userId: res.userId,
        openid: wx.getStorageSync('openid'),
        bId: res.bid,
        unionId: wx.getStorageSync('unionId') //获取unionId
      },
      success: function (resdata) {
        if (resdata.data.code == 200) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          that.getRoleList();
          that.getUser();
        } else {
          wx.showToast({
            title: resdata.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
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
  goodsDelivery: function () { //收货
    let that = this;
    wx.navigateTo({
      url: '/pages/goodsClosed/goodsClosed?currentBid=' + that.data.currentBid
    })
    // wx.scanCode({
    //   success: (res) => {
    //     console.log(res); //获取扫码后的数据
    //     var path = res.result
    //     //微信开发者工具 在开发者工具里出现乱码需要decodeURIComponent转义,真机不需要,可以直接使用
    //     path = path.split('?');   //分割字符串 path[0]等于pages/me/me,path[1]等于scene=table_id%3D8%26shop_id%3D1
    //     var scene = path[1];
    //     scene = scene.split("&");
    //     var exlist = {};
    //     for (var i = 0; i < scene.length; i++) {
    //       var b = scene[i].split("=");
    //       exlist[b[0]] = b[1];
    //     }
    //     if (exlist.scanType == "undefined" || exlist.scanType == "" || exlist.scanType == null) {
    //       util.noService();
    //       return false;
    //     }
    //     if (exlist.scanType == "examine") { //验货收货确认接口
    //       that.examine(exlist);
    //     } else { //系统之外的二维码扫描
    //       let other = 0;
    //       wx.showToast({
    //         title: "扫描服务指令不存在",
    //         icon: "none",
    //         duration: 2000
    //       })
    //     }
    //   }
    // })
  },

  /**
   * 用户注册
   */
  userLogon: function (res) {
    var that = this;
    let openid = wx.getStorageSync('openid')
    if (openid == "" || openid == null || openid == undefined) {
      // wx.showToast({
      //   title: "请前往个人中心授权",
      //   icon: "none",
      //   duration: 3000
      // })
      wx.navigateTo({
        url: '/pages/login/login'
      })
      wx.setStorageSync('scanData', res);
      return false;
    }
    wx.request({
      url: urlApi.addWcUserData(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        vcode: res.vCode, //手机验证码
        name: res.userName,
        sex: res.sex,
        phone: res.phone,
        adress: res.adress,
        openid: openid,
        mangerAffiliationId: res.mangerAffiliationId,
        userRole: res.userRole,
        bId: res.currentBid,
        dates: res.dates,

        unionId: wx.getStorageSync('unionId'), //获取unionId
        userImgUrl: wx.getStorageSync('userImgUrl')
      },
      success: function (resdata) {

        let scanData = wx.getStorageSync('scanData');
        if (scanData != null && scanData != "" && scanData != undefined) {
          wx.setStorageSync("scanData", null);
        }
        if (resdata.data.code == 200) {
          let ifAdd = resdata.data.data.ifAdd;
          if (ifAdd == "0") { //0为已注册，1为未注册
            wx.showToast({
              title: "请勿重复注册",
              icon: "none",
              duration: 2000
            })
            that.setData({
              newButton: "健康码：" + resdata.data.data.userCode
            });
          } else {
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 2000
            })
            that.getUser()
            that.setData({
              newButton: "健康码：" + resdata.data.data.userCode
            });

          }

        } else {
          wx.showToast({
            title: resdata.data.msg,
            icon: "none",
            duration: 2000
          })
        }
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

  getAuto: function () {
    wx.login({
      success: function (loginres) {
        //获取用户信息
        wx.getUserInfo({
          lang: "zh_CN",
          success: function (userRes) {
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
              success: function (result) {

                var data = result.data.data.userInfo;
                wx.setStorageSync("userInfoData", data);
                wx.setStorageSync('openid', data.openId); //存储openid
                wx.setStorageSync('unionId', data.unionId); //存储unionId
                wx.setStorageSync('sessionKey', result.data.data.sessionKey); //存储unionId
                wx.setStorageSync('userImgUrl', data.avatarUrl);
                //url获取
                wx.request({
                  url: urlApi.updateImgUrlByOpenid(),
                  header: {
                    "Content-Type": "application/json"
                  },
                  data: {
                    openid: wx.getStorageSync("openid"),
                    userImgUrl: result.data.data.avatarUrl
                  },
                  method: 'post',
                  //服务端的回掉
                  success: function (result) {


                  }
                })

                //token获取
                wx.request({
                  url: urlApi.getWechatToken() + wx.getStorageSync('openid'),
                  header: {
                    "Content-Type": "application/json"
                  },
                  method: 'GET',
                  //服务端的回掉
                  success: function (result) {

                    wx.setStorageSync("token", result.data.data);

                  }
                })
              }
            })
          }
        })
      }
    })

    let that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({

          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
      // 查看是否授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                //用户已经授权过
                //that.gotoMain();
              }
            })
          }
        }
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
      this.setData({
        upverpass: false
      })
    }
  },
  onShareAppMessage: function (options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "祺邦健康小程序分享", // 默认是小程序的名称(可以写slogan等)
      path: '/pages/home/home', // 默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: 'https://health.qbjiankang.com/cureimg/fenxiang.png', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {}
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function () {
        // 转发结束之后的回调（转发成不成功都会执行）
      }
    };

    // 返回shareObj
    return shareObj;
  },
  //客户绑定
  firstStartService: function () {

    let that = this;

    wx.scanCode({
      success: (res) => {

        var path = res.result
        //微信开发者工具 在开发者工具里出现乱码需要decodeURIComponent转义,真机不需要,可以直接使用
        path = path.split('?'); //分割字符串 path[0]等于pages/me/me,path[1]等于scene=table_id%3D8%26shop_id%3D1
        var scene = path[1];
        scene = scene.split("&");
        var firstlist = {};
        for (var i = 0; i < scene.length; i++) {
          var b = scene[i].split("=");
          firstlist[b[0]] = b[1];
        }

        if (firstlist.scanType == "examine" && firstlist.otherType == "deliverGoods") {
          wx.showToast({
            title: "扫描设备 “包装” 二维码成功",
            icon: "none",
            duration: 2000
          })
          wx.setStorageSync('deviceId', firstlist.deviceId);
        } else if (firstlist.scanType == "deviceId") { //设备启动二维码
          wx.showToast({
            title: "扫描设备 “界面” 二维码成功",
            icon: "none",
            duration: 2000
          })
          wx.setStorageSync('deviceIdentity', firstlist.deviceIdentity);
        }

        let deviceId = wx.getStorageSync('deviceId');
        let deviceIdentity = wx.getStorageSync('deviceIdentity');

        if (deviceIdentity != "" && deviceIdentity != null && deviceId != null && deviceId != "") {
          wx.request({
            url: urlApi.bindDevice(),
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': wx.getStorageSync("token")
            },
            method: 'POST',
            data: {

              bid: that.data.currentBid
            },
            //服务端的回掉
            success: function (result) {
              //清空值
              if (result.data.code == 200) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: result.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
              wx.setStorageSync('deviceIdentity', '');
              wx.setStorageSync('deviceId', '');
              let deviceId = '';
              let deviceIdentity = '';
            }
          })
        }
      }
    })
  },
  //测评报告
  healthResult() {
    wx.navigateTo({
      url: '/pages/HealthAssessment/evaluationReport/index',
    })
  },
  //话术助手
  huashuxunlian() {
    let that = this
    wx.navigateTo({
      url: '/pages/colloquialism/colloquialism?currentOrgName=' + that.data.currentOrgName + '&curentRole=' + that.data.curentRole + '&currentBid=' + that.data.currentBid + '&roleCode=' + that.data.roleCode
    })
  },
  //到点预约
  shopAppointment() {
    let that = this
    wx.navigateTo({
      url: '/pages/customerAppointment/customerAppointment?currentOrgName=' + that.data.currentOrgName + '&curentRole=' + that.data.curentRole + '&currentBid=' + that.data.currentBid + '&roleCode=' + that.data.roleCode
    })
  },

})