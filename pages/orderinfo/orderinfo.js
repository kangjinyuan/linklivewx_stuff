let app = getApp();
let imgrurl = app.globalData.imgrurl;
Page({
  data: {
    orderInfo: {},
    btntext: ''
  },
  previewImage: function(e) {
    let that = this;
    let current = e.currentTarget.dataset.src;
    let orderInfo = that.data.orderInfo;
    let urls = [];
    if (orderInfo.image0) {
      urls.push(orderInfo.image0);
    }
    if (orderInfo.image1) {
      urls.push(orderInfo.image1);
    }
    if (orderInfo.image2) {
      urls.push(orderInfo.image2);
    }
    wx.previewImage({
      current: current,
      urls: urls
    })
  },
  setOrder: function(e) {
    let that = this;
    let orderInfo = that.data.orderInfo;
    let paras = {
      id: orderInfo.id
    }
    if (orderInfo.reportState == 0) {
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
    } else if (orderInfo.reportState == 1) {
      app.request('POST', '/property/maintenance/completeOrder.do', paras, function(res) {
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
          title: '无法连接服务器，请检查您的网络或重试',
          icon: 'none'
        })
      })
    }
  },
  onLoad: function(options) {
    let that = this;
    let orderInfo = JSON.parse(options.orderInfo);
    if (orderInfo.reportState == 0) {
      orderInfo.reportStateText = "申请中";
      that.setData({
        btntext: '抢单'
      })
    } else if (orderInfo.reportState == 1) {
      orderInfo.reportStateText = "已接单";
      that.setData({
        btntext: '完成'
      })
    } else if (orderInfo.reportState == 2) {
      orderInfo.reportStateText = "已完成";
    } else if (orderInfo.reportState == 3) {
      orderInfo.reportStateText = "已评价";
    } else if (orderInfo.reportState == 4) {
      orderInfo.reportStateText = "已取消";
    }
    if (orderInfo.reportType == 0) {
      orderInfo.reportTypeText = "水";
    } else if (orderInfo.reportType == 1) {
      orderInfo.reportTypeText = "电";
    } else if (orderInfo.reportType == 2) {
      orderInfo.reportTypeText = "燃气";
    } else if (orderInfo.reportType == 3) {
      orderInfo.reportTypeText = "门锁";
    } else if (orderInfo.reportType == 4) {
      orderInfo.reportTypeText = "其他";
    }
    if (orderInfo.score == 0) {
      orderInfo.scoreText = "吐槽";
    } else if (orderInfo.score == 1) {
      orderInfo.scoreText = "满意";
    } else if (orderInfo.score == 2) {
      orderInfo.scoreText = "超赞";
    }
    if (orderInfo.image0) {
      orderInfo.image0 = imgrurl + orderInfo.image0;
    }
    if (orderInfo.image1) {
      orderInfo.image1 = imgrurl + orderInfo.image1;
    }
    if (orderInfo.image2) {
      orderInfo.image2 = imgrurl + orderInfo.image2;
    }
    orderInfo.progress = JSON.parse(orderInfo.progress).reverse();
    for (let i = 0; i < orderInfo.progress.length; i++) {
      orderInfo.progress[i].time = app.setTime(orderInfo.progress[i].time, 1);
    }
    wx.setNavigationBarTitle({
      title: orderInfo.reportStateText,
    })
    that.setData({
      orderInfo: orderInfo
    })
  }
})