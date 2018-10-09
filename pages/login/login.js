let app = getApp();
Page({
  data: {
    telephone: '',
    password: ''
  },
  getvalue: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    let value = e.detail.value;
    if (flag == 0) {
      that.setData({
        telephone: value
      })
    } else if (flag == 1) {
      that.setData({
        password: value
      })
    }
  },
  login: function() {
    let that = this;
    if (that.data.telephone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })
      return false;
    }
    let tel = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!tel.test(that.data.telephone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return false;
    }
    if (that.data.password == '') {
      wx.showToast({
        title: '请输入密码',
        icon: "none"
      })
      return false;
    }
    let paras = {
      telephone: that.data.telephone,
      password: that.data.password
    }
    app.request('POST', '/stuff/login.do', paras, function(res) {
      wx.setStorageSync("accountInfo", res.data.data);
      wx.setStorageSync("accessToken", res.data.accessToken);
      wx.navigateBack(1);
    }, function(res) {
      wx.showToast({
        title: '登录失败,请检查登录信息是否有误',
        icon: 'none'
      })
    })
  }
})