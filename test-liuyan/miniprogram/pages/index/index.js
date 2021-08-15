// pages/index/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    buttonDisabled: false,
    modalHidden: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    gongMessage: [], //存储公众号所有信息
    gongMessage_temp: [], //存储公众号所有信息临时
    inputContent: '',
    inputContentxml: '',
    id: '',
    lock: false,
    searchinfo:'',//需要搜索的信息
  },

  wxSearchInput:function(e){
    var that=this
    that.setData({
      searchinfo:e.detail.value//需要搜索的内容
    })
  },
  //失去焦点的事件
  wxSearchBlur:function(e){
    var that=this
    if (that.data.searchinfo!=''){
      console.log("that.data.searchinfo", that.data.searchinfo)
      //进行搜索
      wx.cloud.callFunction({
        name:'searchinfo',
        data:{
          name: that.data.searchinfo
        },
        success: function (res) {
          that.setData({
            gongMessage: res.result.data
          })
          console.log(that.data.gongMessage)
        },
        fail: function (res) {
          console.log(res.errMsg)
          wx.showToast({
            title: '联网失败',
            icon: 'fail',
          })
        },
      })
    } else {
      that.setData({
        gongMessage: that.data.gongMessage_temp
      })
    }
  },
  //搜索事件
  wxSearchFn: function (e) {
    var that = this
    if (that.data.searchinfo != '') {
      console.log("that.data.searchinfo", that.data.searchinfo)
      //进行搜索
      wx.cloud.callFunction({
        name: 'searchinfo',
        data: {
          name: that.data.searchinfo
        },
        success: function (res) {
          that.setData({
            gongMessage: res.result.data
          })
          console.log(that.data.gongMessage)
        },
        fail: function (res) {
          console.log(res.errMsg)
          wx.showToast({
            title: '联网失败',
            icon: 'fail',
          })
        },
      })
    }else{
      that.setData({
        gongMessage: that.data.gongMessage_temp
      })
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
    //获取公众号信息
    that.getGongInfo();
  },
  //通过appid 和secret获取最新的文章显示
  bindViewTap: function (event) {
    if (this.data.lock) {
      return;
    }
    var that = this;
    var g_id = "2b4144565e907d680058a88e5cc93c5e"
    console.log("公众号id为:" + g_id)
    wx.navigateTo({
      url: '../../pages/articlenew/articlenew?g_id=' + g_id
    })
  },
  /*跳转到文章页面 */
  to_articel_list: function (event) {
    //检查锁
    if (this.data.lock) {
      return;
    }
    var that = this;
    var index = event.currentTarget.dataset.index;
    var g_id = that.data.gongMessage[index]._id
    console.log("公众号id为:" + g_id)
    wx.navigateTo({
      url: '../../pages/article/article?g_id=' + g_id
    })
  },
  /*长按复制公众号 */
  copy: function (event) {
    //even 主要是提取里边的index变量
    this.setData({ lock: true });
    var that = this;
    var index = event.currentTarget.dataset.index;
    //设置系统剪切板的内容
    wx.setClipboardData({
      data: that.data.gongMessage[index].name,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
    console.log(event)
  },
  touchend: function () {
    var that = this;
    if (that.data.lock) {
      //开锁
      console.log("离开")
      that.setData({
        lock: false
      });
    }
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

  //获取公众号信息
  getGongInfo: function () {
    var that = this;
    wx.cloud.callFunction({
      name: "Getgonginfo",
      data: {
        g_id:'',
      },
      success: function (res) {
        that.setData({
          gongMessage: res.result.data,
          gongMessage_temp: res.result.data,
        })
        console.log(that.data.gongMessage)
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
  showModal: function (event) {
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
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

  //取消
  modalBindcancel: function () {
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
  },
  getIdentifyId: function () {
    var that = this;
    wx.cloud.callFunction({
      name: "GetIdentifyId",
      data: {
        password: that.data.inputContent //登录后台密码
      },
      success: function (res) {
        console.log("res是", res);
        if (res.result.data[0] !== undefined) {
          that.setData({
            modalHidden: !that.data.modalHidden,//弹出框消失
            //buttonDisabled: !that.data.buttonDisabled,
            id: res.result.data[0]._id,
          })
          console.log("id是：", that.data.id)
          wx.navigateTo({//公众号的id
            url: '../../pages/select/select?id=' + that.data.id + "&avatarUrl=" + that.data.userInfo.avatarUrl + "&nickName=" + that.data.userInfo.nickName + "&headpath=" + res.result.data[0].headpath + "&name=" + res.result.data[0].name + "&describe=" + res.result.data[0].describes
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showToast({
      title: '欢迎进入小将留言',
      icon: 'none',
    })
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
    var that=this;
    console.log("下拉动作开始")
    //在标题栏中加载图标
    wx.showNavigationBarLoading(); 
    wx.cloud.callFunction({
      name: "Getgonginfo",
      data: {
        g_id: '',
      },
      success: function (res) {
        that.setData({
          gongMessage: res.result.data,
          gongMessage_temp: res.result.data
        })
        console.log(that.data.gongMessage)

          //完成停止加载
        wx.hideNavigationBarLoading();

        //停止下拉刷新
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log(res.errMsg)
        wx.showToast({
          title: '联网失败',
          icon: 'fail',
        })
      },
    })


    //获取公众号信息
    //that.getGongInfo();

  

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareTimeline: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})