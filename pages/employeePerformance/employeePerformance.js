// 团队业绩
var loadMoreView, page
const http = require('../../utils/http')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personnel:0,
    personnelList:["所有员工","1212"],
    items:[
      {type:'套盒产品',number:'211113431'},
      {type:'套盒产品',number:'23431'},
      {type:'门店月租',number:'23431'},
      {type:'产品销售',number:'23431'},
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 0
    var that = this
    loadMoreView = that.selectComponent("#loadMoreView");
    this.loadData(true)
  
  },
  bindPickerChange:function (e) {
    console.log(e.detail.value)
    this.setData({
      personnel:e.detail.value
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  bindscrolltolower: function () {
    console.log(111)
    loadMoreView.loadMore()
  },

  loadData: function(showLoading) {
    let openid = wx.getStorageSync('openid');
    var that = this
    http.post({
      url: `/api-wechat/wechatbox/deviceScan`,
      showLoading: showLoading,
      data: {
        openId: openid != null && openid != "" ? openid : ' '
      },
      success: (res)=>{
        console.error(res)
          var items = that.data.items
          if(page == 0) {
            items = res.datas
            wx.stopPullDownRefresh()
          } else {
            items = items.concat(res.datas)
          }
          that.setData({
            items: items,
          })
          loadMoreView.loadMoreComplete(res)
      },
      fail: ()=> {
        console.error("fail")
        if(page!=0) {
          loadMoreView.loadMoreFail() 
        }
      }
    })
  },
  loadMoreListener: function(e) {
    page += 1
    this.loadData(false)
  },
  clickLoadMore: function(e) {
    this.loadData(false)
  },

})