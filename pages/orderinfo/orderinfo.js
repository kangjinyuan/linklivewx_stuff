let app = getApp();
Page({
  data: {
    orderinfo: {},
    reportstate: '',
    btntext: ''
  },
  previewImage: function(e) {
    let that = this;
    let current = e.currentTarget.dataset.src;
    let images = [];
    images.push(current);
    wx.previewImage({
      current: current,
      urls: images
    })
  },
  roborder: function(e) {
    let that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let paras = {
      id: that.data.orderinfo.id
    }
    if (that.data.reportstate == 0) {
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
    } else if (that.data.reportstate == 1) {
      app.request('POST', '/maintenance/app/completeOrder.do', paras, function(res) {
        prevPage.setData({
          tabindex: 1
        })
        prevPage.onLoad();
        wx.navigateBack(1);
      }, function(res) {
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        })
      })
    }
  },
  onLoad: function(options) {
    let that = this;
    let id = options.id;
    let reportstate = options.reportstate;
    if (reportstate == 0) {
      that.setData({
        reportstate: reportstate,
        btntext: '抢单'
      })
    } else {
      that.setData({
        reportstate: reportstate,
        btntext: '完成'
      })
    }
    let paras = {
      id: id
    }
    app.request('POST', '/maintenance/stuff/queryList.do', paras, function(res) {
      let orderinfo = res.data.data[0];
      if (orderinfo.reportState == 0) {
        orderinfo.reportStatetext = "申请中";
      } else if (orderinfo.reportState == 1) {
        orderinfo.reportStatetext = "已接单";
      } else if (orderinfo.reportState == 2) {
        orderinfo.reportStatetext = "已完成";
      } else if (orderinfo.reportState == 3) {
        orderinfo.reportStatetext = "已评价";
      } else if (orderinfo.reportState == 4) {
        orderinfo.reportStatetext = "已取消";
      }
      if (orderinfo.reportType == 0) {
        orderinfo.reportTypetext = "水";
      } else if (orderinfo.reportType == 1) {
        orderinfo.reportTypetext = "电";
      } else if (orderinfo.reportType == 2) {
        orderinfo.reportTypetext = "燃气";
      } else if (orderinfo.reportType == 3) {
        orderinfo.reportTypetext = "门锁";
      } else if (orderinfo.reportType == 4) {
        orderinfo.reportTypetext = "其他";
      }
      if (orderinfo.score == 1) {
        orderinfo.scoretext = "吐槽";
      } else if (orderinfo.score == 2) {
        orderinfo.scoretext = "满意";
      } else if (orderinfo.score == 3) {
        orderinfo.scoretext = "超赞";
      }
      if (orderinfo.image0) {
        orderinfo.image0 = app.globalData.crurl + orderinfo.image0;
      }
      if (orderinfo.image1) {
        orderinfo.image1 = app.globalData.crurl + orderinfo.image1;
      }
      if (orderinfo.image2) {
        orderinfo.image2 = app.globalData.crurl + orderinfo.image2;
      }
      orderinfo.progress = JSON.parse(orderinfo.progress).reverse();
      for (var i = 0; i < orderinfo.progress.length; i++) {
        app.setTime(orderinfo.progress[i].time, function(rtime) {
          orderinfo.progress[i].time = rtime;
        })
      }
      wx.setNavigationBarTitle({
        title: orderinfo.reportStatetext,
      })
      that.setData({
        orderinfo: orderinfo
      })
    }, function(res) {
      wx.showToast({
        title: '订单详情加载失败',
        icon: 'none'
      })
    })
  }
})