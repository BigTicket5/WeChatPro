
exports.main = (event, context) => {
  console.log(event.userInfo)
  console.log(context)


  return {
    openid: event.userInfo.openId,
    appid: event.userInfo.appId,
  }
}
