// pages/signingStatistics/signingStatistics.js
import * as echarts from '../../components/ec-canvas/echarts';
var loadMoreView, page
const http = require('../../utils/http')
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    active0: '0',
    active1: '0',
    ec: {
      onInit: null
    },
    items: [],
    optionX:[],
    optionY:[],
    chartData:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentOrgName: options.currentOrgName,
      currentBid: options.currentBid,
      roleCode: options.roleCode,
    })
    this.loadData(true)
    this.loadTopData(true)
  },
  onReady:function(){
    this.echarts=this.selectComponent('#mychart-dom-line')
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  initChart:function (canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);
    var option = {
      title: {
        text: '签约门店趋势报表',
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 14
        }
      },
      color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
      // legend: {
      //   data: ['A', 'B', 'C'],
      //   top: 30,
      //   left: 'center',
      //   backgroundColor: 'red',
      //   z: 100
      // },
      grid: {
        containLabel: true,
        bottom: 20,
        left: 0,
        right: 12
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.optionX,
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
        // show: false
      },
      series: [{
        name: 'A',
        type: 'line',
        smooth: true,
        data: this.optionY
      }]
    };
  
    chart.setOption(option);
    return chart;
  },
  loadTopData: function (showLoading) {
    let openid = wx.getStorageSync('openid');
    var that = this
    var code = '';
    switch (this.data.active0) {
      case "0":
        code = 'count_week'
        break
      case "1":
        code = 'count_month'
        break
      case "2":
        code = 'count_year'
        break
    }
    console.log(code)
    http.post({
      showLoading: showLoading,
      data: {
        "code": "20063",
        "whereValue": {
          organId: that.data.currentBid || '1252896451223093248'||wx.getStorageSync('organId'),
        }
      },
      success: (res) => {
        console.log(res.data)
        that.optionX=[]
        that.optionY=[]
        let chartData=[]
        res.data.forEach((item)=>{
          if(item.count_type ===code){
            chartData:item
            that.optionX.push(item.count_time)
            that.optionY.push(item.shop_num)
          }
        })
        console.log( that.optionX)
        that.setData({
          chartData:chartData,
          ec: {
            onInit: that.initChart,
          },
        })
        console.error('that.data.ec',that.data.chartData)
        this.echarts.init()
      },
      fail: () => {
        console.error("fail")
      }
    })
  },
  loadData: function (showLoading) {
    let openid = wx.getStorageSync('openid');
    var that = this
    var code = '';
    switch (this.data.active1) {
      case "0":
        code = 'count_all'
        break
      case "1":
        code = 'count_month'
        break
      case "2":
        code = 'count_week'
        break
    }
    console.log(code)
    this.setData({
      type:code
    })
    http.post({
      showLoading: showLoading,
      data: {
        "code": '20064',
        "whereValue": {
          organId: that.data.currentBid || wx.getStorageSync('organId'),
        }
      },
      success: (res) => {
        console.log(res.data)
        let items = []
        res.data.forEach(item=>{
          if(item.count_type === code){
            items.push(item)
          }
        })
        console.error(items)
        this.setData({
          items: items
        })
      },
      fail: () => {
        console.error("fail")
        if (page != 0) {
          loadMoreView.loadMoreFail()
        }
      }
    })
  },
  hanldClick(e) {
    console.log(e.currentTarget.dataset.index)
    var type = e.currentTarget.dataset.type
    var data = {}
    data['active' + type] = e.currentTarget.dataset.index
    this.setData(data)
    if (type === '1') {
      this.loadData()
    }else{
      this.loadTopData()
    }
  }
})