const app = getApp()
Page({

	// 主动下发客服消息
	sendGroupQRCode () {
		wx.cloud.callFunction({
			name: 'customerService'
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '点这个帮我做张免冠照片吧。谢谢！',
			path: '/pages/index/index',
			imageUrl: '/images/shareShow.jpg'
		}
	},
	
  onShareTimeline: function () {
		return {
			title: '谁帮我制作个免冠照？点这个，谢谢。',
			// path: '/pages/index/index',
			imageUrl: '/images/shareShow.jpg'
		}
	},
})