var QR = require("../../utils/qrcode.js");
const urlApi = require('../../utils/server.api.js')
const util = require("../../utils/util.js")
var order = ['red', 'yellow', 'blue', 'green', 'red']
const http = require('../../utils/http')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: "",
    caseDate: "",
    sex: "",
    age: '',
    phone: '',
    caseId: "",
    normal: [{}],
    storageIntroduce: true,
    adviseList: [],//小程序返回的建议
    noticeList: [],//小程序返回的注意事项
    marketList: [],//小程序返回的销售推荐。
    preceptList: [],//小程序返回的方案信息
    servicehsList: [],//服务话术描述
    currentCase: {},//点击当前案例
    imgArr: [],
    'cant': 'none',
    'cantbt': 'none',
    'canone': '',
    'cantone': 'hover',
    'cantthree': '',
    'hidden': 'block',
    'threevi': 'none',
    downAdress:'',//PDF下载地址
    policyTag:[],//组合标准结果
    ctTag:[],//当前选中的组合标准结果
    shareDisplay:true,//分享权限判断
    shareType:'',//判断进入此页面的方式类型，
    dialogFlag:false,
    isManage:false,  //是否管控开关
    shareMangement:'', // 分享后是否需要管控,
    expirationTime:''  // 过期时间
  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },

  previewImg: function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.index;
    let downList = e.currentTarget.dataset.downlist;
    let imgArr = [];
    for (let i = 0; i < downList.length; i++) {
      imgArr.push(downList[i].downUrl)
    }
    console.log(downList);
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    that.setData({
      caseId: decodeURIComponent(options.caseId),
      downAdress:decodeURIComponent(options.downadress),
      shareType:options.shareType,
      headImg:decodeURIComponent(options.headImg),
      bid:options.bid,
      openid:options.openid,
      isShopMan:getApp().globalData.isShopMan,
    })
    if(options.shareType == "share"){
      that.setData({
        shareDisplay:false,
        shareMangement:options.isManage,
        expirationTime:options.date
      })
    }
  },
  onShow:function(){
    let that = this
    if(!that.data.shareDisplay){
      console.log("openId",wx.getStorageSync('openid'))
      // 设置7天过期
      if(parseInt(that.data.expirationTime)+7*24*60*60*1000<new Date().getTime()){
        wx.showModal({
          title: '温馨提示',
          content: '该分享已过期',
          showCancel:false,
          confirmText:'去首页',
          success (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/home/home'
              })
            } 
          }
        })
       
        return
      }
      if(!wx.getStorageSync('openid')){
        wx.navigateTo({
          url: '/pages/login/login?page=treatment',
        })
        return
      }
      that.getControlStatus()
      return
    
    }
    this.getCurePrecept()
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
            this.getCurePrecept()
          } else if (ifAdd == "1") { //未注册的话显示 "欢迎光临，新用户请注册" 
          wx.showModal({
            title: '温馨提示',
            content: '欢迎光临，新用户请注册',
            showCancel:false,
            confirmText:'去首页',
            success (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/home/home'
                })
              } 
            }
          })
          return
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
  // 获取管控状态
  getControlStatus(options){
    var that = this
    http.post({
      url: urlApi.passJurisdiction(),
      showLoading: false,
      data: {
        bId:that.data.bid,
        openId:wx.getStorageSync('openid')
      },
      success: (res) => {
        console.error(res)
        if (res.data.code === 200) {
          if(res.data.data){
            // 管控状态
            this.getCurePrecept()

          }else{
            wx.showModal({
              title: '温馨提示',
              content: '当前用户没有访问该页面权限',
              showCancel:false,
              confirmText:'去首页',
              success (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '/pages/home/home'
                  })
                } 
              }
            })
          }
        }else{
          console.error('获取管控状态',res.data)
        }
       

      },
      fail: (err) => {
        console.error("getControlStatus",err)
      }
    })
  },
     //caseId请求后台，获取本次体检信息（姓名、体检时间、关联平台的标准结果数据等等...）
  getCurePrecept(options){
    let that = this
    util.loading();
 
    wx.request({
      url: urlApi.getCurePrecept(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        caseId: that.data.caseId,
        bid:wx.getStorageSync('organId')||"1195187080846639104"
      },
      success: function (resdata) {
        let rdata = resdata.data.data;
        console.log(rdata);
        if(resdata.data.code === 200){
          that.setData({
            userName: rdata.name,
            caseDate: rdata.setTime,
            normal: rdata.precept || [],
            sex: rdata.sex,
            age: rdata.age,
            phone: rdata.phone,
            policyTag:rdata.policyTag
          })
          
        }else{
          that.setData({
            normal: [],
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
        that.setData({
          normal: [],
        })
        util.closeload();
      }
    })
  },
  //标准结果的点击事件
  storageIntroduce(e) {
    let that = this;
    console.log(e)
    let index = e.currentTarget.dataset.index;//获取当前的下标
    let normal = that.data.normal;//获取标准结果list的值
    if (normal[index].pullDown != true) {
      normal[index].pullDown = true;
    } else {
      for (let i = 0; i < normal.length; i++) {
        normal[i].pullDown = true;
      }
      normal[index].pullDown = false;
    }
    that.setData({
      normal: normal
    })
    // //根据标准结果Id，获取健康建议、注意事项、销售推荐
    // wx.request({
    //   url: urlApi.getNormDetail() +normal[index].id,
    //   method: "GET",
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (resdata) {
    //     let rdata = resdata.data.data;
    //     console.log(rdata);

    //      that.setData({
    //       adviseList:rdata.advise,//小程序返回的建议
    //       noticeList:rdata.market,//小程序返回的注意事项
    //       marketList:rdata.notice,//小程序返回的销售推荐。
    //       preceptList:rdata.precept,//小程序返回的方案信息
    //      })
    //   },
    //   fail: function () {
    //     wx.showToast({
    //       title: "请求失败",
    //       icon: "none",
    //       duration: 2000
    //     })
    //   }
    // })
  },
  goNormal(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;//获取当前的下标
    let ctNormal = e.currentTarget.dataset.normal;//获取当前标准结果对象
    
    console.log('goNormal','../../pages/normal/normal?ctNormal=' + encodeURIComponent(JSON.stringify(ctNormal) )
    + "&listNormal=" + encodeURIComponent(JSON.stringify(that.data.normal))
    + "&userName=" + encodeURIComponent(this.data.userName)
    + "&phone=" + encodeURIComponent(this.data.phone) 
    + "&index=" + encodeURIComponent(index)+ "&headImg=" + encodeURIComponent(that.data.headImg) + "&bid=" + encodeURIComponent(that.data.bid) 
    + "&openid=" + encodeURIComponent(that.data.openid));
    wx.navigateTo({
      url: '../../pages/normal/normal?ctNormal=' + encodeURIComponent(JSON.stringify(ctNormal) )
        + "&listNormal=" + encodeURIComponent(JSON.stringify(that.data.normal))
        + "&userName=" + encodeURIComponent(this.data.userName)
        + "&phone=" + encodeURIComponent(this.data.phone) 
        + "&index=" + encodeURIComponent(index)+ "&headImg=" + encodeURIComponent(that.data.headImg) + "&bid=" + encodeURIComponent(that.data.bid) 
        + "&openid=" + encodeURIComponent(that.data.openid) 
    })
  },
  goPolicyTag(e){
    let that = this;
    let index = e.currentTarget.dataset.index;//获取当前的下标
    let ctTag = e.currentTarget.dataset.tag;//获取当前组合标准结果对象
    console.log(ctTag);
    wx.navigateTo({
      url: '../../pages/policyTag/policyTag?ctTag=' + encodeURIComponent(JSON.stringify(ctTag)) 
           + "&listpolicyTag=" + encodeURIComponent(JSON.stringify(that.data.policyTag)) 
          + "&userName=" + encodeURIComponent(this.data.userName)
        + "&phone=" + encodeURIComponent(this.data.phone)
    })
  },
  servicehs(e) {
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
        serviceId: serviceId
      },
      success: function (reponse) {
        console.log(reponse);
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

  cant: function (e) {
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
  cantbt: function (e) {
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
  checkboxChange: function (e) {
    console.log(e.detail.value)
  },
  //pdf页跳转
  downReport: function (e) {
    let that = this;
      
    wx.navigateTo({
      url: '../../pages/casehtml/casehtml?caseId=' + encodeURIComponent(that.data.caseId) ,
      // success:function() {
      // },       //成功后的回调；
      // fail:function() { 
      //   console.log('--------shibai-------')
      // },         //失败后的回调；
      // complete:function() { }      //结束后的回调(成功，失败都会执行)
    })
    // let Path = "/images/pdfview.pdf";
    // let aurl = "https://health.qbjiankang.com/pdf/" + that.data.downAdress;
    // console.log(aurl);
    // wx.downloadFile({
    //   url: aurl,
    //   success: function (res) {
    //     console.log(res)
    //     var Path = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
    //     wx.openDocument({
    //       filePath: Path,
    //       fileType: "pdf",
    //       success: function (res) {
    //         console.log('打开成功');
    //       }
    //       ,
    //       fail: function (res) {
    //         console.log(res);
    //       }
    //     })
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   }
    // })
  },
  countDown: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
 var that = this
    http.post({
      url: api.getAppointmentMsgVo(),
      showLoading: showLoading,
      data: {
        // openId:wx.getStorageSync('openid')
        openId: wx.getStorageSync('openid'),
        storeId:wx.getStorageSync('organId'),
      },
      success: (res) => {
        console.error(res)
        if (res.data.code === 500) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            mask: true,
            duration: 2500
          })
          return
        }
        that.setData({
          allData: res.data.data,
        })

      },
      fail: () => {
        console.error("fail")
      }
    })
  },
  updateControlStatus(){
    var that = this
    http.post({
      url: urlApi.updateControlStatus(),
      showLoading: false,
      data: {
        id: wx.getStorageSync('organId'),
        controlStatus:that.data.isManage?"1":"0",
      },
      success: (res) => {
        console.error(res)
        if (res.data.code === 500) {
          console.error('管控接口异常',res.data.msg)
          return
        }
       this.setData({
         dialogFlag:false
       })

      },
      fail: (err) => {
        console.error("管控接口异常",err)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function( options ){
   
    let isManage=''
    // if(this.data.dialogFlag){
    //   // 如果是店长点击了管控
    //  this.updateControlStatus()
    //   isManage= this.data.isManage?true:''
    // }
    console.log('isManage',isManage)
    　　var that = this;
    　　// 设置菜单中的转发按钮触发转发事件时的转发内容
    　　var shareObj = {
    　　　　title: "祺邦健康体检案例分享",        // 默认是小程序的名称(可以写slogan等)
    　　　　path: '/pages/treatment/treatment?caseId=' +encodeURIComponent( that.data.caseId) + "&downadress=" +encodeURIComponent( that.data.downAdress) + "&shareType=share"+'&date='+new Date().getTime()+'&bid='+that.data.bid,      // 默认是当前页面，必须是以‘/’开头的完整路径
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
    },
    closeDialog: function () {
      this.setData({
        dialogFlag: false
      })
    },
    openDialog(){
      this.setData({
        dialogFlag: true
      })
    },
    switch1Change(e){
      this.setData({
        isManage:e.detail.value
      })
    }
})