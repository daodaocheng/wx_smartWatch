// pages/safeArea/safeArea.js
const app_safe = getApp();
var userId = app_safe.globalData.userId;
var safeAreaInfoG = app_safe.globalData.safeAreaInfo;
var marker_id = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressName: null,
    addressDetail: '',
    addressLat: null,
    addressLon: null,
    titleArea: [],
    safeName: '',
    safeNum: 200,
    modalHiddenSecond: true,
    devid: null,
    userId: userId,
    hideModal: true,
    showModal: false,
    modalHiddenTip: true,
    modalHiddenDelete: true,
    fence_id: 0,
    tip: ''
  },
  showMapLocation: function(e) {
    var that = this;
    var name = e.currentTarget.dataset.name;
    var radius = e.currentTarget.dataset.radius;
    var lat = e.currentTarget.dataset.lat;
    var lon = e.currentTarget.dataset.lon;
    var fence_id = e.currentTarget.dataset.fence_id;
    var addr = e.currentTarget.dataset.addr;
    safeAreaInfoG.name = name;
    safeAreaInfoG.radius = radius;
    safeAreaInfoG.lat = lat;
    safeAreaInfoG.lon = lon;
    console.log("经度：" + safeAreaInfoG.lon);
    console.log("纬度：" + safeAreaInfoG.lat);
    safeAreaInfoG.id = e.currentTarget.dataset.fence_id;
    var url_preview = '../../pages/safeAreaPreview/safeAreaPreview?fence=' + fence_id + '&user=' + getApp().globalData.userId + '&fence_name=' + name + '&addr=' + addr;
    wx.navigateTo({
      url: url_preview
    });
    console.log(url_preview);
  },
  bindTouchStart: function(e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function(e) {
    this.endTime = e.timeStamp;
  },
  bingLongTap: function(e) {
    console.log("长按");
    this.setData({
      modalHiddenDelete: false,
      fence_id: e.currentTarget.dataset.fence_id
    });
    console.log(e);
  },
  onInputName: function(e) {
    this.setData({
      safeName: e.detail.value
    });
    //console.log("e:"+ ralation);
  },
  onInputNum: function(e) {
    this.setData({
      safeNum: e.detail.value
    });
  },
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  modalChangeTip: function(e) {
    this.setData({
      modalHiddenTip: true
    });
  },
  modalChangeDelete: function (e) {
    var that = this;
    var openid = wx.getStorageSync('token').openid;
    console.log("删除围栏openid:" + openid);
    wx.request({
      url: 'https://www.3firelink.xyz/smart_watch/dev/delfence/' + that.data.fence_id + '?userAgent=' + openid,
      method: 'DELETE',
      success: function (res_del) {
        console.log(res_del);
        if (res_del.data == 1) {
          for (var i in that.data.titleArea) {
            console.log(that.data.titleArea[i].fence_id);
            if (that.data.titleArea[i].fence_id == that.data.fence_id) {
              console.log(that.data.titleArea[i].fence_id);
              that.data.titleArea.splice(i, 1);
            } else {
              console.log("找不到devid");
            }
          }
        }
        that.setData({
          'titleArea': that.data.titleArea,
          modalHiddenDelete: true
        });
        console.log(that.data.titleArea);
      }
    });
    that.setData({
      modalHiddenDelete: true
    });
  },
  modalChangeSecondCancle: function(e) {
    this.setData({
      modalHiddenSecond: true
    })
  },
  modalChangeDeleteCancle: function (e) {
    this.setData({
      modalHiddenDelete: true
    })
  },
  onAdd: function() {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          addressName: res.name,
          addressDetail: res.address,
          addressLat: res.latitude,
          addressLon: res.longitude,
        });
        marker_id++;
        console.log("addressName:" + that.data.addressName + "  address:" + that.data.addressDetail + "  addressLat:" + that.data.addressLat + "  addressLon:" + that.data.addressLon);
        that.setData({
          modalHiddenSecond: false,
        });
      },
    });
  },
  onLog:function(){
    wx.navigateTo({
      url: '/pages/accessLog/accessLog?devid='+this.data.devid,
    })
  },
  modalChangeSecond: function() {
    var that = this;
    console.log("safeName:" + app_safe.globalData.userId);
    console.log("userId:" + userId);
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
    } else if (that.data.safeName == null || that.data.safeName == ''){
      that.setData({
        modalHiddenTip: false,
        tip: '安全区名称不能为空！',
      })
    } else {
      var openid = wx.getStorageSync('token').openid;
      console.log("新建围栏openid:" + openid);
      wx.request({
        data: {
          user: app_safe.globalData.userId,
          radius: that.data.safeNum,
          lat: that.data.addressLat,
          lon: that.data.addressLon,
          dev: that.data.devid,
          name: that.data.safeName,
          addr: that.data.addressDetail,
          userAgent: openid
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        url: 'https://www.3firelink.xyz/smart_watch/dev/newfence',
        success: function(res_safe) {
          console.log('1111111111111111111111111')
          console.log(res_safe);
          var openid = wx.getStorageSync('token').openid;
          console.log("获取围栏openid:" + openid);
          wx.request({
            method: 'GET',
            url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/fences?userAgent=' + openid,
            success: function(res_safe_out) {
              that.setData({
                'safeName':''
              });
              console.log(res_safe_out);
              var count = res_safe_out.data.length;
              var showArray=[];
              for (var i = 0; i < count; i++) {
                var lat = res_safe_out.data[i].middle_point.substring(0, res_safe_out.data[i].middle_point.indexOf(';'));
                var lon = res_safe_out.data[i].middle_point.substring(res_safe_out.data[i].middle_point.indexOf(';') + 1, res_safe_out.data[i].middle_point.length);
                console.log("lat:" + lat + "lon:" + lon);
                var newArray = [{
                  fence_id: res_safe_out.data[i].id,
                  title: res_safe_out.data[i].fence_name,
                  detail: res_safe_out.data[i].addr,
                  desc: res_safe_out.data[i].radius,
                  src: '../../assets/home.png',
                  dot: false,
                  dotColor: '#fff',
                  arrow: false,
                  mode: 'normal',
                  marker_id: i,
                  lat: parseFloat(lat),
                  lon: parseFloat(lon),
                }];
                marker_id = newArray.marker_id;
                showArray = showArray.concat(newArray);
              }
              that.setData({
                'titleArea': showArray,
                modalHiddenSecond: true
              });
              console.log(that.data.titleArea);
            }
          });
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      devid: options.devid,
    });
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
    var that = this;
    console.log("userId:" + that.data.userId);
    that.setData({
      'titleArea': []
    });
    console.log("devid2:" + that.data.devid);
    var openid = wx.getStorageSync('token').openid;
    console.log("获取围栏openid:" + openid);
    wx.request({
      method: 'GET',
      url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + this.data.devid + '/fences?userAgent=' + openid,
      success: function (res_safe_out) {
        console.log("res_safe_out:");
        console.log(res_safe_out);
        var count = res_safe_out.data.length;
        console.log("count:" + count);
        for (var i = 0; i < count; i++) {
          var lat = res_safe_out.data[i].middle_point.substring(0, res_safe_out.data[i].middle_point.indexOf(';'));
          var lon = res_safe_out.data[i].middle_point.substring(res_safe_out.data[i].middle_point.indexOf(';') + 1, res_safe_out.data[i].middle_point.length);
          console.log("lat:"+lat+"lon:"+lon);
          var newArray = [{
            fence_id: res_safe_out.data[i].id,
            title: res_safe_out.data[i].fence_name,
            detail: res_safe_out.data[i].addr,
            desc: res_safe_out.data[i].radius,
            src: '../../assets/home.png',
            dot: false,
            dotColor: '#fff',
            arrow: false,
            mode: 'normal',
            // lat: lat,
            // lon: lon,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            marker_id: i
          }];
          marker_id = newArray.marker_id;
          console.log("titleArea:")
          that.data.titleArea = that.data.titleArea.concat(newArray);
          console.log(that.data.titleArea);
          that.setData({
            'titleArea': that.data.titleArea
          });
        }
      }
    });
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