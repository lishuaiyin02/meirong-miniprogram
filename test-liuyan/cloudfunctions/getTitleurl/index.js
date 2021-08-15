//在留言界面获得文章的标题及网址
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('article').where({
    g_id:event.g_id,
    no:event.no
  }).get()
}