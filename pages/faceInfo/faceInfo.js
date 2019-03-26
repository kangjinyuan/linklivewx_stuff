Page({
  data: {
    faceInfo: {},
    index: ''
  },
  faceCollection: function(e) {
    let that = this;
    let index = that.data.index;
    let faceInfo = that.data.faceInfo;
    wx.navigateTo({
      url: '../faceCollection/faceCollection?index=' + index + '&id=' + faceInfo.id
    })
  },
  onLoad: function(options) {
    let that = this;
    let faceInfo = JSON.parse(options.faceInfo);
    let index = '';
    if (faceInfo.registerIndex == 0) {
      wx.setNavigationBarTitle({
        title: '左侧面',
      })
      index = "1";
    } else if (faceInfo.registerIndex == 1) {
      wx.setNavigationBarTitle({
        title: '正面照',
      })
      index = "0";
    } else if (faceInfo.registerIndex == 2) {
      wx.setNavigationBarTitle({
        title: '右侧面',
      })
      index = "2";
    }
    that.setData({
      faceInfo: faceInfo,
      index: index
    })
  }
})