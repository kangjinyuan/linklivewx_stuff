let app = getApp();
Page({
  data: {
    oList: [],
    totalPage: '',
    page: 1,
    reportState: '',
    tabList: [{
      reportState: 2,
      name: '已完成',
    }, {
      reportState: 3,
      name: '已评价'
    }, {
      reportState: 4,
      name: '已取消'
    }]
  },
  toOrderInfo: function(e) {
    let that = this;
    let orderInfo = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.orderInfo));
    wx.navigateTo({
      url: '../orderInfo/orderInfo?orderInfo=' + orderInfo
    })
  },
  tabState: function(e) {
    let that = this;
    let reportState = e.currentTarget.dataset.reportState;
    that.setData({
      reportState: reportState
    })
    let options = {};
    options.reportState = reportState;
    that.onLoad(options);
  },
  acceptOrder: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let paras = {
      id: id
    }
    app.request('POST', '/property/maintenance/acceptOrder.do', paras, function(res) {
      that.removeData(id);
    }, function(res) {
      if (res.data.code == "0005") {
        wx.showToast({
          title: '订单不存在',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '抢单失败，请检查您的网络或重试',
          icon: 'none'
        })
      }
    })
  },
  removeData: function(id) {
    let that = this;
    let oList = that.data.oList;
    for (let i = 0; i < oList.length; i++) {
      if (id == oList[i].id) {
        oList.splice(i--, 1);
      }
    }
    that.setData({
      oList: oList
    })
  },
  resetData: function(obj) {
    if (obj.reportType == 0) {
      obj.reportTypeText = "水";
    } else if (obj.reportType == 1) {
      obj.reportTypeText = "电";
    } else if (obj.reportType == 2) {
      obj.reportTypeText = "燃气";
    } else if (obj.reportType == 3) {
      obj.reportTypeText = "门锁";
    } else if (obj.reportType == 4) {
      obj.reportTypeText = "其他";
    }
    if (obj.reportState == 0) {
      obj.reportStateText = "申请中";
    } else if (obj.reportState == 1) {
      obj.reportStateText = "已接单";
    } else if (obj.reportState == 2) {
      obj.reportStateText = "已完成";
    } else if (obj.reportState == 3) {
      obj.reportStateText = "已评价";
    } else if (obj.reportState == 4) {
      obj.reportStateText = "已取消";
    }
    if (obj.score == 0) {
      obj.scoreText = "吐槽";
    } else if (obj.score == 1) {
      obj.scoreText = "满意";
    } else if (obj.score == 2) {
      obj.scoreText = "超赞";
    }
    obj.createTime = app.setTime(obj.createTime, 1);
    return obj;
  },
  nextPage: function() {
    let that = this;
    app.loadMore(that, function() {
      let paras = {};
      let reportState = that.data.reportState;
      let accountInfo = wx.getStorageSync('accountInfo');
      if (reportState == 0) {
        paras = {
          page: that.data.page,
          reportState: reportState
        }
      } else {
        paras = {
          page: that.data.page,
          stuffId: accountInfo.id,
          reportState: reportState
        }
      }
      let oldList = that.data.oList;
      app.request('POST', '/property/maintenance/queryList.do', paras, function(res) {
        let oList = res.data.data;
        for (let i = 0; i < oList.length; i++) {
          oldList.push(that.resetData(oList[i]));
        }
        that.setData({
          oList: oldList
        })
      }, function() {
        wx.showToast({
          title: '无法连接服务器，请检查您的网络或重试',
          icon: 'none'
        })
      })
    })
  },
  onLoad: function(options) {
    let that = this;
    let reportState = options.reportState;
    that.setData({
      reportState: reportState
    })
    let paras = {};
    let accountInfo = wx.getStorageSync('accountInfo');
    if (reportState == 0) {
      paras = {
        page: that.data.page,
        reportState: reportState
      }
      wx.setNavigationBarTitle({
        title: '业主报事',
      })
    } else {
      paras = {
        page: that.data.page,
        stuffId: accountInfo.id,
        reportState: reportState
      }
      if (reportState == 1) {
        wx.setNavigationBarTitle({
          title: '维修任务',
        })
      } else {
        wx.setNavigationBarTitle({
          title: '维修记录',
        })
      }
    }
    app.request('POST', '/property/maintenance/queryList.do', paras, function(res) {
      let oList = res.data.data;
      for (let i = 0; i < oList.length; i++) {
        oList[i] = that.resetData(oList[i]);
      }
      that.setData({
        oList: oList,
        totalPage: res.data.totalPage
      })
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: 'none'
      })
    })
  }
})