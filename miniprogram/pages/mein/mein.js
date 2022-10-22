// miniprogram/pages/mein/mein.js
// 在页面中定义激励视频广告
let videoAd = null
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {},
		authorized: false, // 用户头像昵称授权
		signed: false,
		signInLoading: false,
		videoLoaded: false,
		canIUseGetUserProfile: true,
		envVersion: wx.getAccountInfoSync().miniProgram.envVersion || 'release'
	},

	// 下发赞赏二维码
	sendAppreciateQRCode (e) {
		wx.cloud.callFunction({
			name: 'sendAppreciateQRCode'
		})
	},

	// 下发群二维码
	sendGroupQRCode () {
		wx.cloud.callFunction({
			name: 'customerService'
		})
	},

	// 复制GitHub地址
	copyGithubLink() {
		wx.setClipboardData({
			data: 'https://github.com/liuxiaojun666/ID-Photo-miniapp-wechart',
			success (res) {
				wx.showToast({
					title: '开源地址已复制',
				})
			}
		})
	},

	// 获取用户信息回调
	bindGetUserInfo (e) {
		if (e.detail.userInfo) {
			this.setUserInfo(e.detail.userInfo)
		}
	},

	// 新的获取用户信息事件回调
	getUserProfile(e) {
    if (this.data.isLatestInfo) return
    wx.getUserProfile({
      desc: '用于完善资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
				this.setUserInfo(res.userInfo)
				this.setData({ isLatestInfo: true })
      }
    })
  },
	
	// 设置用户信息
	setUserInfo (userInfo) {
		this.setData({
			authorized: !!userInfo.nickName,
			userInfo: {
				...this.data.userInfo,
				...userInfo
			}
		})
		const openid = app.globalData.openid
		if (!openid) return
		wx.cloud.callFunction({
			name: 'setUserInfo',
			data: {openid, data: userInfo}
		}).then(res => {
			console.log(res)
		})
	},

	// 签到
	signIn () {
		if (this.data.signInLoading) return
		if (!this.data.authorized) {
			return wx.showToast({
				title: '请授权登录',
				icon: 'none'
			})
		}
    this.subscribeSign()
		this.setData({ signInLoading: true })
		wx.cloud.callFunction({
			name: 'useCount',
			data: {inc: 1, signIn: true}
		}).then(res => {
			wx.showToast({ title: '签到成功', })
      this.getUserInfo()
      this.shareSuccess()
		})
  },
  
  // 被邀请成功
  shareSuccess () {
    const fromShare = wx.getStorageSync('fromShare')
    if (!fromShare) return
    wx.cloud.callFunction({
			name: 'shareUpdate',
			data: {
        shareOpenid: fromShare
      }
		})
  },

  // 订阅签到
  subscribeSign() {
    const tmplIds = ["h_P9sODh-NfeXteA5t7h6sS9BAIjtEyppGwt-biQIQ0"]
		wx.requestSubscribeMessage({
			tmplIds: tmplIds,
			success: (res) => {
        if (res[tmplIds[0]] === 'accept') {
          wx.showToast({ title: '订阅成功', })
        }
      },
			fail(error) {
				console.log(error)
			}
		})
  },

	// 看视频
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

	// 选择视频奖励
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

	// 增加次数
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

	// 增加vip次数
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
		if (wx.getUserProfile) {
			this.setData({
				canIUseGetUserProfile: true
			})
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

	// 从数据库获取用户信息，并更新用户信息
	getUserInfo () {
		const that = this
		const openid = app.globalData.openid
		if (!openid) return
		const db = wx.cloud.database()
		db.collection('user').where({ openid }).get().then(res => {
			this.setData({
				userInfo: res.data[0],
				signed: res.data[0].signInDate.trim() === new Date().toDateString().trim()
			})

			// 如果是新接口，就算授权也不能直接获取用户信息，结束执行并设置已有信息
			if (this.data.canIUseGetUserProfile) {
				return this.setUserInfo(res.data[0])
			}
			
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

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.timerFunc()
	},

	// 定时器，解决第一次进入页面没有openid 的问题
	timerFunc () {
		const openid = app.globalData.openid
		if (openid) {
			this.getUserInfo()
		} else {
			setTimeout(() => this.timerFunc(), 3000)
		}
  },
  
  // 作者二维码
  previewQRcode() {
    wx.previewImage({
      urls: ['/images/WechatIMG199.jpeg'],
      current: '/images/WechatIMG199.jpeg'
    })
  },

	
  onShareTimeline: function () {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、证件照换背景，免费生成、下载。',
			imageUrl: '/shareShow.jpg'
		}
	},
})