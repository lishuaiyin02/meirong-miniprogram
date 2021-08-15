// pages/joinProcess/joinProcess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHidden: true,//登陆框不显示
    inputContent: '',//g_id输入为空
    g_id:'',//从公众号获取到的g_id
    
  },
  //取消
  modalBindcancel: function () {
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
  },
  //确定
  modalBindaconfirm:function(){
    var that=this
    if (that.data.inputContent == "") {
      wx.showToast({
        title: 'g_id不能为空！',
        icon: 'none',
      })
    }else{
      that.setData({
        g_id:that.data.inputContent,//
        modalHidden:true
      })
      wx.cloud.callFunction({//核对g_id是否正确
        name:'verifyGid',
        data:{
          _id:that.data.g_id
        },
        success:function(res){
          console.log("返回的验证结果为",res)
          if(res.result.data.length!=0){
            that.setData({
              inputContent:''
            })
            
            wx.navigateTo({
              url: '../../pages/singup/signup?g_id=' + that.data.g_id +"&isSubmit=true",
            })
          }else{
            wx.showToast({
              title: '您输入的g_id号错误，请联系管理员进行确认',
              icon:'none'
            })
          }
         
        },
        fail:function(res){
          console.log("验证g_id网络错误",res)
          wx.showToast({
            title: '',
          })
        },
      })
     
    } 
   
  },
  // 获取弹出g_id
  getInputContent: function (e) {
    // console.log(e.detail.value)
    this.setData({
      inputContent: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  //点击点击注册按钮  弹出框输入对应的g_id 再进入注册的页面
  signup:function(){
    var that=this
    that.setData({
      modalHidden: false,
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