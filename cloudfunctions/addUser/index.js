// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const groupQrcodeUrl = 'https://6465-dev-4iov0-1301148496.tcb.qcloud.la/group-qrcode/qrcode.jpg?t=' + Date.now()
// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()

	const openid = wxContext.OPENID
	
	const { data } = await db.collection('user').where({ openid }).get()

	if (data.length) return { openid, groupQrcodeUrl }

	await db.collection('user').add({
		data: {
			openid,
			groupQrcodeUrl,
			create_time: Date.now(),
			accumCreatePhoto: 0,
			count: 1,
			signInDate: ''
		}
	})
	
	return {
		groupQrcodeUrl,
		openid: wxContext.OPENID,
		unionid: wxContext.UNIONID
	}
}
