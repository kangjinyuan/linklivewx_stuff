let app = getApp();
let imgUrl = app.globalData.imgUrl;
let mailList = require("../../utils/mailList.js");
Page({
  data: {
    stuffList: [],
    dataList: [],
    stuffName: '',
    anchor: "",
    selectType: "",
    isNoData: true
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
  setSelectDataList: function() {
    let that = this;
    let dataList = that.data.dataList;
    let prevPage = app.prevPage(2);
    let stuffType = prevPage.data.stuffType;
    let prevTowPage = app.prevPage(3);
    let selectDataList = [];
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].isActive == true) {
        let obj = {
          id: dataList[i].id,
          name: dataList[i].name
        }
        selectDataList.push(obj);
      }
    }
    prevPage.setData({
      dataList: selectDataList
    })
    if (stuffType == "0") {
      prevTowPage.setData({
        leaderJson: selectDataList
      })
    } else if (stuffType == "1") {
      prevTowPage.setData({
        memberJson: selectDataList
      })
    }
    wx.navigateBack({
      delta: 1
    })
  },
  selectStuff: function(e) {
    let that = this;
    let stuffInfo = e.currentTarget.dataset.stuffInfo;
    let dataList = that.data.dataList;
    let prevPage = app.prevPage(2);
    let selectType = that.data.selectType;
    if (selectType == "0") {
      prevPage.setData({
        stuffInfo: stuffInfo
      })
      if (prevPage.resetHeadImgAndName) {
        prevPage.resetHeadImgAndName();
      }
      wx.navigateBack({
        delta: 1
      })
    } else if (selectType == "1") {
      for (let i = 0; i < dataList.length; i++) {
        if (stuffInfo.id == dataList[i].id) {
          dataList[i].isActive = !dataList[i].isActive;
        }
      }
      that.resetData();
    }
  },
  resetData: function() {
    let that = this;
    let dataList = that.data.dataList;
    let stuffName = that.data.stuffName;
    let stuffList = mailList.mailList(dataList, stuffName);
    let isNoData = that.data.isNoData;
    for (let i = 0; i < stuffList.length; i++) {
      if (stuffList[i].childList.length > 0) {
        isNoData = false;
        break;
      } else {
        isNoData = true;
      }
    }
    that.setData({
      isNoData: isNoData,
      stuffList: stuffList
    })
  },
  onLoad: function(options) {
    let that = this;
    let prevPage = app.prevPage(2);
    let prevTwoPage = app.prevPage(3);
    let selectType = options.selectType;
    let colorArray = ["#fcac66", "#a4a8f4", "#86d8f3", "#f88777"];
    let accountInfo = wx.getStorageSync("accountInfo");
    let param = {
      pageSize: 10000
    }
    app.request("POST", "/account/stuff/queryList.do", param, true, function(res) {
      let dataList = res.data.data;
      for (let i = 0; i < dataList.length; i++) {
        dataList[i].isActive = false;
        if (selectType == "0") {
          let checkInGroupInfo = prevTwoPage.data.checkInGroupInfo;
          if (checkInGroupInfo) {
            let leaderJson = checkInGroupInfo.leaderJson;
            let leaderIdList = [];
            for (let j = 0; j < leaderJson.length; j++) {
              leaderIdList.push(leaderJson[j].id);
            }
            if (app.inArray(dataList[i].id, leaderIdList) == -1) {
              dataList.splice(i--, 1);
            }
          }
        } else if (selectType == "1") {
          let stuffType = prevPage.data.stuffType;
          if (stuffType) {
            let id = prevTwoPage.data.id;
            let selectDataList = prevPage.data.dataList;
            let selectDataIdList = [];
            for (let j = 0; j < selectDataList.length; j++) {
              if (dataList[i].id == selectDataList[j].id) {
                selectDataIdList.push(selectDataList[j].id);
                dataList[i].isActive = true;
              }
            }
            if (stuffType == "1") {
              if (id) {
                if (dataList[i].checkInGroupId > 0 && app.inArray(dataList[i].id, selectDataIdList) == -1) {
                  dataList.splice(i--, 1);
                }
              } else {
                if (dataList[i].checkInGroupId > 0) {
                  dataList.splice(i--, 1);
                }
              }
            }
          }
        }
      }
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].headimage) {
          dataList[i].headimage = imgUrl + dataList[i].headimage;
        }
        dataList[i].latterTwoCharacters = app.latterTwoCharacters(dataList[i].name);
        dataList[i].headImageBackgroundColor = app.randomData(colorArray);
      }
      wx.setNavigationBarTitle({
        title: accountInfo.pmcName + "(" + dataList.length + ")",
      })
      that.setData({
        dataList: dataList,
        selectType: selectType
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