//app.js
App({
  onLaunch: function () {
    wx.cloud.init();
    
    var user=wx.getStorageSync('user') || {};  
    var userInfo=wx.getStorageSync('userInfo') || {}; 
    var that = this;
    console.log(user);
    console.log(userInfo);
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
                            that.globalData.user.openid = res.result.openid;
                            that.globalData.user.appid = res.result.appid;
                            wx.setStorageSync('user', that.globalData.user);//存储user
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
                        },
                        fail:err =>{
                            wx.showToast({	
                                icon: 'none',	
                                title: '获取 openid 失败，请检查是否有部署 login 云函数',	
                              })	
                            console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
                        }
                    });
                }else if (res.cancel) {  
                    console.log('用户拒绝');
                    wx.clearStorage();
                    wx.navigateBack({
                        delta: -1
                    })  
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
    user:{
        openid:'',
        appid:''
    }
  }
})
