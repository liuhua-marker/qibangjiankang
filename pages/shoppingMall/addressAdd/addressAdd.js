var util = require('../../../utils/util.js');
const http = require('../../../utils/http')
const api = require('../../../utils/server.api.js')
var app = getApp();
Page({
  data: {
    address: {
      id: '',
      provinceId: 0,
      name: '',
      cityId: 0,
      areaId: 0,
      address: '',
      full_region: '',
      userName: '',
      telNumber: '',
      isdefault: 'n'
    },
    addressId: 0,
    openSelectRegion: false,
    selectRegionList: [{
        id: 0,
        name: '省份',
        parentId: 0,
        type: 1
      },
      {
        id: 0,
        name: '城市',
        parentId: 0,
        type: 2
      },
      {
        id: 0,
        name: '区县',
        parentId: 0,
        type: 3
      }
    ],
    regionType: 1,
    regionList: [],
    selectRegionDone: false
  },
  bindinputMobile(event) {
    let address = this.data.address;
    address.phone = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputName(event) {
    let address = this.data.address;
    address.name = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputAddress(event) {
    let address = this.data.address;
    address.address = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindIsDefault() {
    let address = this.data.address;
    address.isdefault = this.data.address == "y" ? "n" : "y";
    this.setData({
      address: address
    });
  },
  getAddressDetail() {
    let that = this;
    if (that.data.addressId) {
      http.get({
        url: api.AddressDetail(),
        showLoading: true,
        data: {
          id: that.data.addressId
        },
        success: (res) => {
          // if (res.data.code !== 200) {
          //   wx.showToast({
          //     title: res.data.msg,
          //     icon: 'none'
          //   })
          //   return
          // }
          res.data.full_region = res.data.province + res.data.city + res.data.area
          if (res.data) {
            that.setData({
              address: res.data
            });
          }
        },
        fail: () => {
          console.error("fail")
        }
      })
      // util.requestMall(api.AddressDetail, {
      //   id: that.data.addressId
      // }).then(function (res) {
      //   console.log(res.data);

      //   res.data.full_region = res.data.province + res.data.city + res.data.area
      //   if (res.data) {
      //     that.setData({
      //       address: res.data
      //     });
      //   }
      // });
    }
  },
  setRegionDoneStatus() {
    let that = this;
    let doneStatus = that.data.selectRegionList.every(item => {
      return item.id != 0;
    });
    that.setData({
      selectRegionDone: doneStatus
    })
  },
  chooseRegion() {
    let that = this;
    this.setData({
      openSelectRegion: !this.data.openSelectRegion
    });
    //设置区域选择数据
    let address = this.data.address;
    if (address.provinceId > 0 && address.cityId > 0 && address.areaId > 0) {
      let selectRegionList = this.data.selectRegionList;
      selectRegionList[0].id = address.provinceId;
      selectRegionList[0].name = address.province;
      selectRegionList[0].parentId = 0;

      selectRegionList[1].id = address.cityId;
      selectRegionList[1].name = address.city;
      selectRegionList[1].parentId = address.provinceId;

      selectRegionList[2].id = address.areaId;
      selectRegionList[2].name = address.area;
      selectRegionList[2].parentId = address.cityId;
      this.setData({
        selectRegionList: selectRegionList,
        regionType: 3
      });
      this.getRegionList(address.cityId);
    } else {
      this.setData({
        selectRegionList: [{
            id: 0,
            name: '省份',
            parentId: 0,
            type: 1
          },
          {
            id: 0,
            name: '城市',
            parentId: 0,
            type: 2
          },
          {
            id: 0,
            name: '区县',
            parentId: 0,
            type: 3
          }
        ],
        regionType: 1
      })
      this.getRegionList(0);
    }
    this.setRegionDoneStatus();
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    if (options.id != '' && options.id != 0) {
      this.setData({
        addressId: options.id
      });
      this.getAddressDetail();
    }
    if (options.orderAdd != '' && options.orderAdd != 0) {
      this.setData({
        orderAdd: options.orderAdd
      });
    }
    this.getRegionList(0);
  },
  onReady: function () {

  },
  selectRegionType(event) {
    let that = this;
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    let selectRegionList = that.data.selectRegionList;
    //判断是否可点击
    if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex - 1].id <= 0)) {
      return false;
    }
    this.setData({
      regionType: regionTypeIndex + 1
    })
    let selectRegionItem = selectRegionList[regionTypeIndex];
    this.getRegionList(selectRegionItem.parentId);
    this.setRegionDoneStatus();
  },
  selectRegion(event) {
    let that = this;
    let regionIndex = event.target.dataset.regionIndex;
    let regionItem = this.data.regionList[regionIndex];
    let regionType = regionItem.type;
    let selectRegionList = this.data.selectRegionList;
    selectRegionList[regionType - 1] = regionItem;
    if (regionType != 3) {
      this.setData({
        selectRegionList: selectRegionList,
        regionType: regionType + 1
      })
      this.getRegionList(regionItem.id);
    } else {
      this.setData({
        selectRegionList: selectRegionList
      })
    }
    //重置下级区域为空
    selectRegionList.map((item, index) => {
      if (index > regionType - 1) {
        item.id = 0;
        item.name = index == 1 ? '城市' : '区县';
        item.parentId = 0;
      }
      return item;
    });
    this.setData({
      selectRegionList: selectRegionList
    })
    that.setData({
      regionList: that.data.regionList.map(item => {
        //标记已选择的
        if (that.data.regionType == item.type && that.data.selectRegionList[that.data.regionType - 1].id == item.id) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        return item;
      })
    });
    this.setRegionDoneStatus();
  },
  doneSelectRegion() {
    if (this.data.selectRegionDone === false) {
      return false;
    }
    let address = this.data.address;
    let selectRegionList = this.data.selectRegionList;
    address.provinceId = selectRegionList[0].id;
    address.cityId = selectRegionList[1].id;
    address.areaId = selectRegionList[2].id;
    address.province = selectRegionList[0].name;
    address.city = selectRegionList[1].name;
    address.area = selectRegionList[2].name;
    address.full_region = selectRegionList.map(item => {
      return item.name;
    }).join('');
    this.setData({
      address: address,
      openSelectRegion: false
    });
  },
  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });
  },
  getRegionList(regionId) {
    let that = this;
    let regionType = that.data.regionType;
    http.get({
      url: api.RegionList(),
      showLoading: true,
      data: {
        parentId: regionId
      },
      success: (res) => {
        // if (res.data.code !== 200) {
        //   wx.showToast({
        //     title: res.data.msg,
        //     icon: 'none'
        //   })
        //   return
        // }
        that.setData({
          regionList: res.data.map(item => {
            //标记已选择的
            if (regionType == item.type && that.data.selectRegionList[regionType - 1].id == item.id) {
              item.selected = true;
            } else {
              item.selected = false;
            }
            return item;
          })
        });
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.requestMall(api.RegionList, { parentId: regionId }).then(function (res) {
    //     that.setData({
    //       regionList: res.data.map(item => {
    //         //标记已选择的
    //         if (regionType == item.type && that.data.selectRegionList[regionType - 1].id == item.id) {
    //           item.selected = true;
    //         } else {
    //           item.selected = false;
    //         }
    //         return item;
    //       })
    //     }); 
    // });
  },
  cancelAddress() {
    wx.navigateBack()
  },
  saveAddress() {
    let that = this;
    console.log(this.data.address)
    let address = this.data.address;
    if (address.name == '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return false;
    }
    if (address.phone == '') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return false;
    }
    if (!util.validatePhone(address.phone)) {
      wx.showToast({
        title: '请输入正确手机号码',
        icon: 'none'
      })
      return false;
    }
    if (address.areaId == 0) {
      wx.showToast({
        title: '请输入省市区',
        icon: 'none'
      })
      return false;
    }
    if (address.address == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return false;
    }
    http.put({
      url: api.AddressSave(),
      showLoading: true,
      data: {
        id: address.id,
        name: address.name,
        phone: address.phone,
        provinceId: address.provinceId,
        cityId: address.cityId,
        areaId: address.areaId,
        isdefault: address.isdefault,
        province: address.province,
        city: address.city,
        area: address.area,
        address: address.address,
      },
      success: (res) => {
        // if (res.data.code !== 200) {
        //   wx.showToast({
        //     title: res.data.msg,
        //     icon: 'none'
        //   })
        //   return
        // }
        console.log('orderAdd', that.data.orderAdd)
        if (that.data.orderAdd) {
          if (wx.getStorageSync("buyData")) {
            console.log(decodeURIComponent(json));
            var json = JSON.parse(wx.getStorageSync("buyData"));
            json.address = address;
            wx.setStorageSync("buyData", JSON.stringify(json))
            console.info("json:" + JSON.stringify(json));
            wx.redirectTo({
              url: '../checkout/checkout',
            })
          }
        } else {
          wx.navigateBack({
            url: '../address/address',
          })
        }
        wx.hideLoading();
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.requestMall(api.AddressSave, {
    //   id: address.id,
    //   name: address.name,
    //   phone: address.phone,
    //   provinceId: address.provinceId,
    //   cityId: address.cityId,
    //   areaId: address.areaId,
    //   isdefault: address.isdefault,
    //   province: address.province,
    //   city: address.city,
    //   area: address.area,
    //   address: address.address,
    // }, 'PUT').then(function (res) {
    //   if (that.data.orderAdd) {
    //     if (wx.getStorageSync("buyData")) {
    //       console.log(decodeURIComponent(json));
    //       var json = JSON.parse(wx.getStorageSync("buyData"));
    //       json.address = address;
    //       wx.setStorageSync("buyData", JSON.stringify(json))
    //       console.info("json:" + JSON.stringify(json));
    //       wx.redirectTo({
    //         url: '../checkout/checkout',
    //       })
    //     }
    //   } else {
    //     wx.navigateBack({
    //       url: '../address/address',
    //     })
    //   }
    // });
  }
})