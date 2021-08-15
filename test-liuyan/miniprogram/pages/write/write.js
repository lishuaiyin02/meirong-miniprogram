// pages/write/write.js
const time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emojiChar: "🤐-☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
    //0x1f---
    emoji: [
      "59f","60a", "60b", "60c", "60d", "60f",
      "61b", "61d", "61e", "61f",
      "62a", "62c", "62e",
      "602", "603", "605", "606", "608",
      "612", "613", "614", "615", "616", "618", "619", "620", "621", "623", "624", "625", "627", "629", "633", "635", "637",
      "63a", "63b", "63c", "63d", "63e", "63f",
      "64a", "64b", "64f", "681",
      "68a", "68b", "68c",
      "344", "345", "346", "347", "348", "349", "351", "352", "353",
      "414", "415", "416",
      "466", "467", "468", "469", "470", "471", "472", "473",
      "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
    ],
    emojis: [],//qq、微信原始表情
    isShow: false,//控制emoji表情是否显示

    current:0,//当前的字符数
    message_id:new Array(),//将每一条留言的id存储起来，方便后边的删除操作
    nickName: '',//用户名
    avatarUrl: '',//用户的头像
    g_id: '',//公众号的id
    no: '',//文章的编号
    title: '',//文章的标题
    messages: '',//文本框的内容
    all_messages:new Array(),//经过删除和增加的留言
    messageinfo:[],//返回的用户留言信息
    message:new Array(),//底下的留言信息内容
    message_len:0,//一开始message的长度
    condition: true,
    formId: '',
    openid:'',//写留言的用户的openid
    g_openid:'',//公众号绑定的openid
    g_openids:[],//运营者的所有id
    messagesnull: '',
    needReply: true//是否接收留言回复通知
  },
  //点击表情显示隐藏表情盒子
  emojiShowHide: function () {
    this.setData({
      isShow: !this.data.isShow,
   })
    console.log("isshow", this.data.isShow)
  },
  //文本域失去焦点时 事件处理
  // textAreaBlur: function (e) {
  //   //获取此时文本域值
  //   console.log(e.detail.value)
  //   this.setData({
  //     messagesnull: e.detail.value,
  //     messages: e.detail.value,
  //   })

  // },
  emojiChoose:function(e){
    var that=this;
    that.setData({
      messages: this.data.messagesnull + e.currentTarget.dataset.emoji,
      messagesnull: this.data.messagesnull + e.currentTarget.dataset.emoji,
    })
    
  },

  //解决滑动穿透问题
  emojiScroll: function (e) {
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;

    var em = {}, emChar = that.data.emojiChar.split("-");
    var emojis = []
    that.data.emoji.forEach(function (v, i) {
      em = {
        char: emChar[i],
        emoji: "0x1f" + v
      };
      emojis.push(em)
    });
    that.setData({
      emojis: emojis
    })

    this.setData({
      nickName: wx.getStorageSync('username'),//微信名称
      avatarUrl: wx.getStorageSync('headpath'),//微信头像
      title:options.title,//文章标题
      no:options.no,//文章的标号
      g_id:options.g_id,//公众号的id
    })
    //获取公众号绑定的openid
    wx.cloud.callFunction({
      name:'getGopenid',
      data:{
        _id:options.g_id//传入公众号的id
      },
      success:function(res){
        console.log("是否获取公众号的openid",res)
        that.setData({
          g_openid:res.result.data.openid
        })
        if(res.result.data.openids){
          that.setData({
            g_openids:res.result.data.openids
          })
        }
      },
    })
    wx.cloud.callFunction({
      name:"getLeavingMessages",//获得用户自己曾经的留言
      data:{
        nickName:that.data.nickName,//用户名
        avatarUrl:that.data.avatarUrl,//用户的头像
        title: options.title,//文章标题
        no: options.no,//文章的标号
        g_id: options.g_id,//公众号的id
      },
      success:function(res){
        console.log("返回的用户留言结果",res)
        if (res.result.errMsg="collection.get:ok"){
          if(res.result.data.length){
            //用户之前留言过
            that.setData({
              messageinfo: res.result.data//这是获得的有信息
            })
            var messagetemp = new Array(that.data.messageinfo.length)
            var idtemp = new Array(that.data.messageinfo.length)
            for (var i = 0; i < that.data.messageinfo.length;i++){
              messagetemp[i] = that.data.messageinfo[i].userMesContent
              idtemp[i]=that.data.messageinfo[i]._id
            }
            that.setData({
              message:messagetemp,//获得所有的留言内容
              message_id: idtemp//所有信息的id
            })

          }else{
            //用户还没有留言暂时不执行
          }
          that.setData({
            message_len:that.data.message.length
          })
        }else{
          wx.showToast({
            title: '获取失败',
            icon: 'none',
          })
        }
      },
      fail:function(res){
        console.log(res.errMsg)
        wx.showToast({
          title: '联网失败',
          icon: 'fail',
        })
      },

    })
   
  
  },
  
  //获取留言文本信息
  getMessage:function(e){
    //console.log(e.detail.value)//获得文本框的值
    var length = parseInt(e.detail.value.length);

    if (length > this.data.noteMaxLen) {
      return;
    }
    this.setData({
      messagesnull: e.detail.value,
      messages: e.detail.value,
      current: length,
    })
  },
  //点击留言按钮 提交留言
  btnmessage: function () {

    wx.requestSubscribeMessage({
      tmplIds: ['FQtfi_q10CjMuTL9TpUeyjjYg4gIhkJTDLZ16ZuUK1c'],
      //EIdy0 是指作者收到留言通知
      success(res) {
        console.log("唤起框是", res)
        if (res.FQtfi_q10CjMuTL9TpUeyjjYg4gIhkJTDLZ16ZuUK1c == 'accept') {//接收通知
          that.setData({
            openid: wx.getStorageSync('openid'),
            needReply: true

          })
          wx.showToast({
            title: '您将收到作者的回复通知',
            icon:'none'
          })
        }
        else {
          that.setData({
            needReply: false

          })
          wx.showToast({
            title: '您将不会收到作者的回复通知',
            icon:'none'
          })
        }
      },
    })
    var that = this
        // FQtfi_q10CjMuTL9TpUeys7qSZakPbo9l7qlNrP_vMc: "accept"/"reject"
        // errMsg: "requestSubscribeMessage:ok"

    console.log("提交的留言信息为", that.data.messages)
    if (that.data.messages == "") {
      wx.showToast({
        title: '请输入留言内容...',
        icon:'none',
      })
    }else{

      //将留言上传到数据库中
      wx.cloud.callFunction({
        name:"postMessage",
        data:{
          //需要上传的值
          authorMesContent:"",//作者回复的内容
          isTop:false,//是否置顶
          isZan:[],//是否点赞
          zanCount:0,//点赞的个数
          username: wx.getStorageSync('username'),//用户名
          avatarUrl: wx.getStorageSync('headpath'),//头像
          messages: that.data.messages,//留言内容
          title: that.data.title,// 标题
          isCheck: false, //是否为精选
          no: that.data.no,  //文章编号
          openid: wx.getStorageSync('openid'),//wx.getStorageSync('openid'), //用户唯一标识  发送模板消息的时候需要用到 无论咋样都要存储
          g_id: that.data.g_id,   //公众号标识
          form_id: that.data.formId,//表单id
          token: wx.getStorageSync('token'),//token
          needReply: that.data.needReply//是否接收通知
        },
       
        
        success:function(res){
          //给公众号绑定的g_openid发送消息
          var date=Date.now()
          date = time.formatTime(date , 'Y-M-D h:m:s');
          wx.cloud.callFunction({
            name: 'acceptMessages',//,'testupdate44'
            data:{
              g_openid:that.data.g_openid,//公众号绑定的openid
              g_openids:that.data.g_openids,//公众号运营者的openids
              name1: wx.getStorageSync('username'),//留言者  这个只接受 汉字
              date2:date,//发送的时间
              thing3:that.data.messages,//用户的留言信息
              thing4:that.data.title,//文章的标题
            },
            success:function(res){
              console.log("已通知作者",res)
              console.log("已通知作者11",that.data.g_openids[0],that.data.g_openids[1])
            },
            fail:function(res){
              console.log("未通知作者",res,that.data.g_openids)
            }
          })
          console.log("留言上传成功",res)
          //更新message和message_id
          if (res.result.errMsg = "collection.get:ok"){
            if (res.result.result.data.length) {
              //用户之前留言过
              that.setData({
                messageinfo: res.result.result.data//这是获得的有信息
              })
              var messagetemp = new Array(that.data.messageinfo.length)
              var idtemp = new Array(that.data.messageinfo.length)
              for (var i = 0; i < that.data.messageinfo.length; i++) {
                messagetemp[i] = that.data.messageinfo[i].userMesContent
                idtemp[i] = that.data.messageinfo[i]._id
              }
              that.setData({
                message: messagetemp,//获得所有的留言内容
                message_id: idtemp,//所有信息的id
                messagesnull: '',
                current:0
              })

            } else {
              //用户还没有留言暂时不执行
            }
            that.setData({
              message_len: that.data.message.length
            })

          } else {
            wx.showToast({
              title: '获取失败',
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

      //显示留言内容
      
      //that.data.all_messages.push(that.data.messages) 
      //that.data.message = that.data.message.concat(that.data.all_messages)
      //  that.data.message[that.data.message.length] = that.data.messages
      //  that.setData({
      //    condition:true,
      //    messagesnull:'',
      //    message: that.data.message ,
      //  })
      console.log("更新后的内容", that.data.messages)
      wx.showToast({
        title: '留言成功',
        icon:'success',
      })

    }
    // wx.cloud.callFunction({
    //   name: "postMessage",
    //   data: {
    //     content: that.data.message
    //   }
    // }).then(res => {
    //   console.log(res)
    // }).catch(console.error)
    // //获取留言
    // //console.log(that.data.message)
  },

  //删除留言
  deleter_message:function(event){
    var that=this
    var index = event.currentTarget.dataset.index;
    console.log("删除",event)
    //判读index 超过message_len则直接删除 没有超过则执行数据库的删除
    if(index<that.data.message_len){
      wx.cloud.callFunction({
        name:'deleteMessage',
        data:{
          _id:that.data.message_id[index]
        },
        success:function(res){
          //messsage中删除一个元素
          that.data.message.splice(index,1)
          //删除对应的id下角标
          that.data.message_id.splice(index,1)

          that.setData({
            message: that.data.message
          })
          console.log("message的长度变为",that.data.message.length)
        },
        fail:function(res){
          wx.showToast({
            title: '删除数据库失败',
            icon:'none'
          })
        },
      })
    }else{

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