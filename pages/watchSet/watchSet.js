// pages/watchSet/watchSet.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    devId:"",
    telmodal:true,
    rel:"",
    tel:"",
    health:'',
    input:"",
    relmodal:true,
    healthmodal: true,
    desc_ship: '', // 右侧描述部分(关系)
    desc_num: '', // 右侧描述部分(电话)
    desc_health: '',//右侧描述部分(健康状况)
    arrow: {
      type: Boolean,
      value: true // 是否显示箭头
    },
    boot:true,
    mode: {
      type: String,
      value: 'normal' // 有边框和无边框 normal, none
    },
    showView: false,
    showModal:true,
    tip:'不可填写空值',
    boottip:'关机指令已发送',
    showFailModal: true,
    loadHidden: true,
    toastHidden: true,
    toastTip: '',
    bootmodal: true,
    isChecked_call: null,
    isChecked_message: null,
    sicknesses: [
      { value: '心脑血管疾病' },
      { value: '呼吸系统疾病' },
      { value: '糖尿病' },
      { value: '老年痴呆' },
      { value: '其他' }
    ],
    index: []
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var sicknesses_value = '';
    for (var i = 0; i < e.detail.value.length; i++) {
      sicknesses_value = sicknesses_value + e.detail.value[i] + ";";
    }
    this.setData({
      input: sicknesses_value
    })
    console.log("健康状况：" + this.data.sicknesses_value);
  },
  changeSwitch_call:function(e){
    var that = this;
    var param = null;
    that.data.isChecked_call = e.detail.value;
    if (that.data.isChecked_call == false){
      param = 0;
    }else{
      param = 1;
    }
    that.setData({
      loadHidden: false
    });
    setTimeout(function () {
      if (that.data.loadHidden == false) {
        that.setData({
          showFailModal: false,
        })
      }
      that.setData({
        loadHidden: true
      })
    }, 30000);
    var openid = wx.getStorageSync('token').openid;
    console.log("自动接听openid:" + openid);
    wx.request({
      url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devId + '/param/' + param +'/autoans?userAgent=' + openid,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function(res){
        console.log('自动接听设置');
        console.log(res);
        if ('0' == res.data) {
          that.setData({
            loadHidden: true,
            boottip: '设置失败',
            boot: false,
            isChecked_call: !that.data.isChecked_call
          });
        }
        if ('1' == res.data) {
          that.setData({
            loadHidden: true,
            boottip: '设置成功',
            boot: false
          });
        }
      },
      fail:function(res_fail){
        that.setData({
          loadHidden: true,
          boottip: '设备不支持该功能',
          boot: false,
          isChecked_call: !that.data.isChecked_call
        })
      }
    })
  },
  changeSwitch_message: function (e) {
    var that = this;
    var param = null;
    that.data.isChecked_message = e.detail.value;
    if (that.data.isChecked_message == false) {
      param = 0;
    } else {
      param = 1;
    }
    that.setData({
      loadHidden: false
    });
    setTimeout(function () {
      if (that.data.loadHidden == false) {
        that.setData({
          showFailModal: false,
        })
      }
      that.setData({
        loadHidden: true
      })
    }, 30000);
    var openid = wx.getStorageSync('token').openid;
    console.log("短信提醒openid:" + openid);
    wx.request({
      url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devId + '/param/' + param +'/msm?userAgent=' + openid,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log('短信提醒设置');
        console.log(res);
        if ('0' == res.data) {
          that.setData({
            loadHidden: true,
            boottip: '设置失败',
            boot: false,
            isChecked_message: !that.data.isChecked_message
          });
        }
        if ('1' == res.data) {
          that.setData({
            loadHidden: true,
            boottip: '设置成功',
            boot: false
          });
        }
      },
      fail: function (res_fail) {
        that.setData({
          loadHidden: true,
          boottip: '设备不支持该功能',
          boot: false,
          isChecked_call: !that.data.isChecked_message
        })
      }
    })
  },
  onClickBoot:function(){
    this.setData({
      bootmodal: false
    })
  },
  telmodalCancle: function(){
    this.setData({
      telmodal: true
    })
  },
  bootmodalCancle: function(){
    this.setData({
      bootmodal: true
    })
  },
  bootmodalChange: function(){
    this.setData({
      bootmodal: true
    })
    var that = this;
    that.setData({
      loadHidden: false
    });
    setTimeout(function () {
      if (that.data.loadHidden == false) {
        that.setData({
          showFailModal: false,
        })
      }
      that.setData({
        loadHidden: true
      })
    }, 30000);
    var openid = wx.getStorageSync('token').openid;
    console.log("远程关机openid:" + openid);
    wx.request({
      url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devId + '/type/shutdown?userAgent=' + openid,
      method: 'GET',
      success: function (res) {
        var data = res.data;
        if ('0' == data) {
          that.setData({
            loadHidden: true,
            boottip: '设备离线',
            boot: false
          });
        }
        if ('1' == data) {
          that.setData({
            loadHidden: true,
            boottip: '指令已经发送',
            boot: false,
            showFailModal: true
          });
        }
      },
      fail: function (res_fail) {
        that.setData({
          loadHidden: true,
          boottip: '设备离线',
          boot: false
        })
      }
    })
  },
  bootHide:function(){
    this.setData({
      boot:true
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.devId= options.devid;
    this.setData({
      desc_ship: options.ralation,
      desc_num: options.tel,
      desc_health: options.health
    });
    var strs = new Array();
    strs = this.data.desc_health.split(";");
    for(var i = 0; i < strs.length; i ++){
      for (var j = 0; j < this.data.sicknesses.length; j++){
        if (this.data.sicknesses[j].value==strs[i]){
          this.data.index.push(j);
        }
      }
    }
    for (var k = 0; k < this.data.index.length; k ++){
      var flag= 'sicknesses['+this.data.index[k]+'].checked';
      this.setData({
        [flag]:true
      });
    }
    console.log(this.data.sicknesses);
    console.log(this.data.index);
  },
  onClickRel:function(e){
    var rel = e.currentTarget.dataset.rel;
    this.data.input=rel;
    this.setData({
      'rel':rel,
      relmodal:false
    });

  },
  onClickonClickTel:function(e){
    var tel = e.currentTarget.dataset.tel;
    this.data.input = tel;
    this.setData({
      'tel': tel,
      telmodal: false
    });
  },
  onClickonClickHealth: function(e){
    var health = e.currentTarget.dataset.health;
    this.data.input = health;
    this.setData({
      'health': health,
      healthmodal: false
    });
  },
  relmodalCancle:function(){
    this.setData({
      relmodal:true
    });
  },
  telmodalCancle: function () {
    this.setData({
      telmodal: true
    });
  },
  healthmodalCancle: function(){
    this.setData({
      healthmodal: true
    });
  },
  relInput:function(e){
   var input =e.detail.value;
   this.data.input=input;
  },
  telInput: function (e) {
    var input = e.detail.value;
    this.data.input = input;
  },
  healthInput: function (e) {
    var input = e.detail.value;
    this.data.input = input;
  },
  healthmodalChange: function () {
    if (this.data.input != null && this.data.input != '') {
      var userid = wx.getStorageSync('userid');
      var devId = this.data.devId;
      var that = this;
      var openid = wx.getStorageSync('token').openid;
      console.log("更新健康状况openid:" + openid);
      var url_post = 'https://www.3firelink.xyz/smart_watch/dev/id/' + devId + '/updatesick'
      console.log(url_post);
      wx.request({
        url: url_post,
        data: {
          sick: that.data.input,
          userAgent: openid
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: 'POST',
        success: function (e) {
          console.log(e);
          that.setData({
            desc_health: that.data.input,
            healthmodal: true
          });
        }
      })
    } else {
      this.setData({
        showModal: false
      });
    }
  },
  relmodalChange:function(){
    if(this.data.input!=null&&this.data.input!=''){
      var userid = wx.getStorageSync('userid');
      var devId=this.data.devId;
      var that=this;
      var openid = wx.getStorageSync('token').openid;
      console.log("更新关系openid:" + openid);
      var url_post = 'https://www.3firelink.xyz/smart_watch/dev/id/' + devId + '/user/' + app.globalData.userId + "/rel/" + encodeURI(this.data.input) + '?userAgent=' + openid;
      console.log(url_post);
      wx.request({
        url: url_post,
        method:'POST',
        success:function(e){
          console.log(e);
          that.setData({
            desc_ship:that.data.input,
            relmodal: true
          });
        }
      })
    }else{
      this.setData({
        showModal: false
      });
    }
  },
  modalFailChangeTip:function(){
    this.setData({
      showFailModal: true
    })
  },
  telmodalChange: function () {
    if (this.data.input != null && this.data.input != '') {
      var userid = wx.getStorageSync('userid');
      var devId = this.data.devId;
      var that = this;
      var openid = wx.getStorageSync('token').openid;
      console.log("更新手机号openid:" + openid);
      var url_post = 'https://www.3firelink.xyz/smart_watch/dev/id/' + devId + "/newtel/" + encodeURI(this.data.input) + 'userAgent=' + openid;
      console.log(url_post);
      wx.request({
        url: url_post,
        method: 'POST',
        success: function (e) {
          console.log(e);
          that.setData({
            desc_num: that.data.input,
            telmodal: true
          });
        }
      })
    } else {
      this.setData({
        showModal: false
      });
    }
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
    var openid = wx.getStorageSync('token').openid;
    console.log("自动接听openid:" + openid);
    wx.request({
      url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devId + '/autoans?userAgent=' + openid,
      success: function(res){
        console.log(res);
        if(res.data == 0){
          that.setData({
            isChecked_call: false
          })
        } else if (res.data == 1){
          that.setData({
            isChecked_call: true
          })
        }
      }
    });
    var openid = wx.getStorageSync('token').openid;
    console.log("短信提醒openid:" + openid);
    wx.request({
      url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devId + '/msm?userAgent=' + openid,
      success: function (res) {
        console.log(res);
        if (res.data == 0) {
          that.setData({
            isChecked_message: false
          })
        } else if (res.data == 1) {
          that.setData({
            isChecked_message: true
          })
        }
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
  
  },
  hideMaskModal:function(){
    this.setData({
      showModal:false
    });
  },
  modalChangeTip:function(){
    this.setData({
      showModal: true
    });
  },
  onClickContect:function(){
    var that=this;
    var id = this.data.devId;
    wx.navigateTo({
      url: "/pages/contects/contects?devid=" + id,
    })    
  }

})