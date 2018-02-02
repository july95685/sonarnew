const util = require('../../utils/util');
const moment = require('../../utils/moment');
const popup = require('../templates/popup');
const {getCaseList} = require('../../service');

//index.js
//获取应用实例
const app = getApp();

let _wH = 0;

const FILTER_INDEX = [1, 2, 3, 4];
const LIMIT = 10;

// 时间筛选枚举
let timeEnum = [{
    title: "默认",
    active: true,
    id: "time001"
}, {
    title: "30天前",
    active: false,
    id: "time002",
    time: '0,' + moment().subtract(30, 'days').valueOf()
  }, {
    title: "90天前",
    active: false,
    id: "time003",
    time: '0,' + moment().subtract(90, 'days').valueOf()
  }, {
    title: "12个月前",
    active: false,
    id: "time004",
    time: '0,' + moment().subtract(12, 'months').valueOf()
}];



// 行业枚举
let categoryArr = ["互联网", "广告传媒", "咨询服务", "地产", "金融", "汽车", "电子产品", "食品饮料", "日常用品", "美妆", "服装", "电器", "母婴", "运动", "朝商/百货", "电子商务", "餐饮", "酒店", "旅游", "教育", "医疗保健", "生活服务", "家居", "影视/文化", "环保/工业", "公益", "航空","其他"];
let categoryEnum = [];
for(let i=0; i<categoryArr.length; i++){
  categoryEnum.push({
    id: 'category' + i,
    title: categoryArr[i],
    val: categoryArr[i],
    active: false
  })
}

// 记录展开筛选之前的数据 如果未点击确定 恢复至prevData
let prevData = null;
// 筛选参数
let filterParams = { };
// 当前PAGE
let currentPage = 0;
// 当前分享的内容
let caseDetail = {};


Page({
  data: {

    caseList: [],

    filterKey: null,
    filterList:{
      trade: {
        placeholder:"搜索行业",
        title: "行业",
        data: [],
        filteredData: [],
        searchText: "",
        selected: false
      }, 
      brand: {
        placeholder: "搜索品牌",
        title: "品牌",
        data:[],
        filteredData:[],
        searchText:"",
        selected: false
      },
      kol: {
        placeholder: "搜索KOL",
        title: "KOL",
        data: [],
        filteredData: [],
        searchText:"",
        selected: false
      },
      time: {
        title: "时间",
        data: timeEnum,
        filteredData: timeEnum,
        searchText:"",
        selected: false
      }
    },

    hasMore: true,
    isLoading: false
  },

  onLoad: function () {
    // 获得屏幕高度
    wx.getSystemInfo({
      success: (res)=>{
        let { windowHeight } = res;
        _wH = windowHeight;
      }
    })

    //this.loadBrandAndKOL();
    this.loadData(currentPage);



  },

  onShow(){
    // 初始化弹窗
    popup.initPopup(this, 'caseList', (detail) => {
      caseDetail = detail
    });
  },


  loadBrandAndKOL(){

    var that = this;

    wx.request({
      url: `https://brandtail.fooads.com/api/v2/brand/list`,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.statusCode === 200 && res.data) {
          res.data = res.data.map((v)=>{
            v.id = v._id;
            v.title = v.name;
            v.img = v.logo;
            return {
              id: v._id,
              title: v.chineseName,
              img: v.logo.path,
              active: false
            };
          });
          that.setData({
            'filterList.brand.data': res.data,
            'filterList.brand.filteredData': res.data
          })
        }

      }
    })


    wx.request({
      url: `https://brandtail.fooads.com/api/v2/account/list`,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.statusCode === 200 && res.data) {
          res.data = res.data.map((v) => {
            // v.id = v._id;
            v.title = v.name;
            v.img = v.logo;
            return {
              id: v.id,
              title: v.name,
              img: v.logo.path,
              active: false
            };
          });
          that.setData({
            'filterList.kol.data': res.data,
            'filterList.kol.filteredData': res.data
          })
        }

      }
    })



    // 加载行业
    wx.request({
      url: `https://brandtail.fooads.com/api/v2/industry/list`,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.statusCode === 200 && res.data) {
          res.data = res.data.map((v) => {
            // v.id = v._id;
            v.title = v.name;
            v.img = v.logo;

            return {
              id: v._id,
              title: v.name,
              // img: v.logo,
              active: false
            };
          });
          that.setData({
            'filterList.trade.data': res.data,
            'filterList.trade.filteredData': res.data
          })
        }

      }
    })

  },


  // 展开筛选弹窗
  expandFilterPanel: function(ev){
    let { key } = ev.currentTarget.dataset;
    let { filterList, filterKey} = this.data;
    if(!key) return;

    // 记录之前的数据
    // 关闭当前展开
    if(prevData){
      filterList[filterKey].data = prevData;
      filterList[filterKey].filteredData = this.toFilter(prevData, filterList[filterKey].searchText);
    }

    if (key !== filterKey){
      prevData = util.cloneDeep(filterList[key].data);
    } else {
      prevData = null;
    }
    
    this.setData({
      filterKey: key === this.data.filterKey ? null : key,
      filterList
    })
    
  },

  // 搜索框变化监听
  searchChange: function(ev){
    let seachKey = ev.currentTarget.dataset.searchkey;
    let val = ev.detail.value;
    let filterList = this.data.filterList;

    filterList[seachKey].searchText = val;
    filterList[seachKey].filteredData = this.toFilter(filterList[seachKey].data, val);

    this.setData({
      filterList
    });
  },

  // 过滤
  toFilter: function(data, searchText){
    return data.filter((v)=>{
      return v.title.indexOf(searchText) > -1;
    });
  },

  // 选择筛选项
  selectItem: function(ev){
    let { type, id } = ev.currentTarget.dataset;
    let { filterList } = this.data;
    let curData = filterList[type].data;

    // if(type === 'time'){
    //   curData = curData.map((v)=>{
    //     v.active = false;
    //     return v;
    //   })
    // }
  
    for (let i = 0; i < curData.length; i++){
      let v = curData[i];
      let isActive = v.active;
      v.active = false;
      
      if (id === v.id){
        if (type === 'time'){
          v.active = !v.active;
        } else{
          v.active = isActive ? false : true;
        }
      }
    }

    
    filterList[type].filteredData = this.toFilter(curData, filterList[type].searchText);
    this.setData({
      filterList
    });

    this.confirmSelection();
  },

  // 清空选择
  clearSelection: function(ev){
    let { type } = ev.currentTarget.dataset;
    let { filterList } = this.data;

    let curObj = filterList[type];
    curObj.data = curObj.data.map((v)=>{
      v.active = false;
      return v;
    });
    curObj.filteredData = this.toFilter(curObj.data, curObj.searchText);
    this.setData({
      filterList
    });

  },

  // 检查筛选选项
  checkSelection: function (filterKey){
    let { filterList } = this.data;

    let result = {};
    for (let key in filterList){
      result[key] = []
      filterList[key].data.forEach((v)=>{
        if(v.active){
          if(key === 'time'){
            v.time && result[key].push(v.time);
          } else {
            result[key].push(v.id)
          }
        }
      });
    }

    if (filterKey){
      if (filterKey !== 'time' && result[filterKey].length) {
        for (let key in filterList) {
          console.log(key);
          if (key !== filterKey && key !== 'time') {
            filterList[key].data.forEach((v) => {
              v.active = false;
            });
            result[key] = [];
          }
        }
      }
    }

    return result
  },

  // 确认选择 
  confirmSelection: function(){
    
    prevData = null;
    
    let {filterList, filterKey} = this.data;
    this.expandFilterPanel({ 
      currentTarget: { dataset: { key: filterKey}}
    });


    let { trade, brand, kol, time } = this.checkSelection(filterKey);
    this.setData({
      'filterList.trade.selected': trade.length,
      'filterList.brand.selected': brand.length,
      'filterList.kol.selected': kol.length,
      'filterList.time.selected': time.length,
      'caseList': []
    })

    this.loadData(0);
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

  enterLearn() {
    wx.navigateTo({
      url: `../learn/index`
    })
  },

  // 格式化筛选参数
  formatParams(){
    let { trade, brand, kol, time } = this.checkSelection();
    let str = "";
    if (trade.length) {
      str += '&type=' + trade.join(',')
    }
    if (brand.length){
      str += '&brandId=' + brand.join(',')
    }
    if(kol.length){
      str += '&accountId=' + kol.join(',')
    }
    if(time.length){
      str += '&time=' + time.join(',')
    }
    return str
  },

  // 加载数据
  loadData(page, isPull){

    let that = this;
    let {caseList} = this.data;

    that.setData({
      isLoading: true
    })

    wx.request({
      url: `https://brandtail.fooads.com/api/v2/case/list?limit=${LIMIT}&skip=${page * LIMIT}`, // ${this.formatParams()
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
