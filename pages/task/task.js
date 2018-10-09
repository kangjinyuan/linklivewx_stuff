let app = getApp();
Page({
  data: {
    olist: [],
    totalPage: '',
    page: 1,
    tabindex: 0,
    tablist: [{
      id: 0,
      name: '我的任务',
    }, {
      id: 1,
      name: '全部任务'
    }]
  },
  stab: function(e) {
    let that = this;
    let tabindex = e.currentTarget.dataset.tabindex;
    that.setData({
      tabindex: tabindex
    })
    that.onLoad();
  },
  toorderinfo: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let reportstate = e.currentTarget.dataset.reportstate;
    wx.navigateTo({
      url: '../orderinfo/orderinfo?id=' + id + "&reportstate=" + reportstate,
    })
  },
  toloadMore: function() {
    let that = this;
    app.loadMore(that, function() {
      let accountInfo = wx.getStorageSync('accountInfo');
      let paras = {
        page: that.data.page,
        stuffId: accountInfo.id
      }
      let oldolist = that.data.olist;
      app.request('POST', '/maintenance/stuff/queryList.do', paras, function(res) {
        let olist = res.data.data;
        for (let i = 0; i < olist.length; i++) {
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
          app.setTime(olist[i].createTime, function(rtime) {
            olist[i].createTime = rtime;
          })
          if (that.data.tabindex == 0) {
            if (olist[i].reportState == 1) {
              oldlist.push(olist[i]);
            }
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
    let accountInfo = wx.getStorageSync('accountInfo');
    let paras = {
      page: 1,
      stuffId: accountInfo.id
    }
    let oldlist = [];
    app.request('POST', '/maintenance/stuff/queryList.do', paras, function(res) {
      let olist = res.data.data;
      for (let i = 0; i < olist.length; i++) {
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
        app.setTime(olist[i].createTime, function(rtime) {
          olist[i].createTime = rtime;
        })
        if (that.data.tabindex == 0) {
          if (olist[i].reportState == 1) {
            oldlist.push(olist[i]);
          }
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