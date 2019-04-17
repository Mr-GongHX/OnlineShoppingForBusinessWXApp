// pages/searchOrder/searchOrder.js
// 获取小程序实例
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlPrefix: "",
    shopId: "",
    // 订单列表数据
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this;
    wx.getStorage({
      key: 'shopId',
      success: function(res) {
        that.setData({
          shopId: res.data
        });
      }
    });
    this.setData({
      urlPrefix: app.globalData.urlPrefix
    });
    // 需要设定延时
    setTimeout(function () {
      // 发起查询用户订单请求
      wx.request({
        url: that.data.urlPrefix + 'order/showShopOrder-' + that.data.shopId,
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.statusCode == 200) {
            that.setData({
              orderList: res.data
            });
          }
        }
      });
    }, 500);
    clearTimeout();

  }
})