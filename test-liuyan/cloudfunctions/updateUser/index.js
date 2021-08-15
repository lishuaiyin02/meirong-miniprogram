
/*添加，修改或删除 运营者用户 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command 
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('gonginfo').doc(event.g_id).update({
    data:{
      bzs:event.bzs,
      openids: event.openids
    },
    success:function (res) {
      return "success"
    }

  })
}