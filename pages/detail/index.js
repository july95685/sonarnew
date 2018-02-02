const util = require('../../utils/util');
const { getCaseDetail, getCaseComments } = require('../../service');
const timeago = require('../../utils/timeago');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    caseDetail:{},
    caseComments: [],
    loadingComment: false,

    currentIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.caseId = options.id;
    this.loadData();
  },

  loadComments(postType){
    let that = this;

    that.setData({
      loadingComment: true
    });

    getCaseComments({
      caseId: this.caseId,
      // params:{
      //   limit:10,
      //   skip:0
      // },
      success: function(data){

        let caseComments = data.map((v) => {
          v.createAt = Number(v.createAt) * 1000
          v.timeStr = timeago().format(v.createAt, 'zh_CN')
          if (postType === 'weibo') {
            v.likeNum = v.stats.likesCount
            v.nickName = v.account.name
            v.richContent = util.parseRichTxt(v.text, postType)
            v.logoUrl = v.account.logo
          }

          if (postType === 'wechat') {
            v.richContent = util.parseRichTxt(v.content, postType)
          }

          return v
        })

        caseComments.sort(function (v1, v2) {
          return v2.createAt - v1.createAt
        })

        that.setData({
          caseComments
        })
      },
      complete: function(){
        that.setData({
          loadingComment: false
        })
      }
    })
  },


  loadData(){

    let that = this;

    wx.showLoading({
      title: '加载中',
    })


    getCaseDetail({
      caseId: this.caseId,
      success: (data)=>{

        data.timeString = util.formatTime(new Date(data.createdAt), true);
        data.dateString = data.timeString.split(" ")[0];
        // data.summary = data.body ? util.extractContent(data.body.raw) : "";
        data.qrcode = `http://open.weixin.qq.com/qr/code/?username=${data.account.key}`;
        data.stats = util.formatStats(data.stats);
        data.parsedDesc = util.parseRichTxt(data.title, data.postType);
        
        data.isVideoType = ((data.media || []).indexOf('video')) > -1 && (data.video)
        data.isImageType = ((data.media || []).indexOf('image') > -1) && ((data.images || []).length)
        
        data.brand = data.brand || {}
        if(Array.isArray(data.brands) && data.brands.length){
          let brand = data.brands[0]
          data.brand = {
            logo: brand.logo.path,
            name: brand.chineseName,
            id: brand._id
          }
        }
        data.account.logo = data.account.logo.path

        let t = data.timeString.split(' ');
        let d = t[0].split('.');
        data.weiboFrom = `${d[1]}月${d[2]}日 ${t[1]} 来自 ${data.device}`;

        that.setData({
          caseDetail: data
        })

        that.loadComments(data.postType);

      },
      complete: ()=>{
        wx.hideLoading()
      }
    })

  },


  enterAccount(){
    let { account } = this.data.caseDetail

    wx.navigateTo({
      url: `../profile/index?id=${account.id || account._id}&type=kol`
    });
  },

  enterBrand() {
    let { brands = [] } = this.data.caseDetail
    if(brands.length && brands[0]._id){
      wx.navigateTo({
        url: `../profile/index?id=${brands[0]._id}&type=brand`
      });
    }
  },

  previewQrCode(ev){
    let {source} = ev.currentTarget.dataset;
    wx.previewImage({
      current: source, // 当前显示图片的http链接
      urls: [source] // 需要预览的图片http链接列表
    })
  },

  previewWeiboImage(ev){
    let {source} = ev.currentTarget.dataset;
    wx.previewImage({
      current: source, // 当前显示图片的http链接
      urls: this.data.caseDetail.images // 需要预览的图片http链接列表
    })
  },

  enterArticle: function(){
    wx.navigateTo({
      url: `../article/index?id=${this.caseId}`
    });
  },

  swiperChange: function(event){
    let {current} = event.detail
    console.log(current)
    console.log(this);
    this.setData({
      currentIndex: current
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let { title, id, shareCover, cover} = this.data.caseDetail
    return {
      title: title,
      path: '/pages/detail/index?id=' + id,
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