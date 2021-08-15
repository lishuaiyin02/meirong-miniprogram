// pages/lookmessage/lookmessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',//从上个页面传过来的文章标题
    no:'',//........................编号
    id:"",//.....................公众号id
    messages:[],//从数据库中获得的该文章的所有的留言信息
    authorBool: new Array(),//判断该留言作者是否已回复
    authormessages: new Array(),//作者回复信息
    isTop: new Array(),//判断留言是否置顶
    isChoose: new Array(),//是否设置为精选
    modalHidden: true,//回复读者的弹框默认隐藏
    inputContentxml: '',//回复读者的弹框的输入内容
    index2:'',//记录回复的是哪一条留言
    access_token:"",//存储小程序的access_token，用来后续发送消息服务
    formId:'',//用来后续发送消息服务
  },
  //悬浮按钮（回到主页）
  onPostClick: function () {
    wx: wx.navigateTo({
      url: '../../pages/index/index'
    })
  },
  //服务推送通知
  orderSign: function (e) {
    var that = this;
    var fId = e.detail.formId;
    this.setData({
      inputContentxml: ''
    })
    console.log("留言内容：" + that.data.messages)
    that.setData({
      formId: fId
    })
    console.log("formid是是是是是",that.data.formId)
  },
    //弹出回复框
    showModal: function (event) {
     
      // console.log(event.currentTarget.dataset.index)
      var u_index = event.currentTarget.dataset.index;
      console.log("回复索引：" + event.currentTarget.dataset.index)
      this.setData({
        modalHidden: !this.data.modalHidden,
        index2: u_index//回复留言的index
      })
    },
    //获取输入框（作者回复）内容
  getInputContent:function(e){
    console.log(e.detail.value)
    this.setData({
      inputContentxml:e.detail.value
    })
  },
  //弹出的对话框点击确定按钮
  modalBindaconfirm:function(){
    //将回复的内容存入数据库
    var that = this;
    console.log(that.data.inputContentxml)
    if (that.data.inputContentxml == "") {
      wx.showToast({
        title: '秘钥不能为空！',
        icon: 'none',
      })
    } else{//存入数据库
      wx: wx.showToast({
        title: '正在回复中',
        icon: 'loading'
      })
      this.setData({
        modalHidden: !this.data.modalHidden,
        buttonDisabled: !this.data.buttonDisabled,
      })
      wx.cloud.callFunction({
        name:'updateZan',
        data:{
          _id:that.data.messages[that.data.index2]._id,//对应的需要修改的
          authorMesContent:that.data.inputContentxml,//作者回复的内容
        },
        success:function(res){
          that.data.authorBool[that.data.index2] = true
          that.data.authormessages[that.data.index2] = that.data.inputContentxml
          that.setData({
            authormessages: that.data.authormessages,
            authorBool: that.data.authorBool,
          })
          wx.showToast({
            title: '已回复',
            icon: 'none',
          })
          //将消息推送给用户
          if(that.data.messages[that.data.index2].needReply){
            wx.cloud.callFunction({
              name: 'getAcessTokenxcx',
              data: {
                openid:that.data.messages[that.data.index2].openid,//发送给谁
                inputContentxml:that.data.inputContentxml,
                title:that.data.title,
                userMesContent:that.data.messages[that.data.index2].userMesContent
              },
              success:function(res){
                console.log("返回的结果是是是是",res)
              }
            })
          }
         
          // let _access_token = '33_oYj2Vk2Wu4erBXAxGFlog1oxlVv3VYqIrXXT9BIsDVVNUP136aLnJafAeyavH0hBnLfBniZJvJfW764NiHRBfSRIZPPROsDmwnZ9jUB7hzrgHkV9k3Tt3UHesRd2-IRyHkWxB-_5xk-qSRUsBRBfABAWMW';
          // let url='https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+_access_token

          // let _jsonData={
          //   access_token:that.data.access_token,
          //   template_id:'FQtfi_q10CjMuTL9TpUeys7qSZakPbo9l7qlNrP_vMc',
          //   touser:wx.getStorageSync('openid'),
          //   formId:that.data.formId,
          //   data:{
          //     "keyword1": { "value": "测试数据一", "color": "#173177" },
          //     "keyword2": { "value": "测试数据二", "color": "#173177" },
          //     "keyword3": { "value": "测试数据三", "color": "#173177" },
          //   }
          // }
          // wx.request({
          //   url: url,
          //   data:_jsonData,
          //   method: 'POST',
          //   success: function (res) {
          //     console.log(res)
          //   },
          //   fail: function (err) {
          //     console.log('request fail ', err);
          //   },
          //   complete: function (res) {
          //     console.log("request completed!");
          //   }
 
          //})

        },
        fail: function (err) {
          wx.showToast({
            title: '网络连接失败,请重试',
            icon: 'none',
          })
        }
      })

     
    }
  },
  // 取消
  modalBindcancel: function () {
    this.setData({
      modalHidden: !this.data.modalHidden,
      inputContentxml: ''
    })
  },
  //设置精选
  choose:function(event){
    var that=this;
    var ch_index=event.currentTarget.dataset.index;
    wx.showToast({
      title: '设置中',
      icon:'loading'
    })
    wx.cloud.callFunction({
      name:'updateZan',
      data:{
        _id:that.data.messages[ch_index]._id,
        isCheck:true
      },
      success:function(res){
        wx.showToast({
          title: '已设为精选留言',
          icon: 'none',
        })
        that.data.isChoose[ch_index] = true
        that.setData({
          isChoose: that.data.isChoose
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '设置精选留言失败',
          icon: 'none',
        })
      },
    })
  },
  //取消精选
  cancelChoose:function(event){
    var that=this;
    var ch_index=event.currentTarget.dataset.index;
    wx.showToast({
      title: '设置中',
      icon:'loading'
    })
    wx.cloud.callFunction({
      name:'updateZan',
      data:{
        _id:that.data.messages[ch_index]._id,
        isCheck:false
      },
      success:function(res){
        wx.showToast({
          title: '已取消精选留言',
          icon: 'none',
        })
        that.data.isChoose[ch_index] = false
        that.setData({
          isChoose: that.data.isChoose
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '取消精选留言失败',
          icon: 'none',
        })
      },
    })

  },
  //留言置顶
  settop:function(event){
    var that=this;
    var top_index=event.currentTarget.dataset.index;
    wx.showToast({
      title: '设置中',
      icon:'loading'
    })
    wx.cloud.callFunction({
      name:'updateZan',
      data:{
        _id:that.data.messages[top_index]._id,
        isTop:true
      },
      success:function(res){
        wx.showToast({
          title: '已置顶留言',
          icon: 'none',
        })
        that.data.isTop[top_index] = true
        that.setData({
          isTop: that.data.isTop
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '置顶留言失败',
          icon: 'none',
        })
      },
    })
  },
  //取消置顶
  canceltop:function(event){
    var that=this;
    var top_index=event.currentTarget.dataset.index;
    wx.showToast({
      title: '设置中',
      icon:'loading'
    })
    wx.cloud.callFunction({
      name:'updateZan',
      data:{
        _id:that.data.messages[top_index]._id,
        isTop:false
      },
      success:function(res){
        wx.showToast({
          title: '已取消置顶留言',
          icon: 'none',
        })
        that.data.isTop[top_index] = false
        that.setData({
          isTop: that.data.isTop
        })
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '取消置顶留言失败',
          icon: 'none',
        })
      },
    })
  },
  //删除留言
  deleteMessage:function(event){
    var that=this;
    var de_index=event.currentTarget.dataset.index
    wx: wx.showToast({
      title: '正在删除',
      icon: 'loading'
    })
    wx.cloud.callFunction({
      name:'deleteMessage',
      data:{
        _id:that.data.messages[de_index]._id,
      },
      success:function(res){
        wx.showToast({
          title: '已删除该留言',
          icon: 'none',
        })
        //刷新页面
        var messlist = that.data.messages;
        messlist.splice(de_index, 1);
        //隐藏作者回复
        that.data.authorBool[de_index] = false
        that.setData({
          messages: messlist,
          authorBool: that.data.authorBool
        })
      },
      fail:function(res){
        wx.showToast({
          title: '删除留言失败',
          icon: 'none',
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      title:options.title,
      no:options.no,
      id:options.id,
    })

    wx.showToast({
      title: '正在获取数据',
      icon: 'loading'
    })
    //获取数据库中的该文章的所有的留言信息
    wx.cloud.callFunction({
      name:"getMessages",
      data:{
        g_id:options.id,//公众号的id
        no:options.no,//文章的编号
      },
      success:function(res){
        console.log("获得的所有信息",res)
        var post_messages = res.result.data
        if (!post_messages.length){
          wx.showToast({
            title: '还没有用户留言',
            icon: 'none',
          })
        }else{
          var arraymessage = new Array(post_messages.length);//作者回复的内容
          var isReplyArray = new Array(post_messages.length);//作者是否回复
          var isChoose=new Array(post_messages.length);//是否设置为精选
          var istop = new Array(post_messages.length);//判断是否置顶
          for (var i = 0; i < post_messages.length;i++){
            istop[i]=post_messages[i].isTop//判断是否置顶
            isChoose[i]=post_messages[i].isCheck
            if (post_messages[i].authorMesContent!=""){
              isReplyArray[i]=true;
              arraymessage[i]=post_messages[i].authorMesContent;
            }else{
              isReplyArray[i]=false;
            }
          }
          that.setData({
            isChoose:isChoose,//是否精选
            isTop:istop,//是否置顶
            authorBool:isReplyArray,//作者是否回复
            authormessages: arraymessage,//作者回复内容
            messages: post_messages//留言的所有信息
          })
        }
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '连接失败',
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
    wx: wx.showToast({
      title: '正在获取数据',
      icon: 'loading'
    })
    //获取数据库中的该文章的所有的留言信息
    wx.cloud.callFunction({
      name:"getMessages",
      data:{
        g_id:that.data.id,//公众号的id
        no:that.data.no,//文章的编号
      },
      success:function(res){
        console.log("获得的所有信息",res)
        var post_messages = res.result.data
        if (!post_messages.length){
          wx.showToast({
            title: '还没有用户留言',
            icon: 'none',
          })
        }else{
          var arraymessage = new Array(post_messages.length);//作者回复的内容
          var isReplyArray = new Array(post_messages.length);//作者是否回复
          var isChoose=new Array(post_messages.length);//是否设置为精选
          var istop = new Array(post_messages.length);//判断是否置顶
          for (var i = 0; i < post_messages.length;i++){
            istop[i]=post_messages[i].isTop//判断是否置顶
            isChoose[i]=post_messages[i].isCheck
            if (post_messages[i].authorMesContent!=""){
              isReplyArray[i]=true;
              arraymessage[i]=post_messages[i].authorMesContent;
            }else{
              isReplyArray[i]=false;
            }
          }
          that.setData({
            isChoose:isChoose,//是否精选
            isTop:istop,//是否置顶
            authorBool:isReplyArray,//作者是否回复
            authormessages: arraymessage,//作者回复内容
            messages: post_messages//留言的所有信息
          })
        }
        wx.hideNavigationBarLoading();          //完成停止加载 
        // 动态设置导航条标题 
        wx.stopPullDownRefresh();            //停止下拉刷新 
      },
      fail: function (res) {
        console.log(res)
        wx.showToast({
          title: '连接失败',
          icon: 'fail',
        })
      },
      complete: function () {
        
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