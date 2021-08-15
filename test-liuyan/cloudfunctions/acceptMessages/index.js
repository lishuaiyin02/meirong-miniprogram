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
    if(event.g_openids){
      var resultn=''
      for(var i=0;i<event.g_openids.length;i++){
        resultn = await cloud.openapi.subscribeMessage.send({
          touser: event.g_openids[i],
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
      }
    }
    return event.g_openids
  } catch (err) {
    return err
  }
}