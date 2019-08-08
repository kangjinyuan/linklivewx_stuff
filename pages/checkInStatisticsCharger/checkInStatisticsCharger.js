let app = getApp();
let dateTimePicker = require('../../utils/dateTimePicker.js');
let circleProgress = require("../../utils/circleProgress.js");
Page({
  data: {
    tabList: [{
      state: "0",
      name: '日统计',
    }, {
      state: "1",
      name: '月统计'
    }, {
      state: "2",
      name: '我的'
    }],
    state: "0",
    showCheckInGroup: true,
    checkInGroupList: [],
    checkInGroupIndex: 0,
    selectDayTime: app.setTime(new Date(), 3),
    selectTimeArray: [],
    selectMonthTime: "",
    selectMonthTimeText: app.setTime(new Date(), 4),
    selectMineTime: "",
    selectMineTimeText: app.setTime(new Date(), 4),
    recordInfo: "",
    memberLength: ""
  },
  checkInInfo: function(e) {
    let that = this;
    let checkState = e.currentTarget.dataset.checkState;
    let number = e.currentTarget.dataset.number;
    if (number == "0") {
      if (checkState == "1") {
        wx.showToast({
          title: '暂无人迟到',
          icon: "none"
        })
      } else if (checkState == "3") {
        wx.showToast({
          title: '暂无人早退',
          icon: "none"
        })
      } else if (checkState == "5") {
        wx.showToast({
          title: '暂无人缺卡',
          icon: "none"
        })
      } else if (checkState == "2") {
        wx.showToast({
          title: '暂无人旷工',
          icon: "none"
        })
      }
      return false;
    }
    wx.navigateTo({
      url: '../checkInInfo/checkInInfo?checkState=' + checkState
    })
  },
  showCheckInGroup: function() {
    let that = this;
    let showCheckInGroup = that.data.showCheckInGroup;
    showCheckInGroup = !showCheckInGroup;
    that.setData({
      showCheckInGroup: showCheckInGroup
    })
  },
  hitCardInfo: function() {
    let that = this;
    let recordInfo = that.data.recordInfo;
    if (recordInfo.checkInCount == "0") {
      wx.showToast({
        title: '暂无人打卡',
        icon: "none"
      })
      return false;
    }
    wx.navigateTo({
      url: '../hitCardInfo/hitCardInfo'
    })
  },
  selectCheckInGroup: function(e) {
    let that = this;
    let checkInGroupIndex = e.currentTarget.dataset.index;
    that.setData({
      checkInGroupIndex: checkInGroupIndex
    })
    that.showCheckInGroup();
    that.record();
  },
  getSelectTime: function(e) {
    let that = this;
    let state = that.data.state;
    let value = e.detail.value;
    let selectTimeArray = that.data.selectTimeArray;
    let selectMonthTime = that.data.selectMonthTime;
    let selectMineTime = that.data.selectMineTime;
    if (state == "0") {
      that.setData({
        selectDayTime: value
      })
    } else {
      if (state == '1') {
        let selectMonthTimeText = selectTimeArray[0][selectMonthTime[0]] +
          "-" +
          selectTimeArray[1][selectMonthTime[1]];
        that.setData({
          selectMonthTimeText: selectMonthTimeText
        })
      } else {
        let selectMineTimeText = selectTimeArray[0][selectMineTime[0]] +
          "-" +
          selectTimeArray[1][selectMineTime[1]];
        that.setData({
          selectMineTimeText: selectMineTimeText
        })
      }
    }
    that.record();
  },
  changeDateTimeColumn: function(e) {
    let that = this;
    let state = that.data.state;
    if (state == "1") {
      dateTimePicker.changeDateTimeColumn(that.data.selectMonthTime, that.data.selectTimeArray, e, function(dateTime, dateTimeArray) {
        that.setData({
          selectMonthTime: dateTime
        });
      })
    } else {
      dateTimePicker.changeDateTimeColumn(that.data.selectMineTime, that.data.selectTimeArray, e, function(dateTime, dateTimeArray) {
        that.setData({
          selectMineTime: dateTime
        });
      })
    }
  },
  tabState: function(e) {
    let that = this;
    let state = e.currentTarget.dataset.state;
    that.setData({
      state: state,
    })
    that.record();
  },
  record: function() {
    let that = this;
    let state = that.data.state;
    let checkInGroupList = that.data.checkInGroupList;
    let checkInGroupIndex = that.data.checkInGroupIndex;
    let checkInGroupInfo = checkInGroupList[checkInGroupIndex];
    let memberLength = JSON.parse(checkInGroupInfo.memberJson).length;
    let param = {};
    let requestUrl = "";
    if (state == "0" || state == "1") {
      if (state == "0") {
        let selectDayTime = that.data.selectDayTime.split("-");
        param = {
          checkInGroupId: checkInGroupInfo.id,
          year: selectDayTime[0],
          month: selectDayTime[1],
          day: selectDayTime[2]
        }
      } else {
        let selectMonthTime = that.data.selectMonthTimeText.split("-");
        param = {
          checkInGroupId: checkInGroupInfo.id,
          year: selectMonthTime[0],
          month: selectMonthTime[1]
        }
      }
      requestUrl = "/statistics/checkIn/record.do";
    } else {
      let selectMineTime = that.data.selectMineTimeText.split("-");
      param = {
        year: selectMineTime[0],
        month: selectMineTime[1]
      }
      requestUrl = "/statistics/checkIn/personal/record.do";
    }
    app.request("POST", requestUrl, param, true, function(res) {
      let recordInfo = res.data.data;
      if (state == "0") {
        circleProgress.drawProgressBg("canvasProgressBg");
        circleProgress.runProgress("canvasProgress", recordInfo.checkInCount, memberLength, "#f94b23", "#ffca3d");
      }
      that.setData({
        recordInfo: recordInfo,
        memberLength: memberLength
      })
    }, function(res) {
      wx.showToast({
        title: '获取考勤统计失败，请检查您的网络或重试',
        icon: 'none'
      })
    })
  },
  onLoad: function(options) {
    let that = this;
    let prevPage = app.prevPage(2);
    let checkInGroupList = prevPage.data.checkInGroupList;
    that.setData({
      checkInGroupList: checkInGroupList
    })
    dateTimePicker.dateTimePickerInit('', function(res) {
      let selectTime = res.dateTime;
      let selectTimeArray = res.dateTimeArray;
      that.setData({
        selectTimeArray: selectTimeArray,
        selectMonthTime: selectTime,
        selectMineTime: selectTime
      });
      that.record();
    }, 2);
  }
})