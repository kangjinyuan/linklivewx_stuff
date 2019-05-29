let uploader = require("qiniuUploader.js");
let app = getApp();
let imgrurl = app.globalData.imgrurl;
// 初始化七牛相关参数
function initQiniu(type, callback) {
  var paras = {
    type: type
  };
  app.request("GET", "/property/qiniu/getToken.do", paras, function(res) {
    let uptoken = res.data.data;
    let options = {
      region: 'NCN',
      uptoken: uptoken,
      domain: imgrurl,
      shouldUseQiniuFileName: false
    };
    uploader.init(options);
    callback();
  }, function(res) {
    wx.showToast({
      title: "七牛token获取失败，请检查网络或者重试",
      icon: ""
    })
  })
}

// 上传图片
function uploadImg(type, filePath, that, callback) {
  initQiniu(type, function() {
    uploader.upload(filePath, (res) => {
        callback(res);
      }, (error) => {
        wx.showModal({
          title: '邻客管家',
          content: 'sorry 服务器已经离开了地球',
          confirmColor: '#fda414',
          showCancel: false
        })
      },
      null,
      cancelTask => that.setData({
        cancelTask
      })
    );
  });
}

function chooseUploadImg(that, count) {
  let imageList = that.data.imageList;
  wx.chooseImage({
    count: count - imageList.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: function(res) {
      let tempFilePaths = res.tempFilePaths;
      for (let i = 0; i < tempFilePaths.length; i++) {
        let filePath = tempFilePaths[i];
        uploadImg("0", filePath, that, function(res) {
          let obj = {
            imageURL: res.imageURL,
            key: res.key
          }
          imageList.push(obj);
          that.setData({
            imageList: imageList
          })
        })
      }
    },
  })
}

module.exports = {
  uploadImg: uploadImg,
  chooseUploadImg: chooseUploadImg
}