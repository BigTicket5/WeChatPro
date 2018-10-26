const app = getApp()

Page({

  data: {
    counterId: '',
    openid: '',
    count: null,
    queryResult:{
      question_text : '',
      question_options : [],
      question_answer: -1
    },
    choosenIndex: -1,
    backcolor:[],
    isSubmitted:{
      submitBtn:'display:inherit',
      radioDisable:false,
      showAns:'display:none'
    },
    ansOption:''
  },

  onLoad: function (options) {
    this.onQuery();
  },
  onQuery: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('salesforcedevexamlib').get({
      success: res => {
        this.setData({
          queryResult: res.data[0],
          ansOption:getApp().data.optionNames[res.data[0].question_answer-1]
        })
        console.log('[数据库] [查询记录] 成功: ', res)
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

  radioChange:function(e){
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      choosenIndex : e.detail.value
    })
  },
  commitAnswer: function(){
    if (parseInt(this.data.choosenIndex)+1 !== this.data.queryResult.question_answer){
      var bc = "backcolor["+this.data.choosenIndex+"]";
      this.setData({
        [bc]:'red'
      })
    }
    this.setData({
      isSubmitted:{
        submitBtn:'display:none',
        radioDisable:true,
        showAns :'display:inherit'
      }
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