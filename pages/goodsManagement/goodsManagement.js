// pages/goodsManagement/goodsManagement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    // 判断是否有shopId
    wx.getStorage({
      key: 'shopId',
      fail: function () {
        wx.showModal({
          title: '您尚未登录',
          content: '即将带您前往登录页',
          showCancel: false,
          success: function () {
            wx.navigateTo({
              url: '../login/login',
            });
          }
        });
      }
    });
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 发布商品
  createGoods: function () {
    wx.navigateTo({
      url: '../createGoods/createGoods',
    })
  }
})