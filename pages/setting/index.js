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
  moveToApplication: function(){
    wx.navigateTo({
      url: `../application/index`
    })
  },
  onShareAppMessage: function () {
    // let { title, id, shareCover, cover} = this.data.caseDetail
    return {
      title: "test",
      path: '/pages/detail/index?id=' + 1234,
      //imageUrl: shareCover,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
  }
});
