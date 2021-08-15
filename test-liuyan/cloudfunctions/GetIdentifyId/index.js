/*验证密码 */
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command 
// 云函数入口函数
exports.main = async (event, context) => {
  var res = await db.collection('gonginfo').where(_.or([
    {
      'password': event.password,
      'openid': event.openid 
    },
    {
      'password': event.password,
      'openids': _.in([event.openid])
    }
  ])).get()
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
      res.data[i].headpath = result.fileList[i].tempFileURL
    }
  }
  return res
}