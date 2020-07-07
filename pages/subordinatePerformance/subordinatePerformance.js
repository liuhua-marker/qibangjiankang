// pages/salesAnalysis/salesAnalysis.js
var loadMoreView, page
const http = require('../../utils/http')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personnel: 0,
    date: 0,
    dateList: [{
      label: '今日交易',
      value: 0
    }, {
      label: '昨日交易',
      value: 1
    }, {
      label: '前日交易',
      value: 2
    }, {
      label: '近七天交易',
      value: 7
    }, {
      label: '近三十天交易',
      value: 30
    }],
    personnelList: [{
      name: "所有成员",
      org_id: ''
    }],
    items: [],
    dialogFlag: false,
    dialogItems: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 0
    var that = this
    this.setData({
      currentOrgName: options.currentOrgName,
      currentBid: options.currentBid,
      roleCode: options.roleCode,
      isShow:options.isShow
    })
    loadMoreView = that.selectComponent("#loadMoreView");
    this.loadPersonalData()
    this.loadTopData()
    this.loadData(true)
  },
  // 今日交易下拉框
  PickerChangeDate: function (e) {
    this.setData({
      date: e.detail.value
    })
    this.loadData(true)
    this.loadTopData(true)
  },
  bindPickerChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      personnel: e.detail.value
    })
    this.loadData(true)
    this.loadTopData(true)
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
  loadData: function (showLoading) {
    let openid = wx.getStorageSync('openid');
    var that = this
    let params = {
 
      "whereValue":{
        organId: wx.getStorageSync('organId'),
        // orgName: that.data.name,
        day: that.data.dateList[that.data.date].value,
      }
  } 
  if(that.data.personnelList[that.data.personnel].name=== '所有成员'){
    params.code ='20054'
  }else{
    params.code ='20055'
    params.whereValue.organId = that.data.personnelList[that.data.personnel].org_id
  }
    http.post({
      showLoading: showLoading,
      data: params,
      success: (res) => {
        console.log(res.data)
        var items = that.data
        if (page == 0) {
          items = res.data
          wx.stopPullDownRefresh()
        } else {
          items = items.concat(res.data)
        }
        that.setData({
          items: items,
        })
        if (loadMoreView) {
          loadMoreView.loadMoreComplete(res)
        }

      },
      fail: () => {
        console.error("fail")
        if (page != 0) {
          loadMoreView.loadMoreFail()
        }
      }
    })
  },
  loadTopData: function (showLoading) {
    let openid = wx.getStorageSync('openid');
    var that = this
    let params = {
      code:"20052",
        "whereValue":{
          organId: wx.getStorageSync('organId'),
          // orgName: that.data.name,
          day: that.data.dateList[that.data.date].value,
   
        }
    } 
    if(that.data.personnelList[that.data.personnel].name=== '所有成员'){

    }else{
      params.whereValue.organId = that.data.personnelList[that.data.personnel].org_id
    }

    http.post({
      showLoading: showLoading,
      data:params ,
      success: (res) => {
        console.log(res)
        this.setData({
          total: res.data[0].sep_value || 0,
          totalMoney: res.data[0].pay_all_value || 0,
          orderNum: res.data[0].order_num || 0,
        })
      },
      fail: () => {
        console.error("fail")
      }
    })
  },
  loadPersonalData: function (showLoading) {
    let openid = wx.getStorageSync('openid');
    var that = this
    http.post({
      showLoading: showLoading,
      data: {
        "code": "20027",
        "whereValue": {
          organId: that.data.currentBid,
        }
      },
      success: (res) => {
        var personnelList = [{
          name: "所有成员",
          org_id: ''
        }]
        personnelList = personnelList.concat(res.data)
        that.setData({
          personnelList: personnelList
        })
        console.log(res)
      },
      fail: () => {
        console.error("fail")
      }
    })
  },
  loadDialogData: function (showLoading) {
    let openid = wx.getStorageSync('openid');
    var that = this
    http.post({
      showLoading: showLoading,
      data: {
        "code": "20056",
        "whereValue": {
          organId:that.data.personnelList[that.data.personnel].org_id, 
          // day: that.data.dateList[that.data.date].value,
          proxyId:that.data.proxyId,
          orderId: that.data.orderId
        }
      },
      success: (res) => {
        console.log(res.data)
       that.setData({
        dialogItems:res.data
       })

      },
      fail: () => {
        console.error("fail")
      
      }
    })
  },
  loadMoreListener: function (e) {
    page += 1
    this.loadData(false)
  },
  clickLoadMore: function (e) {
    this.loadData(false)
  },
  showDialog: function (e) {
    console.log(e)
    
    this.setData({
      dialogFlag: true,
      orderId:e.currentTarget.dataset.orderid,
      proxyId:e.currentTarget.dataset.proxyid
    })
    this.loadDialogData(true)
  },
  closeDialog: function () {
    this.setData({
      dialogFlag: false
    })
  }
})