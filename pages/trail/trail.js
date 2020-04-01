// pages/trail/trail.js
var app = getApp();
var date = new Date();
var mapTrail = 'mapTrail'
var month = parseInt(date.getMonth() + 1);
Page({
  /**
   * 页面的初始数据
   */
  data: {
    polyline: [],
    markers: [],
    srartPos: {},
    controls: [{
      id: 1,
      iconPath: '/assets/pos.png',
      position: {
        top: wx.getSystemInfoSync().windowHeight * 0.90 - 50,
        left: 15,
        width: 35,
        height: 35
      },
      clickable: true,
    }],
    calendar: new Date().getFullYear() + '年' + month + '月' + new Date().getDate() + '日',
    locked: {
      type: String,
      value: "hide"
    },
    animationMode: {
      type: String,
      value: 'none'
    },
    align: {
      type: String,
      value: 'center'
    },
    maskStatus: 'hide',
    zIndex: 1000,
    showView: false,
    showModal: false,
    days_style: [],
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1, // 月份
    day: new Date().getDate(),
    dateShow: '',
    devid: null,
    userLocation: {},
    scale: 18
  },
  regionChangeTrail: function (e) {
    console.log("视野改变");
    var that = this;
    var mapContext = wx.createMapContext(mapTrail, this);
    mapContext.getScale({
      success: function (res) {
        console.log(res.scale);
        that.data.scale = res.scale;
        that.scaleLog();
      }
    })
  },
  scaleLog: function (e) {
    wx.reportAnalytics('trail_map_scale', {
      trail_scale_value: this.data.scale,
      int_user_id: app.globalData.userId,
    });
  },
  calendar: function() {
    var that = this;
    that.setData({
      showView: true,
      showModal: true,
      year: that.data.year,
      month: that.data.month,
      day: that.data.day,
    });
    let days_style = new Array;
    days_style.push({
      month: 'current',
      day: that.data.day,
      color: '#314580',
      background: '#69c7f5'
    });
    that.setData({
      days_style: days_style
    });
    console.log(that.data);
    // wx.navigateTo({
    //   url: '../calendar/calendar',
    // })
  },
  showMask: function showMask() {
    this.setData({
      maskStatus: 'show'
    });
  },
  hideModal: function() {
    this.setData({
      showView: false,
      showModal: false,
      calendar: this.data.year + '年' + this.data.month + '月' + this.data.day + '日',
      dateShow: this.data.year + '-' + this.data.month + '-' + this.data.day,
    });
    console.log("dateShow:" + this.data.dateShow);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var that = this;
    // wx.getLocation({
    //   success: function (res) {
    //     var lat = 'userLocation.lat';
    //     var lon = 'userLocation.lon';
    //     let token = wx.getStorageSync('token');
    //     that.setData({
    //       [lat]: res.latitude,
    //       [lon]: res.longitude
    //     });
    //   }
    // })
    this.setData({
      devid: options.devid,
    });
    //console.log("dateShow:" + that.data.dateShow);
    // this.drawPolyline();
  },
  refresh: function(options) {
    this.drawPolyline();
    var that = this;
    wx.getLocation({
      success: function(res) {
        console.log(res);
        var lat = 'userLocation.lat';
        var lon = 'userLocation.lon';
        var map = 'mapAble';
        // var markers = new Array();
        // var loc = 'markers';
        // var s = 'scale';
        that.setData({
          [lat]: res.latitude,
          [lon]: res.longitude,
          // [s]: 11
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
    var that = this;
    that.setData({
      polyline: [],
      markers: []
    })
    
    this.drawPolyline();
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

  },
  drawPolyline: function() {
    var that = this;
    that.setData({
      calendar: this.data.year + '年' + this.data.month + '月' + this.data.day + '日',
      dateShow: this.data.year + '-' + this.data.month + '-' + this.data.day,
      showView: false,
      showModal: false,
      polyline: [],
      markers: []
    })
    if (that.data.month < 10) {
      that.setData({
        dateShow: that.data.year + '-' + '0' + that.data.month + '-' + that.data.day
      });
    }
    if (that.data.day < 10) {
      that.setData({
        dateShow: that.data.year + '-' + that.data.month + '-' + '0' + that.data.day
      });
    }
    if (that.data.day < 10 && that.data.month < 10) {
      that.setData({
        dateShow: that.data.year + '-' + '0' + that.data.month + '-' + '0' + that.data.day
      });
    }
    console.log("dateShow:" + that.data.dateShow);
    var openid = wx.getStorageSync('token').openid;
    console.log("绘制轨迹openid:" + openid);
    var url = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/st/' + that.data.dateShow + '/et/0/pos?userAgent=' + openid;
    wx.request({
      url: url,
      success: function(res) {
        console.log(url);
        console.log(res);
        var postions = new Array();
        var markers = new Array();
        var callout = new Array();
        var data = res.data;
        var len = data.length;
        var i = 0;
        var lon = "srartPos.lat";
        var lat = "srartPos.lon";
        console.log('数据数量：'+len);
        var preTemp = null;
        for (; i < len; i++) {
          console.log('添加线点');
          if (preTemp == null){
            preTemp = data[i].lng+''+ data[i].lat;
            postions.push({
              "longitude": data[i].lng,
              "latitude": data[i].lat
            });
          }else{
            var t=data[i].lng + '' + data[i].lat;
            if (preTemp !=t){
              preTemp=t;
              postions.push({
                "longitude": data[i].lng,
                "latitude": data[i].lat
              });
            }
          }
          
          if (i == (len - 1)) {
            that.setData({
              [lat]: data[i].lng,
              [lon]: data[i].lat
            });
            console.log('中心点位置');
            console.log(that.data.srartPos);
          }
        }
        console.log("处理后点数：")
        console.log(postions.length);
        if(len<1){
          wx.getLocation({
            success: function (res) {
              console.log("rrrrrrrrrrrrrrrrr")
              var lat1 = 'srartPos.lat';
              var lon1 = 'srartPos.lon';
              that.setData({
                [lat1]: res.latitude,
                [lon1]: res.longitude
              });
            }
          })
        }

        if (data.length != 0) {
          markers.push({
            "longitude": data[0].lng,
            "latitude": data[0].lat
          });
          markers.push({
            "longitude": data[len - 1].lng,
            "latitude": data[len - 1].lat
          });
          callout.push({
            "content": "起点",
            "color": "#FFFFFF",
            "fontSize": 15,
            "bgColor": "#2681d7",
            "display": "ALWAYS",
            "padding": 4,
            "borderRadius": 10,
            "textAlign": "center"
          });
          callout.push({
            "content": "终点",
            "color": "#FFFFFF",
            "fontSize": 15,
            "bgColor": "#2681d7",
            "display": "ALWAYS",
            "padding": 4,
            "borderRadius": 10,
            "textAlign": "center"
          });
          var polyline = "polyline";
          that.setData({
            [polyline]: [{
              points: postions,
              color: "#ff6600",
              width: 3,
              dottedLine: false,
              arrowLine: true,
              borderColor: "#000",
              borderWidth: 2
            }],
            markers: [{
                latitude: markers[0].latitude,
                longitude: markers[0].longitude,
                callout: callout[0]
              },
              {
                latitude: markers[1].latitude,
                longitude: markers[1].longitude,
                callout: callout[1]
              }
            ]
          });
        }
        console.log(that.data);
      }
    })
  },
  dayClick: function(event) {
    console.log(event.detail);
    let days_style = new Array;
    days_style.push({
      month: 'current',
      day: event.detail.day,
      color: '#314580',
      background: '#69c7f5'
    });
    this.setData({
      days_style: days_style,
      calendar: event.detail.year + '年' + event.detail.month + '月' + event.detail.day + '日',
      calendar2: event.detail.year + '年' + event.detail.month + '月' + event.detail.day + '日',
      calendar3: event.detail.year + '年' + event.detail.month + '月' + event.detail.day + '日',
      year: event.detail.year,
      month: event.detail.month,
      day: event.detail.day,
      showView: false,
      showModal: false,
    });
    this.setData({
      dateShow: this.data.year + '-' + this.data.month + '-' + this.data.day
    })
    this.drawPolyline();
    //console.log(this.data.days_style);
  },
  dateChange: function(event) {
    console.log(event.detail);
    this.setData({
      calendar: '',
      year: event.detail.currentYear,
      month: event.detail.currentMonth,
    });
    let days_style = new Array;
    days_style.push({
      month: 'current',
      day: this.data.day,
      color: '#314580',
      background: '#69c7f5'
    });
    this.drawPolyline();
    console.log(this.data);
  },
  next: function(event) {
    console.log(event.detail);
    this.setData({
      calendar: '',
      year: event.detail.currentYear,
      month: event.detail.currentMonth,
    });
    let days_style = new Array;
    days_style.push({
      month: 'current',
      day: this.data.day,
      color: '#314580',
      background: '#69c7f5'
    });
    this.drawPolyline();
    console.log(this.data);
  },
  prev: function(event) {
    console.log(event.detail);
    this.setData({
      calendar: '',
      year: event.detail.currentYear,
      month: event.detail.currentMonth,
    });
    let days_style = new Array;
    days_style.push({
      month: 'current',
      day: this.data.day,
      color: '#314580',
      background: '#69c7f5'
    });
    this.drawPolyline();
    console.log(this.data);
  }
})