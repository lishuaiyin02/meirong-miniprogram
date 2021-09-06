// miniprogram/pages/order/order.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:[],
    dialogShow: false,
    buttons: [{text: '取消'}, {text: '确定'}],
  },

  openConfirm: function () {
    this.setData({
        dialogShow: true
    })
  },
  tapDialogButton(e) {
    var that = this
    console.log(e.detail)
    this.setData({
        dialogShow: false,
    })
    if (e.detail.index == 1){
      that.cancelOrder()
    }
  },
  //取消订单
  cancelOrder:function(){
    var that = this
    var serverUrl = app.serverUrl
    wx.request({
      url: serverUrl + 'cancelOrder',
      method: "GET",
      data:{
        order_id:that.data.order.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(res){
        console.log(res)
        if (res.statusCode == 200 && res.data.status == "200"){
          wx.navigateBack({
            delta:1
          })
          wx.showToast({
            title: "取消成功",
            icon:"success",
            duration: 2000
          })
         
        }else{
          wx.showToast({
            title: "请求失败222",
            icon:"none",
            duration: 2000
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '网络有问题，请稍后重试',
          icon:"none"
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var orders = JSON.parse(options.orders)
    var index = options.index
    that.setData({
      order:orders[index]
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