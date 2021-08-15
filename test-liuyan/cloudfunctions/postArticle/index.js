  //点击提交文章之后
  // 云函数入口文件
  const cloud = require('wx-server-sdk')

cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
  const db = cloud.database()

  // 云函数入口函数
  exports.main = async (event, context) => {
    return await db.collection('article').add({
      data: {
        g_id: event.g_id,//公众号的id
        title: event.title,//文章的标题
        no: event.no,//文章的编号
        url: event.url,//上传文章的网址
        describe: event.describe,//上传文章的简介
        imageTitle: event.imageTitle,//上传文章的图片
        fileID:event.fileID,
        date:event.date,
      }
    })
  }