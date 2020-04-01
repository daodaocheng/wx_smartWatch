// pages/contects/contects.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contects: [],
    devId: "",
    name: "",
    tel: "",
    rel: '',
    con: true,
    mode: {
      type: String,
      value: 'normal' // 有边框和无边框 normal, none
    },
    showModal: true,
    showFailModal: true,
    tip: '',
    confirm: true,
    devIdtemp: '',
    loadHidden: true,
    toastHidden: true,
    toastTip: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.devid;
    this.data.devId = id;
    var that = this;
    var openid = wx.getStorageSync('token').openid;
    console.log("通讯录openid:" + openid);
    var url_get = 'https://www.3firelink.xyz/smart_watch/dev/id/' + id + '/connectors?userAgent=' + openid;
    console.log(url_get);
    wx.request({
      url: url_get,
      method: 'GET',
      success: function(res) {
        var data = res.data;
        var contect = new Array();
        for (var i = 0; i < data.length; i++) {
          contect.push({
            devid: data[i].device_id,
            id: data[i].id,
            name: data[i].name,
            tel: data[i].tels
          });
        }
        that.setData({
          'contects': contect
        });
      }
    })
  },
  onInputRel: function(e) {
    var rel = e.detail.value
    this.data.rel = rel;
    console.log(rel);
  },
  onInputTel: function(e) {
    var tel = e.detail.value + ''
    this.data.tel = tel;
    console.log(tel);
  },
  modalFailChangeTip: function() {
    this.setData({
      showFailModal: true
    })
  },
  addTo: function() {
    if (this.data.rel != null && this.data.tel != null && this.data.rel != '' && this.data.tel != '') {
      if (this.data.tel.length == 11) {
        var that = this;
        var temp = 1;
        var data = that.data.contects;
        var contect = new Array();
        for (var i = 0; i < data.length; i++) {
          if (data[i].name == that.data.rel) {
            that.setData({
              tip: '通讯录中已存在该姓名!',
              showModal: false
            });
            temp = 0;
          }
        }
        if(temp == 1){
          that.setData({
            con: true,
            loadHidden: false
          });
          console.log("load:" + that.data.loadHidden);
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
          console.log("新增联系人openid:" + openid);
          var url_post = 'https://www.3firelink.xyz/smart_watch/dev/id/' + this.data.devId + '/name/' + this.data.rel + '/tel/' + this.data.tel + '?userAgent=' + openid;
          console.log(url_post);
          wx.request({
            url: url_post,
            method: 'POST',
            success: function (e) {
              if (e.data == 1) {
                that.setData({
                  con: true,
                });
                var openid = wx.getStorageSync('token').openid;
                console.log("新增联系人openid:" + openid);
                var url_get = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devId + '/connectors?userAgent=' + openid;
                console.log(url_get);
                wx.request({
                  url: url_get,
                  method: 'GET',
                  success: function (res) {
                    var temp = 1;
                    var data = res.data;
                    var contect = new Array();
                    for (var i = 0; i < data.length; i++) {
                      contect.push({
                        devid: data[i].device_id,
                        id: data[i].id,
                        name: data[i].name,
                        tel: data[i].tels
                      });
                    }
                    that.setData({
                      'contects': contect,
                      loadHidden: true,
                      toastTip: '成功添加联系人至此设备!',
                      toastHidden: false
                    });
                  },
                  fail: function (res_listen_fail) {
                    that.setData({
                      loadHidden: true,
                      showFailModal: false
                    })
                  }
                })
              } else if (e.data == 0) {
                that.setData({
                  loadHidden: true,
                  showFailModal: false
                })
              }
            }
          })
        }
      } else {
        this.setData({
          tip: '请输入正确的手机号!',
          showModal: false
        })
      }
    } else {
      this.setData({
        showModal: false,
        tip: '内容不能为空!'
      });
    }
  },
  delContect: function(e) {
    var id = e.currentTarget.dataset.id;
    this.data.devIdtemp = id;
    this.setData({
      confirm: false
    });
  },
  toastChange: function() {
    this.setData({
      toastHidden: true
    })
  },
  sure: function() {
    var id = this.data.devIdtemp;
    var openid = wx.getStorageSync('token').openid;
    console.log("新增联系人openid:" + openid);
    var urlPost = 'https://www.3firelink.xyz/smart_watch/dev/contect/' + id + '/del?userAgent=' + openid;
    var that = this;
    that.setData({
      confirm: true,
      loadHidden: false
    });
    console.log("load:" + that.data.loadHidden);
    setTimeout(function() {
      if (that.data.loadHidden == false) {
        that.setData({
          showFailModal: false,
        })
      }
      that.setData({
        loadHidden: true
      })
    }, 20000);
    wx.request({
      url: urlPost,
      method: 'POST',
      success: function(e) {
        if (e.data == 1) {
          var openid = wx.getStorageSync('token').openid;
          console.log("查询联系人openid:" + openid);
          var url_get = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devId + '/connectors?userAgent=' + openid;
          console.log(url_get);
          wx.request({
            url: url_get,
            method: 'GET',
            success: function(res) {
              var data = res.data;
              var contect = new Array();
              for (var i = 0; i < data.length; i++) {
                contect.push({
                  devid: data[i].device_id,
                  id: data[i].id,
                  name: data[i].name,
                  tel: data[i].tels
                });
              }
              that.setData({
                'contects': contect,
                confirm: true,
                loadHidden: true,
                toastTip: '成功删除此联系人!',
                toastHidden: false
              });
            },
            fail: function(res_listen_fail) {
              that.setData({
                loadHidden: true,
                showFailModal: false
              })
            }
          })
        } else if (e.data == 0) {
          that.setData({
            loadHidden: true,
            showFailModal: false
          })
        }
      }
    })
  },
  cancel: function() {
    this.setData({
      confirm: true,
      tel: '',
      rel: ''
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  modalChangeCancel: function() {
    this.setData({
      con: true
    });
  },
  ondo: function() {
    this.setData({
      con: false,
      tel: '',
      rel: ''
    });
  },
  modalChangeTip: function() {
    this.setData({
      showModal: true,
      tel: '',
      rel: ''
    });
  }
})