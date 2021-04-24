// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	
	const db = cloud.database()
	const res = await db.collection('user').where({
		openid: event.openid || wxContext.OPENID
	}).update({ data: event.data })

	return {
		res,
		event,
		openid: wxContext.OPENID,
		appid: wxContext.APPID,
		unionid: wxContext.UNIONID,
	}
}