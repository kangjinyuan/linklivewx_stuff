let app = getApp();
Page({
  data: {
    hitCardList: [],
    allIsActive: true
  },
  allSwitchActive: function() {
    let that = this;
    let allIsActive = that.data.allIsActive;
    let hitCardList = that.data.hitCardList;
    allIsActive = !allIsActive;
    for (let i = 0; i < hitCardList.length; i++) {
      hitCardList[i].isActive = allIsActive;
    }
    that.setData({
      hitCardList: hitCardList,
      allIsActive: allIsActive
    })
  },
  switchActive: function(e) {
    let that = this;
    let hitCardList = that.data.hitCardList;
    let id = e.currentTarget.dataset.id;
    for (let i = 0; i < hitCardList.length; i++) {
      if (id == hitCardList[i].id) {
        hitCardList[i].isActive = !hitCardList[i].isActive;
      }
    }
    that.setData({
      hitCardList: hitCardList
    })
  },
  resetData: function(obj) {
    let that = this;
    if (obj.checkState == "0") {
      obj.checkStateText = "正常";
    } else if (obj.checkState == "1") {
      obj.checkStateText = "迟到";
    } else if (obj.checkState == "2") {
      obj.checkStateText = "旷工";
    } else if (obj.checkState == "3") {
      obj.checkStateText = "早退";
    } else if (obj.checkState == "4") {
      obj.checkStateText = "外勤";
    } else if (obj.checkState == "5") {
      obj.checkStateText = "缺卡";
    } else if (obj.checkState == "6") {
      obj.checkStateText = "请假";
    }
    obj.checkInTimeText = app.setTime(obj.checkInTime, 12);
    return obj;
  },
  onLoad: function() {
    let that = this;
    let prevPage = app.prevPage(2);
    let selectDayTime = prevPage.data.selectDayTime;
    let startTime = app.setTime(selectDayTime, 0);
    let endTime = app.setTime(app.setEndTime(selectDayTime, 1), 0);
    let checkInGroupList = prevPage.data.checkInGroupList;
    let checkInGroupIndex = prevPage.data.checkInGroupIndex;
    let checkInGroupId = checkInGroupList[checkInGroupIndex].id;
    let colorArray = ["#fcac66", "#a4a8f4", "#86d8f3", "#f88777"];
    wx.setNavigationBarTitle({
      title: checkInGroupList[checkInGroupIndex].name,
    })
    let param = {
      checkInGroupId: checkInGroupId,
      startTime: startTime,
      endTime: endTime,
      pageSize: 10000
    }
    app.request("POST", "/property/checkInRecord/queryList.do", param, true, function(res) {
      let dataList = res.data.data;
      let staffIdList = [];
      let hitCardList = [];
      for (let i = 0; i < dataList.length; i++) {
        if (app.inArray(dataList[i].staffId, staffIdList) == -1) {
          var obj = {
            id: dataList[i].staffId,
            name: dataList[i].staffName,
            isActive: true,
            checkInRecord: []
          }
          hitCardList.push(obj);
          staffIdList.push(dataList[i].staffId);
        }
      }
      for (let i = 0; i < hitCardList.length; i++) {
        hitCardList[i].latterTwoCharacters = app.latterTwoCharacters(hitCardList[i].name);
        hitCardList[i].headImageBackgroundColor = app.randomData(colorArray);
        let checkInRecord = hitCardList[i].checkInRecord;
        for (let j = 0; j < dataList.length; j++) {
          dataList[j] = that.resetData(dataList[j]);
          if (hitCardList[i].id == dataList[j].staffId) {
            checkInRecord.push(dataList[j]);
          }
        }
      }
      that.setData({
        hitCardList: hitCardList
      })
    }, function() {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: 'none'
      })
    })
  }
})