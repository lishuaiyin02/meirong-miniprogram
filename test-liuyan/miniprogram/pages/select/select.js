// pages/select/select.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',//公众号 id
    avatarUrl: '',//管理员头像
    nickName: '',//管理员网名
    headpath:'',//公众号的头像路径
    name:'',//公众号的名字
    describe:'',//公众号的简介
    isUperuser:false,//是否为超级管理者
    password:''//密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
     
      id:options.id,//公众号的id
      nickName: options.nickName,//管理员的名字
      avatarUrl: options.avatarUrl,//管理员的头像
      headpath: options.headpath,//公众号路径
      fileID:options.fileID,
      name:options.name,//公众号名字
      describe:options.describe,//公众号简介
      password: options.password,
      // isUperuser:options.isUperuser,//是否是超级权限者
    })
    if(options.isUperuser=='true'){
      that.setData({
        isUperuser:true,//是否是超级权限者
      })
    }
    //console.log("isUperuser",that.data.isUperuser)
  },
  //资料修改
  changeMaterial:function(){
    var that=this
  
    wx.navigateTo({
      url: '../../pages/singup/signup?g_id=' + that.data.id + "&headpath=" + this.data.headpath + "&name=" + this.data.name + "&describe=" + this.data.describe + "&password=" + this.data.password + "&isSubmit=" + false + "&fileID=" + this.data.fileID,
    })
   
  },

  //用户管理  
  userManagement:function(){
    wx.navigateTo({
      url: '../../pages/userManagement/userManagement?id='+this.data.id,
    })
  },
  //文章管理
  articelOpertor:function(){
    wx.navigateTo({
      url: '../../pages/mycenter/mycenter?id=' + this.data.id + "&headpath=" + this.data.headpath + "&name=" + this.data.name + "&describe=" + this.data.describe
    })
  },
  //留言管理
  messagesOpertor:function(){
    wx.requestSubscribeMessage({
      tmplIds: ['YQ6B9tjoML5XXazZyrjl1t_Zf1P6B1j6UtFuE_EIdy0'],
      //EIdy0 是指作者收到留言通知
      success(res) {
        console.log("唤起框是", res)
        if (res.YQ6B9tjoML5XXazZyrjl1t_Zf1P6B1j6UtFuE_EIdy0 == 'accept') {//接收通知
          wx.showToast({
            title: '您将收到用户的留言通知',
            icon: 'none'
          })
        }
        else {
         wx.showToast({
           title: '您拒绝了收到留言通知',
           icon:'none'
         })
        }
      },
    })
    wx.navigateTo({
      url: '../../pages/myartical/myartical?id=' + this.data.id
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