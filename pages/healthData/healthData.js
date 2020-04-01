// pages/healthData/healthData.js
import * as echarts from '../../ec-canvas/echarts';
const Promise = require('../../utils/promise.js');
var prom = require('../../utils/prom.js');
let pauseChart = null;
let rateChart = null;
let contentChart = null;
var devid = null;
var dateShow = '';
var date = new Date();
var month = parseInt(date.getMonth() + 1);
console.log("month:" + month);
//var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var lineChartPressure = null;
var lineChartRate = null;
var lineChartContent = null;
var startPos = null;
var chartWidth = null;
var chartHeight = null;
var windowWidth = 320;
var windowHeight = 460;
try {
  var res = wx.getSystemInfoSync();
  windowWidth = res.windowWidth;
  windowHeight = res.windowHeight;
} catch (e) {
  console.error('getSystemInfoSync failed!');
}
var up = 0;
var down = 0;

function initChartPause(canvas, width, height) {
  pauseChart = echarts.init(canvas, null, {
    width: width - 50,
    height: height - 50
  });
  chartWidth = width;
  chartHeight = height;
  canvas.setChart(pauseChart);
  return pauseChart
}

function initChartRate(canvas, width, height) {
  rateChart = echarts.init(canvas, null, {
    width: width - 40,
    height: height - 40
  });
  canvas.setChart(rateChart);
  return rateChart
}

function initChartContent(canvas, width, height) {
  contentChart = echarts.init(canvas, null, {
    width: width - 40,
    height: height - 40
  });
  canvas.setChart(contentChart);
  return contentChart
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rateMax: [],
    rateMin: [],
    contentMax: [],
    contentMin: [],
    calendar: new Date().getFullYear() + '年' + month + '月' + new Date().getDate() + '日',
    calendar2: new Date().getFullYear() + '年' + month + '月' + new Date().getDate() + '日',
    calendar3: new Date().getFullYear() + '年' + month + '月' + new Date().getDate() + '日',
    showView: false,
    showModal: false,
    dateShow: '',
    days_style: [],
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1, // 月份
    day: new Date().getDate(),
    scrollTop: 0,
    devid: null,
    //daltaY: 0,
    //currentGesture: 0,
    lastY: 0,
    startpoint: [],
    miles: 0,
    steps: 0,
    isChecked_measure: false,
    showTime: false,
    time: '选择时间',
    modalTime: true,
    modalHiddenTip: true,
    tip: "请选择时间再点确定！",
    loadding_tip: '',
    warn_tip: '',
    showFailModal: true,
    showFailModalWarn: true,
    loadHidden: true,
    showCanvases: true,
    testmodal: true,
    chartWidth: chartWidth,
    windowHeight: windowHeight,
    ec_pause: {
      disableTouch: true,
      onInit: initChartPause
    },
    ec_rate: {
      disableTouch: true,
      onInit: initChartRate
    },
    ec_content: {
      disableTouch: true,
      onInit: initChartContent
    }
  },
  onClickTest: function(e) {
    this.setData({
      testmodal: false,
      showCanvases: false
    });
  },
  testmodalCancle: function() {
    this.setData({
      testmodal: true,
      showCanvases: true
    });
    this.createSimulationPause();
    this.createSimulationDataRate();
    this.createSimulationDataContent();
  },
  testmodalChange: function() {
    var that = this;
    that.setData({
      testmodal: true,
      loadHidden: false,
      showCanvases: true
    });
    this.createSimulationPause();
    this.createSimulationDataRate();
    this.createSimulationDataContent();
    setTimeout(function() {
      if (that.data.loadHidden == false) {
        that.setData({
          showFailModal: false,
          loadding_tip: "后台响应失败",
        })
      }
      that.setData({
        loadHidden: true
      })
    }, 30000);
    var openid = wx.getStorageSync('token').openid;
    wx.request({
      url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/autobvsd?userAgent=' + openid,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function(res_health_test) {
        console.log("健康数据测量：");
        console.log(res_health_test);
        if (res_health_test.data == 1) {
          that.setData({
            loadHidden: true,
            loadding_tip: '后台响应成功，请等待手表测量',
            showFailModal: false
          });
        } else {
          that.setData({
            loadHidden: true,
            loadding_tip: '后台响应失败',
            showFailModal: false
          });
        }
      },
      fail: function(res_health_test) {
        that.setData({
          loadHidden: true,
          loadding_tip: '后台响应失败',
          showFailModal: false
        });
      }
    });
  },
  changeSwitch_measure: function(e) {
    var that = this;
    that.setData({
      isChecked_measure: e.detail.value,
    });
    if (that.data.isChecked_measure == true) {
      that.setData({
        showTime: true,
        modalTime: false,
        showCanvases: false
      })
    } else {
      that.setData({
        loadHidden: false
      });
      setTimeout(function() {
        if (that.data.loadHidden == false) {
          that.setData({
            showFailModal: false,
            loadding_tip: "后台响应失败",
            isChecked_measure: !that.data.isChecked_measure
          })
        }
        that.setData({
          loadHidden: true
        })
      }, 30000);
      var openid = wx.getStorageSync('token').openid;
      wx.request({
        url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/switch/dbs?userAgent=' + openid,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        success: function(res_switch_post) {
          console.log("改变提醒开关状态：");
          console.log(res_switch_post);
          if (res_switch_post.data == 1) {
            that.setData({
              showTime: false,
              showTimePicker: true,
              time: '选择时间',
              loadHidden: true,
              loadding_tip: '设置成功',
              showFailModal: false
            })
          } else if (res_switch_post.data == 0) {
            that.setData({
              loadHidden: true,
              warn_tip: '设置失败',
              showFailModalWarn: false,
              isChecked_measure: !that.data.isChecked_measure
            });
          }
        }
      });
    }
    console.log("showTimePicker:" + that.data.showTimePicker);
  },
  modalCancleTime: function() {
    this.setData({
      isChecked_measure: false,
      modalTime: true,
      showTime: false,
      showCanvases: true,
      time: '选择时间'
    })
    this.createSimulationPause();
    this.createSimulationDataRate();
    this.createSimulationDataContent();
  },
  modalChangeTime: function() {
    var that = this;
    if (that.data.time != "选择时间") {
      var time_post = that.data.time.replace(":", "@");
      that.setAlarmTime(time_post).then(function(res) {
        console.log("提醒时间2：" + that.data.time);
        console.log(res);
        if (res.data == 0) {
          that.setData({
            isChecked_measure: !that.data.isChecked_measure,
            showTime: false,
            time: "选择时间"
          })
        } else if (res.data == 1) {
          var openid = wx.getStorageSync('token').openid;
          wx.request({
            url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/switch/dbs?userAgent=' + openid,
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            success: function(res_switch_post) {
              console.log("改变提醒开关状态：");
              console.log(res_switch_post);
            }
          });
        }
      });
      that.setData({
        modalTime: true,
        showCanvases: true
      })
      this.createSimulationPause();
      this.createSimulationDataRate();
      this.createSimulationDataContent();
    } else {
      that.setData({
        modalHiddenTip: false,
        showModal: true,
      })
    }
  },
  modalChangeTip: function() {
    this.setData({
      modalHiddenTip: true,
      showModal: false,
    })
  },
  modalFailChangeTip: function() {
    this.setData({
      showFailModal: true
    })
  },
  modalFailChangeTipWarn: function() {
    this.setData({
      showFailModalWarn: true
    })
  },
  bindModalTimeChange: function(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      time: e.detail.value,
    })
  },
  bindTimeChange: function(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var time_temp = e.detail.value;
    var time_post = time_temp.replace(":", "@");
    that.setAlarmTime(time_post).then(function(res) {
      console.log("提醒时间2：" + that.data.time);
      console.log(res);
      if (res.data == 0) {

      } else if (res.data == 1) {
        that.setData({
          time: e.detail.value
        })
      }
    });
  },
  setAlarmTime: function(time_post) {
    var time_data = null;
    var that = this;
    console.log("time_post:" + time_post);
    that.setData({
      loadHidden: false
    });
    setTimeout(function() {
      if (that.data.loadHidden == false) {
        that.setData({
          showFailModal: false,
          loadding_tip: "后台响应失败"
        })
      }
      that.setData({
        loadHidden: true
      })
    }, 30000);
    return new Promise(function(resolve, reject) {
      var openid = wx.getStorageSync('token').openid;
      wx.request({
        url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/time/' + time_post + '/dbstime?userAgent=' + openid,
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        success: function(res_time_post) {
          console.log("设置提醒的时间:");
          console.log(res_time_post);
          if ('0' == res_time_post.data) {
            that.setData({
              loadHidden: true,
              warn_tip: '设置失败',
              showFailModalWarn: false,
            });
            time_data = 0;
            console.log("提醒时间1：" + that.data.time);
          }
          if ('1' == res_time_post.data) {
            that.setData({
              loadHidden: true,
              loadding_tip: '设置成功',
              showFailModal: false
            });
            time_data = 1;
          }
          resolve(res_time_post);
          return time_data;
        },
        fail: function(res_fail) {
          that.setData({
            loadHidden: true,
            showFailModal: false,
            loadding_tip: "设置失败",
            isChecked_measure: false,
            showTime: false
          })
          time_data = 0;
          reject('error');
        }
      })
    })
  },
  scrollCanvas: function(e) {
    console.log(e);
    var canvasLen = e.detail.scrollTop;
    //var daltaY = e.detail.deltaY;
    this.setData({
      scrollTop: canvasLen,
      //daltaY: daltaY
    })
  },
  calendar2: function() {
    var that = this;
    that.setData({
      showView: true,
      showModal: true
    });
    let days_style = new Array;
    days_style.push({
      month: 'current',
      day: that.data.day,
      color: '#314580',
      background: '#69c7f5'
    });
    that.setData({
      'days_style': days_style
    });
    console.log(that.data);
  },
  calendar3: function() {
    var that = this;
    that.setData({
      showView: true,
      showModal: true
    });
    let days_style = new Array;
    days_style.push({
      month: 'current',
      day: that.data.day,
      color: '#314580',
      background: '#69c7f5'
    });
    that.setData({
      'days_style': days_style
    });
    console.log(that.data);
  },
  calendar: function() {
    var that = this;
    that.setData({
      showView: true,
      showModal: true
    });
    let days_style = new Array;
    days_style.push({
      month: 'current',
      day: that.data.day,
      color: '#314580',
      background: '#69c7f5'
    });
    that.setData({
      'days_style': days_style
    });
    console.log(that.data);
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
    });
    dateShow = this.data.year + '-' + this.data.month + '-' + this.data.day;
    var that = this;
    if (that.data.month < 10) {
      that.setData({
        dateShow: that.data.year + '-' + '0' + that.data.month + '-' + that.data.day
      });
      dateShow = that.data.year + '-' + '0' + that.data.month + '-' + that.data.day;
    }
    if (that.data.day < 10) {
      that.setData({
        dateShow: that.data.year + '-' + that.data.month + '-' + '0' + that.data.day
      });
      dateShow = that.data.year + '-' + that.data.month + '-' + '0' + that.data.day;
    }
    if (that.data.day < 10 && that.data.month < 10) {
      that.setData({
        dateShow: that.data.year + '-' + '0' + that.data.month + '-' + '0' + that.data.day
      });
      dateShow = that.data.year + '-' + '0' + that.data.month + '-' + '0' + that.data.day;
    }
    this.getSportData();
    this.createSimulationPause();
    this.createSimulationDataRate();
    this.createSimulationDataContent();

    console.log(this.data);
  },
  hideModal: function() {
    this.setData({
      showView: false,
      showModal: false,
      calendar: this.data.year + '年' + this.data.month + '月' + this.data.day + '日',
      dateShow: this.data.year + '-' + this.data.month + '-' + this.data.day
    });
    var that = this;
    if (that.data.month < 10) {
      that.setData({
        dateShow: that.data.year + '-' + '0' + that.data.month + '-' + that.data.day
      });
      dateShow = that.data.year + '-' + '0' + that.data.month + '-' + that.data.day;
    }
    if (that.data.day < 10) {
      that.setData({
        dateShow: that.data.year + '-' + that.data.month + '-' + '0' + that.data.day
      });
      dateShow = that.data.year + '-' + that.data.month + '-' + '0' + that.data.day;
    }
    if (that.data.day < 10 && that.data.month < 10) {
      that.setData({
        dateShow: that.data.year + '-' + '0' + that.data.month + '-' + '0' + that.data.day
      });
      dateShow = that.data.year + '-' + '0' + that.data.month + '-' + '0' + that.data.day;
    }
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
    this.createSimulationPause();
    this.createSimulationDataRate();
    this.createSimulationDataContent();
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
    this.createSimulationPause();
    this.createSimulationDataRate();
    this.createSimulationDataContent();
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
    this.createSimulationPause();
    this.createSimulationDataRate();
    this.createSimulationDataContent();
    console.log(this.data);
  },
  //血压
  createSimulationPause: function () {
    var that = this;

    var categories = [];
    var highMax = [];
    var highMin = [];
    var lowMax = [];
    var lowMin = [];

    var openid = wx.getStorageSync('token').openid;
    console.log("高压openid:" + openid);
    var url_pause = 'https://www.3firelink.xyz/smart_watch/dev/id/' + devid + '/bloodpress_h?date=' + dateShow + '&days=6&userAgent=' + openid;
    console.log('高压链接');
    console.log(url_pause);
    wx.request({
      url: url_pause,
      success: function (res_health_bloodpress_h) {
        console.log("高压返回数据：" + JSON.stringify(res_health_bloodpress_h));
        var count = res_health_bloodpress_h.data.length;
        console.log(count);
        if (count > 0) {
          for (var i = 0; i < count; i++) {
            categories.push(res_health_bloodpress_h.data[i].date.substring(5, 10));
            highMax.push(res_health_bloodpress_h.data[i].data.max);
            highMin.push(res_health_bloodpress_h.data[i].data.min);
            console.log("date:" + res_health_bloodpress_h.data[i].date);
          }
        } else if (res_health_bloodpress_h.data == []) {
          for (var i = 0; i < count; i++) {
            categories.push('');
            highMax.push(0);
            highMin.push(0);
          }
        }
        var openid = wx.getStorageSync('token').openid;
        console.log("低压openid:" + openid);
        var url_pause_l = 'https://www.3firelink.xyz/smart_watch/dev/id/' + devid + '/bloodpress_l?date=' + dateShow + '&days=6&userAgent=' + openid;
        console.log('低压链接');
        console.log(url_pause_l);
        wx.request({
          url: url_pause_l,
          success: function (res_health_bloodpress_l) {
            console.log("低压返回数据：" + JSON.stringify(res_health_bloodpress_l));
            var count2 = res_health_bloodpress_l.data.length;
            console.log("count2:" + count2);
            for (var i = 0; i < count2; i++) {
              lowMax.push(res_health_bloodpress_l.data[i].data.max);
              lowMin.push(res_health_bloodpress_l.data[i].data.min);
              //console.log(res_health_bloodpress_l.data[i]);
            }
            var pauseData = {
              categories: categories,
              highMax: highMax,
              highMin: highMin,
              lowMax: lowMax,
              lowMin: lowMin
            }
            const option = {
              color: ['#fd0002', '#ff9900', '#00af43', '#04c8f9'],
              legend: {
                data: ['高压极大值', '高压极小值', '低压极大值', '低压极小值'],
                top: 0,
                left: 'center',
                z: 100
              },
              grid: {
                containLabel: true
              },
              tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                  snap: true,
                },
                textStyle: {
                  fontSize: 4
                },
                position: ['50%', '35%']
              },
              xAxis: {
                type: 'category',
                boundaryGap: true,
                data: pauseData.categories
                //data: ['10-01','10-02','10-03','10-04']
                // show: false
              },
              yAxis: {
                name: '血压值（mmHg）',
                nameLocation: 'center',
                nameGap: 35,
                x: 'center',
                type: 'value',
                scale: true,
                splitLine: {
                  lineStyle: {
                    type: 'dashed'
                  }
                }
                // show: false
              },
              series: [{
                name: '高压极大值',
                type: 'line',
                smooth: true,
                data: pauseData.highMax,
                label: {
                  show: true,
                  color: '#000000',
                  formatter: function (param) {
                    return param.data;
                  }
                }
                //data: [118, 115, 119, 114]
              }, {
                name: '高压极小值',
                type: 'line',
                smooth: true,
                data: pauseData.highMin,
                  label: {
                    show: true,
                    color: '#000000',
                    formatter: function (param) {
                      return param.data;
                    }
                  }
                //data: [106, 107, 102, 105]
              }, {
                name: '低压极大值',
                type: 'line',
                smooth: true,
                data: pauseData.lowMax,
                  label: {
                    show: true,
                    color: '#000000',
                    formatter: function (param) {
                      return param.data;
                    }
                  }
                //data: [87,79,85, 82]
              }, {
                name: '低压极小值',
                type: 'line',
                smooth: true,
                data: pauseData.lowMin,
                  label: {
                    show: true,
                    color: '#000000',
                    formatter: function (param) {
                      return param.data;
                    }
                  }
                //data: [75,69,77,72]
              }]
            };

            pauseChart.setOption(option);
          },
          fail: function () {
            console.log("低压网络请求失败");
          },
          complete: function () {
            console.log("低压请求完成");
          }
        })
      }
    })
  },
  //心率
  createSimulationDataRate: function() {
    var that = this;
    var categoriesRate = [];
    var rateMax = [];
    var rateMin = [];
    var openid = wx.getStorageSync('token').openid;
    console.log("心率openid:" + openid);
    var url_pause = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/heartrate?date=' + that.data.dateShow + '&days=6&userAgent=' + openid;
    console.log('心率链接');
    console.log(url_pause);
    wx.request({
      url: url_pause,
      // data: {
      //   date: that.data.dateShow,
      //   days: 6
      // },
      success: function(res_health_heartrate) {
        console.log('心率数据');
        console.log(res_health_heartrate);
        var count = res_health_heartrate.data.length;
        console.log(count);
        for (var i = 0; i < count; i++) {
          categoriesRate.push(res_health_heartrate.data[i].date.substring(5, 10));
          rateMax.push(res_health_heartrate.data[i].data.max);
          rateMin.push(res_health_heartrate.data[i].data.min);
          console.log("date:" + res_health_heartrate.data[i].date);
        }
        var rateData = {
          categories: categoriesRate,
          rateMax: rateMax,
          rateMin: rateMin
        }
        // console.log(categories);
        // console.log(highMax);
        // console.log(highMin);
        const option = {
          color: ['#fd0002', '#00af43'],
          legend: {
            data: ['心率极大值', '心率极小值'],
            top: 0,
            left: 'center',
            z: 100
          },
          grid: {
            containLabel: true
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
              snap: true,
            },
            textStyle: {
              fontSize: 4
            },
            position: ['50%', '35%']
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            data: rateData.categories
            //data: ['10-01','10-02','10-03']
            // show: false
          },
          yAxis: {
            name: '心率值（次/分）',
            nameLocation: 'center',
            nameGap: 35,
            x: 'center',
            type: 'value',
            scale: true,
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
            // show: false
          },
          series: [{
            name: '心率极大值',
            type: 'line',
            smooth: true,
            data: rateData.rateMax,
            label: {
              show: true,
              color: '#000000',
              formatter: function (param) {
                return param.data;
              }
            }
            //data: [118, 115, 119]
          }, {
            name: '心率极小值',
            type: 'line',
            smooth: true,
            data: rateData.rateMin,
              label: {
                show: true,
                color: '#000000',
                formatter: function (param) {
                  return param.data;
                }
              }
            //data: [106, 107, 102]
          }]
        };
        rateChart.setOption(option);
      }
    })
  },
  //血氧
  createSimulationDataContent: function() {
    var that = this;
    var categoriesContent = [];
    var contentMax = [];
    var contentMin = [];
    var openid = wx.getStorageSync('token').openid;
    console.log("血氧openid:" + openid);
    var url_content = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/bloodoxy?date=' + that.data.dateShow + '&days=6&userAgent=' + openid;
    console.log('血氧链接');
    console.log(url_content);
    wx.request({
      url: url_content,
      success: function(res_health_bloodoxy) {
        console.log('血氧数据');
        console.log(res_health_bloodoxy);
        var count = res_health_bloodoxy.data.length;
        console.log(count);
        for (var i = 0; i < count; i++) {
          categoriesContent.push(res_health_bloodoxy.data[i].date.substring(5, 10));
          contentMax.push(res_health_bloodoxy.data[i].data.max);
          contentMin.push(res_health_bloodoxy.data[i].data.min);
          console.log("date:" + res_health_bloodoxy.data[i].date);
        }
        var contentData = {
          categories: categoriesContent,
          contentMax: contentMax,
          contentMin: contentMin
        }
        // console.log(categories);
        // console.log(highMax);
        // console.log(highMin);
        const option = {
          color: ['#ff9900', '#04c8f9'],
          legend: {
            data: ['血氧极大值', '血氧极小值'],
            top: 0,
            left: 'center',
            z: 100
          },
          grid: {
            containLabel: true
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
              snap: true,
            },
            textStyle: {
              fontSize: 4
            },
            position: ['50%', '35%']
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            data: contentData.categories
            //data: ['10-01','10-02','10-03']
            // show: false
          },
          yAxis: {
            name: '血氧饱和度（%）',
            nameLocation: 'center',
            nameGap: 35,
            x: 'center',
            type: 'value',
            max: 100,
            scale: true,
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
            // show: false
          },
          series: [{
            name: '血氧极大值',
            type: 'line',
            smooth: true,
            data: contentData.contentMax,
            label: {
              show: true,
              color: '#000000',
              formatter: function (param) {
                return param.data;
              }
            }
            //data: [118, 115, 119]
          }, {
              name: '血氧极小值',
            type: 'line',
            smooth: true,
              data: contentData.contentMin,
              label: {
                show: true,
                color: '#000000',
                formatter: function (param) {
                  return param.data;
                }
              }
            //data: [106, 107, 102]
          }]
        };
        contentChart.setOption(option);
      }
    })
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      //dateShow: that.data.year + '-' + that.data.month + '-' + that.data.day,
      devid: options.devid,
    });
    devid = options.devid
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
    wx.request({
      url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/dbs',
      success: function(res_switch_get) {
        console.log("提醒开关状态：");
        console.log(res_switch_get);
        if (res_switch_get.data == 0) {
          that.setData({
            isChecked_measure: false
          })
        } else if (res_switch_get.data == 1) {
          that.setData({
            isChecked_measure: true
          })
        }
        if (that.data.isChecked_measure == true) {
          wx.request({
            url: 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/dbstime',
            success: function(res_time_get) {
              console.log("获取当前设置的提醒时间:");
              console.log(res_time_get);
              that.setData({
                time: res_time_get.data.time.replace("@", ":"),
                showTime: true,
              })
            }
          })
        }
      }
    })
    if (that.data.month < 10) {
      that.setData({
        dateShow: that.data.year + '-' + '0' + that.data.month + '-' + that.data.day
      });
      dateShow = that.data.year + '-' + '0' + that.data.month + '-' + that.data.day
    } else if (that.data.day < 10) {
      that.setData({
        dateShow: that.data.year + '-' + that.data.month + '-' + '0' + that.data.day
      });
      dateShow = that.data.year + '-' + that.data.month + '-' + '0' + that.data.day
    } else if (that.data.day < 10 && that.data.month < 10) {
      that.setData({
        dateShow: that.data.year + '-' + '0' + that.data.month + '-' + '0' + that.data.day
      });
      dateShow = that.data.year + '-' + '0' + that.data.month + '-' + '0' + that.data.day
    } else {
      that.setData({
        dateShow: that.data.year + '-' + that.data.month + '-' + that.data.day
      })
      dateShow = that.data.year + '-' + that.data.month + '-' + that.data.day
    }
    console.log("dateShow:" + that.data.dateShow);
    this.getSportData();
    this.createSimulationPause();
    this.createSimulationDataRate();
    this.createSimulationDataContent();
  },
  getSportData: function() {
    var that = this;
    var openid = wx.getStorageSync('token').openid;
    console.log("运动openid:" + openid);
    var url_sport = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/steps?date=' + that.data.dateShow + '&days=0&userAgent=' + openid;
    console.log(url_sport);
    wx.request({
      url: url_sport,
      success: function(res) {
        console.log("运动步数：")
        console.log(res);
        if (res.data.length != 0 && res.data[0].info != null) {
          var miles = parseFloat(res.data[0].info * 0.0007).toFixed(4)
          that.setData({
            steps: res.data[0].info,
            miles: miles
          })
        } else {
          that.setData({
            steps: 0,
            miles: '0.0000'
          })
        }
      }
    })
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