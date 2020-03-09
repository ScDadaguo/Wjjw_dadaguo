
import WxValidate from '../../utils/WxValidate.js'
import util from '../../utils/util.js'
const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    PageCur: 'component',
    id: '',
    wjjw: [],
    addUrlWithImage: "http://127.0.0.1:8081/insertWjjw",
    addUrlWithoutImage: "http://127.0.0.1:8081/saveWjjw",
    modfiyUrlWithImage: "http://127.0.0.1:8081/updateWjjw",
    modfiyUrlWithoutImage: "http://127.0.0.1:8081/updateWithoutImageWjjw",

    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,

    index: null,
    picker: ['120', '小微挖', '小55'],

    startTime: '08:00',
    endTime: '16:00',
    date: '',
    imgList: [],
    date_flag: false,
    startTime_flag: false,
    endTime_flag: false,


    textareaAValue: '',
    textareaBValue: '',
    form: {
      workPlace: '',
      workHours: '',
      unitPrice: '',
      flatcarCount: '',
      flatcarFee: '',
      totalSum: '',
    }
  },

  lifetimes: {
    created() {
      console.log("在组件实例刚刚被创建时执行")
      this.initValidate()
    },

    attached: function () {
      var that = this;
      var timestamp = Date.parse(new Date());
      var date2 = new Date(timestamp);
      var year = date2.getFullYear()
      var day = date2.getDate()
      var month = date2.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }

      var data3 = year + "-" + month + '-' + day
      console.log(data3)
      that.setData({
        date: data3
      })
    }, // 组件挂载之前执行
  },


  methods: {
    PickerChange(e) {
      console.log(e);
      this.setData({
        index: e.detail.value
      })
    },


    initValidate() {
      const rules = {
        workPlace: {
          required: true,
          minlength: 2
        },
        workHours: {
          required: true,
          max: 24
        },
        unitPrice: {
          required: true,
          digits: true
        },
        flatcarCount: {
          required: false,
          digits: true
        },
        flatcarFee: {
          required: false,
          digits: true
        },
        totalSum: {
          required: true,
          digits: true
        },
      }
      const messages = {
        workPlace: {
          required: '请填写工作地点',
          minlength: '请输入正确的工作地点'
        },
        workHours: {
          required: '请填写工作时长',
          minlength: '请输入正确的工作时长'
        },
        unitPrice: {
          required: '请填写单价',
          minlength: '请输入正确的单价'
        },
        flatcarCount: {
          required: '请填写板车趟数',
          minlength: '请输入正确的板车趟数'
        },
        flatcarFee: {
          required: '请填写板车费',
          minlength: '请输入正确的板车费'
        },
        totalSum: {
          required: '请填写合计金额',
          minlength: '请输入正确的合计金额'
        },
      }
      this.WxValidate = new WxValidate(rules, messages)

    },


    StartTimeChange(e) {
      this.setData({
        startTime: e.detail.value,
        startTime_flag: true
      })
    },
    EndTimeChange(e) {
      this.setData({
        endTime: e.detail.value,
        endTime_flag: true
      })
    },

    DateChange(e) {
      this.setData({
        date: e.detail.value,
        date_flag: true
      })
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

    textareaBInput(e) {
      this.setData({
        textareaBValue: e.detail.value
      })
    },


    showModal(error) {
      wx.showModal({
        content: error.msg,
        showCancel: false,
      })
    },

    formSubmit: function (e) {
      console.log('form发生了submit事件，携带的数据为：', e.detail.value)
      const params = e.detail.value
      //校验表单
      if (!this.WxValidate.checkForm(params)) {
        const error = this.WxValidate.errorList[0]
        this.showModal(error)
        return false
      }

      if (this.data.index == null) {
        wx.showModal({
          title: '填写账单错误',
          content: '请填写"机型"',
        })
        return false
      }



      var that = this;
      var formData = e.detail.value;
      var url = "";

      console.log(formData);
      console.log(url);
      console.log(that.data.imgList.length);
      //如果没有图片
      if (that.data.imgList.length == 0) {
        wx.request({
          url: "http://127.0.0.1:8081/saveWjjw",
          data: JSON.stringify(formData),
          method: "POST",
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            var resut = res.data.success;
            var toastText = "操作成功！"
            if (resut != true) {
              toastText = "操作失败！" + res.data.errMsg;
            }
            wx.showToast({
              title: toastText,
              icon: '',
              duration: 2000
            });

            wx.redirectTo({
              url: '../index/index',
            })
            
          }
        })
      }
      //如果有图片
      else {
        url = that.data.addUrlWithImage;
        wx.uploadFile({
          url: url,
          filePath: that.data.imgList[0], //chooseImage上传的图片
          name: 'file', //需要传给后台的图片字段名称
          formData: formData, //需要传给后台的其他表单数据
          header: {
            "Content-Type": "multipart/form-data", //form-data格式
            'Accept': 'application/json',
          },
          success: function (res) {
            var resut = res.data.success;
            var toastText = "操作成功！"
            if (resut != true) {
              toastText = "操作失败！" + res.data.errMsg;
            }
            wx.showToast({
              title: toastText,
              icon: '',
              duration: 2000
            });

            wx.redirectTo({
              url: '../index/index',
            })


          }
        })

      }
    }
  },

})