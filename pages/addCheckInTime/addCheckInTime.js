let app = getApp();
Page({
  data: {
    id: "",
    name: "",
    repeatTime: "1",
    firstShift: "",
    secondShift: "",
    thirdShift: "",
    absentOverType: false,
    absentOverTime: "",
    repeatTimeList: [{
      id: "0",
      repeatTime: "3"
    }, {
      id: "1",
      repeatTime: "2"
    }, {
      id: "2",
      repeatTime: "1"
    }],
    timeList: []
  },
  getValue: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    let value = e.detail.value;
    if (flag == 0) {
      that.setData({
        name: value
      })
    } else if (flag == 1) {
      that.setData({
        absentOverType: value,
        absentOverTime: ""
      })
    } else if (flag == 2) {
      that.setData({
        absentOverTime: value
      })
    }
  },
  tabRepeatTime: function(e) {
    let that = this;
    let repeatTime = e.currentTarget.dataset.repeatTime;
    that.setData({
      repeatTime: repeatTime
    })
    that.resetTimeList();
  },
  setTimeList: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let value = e.detail.value;
    let timeList = that.data.timeList;
    timeList[index].deadLineTime = value;
    that.setData({
      timeList: timeList
    })
  },
  resetShift: function(firstShift, secondShift, thirdShift) {
    let that = this;
    let shiftList = firstShift.split("-").concat(secondShift.split("-")).concat(thirdShift.split("-"));
    let resArray = [];
    for (let i = 0; i < shiftList.length; i++) {
      if (shiftList[i]) {
        resArray.push(shiftList[i]);
      }
    }
    return resArray;
  },
  resetTimeList: function() {
    let that = this;
    let firstShift = that.data.firstShift;
    let secondShift = that.data.secondShift;
    let thirdShift = that.data.thirdShift;
    let shiftList = that.resetShift(firstShift, secondShift, thirdShift);
    let repeatTime = that.data.repeatTime;
    let timeList = [];
    for (let i = 0; i < 2 * repeatTime; i++) {
      let name = "";
      if (i % 2 == 0) {
        name = "上班";
      } else {
        name = "下班";
      }
      let obj = {
        id: i,
        name: name,
        deadLineTime: shiftList[i] ? shiftList[i] : ""
      }
      timeList.push(obj);
    }
    that.setData({
      timeList: timeList
    })
  },
  addShift: function() {
    let that = this;
    let id = that.data.id;
    let name = that.data.name;
    let repeatTime = that.data.repeatTime;
    let timeList = that.data.timeList;
    let firstShift = [];
    let secondShift = [];
    let thirdShift = [];
    let absentOverType = that.data.absentOverType;
    let absentOverTime = that.data.absentOverTime;
    if (name == "") {
      wx.showToast({
        title: '请输入班次名称',
        icon: "none"
      })
      return false;
    }
    for (let i = 0; i < timeList.length; i++) {
      if (timeList[i].deadLineTime == "") {
        wx.showToast({
          title: '请选择班次时间',
          icon: "none"
        })
        return false;
      }
      if (i == 0 || i == 1) {
        firstShift.push(timeList[i].deadLineTime);
      } else if (i == 2 || i == 3) {
        secondShift.push(timeList[i].deadLineTime);
      } else if (i == 4 || i == 5) {
        thirdShift.push(timeList[i].deadLineTime);
      }
    }
    if (absentOverType) {
      if (absentOverTime == "") {
        wx.showToast({
          title: '请输入旷工时间',
          icon: "none"
        })
        return false;
      }
      if (absentOverTime < 0) {
        wx.showToast({
          title: '旷工时间不能小于0',
          icon: "none"
        })
        return false;
      }
    }
    let param = {
      id: id,
      name: name,
      repeatTime: repeatTime,
      firstShift: firstShift.join("-"),
      secondShift: secondShift.join("-"),
      thirdShift: thirdShift.join("-"),
      absentOverTime: absentOverTime
    }
    app.request("POST", "/property/shiftCompose/saveOrUpdate.do", param, true, function(res) {
      let prevPage = app.prevPage(2);
      if (id) {
        let param = {
          id: id
        }
        app.request("POST", "/property/shiftCompose/queryList.do", param, true, function(res) {
          let shiftInfo = res.data.data[0];
          let dataList = prevPage.data.dataList;
          for (let i = 0; i < dataList.length; i++) {
            if (id == dataList[i].id) {
              shiftInfo.isActive = dataList[i].isActive;
              dataList[i] = shiftInfo;
            }
          }
          prevPage.setData({
            dataList: dataList
          })
        }, function(res) {
          wx.showToast({
            title: '获取班次失败，请检查您的网络或重试',
          })
        })
      } else {
        prevPage.setData({
          page: 1
        })
        prevPage.onLoad();
      }
      wx.navigateBack({
        delta: 1
      })
    }, function(res) {
      if (id) {
        wx.showToast({
          title: '编辑班次失败，请检查您的网络或重试',
          icon: "none"
        })
      } else {
        wx.showToast({
          title: '新增班次失败，请检查您的网络或重试',
          icon: "none"
        })
      }
    })
  },
  onLoad: function(options) {
    let that = this;
    let shiftInfo = JSON.parse(options.shiftInfo);
    if (shiftInfo) {
      let absentOverTime = shiftInfo.absentOverTime;
      let absentOverType = that.data.absentOverType;
      if (absentOverTime) {
        absentOverType = true;
      }
      that.setData({
        id: shiftInfo.id,
        name: shiftInfo.name,
        repeatTime: shiftInfo.repeatTime,
        firstShift: shiftInfo.firstShift,
        secondShift: shiftInfo.secondShift,
        thirdShift: shiftInfo.thirdShift,
        absentOverType: absentOverType,
        absentOverTime: absentOverTime
      })
    }
    that.resetTimeList();
  }
})