let app = getApp();
Page({
  data: {
    newPassword: '',
    checkPassword: ''
  },
  getValue: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    let value = e.detail.value;
    if (flag == 0) {
      that.setData({
        newPassword: value
      })
    } else if (flag == 1) {
      that.setData({
        checkPassword: value
      })
    }
  },
  setPassword: function(e) {
    let that = this;
    let newPassword = that.data.newPassword;
    let checkPassword = that.data.checkPassword;
    if (newPassword == '') {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      })
      return false;
    }
    if (checkPassword == '') {
      wx.showToast({
        title: '请确认密码',
        icon: 'none'
      })
      return false;
    }
    if (checkPassword != newPassword) {
      wx.showToast({
        title: '密码不一致',
        icon: 'none'
      })
      return false;
    }
    let param = {
      password: checkPassword
    }
    app.request('POST', '/account/stuff/resetPassword.do', param, true, function(res) {
      wx.navigateBack({
        delta: 1
      });
    }, function(res) {
      wx.showToast({
        title: '修改失败，请检查您的网络或重试',
        icon: 'none'
      })
    })
  },
  onLoad: function(options) {
    let that = this
  }
})