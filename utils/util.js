const urlApi = require('./server.api.js')
const app = getApp();
const formatTime = (val) => {
  const date = new Date(val)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTime2 = (val) => {
  const date = new Date(val)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const format = timestamp=> {
  var date = new Date(timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}

function getRandom(min, max) {
  var r = Math.random() * (max - min);
  var re = Math.round(r + min);
  re = Math.max(Math.min(re, max), min);
  return re;
}

function isInArray(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true;
    }
  }
  return false;
}

function isInObject(arr,value,data) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i][data]) {
      return arr[i];
    }
  }
  return false;
}
/**
 * 检测当前的小程序
 * 是否是最新版本，是否需要下载、更新
 */
function checkUpdateVersion() {
  //判断微信版本是否 兼容小程序更新机制API的使用
  if (wx.canIUse('getUpdateManager')) {
    //创建 UpdateManager 实例
    const updateManager = wx.getUpdateManager();
    //检测版本更新
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        //监听小程序有版本更新事件
        updateManager.onUpdateReady(function() {
          //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
          updateManager.applyUpdate();
        })
        updateManager.onUpdateFailed(function() {
          // 新版本下载失败
          wx.showModal({
            title: '已经有新版本喽~',
            content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~',
          })
        })
      }
    })
  } else {
    //TODO 此时微信版本太低（一般而言版本都是支持的）
    wx.showModal({
      title: '溫馨提示',
      content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    })
  }
}

function noService(){
  wx.showToast({
    title: "不支持服务类型",
    icon: "none",
    duration: 2000
  })
}

function loading(){
  // wx.hideLoading();
  wx.showLoading({title: '加载中', icon: 'loading',mask:true});
}

function closeload(){
  wx.hideLoading();
}
// 手机号码验证
function validatePhone(phone) {
  const re = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
  return re.test(phone)
}

function getQueryString(url, name) {
  var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  var r = url.substr(1).match(reg)
  if (r != null) {
    return r[2]
  }
  return null;
}

// 语音识别
var plugin = requirePlugin("WechatSI")

var innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.onError((res) => {
  // 播放音频失败的回调
})




function playTTS(text) {
  //need to add WXAPP plug-in unit: WechatSI
  plugin.textToSpeech({
    lang: "zh_CN",
    tts: true,
    content: text,
    success: function (res) {
      log("succ tts", res.filename)
      innerAudioContext.src = res.filename;
      innerAudioContext.play()
    },
    fail: function (res) {
      log("fail tts", res)
    }
  })
}

function stopTTS() {
  innerAudioContext.stop();
}

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  getRandom: getRandom,
  isInArray: isInArray,
  isInObject: isInObject,
  format: format,
  checkUpdateVersion:checkUpdateVersion,
  noService:noService,
  loading:loading,
  closeload:closeload,
  validatePhone:validatePhone,
  getQueryString: getQueryString,
  playTTS: playTTS,
  stopTTS: stopTTS,
}
