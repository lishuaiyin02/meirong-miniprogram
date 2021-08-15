// pages/myartical/myartical.js
const time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post_key:[],//获得的所有文章列表
    id:'',//公众号的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      id:options.id//公众号的id从上边传过来的
    })
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
  },
/**跳转留言页面 */
to_message_list:function(event){
  var that=this;
  console.log(event.currentTarget.dataset.index)
  var index = event.currentTarget.dataset.index;
  //原来的
  var title=that.data.post_key[index].title
//原来的
 var no = that.data.post_key[index].no //这个是文章的标号
  //var no = index+1;//index 是从0开始的
  console.log("标题" + index + title + " " + no)
  console.log('g_id为:' + that.data.id)
  wx:wx.navigateTo({
    url: '../../pages/lookmessage/lookmessage?title=' + title + '&no=' + no + '&id=' + that.data.id,//后台的留言管理页面
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