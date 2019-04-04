let app = getApp();
let imgrurl = app.globalData.imgrurl;
Page({
  data: {
    faceList: [{
      faceUrl: "../../images/face1.png",
      id: "",
      registerIndex: "1"
    }, {
      faceUrl: "../../images/face0.png",
      id: "",
      registerIndex: "0"
    }, {
      faceUrl: "../../images/face2.png",
      id: "",
      registerIndex: "2"
    }],
    showFaceCollection: true,
    faceCollectionBtnText: ""
  },
  del: function(e) {
    let that = this;
    let faceInfo = e.currentTarget.dataset.faceinfo;
    let idList = [];
    idList.push(faceInfo.id);
    let paras = {
      idList: idList
    }
    app.request("POST", "/property/face/delete.do", paras, function(res) {
      that.onShow();
    }, function(res) {
      wx.showToast({
        title: '人脸删除失败，请检查您的网络或重试',
        icon: 'none'
      })
    })
  },
  faceInfo: function(e) {
    let that = this;
    let faceInfo = JSON.stringify(e.currentTarget.dataset.faceinfo);
    let showFaceCollection = that.data.showFaceCollection;
    if (showFaceCollection) {
      wx.navigateTo({
        url: '../faceInfo/faceInfo?faceInfo=' + faceInfo
      })
    }
  },
  faceCollection: function(e) {
    let that = this;
    let faceList = that.data.faceList;
    let index = '';
    for (let i = 0; i < faceList.length; i++) {
      if (!faceList[i].id) {
        index = i;
        break;
      }
    }
    wx.navigateTo({
      url: '../faceCollection/faceCollection?index=' + index
    })
  },
  onShow: function() {
    let that = this;
    let faceList = that.data.faceList;
    let paras = {}
    app.request("POST", "/property/face/queryList.do", paras, function(res) {
      let dataList = res.data.data;
      if (dataList.length < 3) {
        that.setData({
          showFaceCollection: false
        })
        if (dataList.length > 0) {
          that.setData({
            faceCollectionBtnText: "继续采集"
          })
        } else {
          that.setData({
            faceCollectionBtnText: "开始采集"
          })
        }
      } else {
        that.setData({
          showFaceCollection: true
        })
      }
      for (let i = 0; i < dataList.length; i++) {
        dataList[i].faceUrl = imgrurl + dataList[i].faceUrl;
        for (let j = 0; j < faceList.length; j++) {
          if (dataList[i].registerIndex == faceList[j].registerIndex) {
            faceList[j] = dataList[i];
          }
        }
      }
      that.setData({
        faceList: faceList
      })
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: 'none'
      })
    })
  }
})