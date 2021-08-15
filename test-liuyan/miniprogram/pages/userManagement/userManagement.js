// pages/userManagement/userManagement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    g_id:'',//公众号的id号
    // gongmess:[],//公众号的管理员信息
    bzs:[],//所有的备注信息
    openids:[],//所有的openids信息

  },
  //增加用户
  adduser:function(){
    var that=this
    var isSubmit=true
    //跳转到一个增加用户的界面  另一个页面转化数组的操作
    var bzs=JSON.stringify(that.data.bzs);
    var openids=JSON.stringify(that.data.openids);
    wx.navigateTo({
      url: '../../pages/addUser/addUser?g_id=' + that.data.g_id + "&isSubmit=" + isSubmit+ "&bzs=" + bzs+ "&openids=" + openids
    })
  },
  //编辑对应的运营者信息
  edit:function(event){
    var that=this
    var isSubmit=false
    //跳转到一个增加用户的界面  另一个页面转化数组的操作
    var bzs=JSON.stringify(that.data.bzs);
    var openids=JSON.stringify(that.data.openids);
    //需要修改的备注和openids
    var index=event.currentTarget.dataset.index
    var oid=that.data.openids[index]
    var bz=that.data.bzs[index]
    wx.navigateTo({
      url: '../../pages/addUser/addUser?g_id=' + that.data.g_id + "&isSubmit=" + isSubmit+ "&bzs=" + bzs+ "&openids=" + openids+"&bz=" + bz+ "&oid=" + oid+"&index=" + index
    })
  },
  //删除对应的运营者信息
  delete1:function(event){
    var that=this
    var index=event.currentTarget.dataset.index
    that.data.openids.splice(index,1)
    that.data.bzs.splice(index,1)

    wx: wx.showToast({
      title: '上传中',
      icon: 'loading'
    })
    wx.cloud.callFunction({
      name: 'updateUser',
      data: {
        g_id: that.data.g_id,//对应的公众号id
        bzs:that.data.bzs,//需要上传的备注
        openids:that.data.openids,//需要上传的openID
      },
      success:function(res){
        wx.showToast({
          title: '删除成功',
          icon:'none'
        })
        //更新成功后 需要再重新获取页面
       that.setData({
        openids:that.data.openids,
        bzs:that.data.bzs
       })

      },
    })

  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      g_id:options.id,//赋值公众号的id
    })
    //获得所有管理员的信息
    wx.cloud.callFunction({
      name:'Getgonginfo',
      data:{
        g_id:that.data.g_id
      },
      success:function(res){
        console.log("得到的信息为",res)
        var gongmessages=res.result.data[0]
        // that.setData({
        //   gongmess:gongmessages
        // })

        if (gongmessages.bzs){
         
          that.setData({
            bzs: gongmessages.bzs,
          })
          console.log("bzs", that.data.bzs)
        }
        if (gongmessages.openids){
          that.setData({
            openids: gongmessages.openids
          })
        }
        
        console.log("得到的信息为1111", gongmessages)
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
    var that=this
   
    wx.cloud.callFunction({
      name:'Getgonginfo',
      data:{
        g_id:that.data.g_id
      },
      success:function(res){
        console.log("得到的信息为",res)
        var gongmessages=res.result.data[0]
        // that.setData({
        //   gongmess:gongmessages
        // })

        if (gongmessages.bzs){
         
          that.setData({
            bzs: gongmessages.bzs,
          })
          console.log("bzs", that.data.bzs)
        }
        if (gongmessages.openids){
          that.setData({
            openids: gongmessages.openids
          })
        }
        
        console.log("得到的信息为1111", gongmessages)
      }
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