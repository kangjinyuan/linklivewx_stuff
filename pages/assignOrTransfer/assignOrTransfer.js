let app = getApp();
Page({
  data: {
    assignOrTransferType: "",
    id: "",
    stuffInfo: "",
    eventDetail: ""
  },
  selectcharger: function() {
    let that = this;
    wx.navigateTo({
      url: '../selectCommunication/selectCommunication'
    })
  },
  getEventDetail: function(e) {
    let that = this;
    let eventDetail = e.detail.value;
    that.setData({
      eventDetail: eventDetail
    })
  },
  assignOrTransfer: function() {
    let that = this;
    let assignOrTransferType = that.data.assignOrTransferType;
    let id = that.data.id;
    let eventDetail = that.data.eventDetail;
    let stuffInfo = that.data.stuffInfo;
    let accountInfo = wx.getStorageSync('accountInfo');
    if (stuffInfo == "") {
      wx.showToast({
        title: '请选择负责人',
        icon: "none"
      })
      return false;
    }

    if (stuffInfo.id == accountInfo.id) {
      wx.showToast({
        title: '不能指定自己为负责人哦',
        icon: "none"
      })
      return false;
    }

    if (assignOrTransferType == "1") {
      if (eventDetail == "") {
        wx.showToast({
          title: '请填写工单描述',
          icon: "none"
        })
        return false;
      }
    }

    let paras = {
      id: id,
      chargerId: stuffInfo.id,
      eventDetail: eventDetail
    }
    let postUrl = "";
    if (assignOrTransferType == "0") {
      postUrl = "/property/workOrder/assignOrder.do";
    } else {
      postUrl = "/property/workOrder/transferOrder.do";
    }
    app.request("POST", postUrl, paras, function(res) {
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
    let assignOrTransferType = options.assignOrTransferType;
    if (assignOrTransferType == "0") {
      wx.setNavigationBarTitle({
        title: "分派工单",
      })
    } else {
      wx.setNavigationBarTitle({
        title: "转发工单",
      })
    }
    that.setData({
      id: options.id,
      assignOrTransferType: options.assignOrTransferType
    })
  }
})