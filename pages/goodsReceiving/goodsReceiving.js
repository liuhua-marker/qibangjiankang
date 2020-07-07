const urlApi = require('../../utils/server.api.js')
const { $Message } = require('../../iview/base/index');
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
    afadress: "未选择发货地址",
    pitchArray: [],//选中的发货地址
    currentBid:"",


  },
  onLoad: function (options) {
    $init(this)
    let that = this;
    // that.setData({
    //   goods: wx.getStorageSync('userRole'), //获取userRole(用户角色),
    // })
 
    that.setData({
      goodsSize: that.data.goods.length,
      currentBid:  options.currentBid
    })
    console.log("options.currentBid    " + options.currentBid);
    //根据token获取下级发货人员
    wx.request({
      url: urlApi.getSelfChild(),
      header: {
        "Content-Type": "application/json",
        'Authorization': wx.getStorageSync("token"),
        'bid': that.data.currentBid
      },
      method: 'GET',
      data: {
        'bid': that.data.currentBid
      },
      //服务端的回掉
      success: function (result) {
        //that.data.array.push(result.data.data);
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
        // console.log(that.data.array);
        that.setData({
          array: that.data.array
        })
      }
    })


  },
  deleteRece: function (e) { //删除货物
    console.log(e);
    let that = this;
    wx.scanCode({
      success: (res) => {
        console.log(res); //获取扫码后的数据
        let that = this;
        
        var path = res.result
        //微信开发者工具 在开发者工具里出现乱码需要decodeURIComponent转义,真机不需要,可以直接使用
        path = path.split('?');   //分割字符串 path[0]等于pages/me/me,path[1]等于scene=table_id%3D8%26shop_id%3D1
        var scene = path[1];
        scene = scene.split("&");
        var deletelist = {};
        for (var i = 0; i < scene.length; i++) {
          var b = scene[i].split("=");
          deletelist[b[0]] = b[1];
        }
        if (deletelist.otherType == "undefined" || deletelist.otherType == "" || deletelist.otherType == null) {
          wx.showToast({
            title: "不支持服务类型",
            icon: "none",
            duration: 2000
          })
          return false;
        }

        let dePass = false;
        console.log(that.data.goods);
        for (let del = 0; del < that.data.goods.length; del++) { //将职位在页面上显示出来
          console.log(that.data.goods[del]);
          for (let remn = 0; remn < that.data.goods[del].length; remn++) {
            if (that.data.goods[del][remn].deviceDTO.id == deletelist.deviceId || that.data.goods[del][remn].deviceDTO.id == deletelist.goodsId) {
              if (that.data.goods[del].length == "1") { //如果长度为1，那么直接删除此数组，避免出现为0的空数组
                that.data.goods.splice(del, 1);
                dePass = true;
                break;
              } else {
                that.data.goods[del].splice(remn, 1);
                dePass = true;
                break;
              }
            }
          }
          if (dePass) {
            break
          }
        }
        that.setData({
          goods: that.data.goods
        })
        console.log(that.data.goods);
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
        path = path.split('?');   //分割字符串 path[0]等于pages/me/me,path[1]等于scene=table_id%3D8%26shop_id%3D1
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
  deliverGoods: function (res) {
    let that = this;
    wx.request({ //openid请求后台，获取用户角色。
      url: urlApi.selectGoodsData(),
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
          if (gooslist.length > 0) {
            let passIn = false; //用于判断此次数据里面是否包含
            for (let i = 0; i < gooslist.length; i++) { //将职位在页面上显示出来
              console.log(gooslist[i]);
              for (let y = 0; y < gooslist[i].length; y++) {
                if (gooslist[i][y].id == goodsre.id) { //缓存数据中有这条新数据
                  passIn = true;
                }
              }
            }
            let stopfor = false; //判断第一层循环是否跳出循环
            let passType = false; //判断过往的数据有没有包含
            let numK = 0;
            let numP = 0;
            let goodsk = 0;
            if (passIn == false) { //没有包含，新增数据
              console.log(gooslist);
              for (let k = 0; k < gooslist.length; k++) { //将职位在页面上显示出来
                console.log(gooslist.length);
                goodsk = goodsk + 1;
                for (let p = 0; p < gooslist[k].length; p++) {
                  console.log(gooslist[k].length);
                  console.log(gooslist[k][p].deviceDTO.deviceType);
                  if (gooslist[k][p].deviceDTO.deviceType == goodsre.deviceDTO.deviceType) { //发现同类型的数据直接往该类型数据里面加一
                    passType = true;
                    numK = k;
                    numP = p; //记录存在的位置，好直接定位跟踪添加数据
                    stopfor = true;
                    break;
                  }
                }
                if (goodsk == gooslist.length || passType == true) {
                  if (passType == true) { //直接定位添加数据
                    gooslist[numK].push(goodsre);
                    console.log(gooslist);
                    that.setData({
                      goods: gooslist
                    })
                    stopfor = true;

                  } else { //添加新的数据
                    let puNoList = [
                      [goodsre]
                    ];
                    // puList.push(goodsre);
                    that.data.goods = that.data.goods.concat(puNoList);
                    that.setData({
                      goods: that.data.goods
                    })
                    console.log(that.data.goods);
                    stopfor = true;
                  }
                }
                if (stopfor) {
                  break;
                }
              }
              let sumGoodss = 0;
              for (let s = 0; s < that.data.goods.length; s++) { //将职位在页面上显示出来
                console.log(that.data.goods[s]);
                for (let n = 0; n < that.data.goods[s].length; n++) {
                  sumGoodss = sumGoodss + 1;
                }
              }
              that.setData({
                sumGoods: sumGoodss
              })

              wx.showToast({
                title: "扫描成功",
                icon: "none",
                duration: 2000
              })
            } else {
              wx.showToast({
                title: "请勿重复扫描",
                icon: "none",
                duration: 2000
              })
            }
          } else { //第一次扫描直接新增数据
            let puList = [
              [goodsre]
            ];
            // puList.push(goodsre);
            console.log(puList);
            that.data.goods = that.data.goods.concat(puList);
            that.setData({
              goods: that.data.goods,
              sumGoods: 1
            })
            console.log(that.data.goods);
            wx.showToast({
              title: "扫描成功",
              icon: "none",
              duration: 2000
            })
          }
        } else { //系统执行错误
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
  photograph: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        _this.setData({
          tempFilePaths: res.tempFilePaths
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
        content: "请选择下级发货对象"
      });
      return false
    }
    else if (this.data.sumGoods == 0) {
      $Message({
        content: "请选择扫码发货"
      });
      return false
    }
    else if (this.data.images.length == 0) {
      $Message({
        content: "请选择图片拍照上传"
      });
      return false
    }
    console.log("that.data.currentBid",that.data.currentBid);
    wx.request({
      url: urlApi.affirmGoods(),
      header: {
        "Content-Type": "application/json"
      },
      data: {
        qbBusinessTreeBO: that.data.pitchArray[0],
        flow: that.data.goods,
        openid: wx.getStorageSync("openid"),
        parentId: that.data.currentBid//当前bId存储为收货对象的父Id
      },
      method: 'POST',
      //服务端的回掉
      success: function (result) {
        if (result.data.code == 200) {
          console.log(result.data.data);
          that.submitForm(result.data.data);
          wx.switchTab({
            url: '../../pages/home/home'
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

})