let app = getApp();
Page({
  data: {
    olist: [],
    totalPage: '',
    page: 1,
    reportState: ''
  },
  toorderinfo: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let reportState = e.currentTarget.dataset.reportstate;
    wx.navigateTo({
      url: '../orderinfo/orderinfo?id=' + id + "&reportstate=" + reportState,
    })
  },
  roborder: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let paras = {
      id: id
    }
    app.request('POST', '/maintenance/app/acceptOrder.do', paras, function(res) {
      wx.showModal({
        title: '邻客社区员工端',
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
      wx.showToast({
        title: '抢单失败',
        icon: 'none'
      })
    })
  },
  toloadMore: function() {
    let that = this;
    app.loadMore(that, function() {
      let paras = {
        page: that.data.page,
        reportState: that.data.reportState
      };
      let oldolist = that.data.olist;
      app.request('POST', '/maintenance/stuff/queryList.do', paras, function(res) {
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
          app.setTime(olist[i].createTime, function(rtime) {
            olist[i].createTime = rtime;
          })
          if (that.data.reportstate == 0) {
            oldlist.push(olist[i]);
          } else {
            if (olist[i].reportState == 2 || olist[i].reportState == 3 || olist[i].reportState == 4) {
              oldlist.push(olist[i]);
            }
          }
        }
        that.setData({
          olist: oldolist
        })
      }, function() {
        wx.showToast({
          title: '订单列表加载失败',
          icon: 'none'
        })
      })
    })
  },
  onLoad: function(options) {
    let that = this;
    let paras = {};
    let accountInfo = wx.getStorageSync('accountInfo');
    if (options.reportstate == 0) {
      paras = {
        page: 1,
        reportState: options.reportstate
      }
      wx.setNavigationBarTitle({
        title: '业主报事',
      })
      that.setData({
        reportState: options.reportstate
      })
    } else {
      paras = {
        page: 1,
        stuffId: accountInfo.id,
        reportState: ""
      }
      wx.setNavigationBarTitle({
        title: '维修记录',
      })
      that.setData({
        reportState: ""
      })
    }
    let oldlist = [];
    app.request('POST', '/maintenance/stuff/queryList.do', paras, function(res) {
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
        app.setTime(olist[i].createTime, function(rtime) {
          olist[i].createTime = rtime;
        })
        if (options.reportstate == 0) {
          oldlist.push(olist[i]);
        } else {
          if (olist[i].reportState == 2 || olist[i].reportState == 3 || olist[i].reportState == 4) {
            oldlist.push(olist[i]);
          }
        }
      }
      that.setData({
        olist: oldlist,
        totalPage: res.data.totalPage
      })
    }, function(res) {
      wx.showToast({
        title: '订单列表加载失败',
        icon: 'none'
      })
    })
  }
})