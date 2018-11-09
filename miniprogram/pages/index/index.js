//index.js
const app = getApp()

Page({
  startAns:function(){
    wx.navigateTo({
      url: '../dbOperator/dbOperator'
    })
  }
})