const http = require('../../../utils/http')
const api = require('../../../utils/server.api.js')
var loadMoreView, page
// const api = require('../../../config/api.js');
// const user = require('../../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    current: {},
    picPath: api.picPath,
    picStyle: api.picStyle(),
    advertList: [],
    newGoods: [],
    hotGoods: [],
    topics1: {},
    topics2: {},
    topics3: {},
    skill: [],
    number: 1,
    group: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: [],
    goodsCount: 0,
    goodsAmount: '0',
    openAttr: false,
    // picPath: util.picPath(),
    checkedSpecText: '请选择规格数量',
    checkedSpecPrice: 0,
    goodsList: [],
    catalog: '',
    indexImgList: [{
      imgSrc: 'https://health.qbjiankang.com/cureimg/guan_g1.jpg'
    }, {
      imgSrc: 'https://health.qbjiankang.com/cureimg/guan_g2.jpg'
    }, {
      imgSrc: 'https://health.qbjiankang.com/cureimg/guan_g3.jpg'
    }]
  },
  onPullDownRefresh() {
    // 增加下拉刷新数据的功能
    var self = this;
    self.onIndexLoadData();
  },

  onLoad: function (options) {
    console.log('openId', wx.getStorageSync('openid'))
    page = 0
    let that = this
    loadMoreView = that.selectComponent("#loadMoreView");
    this.queryAllType()
    this.getCartList();
  },
  queryAllType: function (showLoading) {
    let that = this;
    console.error(api.queryAllType())
    http.get({
      url: api.queryAllType(),
      showLoading: showLoading,
      data: {},
      success: (res) => {
        console.log('queryAllType', res)
        if (res.data.code === 500) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return
        }
        that.setData({
          advertList: res.data,
          catalog: res.data[0].name,
          currentId:res.data[0].id,
        });
        this.queryProduct(true)
      },
      fail: (err) => {
        console.error("fail", err)
      }
    })
  },
  bindscrolltolower(){
    console.log(111)
    loadMoreView.loadMore()
  },
  loadMoreListener: function (e) {
    page += 1
    this.queryProduct(false)
  },
  queryProduct: function (showLoading) {
    page++
    let pageSize = 10
    let that = this;
    http.post({
      url: api.queryProduct(),
      showLoading: showLoading,
      data: {
        catalog: this.data.catalog,
        pageSize:pageSize,
        pageNo:page
      },
      success: (res) => {
        console.log('queryProduct', res)
        if (res.data.code !== 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return
        }
        var items = that.data.goodsList
        if (page == 1) {
          items = res.data.row
          wx.stopPullDownRefresh()
        } else {
          items = items.concat(res.data.data)
        }
        that.setData({
          goodsList: items
        });
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
  toCart: function () {
    let that = this;
    if (that.data.goodsCount < 1) {

    } else {
      wx.redirectTo({
        url: '/pages/shoppingMall/cart/cart',
      })
    }
    wx.redirectTo({
      url: '/pages/shoppingMall/cart/cart',
    })
  },
  getCartList: function (showLoading) {
    let that = this;
    http.get({
      url: api.CartIndex(),
      showLoading: showLoading,
      data: {},
      success: (res) => {
        console.log('getCartList', res)
        // if(res.data.code !==200){
        //   wx.showToast({
        //     title:res.data.msg,
        //     icon:'none'
        //   })
        //   return
        // }
        that.setData({
          'goodsCount': res.data.checkCount,
          'goodsAmount': res.data.amount
          
        });
      },
      fail: () => {
        console.error("fail")
      }
    })
  },
  onIndexLoadData: function (showLoading) {
    let that = this;
    var greeting = api.IndexUrlAdverGoods(1);
    console.log('greeting', greeting)
    http.get({
      url: greeting,
      showLoading: showLoading,
      data: {},
      success: (res) => {
        console.log('111', res)
        if (res.data.code && res.data.code !== 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return
        }
        that.setData({
          isshow: true
        });
        that.setData({
          advertList: res.data.advertList,
          topicList: res.data.topicList,
          indexImgList: res.data.indexImgList
        });
      },
      fail: () => {
        console.error("fail")
      }
    })
  },
  onShow: function () {
    // this.onIndexLoadData();
  },

  switchCate: function (event) {
    var that = this;
    var currentTarget = event.currentTarget;
    console.log(currentTarget)
    page = 0
    this.setData({
      catalog: currentTarget.dataset.name,
      currentId:currentTarget.dataset.id
    });
    this.queryProduct(true)
  },
  getProductInfo: function (event) {
    var that = this;
    var currentTarget = event.currentTarget;
    var productId = event.currentTarget.dataset.id
    that.setData({
      'productId': productId
    });
    var url = api.ProductsDetail(productId);
    http.get({
      url: url,
      showLoading: false,
      data: {},
      success: (res) => {
        console.log(res)
        // if (res.data.code &&res.data.code !== 200) {
        //   wx.showToast({
        //     title: res.data.msg,
        //     icon: 'none'
        //   })
        //   return
        // }
        that.setData({
          isshow: true
        });
        res = res.data;
        that.setData({
          product: res,
          number: 1,
          gallery: res.images.split(","),
          attribute: res.attrs,
          specList: res.specList,
          specificationList: res.specAttrList,
          checkedSpecText: '请先选择规格',
          openAttr: true
        });
      },
      fail: () => {
        console.error("fail")
      }
    })
  
  },

  clickSkuValue: function (event) {
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = event.currentTarget.dataset.valueId + "";
    let state = event.currentTarget.dataset.state;
    const proImg = event.currentTarget.dataset.picurl;
    console.info("state====" + state);
    // 禁用则结束
    if (state) {
      return;
    }

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    console.info("_specificationList:" + _specificationList.length);
    for (let i = 0; i < _specificationList.length; i++) {
      console.info(_specificationList[i].id + "-----" + specNameId);
      if (_specificationList[i].id == specNameId) {
        for (let j = 0; j < _specificationList[i].valueList.length; j++) {

          console.info(_specificationList[i].valueList[j].id + "====" + specValueId);
          if (_specificationList[i].valueList[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].valueList[j].checked) {
              _specificationList[i].valueList[j].checked = false;
              // }
              if (_specificationList.length > 1) {
                that.unSelectValue();
              }
            } else {
              _specificationList[i].valueList[j].checked = true;
              if (_specificationList.length > 1) {
                that.selectValue(specValueId, specNameId)
              }
            }
          } else {
            _specificationList[i].valueList[j].checked = false;
          }
        }
      }
    }

    this.setData({
      'proImg': proImg,
      'specificationList': _specificationList
    });
    // this.selectValue(specValueId, specNameId)
    //重新计算spec改变后的信息
    this.changeSpecInfo();
    // 新加
    var key = that.getCheckedSpecKey();

    if (key != "") {
      let checkedProduct = that.getCheckedProductItem(that.getCheckedSpecKey());
      console.info(JSON.stringify(key))
      console.info(JSON.stringify(checkedProduct))
      if (checkedProduct.length == 0) {
        that.setData({
          checkedSpecPrice: that.data.product.salesPrice,
          yprice: null,
          specId: null,
          checkedSpecText: '请选择规格',
          checkedStock: 1,
          number: 1
        });
      } else {
        checkedProduct = checkedProduct[0];
        that.setData({
          checkedSpecPrice: that.data.type == '1' ? checkedProduct.price : checkedProduct.salesPrice,
          yprice: checkedProduct.salesPrice,
          specId: checkedProduct.id,
          checkedSpecText: checkedProduct.name,
          checkedStock: checkedProduct.stock
        });
      }
    }
  },

  closePop: function () {
    this.setData({
      openAttr: false
    });
  },
  //选中
  selectValue: function (id, specNameId) {
    let that = this
    var newAttrIds = []
    if (specNameId == null || specNameId == 'undefined') {
      return;
    }
    console.info("specNameId:" + specNameId)
    for (var i = 0; i < that.data.specList.length; i++) {
      console.log(specNameId + "===" + that.data.specList[i].name + "====" + that.data.specList[i].stock);
      console.log(that.data.specList[i].specValue1 + "====" + id + "====" + that.data.specList[i].specValue2);
      if (that.data.specList[i].specValue1 == id && that.data.specList[i].stock > 0) {
        newAttrIds.push(that.data.specList[i].specValue2)
      } else if (that.data.specList[i].specValue2 == id && that.data.specList[i].stock > 0) {
        newAttrIds.push(that.data.specList[i].specValue1)
      }
    }
    console.info(newAttrIds)
    for (var z = 0; z < that.data.specificationList.length; z++) {
      for (var y = 0; y < that.data.specificationList[z].valueList.length; y++) {
        console.info(that.data.specificationList[z].id + '------' + specNameId)
        if (that.data.specificationList[z].id != specNameId) {
          var nid = that.data.specificationList[z].valueList[y].id + ""
          console.info(nid + 'in newAttrIds:' + newAttrIds.indexOf(nid))
          if (newAttrIds.indexOf(nid) > -1) {
            that.data.specificationList[z].valueList[y].state = false
          } else {
            that.data.specificationList[z].valueList[y].state = true
          }
        }
      }
    }
    that.setData({
      'specificationList': that.data.specificationList
    });
  },
  //取消选择
  unSelectValue: function () {
    let that = this;
    var n = 0;
    for (var z = 0; z < that.data.specificationList.length; z++) {
      for (var y = 0; y < that.data.specificationList[z].valueList.length; y++) {
        console.info(that.data.specificationList[z].valueList[y].id + "  checked  " + that.data.specificationList[z].valueList[y].checked);
        if (that.data.specificationList[z].valueList[y].checked) {
          n += 1;
          // that.selectValue(that.data.specificationList[z].valueList[y].id + "", that.data.specificationList[z].valueList[y].id + "")
          break;
        }
      }
    }
    console.info("nnnnnn" + n);
    if (n == 0) {
      for (var m = 0; m < that.data.specificationList.length; m++) {
        for (var n = 0; n < that.data.specificationList[m].valueList.length; n++) {
          that.data.specificationList[m].valueList[n].state = false
        }
      }
      that.setData({
        'specificationList': that.data.specificationList
      });
    }
  },
  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        nameId: _specificationList[i].id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].checked) {
          _checkedObj.valueId = _specificationList[i].valueList[j].id;
          _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;

  },
  //根据已选的值，计算其它值的状态
  setSpecValueStatus: function () {

  },
  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    if(!this.data.specificationList){
      return true
    }
    console.info(this.data.specId + '  this.data.specId:' + (this.data.specId != null))
    return this.data.specId != null;
  },
  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });
    if (checkedValue.length == 1) {
      return checkedValue.join('');
    }
    return checkedValue.join('_');
  },
  changeSpecInfo: function () {
    let that = this;
    let checkedNameValue = that.getCheckedSpecValue();
    let checkedValue = checkedNameValue.filter(function (v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function (v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setData({
        'checkedSpecText': checkedValue.join('　')
      });
    } else {
      this.setData({
        'checkedSpecText': '请选择规格数量'
      });
    }

  },
  getCheckedProductItem: function (key) {
    console.log('---------00--------00----:', this.data.productList)
    return this.data.specList.filter(function (v) {
      if (key.indexOf("_") != -1) {
        console.log('---------00--------00----:', JSON.stringify(v))
        if ((v.specValue1 + "_" + v.specValue2) == key || (v.specValue2 + "_" + v.specValue1) == key) {
          return true;
        } else {
          return false;
        }
      } else {
        console.log('---------00--------00----:', JSON.stringify(v))
        if (v.specValue1 == key) {
          return true;
        } else {
          return false;
        }
      }
    });
  },


  /**
   * 添加到购物车
   */
  addToCart: function () {
    var that = this;
    if (that.data.openAttr == false) {
      //打开规格选择窗口
      that.setData({
        saveMethod: 'addToCart',
        openAttr: !this.data.openAttr
      });
    } else {
      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        wx.showToast({
          title: '请选择完整规格',
          icon: 'none'
        });
        return false;
      }
      http.put({
        url: api.toCartAdd(),
        showLoading: true,
        data: {
          productId: that.data.product.id,
          number: that.data.number,
          specId: that.data.specId,
          notice: "true", //追加
          specInfo: that.data.checkedSpecText
        },
        success: (res) => {
          let _res = res;
          // if (res.data.code !== 200) {
          //   wx.showToast({
          //     title: res.data.msg,
          //     icon: 'none'
          //   })
          //   return
          // }
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 2000
          });
          that.setData({
            openAttr: false,
            number: 1,
            specId: null
          });
          that.getCartList();
        },
        fail: () => {
          console.error("fail")
        }
      })

      //添加到购物车
      // util.requestMall(api.toCartAdd, {
      //   productId: that.data.product.id,
      //   number: that.data.number,
      //   specId: that.data.specId,
      //   notice: "true",//追加
      //   specInfo: that.data.checkedSpecText
      // }, 'PUT')
      //   .then(function (res) {
      //     wx.hideLoading();
      //     let _res = res;
      //     wx.showToast({
      //       title: '添加成功',
      //       icon: 'none',
      //       duration: 2000
      //     });
      //     that.setData({
      //       openAttr: false,
      //       number: 1,
      //specId:null
      //     });
      //     that.getCartList();
      //     console.info('log:' + that.data.openAttr)
      //   });
    }
  },
  cutNumber: function () {
    let that = this;
    if (that.stockValidate()) {
      this.setData({
        number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
      });
    }
  },
  addNumber: function () {
    let that = this;
    if (that.stockValidate()) {
      console.info('that.data.checkedStock:' + that.data.checkedStock);
      console.log(that.data.product)
      if(!that.data.specificationList ||that.data.specificationList.length ==0 ){
        
      }
      
      if (that.data.checkedStock >= this.data.number + 1) {
        this.setData({
          number: this.data.number + 1
        });
      } else {
        this.setData({
          number: this.data.number
        });
      }
    }
  },
  setNumber: function (e) {
    let that = this;
    var val = e.detail.value;
    if (that.stockValidate()) {
      console.info('change number:' + val);
      if (val < 1) {
        val = 1;
      }
      this.setData({
        number: val
      });
    }
  },
  stockValidate: function () {
    let that = this;
    if (that.isCheckedAllSpec()) {
      return true;
    } else {
      wx.showToast({
        title: '请先选择规格',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  },
  setDefSpecInfo: function (specificationList) {
    //未考虑规格联动情况
    let that = this;
    if (!specificationList) return;
    for (let i = 0; i < specificationList.length; i++) {
      let specification = specificationList[i];
      let specNameId = specification.id;
      //规格只有一个时自动选择规格
      if (specification.valueList && specification.valueList.length == 1) {
        let specValueId = specification.valueList[0].id;
        that.clickSkuValue({
          currentTarget: {
            dataset: {
              "nameId": specNameId,
              "valueId": specValueId
            }
          }
        });
      }
    }
    specificationList.map(function (item) {

    });

  },
})