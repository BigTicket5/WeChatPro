//app.js
App({
  onLaunch: function () {
    wx.cloud.init();
    var that = this
    var user=wx.getStorageSync('user') || {};  
    var userInfo=wx.getStorageSync('userInfo') || {}; 
    userInfo={};
    if((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600))&&(!userInfo.nickName)){
        wx.showModal({
            title: '微信授权', 
            content: 'ADM201题库申请获得以下权限:',  
              success: function(res) {  
                  if (res.confirm) {
                    wx.login({  
                    success: function(res){ 
                        if(res.code) {
                            wx.getUserInfo({
                                success: function (res) {
                                    var objz={};
                                    objz.avatarUrl=res.userInfo.avatarUrl;
                                    objz.nickName=res.userInfo.nickName;
                                    wx.setStorageSync('userInfo', objz);//存储userInfo
                                }
                            });
                            var d=that.globalData;//这里存储了appid、secret、token串  
                            var l='https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+res.code+'&grant_type=authorization_code';  
                            wx.request({  
                                url: l,  
                                data: {},  
                                method: 'GET',
                                success: function(res){ 
                                    var obj={};
                                    obj.openid=res.data.openid;  
                                    obj.expires_in=Date.now()+res.data.expires_in;  
                                    //console.log(obj);
                                    wx.setStorageSync('user', obj);//存储openid  
                                }  
                            });
                        }else {
                            console.log('获取用户登录态失败！' + res.errMsg)
                        }          
                    }  
                    });
                }else if (res.cancel) {  
                    console.log('用户拒绝');  
                }  
            }
        }) 
    }
    else{
        console.log(userInfo);
    }
  },
  data:{
    optionNames:['A','B','C','D','E','F']
  },
  globalData:{
    optionNames:['A','B','C','D','E','F'],
    appid:'',
    secret:''
  }
})
