let app = getApp();
Page({
  data: {
    code: '',
    expressAddress: ''
  },
  bindValue: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    let value = e.detail.value;
    if (flag == 0) {
      that.setData({
        expressAddress: value
      })
      wx.setStorageSync('expressAddress', value);
    } else if (flag == 1) {
      that.setData({
        code: value
      })
    }
  },
  scanCode: function(e) {
    let that = this;
    let scanType = ['barCode'];
    app.scanCode(scanType, function(res) {
      that.setData({
        code: res.result
      })
      that.setCode();
    }, function(res) {
      wx.showToast({
        title: '请扫描正确的快递单号',
        icon: 'none'
      })
    });
  },
  setCode: function() {
    let that = this;
    if (that.data.expressAddress == '') {
      wx.showToast({
        title: '请先完善地址信息',
        icon: 'none'
      })
      return false;
    }
    if (that.data.code == '') {
      wx.showToast({
        title: '请输入或扫一扫快递单号',
        icon: 'none'
      })
      return false;
    }
    let paras = {
      code: that.data.code,
      address: that.data.expressAddress
    }
    app.request("POST", "/property/express/receive.do", paras, function(res) {
      wx.showToast({
        title: '快递单号录入成功',
        icon: 'none'
      })
    }, function(res) {
      if (res.data.code == "0004") {
        wx.showToast({
          title: '已录入，请不要重复操作',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '录入失败，请检查您的网络或重试',
          icon: 'none'
        })
      }
    })
  },
  onShow: function() {
    let that = this;
    let expressAddress = wx.getStorageSync('expressAddress');
    that.setData({
      expressAddress: expressAddress
    })
  }
})