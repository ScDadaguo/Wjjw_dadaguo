const app = getApp();
Page({
  data: {
    id:'',
    wjjw:[],
    imgList: [],


    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    
    gridCol: 3,
    skin: false
  },

  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          });
          console.log(this.data.imgList);
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '老板！',
      content: '确定要删除这个实体账单照片吗',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  gridchange: function (e) {
    this.setData({
      gridCol: e.detail.value
    });
  },
  gridswitch: function (e) {
    this.setData({
      gridBorder: e.detail.value
    });
  },
  menuBorder: function (e) {
    this.setData({
      menuBorder: e.detail.value
    });
  },
  menuArrow: function (e) {
    this.setData({
      menuArrow: e.detail.value
    });
  },
  menuCard: function (e) {
    this.setData({
      menuCard: e.detail.value
    });
  },
  switchSex: function (e) {
    this.setData({
      skin: e.detail.value
    });
  },

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },


  onLoad:function(options){
    var that =this;
    console.log("进入wjjwDetail"+options.id);
    this.setData({
      id:options.id
    });
  },


  onShow: function() {
    var that = this;
    wx.request({
      url: 'http://127.0.0.1:8081/querywjjwById?id=' + this.data.id,
      method: 'get',
      data: {},
      success: function (res) {
        var wjjw = res.data.wjjw;
        console.log(wjjw);
        if (wjjw == null) {
          var toastText = '获取数据失败' + res.data.errmsg;
          wx.showToast({
            title: toastText,
            icon: '',
            duration: 2000,
          });
        } else {
          console.log(wjjw.localPath);
          if(wjjw.localPath!=null){
            console.log(wjjw.localPath);
            var imgUrl="http://127.0.0.1:8081"+wjjw.localPath;
            that.setData({
              imgList: [imgUrl]
            })  
          }
          that.setData({
            wjjw: wjjw
          });
        }
      }
    })
  },

  deleteWjjw: function (e) {
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: 'http://127.0.0.1:8081/deleteWjjw',
            data: {
              "id": that.data.id
            },
            method: "GET",
            success: function (res) {
              var result = res.data.success;
              var toastText = "删除成功！";
              if (result != true) {
                toastText = "删除失败";
              } else {
                wx.navigateTo({
                  url: '../list/list',
                })
              }
              wx.showToast({
                title: toastText,
                icon: '',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },

  showDeatil: function (e) {
    var id = e.target.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '../wjjwDetail/wjjwDetail?id=' + id
    })
  },

  updateWjjw: function (e) {
    var that=this;
    var id = that.data.id;
    console.log(id)
    wx.redirectTo({
      url: '../form/form?id=' + id
    })
  },

})