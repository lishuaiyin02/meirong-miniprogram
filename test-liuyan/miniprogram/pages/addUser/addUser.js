// pages/addUser/addUser.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSubmit:false,//判断是提交还是修改
    g_id:'',//公众号的id
    inputbz:'',//输入的备注
    inputid:'',//输入的openID
    bz:'',//上传的备注
    oid:'',//上传的openID
    bzs:[],//所有的备注
    openids:[],//所有的运营者的openids
    index:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      g_id:options.g_id,
      isSubmit:options.isSubmit,
      bzs:JSON.parse(options.bzs),
      openids:JSON.parse(options.openids)
    })
   
    if(options.isSubmit=='true'){
      that.setData({
        isSubmit: true,
      })
    }
    else{
      that.setData({
        isSubmit: false,
        inputbz:options.bz,
        inputid:options.oid,
        index:options.index,

        oid:options.oid,
        bz:options.bz,
      })
    }
    console.log("bzsadd", that.data.bzs)
    console.log("openidsadd", that.data.openids)
    //在onload的时候获取当前运营者的备注和openIDs
    // wx.cloud.callFunction({
    //   name:'Getgonginfo',
    //   data:{
    //     g_id:that.data.g_id
    //   },
    //   success:function(res){
    //     console.log("得到的信息为",res)
    //     var gongmessages=res.result.data[0]

    //     if (gongmessages.bzs){
         
    //       that.setData({
    //         bzs: gongmessages.bzs,
    //       })
    //       console.log("bzs", that.data.bzs)
    //     }
    //     if (gongmessages.openids){
    //       that.setData({
    //         openids: gongmessages.openids
    //       })
    //     }
        
    //     console.log("得到的信息为1111", gongmessages)
    //   }
    // })
  },
  //上传的备注
  numberInput1: function (e) {
    this.setData({
      bz: e.detail.value//上传的备注
    })
  },
  //上传的openid
  numberInput2: function (e) {
    this.setData({
      oid: e.detail.value//上传的openID
    })
  },
  //添加管理者  进行数据库的更新
  submit:function(){
    var that=this
    //首先判断数据是否为空 一个也不行
    if(that.data.bz==''||that.data.oid==''){
      wx.showToast({
        title: '备注、OPENID不能为空',
        icon: 'none'
      })
    }else{
     
      if(that.data.isSubmit){
        that.data.openids.push(that.data.oid)
        that.data.bzs.push(that.data.bz)
      }else{
        that.data.openids[that.data.index]=that.data.oid,
        that.data.bzs[that.data.index]=that.data.bz
      }
      
      //上传到数据库中
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
          //更新成功后 需要将内容置空
          that.setData({
            inputbz:'',
            inputid:''
          })
          if (that.data.isSubmit) {
            wx.showModal({
              title: '添加成功',
              success(res) {
                if (res.confirm) {

                } else if (res.cancel) {

                }
              }
            })
          } else {
            wx.showModal({
              title: '修改成功',
              success(res) {
                if (res.confirm) {

                } else if (res.cancel) {

                }
              }
            })

          }

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