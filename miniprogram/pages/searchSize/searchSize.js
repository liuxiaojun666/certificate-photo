const hideLoadView = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
		category:"1",
		page:0,
		currentTab:0,
		photoSizeList:[],
		allRecords:[]
	},
	//滑动切换
  swiperTab: function(e) {
    this.setData({ currentTab: e.detail.current });
  },
 //点击切换 
  clickTab: function(e) {
    if (this.data.currentTab === e.target.dataset.current) return false;
    this.setData({
      category: ['1', '2', '3', '4', null][e.target.dataset.current],
      page:0,
      currentTab: e.target.dataset.current,
      photoSizeList:[]
    })
    this.requestdata()
  },

  // 跳转到下一页
	goNextPage (e) {
		wx.navigateTo({
			url: '/pages/preEdit/preEdit?index=' + e.currentTarget.dataset.index + '&data='+JSON.stringify(this.data.photoSizeList[e.currentTarget.dataset.index])
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.requestdata();
		wx.setNavigationBarTitle({ title: '免冠照/证件照尺寸' })
	},
  // 跳转到搜索页面
	inputPush(){
		wx.navigateTo({ url: './searchView/searchView' })
	},
	//获取数据
	requestdata (){
		wx.showLoading({
			title: '加载中...',
		})
		const db = wx.cloud.database()
		const MAX_LIMIT = 20
		const num = this.data.page*MAX_LIMIT
		db.collection('photo_size').where({category_id:this.data.category})
		.skip(num)
		.limit(MAX_LIMIT)
		.get({
      success: res => {
			 console.log(res)
			 let arrNum = res.data.length
			 console.log(arrNum);
			 wx.hideLoading()
			 this.setData({
          photoSizeList:this.data.photoSizeList.concat(res.data),
        });
        hideLoadView = arrNum !== 20
      }
    })
	},
	//加载更多
	moreclick(){
    // 已经全部加载出来了
		if (hideLoadView==true) return
		this.setData({ page: this.data.page+=1 })
    this.requestdata();
	},

  // 触底加载
	onReachBottom:function(){
		this.moreclick();
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
			// path: '/pages/index/index',
			imageUrl: '/shareShow.jpg'
		}
	},
	
})