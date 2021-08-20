// pages/yydetails/yydetails.js
var dateTimePicker = require('../../utils/dateTimePicker.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      realname: '',
      phone: ''
 
    },
    errorMsg: '', // 验证表单显示错误信息
    rules: [
      {
        name: 'realname',
        rules: {required: true, message: '请填写真实姓名'},
      },
      {
        name: 'phone',
        rules: [{required: true, message: '请填写手机号'}, {mobile: true, message: '电话格式不对'}]
      },
    ],

    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050
  },
  externalClasses: ['form_item','form_item_region'],

  //选择时间方法
changeDate(e) {
  this.setData({
    date: e.detail.value
  });
},
changeTime(e) {
  this.setData({
    time: e.detail.value
  });
},
changeDateTime(e) {
  this.setData({
    dateTime: e.detail.value
  });
},
changeDateTime1(e) {
  this.setData({
    dateTime1: e.detail.value
  });
},
changeDateTimeColumn(e) {
  var arr = this.data.dateTime,
    dateArr = this.data.dateTimeArray;

  arr[e.detail.column] = e.detail.value;
  dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

  this.setData({
    dateTimeArray: dateArr,
    dateTime: arr
  });
},
changeDateTimeColumn1(e) {
  var arr = this.data.dateTime1,
    dateArr = this.data.dateTimeArray1;

  arr[e.detail.column] = e.detail.value;
  dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

  this.setData({
    dateTimeArray1: dateArr,
    dateTime1: arr
  });
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    // var content = options.content;
    // console.log(content)
    var obj = dateTimePicker.dateTimePicker(me.data.startYear, me.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(me.data.startYear, me.data.endYear);
   // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    
    me.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
     });
    wx.getSystemInfo({
      success: (res) => {
        me.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
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

  }
})