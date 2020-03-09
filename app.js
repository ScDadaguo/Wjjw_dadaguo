//app.js
App({
  
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      //获取code
      success: res => {
        console.log("that's ", this);
        let that =this
        console.log(res)
        var code = res.code; //返回code
        var appId = 'wx6266ee9fca6eec27';
        var secret = '320924f0245d209874f583a1f2e1b511';
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'json'
          },
          success: function (res) {
            console.log(res)
            var openid = res.data.openid
            that.globalData.openId = openid
            console.log('openid为' + openid);
          } 
        })
        
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log("that's ", this);
        console.log("guohao")
        console.log(this.globalData)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(this.globalData.userInfo)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openId: null
  },
  
})