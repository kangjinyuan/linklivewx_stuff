let app = getApp();
Page({
  data: {
    dayArray: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
    dayIndex: 0,
    shiftJson: [],
    shiftList: [],
    shiftArray: [],
    dataList: []
  },
  getValue: function(e) {
    let that = this;
    let value = e.detail.value;
    that.setData({
      dayIndex: value
    })
    that.resetDataList();
  },
  setDataList: function(e) {
    let that = this;
    let value = e.detail.value;
    let index = e.currentTarget.dataset.index;
    let dataList = that.data.dataList;
    let shiftArray = that.data.shiftArray;
    dataList[index].shiftIndex = value;
    that.setData({
      dataList: dataList
    })
  },
  resetDataList: function() {
    let that = this;
    let dayIndex = that.data.dayIndex;
    let shiftJson = that.data.shiftJson;
    let shiftList = that.data.shiftList;
    let dataList = [];
    for (let i = 0; i < dayIndex; i++) {
      let obj = {
        id: i,
        shiftIndex: ""
      }
      dataList.push(obj);
    }
    if (dayIndex > 0) {
      for (let i = 0; i < shiftJson.length; i++) {
        for (let j = 0; j < shiftList.length; j++) {
          if (dataList[i]) {
            if (shiftJson[i].id == shiftList[j].id) {
              dataList[i].shiftIndex = j;
            }
          }
        }
      }
    }
    that.setData({
      dataList: dataList
    })
  },
  setShiftJson: function() {
    let that = this;
    let dayIndex = that.data.dayIndex;
    let prevPage = app.prevPage(2);
    let dataList = that.data.dataList;
    let shiftList = that.data.shiftList;
    let shiftJson = [];
    if (dayIndex == 0) {
      wx.showToast({
        title: '请选择每个周期天数',
        icon: "none"
      })
      return false;
    }
    for (let i = 0; i < dataList.length; i++) {
      var obj = {
        id: shiftList[dataList[i].shiftIndex] ? shiftList[dataList[i].shiftIndex].id : "0",
        name: shiftList[dataList[i].shiftIndex] ? shiftList[dataList[i].shiftIndex].name : "休息"
      }
      shiftJson.push(obj);
    }
    prevPage.setData({
      checkInPeriod: dayIndex,
      shiftJson: shiftJson
    })
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function(options) {
    let that = this;
    let prevPage = app.prevPage(2);
    let shiftJson = prevPage.data.shiftJson;
    let prevShiftList = prevPage.data.shiftList;
    let shiftList = [];
    for (let i = 0; i < prevShiftList.length; i++) {
      shiftList.push(prevShiftList[i]);
    }
    shiftList.push({
      id: 0,
      name: "休息"
    })
    let shiftArray = [];
    for (let i = 0; i < shiftList.length; i++) {
      shiftArray.push(shiftList[i].name);
    }
    let checkInPeriod = prevPage.data.checkInPeriod ? prevPage.data.checkInPeriod : "0";
    that.setData({
      dayIndex: checkInPeriod,
      shiftJson: shiftJson,
      shiftList: shiftList,
      shiftArray: shiftArray
    })
    that.resetDataList();
  }
})