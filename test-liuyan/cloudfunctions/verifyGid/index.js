//用来验证从公众号中得到的g_id是否有效
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({evn:cloud.DYNAMIC_CURRENT_ENV})
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
 return await db.collection('gonginfo').where({
   _id:event._id
 }).get()
}