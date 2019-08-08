let app = getApp();
Page({
  data: {
    id: "",
    name: '',
    leaderJson: [],
    memberJson: [],
    checkInStyleList: [{
      name: '固定制',
      checkInStyle: '0'
    }, {
      name: '排班制',
      checkInStyle: '1'
    }],
    checkInStyle: '0',
    shiftJson: [],
    shiftList: [],
    checkInPeriod: '',
    checkInPeriodText: "",
    autoReset: "",
    checkInAddressJson: [],
    withinMeterList: ["100", "200", "300", "400", "500", "600", "700", "800", "900", "1000", "2000", "3000"],
    withinMeterIndex: 2
  },
  getValue: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    let value = e.detail.value;
    if (flag == 0) {
      that.setData({
        name: value
      });
    } else if (flag == 1) {
      that.setData({
        withinMeterIndex: value
      });
    }
  },
  selectStuff: function(e) {
    let that = this;
    let stuffType = e.currentTarget.dataset.stuffType;
    wx.navigateTo({
      url: '../checkInGroupPersonnel/checkInGroupPersonnel?stuffType=' + stuffType
    })
  },
  tabCheckInStyle: function(e) {
    let that = this;
    let checkInStyle = that.data.checkInStyle;
    let dataCheckInStyle = e.currentTarget.dataset.checkInStyle;
    if (checkInStyle != dataCheckInStyle) {
      that.setData({
        checkInStyle: dataCheckInStyle,
        checkInPeriod: "",
        checkInPeriodText: "",
        shiftList: [],
        shiftJson: [],
        autoReset: ""
      })
    }
  },
  selectShift: function() {
    let that = this;
    wx.navigateTo({
      url: '../checkInTime/checkInTime'
    })
  },
  checkInDay: function() {
    let that = this;
    let shiftList = that.data.shiftList;
    if (shiftList.length == 0) {
      wx.showToast({
        title: '请选择上下班时间',
        icon: "none"
      })
      return false;
    }
    wx.navigateTo({
      url: '../checkInDay/checkInDay'
    })
  },
  checkInCycle: function() {
    let that = this;
    let shiftList = that.data.shiftList;
    if (shiftList.length == 0) {
      wx.showToast({
        title: '请选择上下班时间',
        icon: "none"
      })
      return false;
    }
    wx.navigateTo({
      url: '../checkInCycle/checkInCycle'
    })
  },
  selectCheckInAddress: function() {
    let that = this;
    wx.navigateTo({
      url: '../checkInAddress/checkInAddress'
    })
  },
  resetCheckInPeriod: function(checkInPeriod) {
    let that = this;
    let checkInPeriodText = [];
    let checkInStyle = that.data.checkInStyle;
    if (checkInStyle == "0") {
      checkInPeriod = checkInPeriod.split(",");
      for (let i = 0; i < checkInPeriod.length; i++) {
        if (checkInPeriod[i] == "0") {
          checkInPeriodText.push("周日");
        } else if (checkInPeriod[i] == "1") {
          checkInPeriodText.push("周一");
        } else if (checkInPeriod[i] == "2") {
          checkInPeriodText.push("周二");
        } else if (checkInPeriod[i] == "3") {
          checkInPeriodText.push("周三");
        } else if (checkInPeriod[i] == "4") {
          checkInPeriodText.push("周四");
        } else if (checkInPeriod[i] == "5") {
          checkInPeriodText.push("周五");
        } else if (checkInPeriod[i] == "6") {
          checkInPeriodText.push("周六");
        }
      }
      that.setData({
        checkInPeriodText: checkInPeriodText.join(",")
      })
    }
  },
  addCheckInGroup: function(e) {
    let that = this;
    let id = that.data.id;
    let name = that.data.name;
    let leaderJson = that.data.leaderJson;
    let memberJson = that.data.memberJson;
    let checkInStyle = that.data.checkInStyle;
    let shiftList = that.data.shiftList;
    let shiftJson = that.data.shiftJson;
    let checkInPeriod = that.data.checkInPeriod;
    let autoReset = that.data.autoReset;
    let checkInAddressJson = that.data.checkInAddressJson;
    let withinMeters = that.data.withinMeterList[that.data.withinMeterIndex];
    if (name == "") {
      wx.showToast({
        title: '请输入考勤组名称',
        icon: "none"
      })
      return false;
    }
    if (leaderJson.length == 0) {
      wx.showToast({
        title: '请选择考勤组主管',
        icon: "none"
      })
      return false;
    }
    if (memberJson.length == 0) {
      wx.showToast({
        title: '请选择参与考勤人员',
        icon: "none"
      })
      return false;
    }
    if (shiftList.length == 0) {
      wx.showToast({
        title: '请选择上下班时间',
        icon: "none"
      })
      return false;
    }
    if (shiftJson.length == 0) {
      if (checkInStyle == "0") {
        wx.showToast({
          title: '请选择考勤日期',
          icon: "none"
        })
      } else if (checkInStyle == "1") {
        wx.showToast({
          title: '请设置排班周期',
          icon: "none"
        })
      }
      return false;
    }
    if (checkInAddressJson.length == 0) {
      wx.showToast({
        title: '请选择考勤地点',
        icon: "none"
      })
      return false;
    }
    let param = {
      id: id,
      name: name,
      leaderJson: JSON.stringify(leaderJson),
      memberJson: JSON.stringify(memberJson),
      checkInStyle: checkInStyle,
      checkInTime: JSON.stringify(shiftList),
      checkInPeriod: checkInPeriod,
      shiftJson: JSON.stringify(shiftJson),
      checkInAddressJson: JSON.stringify(checkInAddressJson),
      autoReset: autoReset,
      withinMeters: withinMeters
    }
    app.request("POST", "/property/checkInGroup/saveOrUpdate.do", param, true, function(res) {
      let prevPage = app.prevPage(2);
      if (id) {
        let param = {
          id: id
        }
        app.request("POST", "/property/checkInGroup/queryList.do", param, true, function(res) {
          let checkInGroupInfo = res.data.data[0];
          let dataList = prevPage.data.dataList;
          for (let i = 0; i < dataList.length; i++) {
            if (id == dataList[i].id) {
              dataList[i] = prevPage.resetData(checkInGroupInfo);
            }
          }
          prevPage.setData({
            dataList: dataList
          })
        }, function(res) {
          wx.showToast({
            title: '获取考勤组失败，请检查您的网络或重试',
            icon: "none"
          })
        })
      } else {
        prevPage.setData({
          page: 1
        })
        prevPage.onLoad();
      }
      wx.navigateBack({
        delta: 1
      })
    }, function(res) {
      if (id) {
        wx.showToast({
          title: '编辑失败，请检查您的网络或重试',
          icon: "none"
        })
      } else {
        wx.showToast({
          title: '新建失败，请检查您的网络或重试',
          icon: "none"
        })
      }
    })
  },
  onLoad: function(options) {
    let that = this;
    let checkInGroupInfo = JSON.parse(options.checkInGroupInfo);
    if (checkInGroupInfo) {
      wx.setNavigationBarTitle({
        title: "编辑考勤组"
      })
      let withinMeterList = that.data.withinMeterList;
      let withinMeters = checkInGroupInfo.withinMeters;
      let withinMeterIndex = "";
      for (let i = 0; i < withinMeterList.length; i++) {
        if (withinMeters == withinMeterList[i]) {
          withinMeterIndex = i;
        }
      }
      let checkInStyle = checkInGroupInfo.checkInStyle;
      let checkInPeriod = checkInGroupInfo.checkInPeriod;
      let checkInPeriodText = "";
      if (checkInStyle == "0") {
        checkInPeriodText = that.resetCheckInPeriod(checkInPeriod);
      }
      that.setData({
        id: checkInGroupInfo.id,
        name: checkInGroupInfo.name,
        leaderJson: checkInGroupInfo.leaderJson,
        memberJson: checkInGroupInfo.memberJson,
        checkInStyle: checkInGroupInfo.checkInStyle,
        shiftList: checkInGroupInfo.checkInTime,
        checkInPeriod: checkInPeriod,
        autoReset: checkInGroupInfo.autoReset,
        checkInAddressJson: checkInGroupInfo.checkInAddressJson,
        shiftJson: checkInGroupInfo.shiftJson,
        withinMeterIndex: withinMeterIndex
      })
    } else {
      wx.setNavigationBarTitle({
        title: "添加考勤组"
      })
    }
  }
})