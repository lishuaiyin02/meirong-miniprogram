//该文章的所有精选过的留言
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('messages').where({
    g_id:event.g_id,
    no:event.no,
    isCheck:event.ischeck
  }).orderBy('isTop', 'desc').orderBy('zanCount', 'desc').get()
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  //}
}