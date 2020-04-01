'use strict';
const Promise = require('utils/promise.js');
const updateManager = wx.getUpdateManager();
const APP_ID = 'wx48e0d4fac642d098'; //输入小程序appid    
const APP_SECRET = 'a2642ed366ec631e2977cda8b3174409'; //输入小程序app_secret    
var OPEN_ID = '' //储存获取到openid    
var SESSION_KEY = '' //储存获取到session_key
Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = App({
  globalData: {
    safeAreaInfo: {},
    userInfo: null,
    title: [],
    userCode: null,
    userId: null,
    OPEN_ID: null,
    userTel: null,
    netState: true
  },
  onLoad: function onLoad() {},
  //onLaunch: function onLaunch() {},
  onShow: function onShow() {
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType;
        console.log(networkType);
        if(networkType == 'unknown' || networkType == 'none'){
          that.globalData.netState = false;
        }
      }
    })

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })

  },
  onHide: function onHide() {},
  onLaunch: function() {

    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调

      console.log(res.hasUpdate)
    });

    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    });

    updateManager.onUpdateFailed(function() {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    });

    console.log("app:onlaunch execute");
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              //this.getUserId();
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  // getUserId: function() {
  //   var that = this;
  //   let tokenGet = wx.getStorageSync('token');
  //   if (tokenGet == null || tokenGet == '') {
  //     //第一次登录，获取登录状态
  //     that.getToken().then(function(res_t) {
  //       console.log(res_t); //此时token必然已经获取到，且getData()在此时才会执行
  //       that.getUserId_server();
  //     })
  //   } else {
  //     //有token的情况直接获取数据
  //     this.getUserId_server();
  //   }
  // },
  // getUserId_server: function() {
  //   var that = this;
  //   let tokenGetNew = wx.getStorageSync('token');
  //   console.log("//////////////////////////////////");
  //   console.log(tokenGetNew);
  //   console.log("avatarUrl: " + this.globalData.userInfo.avatarUrl);
  //   console.log("nickName: " + this.globalData.userInfo.nickName);
  //   console.log(tokenGetNew.openid);
  //   var openid = tokenGetNew.openid;
  //   console.log("openid:" + tokenGetNew.openid);
  //   var url_out = 'https://www.3firelink.xyz/smart_watch/user/openid/' + openid + '?userAgent=' + openid;
  //   console.log(url_out);
  //   wx.request({
  //     method: 'GET',
  //     url: url_out,
  //     success: function (u_res) {
  //       that.globalData.userTel = u_res.data.tel;
  //       wx.request({
  //         url: 'https://www.3firelink.xyz/smart_watch/user/newone',
  //         data: {
  //           tel: that.globalData.userTel,
  //           username: that.globalData.userInfo.nickName,
  //           openid: tokenGetNew.openid,
  //           nickname: that.globalData.userInfo.nickName,
  //           imageurl: that.globalData.userInfo.avatarUrl,
  //           userAgent: openid
  //         },
  //         method: 'POST',
  //         header: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //           'token': wx.getStorageSync('token')
  //         },
  //         success: function (e_res) {
  //           console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
  //           console.log(e_res);
  //           var url_out = 'https://www.3firelink.xyz/smart_watch/user/openid/' + openid + '?userAgent=' + openid;
  //           console.log(url_out);
  //           wx.request({
  //             method: 'GET',
  //             url: url_out,
  //             success: function (u_res) {
  //               console.log("获取用户ID(app.js)");
  //               console.log(u_res);
  //               that.globalData.userId = u_res.data.id;
  //               console.log("userId:" + that.globalData.userId);
  //             },
  //             fail: function (u_res_fail) {
  //               console.log("获取userid错误信息");
  //               console.log(u_res_fail);
  //             }
  //           })
  //         }
  //       });
  //     }
  //   })
  // },
  getToken: function() {
    let _this = this;
    return new Promise(function(resolve, reject) {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          var url_1 = 'https://www.3firelink.xyz/smart_watch/user/code/' + res.code;
          console.log("获取token的url：" + url_1);
          if (res.code) {
            wx.request({
              url: 'https://www.3firelink.xyz/smart_watch/user/code/' + res.code,
              data: {
                code: res.code
              },
              method: 'GET',
              success: res => {
                console.log("获取token:")
                wx.setStorageSync('token', res.data); //储存返回的token
                _this.globalData.OPEN_ID = res.data;
                console.log(res.data);
                console.log("globalData_openid:")
                console.log(_this.globalData.OPEN_ID);

                resolve(res);
              },
              fail: function(){
                reject('error');
              }


            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg);
            reject('error');
          }
         
        },
        fail: res => {
          reject('error');
        }
      })
    })
  }
})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC53eGEiXSwibmFtZXMiOlsiZ2xvYmFsRGF0YSIsIm9uTGF1bmNoIiwib25TaG93Iiwib25IaWRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFjSUEsY0FBWSxFO0FBQ1pDLFUsc0JBQVksQ0FBRyxDO0FBQ2ZDLFEsb0JBQVUsQ0FBRyxDO0FBQ2JDLFEsb0JBQVUsQ0FBRyIsImZpbGUiOiJhcHAud3hhIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbmZpZzoge1xuICAgICAgcGFnZXM6IFtdLFxuICAgICAgd2luZG93OiB7XG4gICAgICAgIGJhY2tncm91bmRUZXh0U3R5bGU6ICdkYXJrJyxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2VmZWZlZicsXG4gICAgICAgIG5hdmlnYXRpb25CYXJCYWNrZ3JvdW5kQ29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ01pbiDlsI/nqIvluo/npLrkvovpobnnm64nLFxuICAgICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiAnYmxhY2snXG4gICAgICB9LFxuICAgICAgbmV0d29ya1RpbWVvdXQ6IHtcbiAgICAgICAgcmVxdWVzdDogMTAwMDBcbiAgICAgIH1cbiAgICB9LFxuICAgIGdsb2JhbERhdGE6IHsgfSxcbiAgICBvbkxhdW5jaCAoKSB7IH0sXG4gICAgb25TaG93ICgpIHsgfSxcbiAgICBvbkhpZGUgKCkgeyB9XG4gIH0iXX0=