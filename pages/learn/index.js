const util = require('../../utils/util');
const moment = require('../../utils/moment');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oneTabIndex: 1,
    twoTabIndex: 1,
    pictexts:[],
    swiperIndex:{
      1:0,
      2:0,
      3:0
    },
    qas:[{
      title: '比想象中更极客，戴森是怎样一家公司？',
      parsedDesc: util.parseRichTxt('发明家詹姆斯 · 戴森认为，不能解决问题的机器，绝对不…'),
      stats: {
        likesCount: "694",
        commentsCount: "287"
      },
      titleClass:'bt-1line',
      descClass: 'bt-1line fa-mt5',
      brand: {
        logo: 'http://falion.cdn.fooads.com/zhihu_brand_001.png'
      },
      account: {
        logo: 'http://falion.cdn.fooads.com/zhihu_logo.png'
      },
      timeString: "2016.05.10",
      cover: 'http://falion.cdn.fooads.com/zhihu_cover_001.jpg'
    },{
        title: '家里从来不洗碗是一种怎样的体验？',
        parsedDesc: util.parseRichTxt('看了下知乎上这些回答数过百的提问，发现「今天谁洗碗…'),
        stats: {
          likesCount: "3,699",
          commentsCount: "896"
        },
        titleClass: 'bt-1line',
        descClass: 'bt-1line fa-mt5',
        brand: {
          logo: 'http://falion.cdn.fooads.com/zhihu_brand_002.png'
        },
        account: {
          logo: 'http://falion.cdn.fooads.com/zhihu_logo.png'
        },
        timeString: "2016.10.20",
        cover: 'http://falion.cdn.fooads.com/zhihu_cover_002.jpg'
    },{
        title: '如何优雅地治愈「路怒症」？',
        parsedDesc: util.parseRichTxt('相信我们每个人身边都有这样一个人：平时口碑非常不错...'),
        stats: {
          likesCount: "1,021",
          commentsCount: "457"
        },
        titleClass: 'bt-1line',
        descClass: 'bt-1line fa-mt5',
        brand: {
          logo: 'http://falion.cdn.fooads.com/zhihu_brand_003.png'
        },
        account: {
          logo: 'http://falion.cdn.fooads.com/zhihu_logo.png'
        },
        timeString: "2016.10.24",
        cover: 'http://falion.cdn.fooads.com/zhihu_cover_003.jpg'
    }],


    videos:[{
        type: 'video',
        desc: '每个女人都是一颗闪亮的宝石，传奇时尚首饰品牌施华洛世奇推出最新#施华洛世奇#Remix系列首饰，亦如女人般拥...',
        parsedDesc: util.parseRichTxt('每个女人都是一颗闪亮的宝石，传奇时尚首饰品牌施华洛世奇推出最新#施华洛世奇#Remix系列首饰，亦如女人般拥...'),
        stats:{
          playsCount: "120,000",
          likesCount: "1,658",
          commentsCount: "17"
        },
        descClass:'bt-2line fa-mt20',
        brand: {
          logo: 'http://falion.cdn.fooads.com/meipai_brand_001.jpg'
        },
        account: {
          logo: 'http://falion.cdn.fooads.com/meipai_kol_001.jpg'
        },
        timeString:"2017.09.21",
        cover:'http://falion.cdn.fooads.com/meipai_cover_001.jpg'
    },{
        type: 'video',
        desc: '#最美上海迪士尼# 什么样的爱情才算是最美的爱情呢？我想最美的爱情就是我的身边有你。虽然我还没拥有这样最美…',
        parsedDesc: util.parseRichTxt('#最美上海迪士尼# 什么样的爱情才算是最美的爱情呢？我想最美的爱情就是我的身边有你。虽然我还没拥有这样最美…'),
        stats: {
          playsCount: "161.1万",
          likesCount: "44,967",
          commentsCount: "1,837"
        },
        descClass: 'bt-2line fa-mt20',
        brand:{
          logo:'http://falion.cdn.fooads.com/meipai_brand_002.jpg'
        },
        account:{
          logo:'http://falion.cdn.fooads.com/meipai_kol_002.jpg'
        },
        timeString: "2016.11.03",
        cover:'http://falion.cdn.fooads.com/meipai_cover_002.jpg'
    },{
        type: 'video',
        desc:'#酷跑团战，极速前进# 酷跑团战，极速前进# 女神插班众人欢，获其芳心实在难。好友无意透天机，丝丝最后很得意...',
        parsedDesc: util.parseRichTxt('#酷跑团战，极速前进# 酷跑团战，极速前进# 女神插班众人欢，获其芳心实在难。好友无意透天机，丝丝最后很得意...'),
        brand: {
          logo: 'http://falion.cdn.fooads.com/meipai_brand_003.jpg'
        },
        descClass: 'bt-2line fa-mt20',
        account: {
          logo: 'http://falion.cdn.fooads.com/meipai_kol_003.jpg'
        },
        stats: {
          playsCount: "625.9万",
          likesCount: "68,954",
          commentsCount: "1,394"
        },
        timeString: "2017.07.30",
        cover:'http://falion.cdn.fooads.com/meipai_cover_003.jpg'
    }],
    services:[
      {
        icon:'../../image/c-icon-1.png',
        title:'电商数据监测与分析',
        desc:'对淘宝、天猫、京东、亚马逊、苏宁等电商平台进行实时数据监测，包括商品、类目、价格、销量、评价、爆款、分销等维度。'
      },
      {
        icon: '../../image/c-icon-2.png',
        title: '社交数据监测与分析',
        desc: '对微信、微博、知乎、小红书、Facebook、Twitter、Instagram 等社交平台进行实时数据监测，包括内容、用户、广告、互动等维度。'
      },
      {
        icon: '../../image/c-icon-3.png',
        title: '代言人智选',
        desc: '聚合分析微信、微博、Facebook、Twitter、Instagram 等社交平台中明星的粉丝数据，与品牌目标用户进行智能匹配。'
      },
      {
        icon: '../../image/c-icon-4.png',
        title: '品牌图像识别模型',
        desc: '通过机器学习，建立人脸识别、品牌识别、商品识别、广告识别等模型，在特定场景下目标识别和检测准确率95%以上，可实现毫秒级检索。'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadWechatData();
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
    
  },

  enterDetail: function(){
    
  },

  switchOneTab: function(ev){
    let { key } = ev.currentTarget.dataset;

    this.setData({
      oneTabIndex: key
    })
  },
  switchTwoTab: function(ev){
    let { key } = ev.currentTarget.dataset;

    this.setData({
      twoTabIndex: key
    }) 
  },

  swiperChange: function(ev){
    let { field } = ev.currentTarget.dataset;
    let { current } = ev.detail;
    
    let {swiperIndex} = this.data;
    swiperIndex[field] = current;
    
    this.setData({
      swiperIndex
    })
  },

  loadWechatData(){

    let that = this
    wx.request({
      url: `https://brandtail.fooads.com/api/v2/case/list?limit=${3}&skip=${0}&postType=wechat`,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.statusCode === 200 && res.data) {

          that.setData({
            pictexts: util.formatCaseList(res.data)
          })          


        }

      }
    })
  }
})