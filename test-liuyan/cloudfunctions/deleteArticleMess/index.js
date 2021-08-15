//后台管理中删除文章以及文章对应的留言
//文章通过公众号id和文章的编号
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('article').where({
    g_id:event.g_id,
    no:event.no
  }).remove({
    success: function (res) {
   
  }
  })
  await db.collection('messages').where({
    g_id:event.g_id,
    no:event.no
  }).remove({
    success: function (res) {
      
    }
  })
 
  

}