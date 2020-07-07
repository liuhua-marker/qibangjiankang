// pages/userRecharge/recharge/index.js
const api = require('../../../utils/server.api.js')
const http = require('../../../utils/http')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: '0.00',
    value1: [],
    value2: [],
    bankName: {},
    dataSave: {
      accountNumber: "",
      name: "",
      openid: "",
      organId: 0,
      rechargePeople: "",
      rechargeVoucher: "",
      type: "",
      value: "",
      voucherType: ''
    },
    array: [],
    classify: [{
      value: '500',
      disabled: true,
      checked: false
    }, {
      value: '1000',
      disabled: true,
      checked: false
    }, {
      value: '2000',
      disabled: true,
      checked: false
    }, {
      value: '3000',
      disabled: true,
      checked: false
    }, {
      value: '5000',
      disabled: true,
      checked: false
    }, {
      value: '',
      disabled: false,
      code: '其他金额',
      checked: false
    }],
    showOneButtonDialog: false,
    isTrue: false,
    timeOut: '',
    oneButton: [{
      text: '我已知晓',
      disabled: true
    }],
    notice: ['1、目前祺邦健康暂未开通线上直接充值',
      '2、仅支持线下自主转账，线上提交充值申请',
      '3、当前已开通的官方充值账号如下:'
    ],
    bankAccount: [],
    noticeBank: {},
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否第一次进入页面
    let rechargeData = wx.getStorageSync('recharge') - 0 + 1
    wx.setStorage({
      key: "recharge",
      data: rechargeData
    })
    // console.log(wx.getStorageSync('userName'))
    this.data.dataSave.rechargePeople = wx.getStorageSync('userInfo').nickName
    this.data.dataSave.openid = wx.getStorageSync('openid')
    this.data.dataSave.organId = wx.getStorageSync('organId')
    // 获取初始数据
    http.post({
      url: api.walletaccountInfo(), //页面账号信息
      showLoading: true,
      data: {organId: this.data.dataSave.organId},
      success: (res) => {
        this.data.dataSave.organId = res.data.data.organId
        this.data.dataSave.name = res.data.data.organName
        this.data.dataSave.rechargePeople = res.data.data.acountName
        this.setData({
          balance: res.data.data.amount
        })
      },
      fail: () => {
        console.error("fail")
      }
    })
    http.post({
      url: api.picturemessage(), //获取银行名称
      showLoading: true,
      data: {},
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            array: res.data.data
          })
        }
      },
      fail: () => {
        console.error("fail")
      }
    })
    http.get({
      url: api.queryOfficialAcount(), //官方充值账号
      showLoading: true,
      data: {},
      success: (res) => {
        if (res.data.code == 200) {
          this.setData({
            bankAccount: res.data.data,
            noticeBank: res.data.data[0]
          })
        }
      },
      fail: () => {
        console.error("fail")
      }
    })
    let that = this
    var index = 5
    var i = 0
    if (wx.getStorageSync('recharge') == 1) {
      this.setData({
        showOneButtonDialog: true,
        timeOut: timeTem
      })
    } else {
      this.setData({
        showOneButtonDialog: false
      })
      index = 0
    }
    clearInterval(this.data.timeOut)
    let timeTem = setInterval(() => {
      if (index > 0) {
        index = index - 1
        let text = '我已知晓  ' + index + 's'
        that.setData({
          oneButton: [{
            text: text,
            disabled: true
          }]
        })
      } else {
        clearInterval(timeTem)
        that.setData({
          oneButton: [{
            text: '我已知晓',
            disabled: false
          }]
        })
      }
    }, 1000)

    let noticeTime = setInterval(() => {
      if (i < this.data.bankAccount.length) {
        i = i + 1
      } else {
        i = 0
      }
      this.setData({
        noticeBank: this.data.bankAccount[i]
      })
    }, 10000)
  },
  handleDialog() {
    this.setData({
      showOneButtonDialog: true
    })
  },
  //点击radio-group中的列表项事件
  radioChange: function (res) {
    var arrs = this.data.classify;
    var that = this;
    for (const x in arrs) {
      if (arrs[x].value == res.detail.value) {
        this.data.dataSave.value = res.detail.value
        arrs[x].checked = true;
      } else {
        arrs[x].checked = false;
      }
    }
    that.setData({
      classify: arrs
    })
  },
  bindIpt: function (e) {
    if (e.detail.value > 0) {
      this.data.dataSave.value = e.detail.value
    } else {
      this.setData({
        classify: this.data.classify
      })
      wx.showToast({
        title: '金额必须大于0',
        icon: 'none',
        duration: 2000
      })
    }

  },
  // 提交充值申请
  sumbmit: function (e) {
    this.data.dataSave.type = this.data.bankName.code
    this.data.dataSave.accountNumber = this.data.account?this.data.account.acountNum:''
    this.data.dataSave.organId  = wx.getStorageSync('organId')
    if (!this.data.dataSave.value) {
      wx.showToast({
        title: '请选择充值金额',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.dataSave.type) {
      wx.showToast({
        title: '请选择您的支付方式',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.dataSave.accountNumber) {
      wx.showToast({
        title: '请选择您转入的账户',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.dataSave.rechargeVoucher && !this.data.dataSave.voucherType) {
      wx.showToast({
        title: '请上传订单截图或者订单流水',
        icon: 'none',
        duration: 2000
      })
      return
    }
    http.post({
      url: api.rechargeauditSave(),
      showLoading: true,
      data: this.data.dataSave,
      success: (res) => {
        if (res.data.code === 200) {
          wx.navigateTo({
            url: "/pages/userRecharge/rechargeCompleted/index"
          })
          this.refreshData()
        }
      },
      fail: () => {
        console.error("fail")
      }
    })
  },
  // 充值记录
  recharge: function () {
    wx.navigateTo({
      url: "/pages/userRecharge/rechargeRecord/index"
    })
    this.refreshData()
  },
  refreshData() {
    this.setData({
      dataSave: {
        accountNumber: "",
        name: "",
        organId: 0,
        rechargePeople: "",
        rechargeVoucher: "",
        type: "",
        value: "",
        voucherType: ''
      },
      classify: [{
        value: '500',
        disabled: true,
        checked: false
      }, {
        value: '1000',
        disabled: true,
        checked: false
      }, {
        value: '2000',
        disabled: true,
        checked: false
      }, {
        value: '3000',
        disabled: true,
        checked: false
      }, {
        value: '5000',
        disabled: true,
        checked: false
      }, {
        value: '',
        disabled: false,
        code: '其他金额',
        checked: false
      }],
      bankName: {},
      account: {},
      uploaderList: [],
      uploaderNum: 0,
      showUpload: true
    })
  },
  // 你的支付方式
  bindPickerChange: function (e) {
    this.setData({
      bankName: this.data.array[e.detail.value[0]],
      value1: e.detail.value
    })
    // this.data.dataSave.type = this.data.array[e.detail.value[0]].code
  },
  // 你转入的账户
  accountPickerChange(e) {
    this.setData({
      account: this.data.bankAccount[e.detail.value[0]],
      value2: e.detail.value
    })
    // this.data.dataSave.accountNumber = this.data.bankAccount[e.detail.value[0]].acountNum
  },
  // 订单流水
  voucherType(e) {
    if (e.detail.value.length === 19) {
      this.data.dataSave.voucherType = e.detail.value
    } else {
      wx.showToast({
        title: '请输入19位订单流水号',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 删除图片
  clearImg: function (e) {
    var nowList = []; //新数据
    var uploaderList = this.data.uploaderList; //原数据

    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        continue;
      } else {
        nowList.push(uploaderList[i])
      }
    }
    this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      uploaderList: nowList,
      showUpload: true
    })
    this.data.dataSave.rechargeVoucher = ''
  },
  //展示图片
  showImg: function (e) {
    var that = this;
    wx.previewImage({
      urls: that.data.uploaderList,
      current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
  },
  //上传图片
  upload: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        let uploaderList = that.data.uploaderList.concat(tempFilePaths);
        if (uploaderList.length == 1) {
          that.setData({
            showUpload: false
          })
        }
        wx.showLoading({
          title: '图片上传中',
        })
        wx.uploadFile({
          url: api.picturemessageSave(), //此处换上你的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
          
          },
          formData: {},
          success: function (res) {
            console.log(res)
            wx.hideLoading()
            var imgs = JSON.parse(res.data)
           
            if (imgs.code === 200) {
              that.setData({
                uploaderList: uploaderList,
                uploaderNum: uploaderList.length,
              })
              let  dataSave = that.data.dataSave
              dataSave.rechargeVoucher = imgs.data;
              that.setData({
                dataSave:dataSave
              })
            }
          },
          fail:function(){
            wx.hideLoading()
          }
        })
      }
    })
  },
  // 弹框
  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
  },
  // 复制账号
  copyBankAccount(e) {
    wx.setClipboardData({
      data: e.target.dataset.account
    })
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