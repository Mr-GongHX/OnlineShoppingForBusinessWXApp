// pages/myGoods/myGoods.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId: '',
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.shopId = app.globalData.shopId;
    wx.request({
      url: 'http://'+ app.globalData.ip + ':8080/goods/showMyGoods-' + that.data.shopId,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        var result =  res.data;
        if(res.statusCode == 200){
          console.log("Goods:" + JSON.stringify(res.data));
          // that.data.goodsList = JSON.stringify(res.data);
          that.setData({
            goodsList: result
          });       
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})