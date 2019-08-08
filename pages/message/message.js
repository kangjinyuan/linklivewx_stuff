let app = getApp();
Page({
  data: {
    messageList: [],
    page: 1,
    totalPage: ""
  },
  navigateTo: function(e) {
    let that = this;
    let massageInfo = e.currentTarget.dataset.massageInfo;
    if (massageInfo.notifyType == "0") {
      wx.navigateTo({
        url: '../order/order?reportState=0'
      })
    } else if (massageInfo.notifyType == "1" ||
      massageInfo.notifyType == "2") {
      wx.navigateTo({
        url: '../order/order?reportState=1'
      })
    } else if (massageInfo.notifyType == "3") {
      wx.navigateTo({
        url: '../order/order?reportState=2'
      })
    } else if (massageInfo.notifyType == "5" || massageInfo.notifyType == "6" || massageInfo.notifyType == "7" || massageInfo.notifyType == "8" || massageInfo.notifyType == "9") {
      wx.navigateTo({
        url: '../workOrder/workOrder'
      })
    } else {
      let param = {
        id: massageInfo.notifyData
      }
      app.request('POST', '/account/stuff/queryList.do', param, false, function(res) {
        let stuffList = res.data.data;
        if (stuffList.length == 0) {
          wx.showToast({
            title: '员工不存在',
            icon: "none"
          })
        } else {
          let stuffInfo = stuffList[0];
          let checkInGroupId = stuffInfo.checkInGroupId;
          var param = {
            id: checkInGroupId
          }
          app.request("POST", "/property/checkInGroup/queryList.do", param, true, function(res) {
            let accountInfo = wx.getStorageSync('accountInfo');
            let checkInGroupInfo = res.data.data[0];
            let leaderJson = JSON.parse(checkInGroupInfo.leaderJson);
            let leaderIdList = [];
            for (let i = 0; i < leaderJson.length; i++) {
              leaderIdList.push(leaderJson[i].id);
            }
            if (app.inArray(accountInfo.id, leaderIdList) == -1) {
              wx.showToast({
                title: '你已不是' + stuffInfo.name + '主管',
                icon: "none"
              })
            } else {
              wx.navigateTo({
                url: '../checkInCalendar/checkInCalendar?isLeader=1&notifyData=' + massageInfo.notifyData + "&notifyValue=" + massageInfo.notifyValue
              })
            }
          }, function(res) {
            wx.showToast({
              title: '获取考勤组失败，请检查您的网络或重试',
              icon: "none"
            })
          })
        }
      }, function(res) {
        wx.showToast({
          title: '获取员工失败，请检查您的网络或重试',
          icon: "none"
        })
      })
    }
  },
  resetData: function(obj) {
    let that = this;
    obj.createTime = app.setTime(obj.createTime, 3)
    return obj;
  },
  nextPage: function() {
    let that = this;
    app.loadMore(that, function() {
      let param = {
        page: that.data.page
      };
      let oldList = that.data.messageList;
      app.request('POST', '/account/stuff/queryList.do', param, true, function(res) {
        let messageList = res.data.data;
        for (let i = 0; i < messageList.length; i++) {
          oldList.push(that.resetData(messageList[i]));
        }
        that.setData({
          messageList: oldList
        })
      }, function() {
        wx.showToast({
          title: '无法连接服务器，请检查您的网络或重试',
          icon: 'none'
        })
      })
    })
  },
  onShow: function() {
    let that = this;
    let communityInfo = wx.getStorageSync("communityInfo");
    if (communityInfo) {
      let param = {
        page: 1
      }
      app.request("POST", "/message/staff/queryList.do", param, true, function(res) {
        let messageList = res.data.data;
        for (let i = 0; i < messageList.length; i++) {
          messageList[i] = that.resetData(messageList[i]);
        }
        that.setData({
          messageList: messageList,
          totalPage: res.data.totalPage
        })
      }, function(res) {
        wx.showToast({
          title: '无法连接服务器，请检查您的网络或重试',
          icon: "none"
        })
      })
    } else {
      wx.showModal({
        title: '邻客管家',
        content: '邻客管家提示您，请选择社区',
        confirmText: '去选择',
        confirmColor: '#fda414',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../index/index',
            })
          }
        }
      })
    }
  }
})