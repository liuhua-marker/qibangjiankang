// pages/menuPage/menuPage.js
const http = require('../../utils/http')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentOrgName: '',
    income: '',
    profit: '',
    shop_num: '',
    btnList: [{
        label: '销售分析',
        path: '../salesAnalysis/salesAnalysis'
      },
      {
        label: '签约门店',
        path: '../contractedStore/contractedStore'
      },
      {
        label: '团队业绩',
        path: '../subordinatePerformance/subordinatePerformance'
      },
      // {
      //   label: '团队管理',
      //   path: '../teamManagement/teamManagement'
      // },
      {
        label: '利润发放',
        path: '../profitDistribution/profitDistribution'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 添加参数
    console.error('options.roleCode',options)
    var isSHow='true'
    if (options.curentRole === '6') {
      isSHow=''
      this.setData({
        btnList: [{
            label: '销售分析',
            path: '../salesAnalysis/salesAnalysis'
          },
          // {
          //   label: '直属管理',
          //   path: '../teamManagement/teamManagement'
          // },
          {
            label: '签约门店',
            path: '../contractedStore/contractedStore'
          },
          {
            label: '业绩报表',
            path: '../subordinatePerformance/subordinatePerformance'
          }
        ]
      })
    }
    var btnList = this.data.btnList
    btnList.forEach(item => {
      item.path = item.path + '?currentBid=' + options.currentBid + '&roleCode=' + options.roleCode+'&isShow='+isSHow
    })
    this.setData({
      currentOrgName: options.currentOrgName,
      currentBid: options.currentBid,
      roleCode: options.roleCode,
      btnList: btnList
    })
    this.loadData()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.loadData()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
  loadData: function () {
    var openid = wx.getStorageSync('openid');
    var that = this
    http.post({
      showLoading: true,
      data: {
        "code": "20047",
        "whereValue": {
          organId: wx.getStorageSync('organId'),
          // "organId": 1252896451223093248
        }
      },
      success: (res) => {
        this.setData(res.data[0])
      },
      fail: () => {
        console.error("fail")
      }
    })
  }
})