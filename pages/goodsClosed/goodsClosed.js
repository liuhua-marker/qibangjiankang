const urlApi = require('../../utils/server.api.js')
const {
  $Message
} = require('../../iview/base/index');
const util = require("../../utils/util.js")
const app = getApp();
import {
  promisify
} from '../../utils/promise.util'
import {
  $init,
  $digest
} from '../../utils/common.util'
Page({
  data: {
    goods: [], //货物数量
    goodsSize: '0',
    deliverGoods: [],
    sumGoods: 0,
    tempFilePaths: '',
    titleCount: 0,
    contentCount: 0,
    title: '',
    content: '',
    images: [],
    array: [],
    dompickindex: 0,
    picarray: [],
    afadress: "未选择收货类型",
    pitchArray: [], //选中的发货地址
    currentBid: "",
    getType: "goodsType"
  },
  onLoad: function (options) {
    $init(this)
    let that = this;
    // that.setData({
    //   goods: wx.getStorageSync('userRole'), //获取userRole(用户角色),
    // })
    that.setData({
      goodsSize: that.data.goods.length,
      currentBid: options.currentBid
    })
    console.log("options.currentBid    " + options.currentBid);

  },
  deleteRece: function (e) {
    console.log(e);
    let that = this;
    let id = e.target.dataset.id;
    let index = e.target.dataset.index;
    let goods = that.data.goods;
    goods.splice(index, 1);
    that.setData({
      goods: goods
    })
  },
  scanDeleteRece: function () {
    let that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res); //获取扫码后的数据
        var path = res.result
        //微信开发者工具 在开发者工具里出现乱码需要decodeURIComponent转义,真机不需要,可以直接使用
        path = path.split('?'); //分割字符串 path[0]等于pages/me/me,path[1]等于scene=table_id%3D8%26shop_id%3D1
        var scene = path[1];
        scene = scene.split("&");
        var goodslist = {};
        for (var i = 0; i < scene.length; i++) {
          var b = scene[i].split("=");
          goodslist[b[0]] = b[1];
        }
        if (goodslist.otherType == "undefined" || goodslist.otherType == "" || goodslist.otherType == null) {
          wx.showToast({
            title: "不支持服务类型",
            icon: "none",
            duration: 2000
          })
          return false;
        }
        if (goodslist.otherType == "deliverGoods") { //发货程序
          util.loading();
          wx.request({ //openid请求后台，获取用户角色。
            url: urlApi.getGoodsData(),
            method: "post",
            header: {
              'content-type': 'application/json'
            },
            data: {
              deviceId: goodslist.deviceId,
              goodsId: goodslist.goodsId,
              getType: goodslist.getType,
              boxId: goodslist.boxId,
              openid: wx.getStorageSync("openid"),
              bId: that.data.currentBid
            },
            success: function (resdata) {
              console.log(resdata);
              let goodsre = resdata.data.data; //获取后台传过来的数据对象
              if (resdata.data.code == 200) {
                let goods = that.data.goods;
                for (let del = 0; del < goods.length; del++) {
                  if (goods[del].id == goodsre.id) {
                    wx.showModal({
                      title: '确定移出列表吗?',
                      content: goodsre.identity,
                      success(res) {
                        if (res.confirm) {
                          goods.splice(del, 1);
                          that.setData({
                            goods: goods
                          })
                        } else if (res.cancel) {}
                        util.closeload();
                      }
                    })
                  }
                }
              } else { //系统执行错误
                util.closeload();
                wx.showToast({
                  title: resdata.data.msg,
                  icon: "none",
                  duration: 2000
                })
              }
            },
            fail: function () {
              wx.showToast({
                title: "扫描设备出错",
                icon: "none",
                duration: 2000
              })
            }
          })
        } else { //系统之外的二维码扫描
          let other = 0;
          wx.showToast({
            title: "请扫描收货二维码",
            icon: "none",
            duration: 2000
          })
        }

      }
    })
  },
  continueCargo: function () { //点击扫描按钮事件
    let that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res); //获取扫码后的数据
        var path = res.result
        //微信开发者工具 在开发者工具里出现乱码需要decodeURIComponent转义,真机不需要,可以直接使用
        path = path.split('?'); //分割字符串 path[0]等于pages/me/me,path[1]等于scene=table_id%3D8%26shop_id%3D1
        var scene = path[1];
        scene = scene.split("&");
        var goodslist = {};
        for (var i = 0; i < scene.length; i++) {
          var b = scene[i].split("=");
          goodslist[b[0]] = b[1];
        }
        if (goodslist.otherType == "undefined" || goodslist.otherType == "" || goodslist.otherType == null) {
          wx.showToast({
            title: "不支持服务类型",
            icon: "none",
            duration: 2000
          })
          return false;
        }

        if (goodslist.otherType == "deliverGoods") { //发货程序
          that.deliverGoods(goodslist);
        } else { //系统之外的二维码扫描
          let other = 0;
          wx.showToast({
            title: "请扫描收货二维码",
            icon: "none",
            duration: 2000
          })
        }

      }
    })
  },
  /**
   *扫描后通过后台判断 将本次扫描结果呈现
   */
  deliverGoods: function (res) {
    util.loading();
    let that = this;
    wx.request({ //openid请求后台，获取用户角色。
      url: urlApi.getGoodsData(),
      method: "post",
      header: {
        'content-type': 'application/json'
      },
      data: {
        deviceId: res.deviceId,
        goodsId: res.goodsId,
        getType: res.getType,
        boxId: res.boxId,
        openid: wx.getStorageSync("openid"),
        bId: that.data.currentBid
      },
      success: function (resdata) {
        console.log(resdata);
        let goodsre = resdata.data.data; //获取后台传过来的数据对象
        let gooslist = that.data.goods; //获取缓存中的list，进行遍历。 避免重复扫描
        if (resdata.data.code == 200) {

          let goods = that.data.goods;
          console.log("goods", goods);
          let passAdd = false;
          for (let g = 0; g < goods.length; g++) {
            if (goods[g].id == goodsre.id) {
              passAdd = true;
              wx.showToast({
                title: "请勿重复扫描",
                icon: "none",
                duration: 2000
              })
            }
          }
          /**
           * 如果扫描套盒，就不准扫描设备。二者只能选一
           * 及时更改扫描类型，将物品类型传入后台进行校正
           * 现在已经获取所有套盒分类，还需获取所有设备分类，
           * 判断第一件扫描的类型，从而请求是哪个（套盒、设备）所有分类
           * 扫描完毕之后将设备、套盒对象、选中的校正对象，当前扫描类型传入后台即可
           * 校正完毕
           */
          if (goods.length == 0) {
            that.setData({
              getType: goodsre.type
            })
            if (goodsre.type == "goodsType") {
              wx.request({
                url: urlApi.getGoodsboxAllData(),
                header: {
                  "Content-Type": "application/json",
                  'Authorization': wx.getStorageSync("token"),
                },
                method: 'post',
                data: {},
                //服务端的回掉
                success: function (result) {
                  that.setData({
                    picarray:[],
                    array:[]
                  })
                  let picnext = result.data.data;
                  for (let pic = 0; pic < picnext.length; pic++) {
                    that.data.picarray.push(picnext[pic])
                  }
                  console.log(result.data.data);
                  that.setData({
                    picarray: that.data.picarray
                  })
                  for (let dompa = 0; dompa < that.data.picarray.length; dompa++) {
                    that.data.array.push(that.data.picarray[dompa].goodsName);
                  }
                  that.setData({
                    array: that.data.array
                  })
                }
              })
            }
            
            if(goodsre.type == "deviceType"){
              wx.request({
                url: urlApi.getDeviceClassAllData(),
                header: {
                  "Content-Type": "application/json",
                  'Authorization': wx.getStorageSync("token"),
                },
                method: 'post',
                data: {},
                success: function (result) {
                  that.setData({
                    picarray:[],
                    array:[]
                  })
                  let picnext = result.data.data;
                  for (let pic = 0; pic < picnext.length; pic++) {
                    that.data.picarray.push(picnext[pic])
                  }
                  console.log(result.data.data);
                  that.setData({
                    picarray: that.data.picarray
                  })
                  for (let dompa = 0; dompa < that.data.picarray.length; dompa++) {
                    that.data.array.push(that.data.picarray[dompa].name);
                  }
                  that.setData({
                    array: that.data.array
                  })
                }
              })
            }
          }
          if (!passAdd && that.data.getType == goodsre.type) {
            goods.push(goodsre);
            that.setData({
              goods: goods
            })
          }
          if(that.data.getType != goodsre.type){
            wx.showToast({
              title: '请扫描同类型设备',
              icon: "none",
              duration: 2000
            })
          }
          console.log("goods", goods);
          util.closeload();
        } else { //系统执行错误
          util.closeload();
          wx.showToast({
            title: resdata.data.msg,
            icon: "none",
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: "扫描设备出错",
          icon: "none",
          duration: 2000
        })
      }
    })
  },

  handleTitleInput(e) {
    const value = e.detail.value
    this.data.title = value
    this.data.titleCount = value.length
    $digest(this)
  },

  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
    this.data.contentCount = value.length
    $digest(this)
  },

  chooseImage(e) {
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        this.data.images = images.length <= 3 ? images : images.slice(0, 3)
        $digest(this)
      }
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },

  submitForm(data) {
    for (let path of this.data.images) {
      wx.uploadFile({
        url: urlApi.imageUpload(),
        filePath: path,
        name: "file",
        header: {
          "Content-Type": "multipart/form-data",
        },
        formData: {
          "batchNum": data,
        },
        success: function (res) {
          var data = res.data
          console.log(data)
          //do something
        }
      })
    }
  },
  bindPickerChange: function (e) {
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value); //index为数组点击确定后选择的item索引
    console.log('pickerthat.data.picarray', that.data.pitchArray);
    that.setData({
      afadress: that.data.array[e.detail.value],
      pitchArray: []
    })
    that.data.pitchArray.push(that.data.picarray[e.detail.value]);
    that.setData({
      pitchArray: that.data.pitchArray
    })
    console.log('pickerthat.data.picarray', that.data.pitchArray);
  },

  submitGoods: function () {
    
    let that = this;
    if (that.data.pitchArray.length == 0) {
      $Message({
        content: "请选择校正对象"
      });
      return false
    }
    console.log("#########################");
    console.log("that.data.getType",that.data.getType);
    if ("deviceType" == that.data.getType) {
      wx.request({
        url: urlApi.correctingData(),
        header: {
          "Content-Type": "application/json"
        },
        data: {
          correctionDevices: that.data.pitchArray[0],
          goods: that.data.goods,
          getType: that.data.getType,
          openid: wx.getStorageSync('openid')
        },
        method: 'POST',
        //服务端的回掉
        success: function (result) {
          if (result.data.code == 200) {
            console.log(result.data.data);
            that.setData({
              goods:[],
              pitchArray:[],
              afadress:'未选择收货类型'
            })
            wx.showToast({
              title: '收货成功',
              icon: 'success',
              duration: 2000
            })

          }
        }
      })
    }
    if ("goodsType" == that.data.getType) {
      wx.request({
        url: urlApi.correctingData(),
        header: {
          "Content-Type": "application/json"
        },
        data: {
          correctionGoods: that.data.pitchArray[0],
          goods: that.data.goods,
          getType: that.data.getType,
          openid: wx.getStorageSync('openid')
        },
        method: 'POST',
        //服务端的回掉
        success: function (result) {
          if (result.data.code == 200) {
            console.log(result.data.data);
            that.setData({
              goods:[],
              pitchArray:[],
              afadress:'未选择收货类型'
            })

            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 2000
            })

          }
        }
      })
    }

  },
  goodsDelivery: function () { //收货
    let that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res); //获取扫码后的数据
        var path = res.result
        //微信开发者工具 在开发者工具里出现乱码需要decodeURIComponent转义,真机不需要,可以直接使用
        path = path.split('?'); //分割字符串 path[0]等于pages/me/me,path[1]等于scene=table_id%3D8%26shop_id%3D1
        var scene = path[1];
        scene = scene.split("&");
        var exlist = {};
        for (var i = 0; i < scene.length; i++) {
          var b = scene[i].split("=");
          exlist[b[0]] = b[1];
        }
        if (exlist.scanType == "undefined" || exlist.scanType == "" || exlist.scanType == null) {
          util.noService();
          return false;
        }
        if (exlist.scanType == "examine") { //验货收货确认接口
          that.examine(exlist);
        } else { //系统之外的二维码扫描
          let other = 0;
          wx.showToast({
            title: "扫描服务指令不存在",
            icon: "none",
            duration: 2000
          })
        }
      }
    })
  },
  examine: function (exlist) { //验货收货确认接口
    let that = this;
    if (exlist.getType == "deviceType") { //设备收货
      wx.request({ //openid请求后台，获取用户角色。
        url: urlApi.scanExamine(),
        method: "post",
        header: {
          'content-type': 'application/json'
        },
        data: {
          deviceId: exlist.deviceId,
          openId: wx.getStorageSync('openid'),
          getType: exlist.getType
        },
        success: function (resdata) {
          console.log(resdata);
          if (resdata.data.code == 200) {
            wx.showToast({
              title: "收货成功",
              icon: "success",
              duration: 2000
            })
          } else {
            wx.showToast({
              title: resdata.data.msg,
              icon: "none",
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "收货出错",
            icon: "none",
            duration: 2000
          })
        }
      })
    } else if (exlist.getType == "goodsType") { //商品发货
      wx.request({ //openid请求后台，获取用户角色。
        url: urlApi.scanExamine(),
        method: "post",
        header: {
          'content-type': 'application/json'
        },
        data: {
          goodsId: exlist.goodsId,
          boxId: exlist.boxId,
          openId: wx.getStorageSync('openid'),
          getType: exlist.getType
        },
        success: function (resdata) {
          console.log(resdata);
          if (resdata.data.code == 200) {
            wx.showToast({
              title: "收货成功",
              icon: "success",
              duration: 2000
            })
          } else {
            wx.showToast({
              title: resdata.data.msg,
              icon: "none",
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: "收货出错",
            icon: "none",
            duration: 2000
          })
        }
      })
    }
  },
})