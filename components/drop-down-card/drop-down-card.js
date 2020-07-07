// components/drop-down-card/drop-down-card.js
Component({
  //启用插槽
	options:{
		multipleSlots:true
	},
  /**
   * 组件的属性列表
   */

  properties: {
    listData: {
      type: Object,
      // value: {},
    },
    speech: {
      type: Array,
      value: [],
    },
    noBorder:{
      type: String,
      value: "",
    },
    noShadow:{
      type: String,
      value: "",
    },
    tabIndex:{
      type: String,
      value: "0",
    },
    addSlot:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow:false,
    speechcraftRuleEntityList:[],
    practiseType:{
      1:'每日',
      7:'每周',
      30:'每月',
    }
  },
  ready: function () {
    // this.setData({
    //   speech:this.data.listData.speechcraftRuleEntityList
    // })
    // console.log(this.data.listData)
    // console.log(this.data.addSlot)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    dropDown(e){
      console.log(e)
      // let index = e.currentTarget.dataset.index
      // let isShow = this.data.isShow
      // isShow[index] = !isShow[index];
      let speechcraft =e.currentTarget.dataset.speechcraft
      // console.log(speechcraft)
      if(this.data.tabIndex ==='1'){
        wx.navigateTo({
          url: '/pages/speechTraining/speechTraining?speechcraft='+JSON.stringify(speechcraft),
        })
        return
      }
      // if(this.data.tabIndex ==='3'){
      //   wx.navigateTo({
      //     url: '/pages/speechDetail/speechDetail?speechcraft='+JSON.stringify(speechcraft),
      //   })
      //   return
      // }
      let data =  this.data.listData
      data.isShow = this.data.isShow
      this.triggerEvent("dropDown", data)
      this.setData({
        isShow:!this.data.isShow,
        speechcraftRuleEntityList:this.data.listData?this.data.listData.speechcraftRuleEntityList:[]
      })
    },
    setSpeechData(){
      console.log('setSpeechData',this.data.listData)
      this.setData({
        speechcraftRuleEntityList:this.data.listData?this.data.listData.speechcraftPackagePlanEntities:[]
      })
    },
    updateData(data){
      this.setData({
        listData:data
      })
    }
  }
})