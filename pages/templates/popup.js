module.exports = {
  target: null,
  caseDetail: {},
  initPopup: function(target, field, callback = ()=>{}){

    target.openMoreAction = this.openMoreAction.bind(this);
    target.copyLink = this.copyLink.bind(this);
    target.shareLink = this.shareLink.bind(this);
    target.closePopup = this.closePopup.bind(this);

    this.callback = callback;
    this.target = target;
    this.field = field;

    this.target.setData({
      showPopup: false,
      popupTop:0
    })
  },

  // 根据ID查询数据
  extractItemFromListById(id) {
    let caseList = this.target.data[this.field];
    let caseDetail = {};
    if (Array.isArray(caseList)) {
      for (let i = 0; i < caseList.length; i++) {
        if (caseList[i].id === id) {
          caseDetail = caseList[i];
        }
      }
    }
    return caseDetail;
  },

  openMoreAction(ev) {
    let { id } = ev.currentTarget;
    this.caseDetail = this.extractItemFromListById(ev.currentTarget.dataset.id);
    
    // 返回数据
    this.callback(this.caseDetail);
    
    wx.createSelectorQuery().select('#' + id).boundingClientRect((rect) => {
      let { top } = rect;
      this.target.setData({
        showPopup: true,
        popupTop: top + 40 + 'px'
      });
    }).exec()
  },

  // 复制链接
  copyLink() {
    this.closePopup();
    wx.setClipboardData({
      data: this.caseDetail.url,
      success: function (res) {
        wx.showToast({
          title: '已复制',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  // 分享链接
  shareLink() {
    this.closePopup();
  },

  // 关闭分享弹窗
  closePopup() {
    this.target.setData({
      showPopup: false
    })
  },
}