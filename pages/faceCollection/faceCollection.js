let upload = require("../../utils/upload.js");
let app = getApp();
Page({
  data: {
    imageUrl: "",
    index: '',
    id: "",
    device: 'front',
    btnBoxHeight: ""
  },
  device: function() {
    let that = this;
    let device = that.data.device;
    if (device == "front") {
      device = "back";
    } else {
      device = "front";
    }
    that.setData({
      device: device
    })
  },
  takePhoto() {
    let that = this;
    let camera = wx.createCameraContext();
    camera.takePhoto({
      quality: 'high',
      success: function(res) {
        that.setData({
          imageUrl: res.tempImagePath
        })
      }
    })
  },
  uploadImg: function(filePath) {
    let that = this;
    upload.uploadImg("0", filePath, that, function(res) {
      let imageURL = res.imageURL;
      let registerIndex = "";
      let index = that.data.index;
      let id = that.data.id;
      if (index == 0) {
        registerIndex = "1";
      } else if (index == 1) {
        registerIndex = "0";
      } else {
        registerIndex = "2";
      }
      let paras = {
        id: id,
        registerIndex: registerIndex,
        faceUrl: res.key
      }
      app.request("POST", "/property/face/saveOrUpdate.do", paras, function(res) {
        if (id) {
          wx.navigateBack({
            delta: 2
          })
        } else {
          if (index == 2) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            that.setData({
              index: parseInt(index) + 1,
              imageUrl: ''
            })
          }
        }
      }, function(res) {
        wx.showToast({
          title: '人脸登记失败，请检查您的网络或重试',
          icon: 'none'
        })
      })
    });
  },
  usePhoto: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    if (flag == 0) {
      that.uploadImg(that.data.imageUrl);
    } else {
      that.setData({
        imageUrl: ''
      })
    }
  },
  onReady: function() {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        let btnBoxHeight = res.windowHeight - (res.windowWidth * 4 / 3);
        that.setData({
          btnBoxHeight: btnBoxHeight,
        })
      }
    })
  },
  onLoad: function(options) {
    let that = this;
    let index = options.index;
    let id = options.id ? options.id : "";
    that.setData({
      index: index,
      id: id
    })
    app.camera(function() {});
  }
})