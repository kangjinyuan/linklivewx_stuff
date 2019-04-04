let app = getApp();
Page({
  data: {
    isFirst: '',
    lastMeterTime: '',
    currentMeterTime: '',
    lastMeterValue: '',
    currentMeterValue: '',
    dosage: '',
    feeList: [],
    feeIndex: 0,
    totalFee: '',
    buildingsList: [],
    unitsList: [],
    roomsList: [],
    buildingCode: '',
    unit: '',
    roomInfo: "",
    showBuilding: true,
    showUnit: true,
    showRoom: true,
    showPreview: true,
    showFee: true
  },
  showBox: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    let showFee = that.data.showFee;
    let showBuilding = that.data.showBuilding;
    let showUnit = that.data.showUnit;
    let showRoom = that.data.showRoom;
    let buildingCode = that.data.buildingCode;
    let unit = that.data.unit;
    if (flag == 0) {
      showBuilding = !showBuilding;
      that.setData({
        showFee: true,
        showBuilding: showBuilding,
        showUnit: true,
        showRoom: true
      })
    } else if (flag == 1) {
      if (buildingCode == "") {
        wx.showToast({
          title: '请选择楼号',
          icon: "none"
        })
        return false;
      }
      showUnit = !showUnit;
      that.setData({
        showFee: true,
        showBuilding: true,
        showUnit: showUnit,
        showRoom: true
      })
    } else if (flag == 2) {
      if (buildingCode == "") {
        wx.showToast({
          title: '请选择楼号',
          icon: "none"
        })
        return false;
      }
      if (unit == "") {
        wx.showToast({
          title: '请选择单元',
          icon: "none"
        })
        return false;
      }
      showRoom = !showRoom;
      that.setData({
        showFee: true,
        showBuilding: true,
        showUnit: true,
        showRoom: showRoom
      })
    } else if (flag == 3) {
      showFee = !showFee;
      that.setData({
        showFee: showFee,
        showBuilding: true,
        showUnit: true,
        showRoom: true
      })
    }
  },
  selectValue: function(e) {
    let that = this;
    let showFee = that.data.showFee;
    let showBuilding = that.data.showBuilding;
    let showUnit = that.data.showUnit;
    let showRoom = that.data.showRoom;
    if (showBuilding == false) {
      let buildingCode = e.currentTarget.dataset.code;
      let unit = that.data.unit;
      that.setData({
        buildingCode: buildingCode,
        showBuilding: true,
        showUnit: false,
        showRoom: true
      })
      that.loadUnits(buildingCode);
      that.loadRooms(buildingCode, unit);
    } else if (showUnit == false) {
      let buildingCode = that.data.buildingCode;
      let unit = e.currentTarget.dataset.unit;
      that.setData({
        unit: unit,
        showBuilding: true,
        showUnit: true,
        showRoom: false
      })
      that.loadRooms(buildingCode, unit);
    } else if (showRoom == false) {
      let roomInfo = e.currentTarget.dataset.roominfo;
      that.getMeter(roomInfo);
    } else if (showFee == false) {
      let feeIndex = e.currentTarget.dataset.index;
      let roomInfo = that.data.roomInfo;
      if (roomInfo) {
        that.setData({
          feeIndex: feeIndex,
          showFee: true
        })
        that.getMeter(roomInfo);
      } else {
        wx.showToast({
          title: '请选择房间号',
          icon: "none"
        })
      }
    }
  },
  getMeter: function(roomInfo) {
    let that = this;
    let feeName = that.data.feeList[that.data.feeIndex].feeName;
    let date = new Date();
    let paras = {
      address: roomInfo.address,
      feeName: feeName
    }
    app.request("POST", "/property/meter/queryList.do", paras, function(res) {
      let meterInfo = res.data.data;
      let lastMeterTime = "";
      let lastMeterValue = "";
      let isFirst = "";
      if (meterInfo.length > 0) {
        lastMeterTime = app.setTime(meterInfo[0].currentMeterTime, 1);
        lastMeterValue = meterInfo[0].currentMeterValue;
        isFirst = false;
      } else {
        lastMeterTime = app.setTime(date, 1);
        isFirst = true;
      }
      that.setData({
        isFirst: isFirst,
        roomInfo: roomInfo,
        lastMeterTime: lastMeterTime,
        lastMeterValue: lastMeterValue,
        currentMeterTime: app.setTime(date, 1),
        currentMeterValue: "",
        dosage: "",
        totalFee: "",
        showBuilding: true,
        showUnit: true,
        showRoom: true
      })
    }, function(res) {
      wx.showToast({
        title: '抄表记录加载失败',
        icon: "none"
      })
    })
  },
  loadRooms: function(buildingCode, unit) {
    let that = this;
    let paras = {
      pageSize: 10000,
      buildingCode: buildingCode,
      unit: unit
    }
    app.request('POST', '/property/rooms/queryList.do', paras, function(res) {
      let roomsList = res.data.data;
      that.setData({
        roomsList: roomsList
      })
    }, function(res) {
      wx.showToast({
        title: '房屋加载失败',
        icon: 'none'
      })
    })
  },
  loadUnits: function(buildingCode) {
    let that = this;
    let buildingsList = that.data.buildingsList;
    let unitsList = [];
    for (let i = 0; i < buildingsList.length; i++) {
      if (buildingCode == buildingsList[i].code) {
        let units = buildingsList[i].units;
        for (let j = 0; j < units.length; j++) {
          unitsList.push(j + 1);
        }
      }
    }
    that.setData({
      unitsList: unitsList
    })
  },
  loadBuildings: function() {
    let that = this;
    let paras = {
      pageSize: 10000
    }
    app.request('POST', '/property/buildings/queryList.do', paras, function(res) {
      that.setData({
        buildingsList: res.data.data
      })
    }, function(res) {
      wx.showToast({
        title: '楼宇加载失败',
        icon: 'none'
      })
    })
  },
  getValue: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    let value = e.detail.value;
    let regular_num = /^[0-9]*$/;
    if (flag == 0) {
      if (!regular_num.test(value)) {
        wx.showToast({
          title: '上次值格式不正确，请输入数字',
          icon: "none"
        })
        that.setData({
          lastMeterValue: that.data.lastMeterValue
        })
      } else {
        that.setData({
          lastMeterValue: value
        })
      }
    } else {
      if (!regular_num.test(value)) {
        wx.showToast({
          title: '本次值格式不正确，请输入数字',
          icon: "none"
        })
        that.setData({
          currentMeterValue: that.data.currentMeterValue
        })
      } else {
        let dosage = "";
        let totalFee = "";
        let lastMeterValue = that.data.lastMeterValue;
        let feeInfo = that.data.feeList[that.data.feeIndex];
        if (value) {
          dosage = value - lastMeterValue;
          totalFee = "￥" + parseFloat(feeInfo.fee * dosage).toFixed(2);
        } else {
          dosage = "";
          totalFee = "";
        }
        that.setData({
          currentMeterValue: value,
          dosage: dosage,
          totalFee: totalFee
        })
      }
    }
  },
  checkInput: function(e) {
    let that = this;
    let flag = e.currentTarget.dataset.flag;
    let lastMeterValue = that.data.lastMeterValue;
    let roomInfo = that.data.roomInfo;
    if (flag == 0) {
      if (!roomInfo) {
        wx.showToast({
          title: '请选择房间号',
          icon: "none"
        })
      }
    } else if (flag == 1) {
      if (lastMeterValue == "") {
        wx.showToast({
          title: '请填写上次值',
          icon: "none"
        })
      }
    }
  },
  showPreview: function() {
    let that = this;
    let showPreview = that.data.showPreview;
    let buildingCode = that.data.buildingCode;
    let unit = that.data.unit;
    let roomInfo = that.data.roomInfo;
    let lastMeterValue = that.data.lastMeterValue;
    let currentMeterValue = that.data.currentMeterValue;
    if (buildingCode == "" || unit == "" || roomInfo == "") {
      wx.showToast({
        title: '请选择房间号',
        icon: "none"
      })
      return false;
    }
    if (lastMeterValue == "") {
      wx.showToast({
        title: '请填写上次值',
        icon: "none"
      })
      return false;
    }
    if (currentMeterValue == "") {
      wx.showToast({
        title: '请填写本次值',
        icon: "none"
      })
      return false;
    }
    if (parseInt(currentMeterValue) < parseInt(lastMeterValue)) {
      wx.showToast({
        title: '本次值不能小于上次值',
        icon: "none"
      })
      return false;
    }
    showPreview = !showPreview;
    that.setData({
      showPreview: showPreview
    })
  },
  setMeter: function() {
    let that = this;
    let roomInfo = that.data.roomInfo;
    let feeInfo = that.data.feeList[that.data.feeIndex];
    let totalFee = that.data.totalFee.split("￥")[1];
    let dosage = that.data.dosage;
    let lastMeterTime = app.setTime(that.data.lastMeterTime, 0);
    let currentMeterTime = app.setTime(that.data.currentMeterTime, 0);
    let lastMeterValue = that.data.lastMeterValue;
    let currentMeterValue = that.data.currentMeterValue;
    var paras = {
      roomId: roomInfo.id,
      roomCode: roomInfo.code,
      unit: roomInfo.unit,
      buildingCode: roomInfo.buildingCode,
      address: roomInfo.address,
      feeId: feeInfo.id,
      feeName: feeInfo.feeName,
      unitPrice: feeInfo.fee,
      lastMeterTime: lastMeterTime,
      currentMeterTime: currentMeterTime,
      lastMeterValue: lastMeterValue,
      currentMeterValue: currentMeterValue,
      dosage: dosage,
      totalFee: totalFee
    }
    app.request('POST', '/property/meter/saveOrUpdate.do', paras, function(res) {
      let meterInfo = res.data.data;
      var paras = {
        id: meterInfo.id
      }
      app.request("POST", "/property/meter/createBill.do", paras, function(res) {
        that.showPreview();
        that.getMeter(roomInfo);
        wx.showToast({
          title: '账单发送成功',
          icon: "none"
        })
      }, function(res) {
        wx.showToast({
          title: '账单发送失败',
          icon: "none"
        })
      })
    }, function(res) {
      wx.showToast({
        title: '抄表记录新建失败',
        icon: 'none'
      })
    })
  },
  onLoad: function(options) {
    let that = this;
    let paras = {
      isDeputy: "1"
    }
    app.request('POST', '/property/fee/queryList.do', paras, function(res) {
      let feeList = res.data.data;
      if (feeList.length > 0) {
        for (let i = 0; i < feeList.length; i++) {
          feeList[i].fee = parseFloat(feeList[i].fee).toFixed(2);
        }
        that.setData({
          feeList: feeList
        })
        that.loadBuildings();
      } else {
        wx.showModal({
          title: '邻客管家',
          content: '本社区没有抄表的缴费项目',
          confirmColor: '#fda414',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              });
            }
          }
        })
      }
    }, function(res) {
      wx.showToast({
        title: '缴费项目加载失败',
        icon: 'none'
      })
    })
  }
})