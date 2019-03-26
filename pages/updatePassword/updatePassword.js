let app = getApp();
Page({
  data: {
    newpwd: '',
    checkpwd: '',
    accountInfo: {}
  },
  bindpwd: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    let value = e.detail.value;
    if (flag == 0) {
      that.setData({
        newpwd: value
      })
    } else if (flag == 1) {
      that.setData({
        checkpwd: value
      })
    }
  },
  setpwd: function(e) {
    let that = this;
    if (that.data.newpwd == '') {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      })
      return false;
    }
    if (that.data.checkpwd == '') {
      wx.showToast({
        title: '请确认密码',
        icon: 'none'
      })
      return false;
    }
    if (that.data.checkpwd != that.data.newpwd) {
      wx.showToast({
        title: '密码不一致',
        icon: 'none'
      })
      return false;
    }
    let accountInfo = wx.getStorageSync('accountInfo');
    let paras = {
      telephone: accountInfo.telephone,
      password: that.data.checkpwd
    }
    app.request('POST', '/account/stuff/update.do', paras, function(res) {
      wx.setStorageSync("accountInfo", res.data.data);
      wx.navigateBack({
        delta: 1
      });
      wx.showToast({
        title: '修改成功',
        icon: 'none'
      })
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