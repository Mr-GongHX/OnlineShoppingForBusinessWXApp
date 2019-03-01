// pages/createGoods/createGoods.js

// 获取小程序实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlPrefix: '',
    goodsId: '',
    shopId: '',
    typeId: '',
    type: '',
    typeArray: ['电脑','手机','外设'],
    goodsName: '',
    imgList: [],
    goodsPrice: '',
    goodsAmount: '',
    goodsInfoList: [],
    videoSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'shopId',
      success: function(res) {
        that.setData({
          shopId : res.data
        })
      },
    });
    this.setData({
      urlPrefix : app.globalData.urlPrefix
    });
  },
  // 商品标题
  goodsNameInput: function (e) {
    this.setData({
      goodsName : e.detail.value
    })
  },
  // 商品价格
  goodsPriceInput: function (e) {
    this.setData({
      goodsPrice : e.detail.value
    })
  },
  // 商品库存
  goodsAmountInput: function (e) {
    this.setData({
      goodsAmount : e.detail.value
    })
  },
  // 商品类型
  bindPickerChange: function (e) {
    this.setData({
      typeId : e.detail.value,
      type: this.data.typeArray[e.detail.value] 
    });
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
      }
    });
  },
  // 选择商品展示视频
  chooseGoodsVideo: function () {
    var that = this
    wx.chooseVideo({
      count: 1,            // 只能上传1个视频
      compressed: true,    // 视频压缩
      maxDuration: 15,     // 视频最长时间15秒
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          videoSrc: res.tempFilePath,
        })
      }
    });
  },
  // 发布商品
  formSubmit: function () {
    // 检测信息是否填写完整
    if(this.data.goodsName == '' || 
      this.data.typeId == '' ||
      this.data.goodsPrice == '' ||
      this.data.goodsAmount == '' ||
      this.data.imgList == '' ||
      this.data.goodsInfoList == '' ||
      this.data.videoSrc == '') {
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
      // 上传商品参数
      wx.request({
        url: that.data.urlPrefix + 'goods/uploadGoodsInfo.do',
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          'shopId': encodeURI(that.data.shopId),
          'typeId': encodeURI(that.data.typeId),
          'goodsName': encodeURI(that.data.goodsName),
          'goodsPrice': encodeURI(that.data.goodsPrice),
          'goodsAmount': encodeURI(that.data.goodsAmount)
        },
        success: function(res){
          if(res.statusCode == 200){
            // 获取刚插入数据的商品id
            that.setData({
              goodsId : res.data
            });          
            // 上传商品展示图
            for (var i = 0; i < imgList.length; i ++) {
              wx.uploadFile({
                url: that.data.urlPrefix + 
                'goods/uploadGoodsImg-' + that.data.goodsId,
                filePath: imgList[i],
                name: 'goodsImg',
                header: {
                  "Content-Type": "multipart/form-data"
                },
                success: function (res) {
                  if (res.statusCode == 200) {
                    // 上传商品详情图
                    for (var i = 0; i < goodsInfoList.length; i++) {
                      wx.uploadFile({
                        url: that.data.urlPrefix +
                          'goods/uploadGoodsImgInfo-' + that.data.goodsId,
                        filePath: goodsInfoList[i],
                        name: 'goodsImgInfo',
                        header: {
                          "Content-Type": "multipart/form-data"
                        },
                        success: function (res) {
                          if (res.statusCode == 200) {
                            // 上传商品展示视频
                            wx.uploadFile({
                              url: that.data.urlPrefix +
                                'goods/uploadGoodsVideo-' + that.data.goodsId,
                              filePath: that.data.videoSrc,
                              header: {
                                'content-type': 'multipart/form-data'
                              },
                              name: 'goodsVideo',
                              success: function (res) {
                                console.log("video")
                                if (res.statusCode == 200) {
                                  wx.showToast({
                                    title: '提交成功！',
                                    icon: 'success',
                                    duration: 1000
                                  });
                                  // 提交成功，返回前一页
                                  setTimeout(function () {
                                    wx.navigateBack({
                                      count: 1
                                    });
                                  }, 500);
                                  clearTimeout(); 
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
})