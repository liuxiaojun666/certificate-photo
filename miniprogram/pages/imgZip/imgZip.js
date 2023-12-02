// pages/imgZip/imgZip.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgType: '',
    realW: 0,
    realH: 0,
    size: 0,
    imageSrc: '',
    imgW: '',
    imgH: '',
    quality: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  imgWidth: function (e) {
    const {
      imageSrc
    } = this.data
    let msg = ''
    if (imageSrc === '') {
      msg = '请上传图片'
      wx.showToast({
        title: msg,
        icon: 'none'
      })
      this.setData({
        imgW: '',
      })
    } else {
      const zsw = this.data.realW;
      const zsh = this.data.realH;
      const w = e.detail.value;
      const h = parseFloat((w * zsh / zsw * 100) / 100).toFixed(2);
      console.log(h, '--', zsw, '-', zsh);
      this.setData({
        imgW: w,
        imgH: w > 0 ? h : '',
      })
    }

  },
  imgHeight: function (e) {
    const {
      imageSrc
    } = this.data
    let msg = ''
    if (imageSrc === '') {
      msg = '请上传图片'
      wx.showToast({
        title: msg,
        icon: 'none'
      })
      this.setData({
        imgH: '',
      })
    } else {
      const zsw = this.data.realW;
      const zsh = this.data.realH;
      const h = e.detail.value;
      const w = parseFloat((h * zsw / zsh * 100) / 100).toFixed(2);
      console.log(h);
      this.setData({
        imgW: h > 0 ? w : '',
        imgH: h,
      })
    }

  },
  imgQuality: function (e) {
    const {
      imageSrc
    } = this.data
    let msg = ''
    if (imageSrc === '') {
      msg = '请上传图片'
      wx.showToast({
        title: msg,
        icon: 'none'
      })
      this.setData({
        quality: '',
      })
    } else {
      const q = e.detail.value;
      this.setData({
        quality: q == 0 ? '' : q
      })
    }

  },
  zipClick() {
    const {
      imgW,
      imgH,
      quality,
      imageSrc
    } = this.data
    let msg = ''
    if (imageSrc === '') {
      msg = '请上传图片'
      wx.showToast({
        title: msg,
        icon: 'none'
      })
      return
    }
    console.log('请上传图片', imageSrc)
    if (this.data.imgW == 0 || this.data.imgH == 0 || !this.data.imgH || !this.data.imgW) {
      msg = '宽度或高度不能为0'
      wx.showToast({
        title: msg,
        icon: 'none'
      })
      return
    }
    console.log('压缩质量', quality)
    if (this.data.quality > 100 || this.data.quality < 50) {
      msg = '压缩质量范围是50-100'
      wx.showToast({
        title: msg,
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '图片压缩中',
    })
    wx.cloud.callFunction({
        name: 'imagemin',
        data: {
          width: this.data.imgW,
          height: this.data.imgH,
          type: this.data.type,
          quality: this.data.quality,
          // 上传图片到临时CDN，返回图片地址
          filePath: wx.cloud.CDN({
            type: 'filePath',
            filePath: this.data.imageSrc,
          })
        },
      }).then((res) => {
        console.log('返回值', res)
        wx.hideLoading()
        if (!res.result.errMsg) {
          wx.navigateTo({
            url: '/pages/zipSuccess/zipSuccess?imgurl=' + res.result,
          })
        } else {
          wx.showToast({
            title: res.result.errMsg,
            icon: 'none',
            duration: 3000
          })
        }
      }) // 错误处理
      .catch(console.error)


  },
  choosePic() {
    console.log('选图片')
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({
          imageSrc: tempFilePath
        })
        console.log(this.data.imageSrc)
        const fs = wx.getFileSystemManager()
        fs.getFileInfo({
          filePath: tempFilePath,
          success: (res) => {
            this.setData({
              size: (res.size / 1024).toFixed(2)
            })
          }
        })
        // 获取图片信息
        wx.getImageInfo({
            src: tempFilePath,
          })
          // 图片安全校验
          .then(res => {
            this.setData({
              imgType: res.type,
              realW: res.width,
              realH: res.height,
              imgW: res.width,
              imgH: res.height
            })
            console.log(res, this.data.realW, '----', this.data.realH)
          })
      },
      fail() {
        wx.showToast({
          title: '取消选择',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})