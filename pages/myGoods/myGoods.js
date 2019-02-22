// pages/myGoods/myGoods.js

// 获取小程序实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlPrefix: '',
    shopId: '',
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      urlPrefix : app.globalData.urlPrefix,
      shopId : app.globalData.shopId
    }); 
    var that = this;
    wx.request({
      url: that.data.urlPrefix + 'goods/showMyGoods-' + that.data.shopId,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        var result =  res.data;
        if(res.statusCode == 200){
          console.log("Goods:" + JSON.stringify(result));
          that.setData({
            goodsList: result
          });       
        }
      }
    });
  },
  onShow: function (options){
    this.setData({
      urlPrefix: app.globalData.urlPrefix,
      shopId: app.globalData.shopId
    });
    var that = this;
    wx.request({
      url: that.data.urlPrefix + 'goods/showMyGoods-' + that.data.shopId,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var result = res.data;
        if (res.statusCode == 200) {
          console.log("Goods:" + JSON.stringify(result));
          that.setData({
            goodsList: result
          });
        }
      }
    });
  }
})