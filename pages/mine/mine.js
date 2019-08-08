let app = getApp();
let imgUrl = app.globalData.imgUrl;
Page({
  data: {
    accountInfo: {}
  },
  topages: function(e) {
    let that = this;
    let page = e.currentTarget.dataset.page;
    app.setFormId(e, function(res) {
      wx.navigateTo({
        url: page
      })
    });
  },
  loginOut: function() {
    let that = this;
    wx.setStorageSync("accessToken", "");
    wx.switchTab({
      url: '../index/index',
    })
  },
  onShow: function(options) {
    let that = this;
    let accountInfo = wx.getStorageSync('accountInfo');
    if (accountInfo.headimage == '') {
      accountInfo.headimage = '../../images/headimg-deafult.png'
    } else {
      accountInfo.headimage = imgUrl + accountInfo.headimage + "?imageView2/2/w/160/h/160|imageslim";
    }
    accountInfo.telephone = accountInfo.telephone.substring(0, 3) + "****" + accountInfo.telephone.substring(7, 11);
    that.setData({
      accountInfo: accountInfo
    })
  }
})