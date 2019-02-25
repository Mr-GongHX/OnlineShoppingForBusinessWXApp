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
      urlPrefix : app.globalData.urlPrefix,
    }); 
    // 需要设定延时
    setTimeout(function(){
      wx.request({
        url: that.data.urlPrefix + 'goods/showMyGoods-' + that.data.shopId,
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
          var result =  res.data;
          if(res.statusCode == 200){
            that.setData({
              goodsList: result
            });       
          }
        }
      });
    },500);
    clearTimeout();
  }
})