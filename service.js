// 请求服务
const API_BASE = 'https://brandtail.fooads.com/api/v2';

function formatParams(params){
  let str = ""
  for(let key in params){
    if (params.hasOwnProperty(key) && (params[key] || params[key] == 0)){
      str += (key + '=' + params[key] + '&');
    }
  }
  return str.substr(0, str.length - 1);
}

function fetch({ url, params, success = () => { }, error = () => { }, complete=()=>{}}){
  wx.request({
    url: `${API_BASE}${url}?${formatParams(params)}`,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      if (res.statusCode === 200 && res.data) {
        success(res.data);
      } else {
        error(res);
      }
    },
    complete: complete
  })
}

module.exports = {
  getCaseList: (args)=>{
    fetch({
      ...args,
      url: '/case/list'
    })
  },

  getCaseComments: (args)=>{
    fetch({
      ...args,
      url: `/case/${args.caseId}/comments`
    })
  },

  getKolBrands: (args)=>{
    fetch({
      ...args,
      url: `/account/${args.accountId}/brandCases`
    })
  },

  getBrandKols: (args)=>{
    fetch({
      ...args,
      url: `/brand/${args.brandId}/accountCases`
    })
  },

  getCaseDetail: (args) => {
    fetch({
      ...args,
      url: `/case/${args.caseId}/detail`
    })
  },

  getAccountDetail: (args)=>{
    fetch({
      ...args,
      url: `/account/${args.accountId}/detail`
    })
  },

  getBrandDetail: (args)=>{
    fetch({
      ...args,
      url: `/brand/${args.brandId}/detail`
    })
  },

  getBrandList: (args)=>{
    fetch({
      ...args,
      url: `/brand/list`
    })
  },

  getAccountList: (args)=>{
    fetch({
      ...args,
      url: `/account/list`
    })
  },

  getIndustryList: (args)=>{
    fetch({
      ...args,
      url: `/industry/list`
    })
  }

  

  

};