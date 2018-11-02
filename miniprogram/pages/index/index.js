//index.js
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {
    // 查看是否授权
  },
  bindGetUserInfo (e) {
    console.log(e.detail.userInfo)
  },
  allbegin: function(){
    wx.showModal({
      title: '提示', 
      content: '这是一个模态弹窗',  
            success: function(res) {  
                if (res.confirm) {  
                  wx.redirectTo({
                    url: '../dbOperator/dbOperator'
                  })  
                } else if (res.cancel) {  
                console.log('用户点击取消')  
                }  
            }  
    })
  }
})