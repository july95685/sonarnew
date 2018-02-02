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
  formSubmit: function(e) {
    var that = this;
    var formData = e.detail.value;
    console.log(formData);
    wx.navigateTo({
      url: `../success/index`
    })
    // wx.request({
    //   url: 'http://test.com:8080/test/socket.php?msg=2',
    //   data: formData,
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: function(res) {
    //     console.log(res.data)
    //     that.modalTap();
    //   }
    // })
  }
});
