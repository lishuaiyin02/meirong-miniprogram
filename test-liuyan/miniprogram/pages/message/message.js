// pages/message/message.js
const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonDisabled: false,
    modalHidden: true,
    userInfo: {},
    hasUserInfo: false,
    //判断小程序的组件在当前版本是否可用
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    messages: [],
    no: '',//文章的标号 代表第几篇文章
    title: '',//文章的标题
    url:'',//文章的网址
    authormessages: new Array(),//作者回复信息
    authorBool: new Array(),//显示回复数组
    ishave: false, //是否有筛选留言（是否显示赞）
    status: new Array(),//点赞的状态
    goodarray: new Array(),//所有点赞数
    isTop: new Array(),//置顶留言
    isZanall:new Array(),//存储所有的点赞的openID
    g_id: '' //公众号id

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log("留言页面的公众号编号为：" + options.g_id, options.no)
    that.setData({
     // title:options.title,
      no:options.no,
      g_id:options.g_id
    })
    //获取当前文章的url和标题
    wx.cloud.callFunction({
      name:'getTitleurl',
      data:{
        g_id:options.g_id,
        no:options.no,
      },
      success:function(res){
        console.log("返回的res2222",res)
        that.setData({
          title:res.result.data[0].title,//获得标题
          url:res.result.data[0].url,//获得文章的网址
        })
      }
    })
    //获取已精选留言内容
    that.getChooseContent();

    // 如果获取到用户信息就存储
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('username', that.data.userInfo.nickName)
      wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
      console.log("在index页面全局app1中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        // console.log("用户名2：" + res.userInfo.nickName + " " + res.userInfo.avatarUrl)
        //  wx.setStorageSync('username', res.userInfo.nickName)
        //  wx.setStorageSync('headpath', res.userInfo.avatarUrl)
         wx.setStorageSync('openid', data)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('username', that.data.userInfo.nickName)
        wx.setStorageSync('headpath', that.data.userInfo.avatarUrl)
        wx.setStorageSync('openid', that.data.userInfo.openid)
        console.log("在index页面全局app2中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
      }
    } else {
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
          wx.setStorageSync('openid', that.data.userInfo.openid)
          console.log("在index页面全局app3中获取到的用户信息为：" + that.data.userInfo.nickName + " " + that.data.userInfo.avatarUrl);
        },
      })
    }
  },

  //跳回原文中
  to_article:function(){
    var that=this
    console.log("网址是：", that.data.url)
    wx: wx.navigateTo({
      url: '../../pages/rawarticle/rawarticle?url='+that.data.url,
    })
  },
  //授权弹窗
  //点击按钮授权
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
      console.log('用户取消授权');
      return;
    }
  },

    //获取已精选留言内容
  getChooseContent:function(){
    var that=this;
    wx.cloud.callFunction({
      name:"getMessages",
      data:{
        no:that.data.no,//文章的标号
        g_id:that.data.g_id,//公众号的id
        ischeck:true,//是否为精选留言
      },
      success: function (res) {
        console.log("返回的res为",res)
        var post_messages = res.result.data
        if (!post_messages.length){
          wx.showToast({
            title: '还没有用户留言',
            icon: 'none',
          })
        }else{
          var arraymessage = new Array(post_messages.length);//作者回复的内容
          var isReplyArray = new Array(post_messages.length);//作者是否回复
          var isstatus = new Array(post_messages.length);//点赞的状态
          var goodarr = new Array(post_messages.length);//点赞的总数
          var istop = new Array(post_messages.length);//判断是否置顶
          var isZantem = new Array(post_messages.length);
          for (var i = 0; i < post_messages.length;i++){
            isZantem[i] = post_messages[i].isZan
            goodarr[i]=post_messages[i].zanCount//点赞的总数
            istop[i]=post_messages[i].isTop//判断是否置顶
            for (var inde = 0; inde < post_messages[i].isZan.length;inde++){
              if (post_messages[i].isZan[inde] == wx.getStorageSync('openid')){
                isstatus[i]=true
                break
              } else {
                isstatus[i] = false
              }
            }

            //isstatus[i]=post_messages[i].isZan//判断是否点赞 isZan改成一个array数组

            if (post_messages[i].authorMesContent!=""){
              isReplyArray[i]=true;
              arraymessage[i]=post_messages[i].authorMesContent;
            }else{
              isReplyArray[i]=false;
            }
          }
          that.setData({
            ishave:true,//是否有筛选留言
            goodarray:goodarr,//点赞的总数
            isTop:istop,//是否置顶
            status:isstatus,//判断是否点赞
            authorBool:isReplyArray,//作者是否回复
            authormessages: arraymessage,//作者回复内容
            isZanall:isZantem,//所有的openID的存储
            messages: post_messages//留言的所有信息
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
  //悬浮按钮（回到主页）
  onPostClick: function () {
    wx: wx.navigateTo({
      url: '../../pages/index/index'
    })
  },
  //写留言
  writemessage: function () {
    var that = this;
    wx: wx.navigateTo({//this.data.title  this.data.no
      url: '../../pages/write/write?title=' + that.data.title + '&no=' + that.data.no + '&g_id=' + that.data.g_id,
    })
  },
  //实现点赞功能
  setGood:function (event){
    var that=this;
    console.log("点赞",event.currentTarget.dataset.index)
    var index = event.currentTarget.dataset.index;
    //判断如果没有点赞
    if(this.data.status[index]){
      //点赞状态进行转换
      that.data.status[index] = !that.data.status[index]
      console.log("状态为", that.data.status[index])
      that.data.goodarray[index] = that.data.goodarray[index] - 1;
      //that.data.isZanall[index].push(wx.getStorageSync('openid'))
      for (var de_index = 0; de_index < that.data.isZanall[index].length; de_index++) {
        if (that.data.isZanall[index][de_index] == wx.getStorageSync('openid')) {
          that.data.isZanall[index].splice(de_index, 1)
          break
        }
      }
      that.setData({
        status: that.data.status,
        goodarray: that.data.goodarray
      })
      //获得了一个赞然后去更新数据库  主要是将点赞的状态和个数进行更新
      wx.cloud.callFunction({
        name:"updateZan",
        data:{
          isZan: that.data.isZanall[index],
          zanCount: that.data.goodarray[index],
          _id: that.data.messages[index]._id
        },
        success:function(res){},
        fail: function (res) { 
          console.log(res.errMsg)
          wx.showToast({
            title: '联网失败',
            icon: 'fail',
          })
        },
      })
      

    }else{
      that.data.status[index] = !that.data.status[index]
      console.log("状态为", that.data.status[index])
      that.data.goodarray[index] = that.data.goodarray[index] +1;
      that.data.isZanall[index].push(wx.getStorageSync('openid'))
     
      that.setData({
        status: that.data.status,
        goodarray: that.data.goodarray
      })
    //减少一个赞 更新数据库
      wx.cloud.callFunction({
        name: "updateZan",
        data: {
          isZan: that.data.isZanall[index],
          zanCount: that.data.goodarray[index],
          _id: that.data.messages[index]._id
        },
        success: function (res) { },
        fail: function (res) {
          console.log(res.errMsg)
          wx.showToast({
            title: '联网失败',
            icon: 'fail',
          })
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
    var that = this;
    that.getChooseContent();
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
    that.getChooseContent();
    

    //完成停止加载
    wx.hideNavigationBarLoading();

    //停止下拉刷新 
    wx.stopPullDownRefresh();    
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