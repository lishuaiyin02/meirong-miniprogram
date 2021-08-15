// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  await cloud.openapi.customerServiceMessage.send({
    touser: wxContext.OPENID,
    msgtype: 'text',
    text: {
      content: '如有bug或者其他急需，可添加微信lishuaiy进行联系，请备注“小程序”',
    },
  })

  return 'success'
}