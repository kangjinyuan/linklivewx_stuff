let app = getApp();
Page({
  data: {
    eventDetail: "",
    id: ""
  },
  getEventDetail: function(e) {
    let that = this;
    let eventDetail = e.detail.value;
    that.setData({
      eventDetail: eventDetail
    })
  },
  completeWorkOrder: function() {
    let that = this;
    let id = that.data.id;
    let eventDetail = that.data.eventDetail;
    let paras = {
      id: id,
      eventDetail: eventDetail
    }
    app.request("POST", "/property/workOrder/completeOrder.do", paras, function(res) {
      let prevPage = app.prevPage(3);
      prevPage.removeData(id);
      wx.navigateBack({
        delta: 2
      })
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: "none"
      })
    })
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      id: options.id
    })
  }
})