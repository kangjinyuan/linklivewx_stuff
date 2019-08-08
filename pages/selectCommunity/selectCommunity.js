let app = getApp();
let commonRequestUrl = app.globalData.commonRequestUrl;
let mailList = require("../../utils/mailList.js");
Page({
  data: {
    communityList: [],
    dataList: [],
    communityName: '',
    anchor: "",
    isNoData: true
  },
  pageScrollTo: function(e) {
    let that = this;
    let anchor = e.currentTarget.dataset.anchor;
    that.setData({
      anchor: anchor
    })
  },
  sreachCommunity: function(e) {
    let that = this;
    let communityName = e.detail.value;
    that.setData({
      communityName: communityName
    })
    that.resetData();
  },
  selectCommunity: function(e) {
    let that = this;
    let communityInfo = e.currentTarget.dataset.communityInfo;
    wx.setStorageSync('communityInfo', communityInfo);
    wx.navigateBack({
      delta: 1
    })
  },
  resetData: function() {
    let that = this;
    let dataList = that.data.dataList;
    let communityName = that.data.communityName;
    let communityList = mailList.mailList(dataList, communityName);
    let isNoData = that.data.isNoData;
    for (let i = 0; i < communityList.length; i++) {
      if (communityList[i].childList.length > 0) {
        isNoData = false;
        break;
      } else {
        isNoData = true;
      }
    }
    that.setData({
      isNoData: isNoData,
      communityList: communityList
    })
  },
  onLoad: function() {
    let that = this;
    wx.showLoading({
      title: 'loading···',
      mask: true
    })
    let timestamp = new Date().getTime();
    let accountInfo = wx.getStorageSync("accountInfo");
    let param = {
      pageSzie: 10000,
      pmcId: accountInfo.pmcId
    }
    param = JSON.stringify(param);
    wx.request({
      url: commonRequestUrl + "/property/community/queryList.do?timestamp=" + timestamp,
      data: param,
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '0000') {
          that.setData({
            dataList: res.data.data
          })
          that.resetData();
        } else if (res.data.code == "0008") {
          wx.showToast({
            title: '服务器内部错误',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '无法连接服务器，请检查您的网络或重试',
            icon: 'none'
          })
        }
      },
      fail: function(res) {
        wx.showModal({
          title: '邻客管家',
          content: 'sorry 服务器已经离开了地球',
          confirmColor: '#fda414',
          showCancel: false
        })
        wx.hideLoading();
      }
    })
  }
})