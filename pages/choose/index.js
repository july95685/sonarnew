const util = require('../../utils/util');

//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    isFeed:true,
    chooseArray:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // this.caseId = options.id;
    this.getChooseInfo();
  },
  getChooseInfo: function(e) {
    console.log('getChooseInfo');
    let that = this;
    let data = [{
      image:"../../image/wechat-logo.png",
      title:"宝马",
      text:"BMW的前身是一家飞机工厂,成立于1916年3月7日，最初以制造流线型的双翼侦察机闻名于世..."
    },{
      image:"../../image/wechat-logo.png",
      title:"宝马",
      text:"BMW的前身是一家飞机工厂,成立于1916年3月7日，最初以制造流线型的双翼侦察机闻名于世..."
    }];

    that.setData({
      chooseArray:data
    })
  },
  entereFeed: function(){
    wx.navigateTo({
      url: `../feed/index`
    })
  }
});
