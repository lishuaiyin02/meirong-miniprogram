// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('messages').add({
    data:{
      authorMesContent: event.authorMesContent,//作者回复的内容
      isTop: event.isTop,//是否置顶
      isZan: event.isZan,//是否点赞
      zanCount: event.zanCount,//点赞的个数
      username: event.username,//用户名
      headimage: event.avatarUrl,//头像
      userMesContent: event.messages,//留言内容
      title: event.title,// 标题
      isCheck: event.isCheck, //是否为精选
      no: event.no,  //文章编号
      openid: event.openid, //用户唯一标识
      g_id: event.g_id,   //公众号标识
      form_id: event.formId,//表单id
      needReply: event.needReply,//是否接收通知
      token: event.token//token
    },
    success:function (res) {
    
    },
    error:function (res) {

    },

  })
  return await cloud.callFunction({
    name: "getLeavingMessages",//获得用户自己曾经的留言
    data: {
      nickName: event.username,//用户名
      avatarUrl: event.avatarUrl,//用户的头像
      title: event.title,//文章标题
      no: event.no,//文章的标号
      g_id: event.g_id,//公众号的id
    },
  })
}