// pages/list/list.js
import util from '../../utils/util.js'
const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 页面的初始数据
   */
  data: {
    
    list: [],
    workDate:'',

    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
  
    gridCol: 3,
    skin: false
  },


  lifetimes: {
    created() {
      console.log("在组件实例刚刚被创建时执行")
      var that = this;
      wx.request({
        url: 'http://127.0.0.1:8081/listWjjw?openId='+app.globalData.openId,
        method: 'get',
        data: {},
        success: function (res) {
          var list = res.data.wjjwList;
          if (list == null) {
            var toastText = '获取数据失败' + res.data.errmsg;
            wx.showToast({
              title: toastText,
              icon: '',
              duration: 2000,
            });
          } else {
            console.log("guohao"+list[0].workDate)
            var str = list[0].workDate;
            that.setData({
              list: list,
            });
          }
        }
      })
    },
  },

  

  methods: {
    showDeatil: function (e) {
      var id = e.currentTarget.dataset.id;
      console.log(id)
      wx.navigateTo({
        url: '../wjjwDetail/wjjwDetail?id=' + id
      })
    },

    addWjjw: function () {
      wx.navigateTo({
        url: '../operation/operation',
      })
    },
    
    deleteWjjw: function (e) {
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success: function (sm) {
          if (sm.confirm) {
            wx.request({
              url: 'http://127.0.0.1:8081/deleteWjjw',
              data: {
                "id": e.target.dataset.id
              },
              method: "GET",
              success: function (res) {
                var result = res.data.success;
                var toastText = "删除成功！";
                if (result != true) {
                  toastText = "删除失败";
                } else {
                  that.data.list.splice(e.target.dataset.index, 1)
                  that.setData({
                    list: that.data.list
                  });
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
    }
  },


  
})