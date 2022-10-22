// 在页面中定义插屏广告
let interstitialAd = null
const app = getApp()
Page({

  onLoad () {
    // 在页面onLoad回调事件中创建插屏广告实例
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-7bd4afc44e5cebbd'
			})
			interstitialAd.onLoad(() => {})
			interstitialAd.onError((err) => {})
			interstitialAd.onClose(() => {})
		}
  },

  onShow () {
    // 在适合的场景显示插屏广告
		if (interstitialAd) {
			interstitialAd.show().catch((err) => {
				console.error(err)
			})
		}
  },

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
			imageUrl: '/shareShow.jpg'
		}
	},
	
  onShareTimeline: function () {
		return {
			title: '谁帮我制作个免冠照？点这个，谢谢。',
			// path: '/pages/index/index',
			imageUrl: '/shareShow.jpg'
		}
	},
})