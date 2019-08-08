let app = getApp();
let imgUrl = app.globalData.imgUrl;
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
      let requestUrl = "";
      if (flag == "0") {
        requestUrl = "/property/workOrder/acceptOrder.do";
      } else {
        requestUrl = "/property/workOrder/executeOrder.do";
      }
      app.setFormId(e, function(res) {
        let param = {
          id: id
        }
        app.request("POST", requestUrl, param, true, function(res) {
          let prevPage = app.prevPage(2);
          prevPage.removeData(id);
          wx.navigateBack({
            delta: 1
          })
        }, function(res) {
          if (flag == "0") {
            wx.showToast({
              title: '抢单失败，请检查您的网络或重试',
              icon: "none"
            })
          } else {
            wx.showToast({
              title: '执行失败，请检查您的网络或重试',
              icon: "none"
            })
          }
        })
      });
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
    let assignOrTransferType = that.data.assignOrTransferType;
    let param = {
      id: workOrderInfo.id
    }
    app.request("POST", "/property/workOrder/queryEventList.do", param, true, function(res) {
      let eventList = res.data.data.reverse();
      let orderImageList = workOrderInfo.orderImageList;
      if (orderImageList) {
        for (let i = 0; i < orderImageList.length; i++) {
          orderImageList[i] = imgUrl + orderImageList[i]
        }
      }
      for (let i = 0; i < eventList.length; i++) {
        eventList[i].createTime = app.setTime(eventList[i].createTime, 1);
      }
      if (workOrderInfo.state == "0") {
        let privilegeState = app.privilegeState(0);
        if (privilegeState) {
          assignOrTransferType = "0";
        }
      }
      if (workOrderInfo.state == "1") {
        let privilegeState = app.privilegeState(1);
        if (privilegeState) {
          assignOrTransferType = "1";
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