// miniprogram/pages/mein/mein.js
// 在页面中定义插屏广告
let interstitialAd = null
// 在页面中定义激励视频广告
let videoAd = null
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {},
		authorized: false, // 用户头像昵称授权
		signed: false,
		signInLoading: false,
		videoLoaded: false
	},

	bindGetUserInfo (e) {
		if (e.detail.userInfo) {
			this.setUserInfo(e.detail.userInfo)
		}
	},
	
	setUserInfo (userInfo) {
		this.setData({
			authorized: true,
			userInfo: {
				...this.data.userInfo,
				...userInfo
			}
		})
		const openid = getApp().globalData.openid
		if (!openid) return
		wx.cloud.callFunction({
			name: 'setUserInfo',
			data: {openid, data: userInfo}
		}).then(res => {
			console.log(res)
			// wx.showToast({ title: '签到成功', })
			// this.getUserInfo()
		})
		// const db = wx.cloud.database()
		// db.collection('user').where({ openid }).update({
		// 	data: {...userInfo}
		// })
	},

	signIn () {
		if (this.data.signInLoading) return
		if (!this.data.authorized) {
			return wx.showToast({
				title: '请授权登录',
				icon: 'none'
			})
		}
		this.setData({ signInLoading: true })
		wx.cloud.callFunction({
			name: 'useCount',
			data: {inc: 1, signIn: true}
		}).then(res => {
			wx.showToast({ title: '签到成功', })
			this.getUserInfo()
		})
	},

	lookVideo () {
		// 用户触发广告后，显示激励视频广告
		if (videoAd) {
			videoAd.show().catch(() => {
				// 失败重试
				videoAd.load()
					.then(() => videoAd.show())
					.catch(err => {
						wx.showToast({
							title: '视频显示失败',
							icon: 'loading'
						})
					})
			})
		}
	},

	modalConfirm() {
		wx.showModal({
			title: '请选择奖励',
			content: '选择普通，+3次普通下载，选择升级版 +1次升级版精细抠图',
			showCancel: true,
			cancelText: '普通版',
			confirmText: '升级版',
			success: (res) => {
				if (res.confirm) {
					this.inccVipCount()
				} else if (res.cancel) {
					this.incCount()
					console.log('用户点击取消')
				}
				wx.showToast({ title: '奖励已下发'})
			},
			fail: (res) => {
				// console.log(res)
				this.incCount()
			}
		})
	},

	incCount () {
		wx.showLoading()
		wx.cloud.callFunction({
			name: 'useCount',
			data: {inc: 3}
		}).then(res => {
			wx.hideLoading({})
			this.timerFunc()
		})
	},

	inccVipCount () {
		wx.showLoading()
		wx.cloud.callFunction({
			name: 'useVipCount',
			data: {
				lookVideo: true
			}
		}).then(res => {
			wx.hideLoading({})
			this.timerFunc()
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 在页面onLoad回调事件中创建插屏广告实例
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-aa58fcbed152f8dc'
			})
			interstitialAd.onLoad(() => {})
			interstitialAd.onError((err) => {})
			interstitialAd.onClose(() => {})
		}

		// 在页面onLoad回调事件中创建激励视频广告实例
		if (wx.createRewardedVideoAd) {
			videoAd = wx.createRewardedVideoAd({
				adUnitId: 'adunit-93858df72c78d43a'
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
				if (res && res.isEnded) {
					// this.useCount(true, 1)
					// this.inccVipCount()
					// setTimeout(this.modalConfirm, 500)
					this.modalConfirm()
				} else {
					wx.showToast({
						title: '看完才有奖励哦！',
						icon: 'none'
					})
				}
			})
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	getUserInfo () {
		const that = this
		const openid = getApp().globalData.openid
		if (!openid) {
			return
		}
		const db = wx.cloud.database()
		db.collection('user').where({ openid }).get().then(res => {
			this.setData({
				userInfo: res.data[0],
				signed: res.data[0].signInDate.trim() === new Date().toDateString().trim()
			})
			
			wx.getSetting({
				success (res){
					if (res.authSetting['scope.userInfo']) {
						// 已经授权，可以直接调用 getUserInfo 获取头像昵称
						wx.getUserInfo({
							success: function(res) {
								that.setUserInfo(res.userInfo)
							}
						})
					} else {
						that.setData({
							authorized: false
						})
					}
				}
			})
		})
	},

	getNewVersion () {
		const updateManager = wx.getUpdateManager()

		updateManager.onCheckForUpdate(function (res) {
			// 请求完新版本信息的回调
			if (!res.hasUpdate) {
				wx.showToast({
					title: '已是最新版本',
				})
			} else {
				wx.showLoading({
					title: '正在下载新版本',
				})
			}
		})

		updateManager.onUpdateReady(function () {
			wx.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				}
			})
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.timerFunc()

		// 在适合的场景显示插屏广告
		if (interstitialAd) {
			interstitialAd.show().catch((err) => {
				console.error(err)
			})
		}
	},

	timerFunc () {
		const openid = getApp().globalData.openid
		if (openid) {
			this.getUserInfo()
		} else {
			setTimeout(() => this.timerFunc(),3000)
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

	},

	
  onShareTimeline: function () {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、证件照换背景，免费生成、下载。',
			// path: '/pages/index/index',
			imageUrl: '/images/shareShow.jpg'
		}
	},

	showQrcode() {
		wx.previewImage({
			urls: ['https://6465-dev-4iov0-1301148496.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200327222252.jpg?sign=6ed404519a6e636bd8e34071c07f0449&t=1591411659'],
			current: 'https://6465-dev-4iov0-1301148496.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200327222252.jpg?sign=6ed404519a6e636bd8e34071c07f0449&t=1591411659' // 当前显示图片的http链接      
		})
	},

	showQrcode2() {
		wx.previewImage({
			urls: ['https://6465-dev-4iov0-1301148496.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200606104940.jpg?sign=e3dac636b9d352831ef70e77c4ee0621&t=1591411804'],
			current: 'https://6465-dev-4iov0-1301148496.tcb.qcloud.la/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200606104940.jpg?sign=e3dac636b9d352831ef70e77c4ee0621&t=1591411804' // 当前显示图片的http链接      
		})
	},
		// 预览群二维码
		viewGroupQRcode () {
			wx.previewImage({
				urls: ['cloud://dev-4iov0.6465-dev-4iov0-1301148496/mein-wechart-qrcode.png'],
				current: 'cloud://dev-4iov0.6465-dev-4iov0-1301148496/mein-wechart-qrcode.png' // 当前显示图片的http链接      
			})
		},
})