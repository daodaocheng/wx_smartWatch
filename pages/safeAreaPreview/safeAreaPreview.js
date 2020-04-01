// pages/safeAreaPreview/safeAreaPreview.js
const app_safe = getApp();
var cr = [];
var datatemp = {};
// var safeAreaInfoG = {
//   lon: 104.01356,
//   lat: 30.713158,
//   radius: 200,
//   id: 66
// }
var safeAreaInfoG = app_safe.globalData.safeAreaInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    safeAreaInfo: safeAreaInfoG,
    safeName: '',
    safeNum: 200,
    scale: 5,
    circle: [],
    marker: [],
    modalHiddenTip: true,
    modalHiddenSecond: true,
    tip: '',
    addressName: null,
    addressDetail: '',
    addressLat: null,
    addressLon: null,
    fence_id: null,
    userId: null,
    fence_name: null,
    addr: null
    //safeNum: this.data.safeAreaInfo.radius
  },

  onInputNum: function(e) {
    safeAreaInfoG.radius = e.detail.value;
    console.log(e);
  },
  onInputNumNew: function(e) {
    this.setData({
      safeNum: e.detail.value
    });
  },
  modalChangeTip: function(e) {
    var that = this;
    console.log("radius1:" + safeAreaInfoG.radius);
    if (safeAreaInfoG.radius < 50) {
      safeAreaInfoG.radius = 50;
    } else if (safeAreaInfoG.radius > 500) {
      safeAreaInfoG.radius = 500;
    }
    console.log("radius2:" + safeAreaInfoG.radius);
    this.setData({
      modalHiddenTip: true,
    });
    this.setData({
      safeAreaInfo: safeAreaInfoG
    });
    var openid = wx.getStorageSync('token').openid;
    console.log("更新围栏openid:" + openid);
    wx.request({
      url: 'https://www.3firelink.xyz/smart_watch/dev/updatefence',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        fence: that.data.fence_id,
        user: that.data.userId,
        name: that.data.fence_name,
        radius: safeAreaInfoG.radius,
        lat: safeAreaInfoG.lat,
        lon: safeAreaInfoG.lon,
        addr: that.data.addr,
        userAgent: openid
      },
      success: function(e) {
        console.log(e);
      }
    })
  },
  redius_btn: function(e) {
    var that = this;
    datatemp = this.data.circle[0];
    datatemp.radius = parseInt(safeAreaInfoG.radius);
    if (datatemp.radius < 50) {
      safeAreaInfoG.radius = 50;
      that.data.safeAreaInfo.radius = 50;
      datatemp.radius = 50;
      var res = new Array();
      res.push(datatemp);
      // console.log(res);
      this.setData({
        modalHiddenTip: false,
        tip: '安全半径最小应为50米！',
        'circle': res,
        safeNum: 50,
        safeAreaInfo: that.data.safeAreaInfo
      });
      wx.navigateTo({
        url: '../safeTip/safeTip?tip=' + that.data.tip,
      })
    } else if (datatemp.radius > 500) {
      safeAreaInfoG.radius = 500;
      that.data.safeAreaInfo.radius = 500;
      datatemp.radius = 500;
      var res = new Array();
      res.push(datatemp);
      // console.log(res);
      this.setData({
        modalHiddenTip: false,
        tip: '安全半径最大应为500米！',
        'circle': res,
        safeNum: 500,
        safeAreaInfo: that.data.safeAreaInfo
      });
      wx.navigateTo({
        url: '../safeTip/safeTip?tip=' + that.data.tip,
      })
    } else {
      var res = new Array();
      res.push(datatemp);
      // console.log(res);
      this.setData({
        'circle': res
      });
      console.log("this.data.circle:");
      console.log(that.data.fence_id);
      console.log(that.data.userId);
      console.log(that.data.fence_name);
      console.log(safeAreaInfoG.radius);
      console.log(safeAreaInfoG.lon);
      console.log(safeAreaInfoG.lat);
      console.log(that.data.addr);
      var openid = wx.getStorageSync('token').openid;
      console.log("更新围栏openid:" + openid);
      var url_update = 'https://www.3firelink.xyz/smart_watch/dev/updatefence?fence=' + that.data.fence_id + '&user=' + that.data.userId + '&name=' + that.data.fence_name + '&radius=' + safeAreaInfoG.radius + '&lat=' + safeAreaInfoG.lat + '&lon=' + safeAreaInfoG.lon + '&addr=' + that.data.addr + '&userAgent=' + openid;
      wx.request({
        url: url_update,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (e) {
          console.log(e);
          console.log()
        }
      });
    }
  },
  reset_btn: function(e) {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          safeName: safeAreaInfoG.name,
          addressName: res.name,
          addressDetail: res.address,
          addressLat: res.latitude,
          addressLon: res.longitude,
        });
        console.log("addressName:" + that.data.addressName + "  address:" + that.data.addressDetail + "  addressLat:" + that.data.addressLat + "  addressLon:" + that.data.addressLon);
        // that.setData({
        //   modalHiddenSecond: false,
        // });
        console.log("safeName:" + that.data.safeName);
        wx.navigateTo({
          url: '../resetArea/resetArea?safeName=' + that.data.safeName + '&fence=' + that.data.fence_id + '&user=' + getApp().globalData.userId + '&fence_name=' + that.data.fence_name + '&addr=' + that.data.addr + '&addressDetail=' + that.data.addressDetail + '&addressLat=' + that.data.addressLat + '&addressLon=' + that.data.addressLon,
        });
      },
    });
  },
  modalChangeSecondCancle: function(e) {
    this.setData({
      modalHiddenSecond: true
    })
  },
  modalChangeSecond: function() {
    var that = this;
    console.log("safeName:" + app_safe.globalData.userId);
    //console.log("userId:" + userId);
    if (that.data.safeNum < 50) {
      that.setData({
        modalHiddenTip: false,
        tip: '安全半径最小应为50米！',
        safeNum: 50
      });
    } else if (that.data.safeNum > 500) {
      that.setData({
        modalHiddenTip: false,
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
      console.log("更新围栏openid:" + openid);
      wx.request({
        url: 'https://www.3firelink.xyz/smart_watch/dev/updatefence?userAgent=' + openid,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          fence: that.data.fence_id,
          user: that.data.userId,
          name: that.data.fence_name,
          radius: that.data.safeNum,
          lat: that.data.addressLat,
          lon: that.data.addressLon,
          addr: that.data.addressDetail
        },
        success: function(e) {
          console.log(e);
          that.setData({
            modalHiddenSecond: true
          });
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("1111111111111111");
    console.log(options);
    // var circle ='circle';
    var that = this;
    this.setData({
      fence_id: options.fence,
      userId: options.user,
      fence_name: options.fence_name,
      addr: options.addr,
    });
    console.log("fence_id:" + that.data.fence_id);
    console.log("userId:" + that.data.userId);
    // console.log(safeAreaInfoG);
    //console.log("radius:" + safeNum.radius);
    //console.log(circle);
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
    cr = [{
      latitude: safeAreaInfoG.lat,
      longitude: safeAreaInfoG.lon,
      radius: safeAreaInfoG.radius,
      strokeWidth: 0.1,
      fillColor: '#84C1FF88',
      color: '#46A3FF'
    }];
    var mk = [{
      latitude: safeAreaInfoG.lat,
      longitude: safeAreaInfoG.lon,
      id: safeAreaInfoG.id
    }];
    this.setData({
      'circle': cr,
      'marker': mk,
      safeAreaInfo: safeAreaInfoG
    })
    console.log(cr);
    console.log("safeAreaInfo:")
    console.log(this.data.safeAreaInfo);
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