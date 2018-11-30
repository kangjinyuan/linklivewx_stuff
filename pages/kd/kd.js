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
            title: '请扫描正确快递单号',
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
    if (!that.data.xqinfo) {
      wx.showToast({
        title: '请选择社区',
        icon: 'none'
      })
      return false;
    }
    if (that.data.kdaddress == '') {
      wx.showToast({
        title: '请输入物业代收点详细地址',
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
    let kdaddress = wx.getStorageSync('kdaddress');
    that.setData({
      xqinfo: xqinfo,
      kdaddress: kdaddress
    })
  }
})