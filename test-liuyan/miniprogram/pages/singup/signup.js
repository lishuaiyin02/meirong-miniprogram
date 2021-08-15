// pages/singup/signup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    g_id:'',//公众号的唯一id
    tempFilePath:'',//公众号的头像
    cloudPath:'',//上传图片时的云路径
    fileID:'',//数据库的文件id 可以获得临时url用
    g_nickName:'',//公众号的名字
    g_describe:'',//公众号的简介
    g_password1:'',//第一次密码
    g_password2:'',//第二次输入密码
    inputTitle:'',//公众号昵称横线处
    inputDesc:'',//公众号简介横线处
    inputNum:'',//密码
    isSubmit:true,//提交
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log("options", options)
    if(options.isSubmit=="false"){
      console.log("是否进来了")
      that.setData({
        g_id: options.g_id,
        tempFilePath: options.headpath,
        inputTitle: options.name,
        inputNum: options.password,
        inputDesc: options.describe,
        

        g_nickName: options.name,
        g_describe: options.describe,
        cloudPath: options.headpath,
        fileID:options.fileID,
        g_password1: options.password,
        g_password2: options.password,
        isSubmit: false//是更新还是提交
      })
    }else{
      that.setData({
        g_id: options.g_id,
        isSubmit: true//是更新还是提交
      })
    }
      
    
   
  },
 //选择照片
 chooseimage:function(){
  var that=this
  wx.chooseImage({
    count:1,//能够选择的张数，默认为9
    sizeType:['original','compressed'],//可以指定是原图还是压缩图
    sourceType:['album','camera'],//可以指定来源是相机还是相册
    success:function(res){
      wx.showLoading({
        title: '上传中',
      })
      console.log("图片路径是:",res.tempFilePaths)
      var timestamp = Date.parse(new Date());//时间戳
      that.setData({
        tempFilePath:res.tempFilePaths[0],
        // cloudPath: timestamp + res.tempFilePaths[0].match(/\.[^.]+?$/)[0],
        cloudPath:that.data.g_id+ res.tempFilePaths[0].match(/\.[^.]+?$/)[0],
      })
      wx.cloud.uploadFile({
        cloudPath:that.data.cloudPath,
        filePath:that.data.tempFilePath,
        success:resa=>{
          that.setData({
            fileID:resa.fileID
          })
          console.log('[上传文件]成功：',resa)
        },
        fail: (res) => {
          console.error('[上传文件]失败：', res)
        },
        complete: (res) => {
          wx.hideLoading()
        },

      })
      
    },
   
    complete: (res) => {
      
    },
  })
},
//上传的昵称
titleInput:function(e){
  this.setData({
    g_nickName: e.detail.value//上传的简介
  })
},
//上传的简介
describeInput:function(e){
  this.setData({
    g_describe: e.detail.value//上传的简介
  })
},
//上传的密码1
numberInput1:function(e){
  this.setData({
    g_password1: e.detail.value//上传的简介
  })
},
//上传的密码2
numberInput2:function(e){
  this.setData({
    g_password2: e.detail.value//上传的简介
  })
},
//点击提交按钮，注册公众号信息
submit:function(){
  var that=this
  //判断数据是否为空 一个也不行
  if (this.data.g_nickName == "" || this.data.g_describe == "" || this.data.cloudPath==""||this.data.g_password1==""||this.data.g_password2==""){
    wx.showToast({
      title: '昵称、描述、文章配图、密码不能为空',
      icon:'none'
    })
    console.log("昵称", this.data.g_nickName, "描述", this.data.g_describe, "路径", this.data.cloudPath, "密码1", this.data.g_password1, "密码2", this.data.g_password2)
  }else{
    if(that.data.g_password1!=that.data.g_password2){
      wx.showToast({
        title: '密码输入不一致，请重新输入',
        icon:'none'
      })
    }else{
       //上传到数据库
    wx:wx.showToast({
      title: '上传中',
      icon:'loading'
    })
    wx.cloud.callFunction({
      name:'updateGonginfo',
      data:{
        g_id:that.data.g_id,//公众号的id
        name:that.data.g_nickName,//文章的名称
        describe:that.data.g_describe,//上传文章的简介
        fileID:that.data.fileID,//上传路径的fileID，下载的时候会用到
        password:that.data.g_password1,//密码
        openid:wx.getStorageSync('openid')//和用户关联
      },
      success:function(res){
        that.setData({
          inputTitle:'',//公众号昵称横线处
          inputDesc:'',//公众号简介横线处
          inputNum:'',//密码
          tempFilePath:'../../images/touxiang.png'
        })
       
       if(that.data.isSubmit){
         wx.showModal({
           title: '注册成功',
           content: '请联系管理员确认',
           success(res) {
             if (res.confirm) {

             } else if (res.cancel) {

             }
           }
         })
       }else{
         wx.showModal({
           title: '修改成功',
           //content: '请联系管理员确认',
           success(res) {
             if (res.confirm) {

             } else if (res.cancel) {

             }
           }
         })

       }
        

      },
      fail:function(res){
        wx.showToast({
          title: '信息上传失败请重新上传',
          icon: 'none',
        })
      },
    })
    }
   
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
    var that = this;
    that.setData({
      inputTitle:'',//公众号昵称横线处
      inputDesc:'',//公众号简介横线处
      inputNum:'',//密码
      tempFilePath:'../../images/touxiang.png'
    })

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