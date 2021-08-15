// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
 await db.collection('messages').where({
   _id:event._id//messages的id
 }).remove({
   success: function (res) {
     return "删除成功"
   }
 })


}