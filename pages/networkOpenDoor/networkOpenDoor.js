let app = getApp();
Page({
  data: {
    totalPage: '',
    page: 1,
    keyList: []
  },
  openDoor: function(e) {
    let keyInfo = e.currentTarget.dataset.keyInfo;
    let paras = {
      deviceSn: keyInfo.deviceSn
    }
    app.request("POST", "/property/doorMaster/remoteControl.do", paras, function(res) {
      wx.showToast({
        title: '开门成功',
        icon: "none"
      })
    }, function(res) {
      wx.showToast({
        title: '开门失败，请检查网络或重试',
        icon: "none"
      })
    })
  },
  nextPage: function() {
    let that = this;
    app.loadMore(that, function() {
      let paras = {
        page: that.data.page
      };
      let oldList = that.data.keyList;
      app.request('POST', '/property/doorMaster/queryList.do', paras, function(res) {
        let keyList = res.data.data;
        for (let i = 0; i < keyList.length; i++) {
          oldList.push(keyList[i]);
        }
        that.setData({
          keyList: oldList
        })
      }, function() {
        wx.showToast({
          title: '无法连接服务器，请检查您的网络或重试',
          icon: 'none'
        })
      })
    })
  },
  onLoad: function(options) {
    let that = this;
    let paras = {
      page: that.data.page
    };
    app.request('POST', '/property/doorMaster/queryList.do', paras, function(res) {
      that.setData({
        keyList: res.data.data,
        totalPage: res.data.totalPage
      })
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: 'none'
      })
    })
  }
})