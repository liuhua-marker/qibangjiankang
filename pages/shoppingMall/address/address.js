var app = getApp();
var util = require('../../../utils/util.js');
const http = require('../../../utils/http')
const api = require('../../../utils/server.api.js')

Page({
  data: {
    addressList: [],
  },

  onLoad: function (options) {
    console.log(options)
    if (options.orderAdd != '' && options.orderAdd != 0) {
      this.setData({
        orderAdd: options.orderAdd
      });
    }
    // 页面显示
    this.getAddressList();
  },
  onShow: function(){
    this.getAddressList();
  },
  getAddressList() {
    let that = this;
    http.post({
      url: api.AddressList(that.data.orderId),
      showLoading: true,
      data: {
        pageSize: 20,
        page: 1
      },
      success: (res) => {
        console.log(res)
        // if (res.data.code !== 200) {
        //   wx.showToast({
        //     title: res.data.msg,
        //     icon: 'none'
        //   })
        //   return
        // }
        that.setData({
          addressList: res.data.rows
        });
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.requestMall(api.AddressList,{pageSize:20,page:1},"POST").then(function (res) { 
    //     that.setData({
    //       addressList: res.data.rows
    //     }); 
    // });
  },
  gotoUrl:function(event){
    if(this.data.orderAdd == 1){
      this.selectAddress(event)
    }else{
      this.addressAddOrUpdate(event)
    }
  },
  addressAddOrUpdate(event) {
    console.log(event)
    console.log(this.data.orderAdd)
    wx.navigateTo({
      url: '/pages/shoppingMall/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
    });
  },
  selectAddress(event) {
    var itemIndex = event.currentTarget.dataset.itemIndex;
    console.log('itemIndex',itemIndex)
    console.log('addressList',this.data.addressList)
    var address = this.data.addressList[itemIndex];
    console.log('address',address)
    if (wx.getStorageSync("buyData")) {
      console.log(decodeURIComponent(json));
      var json = JSON.parse(wx.getStorageSync("buyData"));
      json.address = address;
      wx.setStorageSync("buyData", JSON.stringify(json))
      console.info("json:" + JSON.stringify(json));
    }
    //var addressId = event.currentTarget.dataset.addressId;
    //选择该收货地址
    wx.navigateTo({
      url: '../checkout/checkout'
    });
  },
  deleteAddress(event){
    console.log(event.target)
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success: function (res) {
        if (res.confirm) {
          let addressId = event.target.dataset.addressId;
          http.get({
            url: api.AddressDelete(addressId),
            showLoading: true,
            data: { id: addressId },
            success: (res) => {
              console.log(res)
              // if (res.data.code !== 200) {
              //   wx.showToast({
              //     title: res.data.msg,
              //     icon: 'none'
              //   })
              //   return
              // }
              wx.showToast({
                title: res.data,
                icon:"none"
              })
              that.getAddressList();
          
            },
            fail: () => {
              console.error("fail")
            }
          })
          console.log('用户点击确定')
        }
      }
    })
    return false;
    
  },

})