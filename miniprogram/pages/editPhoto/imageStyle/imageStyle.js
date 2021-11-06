// miniprogram/pages/editPhoto/imageStyle/imageStyle.js
// 在页面中定义激励视频广告
let videoAd = null
// 在页面中定义插屏广告
let interstitialAd = null
let imgUrl = ''
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		TabCur: 0,
		videoLoaded: false,
		baseId: 'cloud://dev-4iov0.6465-dev-4iov0-1301148496',
		imgList: {
			nan: [
				'/clothes/1/a3v0d-snbhc-003',
				'/clothes/1/a4m3t-jc51s-003',
				'/clothes/1/a5gj3-gvakt-003',
				'/clothes/1/a5w3s-y15ye-003',
				'/clothes/1/a7chm-kz67c-003',
				'/clothes/1/a856x-r8xkk-003',
				'/clothes/1/a889k-umts0-003',
				'/clothes/1/abhwj-ouero-003',
				'/clothes/1/acj7c-q8d0v-003',
				'/clothes/1/adc3x-kdmjc-003',
				'/clothes/1/adyo5-9pxtt-003',
				'/clothes/1/ae70e-zd3kt-003',
				'/clothes/1/ae70e-zd3kt-003',
				'/clothes/1/af2hj-u0xhi-003',
				'/clothes/1/agpri-595tx-003',
				'/clothes/1/akiok-vmz0b-003',
				'/clothes/1/al58a-8mq0w-003',
				'/clothes/1/al98j-xj2j5-003',
				'/clothes/1/ale9k-6gdnj-003',
				'/clothes/1/ana53-ibw10-003',
				'/clothes/1/ao5jd-2oc16-003',
				'/clothes/1/aor5p-eelqf-003',
				'/clothes/1/ap0le-59hu0-003',
				'/clothes/1/api0d-r2h0p-003',
				'/clothes/1/aqc3s-oreey-003',
				'/clothes/1/aqjlm-aavia-003',
				'/clothes/1/ar8m8-mtmqu-003',
				'/clothes/1/as5bi-7n3n3-003',
				'/clothes/1/as5ri-xr4tc-003',
				'/clothes/1/asy6f-qzcmt-003',
				'/clothes/1/aufj1-kcxw7-003',
				'/clothes/1/axgzd-c83nr-003',
				'/clothes/1/ayhmu-sx974-003',
				'/clothes/1/ayi2n-0rq59-003',
				'/clothes/1/ayssz-1swdq-003',
				'/clothes/1/aytsp-xgc80-003',
				'/clothes/1/ayyvm-nb5k2-003',
				'/clothes/1/ayywd-4x9yd-003',
			],
			nv: [
				'/clothes/0/a0na8-ov3rr-003',
				'/clothes/0/a17fe-ixkes-003',
				'/clothes/0/a1j51-pyopb-003',
				'/clothes/0/a1otp-rrhj8-003',
				'/clothes/0/a2jny-wc3ia-003',
				'/clothes/0/a31yq-idryb-003',
				'/clothes/0/a31yq-idryb-003',
				'/clothes/0/a47r0-ajzpj-003',
				'/clothes/0/a4siu-qp22s-003',
				'/clothes/0/a573e-crjbd-003',
				'/clothes/0/a5dho-eloco-003',
				'/clothes/0/a5gbp-fm4pv-003',
				'/clothes/0/a7219-nr3q4-003',
				'/clothes/0/a7c8d-l46v7-003',
				'/clothes/0/a93vz-ngdiw-003',
				'/clothes/0/adk41-bcopv-003',
				'/clothes/0/adwsq-634cq-003',
				'/clothes/0/af9uv-86svj-003',
				'/clothes/0/agc6s-3qcup-003',
				'/clothes/0/agjwm-bbt30-003',
				'/clothes/0/ah1bk-tpek2-003',
				'/clothes/0/aha6b-a605q-003',
				'/clothes/0/ahbfg-jt921-003',
				'/clothes/0/aj92o-u7hb3-003',
				'/clothes/0/aju78-biug1-003',
				'/clothes/0/ak02t-8shwh-003',
				'/clothes/0/akoms-m7ep8-003',
				'/clothes/0/akylj-h7mkc-003',
				'/clothes/0/al7zh-kzrge-006',
				'/clothes/0/alhr4-y4ekx-003',
				'/clothes/0/alq9e-zrceh-003',
				'/clothes/0/alu0f-ofu2v-003',
				'/clothes/0/amfhm-gv48j-003',
				'/clothes/0/anhxq-slwhe-003',
				'/clothes/0/anzsl-z3mf2-003',
				'/clothes/0/ap1p0-3br3s-003',
				'/clothes/0/apd7v-4wekg-004',
				'/clothes/0/apd7v-4wekg-004',
				'/clothes/0/apxn6-batye-003',
				'/clothes/0/aq12g-bci6s-003',
				'/clothes/0/arczw-zbd9y-003',
				'/clothes/0/au8t0-jwxad-003',
				'/clothes/0/aug7x-iigpt-003',
				'/clothes/0/avsex-sfs60-003',
				'/clothes/0/aw5up-mr2u6-003',
				'/clothes/0/aw8ku-kndhn-003',
				'/clothes/0/awdtt-rcg3z-003',
				'/clothes/0/awm0w-eokwg-003',
				'/clothes/0/awn3j-hb7jk-003',
				'/clothes/0/ax97r-lk11a-003',
				'/clothes/0/azlpf-irua0-003',
				'/clothes/0/azxhw-lkr8z-003',
			],
			other: [
				'/clothes/2/a0rrx-a4118-003',
				'/clothes/2/a0rrx-a4118-004',
				'/clothes/2/a0rrx-a4118-005',
				'/clothes/2/a0rrx-a4118-006',
				'/clothes/2/a0rrx-a4118-007',
				'/clothes/2/a0rrx-a4118-008',
				'/clothes/2/a0rrx-a4118-009',
				'/clothes/2/a0rrx-a4118-010',
				'/clothes/2/a0rrx-a4118-011',
				'/clothes/2/a0rrx-a4118-012',
				'/clothes/2/a0rrx-a4118-013',
				'/clothes/2/a0rrx-a4118-014',
				'/clothes/2/a0rrx-a4118-015',
				'/clothes/2/a0rrx-a4118-016',
				'/clothes/2/a0rrx-a4118-017',
				'/clothes/2/a0rrx-a4118-018',
				'/clothes/2/a0rrx-a4118-019',
				'/clothes/2/a0rrx-a4118-020',
				'/clothes/2/a0rrx-a4118-021',
				'/clothes/2/a0rrx-a4118-022',
				'/clothes/2/a0rrx-a4118-023',
				'/clothes/2/a0rrx-a4118-024',
				'/clothes/2/a0rrx-a4118-025',
				'/clothes/2/a0rrx-a4118-026',
				'/clothes/2/a0rrx-a4118-027',
				'/clothes/2/a0rrx-a4118-028',
				'/clothes/2/a0rrx-a4118-029',
				'/clothes/2/acl8s-bu9e0-003',
				'/clothes/2/acl8s-bu9e0-004',
				'/clothes/2/acl8s-bu9e0-005',
				'/clothes/2/acl8s-bu9e0-009',
				'/clothes/2/acl8s-bu9e0-010',
				'/clothes/2/acl8s-bu9e0-012',
				'/clothes/2/acl8s-bu9e0-013',
				'/clothes/2/acl8s-bu9e0-014',
				'/clothes/2/acl8s-bu9e0-016',
				'/clothes/2/agb03-qypah-002',
				'/clothes/2/asxuw-rcd0x-003',
				'/clothes/2/avuae-q6l44-005',
				'/clothes/2/avuae-q6l44-008',
				'/clothes/2/avuae-q6l44-011',
				...new Array(60).fill('').map((v, i) => '/clothes/2/ac3y2-ktquo-0' + ('0' + (i + 3)).slice(-2) + ''),
				...new Array(24).fill('').map((v, i) => '/clothes/2/aja6g-z09ll-0' + ('0' + (i + 3)).slice(-2) + ''),
				...new Array(8).fill('').map((v, i) => '/clothes/2/aqtkh-megbx-0' + ('0' + (i + 3)).slice(-2) + ''),
				...new Array(9).fill('').map((v, i) => '/clothes/2/auauy-ra9xf-0' + ('0' + (i + 3)).slice(-2) + ''),
				...new Array(14).fill('').map((v, i) => '/clothes/2/aupja-d63cg-0' + ('0' + (i + 3)).slice(-2) + ''),
			]
		}
	},

	tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
	},
	
	selectImg (e) {
		const baseSrc = 'https://6465-dev-4iov0-1301148496.tcb.qcloud.la'
		imgUrl = baseSrc + e.currentTarget.dataset.url + '.png'

		// 用户触发广告后，显示激励视频广告
		if (videoAd) {
			videoAd.show().catch(() => {
				// 失败重试
				videoAd.load()
					.then(() => videoAd.show())
					.catch(err => {
						console.log('激励视频 广告显示失败')
					})
			})
		} else {
			back()
		}
		
	},

	back () {
		const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('selectClothes', {imgUrl});
		wx.navigateBack({})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({ title: '免冠照/证件照换装' })

		// 在页面onLoad回调事件中创建激励视频广告实例
		if (wx.createRewardedVideoAd) {
			videoAd = wx.createRewardedVideoAd({
				adUnitId: 'adunit-240d1c7fb731d343'
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
				console.log(res)
				if (res && res.isEnded) {
					if(imgUrl) this.back()
				} else {
					wx.showToast({
						title: '看完才可以使用哦',
						icon: 'none'
					})
				}
			})
		}
				
		// 在页面onLoad回调事件中创建插屏广告实例
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-ef203d1fea23c207'
			})
			interstitialAd.onLoad(() => {})
			interstitialAd.onError((err) => {})
			interstitialAd.onClose(() => {})
		}
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

		// 在适合的场景显示插屏广告
		if (interstitialAd) {
			interstitialAd.show().catch((err) => {
				console.error(err)
			})
		}
	},

})