// miniprogram/pages/editPhoto/imageStyle/imageStyle.js
// 在页面中定义激励视频广告
let videoAd = null
// 在页面中定义插屏广告
let interstitialAd = null
let imgUrl = ''
const allClothes = {}
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		TabCur: 0,
		videoLoaded: false,
		imgList: {
			nan: [],
			nv: [],
			other: []
		}
	},

	tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
	},
	
	selectImg (e) {
		imgUrl = e.currentTarget.dataset.url

		// 用户触发广告后，显示激励视频广告
		if (videoAd) {
			videoAd.show().catch(() => {
				// 失败重试
				videoAd.load()
					.then(() => videoAd.show())
					.catch(err => {
						console.log('激励视频 广告显示失败')
					})
			})
		} else {
			back()
		}
		
	},

	back () {
		const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('selectClothes', {imgUrl});
		wx.navigateBack({})
	},

	async getData () {
		wx.showLoading({
			title: '稍等片刻...',
		})
		const { result } = await wx.cloud.callFunction({
			name: 'getClothes',
    })
    Object.assign(allClothes, result.clothes)
		this.setData({
			imgList: {
        nan: allClothes.nan.slice(0, 6),
        nv: allClothes.nv.slice(0, 6),
        other: allClothes.other.slice(0, 6)
      }
		})
		wx.hideLoading()
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({ title: '免冠照/证件照换装' })
		this.getData()

		// 在页面onLoad回调事件中创建激励视频广告实例
		if (wx.createRewardedVideoAd) {
			videoAd = wx.createRewardedVideoAd({
				adUnitId: 'adunit-240d1c7fb731d343'
			})
			videoAd.onLoad(() => {
				this.setData({
					videoLoaded: true
				})
			})
			videoAd.onError((err) => {
				this.setData({
					videoLoaded: false
				})
			})
			videoAd.onClose((res) => {
				console.log(res)
				if (res && res.isEnded) {
					if(imgUrl) this.back()
				} else {
					wx.showToast({
						title: '看完才可以使用哦',
						icon: 'none'
					})
				}
			})
		}
				
		// 在页面onLoad回调事件中创建插屏广告实例
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-ef203d1fea23c207'
			})
			interstitialAd.onLoad(() => {})
			interstitialAd.onError((err) => {})
			interstitialAd.onClose(() => {})
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

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
  
  // 触底加载
  onReachBottom() {
    const key = ['nv', 'nan', 'other'][this.data.TabCur]
    if (this.data.imgList[key].length === allClothes[key].length) return
    this.setData({
      imgList: {
        ...this.data.imgList,
        [key]: allClothes[key].slice(0, this.data.imgList[key].length + 6)
      }
    })
  }

})