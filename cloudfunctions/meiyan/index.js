// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()

// 美颜，还没做

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()


	return {
		event,
		result,
		openid: wxContext.OPENID,
		appid: wxContext.APPID,
		unionid: wxContext.UNIONID,
	}
}