//注册和更新公众号信息都用这个函数
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({evn:cloud.DYNAMIC_CURRENT_ENV})
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('gonginfo').doc(event.g_id).update({
    data: {
    // 表示将 done 字段置为 true
    name:event.name,//文章的名称
    describes:event.describe,//上传文章的简介
    fileID:event.fileID,//上传路径的fileID，下载的时候会用到
    password:event.password,//密码
    openid:event.openid,//和用户关联
    headpath:''
  },
  success: function(res) {
    console.log(res.data)
  }
})
}