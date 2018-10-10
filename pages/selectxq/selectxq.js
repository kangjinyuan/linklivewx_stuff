let app = getApp();
Page({
  data: {
    xqlist: []
  },
  selectxq: function(e) {
    let that = this;
    let xqinfo = e.currentTarget.dataset.xqinfo;
    wx.setStorageSync('xqinfo', xqinfo);
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function() {
    let that = this;
    wx.showLoading({
      title: 'loading···'
    })
    let timestamp = new Date().getTime();
    let accountInfo = wx.getStorageSync("accountInfo");
    let paras = {
      pageSize: 10000,
      pmcId: accountInfo.pmcId
    }
    paras = JSON.stringify(paras);
    wx.request({
      url: app.globalData.crurl + "/community/queryList.do?timestamp=" + timestamp,
      data: paras,
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '0000') {
          that.setData({
            xqlist: res.data.data
          })
        } else if (res.data.code == "0008") {
          wx.showToast({
            title: '服务器内部错误',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '小区列表加载失败',
            icon: 'none'
          })
        }
      },
      fail: function(res) {
        wx.showModal({
          title: '邻客管家',
          content: 'sorry 服务器已经离开了地球',
          confirmColor: '#fda414',
          showCancel: false
        })
        wx.hideLoading();
      }
    })
  }
})