// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // event 数据结构
  // const e = {
  //   "CreateTime": 1663989948,
  //   "Event": "subscribe_msg_popup_event",
  //   "FromUserName": "obRga0ZrZkNe5ZF60smAvbscTM5Y",
  //   "List": {
  //     "PopupScene": "0",
  //     "SubscribeStatusString": "accept",
  //     "TemplateId": "CNuffKDjmxEOU_hM44Cu0KoGqOjfdacpbk4LT1abcnE"
  //   },
  //   "MsgType": "event",
  //   "ToUserName": "gh_82e5b8a1fccf",
  //   "userInfo": {
  //     "appId": "wxbe6c30a61a51b422",
  //     "openId": "obRga0ZrZkNe5ZF60smAvbscTM5Y"
  //   }
  // }

  if (event.List.SubscribeStatusString !== 'accept') return

  db.collection('subscrib-message').add({
    data: {
      openid: event.userInfo.openId,
      tmplId: event.List.TemplateId,
      time: event.CreateTime
    },
  })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}