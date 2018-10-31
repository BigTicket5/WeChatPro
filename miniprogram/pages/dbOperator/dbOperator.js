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
    wx.cloud.callFunction({
      name:'getAdminExamQuestions',
      success:res=>{
        this.setData({
          queryResult:res.result.data
        })
      },
      fail: err => {
        console.error('[云函数] [getAdminExamQuestions] 调用失败', err)
      }
    })
  },

  checkboxChange:function(e){
    var tmp = [];
    tmp=e.detail.value;
    this.setData({
      choosenIndex : tmp
    });
  },
  //get correct answer to this question
  commitAnswer: function(){
    var idx = this.data.counterId;
    var answerArray = [];
    answerArray = this.data.queryResult[idx].question_answer;
    var cIdx = [];
    cIdx=this.data.choosenIndex;
    var ansO =[]
    for(var i=0;i<answerArray.length;i++){
      ansO.push(app.data.optionNames[answerArray[i]-1]);
    }
    this.setData({
      ansOption: ansO 
    });
    for(var i=0;i<cIdx.length;i++){
      var choosenIDX = parseInt(cIdx[i]) + 1;
      var bc = "backcolor["+cIdx[i]+"]";
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
 
  // go to next question
  nextQuestion:function(){
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
  
  // go to prev question
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