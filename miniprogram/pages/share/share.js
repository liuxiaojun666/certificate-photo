// miniprogram/pages/share/share.js


const db = wx.cloud.database()

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
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.getData()
		this.getSubscribeStatus()
	},

	// 订阅邀请成功通知
	subscribeMessage () {
		const openid = getApp().globalData.openid
    const tmplIds = ["CNuffKDjmxEOU_hM44Cu0KoGqOjfdacpbk4LT1abcnE"]
		wx.requestSubscribeMessage({
			tmplIds: tmplIds,
			success: (res) => {
        if (res[tmplIds[0]] === 'accept') {
          db.collection('subscrib-message').add({
            data: {
              openid,
              tmplId: tmplIds[0],
              time: Date.now()
            },
            success: (res) => {
              wx.showToast({ title: '订阅成功', })
              this.setData({ subscribed: true })
            }
          })
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
      _openid: openid,
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
			if (!this.data.shared) {
				this.share(openid)
			}
			return {
				title: '证件照、免冠照、一寸照片、二寸照片、证件照换背景，免费生成、下载。',
				path: '/pages/index/index?shareOpenid=' + openid,
				imageUrl: '/images/shareShow.jpg'
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
				this.setData({ shared: true })
			}
		})
	}
})