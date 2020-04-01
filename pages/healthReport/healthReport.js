// pages/healthReport/healthReport.js
import * as echarts from '../../ec-canvas/echarts';
var windowWidth = 320;
var windowHeight = 460;
var lineStepsChart = null;
var columnStepChart = null;
var lineChartPressure = null;
var lineChartRate = null;
var lineChartContent = null;
let stepDayChart = null;
let stepWeekChart = null;
let pauseWeekChart = null;
let rateWeekChart = null;
let contentWeekChart = null;
try {
  var res = wx.getSystemInfoSync();
  windowWidth = res.windowWidth;
  windowHeight = res.windowHeight;
} catch (e) {
  console.error('getSystemInfoSync failed!');
}
var chartWidth = null;
var chartHeight = null;

function initStepDayChart(canvas, width, height) {
  stepDayChart = echarts.init(canvas, null, {
    width: width - 20,
    height: height
  });
  chartWidth = width;
  chartHeight = height;
  canvas.setChart(stepDayChart);
  return stepDayChart
}

function initStepWeekChart(canvas, width, height) {
  stepWeekChart = echarts.init(canvas, null, {
    width: width - 20,
    height: height
  });
  canvas.setChart(stepWeekChart);
  return stepWeekChart
}

function initPauseWeekChart(canvas, width, height) {
  pauseWeekChart = echarts.init(canvas, null, {
    width: width - 20,
    height: height
  });
  canvas.setChart(pauseWeekChart);
  return pauseWeekChart
}

function initRateWeekChart(canvas, width, height) {
  rateWeekChart = echarts.init(canvas, null, {
    width: width - 20,
    height: height
  });
  canvas.setChart(rateWeekChart);
  return rateWeekChart
}

function initContentWeekChart(canvas, width, height) {
  contentWeekChart = echarts.init(canvas, null, {
    width: width - 20,
    height: height
  });
  canvas.setChart(contentWeekChart);
  return contentWeekChart
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    devid: null,
    categories_steps_week: [],
    categories_health: [],
    weekSteps: [],
    pauseMax: [],
    pauseMin: [],
    pauseMax: [],
    daySteps: [],
    rateMax: [],
    rateMin: [],
    contentMax: [],
    contentMin: [],
    note_week_step: '',
    note_week_rate: '',
    note_week_content: '',
    note_week_pause: '',
    note: '',
    max_steps: 16636,
    average_steps: 11585,
    chartWidth: chartWidth,
    chartHeight: chartHeight,
    ec_week_step: {
      disableTouch: true,
      onInit: initStepDayChart
    },
    ec_day_step: {
      disableTouch: true,
      onInit: initStepWeekChart
    },
    ec_week_pause: {
      disableTouch: true,
      onInit: initPauseWeekChart
    },
    ec_week_rate: {
      disableTouch: true,
      onInit: initRateWeekChart
    },
    ec_week_content: {
      disableTouch: true,
      onInit: initContentWeekChart
    }
  },

  //周步数
  createSimulationWeekSteps: function() {
    var that = this;
    var categories_steps_week = new Array();
    var weekSteps = [];
    var openid = wx.getStorageSync('token').openid;
    console.log("步数openid:" + openid);
    var url_weekSteps = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/totalsteps?userAgent=' + openid;
    console.log('周步数链接');
    console.log(url_weekSteps);
    wx.request({
      url: url_weekSteps,
      success: function(res_weekSteps) {
        console.log("周步数数据");
        console.log(res_weekSteps);
        var count = res_weekSteps.data.data.length;
        console.log(count);
        for (var i = count - 1; i >= 0; i--) {
          categories_steps_week.push(res_weekSteps.data.data[i].date);
          weekSteps.push(parseInt(res_weekSteps.data.data[i].data));
        }
        console.log(categories_steps_week);
        var option = {
          color: ["#67E0E3"],
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
            data: categories_steps_week,
            // show: false
          },
          yAxis: {
            name: '周总步数（步）',
            nameLocation: 'center',
            nameGap: 30,
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
            name: '本周总步数',
            type: 'line',
            smooth: true,
            data: weekSteps,
            label: {
              show: true,
              color: '#000000',
              formatter: function(param) {
                return param.data;
              }
            }
          }]
        };
        stepDayChart.setOption(option);
        console.log("note_week_step:" + res_weekSteps.data.remark.note);
        that.setData({
          note: res_weekSteps.data.remark.note
        })
      }
    })
  },
  //日步数
  createSimulationDaySteps: function() {
    var that = this;
    var categories_health = new Array();
    var daySteps = [];
    var openid = wx.getStorageSync('token').openid;
    console.log("日步数openid:" + openid);
    var url_daySteps = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/weekstep?userAgent=' + openid;
    console.log('日步数链接');
    console.log(url_daySteps);
    wx.request({
      url: url_daySteps,
      success: function(res_daySteps) {
        console.log('日步数数据');
        console.log(res_daySteps);
        var count = res_daySteps.data.data.length;
        console.log(count);
        for (var i = count - 1; i >= 0; i--) {
          categories_health.push(res_daySteps.data.data[i].date);
          daySteps.push(parseInt(res_daySteps.data.data[i].data));
        }
        var option = {
          color: ["#9FE6B8"],
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
            axisLabel: {
              interval: 0
            },
            data: categories_health,
            //data: ['10/08', '10/09', '10/10', '10/11', '10/12', '10/13', '10/14']
            // show: false
          },
          yAxis: {
            name: '上周每日步数（步）',
            nameLocation: 'center',
            nameGap: 30,
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
            name: '步数',
            type: 'bar',
            smooth: true,
            data: daySteps,
            label: {
              show: true,
              color: '#000000',
              position: 'top',
              formatter: function (param) {
                return param.data;
              }
            },
            //data: [98, 213, 3223, 124, 2332, 1423, 2353],
            barWidth: 20
          }]
        };
        stepWeekChart.setOption(option);
        that.setData({
          note_week_step: res_daySteps.data.remark.note
        })
      }
    })
  },

  //血压
  createSimulationPause: function() {
    var that = this;
    var categories_health = new Array();
    var pauseMax = [];
    var pauseMin = [];
    var openid = wx.getStorageSync('token').openid;
    console.log("血压openid:" + openid);
    var url_pause = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/weekpress?userAgent=' + openid;
    console.log('血压链接');
    console.log(url_pause);
    wx.request({
      url: url_pause,
      success: function(res_health_bloodpress) {
        console.log("周血压数据");
        console.log(res_health_bloodpress);
        var count = res_health_bloodpress.data.data.length;
        console.log(count);
        for (var i = count - 1; i >= 0; i--) {
          categories_health.push(res_health_bloodpress.data.data[i].date);
          pauseMax.push(parseInt(res_health_bloodpress.data.data[i].data.max));
          pauseMin.push(parseInt(res_health_bloodpress.data.data[i].data.min));
        }
        var option = {
          color: ['#fd0002', '#ff9900'],
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
            axisLabel: {
              interval: 0
            },
            data: categories_health,
            //data: ['10/08', '10/09', '10/10', '10/11', '10/12', '10/13', '10/14']
            // show: false
          },
          yAxis: {
            name: '上周每日平均动脉压（mmHg）',
            nameLocation: 'center',
            nameGap: 30,
            x: 'center',
            scale: true,
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
            // show: false
          },
          series: [{
            name: '平均动脉压极大值',
            type: 'line',
            smooth: true,
            data: pauseMax,
            label: {
              show: true,
              color: '#000000',
              formatter: function (param) {
                return param.data;
              }
            }
            //data: [98, 213, 3223, 124, 2332, 1423, 2353]
          }, {
            name: '平均动脉压极小值',
            type: 'line',
            smooth: true,
            data: pauseMin,
              label: {
                show: true,
                color: '#000000',
                formatter: function (param) {
                  return param.data;
                }
              }
            //data: [90, 4, 3223, 124, 2332, 1423, 2353]
          }]
        };
        pauseWeekChart.setOption(option);
        that.setData({
          note_week_pause: res_health_bloodpress.data.remark.note
        })
      }
    })
  },

  //心率
  createSimulationRate: function() {
    var that = this;
    var categories_health = new Array();
    var rateMax = [];
    var rateMin = [];
    var openid = wx.getStorageSync('token').openid;
    console.log("心率openid:" + openid);
    var url_pause = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/weekheart?userAgent=' + openid;
    console.log('心率链接');
    console.log(url_pause);
    wx.request({
      url: url_pause,
      success: function(res_health_heartrate) {
        console.log("周心率数据");
        console.log(res_health_heartrate);
        var count = res_health_heartrate.data.data.length;
        console.log(count);
        for (var i = count - 1; i >= 0; i--) {
          categories_health.push(res_health_heartrate.data.data[i].date);
          rateMax.push(parseInt(res_health_heartrate.data.data[i].data.max));
          rateMin.push(parseInt(res_health_heartrate.data.data[i].data.min));
        }
        var option = {
          color: ['#00af43', '#04c8f9'],
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
            axisLabel: {
              interval: 0
            },
            data: categories_health,
            //data: ['10/08', '10/09', '10/10', '10/11', '10/12', '10/13', '10/14']
            // show: false
          },
          yAxis: {
            name: '上周每日心率（次/分）',
            nameLocation: 'center',
            nameGap: 30,
            x: 'center',
            scale: true,
            type: 'value',
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
            data: rateMax,
            label: {
              show: true,
              color: '#000000',
              formatter: function (param) {
                return param.data;
              }
            }
            //data: [98, 213, 3223, 124, 2332, 1423, 2353]
          }, {
            name: '心率极小值',
            type: 'line',
            smooth: true,
            data: rateMin,
              label: {
                show: true,
                color: '#000000',
                formatter: function (param) {
                  return param.data;
                }
              }
            //data: [90, 4, 3223, 124, 2332, 1423, 2353]
          }]
        };
        rateWeekChart.setOption(option);
        that.setData({
          note_week_rate: res_health_heartrate.data.remark.note
        })
      }
    })
  },

  //血氧
  createSimulationCotent: function() {
    var that = this;
    var categories_health = new Array();
    var contentMax = [];
    var contentMin = [];
    var openid = wx.getStorageSync('token').openid;
    console.log("血氧openid:" + openid);
    var url_content = 'https://www.3firelink.xyz/smart_watch/dev/id/' + that.data.devid + '/weekoxy?userAgent=' + openid;
    console.log('血氧链接');
    console.log(url_content);
    wx.request({
      url: url_content,
      success: function(res_health_oxycontent) {
        console.log("周血氧数据");
        console.log(res_health_oxycontent);
        var count = res_health_oxycontent.data.data.length;
        console.log(count);
        for (var i = count - 1; i >= 0; i--) {
          categories_health.push(res_health_oxycontent.data.data[i].date);
          contentMax.push(parseInt(res_health_oxycontent.data.data[i].data.max));
          contentMin.push(parseInt(res_health_oxycontent.data.data[i].data.min));
        }
        var option = {
          color: ["#60B6E3", "#FF7070"],
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
            axisLabel: {
              interval: 0
            },
            data: categories_health,
            //data: ['10/08', '10/09', '10/10', '10/11', '10/12', '10/13', '10/14']
            // show: false
          },
          yAxis: {
            name: '上周每日血氧饱和度（次/分）',
            nameLocation: 'center',
            nameGap: 30,
            x: 'center',
            scale: true,
            max: 100,
            type: 'value',
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
            data: contentMax,
            label: {
              show: true,
              color: '#000000',
              formatter: function (param) {
                return param.data;
              }
            }
            //data: [98, 213, 3223, 124, 2332, 1423, 2353]
          }, {
            name: '血氧极小值',
            type: 'line',
            smooth: true,
            data: contentMin,
              label: {
                show: true,
                color: '#000000',
                formatter: function (param) {
                  return param.data;
                }
              }
            //data: [90, 4, 3223, 124, 2332, 1423, 2353]
          }]
        };
        contentWeekChart.setOption(option);
        that.setData({
          note_week_content: res_health_oxycontent.data.remark.note
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      devid: options.devid
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
    this.createSimulationWeekSteps();
    this.createSimulationDaySteps();
    this.createSimulationPause();
    this.createSimulationRate();
    this.createSimulationCotent();
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