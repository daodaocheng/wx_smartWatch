// pages/fallLog/fallLog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleFallLog: [],
    devid: ''
  },

  onLoad: function (options) {
    var devid = options.devid;
    this.setData({
      'devid':devid
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
    var that = this;
    that.setData({
      'titleFallLog': []
    });
    console.log(that.data.titleFallLog);
    var openid = wx.getStorageSync('token').openid;
    console.log("摔倒报警openid:" + openid);
    var userId = wx.getStorageSync('userid');
    var url_get = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/user/' + userId + '/trip?userAgent=' + openid;
    console.log(url_get);
    wx.request({
      url: url_get,
      success: function (e) {
        var res = new Array();
        var data = e.data;
        for (var i = 0; i < data.length; i++) {
          var date = new Date(data[i].gmt_create);
          res.push({
            time: date.getFullYear() + '/' + parseInt(date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes(),
            ship: data[i].ship,
            addr: data[i].addr
          });
        }
        that.setData({
          'titleFallLog': res
        });
      }
    })
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