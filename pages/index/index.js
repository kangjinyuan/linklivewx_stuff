let app = getApp();
Page({
  data: {
    communityInfo: "",
    accountInfo: "",
    serviceList: [],
    scheduleEndTime: app.setTime(new Date(), 9),
    reportInfo: {},
    taskInfo: {}
  },
  selectCommunity: function() {
    let that = this;
    wx.navigateTo({
      url: '../selectCommunity/selectCommunity',
    })
  },
  topages: function(e) {
    let that = this;
    let communityInfo = that.data.communityInfo;
    let id = e.currentTarget.dataset.id;
    if (communityInfo) {
      if (id == 0) {
        wx.navigateTo({
          url: "../order/order?reportState=0"
        })
      } else if (id == 1) {
        wx.navigateTo({
          url: "../order/order?reportState=1"
        })
      } else if (id == 2) {
        wx.navigateTo({
          url: "../express/express"
        })
      } else if (id == 3) {
        wx.navigateTo({
          url: "../meter/meter"
        })
      } else if (id == 4) {
        wx.navigateTo({
          url: "../networkOpenDoor/networkOpenDoor"
        })
      } else if (id == 5) {
        wx.navigateTo({
          url: "../face/face"
        })
      } else if (id == 6) {
        wx.navigateTo({
          url: "../checkTask/checkTask"
        })
      } else if (id == 7) {
        wx.navigateTo({
          url: "../workOrder/workOrder"
        })
      }
    } else {
      wx.showToast({
        title: '请选择社区',
        icon: "none"
      })
    }
  },
  getReprotInfo: function() {
    let that = this;
    let param = {};
    app.request("POST", "/statistics/stuff/report.do", param, false, function(res) {
      let reportInfo = res.data.data[0];
      that.setData({
        reportInfo: reportInfo
      })
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: "none"
      })
    });
  },
  getTaskInfo: function() {
    let that = this;
    let param = {};
    app.request("POST", "/statistics/stuff/task.do", param, false, function(res) {
      let taskInfo = res.data.data[0];
      that.setData({
        taskInfo: taskInfo
      })
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: "none"
      })
    });
  },
  onShow: function(options) {
    let that = this;
    app.toLogin(function() {
      let communityInfo = wx.getStorageSync('communityInfo');
      let accountInfo = wx.getStorageSync('accountInfo');
      let param = {
        id: accountInfo.id
      }
      app.request('POST', '/account/stuff/queryList.do', param, false, function(res) {
        let stuffInfo = res.data.data[0];
        let dutyScope = JSON.parse(stuffInfo.dutyScope);
        dutyScope = dutyScope.sort(app.resetSort("sort", 1));
        for (let i = 0; i < dutyScope.length; i++) {
          if (dutyScope[i].checked == false) {
            dutyScope.splice(i--, 1);
          }
        }
        stuffInfo.dutyScope = dutyScope;
        let privilege = JSON.parse(stuffInfo.privilege);
        stuffInfo.privilege = privilege;
        wx.setStorageSync('accountInfo', stuffInfo);
        that.setData({
          communityInfo: communityInfo,
          accountInfo: stuffInfo,
          servicesList: app.setPageData(dutyScope, 4)
        })
        that.getReprotInfo();
        that.getTaskInfo();
      }, function(res) {
        wx.setStorageSync("accessToken", "");
        that.onShow();
      })
    })
  }
})