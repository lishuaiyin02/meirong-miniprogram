// pages/article/article.js
const time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time,
    post_key:[],
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var g_id=options.g_id;//这个id是上一个界面传过来的id  公众号的_id
    that.setData({
      id:g_id
    })
   // console.log("artical的id是",g_id)
   //获取文章列表  这个是通过现有的数据库读取的（手动输入的）
    wx.cloud.callFunction({
      name: "Getarticleinfo",
      data: {
        id: that.data.id //公众号id
      },
    }).then(res => {
      console.log("article的返回值", res)
      if (res.result.data[0] !== undefined) {

        res.result.data.forEach(function (item, index) {
          //console.log(index); //这里的item就是从数组里拿出来的每一个每一组 index是下角标
          res.result.data[index].date = time.formatTime(res.result.data[index].date , 'Y/M/D h:m:s');
        })
        that.setData({
          post_key: res.result.data,
        })

      } else {
        wx.showToast({
          title: '作者还没有发表文章，请先发布文章',
          icon: 'none',
        })
      }

      console.log("获得的文章列表是：", that.data.post_key)

    }).catch(error => {
      // handle error
      console.log(error)
      wx.showToast({
        title: '联网失败',
        icon: 'fail',
      })
    })
    // //直接获取
    // wx.showNavigationBarLoading(); //在标题栏中显示加载图标 
    // var that = this;
    // wx.cloud.callFunction({
    //   name: 'getArticles',
    //   data: {
    //     _id: that.data.id
    //   },
    //   success: function (res) {
    //     console.log("getAccessToken  result")
    //     console.log(res)
       
    //     res.result.body.item.forEach(function (item, index) {
    //       //console.log(index); //这里的item就是从数组里拿出来的每一个每一组 index是下角标
    //       res.result.body.item[index].update_time = time.formatTime(res.result.body.item[index].update_time * 1000, 'Y/M/D h:m:s');
    //     })
    //     that.setData({
    //       post_key: res.result.body.item
    //     })
    //     if(!that.data.post_key.length){
    //       wx.showToast({
    //         title: '作者还没有发表文章哦',
    //         icon: 'none',
    //       })
    //     }
    //     //console.log("postkey是", )
    //     var sjc = 1488481383;
    //     console.log("sjc",time.formatTime(sjc*1000, 'Y/M/D h:m:s'));
    //   },
    //   fail: function (res) {
    //    console.log(res)
    //    wx.showToast({
    //      title: '联网失败',
    //      icon: 'fail',
    //    })
    //  },
    //  complete: function (res) {
    //     wx.hideNavigationBarLoading();          //完成停止加载 
    //     // 动态设置导航条标题 
    //     wx.stopPullDownRefresh();            //停止下拉刷新 
    //   },
    // })
  },


  /**跳转留言页面 */
  to_message_list:function(event){
    var that=this;
    console.log(event.currentTarget.dataset.index)
    var index = event.currentTarget.dataset.index;
    //原来的
    var title=that.data.post_key[index].title
    //直接读取的
    //var title = that.data.post_key[index].content.news_item[0].title
    // that.setData({
    //   no: that.data.post_key[index]._id
    // })
  //原来的
   var no = that.data.post_key[index].no //这个是文章的标号
    //var no = index+1;//index 是从0开始的
    console.log("标题" + index + title + " " + no)
    console.log('g_id为:' + that.data.id)
    wx:wx.navigateTo({
      url: '../../pages/message/message?no=' + no + '&g_id=' + that.data.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
    //在这个函数中可以读取公众号后台的数据并存入数据库
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标 
    
    wx.hideNavigationBarLoading();          //完成停止加载 
    // 动态设置导航条标题 
    wx.stopPullDownRefresh();            //停止下拉刷新 
    
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
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标 
    var that = this;

    wx.cloud.callFunction({
      name: "Getarticleinfo",
      data: {
        id: that.data.id //公众号id
      },
    }).then(res => {
      console.log("article的返回值", res)
      if (res.result.data[0] !== undefined) {

        res.result.data.forEach(function (item, index) {
          //console.log(index); //这里的item就是从数组里拿出来的每一个每一组 index是下角标
          res.result.data[index].date = time.formatTime(res.result.data[index].date , 'Y/M/D h:m:s');
        })
        that.setData({
          post_key: res.result.data,
        })

      } else {
        wx.showToast({
          title: '作者还没有发表文章，请先发布文章',
          icon: 'none',
        })
      }

      console.log("获得的文章列表是：", that.data.post_key)
      wx.hideNavigationBarLoading();          //完成停止加载 
      // 动态设置导航条标题 
      wx.stopPullDownRefresh();            //停止下拉刷新 
    }).catch(error => {
      // handle error
      console.log(error)
      wx.showToast({
        title: '联网失败',
        icon: 'fail',
      })
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