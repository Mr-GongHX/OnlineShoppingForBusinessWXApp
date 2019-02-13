// pages/createGoods/createGoods.js

// 获取小程序实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId: '',
    typeId: '',
    type: '',
    typeArray: ['电脑','手机','外设'],
    goodsname: '',
    imgList: [],
    goodsPrice: '',
    goodsAmount: '',
    goodsInfoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.shopId = app.globalData.shopId;
  },
  // 商品标题
  goodsnameInput: function (e) {
    this.data.goodsname = e.detail.value;
  },
  // 商品价格
  goodsPriceInput: function (e) {
    this.data.goodsPrice = e.detail.value;
  },
  // 商品库存
  goodsAmountInput: function (e) {
    this.data.goodsAmount = e.detail.value;
  },
  // 商品类型
  bindPickerChange: function (e) {
    this.data.typeId = e.detail.value;
    this.setData({
      type: this.data.typeArray[e.detail.value] 
    });
    console.log(this.data.typeId)
  },
  //选择商品展示图片
  chooseImg: function (e) {
    var imgList = this.data.imgList;
    var picid = e.currentTarget.dataset.pic;
    var that = this;
    var n = 5;
    if (5 > imgList.length > 0) {
      n = 5 - imgList.length;
    } else if (imgList.length == 5) {
      n = 1;
    }
    wx.chooseImage({
      count: n,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        if (imgList.length == 0) {
          imgList = tempFilePaths
        } else if (5 > imgList.length) {
          imgList = imgList.concat(tempFilePaths);
        } else {
          imgList[picid] = tempFilePaths[0];
        }
        that.setData({
          imgList: imgList
        }); 
        console.log(imgList);
      }
    });     
  },
  // 选择商品介绍图片
  chooseGoodsImgInfo: function (e) {
    var goodsInfoList = this.data.goodsInfoList;
    var picid = e.currentTarget.dataset.pic;
    var that = this;
    var n = 5;
    if (5 > goodsInfoList.length > 0) {
      n = 5 - goodsInfoList.length;
    } else if (goodsInfoList.length == 5) {
      n = 1;
    }
    wx.chooseImage({
      count: n,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        if (goodsInfoList.length == 0) {
          goodsInfoList = tempFilePaths
        } else if (5 > goodsInfoList.length) {
          goodsInfoList = goodsInfoList.concat(tempFilePaths);
        } else {
          goodsInfoList[picid] = tempFilePaths[0];
        }
        that.setData({
          goodsInfoList: goodsInfoList
        });
        console.log(goodsInfoList);
      }
    });
  },
  // 发布商品
  formSubmit: function () {
    // 检测信息是否填写完整
    if(this.data.goodsname == '' || 
      this.data.typeId == '' ||
      this.data.goodsPrice == '' ||
      this.data.goodsAmount == '' ||
      this.data.imgList == '' ||
      this.data.goodsInfoList == '') {
        wx.showToast({
          title: '请填写完整！',
          icon: 'loading',
          duration: 1000
        });
    } else {
      // 上传信息
      var that = this;
      // 商品展示图片列表
      var imgList = that.data.imgList;
      // 商品介绍图片列表
      var goodsInfoList = that.data.goodsInfoList;
      console.log(that.data.goodsname + ',' + that.data.goodsPrice + "," +that.data.goodsAmount)

      wx.request({
        url: 'http://192.168.1.3:8080/uploadGoods/goodsInfo.do',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          'shopId': encodeURI(that.data.shopId),
          'typeId': encodeURI(that.data.typeId),
          'goodsname': encodeURI(that.data.goodsname),
          'goodsPrice': encodeURI(that.data.goodsPrice),
          'goodsAmount': encodeURI(that.data.goodsAmount)
        }
      })
      // 上传商品展示图
      for (var i = 0; i < imgList.length; i++) {
        wx.uploadFile({
          url: 'http://192.168.1.3:8080/uploadGoods/goodsImg.do',
          filePath: imgList[i],
          name: 'goodsImg',
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: {
            
          },
          success: function (res) {
            console.log("qwer")
            if(res.statusCode == 200) {
              var data = res.data
              console.log(data)
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '提交失败',
              icon: 'loading',
              duration: 1000
            });
          }
        });
        console.log("ddd")
      } 

      // 上传商品详情图
      for (var i = 0; i < goodsInfoList.length; i++) {
        wx.uploadFile({
          url: 'http://192.168.1.3:8080/uploadGoods/goodsImgInfo.do',
          filePath: goodsInfoList[i],
          name: 'goodsImgInfo',
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: {
            
          },
          success: function (res) {
            if (res.statusCode == 200) {
              var data = res.data
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '提交失败',
              icon: 'loading',
              duration: 1000
            });
          }
        });
      } 
    }
  }
})