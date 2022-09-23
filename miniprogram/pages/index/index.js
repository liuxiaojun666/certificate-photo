const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 近期热门列表
		photoSizeList: app.globalData.photoSizeList
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		wx.setNavigationBarTitle({ title: '免冠照/证件照' })

    // 处理来自用户邀请
		this.shareSuccess(options.shareOpenid)
	},

	// 去选择照片页面
	goNextPage (e) {
		wx.navigateTo({
			url: '/pages/preEdit/preEdit?index=' + e.currentTarget.dataset.index,
		})
	},

  // 页面跳转
	navigateTo(e) {
		wx.navigateTo({ url: e.currentTarget.dataset.url, })
	},
	/**
	 * 用户来自邀请
	 */
	shareSuccess (shareOpenid) {
    // 没有分享自id，不是来自邀请
    if (!shareOpenid) return
    // 更新邀请者的邀请记录
		wx.cloud.callFunction({
			name: 'shareUpdate',
			data: {
				shareOpenid,
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
			imageUrl: '/images/shareShow.jpg'
		}
	},
	
})