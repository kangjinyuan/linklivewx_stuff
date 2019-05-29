let app = getApp();
Page({
  data: {
    communityInfo: "",
    accountInfo: ""
  },
  selectCommunity: function() {
    let that = this;
    wx.navigateTo({
      url: '../selectCommunity/selectCommunity',
    })
  },
  topages: function(e) {
    let that = this;
    let communityInfo = that.data.communityInfo;
    let id = e.currentTarget.dataset.id;
    if (communityInfo) {
      if (id == 0) {
        wx.navigateTo({
          url: "../order/order?reportState=0"
        })
      } else if (id == 1) {
        wx.navigateTo({
          url: "../order/order?reportState=1"
        })
      } else if (id == 2) {
        wx.navigateTo({
          url: "../express/express"
        })
      } else if (id == 3) {
        wx.navigateTo({
          url: "../meter/meter"
        })
      } else if (id == 4) {
        wx.navigateTo({
          url: "../networkOpenDoor/networkOpenDoor"
        })
      } else if (id == 5) {
        wx.navigateTo({
          url: "../face/face"
        })
      } else if (id == 6) {
        wx.navigateTo({
          url: "../checkTask/checkTask"
        })
      } else if (id == 7) {
        wx.navigateTo({
          url: "../workOrder/workOrder"
        })
      }
    } else {
      wx.showToast({
        title: '请选择社区',
        icon: "none"
      })
    }
  },
  onShow: function(options) {
    let that = this;
    app.toLogin(function() {
      let communityInfo = wx.getStorageSync('communityInfo');
      let accountInfo = wx.getStorageSync('accountInfo');
      let paras = {
        id: accountInfo.id
      }
      app.request('POST', '/account/stuff/queryList.do', paras, function(res) {
        let stuffInfo = res.data.data[0];
        let dutyScope = JSON.parse(stuffInfo.dutyScope);
        dutyScope = dutyScope.sort(app.resetSort(1, "sort"));
        let privilege = JSON.parse(stuffInfo.privilege);
        stuffInfo.dutyScope = dutyScope;
        stuffInfo.privilege = privilege;
        wx.setStorageSync('accountInfo', stuffInfo);
        that.setData({
          communityInfo: communityInfo,
          accountInfo: stuffInfo
        })
      }, function(res) {
        wx.setStorageSync("accessToken", "");
        that.onShow();
      })
    })
  }
})