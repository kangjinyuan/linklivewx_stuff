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
    let param = {
      id: id,
      eventDetail: eventDetail
    }
    app.request("POST", "/property/workOrder/completeOrder.do", param, true, function(res) {
      let prevPage = app.prevPage(3);
      prevPage.removeData(id);
      wx.navigateBack({
        delta: 2
      })
    }, function(res) {
      wx.showToast({
        title: '提交失败，请检查您的网络或重试',
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