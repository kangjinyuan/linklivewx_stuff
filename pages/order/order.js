let app = getApp();
Page({
  data: {
    olist: [],
    totalPage: '',
    page: 1,
    reportState: '',
    tablist: [{
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
  toorderinfo: function(e) {
    let that = this;
    let orderinfo = e.currentTarget.dataset.orderinfo;
    orderinfo = JSON.stringify(orderinfo);
    wx.navigateTo({
      url: '../orderinfo/orderinfo?orderinfo=' + orderinfo
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
  roborder: function(e) {
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
      let oldlist = that.data.olist;
      app.request('POST', '/property/maintenance/queryList.do', paras, function(res) {
        let olist = res.data.data;
        for (let i = 0; i < olist.length; i++) {
          if (olist[i].reportType == 0) {
            olist[i].reportTypetext = "水";
          } else if (olist[i].reportType == 1) {
            olist[i].reportTypetext = "电";
          } else if (olist[i].reportType == 2) {
            olist[i].reportTypetext = "燃气";
          } else if (olist[i].reportType == 3) {
            olist[i].reportTypetext = "门锁";
          } else if (olist[i].reportType == 4) {
            olist[i].reportTypetext = "其他";
          }
          if (olist[i].reportState == 0) {
            olist[i].reportStatetext = "申请中";
          } else if (olist[i].reportState == 1) {
            olist[i].reportStatetext = "已接单";
          } else if (olist[i].reportState == 2) {
            olist[i].reportStatetext = "已完成";
          } else if (olist[i].reportState == 3) {
            olist[i].reportStatetext = "已评价";
          } else if (olist[i].reportState == 4) {
            olist[i].reportStatetext = "已取消";
          }
          olist[i].createTime = app.setTime(olist[i].createTime, 1);
          oldlist.push(olist[i]);
        }
        that.setData({
          olist: oldlist
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
      let olist = res.data.data;
      for (let i = 0; i < olist.length; i++) {
        if (olist[i].reportType == 0) {
          olist[i].reportTypetext = "水";
        } else if (olist[i].reportType == 1) {
          olist[i].reportTypetext = "电";
        } else if (olist[i].reportType == 2) {
          olist[i].reportTypetext = "燃气";
        } else if (olist[i].reportType == 3) {
          olist[i].reportTypetext = "门锁";
        } else if (olist[i].reportType == 4) {
          olist[i].reportTypetext = "其他";
        }
        if (olist[i].reportState == 0) {
          olist[i].reportStatetext = "申请中";
        } else if (olist[i].reportState == 1) {
          olist[i].reportStatetext = "已接单";
        } else if (olist[i].reportState == 2) {
          olist[i].reportStatetext = "已完成";
        } else if (olist[i].reportState == 3) {
          olist[i].reportStatetext = "已评价";
        } else if (olist[i].reportState == 4) {
          olist[i].reportStatetext = "已取消";
        }
        olist[i].createTime = app.setTime(olist[i].createTime, 1);
      }
      that.setData({
        olist: olist,
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