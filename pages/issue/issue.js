let app = getApp();
let upload = require("../../utils/upload.js");
Page({
  data: {
    tabList: [{
      issueType: "2",
      title: "设施"
    }, {
      issueType: "1",
      title: "设备"
    }],
    facilitySelected: "",
    equipmentSelected: "",
    issueType: "",
    dataList: [],
    totalPage: '',
    page: 1
  },
  tabState: function(e) {
    let that = this;
    let issueType = e.currentTarget.dataset.issueType;
    let equipmentSelected = that.data.equipmentSelected;
    let facilitySelected = that.data.facilitySelected;
    that.setData({
      issueType: issueType,
      page: 1
    })
    let options = {};
    if (issueType == "1") {
      options = {
        issueType: issueType,
        id: equipmentSelected
      }
    } else if (issueType == "2") {
      options = {
        issueType: issueType,
        id: facilitySelected
      }
    }
    that.onLoad(options);
  },
  selectIssue: function(e) {
    let that = this;
    let issue = e.currentTarget.dataset.issue;
    let issueType = that.data.issueType;
    let prevPage = app.prevPage(2);
    prevPage.setData({
      issue: issue,
      issueType: issueType,
      orderAddress: issue.addressDescription
    })
    wx.navigateBack({
      delta: 1
    })
  },
  scanCode: function(e) {
    let that = this;
    let scanType = ['qrCode'];
    app.scanCode(scanType, function(res) {
      let issueId = res.result.split("-")[0];
      let issueType = res.result.split("-")[1];
      let param = {
        page: 1,
        id: issueId
      }
      let requestUrl = "";
      if (issueType == 2) {
        requestUrl = "/property/facility/queryList.do";
      } else {
        requestUrl = "/property/equipment/queryList.do";
      }
      app.request("POST", requestUrl, param, true, function(res) {
        let issue = res.data.data[0];
        if (issue.state == "0") {
          wx.showToast({
            title: '该设施设备处于禁用状态',
            icon: "none"
          })
        } else {
          let prevPage = app.prevPage(2);
          prevPage.setData({
            issue: issue,
            issueType: issueType,
            orderAddress: issue.addressDescription
          })
          wx.navigateBack({
            delta: 1
          })
        }
      }, function(res) {
        wx.showToast({
          title: '无法连接服务器，请检查您的网络或重试',
          icon: "none"
        })
      })
    }, function(res) {
      wx.showToast({
        title: '请扫描正确的设施设备二维码',
        icon: 'none'
      })
    });
  },
  nextPage: function() {
    let that = this;
    app.loadMore(that, function() {
      let issueType = that.data.issueType;
      let param = {
        page: that.data.page,
        state: 1
      }
      let requestUrl = "";
      if (issueType == 2) {
        requestUrl = "/property/facility/queryList.do";
      } else {
        requestUrl = "/property/equipment/queryList.do";
      }
      let oldList = that.data.dataList;
      app.request("POST", requestUrl, param, true, function(res) {
        let dataList = res.data.data;
        for (let i = 0; i < dataList.length; i++) {
          oldList.push(dataList[i]);
        }
        that.setData({
          dataList: oldList
        })
      }, function(res) {
        wx.showToast({
          title: '无法连接服务器，请检查您的网络或重试',
          icon: "none"
        })
      })
    })
  },
  onLoad: function(options) {
    let that = this;
    let issueType = options.issueType ? options.issueType : "2";
    let id = options.id;
    if (issueType == "1") {
      that.setData({
        equipmentSelected: id
      })
    } else if (issueType == "2") {
      that.setData({
        facilitySelected: id
      })
    }
    let param = {
      page: that.data.page,
      state: 1
    }
    let requestUrl = "";
    if (issueType == 2) {
      requestUrl = "/property/facility/queryList.do";
    } else {
      requestUrl = "/property/equipment/queryList.do";
    }
    app.request("POST", requestUrl, param, true, function(res) {
      that.setData({
        dataList: res.data.data,
        issueType: issueType,
        totalPage: res.data.totalPage
      })
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: "none"
      })
    })
  }
})