//app.js
App({
  onLaunch: function() {
    let that = this;
    // 展示本地存储能力
    let logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
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
  resetSort: function(flag, property) {
    return function(a, b) {
      if (flag == 0) {
        // 越小越靠前
        return a[property] - b[property];
      } else if (flag == 1) {
        // 越大越靠前
        return b[property] - a[property];
      }
    }
  },
  request: function(method, rurl, paras, okcallback, nocallback) {
    wx.showLoading({
      title: 'loading···',
      mask: true
    })
    let that = this;
    let accessToken = wx.getStorageSync("accessToken");
    let communityInfo = wx.getStorageSync("communityInfo");
    let accountInfo = wx.getStorageSync("accountInfo");
    let timestamp = new Date().getTime();
    if (method == "POST") {
      paras.accessToken = accessToken;
      paras.communityId = communityInfo.id;
      paras.communityName = communityInfo.name;
      paras.pmcId = accountInfo.pmcId;
      paras = JSON.stringify(paras);
    }
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
  loadMore: function(that, callback) {
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
    callback();
  },
  stringToTime: function(time) {
    if (typeof(time) == "string") {
      time = time.substring(0, 19);
      time = time.replace(/-/g, '/');
    } else {
      time = time;
    }
    return time;
  },
  setTime: function(time, flag) {
    let that = this;
    time = that.stringToTime(time);
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
  setTimeStamp: function(time) {
    let that = this;
    time = that.stringToTime(time);
    let date = new Date(time).getTime();
    return date;
  },
  tomorrowDate: function(newDate) {
    let that = this;
    newDate = that.stringToTime(newDate);
    let tomorrowDate = newDate + 1 * 24 * 60 * 60 * 1000;
    return tomorrowDate;
  },
  camera: function(callback) {
    wx.getSetting({
      success: function(res) {
        if (res.authSetting["scope.camera"]) {
          callback();
        } else if (res.authSetting["scope.camera"] == false) {
          wx.showModal({
            title: '邻客管家',
            content: '邻客管家申请获得你的相机权限,请先授权',
            confirmText: '去授权',
            confirmColor: '#fda414',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    if (res.authSetting["scope.camera"]) {
                      wx.navigateBack({
                        delta: 1
                      });
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  prevPage: function(number) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - number];
    return prevPage;
  },
  latterTwoCharacters: function(string) {
    return string.substring(string.length - 2, string.length);
  },
  scanCode: function(scanType, okCallback, noCallback) {
    let that = this;
    wx.scanCode({
      scanType: scanType,
      success: function(res) {
        if (scanType == "barCode") {
          if (res.scanType == 'QR_CODE' || res.scanType == 'WX_CODE' || res.scanType == 'PDF_417' || res.scanType == 'DATA_MATRIX') {
            noCallback(res);
            return false;
          }
        } else if (scanType == "qrCode") {
          if (res.scanType == 'AZTEC' || res.scanType == 'CODABAR' || res.scanType == 'CODE_39' || res.scanType == 'CODE_93' || res.scanType == 'CODE_128' || res.scanType == 'EAN_8' || res.scanType == 'EAN_13' || res.scanType == 'ITF' || res.scanType == 'MAXICODE' || res.scanType == 'RSS_14' || res.scanType == 'RSS_EXPANDED' || res.scanType == 'UPC_A' || res.scanType == 'UPC_E' || res.scanType == 'UPC_EAN_EXTENSION' || res.scanType == 'CODE_25') {
            noCallback(res);
            return false;
          }
        }
        okCallback(res);
      }
    })
  },
  globalData: {
    crurl: 'http://test.api.15275317531.com',
    // crurl: 'https://api.15275317531.com',
    // crurl: 'http://192.168.0.109:8080',
    imgrurl: 'http://img.guostory.com/',
    userInfo: {}
  }
})