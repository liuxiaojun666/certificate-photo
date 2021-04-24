// 在页面中定义插屏广告
let interstitialAd = null

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		msg: '',
		tempFilePath: '',
		url: ''
	},

	contineu () {
		wx.navigateBack()
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			msg: options.msg,
			tempFilePath: options.tempFilePath,
			url: options.url
		})

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

	preView () {
		wx.previewImage({
			urls: [this.data.url],
			current: this.data.url
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		// 在适合的场景显示插屏广告
		if (interstitialAd) {
			interstitialAd.show().catch((err) => {
				console.error(err)
			})
		}
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、自定义尺寸、证件照换背景，免费生成、下载。',
			path: '/pages/index/index',
			// imageUrl: '/images/shareShow.jpg'
			imageUrl: this.data.tempFilePath
		}
	}
})