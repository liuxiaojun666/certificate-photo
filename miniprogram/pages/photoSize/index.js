// 在页面中定义插屏广告
let interstitialAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
		photoSizeList: getApp().globalData.photoSizeList.slice(0, -1),
  },

	toMiniProgramSuccess(res) {
		//从其他小程序返回的时候触发
		wx.showToast({
			title: '欢迎回来',
			icon: 'none'
		})
	},

	goNextPage (e) {
		wx.navigateTo({
			url: '/pages/preEdit/preEdit?index=' + e.currentTarget.dataset.index,
		})
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		
		console.log("测试---onload")
		// 在页面onLoad回调事件中创建插屏广告实例
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-5e6ca9fec276ce4d'
			})
			interstitialAd.onLoad(() => {})
			interstitialAd.onError((err) => {console.log(err)})
			interstitialAd.onClose(() => {})
		}
		wx.setNavigationBarTitle({ title: '免冠照/证件照尺寸' })
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
	
})