// pages/resetArea/resetArea.js
const app_safe = getApp();
var safeAreaInfoG = app_safe.globalData.safeAreaInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHiddenTip: true,
    modalHiddenSecond: true,
    tip: '',
    safeNum: 200,
    safeName: '',
    fence_id: null,
    userId: null,
    fence_name: null,
    addressDetail: '',
    addressLat: null,
    addressLon: null,
    showModal: false
  },
  onInputNumNew: function (e) {
    this.setData({
      safeNum: e.detail.value
    });
  },
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  modalChangeTip: function (e) {
    this.setData({
      modalHiddenTip: true,
      showModal: false
    });
  },
  modalChangeSecondCancle: function (e) {
    this.setData({
      modalHiddenSecond: true
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  modalChangeSecond: function () {
    var that = this;
    console.log("userId:" + app_safe.globalData.userId);
    //console.log("userId:" + userId);
    if (that.data.safeNum < 50) {
      that.setData({
        modalHiddenTip: false,
        showModal: true,
        tip: '安全半径最小应为50米！',
        safeNum: 50
      });
    } else if (that.data.safeNum > 500) {
      that.setData({
        modalHiddenTip: false,
        showModal: true,
        tip: '安全半径最大应为500米！',
        safeNum: 500
      });
    } else {
      console.log("reset_data")
      console.log(that.data.fence_id);
      console.log(that.data.userId);
      console.log(that.data.fence_name);
      console.log(that.data.safeNum);
      console.log(that.data.addressLat);
      console.log(that.data.addressLon);
      console.log(that.data.addressDetail);
      var openid = wx.getStorageSync('token').openid;
      console.log("重设安全区openid:" + openid);
      var url_update = 'https://www.3firelink.xyz/smart_watch/dev/updatefence?fence=' + that.data.fence_id + '&user=' + that.data.userId + '&name=' + that.data.fence_name + '&radius=' + parseInt(that.data.safeNum) + '&lat=' + that.data.addressLat + '&lon=' + that.data.addressLon + '&addr=' + that.data.addressDetail + '&userAgent=' + openid;
      console.log(url_update);
      wx.request({
        url: url_update,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        // data: {
        //   fence: that.data.fence_id,
        //   user: that.data.userId,
        //   name: that.data.fence_name,
        //   radius: that.data.safeNum,
        //   lat: that.data.addressLat,
        //   lon: that.data.addressLon,
        //   addr: that.data.addressDetail
        // },
        success: function (e) {
          console.log(e);
          that.setData({
            modalHiddenSecond: true,
          });
          safeAreaInfoG.lon = that.data.addressLon;
          safeAreaInfoG.lat = parseFloat(that.data.addressLat);
          safeAreaInfoG.radius = parseInt(that.data.safeNum);
          console.log(safeAreaInfoG);
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];   //当前页面
          var prevPage = pages[pages.length - 2];  //上一个页面
          console.log("pppppppppppppppppppppppp");
          prevPage.setData({
            safeAreaInfo: safeAreaInfoG
          });
          console.log(prevPage);
          wx.navigateBack({
            delta: 1,
          })
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      safeName: options.safeName,
      fence_id: options.fence,
      userId: options.user,
      fence_name: options.fence_name,
      addr: options.addr,
      addressDetail: options.addressDetail,
      addressLat: options.addressLat,
      addressLon: options.addressLon,
      modalHiddenSecond: false
    });
    console.log("this.data:");
    console.log(this.data);
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})