//app.js
App({
  onLaunch: function () {
    wx.getStorage({
      key: 'shopId',
      success: function(res) {
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 500
        });
      },
      fail: function(res) {
        wx.showModal({
          title: '您尚未登录',
          content: '即将带您前往登录页',
          showCancel:false,
          success: function(){
            wx.navigateTo({
              url: '../login/login',
            });
          }
        });
      }
    })
  },
  globalData: {
    urlPrefix: "http://39.105.167.27:8080/"
  }
})