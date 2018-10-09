let app = getApp();
Page({
  data: {
    accountInfo: {}
  },
  topages: function(e) {
    let that = this;
    let page = e.currentTarget.dataset.page;
    wx.navigateTo({
      url: page,
    })
  },
  onShow: function(options) {
    let that = this;
    app.toLogin(function() {
      let accountInfo = wx.getStorageSync('accountInfo');
      if (accountInfo.headimage == '../img/noimg.png' || accountInfo.headimage == '') {
        accountInfo.headimage = '../../images/headimg-deafult.png'
      } else {
        accountInfo.headimage = app.globalData.crurl + accountInfo.headimage;
      }
      that.setData({
        accountInfo: accountInfo
      })
    })
  }
})