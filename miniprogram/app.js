//app.js
App({
  onLaunch: function () {
    wx.cloud.init();
    
    var user=wx.getStorageSync('user') || {};  
    var userInfo=wx.getStorageSync('userInfo') || {}; 
    userInfo={};
    var that = this;
    if((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600))&&(!userInfo.nickName)){
        wx.showModal({
            title: '微信授权', 
            content: 'ADM201题库申请获得以下权限:',  
              success: function(res) {  
                  if (res.confirm) {
                    wx.cloud.callFunction({
                        name:'login',
                        data:{},
                        success:res=>{
                            that.globalData.openid = res.result.openid;
                            that.globalData.appid = res.result.appid; 
                        },
                        fail:err =>{
                            wx.showToast({	
                                icon: 'none',	
                                title: '获取 openid 失败，请检查是否有部署 login 云函数',	
                              })	
                            console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
                        }
                    });
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
    openid:'',
    appid:''
  }
})
