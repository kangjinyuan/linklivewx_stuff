let app = getApp();
let imgrurl = app.globalData.imgrurl;
Page({
  data: {
    workOrderInfo: {},
    eventList: [],
    assignOrTransferType: ""
  },
  previewImage: function(e) {
    let that = this;
    let current = e.currentTarget.dataset.current;
    let workOrderInfo = that.data.workOrderInfo;
    wx.previewImage({
      current: current,
      urls: workOrderInfo.orderImageList
    })
  },
  operaOrder: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    let workOrderInfo = that.data.workOrderInfo;
    let id = workOrderInfo.id;
    if (flag == "0" || flag == "1") {
      let postUrl = "";
      if (flag == "0") {
        postUrl = "/property/workOrder/acceptOrder.do";
      } else {
        postUrl = "/property/workOrder/executeOrder.do";
      }
      let paras = {
        id: id
      }
      app.request("POST", postUrl, paras, function(res) {
        let prevPage = app.prevPage(2);
        prevPage.removeData(id);
        wx.navigateBack({
          delta: 1
        })
      }, function(res) {
        wx.showToast({
          title: '无法连接服务器，请检查您的网络或重试',
          icon: "none"
        })
      })
    } else if (flag == "2") {
      let assignOrTransferType = that.data.assignOrTransferType;
      if (assignOrTransferType) {
        wx.navigateTo({
          url: '../assignOrTransfer/assignOrTransfer?id=' + id + "&assignOrTransferType=" + assignOrTransferType
        })
      }
    } else if (flag == "3") {
      wx.navigateTo({
        url: '../completeWorkOrder/completeWorkOrder?id=' + id
      })
    }
  },
  onLoad: function(options) {
    let that = this;
    let workOrderInfo = JSON.parse(decodeURIComponent(options.workOrderInfo));
    let accountInfo = wx.getStorageSync("accountInfo");
    let privilege = accountInfo.privilege;
    let assignOrTransferType = that.data.assignOrTransferType;
    let paras = {
      id: workOrderInfo.id
    }
    app.request("POST", "/property/workOrder/queryEventList.do", paras, function(res) {
      let eventList = res.data.data.reverse();
      let orderImageList = workOrderInfo.orderImageList;
      if (orderImageList) {
        for (let i = 0; i < orderImageList.length; i++) {
          orderImageList[i] = imgrurl + orderImageList[i]
        }
      }
      for (let i = 0; i < eventList.length; i++) {
        eventList[i].createTime = app.setTime(eventList[i].createTime, 1);
      }
      for (let i = 0; i < privilege.length; i++) {
        if (workOrderInfo.state == "0") {
          if (privilege[i].id == "0" && privilege[i].checked == true) {
            assignOrTransferType = "0";
          }
        }
        if (workOrderInfo.state == "1" || workOrderInfo.state == "2") {
          if (privilege[i].id == "1" && privilege[i].checked == true) {
            assignOrTransferType = "1";
          }
        }
      }
      that.setData({
        workOrderInfo: workOrderInfo,
        eventList: eventList,
        assignOrTransferType: assignOrTransferType
      })
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: "none"
      })
    })
  }
})