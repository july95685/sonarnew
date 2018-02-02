const util = require('../../utils/util');

//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    isFeed:true,
    switchTest:true,
    guideArray:[],
    tipsData:[],
    showTips:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // this.caseId = options.id;
    this.getUserInfo();
  },
  getUserInfo: function(e) {
    console.log('getPageData');
    let that = this;
    let data = [{
          title:"汽车",
          data:[{
          title:"4A广告",
          image:"../../image/wechat-logo.png",
          tag:"微信公众号",
          time:"3分钟前",
          text:"日本人是如何解说大魔王王老吉打哭萌神福原爱的",
          isponit:false,
          switch:false,
          id:"1"
        },{
          title:"VanBronckhorst",
          image:"../../image/wechat-logo.png",
          tag:"今日头条",
          time:"3分钟前",
          text:"#烟不离手 烈酒烧喉",
          isponit:true,
          switch:false,
          id:"2"
        }]
    },{
      title:"小汽车",
      data:[{
          title:"4A广告",
          image:"../../image/wechat-logo.png",
          tag:"微信公众号",
          time:"3分钟前",
          text:"日本人是如何解说大魔王王老吉打哭萌神福原爱的",
          isponit:false,
          switch:false,
          id:"3"
        },{
          title:"VanBronckhorst",
          image:"../../image/wechat-logo.png",
          tag:"今日头条",
          time:"3分钟前",
          text:"#烟不离手 烈酒烧喉",
          isponit:true,
          switch:false,
          id:"4"
        }]
    }];

    data.forEach(function(val,index){
      console.log(val);
      // val.id  = index;
    });

    that.setData({
      guideArray:data
    })


  },
  tapSwitch: function(event) {
    //一定要data-xxx读取传递的参数
    console.log(event.currentTarget);
    var that = this;
    let id = event.currentTarget.id;
    that.data.guideArray.forEach(function(val,index){
      val.data.forEach(function(val,ind){
        if(id === val.id){
          val.switch = !val.switch;
          that.unlockNew(that.data.guideArray);
        }
      });
      // val.id  = index;
    });
  },
  unlockNew:function(array){
    //发送请求获取数据
    // wx.request({
    //   url: ``,
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //   }
    // })
    console.log(array);
    let that = this;
    let data = {
      num:"199"
    };
    that.setData({
      tipsData:data,
      showTips:true
    });
    that.setData({
      guideArray: array
    });
  },
  getMore: function(){
    console.log('getMore');
  },
  weixinPay:function(){
    console.log("weixinPay");
  },
  freePay:function(){
    console.log("freePay");
  },
  weixinShow:function(){

  },
  closeTips: function(){
    let that = this;
    that.setData({
      showTips:false
    });
  }
});
