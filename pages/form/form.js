import WxValidate from '../../utils/WxValidate.js'
import util from '../../utils/util.js'
const app = getApp();
Page({
  data: {
    PageCur: 'component',
    id: '',
    wjjw: [],
    addUrlWithImage: "http://127.0.0.1:8081/insertWjjw",
    addUrlWithoutImage:"http://127.0.0.1:8081/saveWjjw",
    modfiyUrlWithImage: "http://127.0.0.1:8081/updateWjjw",
modfiyUrlWithoutImage:"http://127.0.0.1:8081/updateWithoutImageWjjw",




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
    textareaBValue: ''
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
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



  onLoad: function(options) {
    //初始化表单验证
    this.initValidate()
    var that = this;
    

    console.log(options.id);
    this.setData({
      id: options.id
    });
  
    if (that.data.id != undefined) {
      wx.request({
        url: 'http://127.0.0.1:8081/querywjjwById?id=' + this.data.id,
        method: 'get',
        data: {},
        success: function (res) {
          var wjjw = res.data.wjjw;
          if (wjjw == null) {
            // var toastText = '获取数据失败' + res.data.errmsg;
            // wx.showToast({
            //   title: toastText,
            //   icon: '',
            //   duration: 2000,
            // });
          } else {
            var indexNumber = "";
            if (wjjw.machineName == "120") {
              indexNumber = "0";
            } else if (wjjw.machineName == "120") {
              indexNumber = "小微挖";
            } else if (wjjw.machineName == "120") {
              indexNumber = "小55";
            }
            if (wjjw.localPath !=null) {
              console.log(wjjw.localPath);
              var imgUrl="http://127.0.0.1:8081"+wjjw.localPath;
              that.setData({
                imgList: [imgUrl]
              })
            }
            that.setData({
              date: wjjw.workDate,
              startTime: wjjw.startTime,
              endTime: wjjw.endTime,
              index: indexNumber,
              wjjw: wjjw
            });
          }
        }
      })
    };
  },

  formSubmit: function(e) {
    console.log("guohao")
    var that = this;
    var formData = e.detail.value;
    var url ="";
    //如果是新增账单
    // if (that.data.id != undefined) {
    //   formData.id = that.data.id;
    //   url = that.data.modfiyUrl;
    // }
    // //如果是编辑账单
    // else{
    //   url = that.data.modfiyUrlWithImage;
    // }
    formData.workDate ="2018-12-25";
    formData.startTime="08:00";
    formData.endTime="16:00";
    console.log(formData);
    console.log(url);
    console.log(that.data.imgList.length);
    //如果没有图片
    if(that.data.imgList.length==0){
      //如果是编辑账单
      if (that.data.id != undefined) {
        formData.id = that.data.id;
        url = that.data.modfiyUrlWithoutImage;
      }
      //如果是新增账单
      else{
        url=that.data.modfiyUrlWithoutImage;
      }
      wx.request({
        url: "http://127.0.0.1:8081/saveWjjw",
      data:JSON.stringify(formData),
      method:"POST",
      header:{
        'Content-Type':'application/json'
      },
      success:function(res){
        var resut=res.data.success;
        var toastText="操作成功！"
        if(resut!=true){
          toastText="操作失败！"+res.data.errMsg;
        }
        wx.showToast({
          title: toastText,
          icon:'',
          duration:2000
        });
        if(that.data.id==undefined){
          wx.redirectTo({
            url: '../list/list',
          })
        }else{
          wx.redirectTo({
            url: '../wjjwDetail/wjjwDetail?id='+that.data.id,
          })
        }
      }
    })
    }
    //如果有图片
    else{
      //如果是编辑账单
      if (that.data.id != undefined) {
        formData.id = that.data.id;
        url = that.data.modfiyUrlWithImage;
      }
      //如果是新增账单
      else {
        url = that.data.modfiyUrlWithImage;
      }
      wx.uploadFile({
      url: url,
      filePath: that.data.imgList[0], //chooseImage上传的图片
      name: 'file', //需要传给后台的图片字段名称
      formData: formData, //需要传给后台的其他表单数据
      header: {
        "Content-Type": "multipart/form-data", //form-data格式
        'Accept': 'application/json',
      },
      success: function(res) {
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
        if (that.data.id == undefined) {
          wx.redirectTo({
            url: '../list/list',
          })
        } else {
          wx.redirectTo({
            url: '../wjjwDetail/wjjwDetail?id=' + that.data.id,
          })
        }
      }
    })

    }
  }


})