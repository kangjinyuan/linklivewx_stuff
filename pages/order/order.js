let app = getApp();
Page({
  data: {
    olist: [],
    totalPage: '',
    page: 1
  },
  toorderinfo: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let reportstate = e.currentTarget.dataset.reportstate;
    wx.navigateTo({
      url: '../orderinfo/orderinfo?id=' + id + "&reportstate=" + reportstate,
    })
  },
  roborder: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let paras = {
      id: id
    }
    app.request('POST', '/maintenance/app/acceptOrder.do', paras, function(res) {
      wx.showToast({
        title: '抢单成功',
        icon: 'none',
        success: function() {
          wx.switchTab({
            url: '../task/task',
          })
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
        reportState: 0
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
          app.setTime(olist[i].createTime, function(rtime) {
            olist[i].createTime = rtime;
          })
          oldolist.push(olist[i]);
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
  onShow: function(options) {
    let that = this;
    app.toLogin(function() {
      let paras = {
        page: 1,
        reportState: 0
      }
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
          app.setTime(olist[i].createTime, function(rtime) {
            olist[i].createTime = rtime;
          })
        }
        that.setData({
          olist: olist,
          totalPage: res.data.totalPage
        })
      }, function(res) {
        wx.showToast({
          title: '订单列表加载失败',
          icon: 'none'
        })
      })
    })
  }
})