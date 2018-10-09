let app = getApp();
Page({
  data: {
    code: '',
    xqinfo: ''
  },
  selectxq: function() {
    let that = this;
    wx.navigateTo({
      url: '../selectxq/selectxq',
    })
  },
  bindCode: function(e) {
    let that = this;
    let code = e.detail.value;
    that.setData({
      code: code
    })
  },
  scanCode: function(e) {
    let that = this;
    wx.scanCode({
      scanType: 'barCode',
      success: function(res) {
        that.setData({
          code: res.result
        })
        that.setCode();
      }
    })
  },
  setCode: function() {
    let that = this;
    let communityId = that.data.xqinfo.id;
    if (!that.data.xqinfo) {
      wx.showToast({
        title: '请先选择小区',
        icon: 'none'
      })
      return false;
    }
    if (that.data.code == '') {
      wx.showToast({
        title: '请输入快递单号',
        icon: 'none'
      })
      return false;
    }
    let paras = {
      code: that.data.code,
      communityId: communityId
    }
    app.request("POST", "/express/receive.do", paras, function(res) {
      wx.showToast({
        title: '录入成功',
        icon: 'none'
      })
    }, function(res) {
      wx.showToast({
        title: '录入失败',
        icon: 'none'
      })
    })
  },
  onShow: function() {
    let that = this;
    let xqinfo = wx.getStorageSync('xqinfo');
    that.setData({
      xqinfo: xqinfo
    })
  }
})