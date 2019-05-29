let app = getApp();
let imgrurl = app.globalData.imgrurl;
Page({
  data: {
    checkTaskInfo: {}
  },
  toCompleteCheckTask: function() {
    let that = this;
    let checkTaskInfo = that.data.checkTaskInfo;
    if (checkTaskInfo.stateText == "已逾期") {
      wx.showToast({
        title: '已逾期任务不可操作',
        icon: "none"
      })
      return false;
    }
    let checkTaskExecutionId = checkTaskInfo.id;
    wx.navigateTo({
      url: '../completeCheckTask/completeCheckTask?checkTaskExecutionId=' + checkTaskExecutionId
    })
  },
  previewImage: function(e) {
    let that = this;
    let current = e.currentTarget.dataset.current;
    let checkTaskInfo = that.data.checkTaskInfo;
    wx.previewImage({
      current: current,
      urls: checkTaskInfo.taskImageList
    })
  },
  onLoad: function(options) {
    let that = this;
    let checkTaskInfo = JSON.parse(decodeURIComponent(options.checkTaskInfo));
    let taskImageList = checkTaskInfo.taskImageList;
    for (let i = 0; i < taskImageList.length; i++) {
      taskImageList[i] = imgrurl + taskImageList[i];
    }
    that.setData({
      checkTaskInfo: checkTaskInfo
    })
  }
})