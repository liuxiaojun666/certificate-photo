// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()

	const openid = wxContext.OPENID
	
	const { data } = await db.collection('user').where({ openid }).get()

	if (data.length) return { openid }

	await db.collection('user').add({
		data: {
			openid,
			create_time: Date.now(),
			accumCreatePhoto: 0,
			count: 1,
			signInDate: ''
		}
	})
	
	return {
		openid: wxContext.OPENID,
		unionid: wxContext.UNIONID
	}
}
