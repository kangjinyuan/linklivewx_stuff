let app = getApp();
Page({
  data: {
    id: "",
    checkStateList: [],
    checkState: "0",
    editRecord: "",
    selectCurrentDateText: "",
    dataInfo: ""
  },
  tabCheckState: function(e) {
    let that = this;
    let checkState = e.currentTarget.dataset.checkState;
    that.setData({
      checkState: checkState
    })
  },
  getEditRecord: function(e) {
    let that = this;
    let editRecord = e.detail.value;
    that.setData({
      editRecord: editRecord
    })
  },
  resetResult: function() {
    let that = this;
    let dataInfo = that.data.dataInfo;
    let checkState = that.data.checkState;
    let editRecord = that.data.editRecord;
    let param = {
      id: dataInfo.id,
      checkState: "0",
      editRecord: editRecord
    }
    app.request("POST", "/property/checkInRecord/resetResult.do", param, true, function(res) {
      let prevPage = app.prevPage(2);
      let options = {
        isLeader: "1"
      }
      prevPage.onLoad(options);
      wx.navigateBack({
        delta: 1
      });
    }, function(res) {
      if (res.data.code == "0001") {
        wx.showToast({
          title: '修改结果与当前考勤状态一致',
          icon: "none"
        })
      } else {
        wx.showToast({
          title: '修改失败，请检查您的网络或重试',
          icon: "none"
        })
      }
    })
  },
  onLoad: function(options) {
    let that = this;
    let dataInfo = JSON.parse(options.dataInfo);
    let prevPage = app.prevPage(2);
    let checkStateList = [];
    if (dataInfo.direction == "0") {
      checkStateList = [{
        id: "0",
        checkState: "4",
        name: "外勤"
      }, {
        id: "1",
        checkState: "6",
        name: "请假"
      }, {
        id: "2",
        checkState: "1",
        name: "迟到"
      }, {
        id: "3",
        checkState: "0",
        name: "正常"
      }]
    } else if (dataInfo.direction == "1") {
      checkStateList = [{
        id: "0",
        checkState: "4",
        name: "外勤"
      }, {
        id: "1",
        checkState: "6",
        name: "请假"
      }, {
        id: "2",
        checkState: "3",
        name: "早退"
      }, {
        id: "3",
        checkState: "0",
        name: "正常"
      }]
    }
    let selectCurrentDateText = prevPage.data.selectCurrentDateText;
    that.setData({
      dataInfo: dataInfo,
      selectCurrentDateText: selectCurrentDateText,
      checkStateList: checkStateList
    })
  }
})