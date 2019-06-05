let calendar = require("../../utils/calendar.js");
let app = getApp();
let newDate = app.setTimeStamp(new Date());
let tomorrowDate = app.tomorrowDate(newDate);
Page({
  data: {
    currentDate: app.setTime(newDate, 3),
    selectCurrentDate: app.setTime(newDate, 3),
    selectCurrentMonth: "",
    startTime: app.setTime(app.setTime(newDate, 3), 0),
    endTime: app.setTime(app.setTime(tomorrowDate, 3), 0),
    dateArray: [],
    weekDateArray: [],
    weekArray: ["日", "一", "二", "三", "四", "五", "六"],
    calendarSwitch: false,
    checkTaskList: [],
    totalPage: '',
    page: 1,
    count: 0,
    state: "0",
    tabList: [{
      state: "0",
      name: '未完成',
    }, {
      state: "1",
      name: '已完成'
    }, {
      state: "2",
      name: '我创建'
    }, {
      state: "",
      name: '全部'
    }]
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
  addCheckTask: function() {
    let that = this;
    wx.navigateTo({
      url: '../addCheckTask/addCheckTask'
    })
  },
  checkTaskInfo: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    let checkTaskInfo = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.checkTaskInfo));
    if (flag == 0) {
      wx.navigateTo({
        url: '../temporaryCheckTaskInfo/temporaryCheckTaskInfo?checkTaskInfo=' + checkTaskInfo
      })
    } else if (flag == 1) {
      wx.navigateTo({
        url: '../standardCheckTaskInfo/standardCheckTaskInfo?checkTaskInfo=' + checkTaskInfo
      })
    }
  },
  setCalendar: function() {
    let that = this;
    let calendarData = calendar.getDateArray();
    let weekDateArray = calendar.getWeekDateArray(that.data.selectCurrentDate);
    that.setData({
      dateArray: calendarData.dateArray,
      weekDateArray: weekDateArray,
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
  calendarSwitch: function() {
    let that = this;
    let calendarSwitch = that.data.calendarSwitch;
    if (calendarSwitch) {
      that.setData({
        calendarSwitch: false
      })
    } else {
      that.setData({
        calendarSwitch: true
      })
    }
    calendar.gotoSelectMonth(that.data.selectCurrentDate);
    that.setCalendar();
  },
  selectDate: function(e) {
    let that = this;
    let time = e.currentTarget.dataset.time;
    if (time) {
      let startTime = app.setTime(time, 0);
      let endTime = app.tomorrowDate(app.setTimeStamp(startTime));
      endTime = app.setTime(app.setTime(endTime, 3), 0);
      that.setData({
        selectCurrentDate: time,
        startTime: startTime,
        endTime: endTime
      });
      calendar.gotoSelectMonth(that.data.selectCurrentDate);
      that.onLoad();
    }
  },
  today: function() {
    let that = this;
    let selectCurrentDate = app.setTime(newDate, 3);
    let startTime = app.setTime(selectCurrentDate, 0);
    let endTime = app.tomorrowDate(newDate);
    endTime = app.setTime(app.setTime(endTime, 3), 0)
    that.setData({
      selectCurrentDate: selectCurrentDate,
      startTime: startTime,
      endTime: endTime
    });
    calendar.gotoCurrentMonth();
    that.onLoad();
  },
  removeData: function(id) {
    let that = this;
    let checkTaskList = that.data.checkTaskList;
    for (let i = 0; i < checkTaskList.length; i++) {
      if (id == checkTaskList[i].id) {
        checkTaskList.splice(i--, 1);
      }
    }
    that.setData({
      checkTaskList: checkTaskList
    })
  },
  resetData: function(obj) {
    let colorArray = ["#fcac66", "#a4a8f4", "#86d8f3", "#f88777"];
    obj.creatorNameText = app.latterTwoCharacters(obj.creatorName);
    obj.creatorNameBackgroundColor = app.randomData(colorArray);
    obj.chargerText = app.latterTwoCharacters(obj.charger);
    obj.chargerBackgroundColor = app.randomData(colorArray);
    obj.startTime = app.setTime(obj.startTime, 3);
    obj.beginTime = app.setTime(obj.startTime + " " + obj.beginTime, 1);
    obj.endTime = app.setTime(obj.startTime + " " + obj.endTime, 1);
    let beginTime = app.setTimeStamp(obj.beginTime);
    let endTime = app.setTimeStamp(obj.endTime);
    if (obj.state == 0) {
      if (newDate > beginTime && newDate < endTime) {
        obj.stateText = "已开始";
        obj.stateTextColorClass = "check-task-state1";
        obj.borderColorClass = "check-task-list-border1"
      } else if (newDate < beginTime) {
        obj.stateText = "未开始";
        obj.stateTextColorClass = "check-task-state0";
        obj.borderColorClass = "check-task-list-border0"
      } else if (newDate > endTime) {
        obj.stateText = "已逾期";
        obj.stateTextColorClass = "check-task-state4";
        obj.borderColorClass = "check-task-list-border3"
      }
    } else if (obj.state == 1) {
      obj.stateText = "已完成";
      obj.stateTextColorClass = "check-task-state2"
      obj.borderColorClass = "check-task-list-border2"
    }
    if (obj.taskType == 0) {
      obj.taskTypeText = "专项检查";
    } else if (obj.taskType == 1) {
      obj.taskTypeText = "标准检查";
    } else if (obj.taskType == 2) {
      obj.taskTypeText = "临时任务";
    }
    if (obj.alertMode == 0) {
      obj.alertModeText = "无";
    } else if (obj.alertMode == 1) {
      obj.alertModeText = "任务开始时";
    } else if (obj.alertMode == 2) {
      obj.alertModeText = "提前15分钟";
    } else if (obj.alertMode == 3) {
      obj.alertModeText = "提前30分钟";
    } else if (obj.alertMode == 4) {
      obj.alertModeText = "提前1小时";
    }
    if (obj.taskType == 0 || obj.taskType == 1) {
      let standardExecutionList = obj.standardExecutionList;
      for (let i = 0; i < standardExecutionList.length; i++) {
        standardExecutionList[i].isActive = false;
        if (standardExecutionList[i].state == 0) {
          standardExecutionList[i].stateText = "未完成";
        } else {
          standardExecutionList[i].stateText = "已完成";
        }
        let resultExecutionList = standardExecutionList[i].resultExecutionList;
        for (let j = 0; j < resultExecutionList.length; j++) {
          if (resultExecutionList[j].checkResult == 0) {
            resultExecutionList[j].checkResultText = "未完成";
          } else {
            resultExecutionList[j].checkResultText = "已完成";
          }
        }
      }
    }
    return obj;
  },
  nextPage: function() {
    let that = this;
    app.loadMore(that, function() {
      let accountInfo = wx.getStorageSync('accountInfo');
      let paras = {};
      if (that.data.state == 2) {
        paras = {
          page: that.data.page,
          startTime: that.data.startTime,
          endTime: that.data.endTime,
          creatorId: accountInfo.id
        }
      } else {
        paras = {
          page: that.data.page,
          startTime: that.data.startTime,
          endTime: that.data.endTime,
          state: that.data.state
        }
      }
      let oldList = that.data.checkTaskList;
      app.request('POST', '/property/checkTaskExecution/queryList.do', paras, function(res) {
        let checkTaskList = res.data.data;
        for (let i = 0; i < checkTaskList.length; i++) {
          oldList.push(that.resetData(checkTaskList[i]));
        }
        that.setData({
          checkTaskList: oldList
        })
      }, function() {
        wx.showToast({
          title: '无法连接服务器，请检查您的网络或重试',
          icon: 'none'
        })
      })
    })
  },
  onLoad: function() {
    let that = this;
    let accountInfo = wx.getStorageSync('accountInfo');
    that.setCalendar();
    let paras = {};
    if (that.data.state == 2) {
      paras = {
        page: that.data.page,
        startTime: that.data.startTime,
        endTime: that.data.endTime,
        creatorId: accountInfo.id
      }
    } else {
      paras = {
        page: that.data.page,
        startTime: that.data.startTime,
        endTime: that.data.endTime,
        state: that.data.state,
        chargerId: accountInfo.id
      }
    }
    app.request("POST", "/property/checkTaskExecution/queryList.do", paras, function(res) {
      let checkTaskList = res.data.data;
      for (let i = 0; i < checkTaskList.length; i++) {
        checkTaskList[i] = that.resetData(checkTaskList[i]);
      }
      that.setData({
        checkTaskList: checkTaskList,
        totalPage: res.data.totalPage
      })
      if (that.data.state == "0") {
        that.setData({
          count: res.data.count
        })
      }
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: "none"
      })
    })
  }
})