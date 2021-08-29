var dateTimePicker = require('../../utils/dateTimePicker.js');
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp()
Page({
  data: {
    navData: [],
    products:['彩妆1',"彩妆2","彩妆3"],
    currentTab: 0,
    navScrollLeft: 0,
    minusStatus: 'disabled',
    form: {
      product:'彩妆1',
      prices: 1,
      num: 1,
      money:null
    },
    index:0,
    errorMsg: '', // 验证表单显示错误信息
    rules: [
        {
          name: 'number',
          rules: [{validator:(rule,value,param,models)=>{
            // console.log(rule,value,param,models.num)
            if(models.num < 1){
              return rule.message
            }
          }, message: '数量必须大于等于1'}]
        },
    ],
  },

  // 选择对应的产品
  bindPickerProduct:function(e){
    var me = this
    var index = e.detail.value
    me.setData({
      "form.product":me.data.navData[me.data.currentTab].contents[index],
      "form.prices":me.data.navData[me.data.currentTab].prices[index]
    })
  },
  // 正则表达式只能输入数字
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  handleInput:function(e){
    var me = this
    let value = me.validateNumber(e.detail.value)
    var minusStatus = value <= 1 ? 'disabled' : 'normal';
    var money = me.data.form.prices * value
    this.setData({
      'form.num':value,
      minusStatus: minusStatus,
      "form.money":money
    })
  },
  /* 点击减号 */  
  bindMinus: function() {  
    var me = this
    var num = me.data.form.num;  
    // 如果大于1时，才可以减  
    if (num > 1) {  
        num --;  
    }  
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';  
    var money = me.data.form.prices * num
    // 将数值与状态写回  
    this.setData({  
        "form.num": num,  
        minusStatus: minusStatus,
        "form.money":money  
    });  
},  
 /* 点击加号 */  
 bindPlus: function() {  
   var me = this
  var num = me.data.form.num;  
  // 不作过多考虑自增1  
  num ++;  
  // 只有大于一件的时候，才能normal状态，否则disable状态  
  var minusStatus = num < 1 ? 'disabled' : 'normal';  
  var money = me.data.form.prices * num
  // 将数值与状态写回  
  me.setData({  
      "form.num": num,  
      minusStatus: minusStatus,
      "form.money":money  
  });  
},  

  onLoad:function(options) {
    var me = this
    var money = me.data.form.prices*me.data.form.num
    me.setData({
      "form.money":money
    })
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + 'getOclassification',
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
            navData:res.data.appointment,
            "form.prices":res.data.appointment[0].prices[0],
            "form.product":res.data.appointment[0].contents[0]
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
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
      var products = this.data.navData[this.data.currentTab].contents
      var prices = this.data.navData[this.data.currentTab].prices
      this.setData({
        "form.product":products[0],
        "form.prices":prices[0]
      })
    }
  },
   // 点击确定按钮
   weSubmitForm:function(e){
    console.log(this.data.form)
    this.selectComponent('#form').validate((valid,errors) => {
      if(!valid){
        const firstError = Object.keys(errors)
        if(firstError.length){
          this.setData({
            errorMsg:errors[firstError[0]].message
          })
        }
      }else{
        var serverUrl = app.serverUrl;
          wx.showLoading({
            title: '请等待...',
          });
          wx.request({
            url: serverUrl + 'order',
            method: "POST",
            data: {
              user_id:app.getGlobalUserInfo().id,
              form: this.data.form
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success:function(res){
              console.log(res)
              if (res.statusCode == 200 && res.data.status == "200"){
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 2000
                })
              }else{
                wx.showToast({
                  title: "请求失败",
                  icon:"none",
                  duration: 2000
                })
              }
            },
            fail:function(){
              wx.hideLoading();
              wx.showToast({
                title: '请求出错',
                icon:'none',
                duration: 3000
              })
            }
          })
          
      }
    })
  },
  // 点击重置按钮
  restForm() {
    var me = this
    var num = 1
    var money = num * me.data.form.prices
    me.setData({
      "form.num": 1,
      "form.money":money,
      minusStatus:"disabled"
    })
  },
})
