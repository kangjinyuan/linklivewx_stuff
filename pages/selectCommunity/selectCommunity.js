let app = getApp();
let crurl = app.globalData.crurl;
let fcl = require("../../utils/fontChangeLetter.js");
Page({
  data: {
    communityList: [],
    dataList: [],
    communityName: ''
  },
  pageScrollTo: function(e) {
    let that = this;
    let code = e.currentTarget.dataset.code;
    let communityList = that.data.communityList;
    let top1 = null;
    wx.createSelectorQuery().select('#' + communityList[0].code).boundingClientRect(function(res) {
      top1 = res.top;
    }).exec()
    wx.createSelectorQuery().select('#' + code).boundingClientRect(function(res) {
      wx.pageScrollTo({
        scrollTop: res.top - top1
      })
    }).exec()
  },
  sreachCommunity: function(e) {
    let that = this;
    let communityName = e.detail.value;
    that.setData({
      communityName: communityName
    })
    that.setCommunity();
  },
  selectxq: function(e) {
    let that = this;
    let xqInfo = e.currentTarget.dataset.xqinfo;
    wx.setStorageSync('xqinfo', xqInfo);
    wx.navigateBack({
      delta: 1
    })
  },
  setCommunity: function() {
    let that = this;
    let communityList = [];
    let dataList = that.data.dataList;
    let communityName = that.data.communityName;
    let pinYinValue = communityName.toUpperCase();
    for (let i = 0; i < dataList.length; i++) {
      let pinYinName = fcl.getPinYinByName(dataList[i].name).toUpperCase();
      if (dataList[i].name.indexOf(communityName) > -1 || pinYinName.indexOf(pinYinValue) > -1) {
        let code = fcl.getPinYinByName(dataList[i].name).split("")[0];
        let obj = {
          code: code,
          community: []
        }
        if (communityList.indexOf(obj) == -1) {
          communityList.push(obj);
        }
        for (let j = 0; j < communityList.length; j++) {
          if (code == communityList[j].code) {
            communityList[j].community.push(dataList[i]);
          }
        }
      }
      that.setData({
        communityList: communityList
      })
    }
  },
  onLoad: function() {
    let that = this;
    wx.showLoading({
      title: 'loading···',
      mask: true
    })
    let timestamp = new Date().getTime();
    let accountInfo = wx.getStorageSync("accountInfo");
    let paras = {
      pageSzie: 10000,
      pmcId: accountInfo.pmcId
    }
    paras = JSON.stringify(paras);
    wx.request({
      url: crurl + "/property/community/queryList.do?timestamp=" + timestamp,
      data: paras,
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '0000') {
          that.setData({
            dataList: res.data.data
          })
          that.setCommunity();
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