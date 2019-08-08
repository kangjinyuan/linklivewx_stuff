let app = getApp();
Page({
  data: {
    dataList: [],
    page: 1,
    totalPage: "",
    checkInStyle: "",
    shiftList: []
  },
  sideslipStart: function(e) {
    let that = this;
    app.sideslipStart(e, that);
  },
  sideslipMove: function(e) {
    let that = this;
    app.sideslipMove(e, that);
  },
  operaShift: function(e) {
    let that = this;
    let shiftInfo = JSON.stringify(e.currentTarget.dataset.shiftInfo);
    wx.navigateTo({
      url: '../addCheckInTime/addCheckInTime?shiftInfo=' + shiftInfo
    })
  },
  setShift: function() {
    let that = this;
    let dataList = that.data.dataList;
    let prevPage = app.prevPage(2);
    let checkInStyle = that.data.checkInStyle;
    let checkInPeriod = prevPage.data.checkInPeriod;
    let shiftList = prevPage.data.shiftList;
    let shiftIdList = [];
    let selectDataList = [];
    for (let i = 0; i < shiftList.length; i++) {
      shiftIdList.push(shiftList[i].id);
    }
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].isActive == true) {
        let obj = {
          id: dataList[i].id,
          name: dataList[i].name
        }
        selectDataList.push(obj);
      }
    }
    if (checkInPeriod) {
      if (checkInStyle == "0") {
        prevPage.setData({
          shiftList: selectDataList,
          shiftJson: selectDataList
        })
        wx.navigateBack({
          delta: 1
        })
      } else if (checkInStyle == "1") {
        if (selectDataList.length == 0) {
          wx.showToast({
            title: '请选择班次',
            icon: "none"
          })
          return false
        }
        for (let i = 0; i < selectDataList.length; i++) {
          if (app.inArray(selectDataList[i].id, shiftIdList) == -1 || selectDataList.length != shiftIdList.length) {
            wx.showModal({
              title: '邻客管家',
              content: '更改上下班时间需要重新设置排班周期，确认更改？',
              confirmColor: '#fda414',
              success: function(res) {
                if (res.confirm) {
                  prevPage.setData({
                    shiftJson: [],
                    shiftList: selectDataList
                  })
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
            break;
          } else {
            if (i == selectDataList.length - 1) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        }
      }
    } else {
      prevPage.setData({
        shiftList: selectDataList
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
  selectShift: function(e) {
    let that = this;
    let dataList = that.data.dataList;
    let id = e.currentTarget.dataset.id;
    let checkInStyle = that.data.checkInStyle;
    for (let i = 0; i < dataList.length; i++) {
      if (checkInStyle == "0") {
        dataList[i].isActive = false;
      }
      if (dataList[i].id == id) {
        dataList[i].isActive = !dataList[i].isActive;
      }
    }
    that.setData({
      dataList: dataList
    })
  },
  removeData: function(id) {
    let that = this;
    let dataList = that.data.dataList;
    for (let i = 0; i < dataList.length; i++) {
      if (id == dataList[i].id) {
        dataList.splice(i--, 1);
      }
    }
    that.setData({
      dataList: dataList
    })
  },
  del: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let param = {
      idList: [id]
    }
    app.request("POST", "/property/shiftCompose/delete.do", param, true, function(res) {
      that.removeData(id);
    }, function(res) {
      if (res.data.code == "0004") {
        wx.showToast({
          title: '该班次正在被考勤组使用，不可删除',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '删除班次失败，请检查您的网络或重试',
          icon: 'none'
        })
      }
    })
  },
  resetData: function(obj, shiftList) {
    let that = this;
    obj.isActive = false;
    if (shiftList) {
      for (let j = 0; j < shiftList.length; j++) {
        if (obj.id == shiftList[j].id) {
          obj.isActive = true;
          break;
        }
      }
    }
    return obj;
  },
  nextPage: function() {
    let that = this;
    app.loadMore(that, function() {
      let param = {
        page: that.data.page
      };
      let shiftList = that.data.shiftList;
      let oldList = that.data.dataList;
      app.request('POST', '/property/shiftCompose/queryList.do', param, true, function(res) {
        let dataList = res.data.data;
        for (let i = 0; i < dataList.length; i++) {
          oldList.push(that.resetData(dataList[i], shiftList));
        }
        that.setData({
          dataList: oldList
        })
      }, function() {
        wx.showToast({
          title: '无法连接服务器，请检查您的网络或重试',
          icon: 'none'
        })
      })
    })
  },
  onLoad: function(options) {
    let that = this;
    let prevPage = app.prevPage(2);
    let checkInStyle = prevPage.data.checkInStyle;
    let shiftList = prevPage.data.shiftList;
    if (shiftList) {
      shiftList = shiftList;
    } else {
      shiftList = that.data.shiftList;
    }
    let param = {
      page: that.data.page
    }
    app.request("POST", "/property/shiftCompose/queryList.do", param, true, function(res) {
      let dataList = res.data.data;
      for (let i = 0; i < dataList.length; i++) {
        dataList[i] = that.resetData(dataList[i], shiftList);
      }
      that.setData({
        dataList: dataList,
        checkInStyle: checkInStyle,
        totalPage: res.data.totalPage,
        shiftList: shiftList
      })
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: "none"
      })
    })
  }
})