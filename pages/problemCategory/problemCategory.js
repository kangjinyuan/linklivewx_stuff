let app = getApp();
Page({
  data: {
    problemCategoryList: [{
      id: "0",
      title: "工程类"
    }, {
      id: "1",
      title: "客服类"
    }, {
      id: "2",
      title: "保洁类"
    }, {
      id: "3",
      title: "绿化类"
    }, {
      id: "4",
      title: "秩序类"
    }],
    selected: "",
  },
  selectProblemCategory: function(e) {
    let that = this;
    let problemCategory = e.currentTarget.dataset.problemCategory;
    let prevPage = app.prevPage(2);
    prevPage.setData({
      problemCategory: problemCategory
    })
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      selected: options.id
    })
  }
})