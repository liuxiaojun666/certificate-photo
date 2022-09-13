// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const data = {
		vipCount: _.inc(event.lookVideo ? 1 : (1 * event.inc)),
		lookVideoCount: _.inc(event.lookVideo ? 1 : 0)
	}

	const res = await db.collection('user').where({
		openid: event.openid || wxContext.OPENID
	}).update({ data })

	return {
		success: res.stats.updated > 0,
		openid: wxContext.OPENID,
		appid: wxContext.APPID,
		unionid: wxContext.UNIONID,
	}
}