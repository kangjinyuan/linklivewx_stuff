let app = getApp();
let dateTimePicker = require('../../utils/dateTimePicker.js');
Page({
  data: {
    selectTimeArray: [],
    selectTime: "",
    selectTimeText: "",
    staffId: ""
  },
  getSelectTime: function(e) {
    let that = this;
    let selectTimeArray = that.data.selectTimeArray;
    let selectTime = that.data.selectTime;
    let selectTimeText = selectTimeArray[0][selectTime[0]] + "-" + selectTimeArray[1][selectTime[1]]
    that.setData({
      selectTimeText: selectTimeText
    })
    that.record();
  },
  changeDateTimeColumn: function(e) {
    let that = this;
    dateTimePicker.changeDateTimeColumn(that.data.selectTime, that.data.selectTimeArray, e, function(dateTime, dateTimeArray) {
      that.setData({
        selectTime: dateTime
      });
    })
  },
  record: function() {
    let that = this;
    let selectTime = that.data.selectTimeText.split("-");
    let year = selectTime[0];
    let month = selectTime[1];
    let staffId = that.data.staffId;
    let param = {
      year: year,
      month: month
    }
    if (staffId) {
      param.staffId = staffId;
    }
    app.request("POST", "/statistics/checkIn/personal/record.do", param, true, function(res) {
      let recordInfo = res.data.data;
      that.setData({
        recordInfo: recordInfo
      })
    }, function(res) {
      wx.showToast({
        title: '获取考勤统计失败，请检查网络或者重试',
        icon: "none"
      })
    })
  },
  onLoad: function(options) {
    let that = this;
    let staffId = options.staffId;
    let staffName = options.staffName;
    if (staffId) {
      that.setData({
        staffId: staffId
      });
      wx.setNavigationBarTitle({
        title: staffName
      })
    }
    dateTimePicker.dateTimePickerInit('', function(res) {
      let selectTime = res.dateTime;
      let selectTimeArray = res.dateTimeArray;
      let selectTimeText = selectTimeArray[0][selectTime[0]] + "-" + selectTimeArray[1][selectTime[1]]
      that.setData({
        selectTime: res.dateTime,
        selectTimeArray: res.dateTimeArray,
        selectTimeText: selectTimeText
      });
      that.record()
    }, 2);
  }
})