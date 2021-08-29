// pages/register/register.js
var dateTimePicker = require('../../utils/dateTimePicker.js');
const app = getApp()
var nicknames = []
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nicknames:[], // 现在数据库中已经存在的昵称
    startYear: 2000,
    endYear: 2050,
    dateTime: null,
    dateTimeArray: null,
    date:"2021-01-01",
    files: [],
    sexs:["男","女"],
    form:{
      image:"",
      nickname:"",
      realname:"",
      phone:"",
      sex:"男",
      birthday:"2021-01-01"
    },
    errorMsg: '', // 验证表单显示错误信息
    rules: [
      {
        name: 'nickname',
        rules: [{required: true, message: '请填写昵称姓名'},
        {validator:(rule,value,param,models)=>{
           console.log(rule,value,param,models)
          if (nicknames.indexOf(models.nickname) > -1){
            return rule.message
          }
         
        }, message: '昵称已存在'} ],
      },
      {
        name: 'realname',
        rules: {required: true, message: '请填写真实姓名'},
      },
      {
        name: 'phone',
        rules: [{required: true, message: '请填写手机号'}, {mobile: true, message: '电话格式不对'}]
      },
    ],
 
  },

  //文本框输入触发的函数
  formInputChange(e) {
    var me = this
    const filed = e.currentTarget.dataset.filed
    me.setData({
      [`form.${filed}`]: e.detail.value
    })
  },

  //选择时间方法
changeDate(e) {
  this.setData({
    date: e.detail.value
  });
},

changeDateTime(e) {
  var me = this
  me.setData({
    dateTime: e.detail.value
  });
  var dateTimeArray = me.data.dateTimeArray
  var dateTime = me.data.dateTime
  me.setData({
    "form.birthday":dateTimeArray[0][dateTime[0]] + "-" + dateTimeArray[1][dateTime[1]] + "-" + dateTimeArray[2][dateTime[2]]
  })
},

changeDateTimeColumn(e) {
  console.log("changeDateTimeColumn")
  var arr = this.data.dateTime,
    dateArr = this.data.dateTimeArray;

  arr[e.detail.column] = e.detail.value;
  dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

  this.setData({
    dateTimeArray: dateArr,
    dateTime: arr
  });
},
  // 选择男女
  bindPickerSex:function(e){
    var me = this
    var index = e.detail.value
    me.setData({
      "form.sex":me.data.sexs[index],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    var serverUrl = app.serverUrl;
    var obj = dateTimePicker.dateTimePicker(me.data.startYear, me.data.endYear);
    me.setData({
      dateTime: obj.dateTime.splice(0,3),
      dateTimeArray: obj.dateTimeArray.splice(0,3),
     });
    
   //查询现在数据库中所有存在用户的昵称
   wx.request({
     url: serverUrl + "getNicknames",
     method:"GET",
     header: {
      'content-type': 'application/json' // 默认值
    },
    success:function(res){
      if (res.statusCode == 200 && res.data.status == "200"){
        console.log(res.data.nicknames)
        nicknames = res.data.nicknames
      }else{
        wx.showToast({
          title: "昵称请求失败",
          icon:"none",
          duration: 2000
        })
      }

    }
   })

    me.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
  })
  },
  previewImage: function(e){
    wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.files // 需要预览的图片http链接列表
    })
},
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },
  uplaodFile(files) {
      console.log('upload files', files)
      // 文件上传的函数，返回一个promise
      return new Promise((resolve, reject) => {
        var urls = files.tempFilePaths
        resolve({urls})
          setTimeout(() => {
              reject('some error')
          }, 1000)
      })
  },
  uploadError(e) {
      console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    var me = this
    console.log('upload success', e.detail.urls[0])
    me.setData({
      "form.image":e.detail.urls[0]
    })
  },
 //选择上传图片
 chooseImage: function (e) {
  var that = this;
  wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          console.log("res.tempFilePaths",res.tempFilePaths)
          that.setData({
              files: that.data.files.concat(res.tempFilePaths)
          });
      }
  })
},

// 点击注册按钮
  // 点击确定按钮
  weSubmitForm:function(e){
    console.log(this.data.form)
    const {content, realname, phone, dateTime, dateTimeArray} = this.data.form
    console.log(content, realname,phone, dateTime,dateTimeArray)
    this.selectComponent('#form').validate((valid,errors) => {
      if(!valid){
        const firstError = Object.keys(errors)
        if(firstError.length){
          this.setData({
            errorMsg:errors[firstError[0]].message
          })
        }
      }else{
          // console.log('jinlai',app.getGlobalUserInfo().id)
          // var serverUrl = app.serverUrl;
          // wx.showLoading({
          //   title: '请等待...',
          // });
          // wx.request({
          //   url: serverUrl + 'appointment',
          //   method: "POST",
          //   data: {
          //     user_id:app.getGlobalUserInfo().id,
          //     form: this.data.form
          //   },
          //   header: {
          //     'content-type': 'application/json' // 默认值
          //   },
          //   success:function(res){
          //     console.log(res)
          //     if (res.statusCode == 200 && res.data.status == "200"){
          //       wx.showToast({
          //         title: res.data.msg,
          //         icon: 'success',
          //         duration: 2000
          //       })
          //     }else{
          //       wx.showToast({
          //         title: "请求失败",
          //         icon:"none",
          //         duration: 2000
          //       })
          //     }
  
          //   },
          //   fail:function(){
          //     wx.hideLoading();
          //     wx.showToast({
          //       title: '请求出错',
          //       icon:'none',
          //       duration: 3000
          //     })
          //   }
          // })
          wx.showToast({
            title: '提交成功',
          })
          wx.navigateBack({
            delta: 1,
          })
        
      }
    })
  },

// 点击直接登陆按钮
restForm() {
  wx.redirectTo({
    url: '../../pages/login/login',
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