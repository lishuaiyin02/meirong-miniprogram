// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,//获得用户的信息
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    modalHidden:true,//登陆框不显示
    inputContent:'',//密码输入为空
    isPassword:false,//是否显示密码
    show:'password',//原始为密码形式
    isUperuser:false,//判断是不是超级管理权限，传给下一个select页面

  },
  autoreply:function(){
    
    wx.cloud.callFunction({
      name:"autoReply",
      data:{

      },
    })
  },
  //获得当前用户的openID
  getopenID:function(){
    var that=this
    var openid=wx.getStorageSync('openid')
    wx.setClipboardData({
      data: openid,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
    wx.showModal({
      title: '您的OPENID为',
      content: openid,
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  //点击我要加入触发的事件
  join:function(){
    wx.navigateTo({//公众号的id
      url: '../../pages/joinProcess/joinProcess' ,
    })
  },
  //点击使用说明触发事件
  introduce:function(){
    wx.navigateTo({
      url: '../../pages/introduce/introduce',
    })
  },
  showModal: function (event) {
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
  },
  /////显示密码或者隐藏密码的图片控住函数
  showPassword: function() {
    var that=this
    if (this.data.isPassword) {   //如果this.data.isShow为true,则表示为密码小黑点
      this.setData({
        isPassword:!this.data.isPassword,
        show:"password"
      })
    } else {
      this.setData({
        isPassword: !this.data.isPassword,
        show: "text"
      })
    }
  },
// 获取弹出框密码
  getInputContent: function (e) {
    // console.log(e.detail.value)
    this.setData({
      inputContent: e.detail.value
    })
  },
   //确定
   modalBindaconfirm: function () {
    var that = this;
    console.log(that.data.inputContent)
    if (that.data.inputContent == "") {
      wx.showToast({
        title: '秘钥不能为空！',
        icon: 'none',
      })
    } else {
      //通过秘钥换取公众号 id
      that.getIdentifyId();
      that.setData({
        inputContent:"" //密码输入完成之后需要将内容置空，否则下次进入页面的时候会显示之前输入的密码
      })
    }
  },
  getIdentifyId: function () {
    var that = this;
    var openid=wx.getStorageSync('openid')
    if(openid==""){
      wx.cloud.callFunction({
        name:'getOpenid',
        success:function(re){
          wx.setStorageSync('openid', re.result.openid);//存储openid
          openid=re.result.openid
        },
        fail:function(re){
          wx.showToast({
            title: '获取openID失败',
            icon: 'none',
          })
        }
      })
    }
    wx.cloud.callFunction({
      name: "GetIdentifyId",
      data: {
        password: that.data.inputContent, //登录后台密码
        openid:openid
      },
      success: function (res) {
        console.log("res是", res);
        if (res.result.data[0] !== undefined) {
          if(openid==res.result.data[0].openid){
            that.setData({
              isUperuser:true
            })
          }
          that.setData({
            modalHidden: !that.data.modalHidden,//弹出框消失
            //buttonDisabled: !that.data.buttonDisabled,
            id: res.result.data[0]._id,
          })
          console.log("id是：", that.data.id)
          wx.navigateTo({//公众号的id
            url: '../../pages/select/select?id=' + that.data.id + "&avatarUrl=" + that.data.userInfo.avatarUrl + "&nickName=" + that.data.userInfo.nickName + "&headpath=" + res.result.data[0].headpath + "&name=" + res.result.data[0].name + "&describe=" + res.result.data[0].describes + "&password=" + res.result.data[0].password + "&fileID=" + res.result.data[0].fileID +"&isUperuser="+that.data.isUperuser
          })
          
        }else{
          wx.showToast({
            title: '你不是管理员或者密码错误',
            icon: 'none',
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
        wx.showToast({
          title: '联网失败',
          icon: 'fail',
        })
      },
    })
  },

  //取消
  modalBindcancel: function () {
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
  },
 getUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('username', that.data.userInfo.nickName)
      wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
      console.log("在index页面临时授权中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
    } else {
      console.log("用户取消授权");
      return;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('username', that.data.userInfo.nickName)
      wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
      console.log("在index页面全局app1中获取到的用户信息为：" + that.data.userInfo.nickName + " " +
        that.data.userInfo.avatarUrl);
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('username', that.data.userInfo.nickName)
        wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
        console.log("在index页面全局app2中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
      }
    } else {
      //没有获取到用户信息就发起授权窗口
      // 没有获取到用户信息就发起授权窗口
      wx.getUserInfo({
        success: res => {
          // console.log("用户名3：" + res.userInfo.nickName + " " + res.userInfo.avatarUrl)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.setStorageSync('username', that.data.userInfo.nickName)
          wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
          console.log("在index页面全局app3中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
        },
      })
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