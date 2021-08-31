var dateTimePicker = require('../../utils/dateTimePicker.js');
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp()
Page({
  data: {
    navData: [], //"美瞳", "美甲", "美容", "身体", "减肥"
    currentTab: 0,
    navScrollLeft: 0,
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050

  },
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
  onLoad: function (options) {
    var me = this
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + 'getAclassification',
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(res){
        if (res.statusCode == 200 && res.data.status == "200"){
          console.log(res.data)
          var second_column = res.data.appointment
          var navData = []
          for (var i=0;i<second_column.length;i++){
            navData.push(second_column[i].second_column)
          }
          me.setData({
            navData:res.data.appointment
          })
          // wx.showToast({
          //   title: "",
          //   icon: 'success',
          //   duration: 2000
          // })
        }else{
          wx.showToast({
            title: "请求失败",
            icon:"none",
            duration: 2000
          })
        }
      },
      fail:function(e){
        wx.showToast({
          title: '请求出错',
          icon:'none',
          duration: 3000
        })
      }
    })
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
   // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
     });
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
  },
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  }
})
