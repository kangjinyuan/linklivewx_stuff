let app = getApp();
Page({
  data: {
    checkInInfoList: []
  },
  checkInStatisticsMine: function(e) {
    let that = this;
    let staffId = e.currentTarget.dataset.staffId;
    let staffName = e.currentTarget.dataset.staffName;
    wx.navigateTo({
      url: '../checkInStatisticsMine/checkInStatisticsMine?staffId=' + staffId + "&staffName=" + staffName
    })
  },
  onLoad: function(options) {
    let that = this;
    let prevPage = app.prevPage(2);
    let selectMonthTimeText = prevPage.data.selectMonthTimeText;
    let year = selectMonthTimeText.split("-")[0];
    let month = selectMonthTimeText.split("-")[1];
    let monthDyas = app.getMonthDays(year, month);
    let startTime = app.setTime(selectMonthTimeText + "-01", 0);
    let endTime = app.setTime(app.setEndTime(selectMonthTimeText + "-" + monthDyas, 1), 0);
    let checkInGroupList = prevPage.data.checkInGroupList;
    let checkInGroupIndex = prevPage.data.checkInGroupIndex;
    let checkInGroupId = checkInGroupList[checkInGroupIndex].id;
    let checkState = options.checkState;
    let checkStateText = "";
    if (checkState == "1") {
      checkStateText = "迟到";
    } else if (checkState == "3") {
      checkStateText = "早退";
    } else if (checkState == "5") {
      checkStateText = "缺卡";
    } else if (checkState == "2") {
      checkStateText = "旷工";
    }
    wx.setNavigationBarTitle({
      title: checkStateText
    })
    let param = {
      checkInGroupId: checkInGroupId,
      checkState: checkState,
      startTime: startTime,
      endTime: endTime,
      pageSize: 10000
    }
    app.request("POST", "/property/checkInRecord/queryList.do", param, true, function(res) {
      let dataList = res.data.data;
      let staffIdList = [];
      let checkInInfoList = [];
      for (let i = 0; i < dataList.length; i++) {
        if (checkState == dataList[i].checkState) {
          if (app.inArray(dataList[i].staffId, staffIdList) == -1) {
            staffIdList.push(dataList[i].staffId);
          }
        }
      }
      for (let i = 0; i < staffIdList.length; i++) {
        let count = null;
        let name = "";
        for (let j = 0; j < dataList.length; j++) {
          if (staffIdList[i] == dataList[j].staffId) {
            name = dataList[j].staffName;
            count += 1;
          }
        }
        let obj = {
          id: staffIdList[i],
          name: name,
          count: count
        }
        checkInInfoList.push(obj);
      }
      that.setData({
        checkInInfoList: checkInInfoList
      })
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: 'none'
      })
    })
  }
})