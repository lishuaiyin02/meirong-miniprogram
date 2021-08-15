// 云函数入口文件
const cloud = require('wx-server-sdk')
//const request=require("request")
cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// async function getWechatPosts(accessToken, offset, count){
//   let url ='https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token'
// }

// 云函数入口函数
exports.main = async (event, context) => {
 return await db.collection('article').doc(event._id).update({
   data:{
    title:event.title,//文章的标题
    no:event.no,//文章的编号
    url:event.url,//上传文章的网址
    describe:event.describe,//上传文章的简介
    imageTitle:event.cloudPath,//上传文章的图片
    fileID:event.fileID,//上传路径的fileID，下载的时候会用到
    date:event.date,//上传文章的上传时间
   },
   success: function(res) {
    console.log(res.data)
  }

 })
}