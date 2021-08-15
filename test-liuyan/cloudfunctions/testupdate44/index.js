//测试更新test集合
// 云函数入口文件
// const cloud = require('wx-server-sdk')
// cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
// const db = cloud.database()

// // 云函数入口函数
// exports.main = async (event, context) => {
//   var t = await db.collection('test').doc('70d29fac5ec53d350010f99334bb8498').get()
//   var tt=t.data.tes
//   for(var i=0;i<tt.length;i++){
//     if(tt[i]=="4"){
//       tt.splice(i,1)
//       break
//     }
//   }
//   return await db.collection('test').doc('70d29fac5ec53d350010f99334bb8498').update({
//     data:{
//       tes:tt
//     }
//   })

//   console.log(tt)

// }

//测试留言内容多个文章标题
//当用户留言时作者接收通知
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.g_openid,
      //page: 'index',
      // lang: 'en_US',
      data: {
        name1: { "value": event.name1, "color": "#173177" },//留言者
        date2: { "value": event.date2, "color": "#173177" },//留言时间
        thing3: { "value": event.thing3, "color": "#173177" },//留言内容
        thing4: { "value": event.thing4, "color": "#173177" },//留言标题
      },
      templateId: 'YQ6B9tjoML5XXazZyrjl1t_Zf1P6B1j6UtFuE_EIdy0',
      miniprogramState: 'developer'
    })
    return result
  } catch (err) {
    return err
  }
}