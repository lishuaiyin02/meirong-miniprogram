//获取这个公众号的所有文章
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
   var res=await db.collection('article').where({
    g_id: event.id
  }).orderBy('date','desc').get()
  if (res.data.length!=0){
    //更换每个imagtitle
    var fileList = new Array()
    fileList = []
    for (let i = 0; i < res.data.length; i++) {
      fileList.push(res.data[i].fileID)
    }
    var result = await cloud.getTempFileURL({
      fileList: fileList
    })
    //替换imagetitle
    for (let i = 0; i < res.data.length; i++) {
      res.data[i].imageTitle = result.fileList[i].tempFileURL
    }
  }
  

  return res
}