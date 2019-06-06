let app = getApp();
let imgUrl = app.globalData.imgUrl;
let mailList = require("../../utils/mailList.js");
Page({
  data: {
    stuffList: [],
    dataList: [],
    stuffName: '',
    anchor: ""
  },
  pageScrollTo: function(e) {
    let that = this;
    let anchor = e.currentTarget.dataset.anchor;
    that.setData({
      anchor: anchor
    })
  },
  sreachStuff: function(e) {
    let that = this;
    let stuffName = e.detail.value;
    that.setData({
      stuffName: stuffName
    })
    that.resetData();
  },
  selectStuff: function(e) {
    let that = this;
    let stuffInfo = e.currentTarget.dataset.stuffInfo;
    let prevPage = app.prevPage(2);
    prevPage.setData({
      stuffInfo: stuffInfo
    })
    wx.navigateBack({
      delta: 1
    })
  },
  resetData: function() {
    let that = this;
    let dataList = that.data.dataList;
    let stuffName = that.data.stuffName;
    let stuffList = mailList.mailList(dataList, stuffName);
    that.setData({
      stuffList: stuffList
    })
  },
  onLoad: function() {
    let that = this;
    let colorArray = ["#fcac66", "#a4a8f4", "#86d8f3", "#f88777"];
    let accountInfo = wx.getStorageSync("accountInfo");
    let param = {
      pageSize: 10000
    }
    app.request("POST", "/account/stuff/queryList.do", param, true, function(res) {
      let dataList = res.data.data;
      let count = res.data.count;
      wx.setNavigationBarTitle({
        title: accountInfo.pmcName + "(" + count + ")",
      })
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].headimage) {
          dataList[i].headimage = imgUrl + dataList[i].headimage;
        }
        dataList[i].latterTwoCharacters = app.latterTwoCharacters(dataList[i].name);
        dataList[i].headImageBackgroundColor = app.randomData(colorArray);
      }
      that.setData({
        dataList: res.data.data
      })
      that.resetData();
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: "none"
      })
    })
  }
})