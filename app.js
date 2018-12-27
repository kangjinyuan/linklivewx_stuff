//app.js
App({
  onLaunch: function() {
    let that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
  },
  toLogin: function(callback) {
    let that = this;
    let accessToken = wx.getStorageSync("accessToken");
    if (accessToken) {
      callback();
    } else {
      wx.showModal({
        title: '邻客管家',
        content: '邻客管家申请获得你的账号信息,请先登录',
        confirmText: '去登录',
        confirmColor: '#fda414',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
    }
  },
  request: function(method, rurl, paras, okcallback, nocallback) {
    wx.showLoading({
      title: 'loading···'
    })
    let that = this;
    let accessToken = wx.getStorageSync("accessToken");
    let timestamp = new Date().getTime();
    paras.accessToken = accessToken;
    paras = JSON.stringify(paras);
    wx.request({
      url: that.globalData.crurl + rurl + "?timestamp=" + timestamp,
      data: paras,
      method: method,
      dataType: 'json',
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '0000') {
          okcallback(res);
        } else if (res.data.code == "0007" || res.data.code == "0006") {
          wx.setStorageSync("accessToken", "");
          wx.showModal({
            title: '邻客管家',
            content: '登录状态过期,请先登录',
            confirmText: '去登录',
            confirmColor: '#fda414',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../login/login'
                })
              }
            }
          })
        } else if (res.data.code == "0008") {
          wx.showToast({
            title: '服务器内部错误',
            icon: 'none'
          })
        } else {
          nocallback(res);
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
  },
  loadMore: function(that, okcallback) {
    if (that.data.page + 1 > that.data.totalPage) {
      that.setData({
        page: that.data.page
      })
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      return false;
    }
    that.setData({
      page: that.data.page + 1
    });
    okcallback();
  },
  setTime: function(time, flag) {
    if (typeof(time) == "string") {
      time = time.substring(0, 19);
      time = time.replace(/-/g, '/');
    } else {
      time = time;
    }
    let date = new Date(time);
    let Y = date.getFullYear();
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours());
    let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
    let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    if (flag == 0) {
      return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    } else if (flag == 1) {
      return Y + "-" + M + "-" + D + " " + h + ":" + m;
    } else if (flag == 2) {
      return Y + "-" + M + "-" + D + " " + h;
    } else if (flag == 3) {
      return Y + "-" + M + "-" + D;
    } else if (flag == 4) {
      return Y + "-" + M;
    } else if (flag == 5) {
      return Y;
    }
  },
  globalData: {
    crurl: 'http://test.api.15275317531.com',
    // crurl: 'http://192.168.0.159:8080',
    imgrurl: 'http://img.guostory.com/',
    // crurl: 'https://admin.15275317531.com',
    userInfo: {}
  }
})