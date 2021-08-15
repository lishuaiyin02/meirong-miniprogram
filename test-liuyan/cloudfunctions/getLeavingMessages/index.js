/*返回这篇文章用户的所有留言 */
// 云函数入口文件  
const cloud = require('wx-server-sdk')

cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('messages').where({
    g_id:event.g_id,//公众号的id
    no:event.no,//公众号的第几篇文章
    title:event.title,
    username: event.nickName,
    headimage: event.avatarUrl
  }).get()
}