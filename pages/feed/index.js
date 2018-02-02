const util = require('../../utils/util');
const popup = require('../templates/popup');
var wxCharts = require('../../utils/wxcharts.js');
var barCharts = require('../../utils/barchart.js');
var areaChart = null;
//index.js
//获取应用实例
const app = getApp();

//声势走势数据
var volumeTrend = [];
//声音来源数据
var soundSource = [];
var userDistribution  = [];
var userInfoCharts = [];
var userInfoRingCharts = [];

var windowWidth = 320;
var windowHeight = 568;

Page({
  data: {
    isFeed:false,
    showTip: false,
    feedArray:[],
    isWeek:true,
    soundData:36
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // this.caseId = options.id;
    var that = this;
    this.getUserInfo();

    // 获得屏幕高度,高度
    this.setData({
      showTip: true
    });

    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      windowHeight = res.windowHeight;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    setTimeout(function(){
      //你需要执行的代码
      that.setData({
        showTip: false
      });
    },2000);

    if(this.data.isFeed){
      //获取动态
      this.getUserInfo();
    }else{
      this.loadChartData();
      //获取数据
    }
  },
  getUserInfo: function(e) {
    console.log('getPageData');
    let that = this;
    let data = [{
      name:"4A广告",
      image:"../../image/wechat-logo.png",
      tag:"微信公众号",
      time:"3分钟前",
      text:"日本人是如何解说大魔王王老吉打哭萌神福原爱的",
      isponit:false
    },{
      name:"VanBronckhorst",
      image:"../../image/wechat-logo.png",
      tag:"今日头条",
      time:"3分钟前",
      text:"#烟不离手 烈酒烧喉",
      isponit:true
    }];

    that.setData({
      feedArray:data
    })
  },
  loadFeedData: function(){
    console.log('获取用户数据中...');


    // wx.request({
    //   url: ``,
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //   }
    // })
  },
  loadChartData: function(){
    let that = this;
    console.log('获取表格数据中...');
    that.setData({
      soundData:2*36
    });
    console.log(that.data);
    volumeTrend = [{
      name: '成交量1',
      data: [0,0,0,0,0,0,35, 47, 28,0,0,0,0,0,0, 56, 33, 34],
      format: function (val) {
        return ;
      }
    },{
      name: '成交量2',
      data: [0,0,0,0,0,0,32, 45, 177,0,0,0,0,0,0, 56, 33, 34],
      format: function (val) {
        return ;
      }
    }];

    areaChart = new wxCharts({
      canvasId: 'areaCanvas',
      type: 'area',
      categories: ['10.01','', '10.02', '','10.03', '','10.04','','','','','','','', '10.05','10.06',''],
      animation: true,
      series: volumeTrend,
      yAxis: {
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        fontColor: 'rgba(0,0,0,0.34)',
        gridColor: 'rgba(0,0,0,0.34)',
        titleFontColor: '#f7a35c'
      },
      xAxis: {
        fontColor: 'rgba(0,0,0,0.34)',
        gridColor: 'rgba(0,0,0,0.34)',
        titleFontColor:'#fff',
        disableGrid : true
      },
      extra: {
        legendTextColor: '#cb2431'
      },
      dataLabel:false,
      width: windowWidth,
      height: 200
    });

    soundSource = [{
      tag:"吃喝",
      value: 98,
      title: '98,52%',
      HLFactor:"2"
    },{
      tag:"夜夜",
      value: 57,
      title: '98,52%',
      HLFactor:"2"
    }];

    userDistribution = [{
      tag:"吃喝吃喝吃喝",
      value: 98,
      title: '98,52%'
    },{
      tag:"夜夜喝吃喝吃",
      value: 57,
      title: '98,52%',
    }];

    var soundSourceCharts = new barCharts();
    soundSourceCharts.draw({
        renderTo:"soundSourceCanvas",
        series:soundSource,
        setCanvasSize: o=>this.setData({ctxHeight:o.height})
    })

    var userDistributionCharts = new barCharts();
    userDistributionCharts.draw({
        renderTo:"userDistributionCanvas",
        series:userDistribution,
        setCanvasSize: o=>this.setData({ctxHeight:o.height})
     })

    var userInfoCharts = [{
      name: '成交量1',
      data: [70, 40, 65, 100, 34, 18],
      format: function (val, name) {
        return val.toFixed(2) + '万';
      }
    }];

    new wxCharts({
      canvasId: 'userInfoCanvas',
      type: 'column',
      categories: ['2016-08', '2016-09', '2016-10', '2016-11', '2016-12', '2017'],
      series: userInfoCharts,
      yAxis: {
        format: function (val) {
          return val;
        }
      },
      xAxis: {
        disableGrid:true
      },
      width: windowWidth,
      height: 200
    });


    userInfoRingCharts = [{
      name: '成交量1',
      data: 15,
      color:'#999999'
    }, {
      name: '成交量2',
      data: 35
    }];

    new wxCharts({
      canvasId: 'userInfoRingCanvas',
      type: 'ring',
      series: userInfoRingCharts ,
      width: windowWidth/2,
      height: 200,
      dataLabel: false
    });
    // wx.request({
    //   url: ``,
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //   }
    // })
  },
  entereFeed: function(){
    let that = this;
    that.loadFeedData();
    that.setData({
      isFeed: true
    })
  },
  dataToWeek: function(){
    let that = this;
    that.loadChartData();
    that.setData({
      isWeek: true
    })
  },
  dataToMonth: function(){
    let that = this;
    console.log(12);
    that.loadChartData();
    that.setData({
      isWeek: false
    })
  },
  enterData: function(){
    let that = this;
    that.loadChartData();
    that.setData({
      isFeed: false
    })
  },
  moveToSetting: function(){
    wx.navigateTo({
      url: `../setting/index`
    })
  },
  moveToGuide: function(){
    wx.navigateTo({
      url: `../guide/index`
    })
  },
  moveToChoose: function(){
    wx.navigateTo({
      url: `../choose/index`
    })
  },
  closeTip:function(){
    this.setData({
      showTip: false
    })
  }
});
