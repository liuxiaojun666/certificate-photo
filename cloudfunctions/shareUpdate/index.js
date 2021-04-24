// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
	console.log(event, context)
	const wxContext = cloud.getWXContext()
	if (event.shareOpenid !== wxContext.OPENID) {
		await addToInviteesTodayList(event, wxContext)
	}
	setParent(event.shareOpenid, wxContext.OPENID)

	return {
		event,
		openid: wxContext.OPENID,
		appid: wxContext.APPID,
		unionid: wxContext.UNIONID,
	}
}

// 将用户添加到 邀请者的 列表中
function addToInviteesTodayList (event, wxContext) {
	return db.collection('share').where({
		openid: event.shareOpenid,
		date: event.date
	}).update({
		data: {
			invitedList: _.addToSet(wxContext.OPENID)
		}
	})
}

// 给用户设置邀请人
async function setParent (parentId, currentId) {
	const { data } = await db.collection('user').where({ openid: currentId }).get()
	if (data.parentOpenid) return
	await db.collection('user').where({ openid: currentId }).update({
		data: {
			parentOpenid: parentId
		}
	})
}
