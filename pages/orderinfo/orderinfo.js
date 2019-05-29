let app = getApp();
let imgrurl = app.globalData.imgrurl;
Page({
  data: {
    orderInfo: {},
    btntext: ''
  },
  previewImage: function(e) {
    let that = this;
    let current = e.currentTarget.dataset.current;
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
    let prevPage = app.prevPage(2);
    let postUrl = "";
    if (orderInfo.reportState == 0) {
      postUrl = "/property/maintenance/acceptOrder.do";
    } else if (orderInfo.reportState == 1) {
      postUrl = "/property/maintenance/completeOrder.do";
    }
    let paras = {
      id: orderInfo.id
    }
    app.request('POST', postUrl, paras, function(res) {
      prevPage.removeData(orderInfo.id);
      wx.navigateBack({
        delta: 1
      })
    }, function(res) {
      if (res.data.code == "0005") {
        wx.showToast({
          title: '订单不存在',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '无法连接服务器，请检查您的网络或重试',
          icon: 'none'
        })
      }
    })
  },
  onLoad: function(options) {
    let that = this;
    let orderInfo = JSON.parse(decodeURIComponent(options.orderInfo));
    wx.setNavigationBarTitle({
      title: orderInfo.reportStateText,
    })
    if (orderInfo.reportState == 0) {
      that.setData({
        btntext: '抢单'
      })
    } else if (orderInfo.reportState == 1) {
      that.setData({
        btntext: '完成'
      })
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
    that.setData({
      orderInfo: orderInfo
    })
  }
})