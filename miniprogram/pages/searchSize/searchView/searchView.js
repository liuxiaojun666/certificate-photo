// 在页面中定义插屏广告
let interstitialAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
		hideLoadView:true,
		showMenu:false,
		page:0,
		putText:"",
		photoSizeList:[],
		allRecords:[]
	},
	//输入框值
	bindModel(e) {
    this.setData({
      putText: e.detail.value
		});
		if (this.data.putText.length==0) {
			this.setData({
				photoSizeList:[],
				putText:"",
				showMenu:false,
			})
		}
  },
	searchClick:function () {
		this.setData({
			showMenu:true,
			photoSizeList:[],
			page:0
		});
		if (this.data.putText.length>0) {
			this.searchData(this.data.putText)
		}

	},
	goNextPage (e) {
		wx.navigateTo({
			url: '/pages/preEdit/preEdit?index=' + e.currentTarget.dataset.index + '&data='+JSON.stringify(this.data.photoSizeList[e.currentTarget.dataset.index])
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		// 在页面onLoad回调事件中创建插屏广告实例
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-5e6ca9fec276ce4d'
			})
			interstitialAd.onLoad(() => {})
			interstitialAd.onError((err) => {console.log(err)})
			interstitialAd.onClose(() => {})
		}
		wx.setNavigationBarTitle({ title: '搜索' })
	},
	confirm() {
		console.log("键盘搜索")
		this.setData({
			photoSizeList:[],
			page:0
		});
		if (this.data.putText.length>0) {
			this.searchData(this.data.putText)
		}
	
	},
	//搜索数据
	searchData(e){
		wx.showLoading({
			title: '搜索中...',
		})
		const db = wx.cloud.database()
		const MAX_LIMIT = 20
		const num = this.data.page*MAX_LIMIT
		db.collection('photo_size').where({
      name:{
        $regex:'.*'+ this.data.putText,
        $options: 'i'
      }
		})
		.skip(num)
		.limit(MAX_LIMIT)
		.get({
      success: res => {
				wx.hideLoading()
				let arrNum = res.data.length
			 this.setData({
				photoSizeList:this.data.photoSizeList.concat(res.data),
				hideLoadView:(arrNum==20)?false:true
			});
      }
    })
	},
	//加载更多
	moreclick(){
		if (this.data.hideLoadView==true) {
			return 
		}
		this.setData({
			page:this.data.page+=1
		})
		console.log("加载更多数据"+this.data.page+'页')
		this.searchData(this.data.putText);
		
	},
	onReachBottom:function(){
		console.log("滑动到底部")
		this.moreclick();
	},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
		// 在适合的场景显示插屏广告
		if (interstitialAd) {
			// interstitialAd.show().catch((err) => {
			// 	console.error(err)
			// })
		}
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
			// path: '/pages/index/index',
			imageUrl: '/images/shareShow.jpg'
		}
	},
	
})