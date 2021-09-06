// miniprogram/pages/orders/orders.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    strorders:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var serverUrl = app.serverUrl
    wx.request({
      url: serverUrl + 'getOrders',
      method: "GET",
      data:{
        user_id:app.getGlobalUserInfo().id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(res){
        if (res.statusCode == 200 && res.data.status == "200"){
          that.setData({
            orders:res.data.orders,
            strorders:JSON.stringify(res.data.orders)
          })
        }else{
          wx.showToast({
            title: "请求失败",
            icon:"none",
            duration: 2000
          })
        }
      }
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
    var that = this
    var serverUrl = app.serverUrl
    wx.request({
      url: serverUrl + 'getOrders',
      method: "GET",
      data:{
        user_id:app.getGlobalUserInfo().id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(res){
        if (res.statusCode == 200 && res.data.status == "200"){
          that.setData({
            orders:res.data.orders,
            strorders:JSON.stringify(res.data.orders)
          })
        }else{
          wx.showToast({
            title: "请求失败",
            icon:"none",
            duration: 2000
          })
        }
      }
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