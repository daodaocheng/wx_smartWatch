// pages/robot/robot.js
var is_socketOpen = false;
const userInfo = getApp();
var app = getApp();
var t_talk = '';
var netState = app.globalData.netState;
var nums = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    talks:[],
    messData: "",
    headImage: userInfo,
    news_input_val: "",
    postion: 0,
    key: "POS",
    lastId: null, // 最后一条消息的ID
    notice: '当前网络不可用，请检查你的网络设置',
    showNotice: false,
    userId: app.globalData.userId
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        console.log(networkType);
        wx.onNetworkStatusChange(function (res) {
          console.log("网络连接状态：" + res.isConnected)
          console.log("网络类型：" + res.networkType)
          if (res.isConnected == false) {
            netState = false;
            that.setData({
              showNotice: true
            })
          } else {
            netState = true;
            that.setData({
              showNotice: false
            })
          }
        })
        if (networkType == 'unknown' || networkType == 'none') {
          netState = false;
        }
        console.log(netState)
        if (netState == false) {
          that.setData({
            showNotice: true
          })
        } else {
          that.setData({
            showNotice: false
          })
          that.data.talks = wx.getStorageSync('talks');
          wx.connectSocket({
            url: 'wss://www.3firelink.xyz/smart_watch/robot',
            success: function (res) {

            }
          });
          wx.onSocketMessage(function (res) {
            var data = res.data;
            var talks = [];
            talks = that.data.talks;
            that.data.userId = app.globalData.userId;
            console.log("userId:" + that.data.userId);
            if (data == '1') {
              console.log('初次链接');
              console.log(talks);
              ++nums;
              t_talk = 't_' + nums;
              that.setData({
                talks: [{
                  is_server: true,
                  mess: "我是焱飞小智能",
                  time: that.messageTime()
                }]
              });
              // var talksTemp = {
              //   is_server: true,
              //   mess: "我是焱飞小智能",
              //   time: that.messageTime()
              // }
              // talks.push(talksTemp);
              // that.setData({
              //   'talks': talks
              // });
              var selector = wx.createSelectorQuery();
              selector.select('#chat').boundingClientRect(function (res) {
                if (res.height > wx.getSystemInfoSync().windowHeight - 80) {
                  wx.pageScrollTo({
                    scrollTop: res.height
                  })
                }
              }).exec();
              wx.setStorageSync('talks', talks);
            } else {
              talks.push({
                is_server: true,
                mess: data,
                time: that.messageTime()
              });
              that.setData({
                'talks': talks
              });
              wx.setStorageSync('talks', talks);
              //页面滚动
              var selector = wx.createSelectorQuery();
              selector.select('#chat').boundingClientRect(function (res) {
                if (res.height > wx.getSystemInfoSync().windowHeight - 80) {
                  wx.pageScrollTo({
                    scrollTop: res.height
                  })
                }
              }).exec();
            }

          });
        }
      }
    })
  },
  bindChange: function(e) {
    //var dataMess =data.messData;
    this.setData({
      messData: e.detail.value
    });
  },
  send: function(e) {
    var dataSend = this.data.messData;
    var that = this;
    var t = that.data.talks;
    if (dataSend) {
      ++nums;
    }
    t_talk = 't_' + nums;
    t.push({
      is_server: false,
      mess: dataSend,
      time: that.messageTime(),
    });
    that.setData({
      'talks': t,
      news_input_val: "",
      postion: t.length,
      messData: "",
      lastId: t_talk
    });
    wx.setStorageSync('talks', t);
    wx.sendSocketMessage({
      data: dataSend
    });

    //页面滚动
    var selector = wx.createSelectorQuery();
    selector.select('#chat').boundingClientRect(function (res) {
      if (res.height > wx.getSystemInfoSync().windowHeight - 80) {
        wx.pageScrollTo({
          scrollTop: res.height
        })
      }
    }).exec();          
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.closeSocket({});
    this.data.postion = 0;
    this.data.talks = [];
    this.data.messData = "";
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

  },
  messageTime: function() {
    var date = new Date();
    var year = date.getFullYear();
    var mouth = parseInt(date.getMonth()+1);
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    return year + "/" + mouth + "/" + day + ":" + hour + ":" + minute;
  }
})