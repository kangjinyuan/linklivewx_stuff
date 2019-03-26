let app = getApp();
let crurl = app.globalData.crurl;
let fcl = require("../../utils/fontChangeLetter.js");
Page({
  data: {
    cList: [],
    communityName: ''
  },
  pageScrollTo: function(e) {
    let that = this;
    let code = e.currentTarget.dataset.code;
    let cList = that.data.cList;
    let top1 = null;
    wx.createSelectorQuery().select('#' + cList[0].code).boundingClientRect(function(res) {
      top1 = res.top;
    }).exec()
    wx.createSelectorQuery().select('#' + code).boundingClientRect(function(res) {
      wx.pageScrollTo({
        scrollTop: res.top - top1
      })
    }).exec()
  },
  sreachcommunity: function(e) {
    let that = this;
    let communityName = e.detail.value;
    that.setData({
      communityName: communityName
    })
    that.onLoad();
  },
  selectxq: function(e) {
    let that = this;
    let xqInfo = e.currentTarget.dataset.xqinfo;
    wx.setStorageSync('xqinfo', xqInfo);
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function() {
    let that = this;
    wx.showLoading({
      title: 'loading···'
    })
    let timestamp = new Date().getTime();
    let accountInfo = wx.getStorageSync("accountInfo");
    let paras = {
      pageSzie: 10000,
      pmcId: accountInfo.pmcId,
      name: that.data.communityName,
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
          let dataList = res.data.data;
          let cList = [];
          for (let i = 0; i < dataList.length; i++) {
            let code = fcl.getPinYinByName(dataList[i].name).split("")[0];
            let obj = {
              code: code,
              community: []
            }
            if (cList.indexOf(obj) == -1) {
              cList.push(obj);
            }
            for (let j = 0; j < cList.length; j++) {
              if (code == cList[j].code) {
                cList[j].community.push(dataList[i]);
              }
            }
          }
          that.setData({
            cList: cList
          })
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