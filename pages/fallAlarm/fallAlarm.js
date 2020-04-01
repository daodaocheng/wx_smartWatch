// pages/fallAlarm/fallAlarm.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrow: {
      type: Boolean,
      value: true // 是否显示箭头
    },
    mode: {
      type: String,
      value: 'normal' // 有边框和无边框 normal, none
    },
    notifytel: '',
    devid: '',
    input: '',
    showFailModal: true,
    loadHidden: true,
    toastHidden: true,
    toastTip: '',
    userId: app.globalData.userId
  },
  notifytel: function(e) {
    var tel = e.detail.value;
    this.data.input = tel + '';
    console.log("input:" + this.data.input);
    this.data.notifytel = this.data.input;
  },
  modalFailChangeTip: function () {
    this.setData({
      showFailModal: true
    })
  },
  confirm: function() {
    var that = this;
    //this.data.notifytel = this.data.input;
    console.log('confirm')
    console.log(that.data.notifytel);
    console.log("load:" + that.data.loadHidden);
    if ('' == that.data.notifytel || that.data.notifytel.length != 11){
      that.setData({
        showFailModal: false,
        tip: '请输入正确的手机号!'
      })
    }else{
      that.setData({
        loadHidden: false
      });
      setTimeout(function () {
        if (that.data.loadHidden == false) {
          that.setData({
            showFailModal: false,
            tip:'后台响应失败'
          })
        }
        that.setData({
          loadHidden: true
        })
      }, 35000);
      var openid = wx.getStorageSync('token').openid;
      console.log("摔倒报警openid:" + openid);
      var url_alarm = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/newsostel?userAgent=' + openid + '&tel=' + that.data.notifytel;
      console.log(url_alarm);
      wx.request({
        url: url_alarm,
        method: 'POST',
        // data: {
        //   tel: that.data.notifytel
        // },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res);
          var t = res.data;
          if ('1' == t) {
            that.setData({
              loadHidden: true,
              toastTip: '成功修改摔倒通知手机号!',
              toastHidden: false
            });
          } else if ('0' == t) {
            that.setData({
              loadHidden: true,
              showFailModal: false,
              tip: '后台响应失败'
            })
          }
        },
        fail: function (res_fail) {
          console.log(res_fail);
          that.setData({
            loadHidden: true,
            showFailModal: false,
            tip:'后台响应失败'
          })
        }
      })
    }
  },
  toastChange: function () {
    this.setData({
      toastHidden: true
    })
  },
  onClickLog: function() {
    wx.navigateTo({
      url: '../fallLog/fallLog?devid=' + this.data.devid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var devid = options.devid;
    var that = this;
    var openid = wx.getStorageSync('token').openid;
    console.log("摔倒报警openid:" + openid);
    wx.request({
      url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + devid + '/sostel?userAgent=' + openid,
      method: 'GET',
      success: function(e) {
        console.log(e);
        var tel = e.data;
        that.setData({
          notifytel: tel[0],
          'devid': devid
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})