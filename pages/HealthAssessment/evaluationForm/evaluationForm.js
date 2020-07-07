// pages/HealthAssessment/evaluationForm/evaluationForm.js
const api = require('../../../utils/server.api.js')
const http = require('../../../utils/http')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionBtn: '生成报告',
    subject: {},
    intro: '',
    subjects: [],
    show: true,
    disabled: true,
    percent: 1,
    page: 1,
    total: 0,
    heath: {},
    result: {
      createBy: '',
      nickName: '',
      storeId:'',
      evalType:'',
      phone:'',
      id: 0,
      intro: '',
      name: '',
      phone: 0,
      qbEvalNaireScoreVos: []}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    http.post({
      url: api.qbEvalBuild(),
      showLoading: true,
      data: {
        id: options.id
      },
      success: (res) => {
        let total = res.data.data[0].qbEvalQuestionsVoList.length
        if (res.data.code == 200) {
          that.data.result.id = res.data.data[0].id
          that.data.result.name = res.data.data[0].name
          that.data.result.intro = res.data.data[0].intro
          that.data.result.evalType = res.data.data[0].evalType
          wx.setNavigationBarTitle({
            title: that.data.result.name,
          })
          that.setData({
            intro: res.data.data[0].intro,
            total: total,
            subjects: res.data.data[0].qbEvalQuestionsVoList,
            percent: that.data.page / total * 100,
            subject: res.data.data[0].qbEvalQuestionsVoList[0]
          })
        }
      },
      fail: () => {
        console.error("fail")
      }
    })
    // wx.getStorage({
    //   key: 'userInfoData',
    //   success(val) {
    //     that.data.result.createBy = val.data.openId
    //     that.data.result.nickName = wx.getStorageSync('userName')
    //   }
    // })
    that.data.result.createBy = options.openid || wx.getStorageSync('openid')
    that.data.result.nickName = options.userName || wx.getStorageSync('userName')
    that.data.result.bid =  options.bid||wx.getStorageSync('currentBid') ||  wx.getStorageSync('organId')
  },
  //点击radio-group中的列表项事件
  radioChange: function(res) {
    var arrs = this.data.subject;
    var that = this;
    for (const x in arrs.qbEvalOptionVoList) {
      if (arrs.qbEvalOptionVoList[x].option == res.detail.value) {
        arrs.qbEvalOptionVoList[x].select = true;
        this.data.result.qbEvalNaireScoreVos[this.data.page - 1] = { id: this.data.subjects[this.data.page - 1].id,sort: 'Q' + this.data.page, score: arrs.qbEvalOptionVoList[x].score, optionId: arrs.qbEvalOptionVoList[x].id }
        this.setData({
          disabled: false
        })
      } else {
        arrs.qbEvalOptionVoList[x].select = false;
      }
    }
    that.setData({
      subject: arrs,
    })
  },
  // 上一题
  lastQuestion() {
    this.setData({
      page: this.data.page - 1,
      subject: this.data.subjects[this.data.page - 2 ],
      percent: (this.data.page - 1) / this.data.total * 100,
      disabled: false
    })
  },
  // 下一题
  nextQuestion() {
    let that = this
    if (this.data.result.qbEvalNaireScoreVos.length - 1 < this.data.page) {
      this.setData({ disabled: true })
    } else {
      this.setData({ disabled: false })
    }
    this.setData({
      subject: this.data.subjects[this.data.page],
      page: this.data.page + 1,
      percent: (this.data.page + 1) / this.data.total * 100,
    })
    if (this.data.result.evalType == 1) {
      this.setData({ questionBtn: '生成报告' })
    } else {
      this.setData({ questionBtn: '完成' })
    }
  },
  // 生成报告
  questionResult(e) {
    this.data.result.storeId =  wx.getStorageSync('currentBid') ||  wx.getStorageSync('organId')
    http.post({
      url: api.commitQbEvalNaireVo(),
      showLoading: true,
      data: this.data.result,
      success: (val) => {
        // console.log(val.data.data)
        this.data.heath = val.data.data
        if (this.data.result.evalType == 1) {
          wx.setStorageSync("healthResult",val.data.data)
          wx.redirectTo({
            url: '/pages/HealthAssessment/healthResult/index',
            success: function (res) {
              // 通过eventChannel向被打开页面传送数据
           
              // res.eventChannel.emit('acceptDataFromOpenerPage', { data: val.data.data })
            }
          })
         
        } else {
          wx.navigateBack()
        }
        
      },
      fail: () => {
        console.error("fail")
      }
    })
  },
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

  }
})