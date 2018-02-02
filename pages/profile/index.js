const util = require('../../utils/util')
const moment = require('../../utils/moment')
const { getCaseList, getBrandDetail, getAccountDetail, getKolBrands, getBrandKols } = require('../../service')
const popup = require('../templates/popup')

const LIMIT = 10

let caseDetail = {}

let casePage = 0
let entityPage = 0
let hasMoreCase = true
let hasMoreEntity = true

const typeStringEnum = {
  'weibo':"微博",
  'wechat':"微信公众号",
  "zhihu":"知乎"
}

Page({

  /**
   * 页面的初始数据
   */
  data: {

    tabIndex: 0,
    caseList: [],
    entityList: [],

    entityDetail: null,
    entityType: '',

    loadingCaseList: false,
    loadingEntityList: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    this.entityId = options.id;
    this.entityType = options.type;

    this.setData({
      entityType: this.entityType
    })

    casePage = 0
    entityPage = 0


    this.loadEntityDetail();
    this.loadEntityList(0);
  },


  onShow() {
    // 初始化弹窗
    popup.initPopup(this, 'caseList', (detail) => {
      caseDetail = detail
    });
  },

  loadCaseList(page, isPull){

    let that = this

    let params = {
      skip: page * LIMIT,
      limit: LIMIT
    }

    if(this.entityType === 'brand'){
      params['brandId'] = this.entityId
    } else {
      params['accountId'] = this.entityId
    }

    if(!isPull){
      that.setData({
        loadingCaseList: true
      })
    }

    getCaseList({
      params: params,
      success: (data) => {

        let { caseList } = that.data
        let newCaseList = util.formatCaseList(data)
        caseList = isPull ? newCaseList : caseList.concat(newCaseList)
        
        
        casePage = page
        hasMoreCase = newCaseList.length == LIMIT

        that.setData({
          caseList
        })

      },
      complete: () => {
        that.setData({
          loadingCaseList: false
        })
        wx.stopPullDownRefresh()
      }
    })
  },



  loadEntityList(page, isPull){

    let that = this;
    let params = {
      limit: LIMIT,
      skip: page * LIMIT
    }

    if (!isPull){
      that.setData({
        loadingEntityList: true
      })
    }

    if (that.entityType === 'brand'){
      getBrandKols({
        brandId: that.entityId,
        params: params,
        success: success,
        complete: complete
      })
    } else {
      getKolBrands({
        accountId: that.entityId,
        params: params,
        success: success,
        complete: complete
      })
    }

    function success(data){
      that.handleEntityList(data, page, isPull)
    }

    function complete(){
      that.setData({
        loadingEntityList: false
      })
      wx.stopPullDownRefresh()
    }
  },

  handleEntityList(data, page, isPull){

    let { entityList} = this.data
    
    let newEntityList = data.map((v) => {
      v.id = v.id || v._id
      v.tags = []
      if (this.entityType === 'brand') {
        v.name = v.account.name
        v.latestPost = v.account.about
        v.logo = v.account.logo.path
        v.id = v.account._id
        v.tags = [{
          icon: 'icon-' + v.postType,
          text: [typeStringEnum[v.postType]]
        }]
      } else {
        let {brands} = v
        if(brands.length){
          let brand = brands[0]
          
          v.name = brand.chineseName
          v.latestPost = brand.about
          v.logo = brand.logo.path
          v.id = brand._id
          v.tags = (brand.industries || []).map((v) => {
            return {
              text: v.display
            }
          })
        }
      }
      return v;
    })

    entityList = isPull ? newEntityList : entityList.concat(newEntityList)

    entityPage = page
    hasMoreEntity = newEntityList.length == LIMIT

    this.setData({
      entityList
    })

  },

  enterEntity(ev){
    let { id } = ev.currentTarget.dataset
    wx.navigateTo({
      url: `../profile/index?id=${id}&type=${this.entityType === 'brand' ? 'kol' : 'brand'}`
    });
  },

  loadEntityDetail(){

    let that = this;

    wx.showLoading({
      title: '加载中',
    })

    if(this.entityType === 'brand'){
      getBrandDetail({
        brandId: this.entityId,
        success: function(data){
          data.name = data.name || data.chineseName
          data.logo = data.logo.path
          that.setData({
            entityDetail: data
          })
          that.loadCaseList(0);
          wx.setNavigationBarTitle({
            title: data.name
          })
        },
        complete: function(){
          wx.hideLoading()
        }
      })
    } else {
      getAccountDetail({
        accountId: this.entityId,
        success: function (data) {
          data.logo = data.logo.path
          that.setData({
            entityDetail: data
          })
          that.loadCaseList(0);
          wx.setNavigationBarTitle({
            title: data.name
          })
        },
        complete: function () {
          wx.hideLoading()
        }
      })
    }

  },

  switchTab: function(ev){
    let { index } = ev.currentTarget.dataset
    this.setData({
      tabIndex: index
    })
  },

  // 进入详情页
  enterDetail(ev) {
    let { id } = ev.currentTarget.dataset;
    if (id) {
      wx.navigateTo({
        url: `../detail/index?id=${id}`
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let {tabIndex} = this.data
    tabIndex == 0 ? this.loadCaseList(0, true) 
    : this.loadEntityList(0, true)
  },

  // 到达底部进行刷新
  onReachBottom() {
    let { tabIndex, loadingCaseList, loadingEntityList} = this.data
    if(tabIndex == 0){

      if(!hasMoreCase || loadingCaseList) return
      this.loadCaseList(casePage + 1)

    } else {

      if (!hasMoreEntity || loadingEntityList) return
      this.loadEntityList(entityPage + 1)

    }

  },
  

  // 分享设置
  onShareAppMessage(res) {

    let { entityDetail} = this.data
  
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
        title: entityDetail.name,
        path: `/pages/profile/index?type=${this.entityType}&id=${this.entityId}`,
        success: function () {
          wx.showToast({
            title: '分享成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    }
  }
})