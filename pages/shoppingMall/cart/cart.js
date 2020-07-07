var util = require('../../../utils/util.js');
const http = require('../../../utils/http')
const api = require('../../../utils/server.api.js')

var app = getApp();

Page({
  data: {
    picPath: api.picPath,
    picStyle: api.picStyle(),
    cartGoods: [],
    cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    isEditCart: false,
    checkedAllStatus: true,
    editCartList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },

  onShow: function (options) {
    // 页面显示
    this.getCartList();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  getCartList: function (showLoading) {
    let that = this;
    http.get({
      url: api.CartIndex(),
      showLoading: showLoading,
      data: {},
      success: (res) => {
        console.log('res', res)
        // if (res.data.code !== 200) {
        //   wx.showToast({
        //     title: res.data.msg,
        //     icon: 'none'
        //   })
        //   return
        // }
        that.setData({
          cartGoods: res.data.item,
          'cartTotal.checkedGoodsCount': res.data.checkCount,
          'cartTotal.checkedGoodsAmount': res.data.amount
        });
        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.requestMall(api.CartIndex).then(function (res) {
    //   if (res.statusCode == 200) {
    //     console.log(res.data);
    //     that.setData({
    //       cartGoods: res.data.item,
    //       'cartTotal.checkedGoodsCount': res.data.checkCount,
    //       'cartTotal.checkedGoodsAmount': res.data.amount
    //     });
    //   }

    //   that.setData({
    //     checkedAllStatus: that.isCheckedAll()
    //   });
    // });
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.checked && element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },
  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;
    console.log(that.data.cartGoods)
    if (!this.data.isEditCart) {
      http.put({
        url: api.CartChecked(),
        showLoading: true,
        data: {
          productIds: that.data.cartGoods[itemIndex].product,
          specIds: that.data.cartGoods[itemIndex].spec,
          checked: that.data.cartGoods[itemIndex].checked ? false : true
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
            'cartGoods': res.data.item,
            'cartTotal.checkedGoodsCount': res.data.checkCount,
            'cartTotal.checkedGoodsAmount': res.data.amount
          });
          that.setData({
            checkedAllStatus: that.isCheckedAll()
          });
        },
        fail: () => {
          console.error("fail")
        }
      })
      // util.requestMall(api.CartChecked, {
      //   productIds: that.data.cartGoods[itemIndex].product,
      //   specIds: that.data.cartGoods[itemIndex].spec,
      //   checked: that.data.cartGoods[itemIndex].checked ? false : true
      // }, 'PUT').then(function (res) {
      //   if (res.statusCode == 200) {
      //     console.log(res.data);
      //     that.setData({
      //       'cartGoods': res.data.item,
      //       'cartTotal.checkedGoodsCount': res.data.checkCount,
      //       'cartTotal.checkedGoodsAmount': res.data.amount
      //     });
      //   }

      //   that.setData({
      //     checkedAllStatus: that.isCheckedAll()
      //   });
      // });
    } else {
      //编辑状态
      let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
        if (index == itemIndex) {
          element.checked = !element.checked;
        }

        return element;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  getCheckedGoodsCount: function () {
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.number;
      }
    });
    console.log(checkedGoodsCount);
    return checkedGoodsCount;
  },
  checkedAll: function () {
    let that = this;
    console.log(this.data.isEditCart)
    if (!this.data.isEditCart) {
      var productIds = this.data.cartGoods.map(function (v) {
        return v.product;
      });
      var specIds = this.data.cartGoods.map(function (v) {
        return v.spec;
      });
      http.put({
        url: api.CartChecked(),
        showLoading: true,
        data: {
          productIds: productIds.join(','),
          checked: that.isCheckedAll() ? false : true,
          specIds: specIds.join(',')
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
            productIds: productIds.join(','),
            checked: that.isCheckedAll() ? false : true,
            specIds: specIds.join(',')
          });
          that.setData({
            'cartGoods': res.data.item,
            'cartTotal.checkedGoodsCount': res.data.checkCount,
            'cartTotal.checkedGoodsAmount': res.data.amount
          });
          that.setData({
            checkedAllStatus: that.isCheckedAll()
          });
        },
        fail: () => {
          console.error("fail")
        }
      })
      // util.requestMall(api.CartChecked, {
      //     productIds: productIds.join(','),
      //     checked: that.isCheckedAll() ? false : true,
      //     specIds: specIds.join(',')
      //   },
      //   'PUT').then(function (res) {
      //   if (res.statusCode == 200) {
      //     console.log(res.item);
      //     that.setData({
      //       'cartGoods': res.data.item,
      //       'cartTotal.checkedGoodsCount': res.data.checkCount,
      //       'cartTotal.checkedGoodsAmount': res.data.amount
      //     });
      //   }

      //   that.setData({
      //     checkedAllStatus: that.isCheckedAll()
      //   });
      // });
    } else {
      //编辑状态
      let checkedAllStatus = that.isCheckedAll();
      let tmpCartData = this.data.cartGoods.map(function (v) {
        v.checked = !checkedAllStatus;
        return v;
      });
      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  editCart: function () {
    var that = this;
    console.log(this.data.isEditCart)
    if (this.data.isEditCart) {
      this.getCartList();
      this.setData({
        isEditCart: !this.data.isEditCart
      });
    } else {
      //编辑状态
      let tmpCartList = this.data.cartGoods.map(function (v) {
        v.checked = false;
        return v;
      });
      this.setData({
        editCartList: this.data.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.data.isEditCart,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  toIndexPage: function () {
    wx.navigateTo({
      url: "/pages/shoppingMall/shop/index"
    });
  },
  updateCart: function (product, spec, number, id) {
    console.log('==========update===========');
    let that = this;
    http.put({
      url: api.CartUpdate(),
      showLoading: true,
      data: {
        productId: product,
        specId: spec,
        number: number
      },
      success: (res) => {
        console.log(res)
        if (res.data.code !== 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return
        }
        that.setData({
          productIds: productIds.join(','),
          checked: that.isCheckedAll() ? false : true,
          specIds: specIds.join(',')
        });
        that.setData({
          'cartGoods': res.data.item,
          'cartTotal.checkedGoodsCount': res.data.checkCount,
          'cartTotal.checkedGoodsAmount': res.data.amount
        });
        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.requestMall(api.CartUpdate, {
    //   productId: product,
    //   specId: spec,
    //   number: number
    // }, 'PUT').then(function (res) {
    //   if (res.statusCode == 200) {
    //     console.log(res.data);
    //     that.setData({
    //       'cartGoods': res.data.item,
    //       'cartTotal.checkedGoodsCount': res.data.checkCount,
    //       'cartTotal.checkedGoodsAmount': res.data.amount
    //     });
    //   }

    //   that.setData({
    //     checkedAllStatus: that.isCheckedAll()
    //   });
    // });

  },
  cutNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
    cartItem.number = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.product, cartItem.spec, number);
  },
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = cartItem.number + 1;
    cartItem.number = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(cartItem.product, cartItem.spec, number);
  },
  checkoutOrder: function () {
    //获取已选择的商品
    let that = this;
    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (checkedGoods.length <= 0) {
      return false;
    }
    var productIds = checkedGoods.map(function (element, index, array) {
      if (element.checked == true) {
        return element.product;
      }
    });

    var specIds = checkedGoods.map(function (element, index, array) {
      if (element.checked == true) {
        return element.spec;
      }
    });
    http.put({
      url: api.CartOrder(),
      showLoading: true,
      data: {
        productIds: productIds.join(','),
        specIds: specIds.join(',')
      },
      success: (res) => {
        console.log('cart',res)
        // if (res.data.code !== 200) {
        //   wx.showToast({
        //     title: res.data.msg,
        //     icon: 'none'
        //   })
        //   return
        // }
        wx.setStorageSync("buyData", JSON.stringify(res.data));
        wx.navigateTo({
          url: '../checkout/checkout'
        })
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.requestMall(api.CartOrder, {
    //   productIds: productIds.join(','),
    //   specIds: specIds.join(',')
    // }, 'PUT').then(function (res) {
    //   if (res.statusCode == 200) {
    //     console.log(res.data);
    //     wx.setStorageSync("buyData", JSON.stringify(res.data));
    //     wx.navigateTo({
    //       url: '../checkout/checkout'
    //     })
    //   }
    // });
  },
  deleteCart: function () {
    //获取已选择的商品
    let that = this;

    let productData = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  
    if (productData.length <= 0) {
      wx.showToast({
        title: '请选择需要操作的商品',
        icon:'none'
      })
      return false;
    }

    var productIds = productData.map(function (element, index, array) {
      if (element.checked == true) {
        return element.product;
      }
    });

    var specIds = productData.map(function (element, index, array) {
      if (element.checked == true) {
        return element.spec;
      }
    });
    http.put({
      url: api.CartDelete(),
      showLoading: true,
      data: {
        productIds: productIds.join(','),
        specIds: specIds.join(',')
      },
      success: (res) => {
        console.log(res)
        // let cartList = res.data.cartList.map(v => {
        //   console.log(v);
        //   v.checked = false;
        //   return v;
        // });

        that.setData({
          'cartGoods': res.data.item,
          'cartTotal.checkedGoodsCount': res.data.checkCount,
          'cartTotal.checkedGoodsAmount': res.data.amount
        });

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.requestMall(api.CartDelete, {
    //   productIds: productIds.join(','),
    //   specIds: specIds.join(',')
    // }, 'PUT').then(function (res) {
    //   if (res.statusCode == 200) {
    //     console.log(res.data);
    //     // let cartList = res.data.cartList.map(v => {
    //     //   console.log(v);
    //     //   v.checked = false;
    //     //   return v;
    //     // });

    //     that.setData({
    //       'cartGoods': res.data.item,
    //       'cartTotal.checkedGoodsCount': res.data.checkCount,
    //       'cartTotal.checkedGoodsAmount': res.data.amount
    //     });
    //   }

    //   that.setData({
    //     checkedAllStatus: that.isCheckedAll()
    //   });
    // });
  }
})