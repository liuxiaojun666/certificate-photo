// miniprogram/pages/editPhoto/imageStyle/imageStyle.js
// 在页面中定义激励视频广告
let videoAd = null
// 在页面中定义插屏广告
let interstitialAd = null
let imgUrl = ''
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		TabCur: 0,
		videoLoaded: false,
		baseId: 'cloud://dev-4iov0.6465-dev-4iov0-1301148496',
		imgList: {
			nan: [
				'/hair/1/a3qcv-r6g9x-003',
				'/hair/1/a88uc-gypls-003',
				'/hair/1/aacbc-50spu-003',
				'/hair/1/ac95d-yxluo-003',
				'/hair/1/afxzl-3hfw1-003',
				'/hair/1/agg12-cxsf2-004',
				'/hair/1/agg12-cxsf2-005',
				'/hair/1/agvg2-82hjb-003',
				'/hair/1/ahvga-47qgd-003',
				'/hair/1/ajzxy-d1ktk-003',
				'/hair/1/asci9-je7bt-003',
				'/hair/1/at7sp-uimus-003',
				'/hair/1/ateyh-hjql6-003',
				'/hair/1/aw38p-mxquf-003',
				'/hair/1/ay6d0-38pia-003',
			],
			nv: [
				'/hair/0/a05oo-akf25-003',
				'/hair/0/a504g-wn6on-003',
				'/hair/0/a5vqd-eiu7o-003',
				'/hair/0/a7ugw-0g2w7-003',
				'/hair/0/a8w6g-1as6k-003',
				'/hair/0/a9kvk-97598-003',
				'/hair/0/a9zws-14st1-003',
				'/hair/0/aaqo3-mr5fz-004',
				'/hair/0/acmui-av0db-003',
				'/hair/0/ad56r-j8n5z-003',
				'/hair/0/ajqxy-6wvtx-003',
				'/hair/0/amk4e-z31e9-003',
				'/hair/0/atk4p-knqy1-003',
				'/hair/0/avdv6-qx5o3-003',
				'/hair/0/ayd3d-mbmx9-003'
			]
		}
	},

	tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
	},
	
	selectImg (e) {
		const baseSrc = 'https://6465-dev-4iov0-1301148496.tcb.qcloud.la'
		imgUrl = baseSrc + e.currentTarget.dataset.url + '.png'

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
    eventChannel.emit('selectHair', {imgUrl});
		wx.navigateBack({})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({ title: '免冠照发型' })

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
				adUnitId: 'adunit-71fe77c8c4d0e3ca'
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

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})