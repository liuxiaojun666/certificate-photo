// miniprogram/pages/share/share.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		shared: false,
		allShareData: {},
		invitedList: [],
		updateCountLoading: false,
		successUserList: [],
		showSubscribeBtn: false
	},

	shareSuccessUpdateCount (event) {
		if (this.data.updateCountLoading) return
		const openid = event.currentTarget.dataset.openid
		this.setData({ updateCountLoading: true })
		wx.cloud.callFunction({
			name: 'shareSuccessCallback',
			data: {openid, date: new Date().toDateString()}
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
		this.getData()
		
	},

	// 订阅邀请成功通知
	subscribeMessage () {
		wx.requestSubscribeMessage({
			tmplIds: ['CNuffKDjmxEOU_hM44Cu0KoGqOjfdacpbk4LT1abcnE'],
			success (res) { },
			fail(error) {
				console.log(error)
			}
		})
	},

	getData () {
		wx.showLoading({
			title: '加载中',
		})
		const openid = getApp().globalData.openid
		const db = wx.cloud.database()
		db.collection('share').where({ openid, date: new Date().toDateString() }).get().then(res => {
			wx.hideLoading({ complete: (res) => {}, })
			if (!res.data[0]) {
				this.setData({ shared: false })
			} else {
				this.setData({
					allShareData: res.data[0],
					invitedList: res.data[0].invitedList, 
					shared: true
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
	onShareAppMessage: function (res) {
		if (res.from === 'button') {
			const openid = getApp().globalData.openid
			if (!this.data.shared) {
				this.share(openid)
			}
			return {
				title: '证件照、免冠照、一寸照片、二寸照片、证件照换背景，免费生成、下载。',
				path: '/pages/index/index?shareOpenid=' + openid + '&date=' + new Date().toDateString(),
				imageUrl: '/images/shareShow.jpg'
			}
		}
	},

	share (openid) {

		const db = wx.cloud.database()
		db.collection('share').add({
			data: {
				invitedList: [],
				openid,
				date: new Date().toDateString()
			},
			success: () => {
				this.setData({ shared: true })
			}
		})
	}
})