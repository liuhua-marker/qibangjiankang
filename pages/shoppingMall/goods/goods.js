var util = require('../../../utils/util.js');
const http = require('../../../utils/http')
const api = require('../../../utils/server.api.js')
var WxParse = require('../../../lib/wxParse/wxParse.js');
Page({
  data: {
    saveMethod:'',
    winHeight: "",
    picPath:api.picPath,
    id: 0,
    userId:0,
    goods: {},
    gallery: [],
    attribute: [],
    issueList: [],
    comment: [],
    brand: {},
    specificationList: [],
    productList: [],
    relatedGoods: [],
    groupBuyLis:[],
    newBuyLis: [],
    newGroup: {},
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
    checkedSpecText: '请选择规格数量',
    checkedSpecPrice: 0,
    yprice:0,
    proId: 0,
    proImg:'',
    openAttr: false,
    openCoupon:false,
    openGroup:false,
    openPart: false,
    cimPart:true,
    noCollectImage: "../../../images/mall/icon_collect.png",
    hasCollectImage: "../../../images/mall/icon_collect_checked.png",
    collectBackImage: "../../../images/mall/icon_collect.png",
    nowtime:0,
    type:0,
    ntype:'',
    groupprice:0,
    groupNum:0,
    groupBuyingId:''
  }, 
  onShareAppMessage: function() { 
    this.addShareGoods()
    const share_obj= {
      title: this.data.goods.name,
      imageUrl: this.data.goods.list_pic_url,
      path: 'pages/goods/goods?id=' + this.data.id + '&userId=' + wx.getStorageSync('uId')
    }
    return share_obj
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    var that = this;
    that.setData({
      nowtime: new Date().getTime() + 20000
    });
    var productId=null;
    if (options.id) {
      that.setData({
        id: options.id,
      });
      productId = options.id;
    }
    if (options.type) {
      that.setData({
        type: options.type,
      });
    }
    if (options.userId) {
      wx.setStorageSync('userId', options.userId)
    }
    if (options.q) {
      const q = decodeURIComponent(options.q)
      that.setData({
        id: util.getQueryString(q, 'id')
      });
     
      wx.setStorageSync('userId', util.getQueryString(q, 'userId'))
      //that.newLogin()
      productId = util.getQueryString(q, 'id')
    }
    //that.getGoodsInfo();
    that.getProductInfo(productId);
    var that = this
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 100;
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  onShow: function () {
     
    //this.cartGoodsCount();
    //this.getCouponList();
    //this.getGroupBuyList();
  },
  backfun:function(e){
     console.log("---===---=:",e)
     if(e.success){
       this.getGroupBuyList()
     }
  },
  openCoupon:function(){
    this.setData({
      openCoupon: true,
      openAttr: !this.data.openAttr
    });
    this.getCouponList();
  },
  colseCoupon:function(){
    this.setData({
      openCoupon: false,
      openAttr: !this.data.openAttr
    });
  },
  openGroup: function () {
    this.setData({
      openGroup: true,
      openAttr: !this.data.openAttr
    });
    this.getCouponList();
  }, 
  colseGroup: function () {
    this.setData({
      openGroup: false,
      openAttr: !this.data.openAttr
    });
  },
  cimPart:function(){
    if (this.data.openAttr == false) {
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr,
        collectBackImage: "/static/images/detail_back.png"
      });
    }
    this.setData({
      cimPart: false
    });
  },
  openPart: function (e) {  
    var model = e.target.dataset.items;
    this.setData({
      newGroup:model,
      groupBuyingId: model.groupBuyingDetailedList[0].groupBuyingId,
      openPart: true
    });
  },
  colsePart: function () {
    this.setData({
      openPart: false
    });
  },
  getCouponList: function () {
    let that = this;
    http.post({
      url: api.CouponListByMer(),
      showLoading: true,
      data: {
        merchantId: that.data.goods.merchantId
      },
      success: (res) => {
        if (res.errno === 0) {
          that.setData({
            merCoupon: res.data,
          });
        }
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.request(api.CouponListByMer, {
    //   merchantId: that.data.goods.merchantId
    // }, "POST").then(function (res) {
    //   if (res.errno === 0) {
    //     that.setData({
    //       merCoupon: res.data,
    //     });
    //   }
    // });
  },
  getGroupBuyList: function () {
    let that = this;
    http.post({
      url: api.GroupBuyList(),
      showLoading: true,
      data: {
        goodsId: that.data.id
      },
      success: (res) => {
        if (res.errno === 0) { 
          var items = res.data.groupBuyingEntityList;
          var arr = [];
          var num = Math.ceil(items.length / 2)
          console.log('--------,------:', num)
          for (var j = 0; j < num; j++) {
            var str = [];
            for (var i = 0; i < items.length; i++) {
              if (str.length < 2) {
                if (items[i + j * 2]) {
                  str.push(items[i + j * 2]);
                }
              }
            }
            arr.push(str);
          }
          console.log('----------www---------:', arr)
          that.setData({
            groupBuyList: res.data.groupBuyingEntityList,
            groupNum: res.data.groupNum,
            newBuyLis: arr
          });
        }
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.request(api.GroupBuyList, {
    //   goodsId: that.data.id
    // }, "POST").then(function (res) {
    //   if (res.errno === 0) { 
    //     var items = res.data.groupBuyingEntityList;
    //     var arr = [];
    //     var num = Math.ceil(items.length / 2)
    //     console.log('--------,------:', num)
    //     for (var j = 0; j < num; j++) {
    //       var str = [];
    //       for (var i = 0; i < items.length; i++) {
    //         if (str.length < 2) {
    //           if (items[i + j * 2]) {
    //             str.push(items[i + j * 2]);
    //           }
    //         }
    //       }
    //       arr.push(str);
    //     }
    //     console.log('----------www---------:', arr)
    //     that.setData({
    //       groupBuyList: res.data.groupBuyingEntityList,
    //       groupNum: res.data.groupNum,
    //       newBuyLis: arr
    //     });
    //   }
    // });
  },
  addShareGoods: function () {
    let that = this;
    const param={};
    param.goodsId = that.data.goods.id
    param.name = that.data.goods.name
    param.goodsBrief = that.data.goods.goods_brief || ''
    param.retailPrice = that.data.goods.retail_price
    param.marketPrice = that.data.goods.market_price
    param.primaryPicUrl = that.data.goods.primary_pic_url 
    console.log("------ffff:", JSON.stringify(param))
    http.post({
      url: api.InsShareGoods(),
      showLoading: true,
      data: param,
      success: (res) => {
        console.log('res', res)
            if (res.errno === 0) { 
              console.log("------chenggong")
            }
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.request(api.InsShareGoods, param, "POST", 'application/x-www-form-urlencoded').then(function (res) { 
    //   console.log("------rrrrr:", res)
    //   if (res.errno === 0) { 
    //     console.log("------chenggong")
    //   }
    // });
  },
  takeCoupon: function (e) {
    let that = this;
    http.post({
      url: api.TakeMerCoupon(),
      showLoading: true,
      data: {id: e.target.dataset.couponid},
      success: (res) => {
        console.log('res', res)
            if (res.errno === 0) {
        wx.showToast({
          title: '领取成功',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 2000
        })
      }
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.request(api.TakeMerCoupon, {
    //   id: e.target.dataset.couponid
    // }, "POST").then(function (res) {
    //   if (res.errno === 0) {
    //     wx.showToast({
    //       title: '领取成功',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   } else {
    //     wx.showToast({
    //       title: res.errmsg,
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   }
    // });
  },
  getProductInfo: function (productId) {

    var url = api.ProductsDetail(productId);
    let that = this;
    http.get({
      url: url,
      showLoading: true,
      data: {},
      success: (res) => {
        console.log('res', res)
            res=res.data;
        console.info("======" + JSON.stringify(res.images.split(",")))
          that.setData({
            product: res,
            gallery: res.images.split(","),
            attribute: res.attrs,
            specList: res.specList,
            specificationList: res.specAttrList,
            checkedSpecText: '请选选择规格',
            specId: null, 
            userHasCollect:res.collect
            /**
            attribute: res.data.attribute,
            issueList: res.data.issue,
            comment: res.data.comment,
            brand: res.data.brand,
            specificationList: res.data.specificationList,
            productList: res.data.productList,
            userHasCollect: res.data.userHasCollect */
          });
        WxParse.wxParse('goodsDetail', 'html', res.productHtml, that);

          //设置默认值
          that.setDefSpecInfo(that.data.specificationList);
        console.info("res.data.userHasCollect:" + that.data.userHasCollect)
        if (that.data.userHasCollect) {
            that.setData({
              'collectBackImage': that.data.hasCollectImage
            });
          } else {
            that.setData({
              'collectBackImage': that.data.noCollectImage
            });
          }

          WxParse.wxParse('goodsDetail', 'html', res.productHtml, that);
       // that.getGoodsRelated();
      },
      fail: () => {
        console.error("fail")
      }
    })
    
    // util.requestMall(url).then(function (res) {
    //   if (res.statusCode == 200) {
    //     res=res.data;
    //     console.info("======" + JSON.stringify(res.images.split(",")))
    //       that.setData({
    //         product: res,
    //         gallery: res.images.split(","),
    //         attribute: res.attrs,
    //         specList: res.specList,
    //         specificationList: res.specAttrList,
    //         checkedSpecText: '请选选择规格',
    //         specId: null, 
    //         userHasCollect:res.collect
    //         /**
    //         attribute: res.data.attribute,
    //         issueList: res.data.issue,
    //         comment: res.data.comment,
    //         brand: res.data.brand,
    //         specificationList: res.data.specificationList,
    //         productList: res.data.productList,
    //         userHasCollect: res.data.userHasCollect */
    //       });
    //     WxParse.wxParse('goodsDetail', 'html', res.productHtml, that);

    //       //设置默认值
    //       that.setDefSpecInfo(that.data.specificationList);
    //     console.info("res.data.userHasCollect:" + that.data.userHasCollect)
    //     if (that.data.userHasCollect) {
    //         that.setData({
    //           'collectBackImage': that.data.hasCollectImage
    //         });
    //       } else {
    //         that.setData({
    //           'collectBackImage': that.data.noCollectImage
    //         });
    //       }

    //       WxParse.wxParse('goodsDetail', 'html', res.productHtml, that);
    //   }
    //    // that.getGoodsRelated();
       
    // });
    this.cartGoodsCount()
  },

  getGoodsInfo: function() {
    let that = this;
    util.request(api.GoodsDetail, {
      id: that.data.id
    }).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          goods: res.data.info,
          gallery: res.data.gallery,
          attribute: res.data.attribute,
          issueList: res.data.issue,
          comment: res.data.comment,
          brand: res.data.brand,
          specificationList: res.data.specificationList,
          productList: res.data.productList,
          userHasCollect: res.data.collect
        });
        //设置默认值
        that.setDefSpecInfo(that.data.specificationList);
        if (res.data.userHasCollect) {
          that.setData({
            'collectBackImage': that.data.hasCollectImage
          });
        } else {
          that.setData({
            'collectBackImage': that.data.noCollectImage
          });
        }

        WxParse.wxParse('goodsDetail', 'html', res.data.info.goods_desc, that);
        that.getGoodsRelated();
      }
    });

  },
  getGoodsRelated: function() {
    let that = this;
    util.request(api.GoodsRelated, {
      id: that.data.id
    }).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          relatedGoods: res.data.goodsList,
        });
      }
    });

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

    if (key!= "") {
      let checkedProduct = that.getCheckedProductItem(that.getCheckedSpecKey());
      console.info(JSON.stringify(key))
      console.info(JSON.stringify(checkedProduct))
      if (checkedProduct.length==0){
        that.setData({
          checkedSpecPrice: that.data.product.salesPrice,
          yprice: null,
          specId: null,
          checkedSpecText: '请选择规格' ,
          checkedStock: 1,
          number: 1
        });
      }else{
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

  closePop: function(){
    this.setData({
      openAttr: false
    }); 
  },
  //选中
  selectValue: function (id, specNameId) {
    let that = this
    var newAttrIds = []
    if (specNameId == null || specNameId=='undefined'){
      return;
    }
    console.info("specNameId:" + specNameId)
    for (var i = 0; i < that.data.specList.length; i++) {
      console.log(specNameId+"==="+that.data.specList[i].name + "====" + that.data.specList[i].stock);
      console.log(that.data.specList[i].specValue1 + "====" + id + "====" + that.data.specList[i].specValue2 );
      if (that.data.specList[i].specValue1 == id && that.data.specList[i].stock>0) {
        newAttrIds.push(that.data.specList[i].specValue2)
      } else if (that.data.specList[i].specValue2 == id && that.data.specList[i].stock > 0) {
        newAttrIds.push(that.data.specList[i].specValue1)
      }
    }
    console.info(newAttrIds)
    for (var z = 0; z < that.data.specificationList.length; z++) {
      for (var y = 0; y < that.data.specificationList[z].valueList.length; y++) {
        console.info(that.data.specificationList[z].id +'------'+ specNameId)
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
        console.info(that.data.specificationList[z].valueList[y].id+"  checked  " + that.data.specificationList[z].valueList[y].checked);
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
    console.info(this.data.specId+'  this.data.specId:' + (this.data.specId != null))
    return this.data.specId!=null;
  },
  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });
    if (checkedValue.length==1){
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
      if(key.indexOf("_")!=-1){
        console.log('---------00--------00----:', JSON.stringify(v))
        if ((v.specValue1 + "_" + v.specValue2) == key || (v.specValue2 + "_" + v.specValue1) == key) {
          return true;
        } else {
          return false;
        }
      }else{
        console.log('---------00--------00----:', JSON.stringify(v))
        if (v.specValue1 == key) {
          return true;
        } else {
          return false;
        }
      }
    });
  }, 
  cartGoodsCount:function(){
    let that=this
    http.get({
      url: api.CartGoodsCount(),
      showLoading: true,
      data: {},
      success: (res) => {
        console.log('res', res)
        if (res.statusCode == 200) {
          that.setData({
            cartGoodsCount: res.data
          });
        }
      },
      fail: () => {
        console.error("fail")
      }
    })
    // util.requestMall(api.CartGoodsCount).then(function (res) {
    //   if (res.statusCode == 200) {
    //     that.setData({
    //       cartGoodsCount: res.data
    //     });
    //   }
    // });
  },
  onReady: function() {
    // 页面渲染完成

  }, 
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  switchAttrPop: function() { 
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr,
        collectBackImage: "/static/images/detail_back.png"
      });
    }
  },
  goUrl: function() {
    console.log(111)
    wx.navigateTo({
      url: '../shop/index',
    })
  },
  closeAttrOrCollect: function() {
    let that = this;
    if (this.data.openAttr) {
      this.setData({
        openAttr: false,
      });
      if (that.data.userHasCollect) {
        that.setData({
          'collectBackImage': that.data.hasCollectImage
        });
      } else {
        that.setData({
          'collectBackImage': that.data.noCollectImage
        });
      }
    } else {
      //添加或是取消收藏
      http.get({
        url: api.CollectAddOrDelete(),
        showLoading: true,
        data: {  productId: this.data.id},
        success: (res) => {
          console.log('res', res)
          let _res = res; 
          if (res.data>0){
              if (that.data.userHasCollect) {
                that.setData({
                  'userHasCollect': !that.data.userHasCollect,
                  'collectBackImage': that.data.noCollectImage
                });
              } else {
                that.setData({
                  'userHasCollect': !that.data.userHasCollect,
                  'collectBackImage': that.data.hasCollectImage
                });
                
              }
            }
        },
        fail: () => {
          console.error("fail")
        }
      })
      // util.requestMall(api.CollectAddOrDelete, {
      //     productId: this.data.id
      //   })
      //   .then(function(res) {
      //     let _res = res; 
      //     if (res.data>0){
      //         if (that.data.userHasCollect) {
      //           that.setData({
      //             'userHasCollect': !that.data.userHasCollect,
      //             'collectBackImage': that.data.noCollectImage
      //           });
      //         } else {
      //           that.setData({
      //             'userHasCollect': !that.data.userHasCollect,
      //             'collectBackImage': that.data.hasCollectImage
      //           });
                
      //         }
      //       }
      //   });
    }

  },
  openCartPage: function() {
    wx.switchTab({
      url: '/pages/cart/cart',
    });
  },

  /**
   * 直接购买
   */
  buyGoods: function(e) {
    var that = this; 
    /** 
    var ntype = e.target.dataset.ntype || ''
    var activityType = e.target.dataset.activitytype || '';
    var groupBuyingId = e.target.dataset.groupbuyingid || '';
    that.setData({
      groupBuyingId: groupBuyingId
    });
    */
    if (that.data.openAttr == false) {
      //打开规格选择窗口
      that.setData({
        saveMethod: 'buyGoods',
        openAttr: !that.data.openAttr
      });
    } else {
      wx.showLoading({
        title: '提交中',
      })
      wx.setStorageSync('isYJ', that.data.isYJ);
      //提示选择完整规格
      if (!that.isCheckedAllSpec()) {
        wx.showToast({
          title: '请选择完整规格'
        });
        return false;
      }
 
      
      // 直接购买商品
      http.put({
        url: api.BuyNowAdd(),
        showLoading: true,
        data: {
          productId: that.data.product.id,
          number: that.data.number,
          spec: that.data.specId,
          specInfo: that.data.checkedSpecText
          },
        success: (res) => {
          console.log('res', res)
          let _res = res; 
          wx.hideLoading();
          if (_res.statusCode == 200) {
            that.setData({
              openAttr: !that.data.openAttr
            }); 
            wx.setStorageSync("buyData", JSON.stringify(_res.data));
            wx.navigateTo({
              url: '/pages/shopping/checkout/checkout'
            })
          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.data.errorMessage,
              mask: true,
              duration: 2000
            });
          }
        },
        fail: () => {
          console.error("fail")
        }
      })
      // util.requestMall(api.BuyNowAdd, {
      //   productId: that.data.product.id,
      //   number: that.data.number,
      //   spec: that.data.specId,
      //   specInfo: that.data.checkedSpecText
      //   }, "PUT")
      //   .then(function(res) {
      //     wx.hideLoading();
      //     let _res = res;
      //     if (_res.statusCode == 200) {
      //       that.setData({
      //         openAttr: !that.data.openAttr
      //       }); 
      //       wx.setStorageSync("buyData", JSON.stringify(_res.data));
      //       wx.navigateTo({
      //         url: '/pages/shopping/checkout/checkout'
      //       })
      //     } else {
      //       wx.showToast({
      //         image: '/static/images/icon_error.png',
      //         title: _res.data.errorMessage,
      //         mask: true,
      //         duration: 2000
      //       });
      //     }

      //   });

    }
  },

  /**
   * 添加到购物车
   */
  addToCart: function() {
    var that = this; 
    if (that.data.openAttr == false) {
      //打开规格选择窗口
      that.setData({
        saveMethod: 'addToCart',
        openAttr: !this.data.openAttr
      });
    } else {
      wx.showLoading({
        title: '提交中',
      })
      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        wx.showToast({
          title: '请选择完整规格'
        });
        return false;
      }
 

      //添加到购物车
      http.put({
        url: api.toCartAdd(),
        showLoading: true,
        data:  {
          productId: that.data.product.id,
          number: that.data.number,
          specId: that.data.specId,
          notice: "true",//追加
          specInfo:that.data.checkedSpecText
          },
        success: (res) => {
          console.log('res', res)
          wx.hideLoading();
          let _res = res; 
            wx.showToast({
              title: '添加成功',
              icon: 'none',
              duration: 2000
            });
            that.setData({ 
              cartGoodsCount: _res.data,
            });
        that.closeAttrOrCollect();
        },
        fail: () => {
          console.error("fail")
        }
      })
      // util.requestMall(api.toCartAdd, {
      //   productId: that.data.product.id,
      //   number: that.data.number,
      //   specId: that.data.specId,
      //   notice: "true",//追加
      //   specInfo:that.data.checkedSpecText
      //   },'PUT')
      //   .then(function(res) { 
      //       wx.hideLoading();
      //       let _res = res; 
      //         wx.showToast({
      //           title: '添加成功',
      //           icon: 'none',
      //           duration: 2000
      //         });
      //         that.setData({ 
      //           cartGoodsCount: _res.data,
      //         });
      //     that.closeAttrOrCollect();
      //     console.info('log:' + that.data.openAttr)
      //         /**
      //         if (that.data.userHasCollect == 1) {
      //           that.setData({
      //             'collectBackImage': that.data.hasCollectImage
      //           });
      //         } else {
      //           that.setData({
      //             'collectBackImage': that.data.noCollectImage
      //           });
      //         }
      //          */
              
      //   });
    }

  },
  cutNumber: function() {
    let that = this;
    if (that.stockValidate()){
      this.setData({
        number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
      });
    }
  },
  addNumber: function() {
    let that = this;
    if (that.stockValidate()) {

      console.info('that.data.checkedStock:' + that.data.checkedStock);
      if (that.data.checkedStock >= this.data.number + 1){
        this.setData({
          number: this.data.number + 1
        });
      }else{
        this.setData({
          number: this.data.number 
        });
      }
    } 
  },
  setNumber: function (e) {
    let that = this;
    var val = e.detail.value;
    if (that.stockValidate()){
      console.info('change number:'+val);
      if (val<1){
        val=1;
      }
      this.setData({
        number: val
      });
    }
  },
  stockValidate:function(){
    let that = this;
    if (that.isCheckedAllSpec()) {
      return true;
    }else{
      wx.showToast({
        title: '请选选择规格',
        icon: 'fail',
        duration: 2000
      });
      return false;
    }
  },
  setDefSpecInfo: function(specificationList) {
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
    specificationList.map(function(item) {

    });

  },
  newLogin:function(){
    let that=this;
    //重新登陆
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                //用户按了允许授权按钮
                user.loginByWeixin(res).then(res => {
                  let userInfo = wx.getStorageSync('userInfo');
                  app.globalData.userInfo = userInfo.userInfo;
                  app.globalData.token = res.data.openid;
                  that.cartGoodsCount();
                }).catch((err) => {
                  console.log(err)
                });
              }
            })
          } else {
            wx.showModal({
              title: '警告通知',
              content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: (res) => {
                      if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                        user.loginByWeixin(e.detail).then(res => {
                          let userInfo = wx.getStorageSync('userInfo');
                          this.setData({
                            userInfo: userInfo.userInfo
                          });
                          app.globalData.userInfo = userInfo.userInfo;
                          app.globalData.token = res.data.openid;
                          that.cartGoodsCount();
                        }).catch((err) => {
                          console.log(err)
                        });
                      }
                    }
                  })
                }
              }
            });
          }
        }
      })
    }
  }
})