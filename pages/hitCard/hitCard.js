let app = getApp();
let timer = null;
Page({
  data: {
    accountInfo: "",
    nowDate: app.setTime(new Date(), 13),
    latitude: "",
    longitude: "",
    markers: [],
    circles: [],
    dataList: [],
    checkInGroupInfo: "",
    checkInGroupList: [],
    checkInAddressList: [],
    checkInAddressInfo: "",
    checkInRecord: [],
    nowDistance: "",
    isAddCheckInGroup: false,
    showAlert: true,
    hitCardParam: "",
    address: "",
    editRecord: ""
  },
  checkInGroup: function() {
    let that = this;
    wx.navigateTo({
      url: '../checkInGroup/checkInGroup'
    })
  },
  checkInCanlder: function() {
    let that = this;
    let accountInfo = that.data.accountInfo;
    let checkInGroupInfo = that.data.checkInGroupInfo;
    let leaderJson = checkInGroupInfo.leaderJson;
    let leaderIdList = [];
    if (accountInfo.checkInGroupId == 0) {
      wx.showToast({
        title: '您还未加入考勤组，请联系管理人员',
        icon: "none"
      })
      return false;
    }
    for (let i = 0; i < leaderJson.length; i++) {
      leaderIdList.push(leaderJson[i].id);
    }
    if (app.inArray(accountInfo.id, leaderIdList) == -1) {
      wx.navigateTo({
        url: '../checkInCalendar/checkInCalendar?isLeader=0'
      })
    } else {
      wx.navigateTo({
        url: '../checkInCalendar/checkInCalendar?isLeader=1'
      })
    }
  },
  checkInStatistics: function() {
    let that = this;
    let accountInfo = wx.getStorageSync("accountInfo");
    let isAddCheckInGroup = that.data.isAddCheckInGroup;
    let param = {
      pageSize: 10000
    }
    if (isAddCheckInGroup == false) {
      param.staffId = accountInfo.id;
      param.staffName = accountInfo.name;
    }
    app.request("POST", "/property/checkInGroup/queryList.do", param, true, function(res) {
      let checkInGroupList = res.data.data;
      if (checkInGroupList.length == 0) {
        wx.navigateTo({
          url: '../checkInStatisticsMine/checkInStatisticsMine'
        })
      } else {
        that.setData({
          checkInGroupList: checkInGroupList
        })
        wx.navigateTo({
          url: '../checkInStatisticsCharger/checkInStatisticsCharger'
        })
      }
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: 'none'
      })
    })
  },
  resetLocation: function() {
    let that = this;
    let mapCtx = wx.createMapContext('myMap');
    mapCtx.moveToLocation();
    app.getNowLocation(function(res) {
      let latitude = res.latitude;
      let longitude = res.longitude;
      that.setData({
        latitude: latitude,
        longitude: longitude
      })
      that.getCheckInAddressInfo(latitude, longitude);
    });
  },
  getEditRecord: function(e) {
    let that = this;
    let value = e.detail.value;
    that.setData({
      editRecord: value
    })
  },
  showAlert: function() {
    let that = this;
    let showAlert = that.data.showAlert;
    showAlert = !showAlert;
    that.setData({
      showAlert: showAlert
    })
  },
  checkIn: function() {
    let that = this;
    let param = that.data.hitCardParam;
    param.address = that.data.address;
    let checkState = param.checkState;
    let editRecord = that.data.editRecord;
    let checkInTime = app.setTime(new Date(), 0);
    let nowTimeStamp = app.setTimeStamp(checkInTime);
    let checkInDate = checkInTime.split(" ")[0];
    let setTime = param.setTime;
    let deadLineTimeStamp = app.setTimeStamp(checkInDate + " " + setTime);
    if (checkState == "3") {
      if (nowTimeStamp > deadLineTimeStamp) {
        param.checkState = "0";
      }
    } else if (checkState == "4") {
      param.editRecord = editRecord;
    }
    param.checkInTime = checkInTime;
    app.request("POST", "/property/checkInRecord/checkIn.do", param, true, function(res) {
      that.getShift();
      if (checkState == "4") {
        that.showAlert();
      }
    }, function(res) {
      wx.showToast({
        title: '打卡失败，请检查您的网络或重试',
        icon: "none"
      })
    })
  },
  hitCard: function(e) {
    let that = this;
    let nowDistance = that.data.nowDistance;
    let checkInGroupInfo = that.data.checkInGroupInfo;
    let withinMeters = checkInGroupInfo.withinMeters;
    let dataInfo = e.currentTarget.dataset.dataInfo;
    let shiftInfo = dataInfo.shiftInfo;
    let setTime = shiftInfo.deadLineTime;
    let direction = shiftInfo.direction;
    let checkInTime = app.setTime(new Date(), 0);
    let nowTimeStamp = app.setTimeStamp(checkInTime);
    let checkInDate = checkInTime.split(" ")[0];
    let deadLineTimeStamp = app.setTimeStamp(checkInDate + " " + shiftInfo.deadLineTime);
    let absentOverTime = dataInfo.absentOverTime;
    let checkState = "0";
    if (nowDistance <= withinMeters) {
      if (shiftInfo.direction == 0) {
        if (absentOverTime) {
          let absentTimeStamp = deadLineTimeStamp + absentOverTime * 60 * 1000;
          if (nowTimeStamp > deadLineTimeStamp && nowTimeStamp < absentTimeStamp) {
            checkState = "1";
          } else if (nowTimeStamp > absentTimeStamp) {
            checkState = "2";
          }
        } else {
          if (nowTimeStamp > deadLineTimeStamp) {
            checkState = "1";
          }
        }
      } else {
        if (nowTimeStamp < deadLineTimeStamp) {
          checkState = "3";
        }
      }
      let param = {
        checkState: checkState,
        setTime: setTime,
        direction: direction
      }
      that.setData({
        hitCardParam: param
      })
      if (checkState == "3") {
        wx.showModal({
          title: '邻客管家',
          content: '当前打卡状态为早退，是否继续打卡？',
          confirmColor: '#fda414',
          success: function(res) {
            if (res.confirm) {
              that.checkIn();
            }
          }
        })
      } else {
        that.checkIn();
      }
    } else {
      checkState = "4";
      let param = {
        checkState: checkState,
        setTime: setTime,
        direction: direction
      }
      that.setData({
        hitCardParam: param
      })
      that.showAlert();
    }
  },
  resetShift: function(firstShift, secondShift, thirdShift) {
    let that = this;
    let shiftList = firstShift.split("-").concat(secondShift.split("-")).concat(thirdShift.split("-"));
    let resArray = [];
    for (let i = 0; i < shiftList.length; i++) {
      let direction = "";
      if (i % 2 == 0) {
        direction = "0";
      } else {
        direction = "1";
      }
      if (shiftList[i]) {
        let obj = {
          deadLineTime: shiftList[i],
          direction: direction
        }
        resArray.push(obj);
      }
    }
    return resArray;
  },
  getHolidays: function(callback) {
    let that = this;
    let param = {
      pageSize: 10000
    }
    app.request("POST", "/property/holidays/queryList.do", param, true, function(res) {
      let holidaysList = res.data.data;
      callback(holidaysList);
    }, function(res) {
      wx.showToast({
        title: '获取法定节假日失败，请检查您的网络或重试',
        icon: "none"
      })
    })
  },
  getShift: function() {
    let that = this;
    let checkInGroupInfo = that.data.checkInGroupInfo;
    let checkInStyle = checkInGroupInfo.checkInStyle;
    // let autoReset = checkInGroupInfo.autoReset;
    let shiftJson = checkInGroupInfo.shiftJson;
    let shiftIndex = checkInGroupInfo.shiftIndex;
    let id = shiftJson[shiftIndex].id;
    let dataList = [];
    // that.getHolidays(function(res) {
    // if (checkInStyle == "0") {
    //   let checkInPeriod = checkInGroupInfo.checkInPeriod.split(",");
    //   let nowDate = new Date();
    //   let nowTimeStamp = app.setTimeStamp(app.setTime(nowDate, 3));
    //   let weekDay = nowDate.getDay();
    //   if (autoReset == "1") {
    //     for (let i = 0; i < res.length; i++) {
    //       let holidayTimeStamp = app.setTimeStamp(res[i].day);
    //       if (nowTimeStamp == holidayTimeStamp) {
    //         wx.showToast({
    //           title: '今天为法定节假日，不需要打卡',
    //           icon: "none"
    //         })
    //         return false;
    //       }
    //     }
    //   }
    //   if (app.inArray(weekDay, checkInPeriod) == -1) {
    //     wx.showToast({
    //       title: '今天为休息日，不需要打卡',
    //       icon: "none"
    //     })
    //     return false;
    //   }
    // }
    that.getCheckInRecord(function(res) {
      let checkInRecord = res;
      let param = {
        id: id
      }
      app.request("POST", "/property/shiftCompose/queryList.do", param, true, function(res) {
        let shiftInfo = res.data.data[0];
        if (shiftInfo) {
          let absentOverTime = shiftInfo.absentOverTime;
          let shiftList = that.resetShift(shiftInfo.firstShift, shiftInfo.secondShift, shiftInfo.thirdShift);
          for (let i = 0; i < shiftList.length; i++) {
            var obj = {
              id: i,
              isShow: checkInRecord[i] ? true : false,
              absentOverTime: absentOverTime,
              checkInRecord: checkInRecord[i] ? checkInRecord[i] : '',
              shiftInfo: shiftList[i],
            }
            dataList.push(obj);
          }
          if (dataList[checkInRecord.length]) {
            dataList[checkInRecord.length].isShow = true;
          }
          that.setData({
            dataList: dataList,
            checkInRecord: checkInRecord
          })
        }
      });
    }, function() {
      wx.showToast({
        title: '获取当天班次失败，请检查您的网络或重试',
        icon: "none"
      })
    })
    // });
  },
  resetData: function(obj) {
    if (obj.checkState == 0 || obj.checkState == 4 || obj.checkState == 6) {
      if (obj.checkState == 0) {
        obj.checkStateText = "正常";
      } else if (obj.checkState == 4) {
        obj.checkStateText = "外勤";
      } else {
        obj.checkStateText = "请假";
      }
      obj.checkStateBgClass = "check-work-state-bg0";
    } else if (obj.checkState == 1 || obj.checkState == 2 || obj.checkState == 3 || obj.checkState == 5) {
      if (obj.checkState == 1) {
        obj.checkStateText = "迟到";
      } else if (obj.checkState == 2) {
        obj.checkStateText = "旷工";
      } else if (obj.checkState == 3) {
        obj.checkStateText = "早退";
      } else {
        obj.checkStateText = "缺卡";
      }
      obj.checkStateBgClass = "check-work-state-bg1";
    }
    obj.checkInTimeText = app.setTime(obj.checkInTime, 12);
    return obj;
  },
  getCheckInRecord: function(callback) {
    let that = this;
    let nowDate = app.setTime(new Date(), 3);
    let startTime = app.setTime(nowDate, 0);
    let endTime = app.setTime(app.setEndTime(nowDate, 1), 0);
    let param = {
      startTime: startTime,
      endTime: endTime
    }
    app.request("POST", "/property/checkInRecord/queryList.do", param, true, function(res) {
      let checkInRecord = res.data.data;
      for (let i = 0; i < checkInRecord.length; i++) {
        checkInRecord[i] = that.resetData(checkInRecord[i]);
      }
      callback(checkInRecord);
    }, function(res) {
      wx.showToast({
        title: '获取打卡记录失败，请检查您的网络或重试',
        icon: "none"
      })
    })
  },
  getCheckInAddressInfo: function(lat, lng) {
    let that = this;
    let checkInGroupInfo = that.data.checkInGroupInfo;
    let withinMeters = checkInGroupInfo.withinMeters;
    let checkInAddressList = that.data.checkInAddressList;
    let distanceArray = [];
    for (let i = 0; i < checkInAddressList.length; i++) {
      let distance = app.getDistance(lat, lng, checkInAddressList[i].latitude, checkInAddressList[i].longitude);
      distanceArray.push(distance);
    }
    let minValue = Math.min.apply(null, distanceArray);
    let checkInAddressInfo = checkInAddressList[app.inArray(minValue, distanceArray)];
    let latitude = checkInAddressInfo.latitude;
    let longitude = checkInAddressInfo.longitude;
    let nowDistance = app.getDistance(lat, lng, latitude, longitude);
    let markers = [{
      id: checkInAddressInfo.id,
      latitude: latitude,
      longitude: longitude,
      width: "26rpx",
      height: "48rpx",
      iconPath: "../../images/icon-map-location.png",
      title: checkInAddressInfo.name
    }]
    let circles = [{
      latitude: latitude,
      longitude: longitude,
      color: '#fda41480',
      fillColor: '#fda41420',
      radius: withinMeters,
      strokeWidth: 1
    }]
    that.setData({
      markers: markers,
      circles: circles,
      checkInAddressInfo: checkInAddressInfo,
      nowDistance: nowDistance
    })
    app.reverseGeocoder(true, function(res) {
      that.setData({
        address: res.result.address
      })
    });
  },
  getCheckInAddress: function(lat, lng) {
    let that = this;
    let checkInGroupInfo = that.data.checkInGroupInfo;
    let checkInAddressJson = checkInGroupInfo.checkInAddressJson;
    let idList = [];
    for (let i = 0; i < checkInAddressJson.length; i++) {
      idList.push(checkInAddressJson[i].id);
    }
    let param = {
      idList: idList
    }
    app.request("POST", "/property/checkInAddress/queryList.do", param, true, function(res) {
      that.setData({
        checkInAddressList: res.data.data
      })
      that.getCheckInAddressInfo(lat, lng);
      timer = setInterval(function() {
        app.getNowLocation(function(res) {
          let nowDistance = app.getDistance(that.data.checkInAddressInfo.latitude, that.data.checkInAddressInfo.longitude, res.latitude, res.longitude);
          that.setData({
            nowDistance: nowDistance
          })
          app.reverseGeocoder(false, function(res) {
            that.setData({
              address: res.result.address
            })
          });
        })
      }, 30000);
    }, function(res) {
      wx.showToast({
        title: '获取考勤地点失败，请检查您的网络或重试',
        icon: 'none'
      })
    })
  },
  onLoad: function() {
    let that = this;
    app.userLocation(function() {
      let accountInfo = wx.getStorageSync("accountInfo");
      let checkInGroupId = accountInfo.checkInGroupId;
      let isAddCheckInGroup = app.privilegeState(2);
      if (isAddCheckInGroup) {
        that.setData({
          isAddCheckInGroup: true
        })
      }
      app.getNowLocation(function(res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude,
          accountInfo: accountInfo
        })
        let param = {
          id: checkInGroupId
        }
        app.request("POST", "/property/checkInGroup/queryList.do", param, true, function(res) {
          let timer = setInterval(function() {
            that.setData({
              nowDate: app.setTime(new Date(), 13)
            })
          }, 1000);
          let checkInGroupInfo = res.data.data[0];
          if (checkInGroupInfo) {
            checkInGroupInfo.leaderJson = JSON.parse(checkInGroupInfo.leaderJson);
            checkInGroupInfo.checkInAddressJson = JSON.parse(checkInGroupInfo.checkInAddressJson);
            checkInGroupInfo.shiftJson = JSON.parse(checkInGroupInfo.shiftJson);
            checkInGroupInfo.withinMeters = parseInt(checkInGroupInfo.withinMeters);
            wx.setNavigationBarTitle({
              title: checkInGroupInfo.name
            })
            that.setData({
              checkInGroupInfo: checkInGroupInfo
            })
            that.getShift();
            that.getCheckInAddress(latitude, longitude);
          }
        }, function() {
          wx.showToast({
            title: '获取考勤组失败，请检查您的网络或重试',
            icon: "none"
          })
        })
      });
    });
  },
  onUnload: function() {
    clearInterval(timer);
  }
})