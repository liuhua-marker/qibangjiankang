// pages/department/department.js
const urlApi = require('../../utils/server.api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    departments: [],
    superiorDepartments: [],
    subordinateDepartments: [],
    clickType:"toShowDoctorList"
  },

  branchList:function(){
    var that = this;
    wx.request({
      url: urlApi.getTableList("department"),
      method: "get",
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (response) {
        var data = response.data.DATAPARAM.KSLIST.KS;

        if (data instanceof Array) {
          // 成功返回 - 初始化
          // data.push({
          //   "id": 1,
          //   "parent": 0,
          //   "did": 11,
          //   "MC": "全科门诊",
          // })
          for (var j of data){
            j.parent = 0;
            j.did = j.ID;
          }
          console.log("科室",data);
          data.map(item => {
            // 父科室
            if (item.parent === 0) {
              that.data.superiorDepartments.push({
                id: item.ID,
                name: item.MC,
                backgroundColor: ''
              });
            } 
          });
          that.data.departments = data;
          // 默认显示父科室数组内第一个元素下的所有子科室，如果有
          if (that.data.superiorDepartments.length > 0) {
            //that.initOrdinateDepartments(that.data.superiorDepartments[0].id);
            that.initOrdinateDepartments(47);
          }
          // setData
          that.setData({
            departments: that.data.departments,
            superiorDepartments: that.data.superiorDepartments
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.branchList();
    var type = Number(options.type);
    console.log("查看类型", type)
    var clickType = type == 0 ? "toShowPayDoctorList" : type == 1 ? "toShowBranchInfo" : type == 2 ? "toShowDoctorList" :"toShowPayDoctorList";
    this.setData({
      clickType: clickType
    })
    console.log("事件", this.data.clickType)
  },

  /**
	 * 初始化子科室数组
	 */
  initOrdinateDepartments: function (targetId) {
    // 初始化 - 清空数组
    this.data.subordinateDepartments.splice(0, this.data.subordinateDepartments.length);
    // 设置父科室项目背景色
    this.data.superiorDepartments.map(item => {
      if (item.id === targetId) {
        item.backgroundColor = '#e2e2e2';
      } else {
        item.backgroundColor = 'white';
      }
    });
    // 初始化子科室数组
    this.data.departments.map(item => {
      if (item.did === targetId) {
        this.data.subordinateDepartments.push({
          id: item.ID,
          name: item.MC
        });
      }
    });
    // var arr = this.data.departments;
    // for(var i = 0;i<20;i++){
    //   if (arr[i].parent === targetId) {
    //     this.data.subordinateDepartments.push({
    //       id: arr[i].ID,
    //       name: arr[i].MC
    //     });
    //   }
    // }

    // setData
    this.setData({
      superiorDepartments: this.data.superiorDepartments,
      subordinateDepartments: this.data.subordinateDepartments
    });
  },

	/**
	 * 
	 */
  toShowOrdinateDepartments: function (e) {
    this.initOrdinateDepartments(e.currentTarget.dataset.departmentid);
  },

  /**
	 * 
	 */
  toShowPayDoctorList: function (e) {
    console.log("列表", JSON.stringify(e.currentTarget.dataset.department))
    wx.navigateTo({
      url: '/pages/reserve/reserve?id=' + JSON.stringify(e.currentTarget.dataset.department.id)
    })
  },

  /**
	 *
	 */
  toShowBranchInfo: function (e) {
    wx.navigateTo({
      url: '/pages/branchInfo/branchInfo?id=' + JSON.stringify(e.currentTarget.dataset.department.id)
    })
  },

  /**
	 * 跳转 - 列表
	 */
  toShowDoctorList: function (e) {
    wx.navigateTo({
      url: '/pages/doctorList/doctorList?id=' + JSON.stringify(e.currentTarget.dataset.department.id)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})