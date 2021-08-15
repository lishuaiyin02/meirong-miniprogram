//获得公众号对应的作者的openid

// 云函数入口文件 
const cloud = require('wx-server-sdk')

cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
 return await db.collection('gonginfo').doc(event._id).get()
}