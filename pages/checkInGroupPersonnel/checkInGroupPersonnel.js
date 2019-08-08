let app = getApp();
Page({
  data: {
    stuffType: "",
    dataList: []
  },
  sideslipStart: function(e) {
    let that = this;
    app.sideslipStart(e, that);
  },
  sideslipMove: function(e) {
    let that = this;
    app.sideslipMove(e, that);
  },
  addStuff: function() {
    let that = this;
    wx.navigateTo({
      url: '../selectCommunication/selectCommunication?selectType=1',
    })
  },
  del: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let stuffType = that.data.stuffType;
    let prevPage = app.prevPage(2);
    let dataList = that.data.dataList;
    for (let i = 0; i < dataList.length; i++) {
      if (id == dataList[i].id) {
        dataList.splice(i--, 1);
      }
    }
    that.setData({
      dataList: dataList
    })
    if (stuffType == "0") {
      prevPage.setData({
        leaderJson: dataList
      })
    } else if (stuffType == "1") {
      prevPage.setData({
        memberJson: dataList
      })
    }
  },
  onLoad: function(options) {
    let that = this;
    let stuffType = options.stuffType;
    let prevPage = app.prevPage(2);
    let leaderJson = prevPage.data.leaderJson;
    let memberJson = prevPage.data.memberJson;
    let dataList = [];
    if (stuffType == "0") {
      wx.setNavigationBarTitle({
        title: "考勤组主管"
      })
      dataList = leaderJson;
    } else if (stuffType == "1") {
      wx.setNavigationBarTitle({
        title: "参与考勤人员"
      })
      dataList = memberJson;
    }
    that.setData({
      stuffType: stuffType,
      dataList: dataList
    })
  }
})