// pages/accessLog/accessLog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleLog:[],
    devid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var devid=options.devid;
    this.setData({
      'devid':devid
    });
    console.log(devid);
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
      'titleLog': []
    });
    var openid = wx.getStorageSync('token').openid;
    console.log("出入记录openid:" + openid);
    var url_get = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/user/' + wx.getStorageSync('userid') + '?userAgent=' + openid;
    console.log(wx.getStorageSync('userid'));
    console.log(url_get);
    wx.request({
      url: url_get,
      method:'GET',
      success:function(res){
        console.log('出入记录');
        console.log(res);
        var out = new Array();
        for(var i=0;i<res.data.length;i++){
          if (res.data[i].gmt_create){
            var date = new Date(res.data[i].gmt_create);
            out.push({
              dateAndTime: date.getFullYear() + '年' + parseInt(date.getMonth()+1) + '月' + date.getDate() + '日  ' + date.getHours() + '时' + date.getMinutes() + '分',
              relation: res.data[i].ship,
              state: res.data[i].type,
              safeName: res.data[i].fence_name
            });
          }
        } 
        that.setData({
          'titleLog': out
        });
        console.log('出入记录结果集');
        console.log(that.data.titleLog);
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