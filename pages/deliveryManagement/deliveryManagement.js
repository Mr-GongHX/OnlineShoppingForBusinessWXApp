// pages/deliveryManagement/deliveryManagement.js
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
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'shopId',
      success: function(res) {
        that.setData({
          shopId: res.data
        });
      },
    });
    this.setData({
      urlPrefix: app.globalData.urlPrefix
    });
    // 需要设定延时
    setTimeout(function () { 
      // 发起查询待处理订单请求
      wx.request({
        url: that.data.urlPrefix + 'order/orderManagement',
        data: {
          shopId: that.data.shopId
        },
        method: 'POST',
        header: {
          //设置参数内容类型为x-www-form-urlencoded
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function (res) { 
          if(res.statusCode == 200) {
            that.setData({
              orderList: res.data
            });
          }
        } 
      });
    },500);
    clearTimeout();
  },
  /**
   * 已发货
   */
  completed: function(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    // 发起更改订单状态请求
    wx.request({
      url: that.data.urlPrefix + 'order/updateOrderStatus-' + orderId,
      method: 'POST',
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          wx.showToast({
            title: '发货成功',
            icon: 'success',
            duration: 500
          });
          
        }
      }
    });
  }
})