let app = getApp();
let upload = require("../../utils/upload.js");
let dateTimePicker = require('../../utils/dateTimePicker.js');
Page({
  data: {
    scheduleEndTimeArray: [],
    scheduleEndTime: "",
    scheduleEndTimeText: "",
    checkResult: "1",
    checkDescription: "",
    problemCategory: "",
    createWorkOrder: "",
    imageList: [],
    standardExecution: {}
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
  toProblemCategory: function() {
    let that = this;
    let id = that.data.problemCategory.id;
    wx.navigateTo({
      url: '../problemCategory/problemCategory?id=' + id,
    })
  },
  getValue: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    let value = e.detail.value;
    let scheduleEndTime = that.data.scheduleEndTime;
    let scheduleEndTimeArray = that.data.scheduleEndTimeArray;
    if (flag == 0) {
      let checkResult = that.data.checkResult;
      if (value == true) {
        checkResult = "1";
      } else {
        checkResult = "2";
      }
      that.setData({
        checkResult: checkResult
      })
    } else if (flag == 1) {
      that.setData({
        checkDescription: value
      });
    } else if (flag == 2) {
      let createWorkOrder = that.data.createWorkOrder;
      if (value == true) {
        createWorkOrder = 1;
      } else {
        createWorkOrder = "";
      }
      that.setData({
        createWorkOrder: createWorkOrder
      })
    } else if (flag == 3) {
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
    }
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
  reportCheckResult: function(e) {
    let that = this;
    let standardExecution = that.data.standardExecution;
    let checkResult = that.data.checkResult;
    let checkDescription = that.data.checkDescription;
    let issueType = that.data.problemCategory ? that.data.problemCategory.id : "";
    let checkImageList = [];
    let imageList = that.data.imageList;
    for (let i = 0; i < imageList.length; i++) {
      checkImageList.push(imageList[i].key);
    }
    let createWorkOrder = that.data.createWorkOrder;
    let scheduleEndTime = that.data.scheduleEndTimeText ? app.setTime(that.data.scheduleEndTimeText, 0) : "";
    if (checkResult == "1") {
      issueType = "";
      createWorkOrder = "";
      scheduleEndTime = "";
    } else if (checkResult == "2") {
      if (issueType == "") {
        wx.showToast({
          title: '请选择问题类型',
          icon: "none"
        })
        return false;
      }
      if (createWorkOrder == 1) {
        if (scheduleEndTime == "") {
          wx.showToast({
            title: '请选择计划结束时间',
            icon: "none"
          })
          return false;
        }
      } else {
        scheduleEndTime = "";
      }
    }
    if (checkDescription == "") {
      wx.showToast({
        title: '请填写结果描述',
        icon: "none"
      })
      return false;
    }
    if (imageList.length == 0) {
      wx.showToast({
        title: '请上传结果图片',
        icon: "none"
      })
      return false;
    }
    app.setFormId(e, function(res) {
      let param = {
        id: standardExecution.id,
        checkTaskExecutionId: standardExecution.checkTaskExecutionId,
        checkResult: checkResult,
        issueType: issueType,
        checkDescription: checkDescription,
        checkImageList: checkImageList,
        createWorkOrder: createWorkOrder,
        scheduleEndTime: scheduleEndTime
      }
      app.request("POST", "/property/checkTaskExecution/reportCheckResult.do", param, true, function(res) {
        let param = {
          id: standardExecution.checkTaskExecutionId
        }
        app.request("POST", "/property/checkTaskExecution/queryList.do", param, true, function(res) {
          let checkTaskInfo = res.data.data[0];
          let prevPage = app.prevPage(2);
          let prevTowPage = app.prevPage(3);
          if (checkTaskInfo.state == 1) {
            prevTowPage.removeData(checkTaskInfo.id);
            let count = prevTowPage.data.count;
            prevTowPage.setData({
              count: count - 1
            })
            wx.navigateBack({
              delta: 2
            })
          } else {
            checkTaskInfo = prevTowPage.resetData(checkTaskInfo);
            let standardExecutionList = checkTaskInfo.standardExecutionList;
            let prevPageCheckTaskInfo = prevPage.data.checkTaskInfo;
            let prevPageStandardExecutionList = prevPageCheckTaskInfo.standardExecutionList;
            let checkTaskList = prevTowPage.data.checkTaskList;
            for (let i = 0; i < standardExecutionList.length; i++) {
              for (let j = 0; j < prevPageStandardExecutionList.length; j++) {
                if (i == j) {
                  standardExecutionList[i].isActive = prevPageStandardExecutionList[j].isActive;
                }
              }
            }
            prevPageCheckTaskInfo.standardExecutionList = standardExecutionList;
            for (let i = 0; i < checkTaskList.length; i++) {
              if (prevPageCheckTaskInfo.id == checkTaskList[i].id) {
                checkTaskList[i] = prevPageCheckTaskInfo;
              }
            }
            prevPage.setData({
              checkTaskInfo: prevPageCheckTaskInfo
            })
            prevTowPage.setData({
              checkTaskList: checkTaskList
            })
            wx.navigateBack({
              delta: 1
            })
          }
        }, function(res) {
          wx.showToast({
            title: '无法连接服务器，请检查您的网络或重试',
            icon: "none"
          })
        });
      }, function(res) {
        wx.showToast({
          title: '提交失败，请检查您的网络或重试',
          icon: "none"
        })
      });
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
    let standardExecution = JSON.parse(decodeURIComponent(options.standardExecution));
    that.setData({
      standardExecution: standardExecution
    })
  }
})