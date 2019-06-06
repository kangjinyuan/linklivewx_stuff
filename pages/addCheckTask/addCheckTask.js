let app = getApp();
let upload = require("../../utils/upload.js");
Page({
  data: {
    alertArray: ["无", "任务开始时", "提前15分钟", "提前30分钟", "提前1小时"],
    alertIndex: 0,
    urgency: 0,
    imageList: [],
    taskTitle: "",
    taskContent: "",
    startTime: "",
    beginTime: "",
    endTime: "",
    stuffInfo: ""
  },
  uploadImg: function() {
    let that = this;
    upload.chooseUploadImg(that, 3);
  },
  delImg: function(e) {
    let that = this;
    let i = e.currentTarget.dataset.index;
    let imageList = that.data.imageList;
    imageList.splice(i, 1);
    that.setData({
      imageList: imageList
    })
  },
  getValue: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    let value = e.detail.value;
    if (flag == 0) {
      that.setData({
        taskTitle: value
      });
    } else if (flag == 1) {
      that.setData({
        taskContent: value
      });
    } else if (flag == 2) {
      that.setData({
        startTime: value
      });
    } else if (flag == 3) {
      that.setData({
        beginTime: value
      });
    } else if (flag == 4) {
      that.setData({
        endTime: value
      })
    } else if (flag == 5) {
      that.setData({
        alertIndex: value
      })
    } else if (flag == 6) {
      let urgency = that.data.urgency;
      if (value == true) {
        urgency = "1";
      } else {
        urgency = "0";
      }
      that.setData({
        urgency: urgency
      })
    }
  },
  selectcharger: function() {
    let that = this;
    wx.navigateTo({
      url: '../selectCommunication/selectCommunication'
    })
  },
  addCheckTask: function() {
    let that = this;
    let taskTitle = that.data.taskTitle;
    let taskContent = that.data.taskContent;
    let imageList = that.data.imageList;
    let taskImageList = [];
    let startTime = that.data.startTime;
    let beginTime = that.data.beginTime;
    let endTime = that.data.endTime;
    let accountInfo = wx.getStorageSync('accountInfo');
    let stuffInfo = that.data.stuffInfo;
    if (taskTitle == "") {
      wx.showToast({
        title: '请填写标题',
        icon: "none"
      })
      return false;
    }
    if (taskContent == "") {
      wx.showToast({
        title: '请填写任务描述',
        icon: "none"
      })
      return false;
    }
    if (imageList.length == 0) {
      wx.showToast({
        title: '请上传任务图片',
        icon: "none"
      })
      return false;
    }
    if (startTime == "") {
      wx.showToast({
        title: '请选择开始日期',
        icon: "none"
      })
      return false;
    }
    if (beginTime == "") {
      wx.showToast({
        title: '请选择开始时间',
        icon: "none"
      })
      return false;
    }
    if (endTime == "") {
      wx.showToast({
        title: '请选择结束时间',
        icon: "none"
      })
      return false;
    }
    for (let i = 0; i < imageList.length; i++) {
      taskImageList.push(imageList[i].key);
    }
    let param = {
      taskTitle: taskTitle,
      taskContent: taskContent,
      taskImageList: taskImageList,
      startTime: app.setTime(startTime, 0),
      beginTime: app.setTime(startTime + " " + beginTime, 0).split(" ")[1],
      endTime: app.setTime(startTime + " " + endTime, 0).split(" ")[1],
      alertMode: that.data.alertIndex,
      urgency: that.data.urgency,
      chargerId: stuffInfo ? stuffInfo.id : accountInfo.id
    }
    app.request("POST", "/property/checkTaskExecution/create.do", param, true, function(res) {
      let prevPage = app.prevPage(2);
      if (prevPage.data.state == "0") {
        prevPage.setData({
          page: 1
        })
        prevPage.onLoad();
      }
      wx.navigateBack({
        delta: 1
      })
    }, function(res) {
      wx.showToast({
        title: '创建失败，请检查您的网络或重试',
        icon: "none"
      })
    })
  },
  onLoad: function(options) {
    let that = this;
  }
})