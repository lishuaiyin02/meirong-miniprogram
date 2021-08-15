const cloud = require('wx-server-sdk')
cloud.init({ evn: cloud.DYNAMIC_CURRENT_ENV })
const request = require('request')
class AccessToken {
  constructor({
    _id,
    appid,
    secret
  }) {
    this._id=_id
    this.appid = appid
    this.secret = secret
  }
  // 获取公众号access_token
  async getWechatAccessToken() {
    let token_url = 'https://service-90zknigb-1301866851.bj.apigw.tencentcs.com/release/getAccessToken?APPID=' +this.appid+ '&'+'SECRET='+this.secret;
    let options={
      url:token_url,
      method:"GET"
    }
    const rp = 
       new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
          if (error) {
            reject(error);
          }
          resolve(response);
        });
      });
    const result = await rp;
    return (typeof result.body === 'object') ? result.body : JSON.parse(result.body);;
  }
  
  // 获取保存在数据库的公众号access_token
  async getCachedWechatAccessToken() {
    let collection = 'wx-access-token'; //数据库集合名称
    let _id=this._id
    let gapTime = 300; // 5 分钟
    cloud.init({ evn: 'test-liuyan' });
    let db = cloud.database();
    let result = await db.collection(collection).where({
      _id:this._id
    }).get();
   
    // 数据库没有，获取
    if (!result.data.length) {
      let accessTokenBody = await this.getWechatAccessToken();
      let act = accessTokenBody.access_token;
      let ein = accessTokenBody.expires_in * 1000;
      await db.collection(collection).add({
        data: {
          _id: _id,
          accessToken: act,
          expiresIn: ein,
          createTime: Date.now()
        }
      });
      return act;
    } else {
      let data = result.data[0];
      let {
        _id,
        accessToken,
        expiresIn,
        createTime
      } = data;
      // 判断access_token是否有效
      if (Date.now() < createTime + expiresIn ) {
        return accessToken;
      }
      // 失效，重新获取
      else {
        let accessTokenBody = await this.getWechatAccessToken();
        let act = accessTokenBody.access_token;
        let ein = accessTokenBody.expires_in * 1000;
        await db.collection(collection).doc(_id).set({
          data:{
            accessToken: act,
            expiresIn: ein,
            createTime: Date.now()
          },
        });
        return accessTokenBody.access_token;
      }
    }
  }
}
module.exports = AccessToken