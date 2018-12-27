let app = getApp();
Page({
  data: {
    code: '',
    xqinfo: '',
    kdaddress: ''
  },
  selectxq: function() {
    let that = this;
    wx.navigateTo({
      url: '../selectxq/selectxq',
    })
  },
  bindValue: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    let value = e.detail.value;
    if (flag == 0) {
      that.setData({
        kdaddress: value
      })
      wx.setStorageSync('kdaddress', value);
    } else if (flag == 1) {
      that.setData({
        code: value
      })
    }
  },
  scanCode: function(e) {
    let that = this;
    wx.scanCode({
      scanType: ['barCode'],
      success: function(res) {
        console.log(res.scanType)
        if (res.scanType == 'QR_CODE' || res.scanType == 'WX_CODE' || res.scanType == 'PDF_417' || res.scanType == 'DATA_MATRIX') {
          wx.showToast({
            title: '请扫描正确的快递单号',
            icon: 'none'
          })
        } else {
          that.setData({
            code: res.result
          })
          that.setCode();
        }
      }
    })
  },
  setCode: function() {
    let that = this;
    let communityId = that.data.xqinfo.id;
    let communityName = that.data.xqinfo.name;
    if (!that.data.xqinfo || that.data.kdaddress == '') {
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
      address: that.data.kdaddress,
      communityId: communityId,
      communityName: communityName
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
    let xqinfo = wx.getStorageSync('xqinfo');
    let kdaddress = wx.getStorageSync('kdaddress');
    that.setData({
      xqinfo: xqinfo,
      kdaddress: kdaddress
    })
  }
})