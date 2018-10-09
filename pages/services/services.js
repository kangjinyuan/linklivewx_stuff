let app = getApp();
Page({
  data: {
    services: [{
        icon: '../../images/icon-yzbs.png',
        text: '业主报事',
        page: '../order/order?reportstate=0'
      },
      {
        icon: '../../images/icon-bx.png',
        text: '维修任务',
        page: '../task/task'
      },
      {
        icon: '../../images/icon-kd.png',
        text: '快递代收',
        page: '../kd/kd'
      }
    ]
  },
  topages: function(e) {
    let that = this;
    let page = e.currentTarget.dataset.page;
    wx.navigateTo({
      url: page,
    })
  },
  onShow: function(options) {
    let that = this;
    app.toLogin(function() {})
  }
})