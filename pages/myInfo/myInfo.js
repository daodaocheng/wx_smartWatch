'use strict';
var prom = require('../../utils/prom.js');
const app = getApp();
var titleShow = app.globalData.title;
var ralation = '';
var userId = app.globalData.userId;
var dotColor = ['#00af43', '#fd0002'];
var desc = ['在线', '离线'];
var netState = app.globalData.netState;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  /**
   * 页面的初始数据
   */
  data: {
    jumper: {},
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    watchCode: null,
    titleShow: [],
    modalHidden: true,
    modalHiddenSecond: true,
    modalHiddenDelete: true,
    modalHiddenTip: true,
    modalShowMobile: false,
    ralation: '',
    mobileNum: '',
    genda: 1,
    age: '',
    disease: '',
    check: true,
    showModal: false,
    tip: '',
    devid: null,
    tel: null,
    userTel: null,
    items: [{
      name: '1',
      value: '男',
      checked: 'true'
    },
    {
      name: '0',
      value: '女'
    }
    ],
    token: null,
    loadHidden: true,
    toastHidden: true,
    dotColor: '',
    dot: false,
    notice: '当前网络不可用，请检查你的网络设置',
    showNotice: false,
    userId: null,
    sicknesses: [
      { value: '心脑血管疾病' },
      { value: '呼吸系统疾病' },
      { value: '糖尿病' },
      { value: '老年痴呆' },
      { value: '其他'}
    ],
    modal_health_hidden: true,
    sicknesses_value: '',
    showModalHealth: false,
    index: []
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value); 
    console.log(e);
    var sicknesses_value = '';
    for(var i = 0;i < e.detail.value.length;i ++){
      sicknesses_value = sicknesses_value + e.detail.value[i] + ";";
    }
    this.setData({
      sicknesses_value: sicknesses_value
    })
    console.log("健康状况："+this.data.sicknesses_value);
  },
  modal_health_cancel: function(e){
    this.setData({
      modal_health_hidden: true,
      showModalHealth: false
    })
  },
  modal_health_change: function(e){
    this.setData({
      modal_health_hidden: true,
      showModalHealth: false
    })
  },
  onChangHealth: function (e){
    this.setData({
      modal_health_hidden: false,
      showModalHealth: true
    })
  },
  //拨打电话
  callThePhone:function(e){
    var that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.tel
    })
  },
  radioChange: function (e) {
    console.log(e);
    this.setData({
      genda: e.detail.value
    });
  },
  floatBtn: function (e) {
    this.setData({
      modalHidden: false,
      watchCode: null
    })
  },
  scanWatchCode: function () {
    var that = this;
    wx.scanCode({
      success: function (res) {
        console.log(res);
        that.setData({
          'watchCode': res.result
        })
      },
      fail: function () {
        console.log("加载失败");
      },
      complete: function () { }
    });
  },
  onInput: function (e) {
    this.setData({
      watchCode: e.detail.value
    });
  },
  modalChange: function (e) {
    var that = this;
    var openid = wx.getStorageSync('token').openid;
    console.log("添加设备openid:" + openid);
    if (that.data.watchCode) {
      wx.request({
        url: 'https://www.3firelink.xyz/smart_watch/dev/code/' + that.data.watchCode + '/tel?userAgent=' + openid,
        method: 'GET',
        success: function (e) {
          var tel = e.data;
          that.setData({
            mobileNum: tel
          });
        }
      })

      this.setData({
        modalHiddenSecond: false,
        'ralation': '',
        'mobileNum': ''
      });
      // countShow++;
    } else {
      this.setData({
        modalHiddenWarn: true
      });
    }
    that.setData({
      sicknesses_value: '',
      modalHidden: true
    });
  },
  onInputTel: function (e) {
    this.setData({
      userTel: e.detail.value + ''
    });
  },
  onInputRalation: function (e) {
    this.setData({
      ralation: e.detail.value
    });
    //console.log("e:"+ ralation);
  },
  onInputMobile: function (e) {
    this.setData({
      mobileNum: e.detail.value
    });
  },
  // onInputGenda: function(e) {
  //   this.setData({
  //     genda: e.detail.value
  //   });
  // },
  onInputAge: function (e) {
    console.log(e);
    this.setData({
      age: e.detail.value
    });
  },
  onInputDisease: function (e) {
    this.setData({
      disease: e.detail.value
    });
  },
  modalChangeTip: function (e) {
    this.setData({
      modalHiddenTip: true
    });
  },
  modalChangeSecond: function (e) {
    var that = this;
    var value = that.data.mobileNum + '';
    var len = value.length;
    // var i = value;
    // while(i != 0){
    //   len ++;
    //   i = i / 10;
    // }
    console.log('长度：' + len)
    console.log(value)
    console.log(that.data.ralation);
    console.log(that.data.age);
    console.log(that.data.genda);
    console.log(that.data.sicknesses_value);
    if (that.data.ralation != '' && value != '' && that.data.age != '' && that.data.genda != '' && that.data.sicknesses_value != '') {
      if (len == 11) {
        that.setData({
          modalHiddenSecond: true,
          modalHidden: true,
        });
        // console.log("countShow=" + countShow);
        // wx.setStorageSync("counShow", countShow);
        // console.log("titleShow=" + that.data.titleShow);
        console.log(that.data.age);
        console.log(that.data.genda);
        console.log(that.data.sicknesses_value);
        var openid = wx.getStorageSync('token').openid;
        console.log("添加设备openid:" + openid);
        var url_in = 'https://www.3firelink.xyz/smart_watch/dev/code/' + that.data.watchCode + '/user/' + app.globalData.userId + '/bind?tel=' + that.data.mobileNum + '&rel=' + that.data.ralation + '&age=' + that.data.age + '&sex=' + that.data.genda + '&sickness=' + that.data.sicknesses_value + '&userAgent=' + openid;
        console.log(url_in);
        wx.request({
          // data: {
          //   code: that.data.watchCode,
          //   user: app.globalData.userId,
          //   tel: that.data.mobileNum,
          //   rel: that.data.ralation,
          //   age: that.data.age,
          //   sex: that.data.genda,
          //   sickness: that.data.sicknesses_value
          //},
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          url: url_in,
          success: function (res) {
            console.log(res);
            var openid = wx.getStorageSync('token').openid;
            console.log("添加设备后加载列表openid:" + openid);
            if (res.data == 1) {
              var url_out = 'https://www.3firelink.xyz/smart_watch/user/id/' + app.globalData.userId + '/devs?userAgent=' + openid;
              wx.request({
                url: url_out,
                method: 'GET',
                success: function (res_eq) {
                  that.getDevList();
                  that.setData({
                    age: '',
                    sicknesses_value: '',
                    genda: '1'
                  });
                }
              });
            } else if (res.data == -1) {
              that.setData({
                modalHiddenTip: false,
                tip: '该手表已被绑定！'
              });
            } else if (res.data == -2) {
              that.setData({
                modalHiddenTip: false,
                tip: '该手表编码不存在！'
              });
            } else {
              that.setData({
                modalHiddenTip: false,
                tip: '绑定失败！'
              });
            }
            that.setData({
              'titleShow': that.data.titleShow,
            });
            // console.log("222222222222222222");
          }
        });
      } else {
        that.setData({
          modalHiddenTip: false,
          tip: '请输入正确的电话号码！'
        });
      }
    } else {
      that.setData({
        modalHiddenTip: false,
        tip: '所有项均不能为空！'
      })
    }
    var strs = new Array();
    strs = this.data.sicknesses_value.split(";");
    for (var i = 0; i < strs.length; i++) {
      for (var j = 0; j < this.data.sicknesses.length; j++) {
        if (this.data.sicknesses[j].value == strs[i]) {
          this.data.index.push(j);
        }
      }
    }
    for (var k = 0; k < this.data.index.length; k++) {
      var flag = 'sicknesses[' + this.data.index[k] + '].checked';
      this.setData({
        [flag]: false
      });
    }
    that.setData({
      age: '',
      sicknesses_value: '',
      genda: '1'
    })
  },
  modalChangeCancle: function (e) {
    this.setData({
      modalHidden: true
    })
  },
  modalChangeSecondCancle: function (e) {
    this.setData({
      modalHiddenSecond: true,
      modalHidden: true,
      age: '',
      sicknesses_value: ''
    })
    var strs = new Array();
    strs = this.data.desc_health.split(";");
    for (var i = 0; i < strs.length; i++) {
      for (var j = 0; j < this.data.sicknesses.length; j++) {
        if (this.data.sicknesses[j].value == strs[i]) {
          this.data.index.push(j);
        }
      }
    }
    for (var k = 0; k < this.data.index.length; k++) {
      var flag = 'sicknesses[' + this.data.index[k] + '].checked';
      this.setData({
        [flag]: false
      });
    }
  },
  modalChangeDelete: function (e) {
    var that = this;
    console.log("..........................");
    console.log("devid:" + that.data.devid);
    var openid = wx.getStorageSync('token').openid;
    console.log("删除设备openid:" + openid);
    wx.request({
      url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/user/' + app.globalData.userId + '/unbind?userAgent=' + openid,
      method: 'POST',
      success: function (res_del) {
        console.log(res_del);
        if (res_del.data == 1) {
          for (var i in that.data.titleShow) {
            console.log(that.data.titleShow[i].devid);
            if (that.data.titleShow[i].devid == that.data.devid) {
              console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
              console.log(that.data.titleShow[i].devid);
              that.data.titleShow.splice(i, 1);
            } else {
              console.log("找不到devid");
            }
          }
        }
        that.setData({
          'titleShow': that.data.titleShow,
          modalHiddenDelete: true
        });
        console.log(that.data.titleShow);
      }
    });
  },
  modalChangeDeleteCancle: function (e) {
    this.setData({
      modalHiddenDelete: true
    });
  },
  modalChangeMobile: function (e) {
    var mobile = this.data.userTel + ''
    console.log(mobile);
    console.log("len:" + mobile.length);
    if (mobile.length != 11) {
      this.setData({
        modalHiddenTip: false,
        tip: '请输入正确的电话号码！'
      });
    } else {
      this.newOne();
      this.getDevList();
      this.setData({
        modalShowMobile: false,
        modalShowMobile_mask: false
      });
    }
  },
  onClick: function (e) {
    let check = this.data.check;
    console.log(e);
    this.setData({
      check: !check,
      showModal: true,
      ralation: e.currentTarget.dataset.ship,
      devid: e.currentTarget.dataset.devid,
      tel: e.currentTarget.dataset.mobile,
      devidtemp: e.currentTarget.dataset.devid,
      sicknesses_value: e.currentTarget.dataset.health
    });
  },
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  bingLongTap: function (e) {
    console.log("长按");
    this.setData({
      devid: e.currentTarget.dataset.devid,
      modalHiddenDelete: false
    })
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框安全守护按钮点击事件
   */
  onSafe: function () {
    var that = this;
    this.hideModal();
    // console.log("devid:" + that.data.devid);
    wx.navigateTo({
      url: '../safeArea/safeArea?devid=' + that.data.devid,
    });
  },
  /**
   * 对话框健康数据按钮点击事件
   */
  onHealth: function () {
    this.hideModal();
    wx.navigateTo({
      url: '../healthData/healthData?devid=' + this.data.devid,
    });
  },
  /**
   * 对话框摔倒报警按钮点击事件
   */
  onAlarm: function () {
    this.hideModal();
    wx.navigateTo({
      url: '../fallAlarm/fallAlarm?devid=' + this.data.devid,
    });
  },
  /**
   * 对话框运动轨迹按钮点击事件
   */
  onTrail: function () {
    this.hideModal();
    wx.navigateTo({
      url: '../trail/trail?devid=' + this.data.devid,
    });
  },
  /**
   * 对话框健康报告按钮点击事件
   */
  onReport: function () {
    this.hideModal();
    wx.navigateTo({
      url: '../healthReport/healthReport?devid=' + this.data.devid,
    });
  },
  /**
   * 对话框手表监听按钮点击事件
   */
  onListener: function () {
    var that = this;
    that.hideModal();
    let tokenGet = wx.getStorageSync('token');
    var openid = tokenGet.openid;
    that.setData({
      loadHidden: false
    })
    var state = setTimeout(function () {
      if (that.data.loadHidden == false) {
        that.setData({
          modalHiddenTip: false,
          tip: '后台响应失败'
        })
      }
      that.setData({
        loadHidden: true
      })
    }, 40000);
    console.log("监听设备前openid:" + openid);
    wx.request({
      url: 'https://www.3firelink.xyz/smart_watch/user/openid/' + openid + '?userAgent=' + openid,
      success: function (res) {
        var openid = wx.getStorageSync('token').openid;
        console.log("监听设备openid:" + openid);
        var listenUrl = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/monitor/' + res.data.tel + '?userAgent=' + openid;
        console.log(listenUrl);
        wx.request({
          url: listenUrl,
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res_listen) {
            console.log(res_listen);
            if (res_listen.data == 1) {
              that.setData({
                loadHidden: true,
                toastHidden: false,
                modalHiddenTip: true,
              })
              clearTimeout(state);
            } else if (res_listen.data == 0) {
              that.setData({
                loadHidden: true,
                // modalHiddenTip: false,
                // tip: '后台响应失败'
              })
              clearTimeout(state);
            }
          },
          fail: function (res_listen_fail) {
            console.log("网络请求失败");
            that.setData({
              loadHidden: true,
              // modalHiddenTip: false,
              // tip: '后台响应失败'
            })
            clearTimeout(state);
          }
        })
      }
    })
  },
  toastChange: function () {
    this.setData({
      toastHidden: true
    })
  },
  /**
   * 对话框手表设置按钮点击事件
   */
  onSet: function () {
    var that = this;
    this.hideModal();
    wx.navigateTo({
      url: '../watchSet/watchSet?ralation=' + that.data.ralation + '&tel=' + that.data.tel + '&devid=' + that.data.devidtemp + '&health=' + that.data.sicknesses_value,
    });
  },
  onSubmit(e) {
    console.log(e.detail.formId)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getDevList: function () {
    var that = this;
    that.setData({
      'titleShow': [],
    });
    var openid = wx.getStorageSync('token').openid;
    console.log("userid:" + app.globalData.userId);
    console.log("加载设备列表openid:" + openid);
    var url_out = 'https://www.3firelink.xyz/smart_watch/user/id/' + app.globalData.userId + '/devs' + '?userAgent=' + openid;
    wx.request({
      url: url_out,
      method: 'GET',
      success: function (res_eq) {
        console.log("设备列表getDevList");
        console.log(url_out);
        console.log(res_eq);
        var count = res_eq.data.length;
        var descTemp = desc[1];
        var dotColorTemp = dotColor[1];
        var battery_image = '';
        for (var i = 0; i < count; i++) {
          console.log(i + "在线状态:" + res_eq.data[i].isOnline);
          if (res_eq.data[i].isOnline == true) {
            descTemp = desc[0];
            dotColorTemp = dotColor[0];
          } else if (res_eq.data[i].isOnline == false) {
            descTemp = desc[1];
            dotColorTemp = dotColor[1];
          }
          if (res_eq.data[i].ele <= 100 && res_eq.data[i].ele > 80) {
            battery_image = '../../assets/battery_full.png'
          } else if (res_eq.data[i].ele <= 80 && res_eq.data[i].ele > 60) {
            battery_image = '../../assets/battery_80.png'
          } else if (res_eq.data[i].ele <= 60 && res_eq.data[i].ele > 40) {
            battery_image = '../../assets/battery_60.png'
          } else if (res_eq.data[i].ele <= 40 && res_eq.data[i].ele > 20) {
            battery_image = '../../assets/battery_40.png'
          } else if (res_eq.data[i].ele <= 20 && res_eq.data[i].ele > 5) {
            battery_image = '../../assets/battery_20.png'
          } else if (res_eq.data[i].ele <= 5) {
            battery_image = '../../assets/battery_0.png'
          }
          var newArray = [{
            devid: res_eq.data[i].id,
            mobile: res_eq.data[i].tel,
            sicknesses_value: res_eq.data[i].sickness,
            title: res_eq.data[i].ship,
            detail: res_eq.data[i].ship,
            arrow: true,
            desc: descTemp,
            src: '../../assets/watch.png',
            dot: true,
            dotColor: dotColorTemp,
            mode: 'normal',
            elec: 75 + "%",
            battery_image: battery_image
          }];
          that.data.titleShow = that.data.titleShow.concat(newArray);
        }
        // console.log("111111111111111111111");
        console.log(that.data.titleShow);
        that.setData({
          'titleShow': that.data.titleShow
        });
        // console.log("222222222222222222");
        console.log(titleShow);
      }
    });
  },
  getUserInfo: function (e) {
    var that = this;
    console.log("ffffffffffffffffffffffff");
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    console.log(app.globalData.userInfo);
    that.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
    console.log(that.data.userInfo);
    console.log(that.data.hasUserInfo);
    console.log("获取用户id的openid:" + that.data.token.openid);
    wx.request({
      url: 'https://www.3firelink.xyz/smart_watch/user/openid/' + that.data.token.openid + '?userSAgent=' + that.data.token.openid,
      method: 'GET',
      success: function (e_t) {
        if (e_t.data && e_t.data.tel && e_t.data.tel != null && e_t.data.tel != 'null' && e_t.data.tel != undefined) {
          that.setData({
            userTel: e_t.data.tel
          });
          console.log("e_t:");
          console.log(e_t);
          console.log(e_t.data.tel != null);
          console.log(e_t.data.tel != 'null');
          that.setData({
            userTel: e_t.data.tel,
            userInfo: app.globalData.userInfo,
            hasUserInfo: true,
          });
          console.log("ffffffffffffffffffffffff");
          //app.globalData.userInfo = res.detail.userInfo;
          //console.log(app.globalData.userInfo);
          console.log(that.data.userInfo);
          console.log(that.data.hasUserInfo);
          that.newOne();
          that.getUserId();
        } else {
          that.setData({
            modalShowMobile: true,
            modalShowMobile_mask: true
          });
        }
      }
    })
  },
  newOne: function () {
    var that = this;
    let tokenGet = wx.getStorageSync('token');
    console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    console.log(tokenGet);
    console.log("avatarUrl: " + that.data.userInfo.avatarUrl);
    console.log("nickName: " + that.data.userInfo.nickName);
    console.log("openid:" + tokenGet.openid);
    console.log("userTel:" + that.data.userTel);
    wx.request({
      url: 'https://www.3firelink.xyz/smart_watch/user/newone',
      data: {
        tel: that.data.userTel,
        username: that.data.userInfo.nickName,
        openid: tokenGet.openid,
        nickname: that.data.userInfo.nickName,
        imageurl: that.data.userInfo.avatarUrl,
        userAgent: tokenGet.openid
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'token': wx.getStorageSync('token')
      },
      success: function (e_res) {
        console.log(e_res);
        console.log(tokenGet.openid);
      }
    });
  },
  getUserId: function () {
    var that = this;
    let tokenGet = wx.getStorageSync('token');
    console.log("ggggggggggggggggggggggggggggg");
    console.log(tokenGet);
    var openid = tokenGet.openid;
    var url_out = 'https://www.3firelink.xyz/smart_watch/user/openid/' + openid + '?userAgent=' + openid;
    console.log("url_out:");
    console.log(url_out);
    wx.request({
      method: 'GET',
      url: url_out,
      success: function (u_res) {
        console.log("获取用户ID");
        console.log(u_res);
        if (u_res.data){
          app.globalData.userId = u_res.data.id;
          wx.setStorageSync('userid', u_res.data.id);
          console.log("userId_storage" + wx.getStorageSync('userid'));
          console.log("userId:" + app.globalData.userId);
          that.getDevList();
          that.setData({
            userTel: u_res.data.tel,
          })
        }else{
          that.setData({
            modalShowMobile: true,
            modalShowMobile_mask: true
          });
        }
      },
      fail: function (u_res_fail) {
        console.log("获取userid错误信息");
        console.log(u_res_fail);
      }
    })
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
      sicknesses_value: ''
    })
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
          let token = wx.getStorageSync('token');
          that.setData({
            token: token
          })
          if (app.globalData.userId) {
            wx.setStorageSync('userid', app.globalData.userId);
            console.log("userInfo:");
            console.log(app.globalData.userInfo);
            console.log(that.data.canIUse);
            console.log("已获取到userId");
            if (app.globalData.userInfo){
              that.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true,
                canIUse: false
              })
              that.getDevList();
            }else{
              wx.request({
                url: 'https://www.3firelink.xyz/smart_watch/user/openid/' + that.data.token.openid + '?userAgent=' + that.data.token.openid,
                method: 'GET',
                success: function (e_t) {
                  that.setData({
                    userTel: e_t.data.tel,
                  });
                  console.log("e_t:");
                  console.log(e_t);
                  console.log(e_t.data.tel != null);
                  console.log(e_t.data.tel != 'null');
                  if (e_t.data && e_t.data.tel && e_t.data.tel != null && e_t.data.tel != 'null' && e_t.data.tel != undefined) {
                    console.log(app.globalData.userInfo);
                    if (app.globalData.userInfo) {
                      console.log("ffffffffffffffffffffffff");
                      that.setData({
                        userInfo: app.globalData.userInfo,
                        hasUserInfo: true,
                        canIUse: false
                      })
                      that.newOne();
                      that.getUserId();
                    }
                  } else {
                    if (app.globalData.userInfo && app.globalData.userInfo != {} && app.globalData.userInfo != '[object Object]') {
                      console.log("ffffffffffffffffffffffff");
                      that.setData({
                        userInfo: app.globalData.userInfo,
                        hasUserInfo: true,
                        canIUse: false
                      })
                      wx.request({
                        url: 'https://www.3firelink.xyz/smart_watch/user/openid/' + that.data.token.openid + '?userAgent=' + that.data.token.openid,
                        method: 'GET',
                        success: function (e_t) {
                          that.setData({
                            userTel: e_t.data.tel,
                          });
                          console.log("e_t:");
                          console.log(e_t);
                          console.log(e_t.data.tel != null);
                          console.log(e_t.data.tel != 'null');
                          if (e_t.data && e_t.data.tel && e_t.data.tel != null && e_t.data.tel != 'null' && e_t.data.tel != undefined) {
                            that.setData({
                              userTel: e_t.data.tel,
                              userInfo: app.globalData.userInfo,
                              hasUserInfo: true,
                            });
                            console.log("ffffffffffffffffffffffff");
                            app.globalData.userInfo = res.detail.userInfo;
                            console.log(app.globalData.userInfo);
                            console.log(that.data.userInfo);
                            console.log(that.data.hasUserInfo);
                            that.newOne();
                            that.getUserId();
                          }
                        }
                      })
                    } else if (that.data.canIUse) {
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      prom.wxPromisify(app.userInfoReadyCallback)().then(function (res) {
                        console.log(res)
                        that.setData({
                          userInfo: res.detail.userInfo,
                          hasUserInfo: true,
                        });
                        console.log("ffffffffffffffffffffffff");
                        app.globalData.userInfo = res.detail.userInfo;
                        console.log(app.globalData.userInfo);
                        console.log(that.data.userInfo);
                        console.log(that.data.hasUserInfo);
                        wx.request({
                          url: 'https://www.3firelink.xyz/smart_watch/user/openid/' + that.data.token.openid + '?userAgent=' + that.data.token.openid,
                          method: 'GET',
                          success: function (e_t) {
                            console.log("e_t:");
                            console.log(e_t);
                            console.log(e_t.data.tel != null);
                            console.log(e_t.data.tel != 'null');
                            if (e_t.data && e_t.data.tel && e_t.data.tel != null && e_t.data.tel != 'null' && e_t.data.tel != undefined) {
                              that.setData({
                                userTel: e_t.data.tel,
                                userInfo: app.globalData.userInfo,
                                hasUserInfo: true,
                              });
                              console.log("ffffffffffffffffffffffff");
                              app.globalData.userInfo = res.detail.userInfo;
                              console.log(app.globalData.userInfo);
                              console.log(that.data.userInfo);
                              console.log(that.data.hasUserInfo);
                              that.newOne();
                              that.getUserId();
                            } else {
                              that.setData({
                                modalShowMobile: true,
                                modalShowMobile_mask: true
                              });
                            }
                          }
                        })
                      });
                    }
                  }
                }
              })
            }
          } else {
            if (token == null || token == '') {
              //第一次登录，获取登录状态
              app.getToken().then(function (res_t) {
                console.log(res_t); //此时token必然已经获取到，且getData()在此时才会执行
                console.log("this:");
                console.log(that.data.canIUse);
                console.log(that);
                that.setData({
                  token: res_t.data
                });
                if (app.globalData.userInfo) {
                  console.log("ffffffffffffffffffffffff");
                  app.globalData.userInfo = res.detail.userInfo;
                  console.log(app.globalData.userInfo);
                  console.log(that.data.userInfo);
                  console.log(that.data.hasUserInfo);
                  wx.request({
                    url: 'https://www.3firelink.xyz/smart_watch/user/openid/' + that.data.token.openid + '?userAgent=' + that.data.token.openid,
                    method: 'GET',
                    success: function (e_t) {
                      that.setData({
                        userTel: e_t.data.tel,
                        userInfo: app.globalData.userInfo,
                        hasUserInfo: true,
                      });
                      console.log("e_t:");
                      console.log(e_t);
                      console.log(e_t.data.tel != null);
                      console.log(e_t.data.tel != 'null');
                      if (e_t.data && e_t.data.tel && e_t.data.tel != null && e_t.data.tel != 'null' && e_t.data.tel != undefined) {
                        that.setData({
                          userTel: e_t.data.tel,
                          userInfo: app.globalData.userInfo,
                          hasUserInfo: true,
                        });
                        console.log("ffffffffffffffffffffffff");
                        app.globalData.userInfo = res.detail.userInfo;
                        console.log(app.globalData.userInfo);
                        console.log(that.data.userInfo);
                        console.log(that.data.hasUserInfo);
                        that.newOne();
                        that.getUserId();
                      } else {
                        that.setData({
                          modalShowMobile: true,
                          modalShowMobile_mask: true
                        });
                      }
                    }
                  })
                } else if (that.data.canIUse) {
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  prom.wxPromisify(app.userInfoReadyCallback)().then(function (res) {
                    console.log(res)
                    that.setData({
                      userInfo: res.detail.userInfo,
                      hasUserInfo: true,
                    });
                    console.log("ffffffffffffffffffffffff");
                    app.globalData.userInfo = res.detail.userInfo;
                    console.log(app.globalData.userInfo);
                    console.log(that.data.userInfo);
                    console.log(that.data.hasUserInfo);
                    wx.request({
                      url: 'https://www.3firelink.xyz/smart_watch/user/openid/' + that.data.token.openid + '?userAgent=' + that.data.token.openid,
                      method: 'GET',
                      success: function (e_t) {
                        console.log("e_t:");
                        console.log(e_t);
                        console.log(e_t.data.tel != null);
                        console.log(e_t.data.tel != 'null');
                        if (e_t.data && e_t.data.tel && e_t.data.tel != null && e_t.data.tel != 'null' && e_t.data.tel != undefined) {
                          that.setData({
                            userTel: e_t.data.tel,
                            userInfo: app.globalData.userInfo,
                            hasUserInfo: true,
                          });
                          console.log("ffffffffffffffffffffffff");
                          app.globalData.userInfo = res.detail.userInfo;
                          console.log(app.globalData.userInfo);
                          console.log(that.data.userInfo);
                          console.log(that.data.hasUserInfo);
                          that.newOne();
                          that.getUserId();
                        } else {
                          that.setData({
                            modalShowMobile: true,
                            modalShowMobile_mask: true
                          });
                        }
                      }
                    })
                  });
                }
              });
            } else {
              //有token的情况直接获取数据
              console.log("不是首次登录")
              if (app.globalData.userInfo) {
                console.log("ffffffffffffffffffffffff");
                console.log(app.globalData.userInfo);
                console.log(that.data.userInfo);
                console.log(that.data.hasUserInfo);
                wx.request({
                  url: 'https://www.3firelink.xyz/smart_watch/user/openid/' + that.data.token.openid + '?userAgent=' + that.data.token.openid,
                  method: 'GET',
                  success: function (e_t) {
                    if (e_t.data && e_t.data.tel && e_t.data.tel != null && e_t.data.tel != 'null' && e_t.data.tel != undefined) {
                      that.setData({
                        userTel: e_t.data.tel,
                        userInfo: app.globalData.userInfo,
                        hasUserInfo: true,
                      });
                      console.log("e_t:");
                      console.log(e_t);
                      console.log(e_t.data.tel != null);
                      console.log(e_t.data.tel != 'null');
                      that.newOne();
                      that.getUserId();
                    }
                  }
                })
              } else if (that.data.canIUse) {
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                prom.wxPromisify(app.userInfoReadyCallback)().then(function (res) {
                  console.log(res)
                  that.setData({
                    userInfo: res.detail.userInfo,
                    hasUserInfo: true,
                  });
                  console.log("ffffffffffffffffffffffff");
                  app.globalData.userInfo = res.detail.userInfo;
                  console.log(app.globalData.userInfo);
                  console.log(that.data.userInfo);
                  console.log(that.data.hasUserInfo);
                  wx.request({
                    url: 'https://www.3firelink.xyz/smart_watch/user/openid/' + that.data.token.openid + '?userAgent=' + that.data.token.openid,
                    method: 'GET',
                    success: function (e_t) {
                      console.log("e_t:");
                      console.log(e_t);
                      console.log(e_t.data.tel != null);
                      console.log(e_t.data.tel != 'null');
                      if (e_t.data && e_t.data.tel && e_t.data.tel != null && e_t.data.tel != 'null' && e_t.data.tel != undefined) {
                        that.newOne();
                        that.getUserId();
                      } else {
                        that.setData({
                          modalShowMobile: true,
                          modalShowMobile_mask: true
                        });
                      }
                    }
                  })
                });
              }
            }
          }
        }
        that.setData({
          userId: wx.getStorageSync('userid')
        })
        console.log("进入页面userId："+that.data.userId);
      }
    })
  }
});