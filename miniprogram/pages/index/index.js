//index.js
const app = getApp()

Page({
  onLoad: function() {
    // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
            }
          }),
          wx.login({
            success (res) {
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: 'https://test.com/onLogin',
                  data: {
                    code: res.code
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
        else{
          wx.showModal({
            title: '微信授权', 
            content: 'ADM201题库申请获得以下权限:',  
              success: function(res) {  
                  if (res.confirm) {  
                    console.log('用户同意')
                  } else if (res.cancel) {  
                    console.log('用户拒绝')  
                  }  
              }  
          })
        }
      }
    })
  },
  startAns:function(){
    wx.navigateTo({
      url: '../dbOperator/dbOperator'
    })
  }
})