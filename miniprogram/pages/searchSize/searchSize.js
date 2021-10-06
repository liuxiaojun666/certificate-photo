// 在页面中定义插屏广告
let interstitialAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
		hideLoadView:true,
		showMenu:false,
		category:"1",
		page:0,
		putText:"",
		currentTab:0,
		// photoSizeList: getApp().globalData.photoSizeList,
		photoSizeList:[],
		allRecords:[]
	},
	//滑动切换
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
 //点击切换 
 clickTab: function(e) {
	this.setData({
		photoSizeList:[],
		putText:"",
		showMenu:false,
	});
	var that = this;
	console.log(this.data.currentTab,e.target.dataset.current)
	if (this.data.currentTab === e.target.dataset.current) {
		return false;
	} else {

		if (e.target.dataset.current==0) {
			that.setData({
				category:"1",
				page:0,
				currentTab: e.target.dataset.current,
				photoSizeList:[]
			})
			
		}else if (e.target.dataset.current==1) {
			that.setData({
				category:"2",
				page:0,
				currentTab: e.target.dataset.current,
				photoSizeList:[]
			})
		}else if (e.target.dataset.current==2) {

			that.setData({
				category:"3",
				page:0,
				currentTab: e.target.dataset.current,
				photoSizeList:[]
			})
		}else if (e.target.dataset.current==3) {

			that.setData({
				category:"4",
				page:0,
				currentTab: e.target.dataset.current,
				photoSizeList:[]
			})
		}else if (e.target.dataset.current==4) {

			that.setData({
				category:null,
				page:0,
				currentTab: e.target.dataset.current,
				photoSizeList:[]
			})
		}
		this.requestdata()
	}
},

	//输入框值
	bindModel(e) {
    let key = e.target.dataset.model;
    this.setData({
      putText: e.detail.value
		});
		if (this.data.putText.length==0) {
			console.log("没数据")
			this.setData({
				photoSizeList:[],
				putText:"",
				showMenu:false,
			});
			this.requestdata()
		}
  },
	searchClick:function () {
		console.log(this.data.putText)
		wx.showToast({
			title:'查询----'+this.data.putText,
			icon: 'none'
		})
		this.setData({
			showMenu:true,
			photoSizeList:[],
			page:0
		});
		if (this.data.putText.length>0) {
			this.searchData(this.data.putText)
		}else{
			this.setData({
				photoSizeList:[],
				putText:"",
				showMenu:false,
			});
			this.requestdata()
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
		this.requestdata();
		wx.setNavigationBarTitle({ title: '免冠照/证件照尺寸' })
	},
	//搜索数据
	searchData(e){
		wx.showNavigationBarLoading()
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
			 wx.hideNavigationBarLoading()
			 this.setData({
				photoSizeList:this.data.photoSizeList.concat(res.data)
			});
      }
    })
	},
	inputPush(){
		console.log("*************点击输入框搜索")
		wx.navigateTo({
			url: './searchView/searchView'
		})
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
		if (this.data.showMenu==false) {
			this.requestdata();
		} else {
			this.searchData(this.data.putText);
		}
		
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
	onReachBottom:function(){
		console.log("滑动到底部")
		this.moreclick();
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