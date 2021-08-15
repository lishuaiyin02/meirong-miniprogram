//发送作者回复的服务通知 
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openid,
        //page: 'index',
        lang: 'zh_CN',
          data: {
            thing2: { "value": event.inputContentxml, "color": "#173177" },
            thing3: { "value": event.title, "color": "#173177" },
            thing4: { "value": event.userMesContent, "color": "#173177" },
    },
      templateId: 'FQtfi_q10CjMuTL9TpUeyjjYg4gIhkJTDLZ16ZuUK1c',
        miniprogramState: 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}