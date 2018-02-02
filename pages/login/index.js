const util = require('../../utils/util');

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
        app.globalData.userInfo = res.userInfo
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      })
    }
    })
    }
  },
  login: function(e){
    console.log(e);
    //一定要data-xxx读取传递的参数
    console.log(e.currentTarget.dataset);
    wx.login({
        success: res => {
          //成功
        wx.navigateTo({
          url: `../feed/index`
        });
          console.log(res);
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
});
