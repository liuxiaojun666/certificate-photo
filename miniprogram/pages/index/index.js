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
    // 来自邀请，签到时使用
    if (options.shareOpenid) {
      wx.setStorage({
        key: "fromShare",
        data: options.shareOpenid
      })
    }
  },
  
  //跳转分类页面
  goClassPage(e) {
    wx.navigateTo({
        url: '/pages/searchSize/searchSize?index=' + e.currentTarget.dataset.index,
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、证件照换背景，免费生成、下载。',
			path: '/pages/index/index',
			imageUrl: '/shareShow.jpg'
		}
	},
  onShareTimeline: function () {
		return {
			title: '证件照、免冠照、一寸照片、二寸照片、证件照换背景，免费生成、下载。',
			imageUrl: '/shareShow.jpg'
		}
	},
	
})