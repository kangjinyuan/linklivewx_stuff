let app = getApp();
let upload = require("../../utils/upload.js");
let dateTimePicker = require('../../utils/dateTimePicker.js');
Page({
  data: {
    problemCategory: "",
    issue: "",
    orderDetail: "",
    issueType: "",
    orderAddress: "",
    scheduleEndTimeArray: [],
    scheduleEndTime: "",
    scheduleEndTimeText: "",
    imageList: [],
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
    let scheduleEndTimeArray = that.data.scheduleEndTimeArray;
    let scheduleEndTime = that.data.scheduleEndTime;
    if (flag == 0) {
      that.setData({
        orderAddress: value
      });
    } else if (flag == 1) {
      let scheduleEndTimeText = scheduleEndTimeArray[0][scheduleEndTime[0]] +
        "-" +
        scheduleEndTimeArray[1][scheduleEndTime[1]] +
        "-" +
        scheduleEndTimeArray[2][scheduleEndTime[2]] +
        " " +
        scheduleEndTimeArray[3][scheduleEndTime[3]] +
        ":" +
        scheduleEndTimeArray[4][scheduleEndTime[4]]
      that.setData({
        scheduleEndTimeText: scheduleEndTimeText
      })
    } else if (flag == 2) {
      that.setData({
        orderDetail: value
      });
    }
  },
  addWorkOrder: function(e) {
    let that = this;
    let problemCategory = that.data.problemCategory;
    let issue = that.data.issue;
    let issueType = issue ? that.data.issueType : "0";
    let orderAddress = that.data.orderAddress;
    let scheduleEndTime = that.data.scheduleEndTimeText;
    let orderDetail = that.data.orderDetail;
    let imageList = that.data.imageList;
    let orderImageList = [];
    if (problemCategory == "") {
      wx.showToast({
        title: '请选择原因类别',
        icon: "none"
      })
      return false;
    }
    if (orderAddress == "") {
      wx.showToast({
        title: '请输入工单地址',
        icon: "none"
      })
      return false;
    }
    if (scheduleEndTime == "") {
      wx.showToast({
        title: '请选择计划结束时间',
        icon: "none"
      })
      return false;
    }
    if (orderDetail == "") {
      wx.showToast({
        title: '请填写工单描述',
        icon: "none"
      })
      return false;
    }
    for (let i = 0; i < imageList.length; i++) {
      orderImageList.push(imageList[i].key);
    }
    let param = {
      orderType: "0",
      orderReason: problemCategory.id,
      issueType: issueType,
      issueId: issue ? issue.id : "",
      addressType: "0",
      orderAddress: orderAddress,
      scheduleEndTime: app.setTime(that.data.scheduleEndTimeText, 0),
      orderDetail: orderDetail,
      orderImageList: orderImageList
    }
    app.request("POST", "/property/workOrder/create.do", param, true, function(res) {
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
    });
  },
  changeDateTimeColumn: function(e) {
    let that = this;
    dateTimePicker.changeDateTimeColumn(that.data.scheduleEndTime, that.data.scheduleEndTimeArray, e, function(dateTime, dateTimeArray) {
      that.setData({
        scheduleEndTimeArray: dateTimeArray,
        scheduleEndTime: dateTime
      });
    })
  },
  toISsue: function() {
    let that = this;
    let id = that.data.issue.id;
    let issueType = that.data.issueType;
    wx.navigateTo({
      url: '../issue/issue?issueType=' + issueType + '&id=' + id
    })
  },
  selectProblemCategory: function() {
    let that = this;
    let id = that.data.problemCategory.id;
    wx.navigateTo({
      url: '../problemCategory/problemCategory?id=' + id
    })
  },
  onLoad: function(options) {
    let that = this;
    dateTimePicker.dateTimePickerInit('', function(res) {
      that.setData({
        scheduleEndTime: res.dateTime,
        scheduleEndTimeArray: res.dateTimeArray
      });
    }, 0);
  }
})