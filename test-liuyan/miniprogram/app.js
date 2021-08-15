//app.js
App({
  serverUrl: "http://127.0.0.1:8081/",
  // serverUrl: "https://9dd3156c8240.ngrok.io/",
  userInfo: null,

  setGlobalUserInfo: function(user) {
    wx.setStorageSync("userInfo", user);
  },

  getGlobalUserInfo: function () {
    return wx.getStorageSync("userInfo");
  }
})