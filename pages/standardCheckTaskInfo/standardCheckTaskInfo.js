let app = getApp();
Page({
  data: {
    checkTaskInfo: {}
  },
  toStandardInfo: function(e) {
    let that = this;
    let checkTaskInfo = that.data.checkTaskInfo;
    let standardExecution = e.currentTarget.dataset.standardExecution;
    let standardExecutionList = checkTaskInfo.standardExecutionList;
    for (let i = 0; i < standardExecutionList.length; i++) {
      if (standardExecution.standardId == standardExecutionList[i].standardId) {
        standardExecution.standardCode = standardExecutionList[i].standardCode;
        standardExecution.standardDescription = standardExecutionList[i].standardDescription;
      }
    }
    if (standardExecution.checkResult != 0) {
      wx.showToast({
        title: '该点位已完成检查',
        icon: "none"
      })
      return false;
    }
    if (checkTaskInfo.stateText == "已逾期") {
      wx.showToast({
        title: '已逾期任务不可操作',
        icon: "none"
      })
      return false;
    }
    standardExecution = encodeURIComponent(JSON.stringify(standardExecution));
    wx.navigateTo({
      url: '../standardInfo/standardInfo?standardExecution=' + standardExecution
    })
  },
  switchActive: function(e) {
    let that = this;
    let prevPage = app.prevPage(2);
    let checkTaskInfo = that.data.checkTaskInfo;
    let standardExecutionList = checkTaskInfo.standardExecutionList;
    let checkTaskList = prevPage.data.checkTaskList;
    let id = e.currentTarget.dataset.id;
    for (let i = 0; i < standardExecutionList.length; i++) {
      if (id == standardExecutionList[i].id) {
        standardExecutionList[i].isActive = !standardExecutionList[i].isActive;
      }
    }
    for (let i = 0; i < checkTaskList.length; i++) {
      if (checkTaskInfo.id == checkTaskList[i].id) {
        checkTaskList[i].standardExecutionList = standardExecutionList;
      }
    }
    prevPage.setData({
      checkTaskList: checkTaskList
    })
    that.setData({
      checkTaskInfo: checkTaskInfo
    })
  },
  onLoad: function(options) {
    let that = this;
    let checkTaskInfo = JSON.parse(decodeURIComponent(options.checkTaskInfo));
    that.setData({
      checkTaskInfo: checkTaskInfo
    })
  }
})