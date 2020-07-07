// pages/colloquialism/colloquialism.js
var loadMoreView, page
var util = require('../../utils/util.js');
const http = require('../../utils/http')
const api = require('../../utils/server.api.js')

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0,
    items: [],
    loadingData: [],
    isShopMan: null,
    complateData: [],
    endData: [],
    height: 200,
  },
  onLoad: function (options) {
    page = 0
    let that = this
    loadMoreView = that.selectComponent("#loadMoreView");
    // this.loadData()
    console.log('options', options)
    console.log('isShopMan', app.globalData.isShopMan)
    this.setData({
      tabIndex: app.globalData.isShopMan ? "0" : "1",
      isShopMan: app.globalData.isShopMan
    })
    if (!that.data.isShopMan) {
      that.setData({
        height: 100
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    // page = 0
    let that = this
    loadMoreView = that.selectComponent("#loadMoreView");
    this.reFreshData()
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    page = 0
    let that = this
    loadMoreView = that.selectComponent("#loadMoreView");
    this.reFreshData()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
  bindscrolltolower(){
    console.log(111)
    loadMoreView.loadMore()
  },
  loadData: function (showLoading) {
    // let openid = wx.getSpeechcraftpackage('openid');
    page++
    let pageSize = 20
    var that = this
    http.get({
      url: api.querySpeechcraftByOrganId(),
      showLoading: showLoading,
      data: {
        organId: wx.getStorageSync('organId'),
        pageSize:pageSize,
        pageNo:page
      },
      success: (res) => {
        console.error(res)
        var items = that.data.items
        if (page == 1) {
          items = res.data.data
          wx.stopPullDownRefresh()
        } else {
          items = items.concat(res.data.data)
        }
        that.setData({
          items: items,
        })
        // this.selectComponent("#drop-down-card'").updateData(items)
        console.log(items)
 
        loadMoreView.loadMoreComplete({total:res.data.total,pageSize:pageSize,pageNo:page})
      },
      fail: () => {
        console.error("fail")
        if (page != 0) {
          loadMoreView.loadMoreFail()
        }
      }
    })
  },
  // 店员可执行数据
  getLoadingData: function (showLoading) {
    let openid = wx.getStorageSync('openid') || 'owZ044851AyU7SAA_6CKpXWIA5sI';
    var that = this
    http.get({
      url: api.getSpeechcraftByUserId(openid),
      showLoading: showLoading,
      data: {},
      success: (res) => {
        console.error(res)

        that.setData({
          loadingData: res.data.data,
        })
        // this.selectComponent("#drop-down-card'").updateData(items)

        // loadMoreView.loadMoreComplete(res)
      },
      fail: () => {
        console.error("fail")
        // if(page!=0) {
        //   loadMoreView.loadMoreFail() 
        // }
      }
    })
  },
  // 已安排及可执行
  getPlanAndPackage(showLoading, type) {
    let openid = wx.getStorageSync('openid');
    var that = this
    let params = {
      type: type,
      organId: wx.getStorageSync('organId'),
    }
    if (this.data.tabIndex === '1') {
      params.userId = openid
    }!that.data.isShopMan ? params.userId = openid : null
    http.get({
      url: api.getPlanAndPackage(),
      showLoading: showLoading,
      data: params,
      success: (res) => {
        console.error(res)
        let loadingData = []
        if (res.data.code === 200) {
          let _data = res.data.data
          if (this.data.tabIndex === '1') {
            _data.map((item, packageIndex) => {
              item.speechcraftVO.map((itemSpeech, personalIndex) => {
                loadingData.push({
                  name: itemSpeech.packageName,
                  packageId: itemSpeech.packageId,
                  planId: itemSpeech.planId,
                  speechcraftPackagePlanEntities: [itemSpeech]
                })
              })
            })
            that.setData({
              loadingData: loadingData,
            })
          } else {
            let complateData = []
            complateData = _data.map((item, packageIndex) => {
              return {
                name: item.userName,
                // packageId:itemSpeech.packageId,
                // planId:itemSpeech.planId,
                speechcraftRuleEntityList: [{}],
                speechcraftRuleEntityLists: item.speechcraftVO.map((itemSpeech, personalIndex) => {
                  return {
                    organId: item.organId,
                    ...itemSpeech,
                    name: itemSpeech.packageName || itemSpeech.name,
                    packageIndex: packageIndex,
                    personalIndex: personalIndex,
                    userId: item.userId
                  }
                })
              }

            })
            let data = {}
            data[this.data.tabIndex === '2' ? 'complateData' : 'endData'] = complateData
            this.setData(data)
            console.log('complateData', that.data.complateData)
            console.log('endData', that.data.endData)
          }


        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

        // this.selectComponent("#drop-down-card'").updateData(items)

        // loadMoreView.loadMoreComplete(res)
      },
      fail: () => {
        console.error("fail")
        // if(page!=0) {
        //   loadMoreView.loadMoreFail() 
        // }
      }
    })
  },
  queryPackage: function (showLoading) {
    let openid = wx.getStorageSync('openid');
    var that = this
    http.post({
      url: api.queryIng(),
      showLoading: showLoading,
      data: {
        userId: wx.getStorageInfoSync('openId')
      },
      success: (res) => {
        console.error(res)
        let complateData = []
        if (res.data.code === 200) {
          complateData = res.data.data.map((item, packageIndex) => {
            return {
              name: item.packageName || "--",
              speechcraftRuleEntityList: item.speechcraftTrainLogBOS.map((itemSpeech, personalIndex) => {
                return {
                  name: itemSpeech.userName,
                  openId: itemSpeech.openId,
                  packageId: item.packageId,
                  packageIndex: packageIndex,
                  personalIndex: personalIndex
                }
              }),
              packageId: item.packageId,
              planId: item.planId
            }
          })
          that.setData({
            complateData: complateData,
          })
          console.log(that.data.complateData)
        }

        // this.selectComponent("#drop-down-card'").updateData(items)

        // loadMoreView.loadMoreComplete(res)
      },
      fail: () => {
        console.error("fail")
        // if(page!=0) {
        //   loadMoreView.loadMoreFail() 
        // }
      }
    })
  },

  dropDown(e) {
    console.log(e)
    let dropData = e.detail
    console.log(dropData)
    let complateData = this.data.complateData;
    if (dropData.isShow) {
      return
    }
    let params = {
      planId: dropData.planId,
      packageId: dropData.packageId,
      userId: dropData.userId,
      // organId:dropData.organId,
    }
    http.post({
      url: api.queryIng(),
      showLoading: true,
      data: params,
      success: (res) => {
        console.error('getSpeechcraftinit', res)
        console.error('complateData', complateData[dropData.packageIndex])
        complateData[dropData.packageIndex].speechcraftRuleEntityLists[dropData.personalIndex].speechcraftPackagePlanEntities = res.data.data[0].speechcraftInitEntitys;
        this.setData({
          complateData: complateData
        })
        console.error('complateData', this.data.complateData)
        console.log('#dropdown' + dropData.packageIndex + '_' + dropData.personalIndex)
        this.selectComponent('#dropdown' + dropData.packageIndex + '_' + dropData.personalIndex).setSpeechData()
      },
      fail: (err) => {
        console.error("通过话术id获取话术详情fail", err)

      }
    })

  },
  dropDownold(e) {
    console.log(e)
    let dropData = e.detail
    console.log(dropData)
    let complateData = this.data.endData;
    console.log(complateData)
    if (dropData.isShow) {
      return
    }
    let params = {
      planId: dropData.planId,
      packageId: dropData.packageId,
      userId: dropData.userId,
      // organId:dropData.organId,
    }
    http.post({
      url: api.queryend(),
      showLoading: true,
      data: params,
      success: (res) => {
        console.error('getSpeechcraftinit', res)
        console.error('complateData', complateData[dropData.packageIndex])
        console.error('complateData1', complateData[dropData.packageIndex].speechcraftRuleEntityList[dropData.personalIndex])
        if(res.data.data&&res.data.data.length>0){
          complateData[dropData.packageIndex].speechcraftRuleEntityLists[dropData.personalIndex].speechcraftPackagePlanEntities = res.data.data[0].speechcraftInitEntitys;
          this.setData({
            endData: complateData
          })
          console.log('complateData2',complateData)
          this.selectComponent('#dropdownold' + dropData.packageIndex + '_' + dropData.personalIndex).setSpeechData()
        }
       
      },
      fail: (err) => {
        console.error("通过话术id获取话术详情fail", err)

      }
    })

  },
  loadMoreListener: function (e) {
    page += 1
    this.loadData(false)
  },
  reFreshData: function () {
    console.log('reFreshData', this.data.tabIndex)
    switch (this.data.tabIndex) {
      case '0': {
        page = 0
        this.loadData(true)
        break
      }
      case '1': {
        this.getPlanAndPackage(true, '')
        break
      }
      case '2': {
        this.getPlanAndPackage(true, 'new')
        break
      }
      case '3': {
        this.getPlanAndPackage(true, 'old')
        break
      }

    }
  },
  handleTab: function (e) {
    console.log(e)
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
    this.reFreshData()
  },
  distribution: function () {
    wx.navigateTo({
      url: '../distribution/distribution',
    })
  }
})