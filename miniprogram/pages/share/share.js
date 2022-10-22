// miniprogram/pages/share/share.js

// 在页面中定义插屏广告
let interstitialAd = null
let shared = false
const db = wx.cloud.database()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		allShareData: {},
		invitedList: [],
		updateCountLoading: false,
		successUserList: [],
    showSubscribeBtn: false,
    subscribed: false
	},

  // 邀请成功，领取次数
	shareSuccessUpdateCount (event) {
		if (this.data.updateCountLoading) return
		const openid = event.currentTarget.dataset.openid
		this.setData({ updateCountLoading: true })
		wx.cloud.callFunction({
			name: 'shareSuccessCallback',
			data: {openid}
		}).then(res => {
			this.setData({ updateCountLoading: false })
			this.getData()
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '分享免冠照' })
    
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

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.getData()
    this.getSubscribeStatus()
    
    // 在适合的场景显示插屏广告
		if (interstitialAd) {
			interstitialAd.show().catch((err) => {
				console.error(err)
			})
		}
	},

	// 订阅邀请成功通知
	subscribeMessage () {
    const tmplIds = ["CNuffKDjmxEOU_hM44Cu0KoGqOjfdacpbk4LT1abcnE"]
		wx.requestSubscribeMessage({
			tmplIds: tmplIds,
			success: (res) => {
        if (res[tmplIds[0]] === 'accept') {
          wx.showToast({ title: '订阅成功', })
          this.setData({ subscribed: true })
        }
      },
			fail(error) {
				console.log(error)
			}
		})
  },

  // 获取订阅状态
  getSubscribeStatus () {
    db.collection('subscrib-message').where({
      _openid: getApp().globalData.openid,
      tmplId: "CNuffKDjmxEOU_hM44Cu0KoGqOjfdacpbk4LT1abcnE"
    }).count({
      success: (res)=> {
        this.setData({ subscribed: res.total > 0 })
      },
      fail: console.error
    })
  },

  // 是不是已经邀请过朋友，如果就展示邀请结果
	getData () {
		wx.showLoading({ title: '加载中', })
		const db = wx.cloud.database()
		db.collection('share').where({
      _openid: getApp().globalData.openid
    }).get().then(res => {
      wx.hideLoading({ complete: (res) => {}, })
      console.log(res)
			if (!res.data[0]) {
				shared = false
			} else {
        shared = true
				this.setData({
					allShareData: res.data[0],
					invitedList: res.data[0].invitedList
				})
				this.getAvatar(res.data[0].invitedList || [])
			}
		}).catch(err => {
			wx.showToast({
				title: 'err',
				icon: 'none'
			})
		})
	},

  // 获取被邀请者的头像
	getAvatar (openidList = []) {
		if (!openidList.length) return
		const db = wx.cloud.database()
		const _ = db.command
		db.collection('user').where({
			openid: _.or(openidList.map(v => _.eq(v))),
			avatarUrl: _.exists(true)
		})
		.field({
			avatarUrl: true,
			nickName: true
		})
		.get().then(res => {
			this.setData({
				successUserList: res.data
			})
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {
		if (res.from === 'button') {
			const openid = getApp().globalData.openid
			if (!shared) this.share(openid)
			return {
				title: '证件照、免冠照、一寸照片、二寸照片、证件照换背景，免费生成、下载。',
				path: '/pages/index/index?shareOpenid=' + openid,
				imageUrl: '/shareShow.jpg'
			}
		}
	},

  // 创建邀请记录
	share (openid) {
		const db = wx.cloud.database()
		db.collection('share').add({
			data: {
				invitedList: [],
				openid,
        createAt: Date.now(),
			},
			success: () => {
				shared = true
			}
		})
	}
})