const util = require('../../utils/util');

//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    isFeed:true
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
  },
  moveToFeed:function(){
    wx.navigateTo({
      url: `../feed/index`
    })
  },
  moveToApplication:function(){
    wx.navigateTo({
      url: `../application/index`
    })
  }
});
