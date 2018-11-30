let app = getApp();
let imgrurl = app.globalData.imgrurl;
Page({
  data: {
    orderinfo: {},
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
    let orderinfo = that.data.orderinfo;
    let paras = {
      id: orderinfo.id
    }
    if (orderinfo.reportState == 0) {
      app.request('POST', '/maintenance/app/acceptOrder.do', paras, function(res) {
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
        wx.showToast({
          title: '抢单失败',
          icon: 'none'
        })
      })
    } else if (orderinfo.reportState == 1) {
      app.request('POST', '/maintenance/app/completeOrder.do', paras, function(res) {
        wx.showModal({
          title: '邻客管家',
          content: '订单已完成,请到维修记录中查看',
          confirmColor: '#fda414',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../mine/mine',
              })
            }
          }
        })
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
    let orderinfo = options.orderinfo;
    orderinfo = JSON.parse(orderinfo);
    if (orderinfo.reportState == 0) {
      orderinfo.reportStatetext = "申请中";
      that.setData({
        btntext: '抢单'
      })
    } else if (orderinfo.reportState == 1) {
      orderinfo.reportStatetext = "已接单";
      that.setData({
        btntext: '完成'
      })
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
    if (orderinfo.score == 0) {
      orderinfo.scoretext = "吐槽";
    } else if (orderinfo.score == 1) {
      orderinfo.scoretext = "满意";
    } else if (orderinfo.score == 2) {
      orderinfo.scoretext = "超赞";
    }
    if (orderinfo.image0) {
      orderinfo.image0 = imgrurl + orderinfo.image0 + "?imageView2/2/w/136/h/136|imageslim";
    }
    if (orderinfo.image1) {
      orderinfo.image1 = imgrurl + orderinfo.image1 + "?imageView2/2/w/136/h/136|imageslim";
    }
    if (orderinfo.image2) {
      orderinfo.image2 = imgrurl + orderinfo.image2 + "?imageView2/2/w/136/h/136|imageslim";
    }
    orderinfo.progress = JSON.parse(orderinfo.progress).reverse();
    for (let i = 0; i < orderinfo.progress.length; i++) {
      orderinfo.progress[i].time = app.setTime(orderinfo.progress[i].time, 1);
    }
    wx.setNavigationBarTitle({
      title: orderinfo.reportStatetext,
    })
    that.setData({
      orderinfo: orderinfo
    })
  }
})