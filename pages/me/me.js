// pages/me/me.js

// 获取小程序实例
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    urlPrefix: "",
    shopId: "",
    shopName: "",
    shopBalance: "",
    shopAdminProfile: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      urlPrefix: app.globalData.urlPrefix
    });
    // 初始化设置数据（商家id，用户头像网络地址，商家名称，商家营业额）
    var that = this;
    // 获取相应数据
    wx.getStorage({
      key: 'shopId',
      success: function(res) {
        that.setData({
          shopId: res.data
        });
      },
    })
    wx.getStorage({
      key: 'shopBalance',
      success: function (res) {
        that.setData({
          shopBalance: res.data
        });
      },
    })
    wx.getStorage({
      key: 'shopName',
      success: function (res) {
        that.setData({
          shopName: res.data
        });
      },
    })
  },
  /**
   * 用户登录
   */
  toLogin: function() {
    // 跳转到登录页
    wx.navigateTo({
      url: '../login/login',
    })
  },
  /**
   * 商家上传头像
   */
  setShopAdminProfile: function () {
    var that = this;
    // 上传图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {//调用API成功
        // 获取临时本地图片路径
        var imgUrl = res.tempFilePaths;
        // 将头像上传到服务器中
        wx.uploadFile({
          url: that.data.urlPrefix + 'shop/uploadShopProfile-' + that.data.shopId,
          filePath: imgUrl[0],
          name: 'shopAdminProfile',
          header: {
            // 设置参数内容类型为multipart/form-data
            'content-type': 'multipart/form-data'
          },
          success: function (res) {
            // 判断服务器返回的状态码是否是200
            if(res.statusCode == 200) {
              wx.showToast({
                title: '上传成功！',
                icon: 'success',
                duration: 1000
              });
              that.setData({
                shopAdminProfile: imgUrl
              });  
            } else {
              wx.showToast({
                title: '上传失败！',
                icon: 'loading',
                duration: 1000
              });
            }
          },
          fail: function () {
            wx.showToast({
              title: '上传失败！',
              icon: 'loading',
              duration: 1000
            });
          }
        });
      }
    });
  },
  // 退出登录
  logout: function () {
    var that = this;
    wx.request({
      url: that.data.urlPrefix + 'shopAdminLogout.do',
      method: 'POST',
      data: {
        'shopId': shopId
      }, 
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        if(res.statusCode == 200) {
          wx.showToast({
            title: '退出成功！',
            icon: 'success',
            duration: 1000
          });
        } else {
          wx.showToast({
            title: '退出失败！',
            icon: 'loading',
            duration: 1000
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: '退出失败！',
          icon: 'loading',
          duration: 1000
        });
      }
    });
  }
})