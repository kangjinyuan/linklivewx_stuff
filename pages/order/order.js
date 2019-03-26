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
    let orderInfo = JSON.stringify(e.currentTarget.dataset.orderinfo);
    wx.navigateTo({
      url: '../orderInfo/orderInfo?orderInfo=' + orderInfo
    })
  },
  stab: function(e) {
    let that = this;
    let reportState = e.currentTarget.dataset.reportstate;
    that.setData({
      reportState: reportState
    })
    let options = {};
    options.reportstate = reportState;
    that.onLoad(options);
  },
  acceptOrder: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let paras = {
      id: id
    }
    app.request('POST', '/property/maintenance/acceptOrder.do', paras, function(res) {
      wx.showModal({
        title: '邻客管家',
        content: '抢单成功,请到维修任务中操作订单',
        confirmColor: '#fda414',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../services/services',
            })
          }
        }
      })
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
  nextPage: function() {
    let that = this;
    app.loadMore(that, function() {
      let paras = {};
      let accountInfo = wx.getStorageSync('accountInfo');
      if (that.data.reportState == 0) {
        paras = {
          page: that.data.page,
          reportState: that.data.reportState
        }
      } else {
        paras = {
          page: that.data.page,
          stuffId: accountInfo.id,
          reportState: that.data.reportState
        }
      }
      let oldList = that.data.oList;
      app.request('POST', '/property/maintenance/queryList.do', paras, function(res) {
        let oList = res.data.data;
        for (let i = 0; i < oList.length; i++) {
          if (oList[i].reportType == 0) {
            oList[i].reportTypeText = "水";
          } else if (oList[i].reportType == 1) {
            oList[i].reportTypeText = "电";
          } else if (oList[i].reportType == 2) {
            oList[i].reportTypeText = "燃气";
          } else if (oList[i].reportType == 3) {
            oList[i].reportTypeText = "门锁";
          } else if (oList[i].reportType == 4) {
            oList[i].reportTypeText = "其他";
          }
          if (oList[i].reportState == 0) {
            oList[i].reportStateText = "申请中";
          } else if (oList[i].reportState == 1) {
            oList[i].reportStateText = "已接单";
          } else if (oList[i].reportState == 2) {
            oList[i].reportStateText = "已完成";
          } else if (oList[i].reportState == 3) {
            oList[i].reportStateText = "已评价";
          } else if (oList[i].reportState == 4) {
            oList[i].reportStateText = "已取消";
          }
          oList[i].createTime = app.setTime(oList[i].createTime, 1);
          oldlist.push(oList[i]);
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
    let paras = {};
    let accountInfo = wx.getStorageSync('accountInfo');
    that.setData({
      page: 1,
      reportState: options.reportstate
    })
    if (options.reportstate == 0) {
      paras = {
        page: that.data.page,
        reportState: options.reportstate
      }
      wx.setNavigationBarTitle({
        title: '业主报事',
      })
    } else {
      paras = {
        page: that.data.page,
        stuffId: accountInfo.id,
        reportState: options.reportstate
      }
      if (options.reportstate == 1) {
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
        if (oList[i].reportType == 0) {
          oList[i].reportTypeText = "水";
        } else if (oList[i].reportType == 1) {
          oList[i].reportTypeText = "电";
        } else if (oList[i].reportType == 2) {
          oList[i].reportTypeText = "燃气";
        } else if (oList[i].reportType == 3) {
          oList[i].reportTypeText = "门锁";
        } else if (oList[i].reportType == 4) {
          oList[i].reportTypeText = "其他";
        }
        if (oList[i].reportState == 0) {
          oList[i].reportStateText = "申请中";
        } else if (oList[i].reportState == 1) {
          oList[i].reportStateText = "已接单";
        } else if (oList[i].reportState == 2) {
          oList[i].reportStateText = "已完成";
        } else if (oList[i].reportState == 3) {
          oList[i].reportStateText = "已评价";
        } else if (oList[i].reportState == 4) {
          oList[i].reportStateText = "已取消";
        }
        oList[i].createTime = app.setTime(oList[i].createTime, 1);
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