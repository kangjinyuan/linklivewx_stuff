let app = getApp();
Page({
  data: {
    totalPage: '',
    page: 1,
    dataList: []
  },
  sideslipStart: function(e) {
    let that = this;
    app.sideslipStart(e, that);
  },
  sideslipMove: function(e) {
    let that = this;
    app.sideslipMove(e, that);
  },
  operaCheckInGroup: function(e) {
    let that = this;
    let checkInGroupInfo = JSON.stringify(e.currentTarget.dataset.checkInGroupInfo);
    wx.navigateTo({
      url: '../addCheckInGroup/addCheckInGroup?checkInGroupInfo=' + checkInGroupInfo
    })
  },
  del: function(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let idList = [id];
    let param = {
      idList: idList
    }
    app.request("POST", "/property/checkInGroup/delete.do", param, true, function(res) {
      that.removeData(id);
    }, function(res) {
      wx.showToast({
        title: '删除考勤组失败，请检查您的网络或重试',
      })
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
  resetData: function(obj) {
    obj.leaderJson = JSON.parse(obj.leaderJson);
    obj.memberJson = JSON.parse(obj.memberJson);
    obj.shiftJson = JSON.parse(obj.shiftJson);
    obj.checkInAddressJson = JSON.parse(obj.checkInAddressJson);
    obj.checkInTime = JSON.parse(obj.checkInTime);
    if (obj.checkInStyle == 0) {
      obj.checkInStyleText = "固定制";
    } else if (obj.checkInStyle == 1) {
      obj.checkInStyleText = "排班制";
    }
    return obj;
  },
  nextPage: function() {
    let that = this;
    app.loadMore(that, function() {
      let param = {
        page: that.data.page
      };
      let oldList = that.data.dataList;
      app.request('POST', '/property/checkInGroup/queryList.do', param, true, function(res) {
        let dataList = res.data.data;
        for (let i = 0; i < dataList.length; i++) {
          oldList.push(that.resetData(dataList[i]));
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
    let param = {
      page: that.data.page
    }
    app.request("POST", "/property/checkInGroup/queryList.do", param, true, function(res) {
      let dataList = res.data.data;
      for (let i = 0; i < dataList.length; i++) {
        dataList[i] = that.resetData(dataList[i]);
      }
      that.setData({
        dataList: dataList,
        totalPage: res.data.totalPage
      })
    }, function(res) {
      wx.showToast({
        title: '无法连接服务器，请检查您的网络或重试',
        icon: "none"
      })
    });
  }
})