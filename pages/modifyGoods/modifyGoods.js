// pages/modifyGoods/modifyGoods.js

// 获取小程序实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlPrefix: '',
    goodsId: '',
    goodsName: '',
    type: '',
    typeId: '',
    typeArray: ['电脑', '手机', '外设'],
    status: '',
    goodsStatus: '',
    allGoodsStatus: ['待审核','已上架','已下架','未通过','已删除'],
    statusArray: ['下架'],
    goodsPrice: '',
    goodsAmount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      urlPrefix : app.globalData.urlPrefix,
      goodsId : options.goodsId
    });
    var that = this;
    wx.request({
      url: that.data.urlPrefix + 'goods/showGoods-' + that.data.goodsId,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var result = res.data;
        console.log("结果"+JSON.stringify(result));
        if(res.statusCode == 200) {
          that.setData({
            goodsName : result.goodsName,
            type: that.data.typeArray[result.typeId],
            typeId: result.typeId,
            status: that.data.allGoodsStatus[result.goodsStatus],
            goodsStatus: result.goodsStatus,
            goodsPrice: result.goodsPrice,
            goodsAmount: result.goodsAmount
          });
        }
      }
    })
  },
  // 商品标题
  goodsNameInput: function (e) {
    this.setData({
      goodsName: e.detail.value
    })
  },
  // 商品价格
  goodsPriceInput: function (e) {
    this.setData({
      goodsPrice: e.detail.value
    })
  },
  // 商品库存
  goodsAmountInput: function (e) {
    this.setData({
      goodsAmount: e.detail.value
    })
  },
  // 商品类型
  bindPickerChange: function (e) {
    this.setData({
      typeId: e.detail.value,
      type: this.data.typeArray[e.detail.value]
    });
  },
  // 商品状态
  statusChange: function (e) {
    console.log("状态：" + e.detail.value);
    this.setData({
      goodsStatus: e.detail.value,
      status: this.data.statusArray[e.detail.value]
    });
    // 商家将商品状态设置为下架
    if(e.detail.value) {
      this.setData({
        goodsStatus: 2
      });
    }
  },
  // 提交已修改商品
  submitGoods: function () {
    if (this.data.goodsName == '' ||
      this.data.typeId == '' ||
      this.data.goodsPrice == '' ||
      this.data.goodsAmount == '') {
        wx.showToast({
          title: '请填写完整！',
          icon: 'loading',
          duration: 1000
        });
      } else {
        var that = this;
        // 上传已修改的商品参数
        wx.request({
          url: that.data.urlPrefix + 'goods/operateGoods-updateGoods-' + that.data.goodsId,
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: {
            'goodsName': encodeURI(that.data.goodsName),
            'goodsPrice': encodeURI(that.data.goodsPrice),
            'goodsAmount': encodeURI(that.data.goodsAmount),
            'typeId': encodeURI(that.data.typeId),
            'goodsStatus': encodeURI(that.data.goodsStatus) 
          },
          success: function (res) {
            // console.log(that.data.goodsName + "," + that.data.goodsPrice + "," + that.data.goodsAmount + "," + that.data.typeId + "," + that.data.goodsStatus)
            if (res.statusCode == 200) {
              wx.showToast({
                title: '修改成功！',
                icon: 'success',
                duration: 1000
              });
              setTimeout(function () {
                wx.navigateBack({
                  count: 1
                });
              }, 500);
              clearTimeout();  
            } else {
              wx.showToast({
                title: '提交失败',
                icon: 'loading',
                duration: 1000
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
  },
  // 删除商品
  deleteGoods: function () {
    var that = this;
    wx.showModal({
      title: '您确定要删除该商品吗？',
      content: '此操作不可恢复！',
      showCancel: true,
      success: function (e) {
        //点击确定
        if (!e.cancel) {
          console.log("SUCCESS");
          // 删除商品请求
          wx.request({
            url: that.data.urlPrefix + 'goods/operateGoods-deleteGoods-' + that.data.goodsId,
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if(res.statusCode == 200) {
                wx.showToast({
                  title: '删除成功！',
                  icon: 'success',
                  duration: 1000
                });
                setTimeout(function () {
                  wx.navigateBack({
                    count: 1
                  });
                }, 500);
                clearTimeout();  
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'loading',
                  duration: 1000
                });
              }
            },
            fail: function (res) {
              wx.showToast({
                title: '删除失败',
                icon: 'loading',
                duration: 1000
              });
            }
          });
        }
      }
    });
  }
})