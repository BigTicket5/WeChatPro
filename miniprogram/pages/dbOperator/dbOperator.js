const app = getApp()

Page({

  data: {
    counterId: 0,
    openid: '',
    count: null,
    queryResult:[],
    choosenIndex:[],
    backcolor:[],
    choosenBox:[],
    isSubmitted:{
      submitBtn:'display:inherit',
      radioDisable:false,
      showAns:'display:none'
    },
    ansOption:[]
  },

  onLoad: function (options) {
    this.onQuery();
  },
  onQuery: function() {
    const db = wx.cloud.database()
    // 查询所有模拟题
    db.collection('salesforcedevexamlib').get({
      success: res => {
        this.setData({
          queryResult: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res.data);
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  checkboxChange:function(e){
    console.log('checkBox发生change事件，携带value值为：', e.detail.value);
    var tmp = [];
    tmp=e.detail.value;
    this.setData({
      choosenIndex : tmp
    });
    console.log(this.data.choosenIndex);
  },
  commitAnswer: function(){
    console.log(this.data.choosenIndex);
    var idx = this.data.counterId;
    var answerArray = [];
    answerArray = this.data.queryResult[idx].question_answer;
    var cIdx = [];
    cIdx=this.data.choosenIndex;
    var ansO =[]
    for(var i=0;i<answerArray.length;i++){
      console.log(app.data.optionNames[answerArray[i]]);
      ansO.push(app.data.optionNames[answerArray[i]-1]);
    }
    this.setData({
      ansOption: ansO 
    });
    console.log(this.data.ansOption);
    for(var i=0;i<cIdx.length;i++){
      var choosenIDX = parseInt(cIdx[i]) + 1;
      var bc = "backcolor["+cIdx[i]+"]";
      console.log(bc);
      if(answerArray.indexOf(choosenIDX)>=0){
        this.setData({
          [bc]:'green'
        })
      }
      else{
        this.setData({
          [bc]:'red'
        })
      }
    }
    this.setData({
      isSubmitted:{
        submitBtn:'display:none',
        radioDisable:true,
        showAns :'display:inherit'
      }
    })
  },
 
  nextQuestion:function(){
    console.log(this.data.counterId);
    this.setData({
      choosenBox:[],
      counterId:this.data.counterId+1,
      backcolor:[],
      choosenIndex:[],
      isSubmitted:{
        radioDisable:false,
        submitBtn:'display:inherit',
        showAns :'display:none'
      }
    });
  },
  
  preQuestion:function(){
    if(this.data.counterId>0){
      this.setData({
        choosenBox:[],
        counterId:this.data.counterId-1,
        backcolor:[],
        choosenIndex:[],
        isSubmitted:{
          radioDisable:false,
          submitBtn:'display:inherit',
          showAns :'display:none'
        }
      });
    }
  },

  nextStep: function () {
    // 在第一步，需检查是否有 openid，如无需获取
    if (this.data.step === 1 && !this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({
            step: 2,
            openid: res.result.openid
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    } else {
      const callback = this.data.step !== 6 ? function() {} : function() {
        console.group('数据库文档')
        console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html')
        console.groupEnd()
      }

      this.setData({
        step: this.data.step + 1
      }, callback)
    }
  },

  prevStep: function () {
    this.setData({
      step: this.data.step - 1
    })
  },
  goHome: function() {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      wx.navigateBack()
    } else if (pages.length === 1) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  }

})