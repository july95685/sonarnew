const util = require('../../utils/util');
const { getCaseDetail } = require('../../service');
var WxParse = require('../../wxParse/wxParse.js');


const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    caseDetail: {},
    articleContent:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.caseId = options.id;
    this.loadData();
  },

  loadData() {

    let that = this;

    wx.showLoading({
      title: '加载中',
    })


    

    getCaseDetail({
      caseId: this.caseId,
      success: (data)=>{
        
        data.timeString = util.formatTime(new Date(data.createdAt), true);
        data.article = data.body ? util.extractContent(data.body) : "";
        data.stats = util.formatStats(data.stats);
        WxParse.wxParse('articleContent', 'html', '<div>' + (data.body ? data.body.replace(/data-src/g, "src") : "<div></div>") + '</div>', that, 0);

        that.setData({
          caseDetail: data
        });
        wx.setNavigationBarTitle({
          title: data.account.name
        })
      },
      complete: ()=>{
        wx.hideLoading()
      }
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
    let { title, id, shareCover , cover} = this.data.caseDetail
    return {
      title: title,
      path: '/pages/article/index?id=' + id,
      imageUrl: shareCover,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
  }
})