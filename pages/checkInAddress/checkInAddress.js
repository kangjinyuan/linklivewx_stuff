let app = getApp();
Page({
  data: {
    dataList: [],
    page: 1,
    totalPage: "",
    checkInAddressJson: []
  },
  sideslipStart: function(e) {
    let that = this;
    app.sideslipStart(e, that);
  },
  sideslipMove: function(e) {
    let that = this;
    app.sideslipMove(e, that);
  },
  operaCheckInAddress: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.chooseLocation({
      success: function(res) {
        let param = {
          id: id,
          name: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        }
        app.request("POST", "/property/checkInAddress/saveOrUpdate.do", param, true, function(res) {
          if (id) {
            let param = {
              id: id
            }
            app.request("POST", "/property/checkInAddress/queryList.do", param, true, function(res) {
              let checkInAddressInfo = res.data.data[0];
              let dataList = that.data.dataList;
              for (let i = 0; i < dataList.length; i++) {
                if (id == dataList[i].id) {
                  checkInAddressInfo.isActive = dataList[i].isActive;
                  dataList[i] = checkInAddressInfo;
                }
              }
              that.setData({
                dataList: dataList
              })
            }, function(res) {
              wx.showToast({
                title: '获取考勤点失败，请检查您的网络或重试',
                icon: "none"
              })
            })
          } else {
            that.setData({
              page: 1
            })
            that.onLoad();
          }
        }, function(res) {
          if (id) {
            wx.showToast({
              title: '编辑考勤点失败，请检查您的网络或重试',
              icon: "none"
            })
          } else {
            wx.showToast({
              title: '新增考勤点失败，请检查您的网络或重试',
              icon: "none"
            })
          }
        })
      },
    })
  },
  setCheckInAddress: function() {
    let that = this;
    let dataList = that.data.dataList;
    let prevPage = app.prevPage(2);
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
      checkInAddressJson: selectDataList
    })
    wx.navigateBack({
      delta: 1
    })
  },
  selectCheckInAddress: function(e) {
    let that = this;
    let dataList = that.data.dataList;
    let id = e.currentTarget.dataset.id;
    for (let i = 0; i < dataList.length; i++) {
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
    app.request("POST", "/property/checkInAddress/delete.do", param, true, function(res) {
      that.removeData(id);
    }, function(res) {
      if (res.data.code == "0004") {
        wx.showToast({
          title: '该考勤点正在被考勤组使用，不可删除',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '删除考勤点失败，请检查您的网络或重试',
          icon: 'none'
        })
      }
    })
  },
  resetData: function(obj, checkInAddressJson) {
    let that = this;
    obj.isActive = false;
    if (checkInAddressJson) {
      for (let j = 0; j < checkInAddressJson.length; j++) {
        if (obj.id == checkInAddressJson[j].id) {
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
      let checkInAddressJson = that.data.checkInAddressJson;
      let param = {
        page: that.data.page
      };
      let oldList = that.data.dataList;
      app.request('POST', '/property/checkInAddress/queryList.do', param, true, function(res) {
        let dataList = res.data.data;
        for (let i = 0; i < dataList.length; i++) {
          oldList.push(that.resetData(dataList[i], checkInAddressJson));
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
    let checkInAddressJson = prevPage.data.checkInAddressJson;
    let param = {
      page: that.data.page
    }
    app.request("POST", "/property/checkInAddress/queryList.do", param, true, function(res) {
      let dataList = res.data.data;
      for (let i = 0; i < dataList.length; i++) {
        dataList[i] = that.resetData(dataList[i], checkInAddressJson);
      }
      that.setData({
        dataList: dataList,
        totalPage: res.data.totalPage,
        checkInAddressJson: checkInAddressJson
      })
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: "none"
      })
    })
  }
})