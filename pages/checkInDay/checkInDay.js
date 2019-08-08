let app = getApp();
Page({
  data: {
    checkInPeriodList: [],
    dayList: [{
      id: "1",
      name: "周一"
    }, {
      id: "2",
      name: "周二"
    }, {
      id: "3",
      name: "周三"
    }, {
      id: "4",
      name: "周四"
    }, {
      id: "5",
      name: "周五"
    }, {
      id: "6",
      name: "周六"
    }, {
      id: "0",
      name: "周日"
    }],
    autoReset: ""
  },
  getAutoReset: function(e) {
    let that = this;
    let value = e.detail.value;
    let autoReset = that.data.autoReset;
    if (value == true) {
      autoReset = "1";
    } else {
      autoReset = "0";
    }
    that.setData({
      autoReset: autoReset
    })
  },
  setCheckInPeriod: function() {
    let that = this;
    let checkInPeriod = that.data.checkInPeriodList.join(",");
    let autoReset = that.data.autoReset;
    let prevPage = app.prevPage(2);
    let shiftList = prevPage.data.shiftList;
    prevPage.resetCheckInPeriod(checkInPeriod);
    prevPage.setData({
      checkInPeriod: checkInPeriod,
      autoReset: autoReset,
      shiftJson: shiftList
    })
    wx.navigateBack({
      delta: 1
    })
  },
  selectDay: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let checkInPeriodList = that.data.checkInPeriodList;
    let index = app.inArray(id, checkInPeriodList);
    if (index == -1) {
      checkInPeriodList.push(id);
    } else {
      checkInPeriodList.splice(index, 1);
    }
    that.resetData(checkInPeriodList);
  },
  resetData: function(checkInPeriodList) {
    let that = this;
    let dayList = that.data.dayList;
    for (let i = 0; i < dayList.length; i++) {
      dayList[i].isActive = false;
      for (let j = 0; j < checkInPeriodList.length; j++) {
        if (dayList[i].id == checkInPeriodList[j]) {
          dayList[i].isActive = true;
          break;
        }
      }
    }
    that.setData({
      dayList: dayList,
      checkInPeriodList: checkInPeriodList
    })
  },
  onLoad: function(options) {
    let that = this;
    let prevPage = app.prevPage(2);
    let autoReset = prevPage.data.autoReset;
    let checkInPeriod = prevPage.data.checkInPeriod;
    let checkInPeriodList = [];
    if (checkInPeriod) {
      checkInPeriodList = checkInPeriod.split(",");
    }
    that.setData({
      autoReset: autoReset
    })
    that.resetData(checkInPeriodList);
  }
})