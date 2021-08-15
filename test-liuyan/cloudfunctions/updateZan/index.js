/*更新赞的状态和个数 */
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection("messages").doc(event._id).update({
    data:{
      isZan: event.isZan,
      zanCount: event.zanCount,
      authorMesContent:event.authorMesContent,
      isCheck:event.isCheck,
      isTop:event.isTop
    },
    success:function (res) {
      return "success"
    }
  })
}