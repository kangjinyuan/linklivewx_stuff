let calendar = require("../../utils/calendar.js");
let app = getApp();
let imgUrl = app.globalData.imgUrl;
let newDate = app.setTimeStamp(new Date());
let endTime = app.setEndTime(app.setTime(newDate, 3), 1);
Page({
  data: {
    currentDate: app.setTime(newDate, 3),
    selectCurrentDate: app.setTime(newDate, 3),
    selectCurrentDateText: app.setTime(newDate, 9),
    selectCurrentMonth: "",
    startTime: app.setTime(app.setTime(newDate, 3), 0),
    endTime: app.setTime(endTime, 0),
    dateArray: [],
    weekArray: ["日", "一", "二", "三", "四", "五", "六"],
    dataList: [],
    showDeclare: true,
    isLeader: "",
    appealReason: "",
    stuffInfo: "",
    count: "",
    timeSlot: "",
    leftValue: 0,
    topValue: 0,
    notifyData: ""
  },
  checkInStatistics: function(e) {
    let that = this;
    let accountInfo = wx.getStorageSync("accountInfo");
    let isAddCheckInGroup = app.privilegeState(2);
    let param = {
      pageSize: 10000
    }
    if (isAddCheckInGroup == false) {
      param.staffId = accountInfo.id;
      param.staffName = accountInfo.name;
    }
    app.request("POST", "/property/checkInGroup/queryList.do", param, true, function(res) {
      let checkInGroupList = res.data.data;
      if (checkInGroupList.length == 0) {
        wx.navigateTo({
          url: '../checkInStatisticsMine/checkInStatisticsMine'
        })
      } else {
        that.setData({
          checkInGroupList: checkInGroupList
        })
        wx.navigateTo({
          url: '../checkInStatisticsCharger/checkInStatisticsCharger'
        })
      }
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: 'none'
      })
    })
  },
  setCalendar: function() {
    let that = this;
    let calendarData = calendar.getDateArray();
    that.setData({
      dateArray: calendarData.dateArray,
      selectCurrentMonth: calendarData.currentYear + "年" + calendarData.currentMonth + "月"
    })
  },
  touchStart: function(e) {
    let that = this;
    calendar.touchStart(e);
  },
  // 触摸移动事件
  touchMove: function(e) {
    let that = this;
    calendar.touchMove(e);
  },
  // 触摸结束事件
  touchEnd: function() {
    let that = this;
    calendar.touchEnd();
    that.setCalendar();
  },
  selectDate: function(e) {
    let that = this;
    let time = e.currentTarget.dataset.time;
    if (time) {
      let startTime = app.setTime(time, 0);
      let endTime = app.setTime(app.setEndTime(startTime, 1), 0);
      that.setData({
        selectCurrentDate: time,
        selectCurrentDateText: app.setTime(time, 9),
        startTime: startTime,
        endTime: endTime
      });
      calendar.gotoSelectMonth(that.data.selectCurrentDate);
      let options = {
        isLeader: that.data.isLeader,
        notifyData: that.data.notifyData
      }
      that.onLoad(options);
    }
  },
  today: function() {
    let that = this;
    let newDate = app.setTimeStamp(new Date());
    let endTime = app.setEndTime(app.setTime(newDate, 3), 1);
    that.setData({
      currentDate: app.setTime(newDate, 3),
      selectCurrentDate: app.setTime(newDate, 3),
      selectCurrentDateText: app.setTime(newDate, 9),
      startTime: app.setTime(app.setTime(newDate, 3), 0),
      endTime: app.setTime(endTime, 0)
    });
    calendar.gotoCurrentMonth();
    let options = {
      isLeader: that.data.isLeader,
      notifyData: that.data.notifyData
    }
    that.onLoad(options);
  },
  updateCheckIn: function(e) {
    let that = this;
    let dataInfo = JSON.stringify(e.currentTarget.dataset.dataInfo);
    wx.navigateTo({
      url: '../updateCheckIn/updateCheckIn?dataInfo=' + dataInfo
    })
  },
  getAppealReason: function(e) {
    let that = this;
    let appealReason = e.detail.value;
    that.setData({
      appealReason: appealReason
    })
  },
  resetHeadImgAndName: function() {
    let that = this;
    let stuffInfo = that.data.stuffInfo;
    stuffInfo.latterTwoCharacters = app.latterTwoCharacters(stuffInfo.name);
    that.setData({
      stuffInfo: stuffInfo
    })
  },
  selectcharger: function() {
    let that = this;
    wx.navigateTo({
      url: '../selectCommunication/selectCommunication?selectType=0'
    })
  },
  showDeclare: function() {
    let that = this;
    let showDeclare = that.data.showDeclare;
    showDeclare = !showDeclare;
    that.setData({
      showDeclare: showDeclare
    })
  },
  appeal: function(e) {
    let that = this;
    let stuffInfo = that.data.stuffInfo;
    let appealDay = that.data.startTime;
    let appealReason = that.data.appealReason;
    let selectCurrentDateText = that.data.selectCurrentDateText;
    let normalText = "[链接]" + selectCurrentDateText + "考勤核实，请点击查看我的当天考勤记录";
    if (appealReason) {
      appealReason = normalText + "，" + appealReason;
    } else {
      appealReason = normalText;
    }
    let param = {
      appealDay: appealDay,
      appealReason: appealReason,
      leaderId: stuffInfo.id
    }
    app.request("POST", "/property/checkInRecord/appeal.do", param, true, function(res) {
      that.setData({
        stuffInfo: "",
      })
      that.showDeclare();
      wx.showToast({
        title: '发送成功',
        icon: "none"
      })
    }, function(res) {
      wx.showToast({
        title: '发送失败，请检查您的网络或重试',
        icon: "none"
      })
    })
  },
  resetData: function(obj) {
    if (obj.checkState == 0 || obj.checkState == 4 || obj.checkState == 6) {
      if (obj.checkState == 0) {
        obj.checkStateText = "正常";
      } else if (obj.checkState == 4) {
        obj.checkStateText = "外勤";
      } else {
        obj.checkStateText = "请假";
      }
      obj.checkStateBgClass = "check-work-state-bg0";
    } else if (obj.checkState == 1 || obj.checkState == 2 || obj.checkState == 3 || obj.checkState == 5) {
      if (obj.checkState == 1) {
        obj.checkStateText = "迟到";
      } else if (obj.checkState == 2) {
        obj.checkStateText = "旷工";
      } else if (obj.checkState == 3) {
        obj.checkStateText = "早退";
      } else {
        obj.checkStateText = "缺卡";
      }
      obj.checkStateBgClass = "check-work-state-bg1";
    }
    obj.checkInTimeText = app.setTime(obj.checkInTime, 12);
    if (obj.editRecord) {
      obj.editRecord = obj.editRecord.split(";");
    }
    return obj;
  },
  onReady: function() {
    let that = this;
    wx.createSelectorQuery().select('#movableBtn').boundingClientRect(function(rect) {
      let width = rect.width;
      let height = rect.height;
      wx.getSystemInfo({
        success: function(res) {
          let X = res.windowWidth - width - 8;
          let Y = res.windowHeight - height - 51;
          that.setData({
            leftValue: X,
            topValue: Y
          })
        },
      })
    }).exec()
  },
  onLoad: function(options) {
    let that = this;
    let isLeader = options.isLeader;
    let notifyData = options.notifyData;
    let notifyValue = options.notifyValue;
    let prevPage = app.prevPage(2);
    let checkInGroupInfo = prevPage.data.checkInGroupInfo;
    let staffId = "";
    that.setCalendar();
    if (notifyData) {
      staffId = notifyData;
      that.setData({
        notifyData: notifyData
      })
    }
    if (checkInGroupInfo) {
      let leaderJson = checkInGroupInfo.leaderJson;
      that.setData({
        stuffInfo: leaderJson[0]
      })
      that.resetHeadImgAndName();
    }
    if (notifyValue) {
      that.setData({
        selectCurrentDate: app.setTime(notifyValue, 3),
        selectCurrentDateText: app.setTime(notifyValue, 9),
        startTime: notifyValue,
        endTime: app.setTime(app.setEndTime(notifyValue, 1), 0)
      })
      calendar.gotoSelectMonth(that.data.selectCurrentDate)
    }
    let startTime = that.data.startTime;
    let endTime = that.data.endTime;
    let param = {
      startTime: startTime,
      endTime: endTime,
      staffId: staffId
    }
    app.request("POST", "/property/checkInRecord/queryList.do", param, true, function(res) {
        let dataList = []
        let checkInRecord = res.data.data;;
        let startTimeArray = [];
        let endTimeArray = [];
        let count = 0;
        for (let i = 0; i < checkInRecord.length; i++) {
          if (checkInRecord[i].checkState != "7") {
            checkInRecord[i] = that.resetData(checkInRecord[i]);
            if (checkInRecord[i].checkState != "5") {
              if (checkInRecord[i].direction == "1") {
                if (checkInRecord[i - 1].checkState != "5") {
                  startTimeArray.push(checkInRecord[i - 1].checkInTime);
                }
                endTimeArray.push(checkInRecord[i].checkInTime);
              }
              count += 1;
            }
            dataList.push(checkInRecord[i]);
          }
        }
        let timeSlot = app.getTimeSlot(startTimeArray, endTimeArray, 0);
        that.setData({
          dataList: dataList,
          isLeader: isLeader,
          count: count,
          timeSlot: timeSlot
        })
      },
      function(res) {
        wx.showToast({
          title: '获取打卡记录失败，请检查您的网络或重试',
          icon: "none"
        })
      })
  }
})