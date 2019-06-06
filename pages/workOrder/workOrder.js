let app = getApp();
Page({
  data: {
    totalPage: '',
    page: 1,
    tabList: [{
      state: "0",
      title: "待分派"
    }, {
      state: "1",
      title: "已接单"
    }, {
      state: "2",
      title: "处理中"
    }, {
      state: "3",
      title: "已完成"
    }, {
      state: "",
      title: "全部"
    }],
    state: "0",
    workOrderList: [],
    issueId: ""
  },
  tabState: function(e) {
    let that = this;
    let state = e.currentTarget.dataset.state;
    that.setData({
      state: state,
      page: 1
    })
    that.onLoad();
  },
  addWorkOrder: function() {
    let that = this;
    wx.navigateTo({
      url: '../addWorkOrder/addWorkOrder'
    })
  },
  workOrderInfo: function(e) {
    let that = this;
    let workOrderInfo = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.workOrderInfo));
    wx.navigateTo({
      url: '../workOrderInfo/workOrderInfo?workOrderInfo=' + workOrderInfo
    })
  },
  scanCode: function(e) {
    let that = this;
    let scanType = ['qrCode'];
    app.scanCode(scanType, function(res) {
      let issueId = res.result.split("-")[0];
      that.setData({
        page: 1,
        issueId: issueId
      })
      that.onLoad();
    }, function(res) {
      wx.showToast({
        title: '请扫描正确的设施设备二维码',
        icon: 'none'
      })
    });
  },
  removeData: function(id) {
    let that = this;
    let workOrderList = that.data.workOrderList;
    for (let i = 0; i < workOrderList.length; i++) {
      if (id == workOrderList[i].id) {
        workOrderList.splice(i--, 1);
      }
    }
    that.setData({
      workOrderList: workOrderList
    })
  },
  resetData: function(obj) {
    obj.createTime = app.setTime(obj.createTime, 1);
    obj.scheduleEndTime = app.setTime(obj.scheduleEndTime, 1);
    if (obj.state == 0) {
      obj.stateText = "待分派";
      obj.stateTextColorClass = "check-task-state0";
      obj.borderColorClass = "check-task-list-border0"
    } else if (obj.state == 1) {
      obj.stateText = "已接单";
      obj.stateTextColorClass = "check-task-state1"
      obj.borderColorClass = "check-task-list-border1"
    } else if (obj.state == 2) {
      obj.stateText = "处理中";
      obj.stateTextColorClass = "check-task-state2";
      obj.borderColorClass = "check-task-list-border2"
    } else if (obj.state == 3) {
      obj.stateText = "已完成";
      obj.stateTextColorClass = "check-task-state3"
      obj.borderColorClass = "check-task-list-border3"
    } else if (obj.state == 4) {
      obj.stateText = "已关闭";
      obj.stateTextColorClass = "check-task-state4"
      obj.borderColorClass = "check-task-list-border4"
    }
    if (obj.orderReason == 0) {
      obj.orderReasonText = "工程类";
    } else if (obj.orderReason == 1) {
      obj.orderReasonText = "客服类";
    } else if (obj.orderReason == 2) {
      obj.orderReasonText = "保洁类";
    } else if (obj.orderReason == 3) {
      obj.orderReasonText = "绿化类";
    } else if (obj.orderReason == 4) {
      obj.orderReasonText = "秩序类";
    }
    if (obj.issueType == 0) {
      obj.issueTypeText = "其他";
    } else if (obj.issueType == 1) {
      obj.issueTypeText = "设备";
    } else if (obj.issueType == 2) {
      obj.issueTypeText = "设施";
    }
    return obj;
  },
  nextPage: function() {
    let that = this;
    app.loadMore(that, function() {
      let accountInfo = wx.getStorageSync("accountInfo");
      let state = that.data.state;
      let param = {};
      if (state == "0") {
        param = {
          page: that.data.page,
          state: state,
          issueId: that.data.issueId
        }
      } else {
        param = {
          page: that.data.page,
          state: state,
          chargerId: accountInfo.id,
          issueId: that.data.issueId
        }
      }
      let oldList = that.data.workOrderList;
      app.request('POST', '/property/checkTaskExecution/queryList.do', param, true, function(res) {
        let workOrderList = res.data.data;
        for (let i = 0; i < workOrderList.length; i++) {
          oldList.push(that.resetData(workOrderList[i]));
        }
        that.setData({
          workOrderList: oldList
        })
      }, function() {
        wx.showToast({
          title: '无法连接服务器，请检查您的网络或重试',
          icon: 'none'
        })
      })
    })
  },
  onLoad: function(options) {
    let that = this;
    let accountInfo = wx.getStorageSync("accountInfo");
    let state = that.data.state;
    let param = {};
    if (state == "0") {
      param = {
        page: that.data.page,
        state: state,
        issueId: that.data.issueId
      }
    } else {
      param = {
        page: that.data.page,
        state: state,
        chargerId: accountInfo.id,
        issueId: that.data.issueId
      }
    }
    app.request("POST", "/property/workOrder/queryList.do", param, true, function(res) {
      let workOrderList = res.data.data;
      for (let i = 0; i < workOrderList.length; i++) {
        workOrderList[i] = that.resetData(workOrderList[i]);
      }
      that.setData({
        workOrderList: workOrderList,
        totalPage: res.data.totalPage
      })
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: "none"
      })
    });
  }
})