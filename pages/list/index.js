const util = require('../../utils/util');
const moment = require('../../utils/moment');
const popup = require('../templates/popup');
const { getCaseList } = require('../../service');

//index.js
//获取应用实例
const app = getApp()

let _wH = 0;

const LIMIT = 10;
// 当前PAGE
let currentPage = 0;
// 当前分享的内容
let caseDetail = {};


Page({
  data: {
    caseList: [],
    hasMore: true,
    isLoading: false
  },

  onLoad: function (options) {
    // 获得屏幕高度
    wx.getSystemInfo({
      success: (res)=>{
        let { windowHeight } = res;
        _wH = windowHeight;
      }
    })

    this.params = `${options.type}Id=${options.id}`

    wx.setNavigationBarTitle({
      title:options.title
    })

    currentPage = 0
    
    this.loadData(currentPage);
  },

  onShow(){
    // 初始化弹窗
    popup.initPopup(this, 'caseList', (detail) => {
      caseDetail = detail
    })
  },


  // 分享设置
  onShareAppMessage(res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: caseDetail.title,
        path: '/pages/detail/index?id=' + caseDetail.id,
        imageUrl: caseDetail.shareCover,
        success: function () {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    } else {
      return {
        title: 'Brandtail',
        path: '/pages/index/index',
        success: function () {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    }
  },

  // 进入详情页
  enterDetail(ev){
    let { id } = ev.currentTarget.dataset;
    if (id){
      wx.navigateTo({
        url: `../detail/index?id=${id}`
      })
    }
  },

  loadData(page, isPull){

    let that = this;
    let {caseList} = this.data;

    that.setData({
      isLoading: true
    })

    wx.request({
      url: `https://brandtail.fooads.com/api/v2/case/list?limit=${LIMIT}&skip=${page * LIMIT}&${this.params}`, // ${this.formatParams()
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        
        if(res.statusCode === 200 && res.data){

          let newCaseList = util.formatCaseList(res.data);

          caseList = isPull ? newCaseList : caseList.concat(newCaseList);

          currentPage = page;

          that.setData({
            caseList,
            hasMore: newCaseList.length == 10
          });

        }
        
      },
      complete: function(){
        that.setData({
          isLoading: false
        })
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadData(0, true);
  },

  // 到达底部进行刷新
  onReachBottom(){
    let {hasMore, isLoading} = this.data;
    if (!hasMore || isLoading) return;
    this.loadData(currentPage + 1);
  }


})
