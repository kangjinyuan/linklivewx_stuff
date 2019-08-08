//app.js
let QQMapWX = require('utils/qqmap-wx-jssdk.js');
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
  request: function(method, requestUrl, param, showLoading, okCallback, noCallback) {
    let that = this;
    let accessToken = wx.getStorageSync("accessToken");
    let communityInfo = wx.getStorageSync("communityInfo");
    let accountInfo = wx.getStorageSync("accountInfo");
    let timestamp = new Date().getTime();
    if (showLoading == true) {
      wx.showLoading({
        title: 'loading···',
        mask: true
      })
    }
    if (method == "POST") {
      param.accessToken = accessToken;
      param.communityId = communityInfo.id;
      param.communityName = communityInfo.name;
      param.pmcId = accountInfo.pmcId;
      param = JSON.stringify(param);
    }
    wx.request({
      url: that.globalData.commonRequestUrl + requestUrl + "?timestamp=" + timestamp,
      data: param,
      method: method,
      dataType: 'json',
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '0000') {
          okCallback(res);
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
          noCallback(res);
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
  resetSort: function(property, type) {
    return function(a, b) {
      if (type == 0) {
        // 越小越靠前
        return a[property] - b[property];
      } else if (type == 1) {
        // 越大越靠前
        return b[property] - a[property];
      }
    }
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
  setTime: function(time, type) {
    let that = this;
    time = that.stringToTime(time);
    let date = new Date(time);
    let Y = date.getFullYear();
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours());
    let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
    let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    if (type == 0) {
      return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    } else if (type == 1) {
      return Y + "-" + M + "-" + D + " " + h + ":" + m;
    } else if (type == 2) {
      return Y + "-" + M + "-" + D + " " + h;
    } else if (type == 3) {
      return Y + "-" + M + "-" + D;
    } else if (type == 4) {
      return Y + "-" + M;
    } else if (type == 5) {
      return Y;
    } else if (type == 6) {
      return Y + "年" + M + "月" + D + "日 " + h + "时" + m + "分" + s + "秒";
    } else if (type == 7) {
      return Y + "年" + M + "月" + D + "日 " + h + "时" + m + "分";
    } else if (type == 8) {
      return Y + "年" + M + "月" + D + "日 " + h + "时";
    } else if (type == 9) {
      return Y + "年" + M + "月" + D + "日";
    } else if (type == 10) {
      return Y + "年" + M + "月";
    } else if (type == 11) {
      return Y + "年";
    } else if (type == 12) {
      return h + ":" + m;
    } else if (type == 13) {
      return h + ":" + m + ":" + s;
    }
  },
  setTimeStamp: function(time) {
    let that = this;
    time = that.stringToTime(time);
    let date = new Date(time).getTime();
    return date;
  },
  setEndTime: function(newDate, type) {
    let that = this;
    newDate = that.setTimeStamp(newDate);
    let date;
    if (type == 0) {
      date = newDate + 24 * 60 * 60 * 1000;
    } else if (type == 1) {
      date = newDate + 24 * 60 * 60 * 1000 - 1;
    }
    return date;
  },
  getMonthDays: function(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getTimeSlot: function(startTimeArray, endTimeArray, type) {
    let that = this;
    let timeSlot = null;
    for (let i = 0; i < startTimeArray.length; i++) {
      let startTime = that.setTimeStamp(startTimeArray[i]);
      let endTime = that.setTimeStamp(endTimeArray[i]);
      timeSlot += endTime - startTime;
    }
    let h = Math.floor(timeSlot / (1000 * 60 * 60)) % 24;
    let m = Math.floor(timeSlot / (1000 * 60)) % 60;
    let s = Math.floor(timeSlot / 1000) % 60;
    if (type == 0) {
      return h + "小时" + m + "分钟";
    }
  },
  camera: function(callback) {
    let scope = "scope.camera";
    wx.getSetting({
      success: function(res) {
        if (res.authSetting[scope]) {
          callback();
        } else if (res.authSetting[scope] == false) {
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
                    if (res.authSetting[scope]) {
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
  userLocation: function(callback) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        let locationEnabled = res.locationEnabled;
        let system = res.system;
        let platform = res.platform;
        if (platform == "devtools") {
          that.setScopeUserLocation(callback);
        } else {
          if (locationEnabled) {
            that.setScopeUserLocation(callback);
          } else {
            let content = "";
            if (system.indexOf("Android") > -1) {
              content = "请到手机系统的[设置]->[定位服务]中打开定位服务，并允许微信使用定位服务。"
            } else if (system.indexOf("iOS") > -1) {
              content = "请到手机系统的[设置]->[隐私]->[定位服务]中打开定位服务，并允许微信使用定位服务。"
            }
            wx.showModal({
              title: '邻客管家',
              content: content,
              confirmText: '确定',
              confirmColor: '#fda414',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          }
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '获取设备信息失败，请检查您的网络或重试',
          icon: "none"
        })
      }
    })
  },
  setScopeUserLocation: function(callback) {
    let that = this;
    let scope = "scope.userLocation";
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function(res) {
        callback();
      },
      fail: function(res) {
        wx.getSetting({
          success: function(res) {
            if (res.authSetting[scope]) {
              callback();
            } else if (res.authSetting[scope] == false) {
              wx.showModal({
                title: '邻客管家',
                content: '邻客管家申请获得你的位置权限,请先授权',
                confirmText: '去授权',
                confirmColor: '#fda414',
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        if (res.authSetting[scope]) {
                          callback();
                        } else {
                          that.setScopeUserLocation(callback);
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        })
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
  randomData: function(dataList) {
    let res = dataList[Math.floor(Math.random() * dataList.length)];
    return res;
  },
  setPageData: function(dataList, pageSize) {
    let totalPage = Math.ceil(dataList.length / pageSize);
    let newDataList = [];
    for (let i = 0; i < totalPage; i++) {
      let obj = {
        id: i,
        dataList: []
      }
      newDataList.push(obj);
    }
    for (let i = 0; i < newDataList.length; i++) {
      for (let j = 0; j < dataList.length; j++) {
        if (j >= pageSize * i && j < pageSize * (i + 1)) {
          newDataList[i].dataList.push(dataList[j]);
        }
      }
    }
    return newDataList;
  },
  pullDownRefresh: function(that, callback) {
    wx.startPullDownRefresh({
      success: function(res) {
        that.setData({
          page: 1
        })
        callback(res);
        wx.stopPullDownRefresh();
      }
    })
  },
  setFormId: function(e, callback) {
    let that = this;
    let formId = e.detail.formId;
    let param = {
      formId: formId
    }
    that.request("POST", "/account/stuff/setFormId.do", param, false, function(res) {
      callback(res);
    }, function(res) {
      wx.showToast({
        title: 'formId更新失败，请检查您的网络或重试',
        icon: 'none'
      })
    });
  },
  sideslipStart: function(e, that) {
    let touch = e.touches[0];
    let dataList = that.data.dataList;
    for (let i = 0; i < dataList.length; i++) {
      dataList[i].sideslipActive = false;
    }
    that.setData({
      dataList: dataList,
      startX: touch.clientX
    })
  },
  sideslipMove: function(e, that) {
    let touch = e.touches[0];
    let dataList = that.data.dataList;
    let startX = that.data.startX;
    let touchMoveX = touch.clientX;
    let index = e.currentTarget.dataset.index;
    var disX = startX - touch.clientX
    let item = dataList[index];
    if (touchMoveX > startX) {
      //右滑
      item.sideslipActive = false;
    } else {
      //左滑
      item.sideslipActive = true;
    }
    that.setData({
      dataList: dataList
    })
  },
  getDistance: function(lat1, lng1, lat2, lng2) {
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;
    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var r = 6378137;
    return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0);
  },
  getNowLocation: function(callback) {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function(res) {
        callback(res);
      },
    })
  },
  inArray: function(value, array) {
    let index = -1;
    for (let i = 0; i < array.length; i++) {
      if (value == array[i]) {
        index = i;
        break;
      }
    }
    return index;
  },
  privilegeState: function(type) {
    let that = this;
    let privilege = wx.getStorageSync("accountInfo").privilege;
    let privilegeState = "";
    for (let i = 0; i < privilege.length; i++) {
      if (privilege[i].id == type) {
        privilegeState = privilege[i].checked;
      }
    }
    return privilegeState;
  },
  reverseGeocoder: function(showLoading, callback) {
    let that = this;
    let mapKey = that.globalData.mapKey;
    let qqmapsdk = new QQMapWX({
      key: mapKey
    });
    if (showLoading == true) {
      wx.showLoading({
        title: 'loading···',
        mask: true
      })
    }
    qqmapsdk.reverseGeocoder({
      success: function(res) {
        wx.hideLoading();
        if (callback) {
          callback(res);
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '逆解析坐标失败，请检查您的网络或重试',
          icon: "none"
        })
      }
    })
  },
  globalData: {
    commonRequestUrl: 'http://test.api.15275317531.com',
    // commonRequestUrl: 'https://api.15275317531.com',
    // commonRequestUrl: 'http://192.168.0.200:8080',
    imgUrl: 'http://img.guostory.com/',
    mapKey: "N2BBZ-CUOWU-IOMVN-25VN4-K5H3S-QBFJY",
    userInfo: {}
  }
})