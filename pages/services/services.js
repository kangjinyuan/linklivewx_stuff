let app = getApp();
Page({
  data: {
    xqinfo: "",
    accountInfo: ""
  },
  selectCommunity: function() {
    let that = this;
    wx.navigateTo({
      url: '../selectCommunity/selectCommunity',
    })
  },
  topages: function(e) {
    let that = this;
    let xqinfo = that.data.xqinfo;
    let id = e.currentTarget.dataset.id;
    if (xqinfo) {
      if (id == 0) {
        wx.navigateTo({
          url: "../order/order?reportstate=0"
        })
      } else if (id == 1) {
        wx.navigateTo({
          url: "../order/order?reportstate=1"
        })
      } else if (id == 2) {
        wx.navigateTo({
          url: "../express/express"
        })
      } else if (id == 3) {
        wx.navigateTo({
          url: "../meter/meter"
        })
      } else if (id == 4) {
        wx.navigateTo({
          url: "../networkOpenDoor/networkOpenDoor"
        })
      } else if (id == 5) {
        wx.navigateTo({
          url: "../face/face"
        })
      }
    } else {
      wx.showToast({
        title: '请选择社区',
        icon: "none"
      })
    }
  },
  onShow: function(options) {
    let that = this;
    app.toLogin(function(accountInfo) {
      let xqinfo = wx.getStorageSync('xqinfo');
      accountInfo.dutyScope = JSON.parse(accountInfo.dutyScope);
      that.setData({
        xqinfo: xqinfo,
        accountInfo: accountInfo
      })
    })
  }
})