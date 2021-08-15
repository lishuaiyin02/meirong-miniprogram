const cloud = require('wx-server-sdk');
const request = require('request');
const access_token = require('AccessToken');

cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })

// 云函数入口函数
exports.main = async (event, context) => {
  var appid ='wx9ac02c25a736b55d';//微信公众号开发者id
  var secret ='59e041e65a904e608662b3551cc2db34';//微信公众号开发者secret_key
  let _id = event._id;
  let at = new access_token({
    _id,
    appid,
    secret
  });
  return at.getCachedWechatAccessToken();
}



