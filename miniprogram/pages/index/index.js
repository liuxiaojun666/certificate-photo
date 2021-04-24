// 在页面中定义插屏广告
let interstitialAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
		extraData: {
	　　from: '免冠照片'
　　}
  },

	toMiniProgramSuccess(res) {
		//从其他小程序返回的时候触发
		wx.showToast({
			title: '欢迎回来',
			icon: 'none'
		})
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		wx.setNavigationBarTitle({ title: '免冠照/证件照' })

		// 在页面onLoad回调事件中创建插屏广告实例
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-0a1e9ff7ab9396d0'
			})
			if (interstitialAd) {
				
				interstitialAd.onLoad(() => {})
				interstitialAd.onError((err) => {})
				interstitialAd.onClose(() => {})
			}
		}

		if (!options.shareOpenid) return
		// console.log(options.date.trim() === new Date().toDateString().trim())
		if (options.date.trim() !== new Date().toDateString().trim()) return
		this.shareSuccess(options.shareOpenid)
	},

	goNextPage (e) {
		wx.navigateTo({
			// url: '/pages/example/example?index=' + e.currentTarget.dataset.index,
			url: '/pages/preEdit/preEdit?index=' + e.currentTarget.dataset.index,
		})
	},
	
	/**
	 * 用户来自邀请
	 */
	shareSuccess (shareOpenid, avatarUrl) {
		wx.cloud.callFunction({
			name: 'shareUpdate',
			data: {
				shareOpenid,
				// avatarUrl,
				date: new Date().toDateString()
			},
			success: res => {
				console.log(res)
			}
		})
	},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、证件照换背景，免费生成、下载。',
			path: '/pages/index/index',
			imageUrl: '/images/shareShow.jpg'
		}
	},
  onShareTimeline: function () {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、证件照换背景，免费生成、下载。',
			// path: '/pages/index/index',
			imageUrl: '/images/shareShow.jpg'
		}
	},
	
	onShow () {
		// 在适合的场景显示插屏广告
		// if (interstitialAd) {
		// 	interstitialAd.show().catch((err) => {
		// 		console.error(err)
		// 	})
		// }
	}
})