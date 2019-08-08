let app = getApp();
let upload = require("../../utils/upload.js");
Page({
  data: {
    imageList: [],
    checkDescription: "",
    checkTaskExecutionId: ""
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
  getCheckDescription: function(e) {
    let that = this;
    let checkDescription = e.detail.value;
    that.setData({
      checkDescription: checkDescription
    })
  },
  completeCheckTask: function(e) {
    let that = this;
    let checkTaskExecutionId = that.data.checkTaskExecutionId;
    let checkDescription = that.data.checkDescription;
    let imageList = that.data.imageList;
    let checkImageList = [];
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
    for (let i = 0; i < imageList.length; i++) {
      checkImageList.push(imageList[i].key);
    }
    app.setFormId(e, function(res) {
      let param = {
        checkTaskExecutionId: checkTaskExecutionId,
        checkResult: "1",
        checkDescription: checkDescription,
        checkImageList: checkImageList
      }
      app.request("POST", "/property/checkTaskExecution/reportCheckResult.do", param, true, function(res) {
        let prevPage = app.prevPage(3);
        prevPage.removeData(checkTaskExecutionId);
        let count = prevPage.data.count;
        prevPage.setData({
          count: count - 1
        })
        wx.navigateBack({
          delta: 2
        })
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
    that.setData({
      checkTaskExecutionId: options.checkTaskExecutionId
    })
  }
})