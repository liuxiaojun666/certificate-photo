// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()

	const shareRes = await db.collection('share').where({
		openid: wxContext.OPENID,
		date: event.date
	}).update({
		data: { [event.openid]: true }
	})

	let useCountRes
	if (shareRes.stats.updated) {
		useCountRes = await cloud.callFunction({
			name: 'useCount',
			data: { inc: 3, openid: wxContext.OPENID }
		})
	}

	return {
		useCountRes,
		shareRes,
		event,
		openid: wxContext.OPENID,
		appid: wxContext.APPID,
		unionid: wxContext.UNIONID,
	}
}