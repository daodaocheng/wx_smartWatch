"use strict";
var qqmapsdk;
var app = getApp();
var netState = app.globalData.netState;
var markers = new Array();
var mapAble = 'mapAble';
var loc = 'markers';
exports.default = Page({
  data: {
    scale: 12,
    mapAble: true,
    jumper: {},
    userLocation: {},
    markers: [],
    controls: [{
      id: 1,
      iconPath: '/assets/pos.png',
      position: {
        top: wx.getSystemInfoSync().windowHeight - 100,
        left: 15,
        width: 35,
        height: 35
      },
      clickable: true
    }],
    token: null,
    notice: '当前网络不可用，请检查你的网络设置',
    showNotice: false
  },
  getUserId: function() {
    var that = this;
    let tokenGet = wx.getStorageSync('token');
    console.log("ggggggggggggggggggggggggggggg");
    console.log(tokenGet);
    var openid = tokenGet.openid;
    var url_out = 'https://www.3firelink.xyz/smart_watch/user/openid/' + openid + '?userAgent=' +openid;
    console.log(url_out);
    wx.request({
      method: 'GET',
      url: url_out,
      success: function(u_res) {
        console.log("获取用户ID");
        console.log(u_res);
        if (u_res.data != null){
          app.globalData.userId = u_res.data.id;
          wx.setStorageSync('userid', u_res.data.id);
          console.log("userId_storage" + wx.getStorageSync('userid'));
          console.log("userId:" + app.globalData.userId);
          var openid = wx.getStorageSync('token').openid;
          console.log("获取标记点位置openid:" + openid);
          var url_pos = 'https://www.3firelink.xyz/smart_watch/user/id/' + app.globalData.userId + '/devstatus' + '?userAgent=' + openid;
          console.log("url_pos:" + url_pos);
          wx.request({
            url: url_pos,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
              console.log(data);
              markers = data.data;
              console.log(markers);
              that.setData({
                [mapAble]: true,
                [loc]: markers
              });
            }
          });
        }
      },
      fail: function(u_res_fail) {
        console.log("获取userid错误信息");
        console.log(u_res_fail);
      }
    })
  },
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
          }else{
            netState = true;
            that.setData({
              showNotice: false
            })
          }
        })
        if (networkType == 'unknown' || networkType == 'none') {
          netState = false;
        }
        console.log("home.onShow执行")
        console.log(netState)
        if (netState == false) {
          that.setData({
            showNotice: true
          })
        } else {
          that.setData({
            showNotice: false
          })
          wx.getLocation({
            success: function (res) {
              var lat = 'userLocation.lat';
              var lon = 'userLocation.lon';
              let token = wx.getStorageSync('token');
              that.setData({
                token: token
              })
              if (token == null || token == '') {
                //第一次登录，获取登录状态
                app.getToken().then(function (res_t) {
                  console.log(res_t); //此时token必然已经获取到，且getData()在此时才会执行
                  that.getUserId();
                });
              } else {
                //有token的情况直接获取数据
                that.getUserId();
              }
              that.setData({
                [lat]: res.latitude,
                [lon]: res.longitude
              });
            },
            fail: function (e) {
              that.setData({
                showNotice: true
              })
            }
          })
        }
      }
    })
  },
  onLoad: function onLoad(options) {

  },
  regionChange:function(e){
    console.log("视野改变");
    var that = this;
    var mapContext = wx.createMapContext(mapAble, this);
    mapContext.getScale({
      success: function(res){
        console.log(res.scale);
        that.data.scale = res.scale;
        that.scaleLog();
      }
    })
  },
  scaleLog:function(e){
    wx.reportAnalytics('home_map_scale', {
      scale_value: this.data.scale,
      int_user_id: app.globalData.userId,
    });
  },
  controltap: function(e) {
    var that = this;
    wx.getLocation({
      success: function(res) {
        var lat = 'userLocation.lat';
        var lon = 'userLocation.lon';
        var map = 'mapAble';
        var markers = new Array();
        var loc = 'markers';
        var s = 'scale';
        var openid = wx.getStorageSync('token').openid;
        console.log("获取标记点位置openid:" + openid);
        wx.request({
          url: 'https://www.3firelink.xyz/smart_watch/user/id/' + app.globalData.userId + '/devstatus?userAgent=' + openid,
          method: 'GET',
          dataType: 'json',
          success: function(data) {
            console.log(data);
            markers = data.data;
            that.setData({
              [map]: true,
              [loc]: markers
            });
          }
        });
        that.setData({
          [lat]: res.latitude,
          [lon]: res.longitude,
          [s]: 12
        });
      }
    })
  }
});