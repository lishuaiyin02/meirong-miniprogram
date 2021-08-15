// pages/mycenter/mycenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article_id:'',//需要更新的文章id，在点击编辑按钮的时候赋值
    isShowForm:false,//显示折叠框
    isSubmit:true,//提交文章，false的时候是更新文章
    id: '',//公众号id
    name: '',//公众号的名字
    headpath: '',//公众号头像路径
    describe: '',//公众号简介
    post_key:[],//公众号中所有的内容
    tempFilePath: [],//上传图片的路径
    cloudPath:[],//上传的云函数的图片路径
    fileID:'',//上传文件产生的fileID，下载的时候会用到
    //inputValue:'',//文章或者标题 还有编号的输入值
    inputTitle:'',
    inputDesc:'',
    inputNum:'',
    inputAddres:'',
    title:'',//上传文章的标题
    describe:'',//上传的文章简介
    no:'',//上传的文章编号
    url:'',//文章的网址
    formId: '',
  },
  //点击发布新文章的函数
  showForm:function(){
    this.setData({
      isShowForm:!this.data.isShowForm,
      isSubmit:true,
      inputTitle: '',
      inputDesc: '',
      inputNum: '',
      inputAddres: '',
      tempFilePath:'../../images/touxiang.png'
    })
  },
  //选择照片
  chooseimage:function(){
    var that=this
    wx.chooseImage({
      count:1,//能够选择的张数，默认为9
      sizeType:['original','compressed'],//可以指定是原图还是压缩图
      sourceType:['album','camera'],//可以指定来源是相机还是相册
      success:function(res){
        wx.showLoading({
          title: '上传中',
        })
        console.log("图片路径是:",res.tempFilePaths)
        var timestamp = Date.parse(new Date());//时间戳
        that.setData({
          tempFilePath:res.tempFilePaths[0],
          cloudPath: timestamp + res.tempFilePaths[0].match(/\.[^.]+?$/)[0],
        })
        var cloudPath=that.data.cloudPath
        var tempFilePath = that.data.tempFilePath
        console.log('路径是', cloudPath, tempFilePath)  
        wx.cloud.uploadFile({
          cloudPath:that.data.cloudPath,
          filePath:that.data.tempFilePath,
          success:resa=>{
            that.setData({
              fileID:resa.fileID
            })
            console.log('[上传文件]成功：',resa)
          },
          fail: (res) => {
            console.error('[上传文件]失败：', res)
          },
          complete: (res) => {
            wx.hideLoading()
          },

        })
        
      },
     
      complete: (res) => {
        
      },
    })
  },
  titleInput:function(e){
    this.setData({
      title: e.detail.value//上传的标题
    })
  },
  //上传的简介
  describeInput:function(e){
    this.setData({
      describe: e.detail.value//上传的简介
    })
  },
  //上传的文章编号
  numberInput:function(e){
    this.setData({
      no: e.detail.value//上传的文章编号
    })
  },
  //上传文章的网址
  addressInput:function(e){
    this.setData({
      url: e.detail.value//上传的网址
    })
  },
  //提交表单的时候触发的事件  服务推送通知
  orderSign:function(e){
    var that = this;
    var fId = e.detail.formId;
    console.log('formid' + fId)
    that.setData({
      formId: fId
    })
  },
  //提交文章按钮触发的事件
  submitdata:function(){
    var that=this
    //判断数据是否为空 一个也不行
    if (this.data.title == "" || this.data.describe == "" || this.data.cloudPath == "" || this.data.url == "" ||this.data.no == "") {
      wx.showToast({
        title: '标题、描述、文章配图、编号和网址不能为空',
        icon:'none'
      })
      console.log("标题", this.data.title, "描述", this.data.describe, "路径", this.data.cloudPath, "网址", this.data.url, "编号", this.data.no)
    }else{
      //上传到数据库
      wx:wx.showToast({
        title: '上传中',
        icon:'loading'
      })
      wx.cloud.callFunction({
        name:'postArticle',
        data:{
          g_id:that.data.id,//公众号的id
          title:that.data.title,//文章的标题
          no:that.data.no,//文章的编号
          url:that.data.url,//上传文章的网址
          describe:that.data.describe,//上传文章的简介
          imageTitle:that.data.cloudPath,//上传文章的图片
          fileID:that.data.fileID,//上传路径的fileID，下载的时候会用到
          date:Date.now(),//上传文章的上传时间
        },
        success:function(res){
          that.setData({
            inputTitle: '',
            inputDesc: '',
            inputNum: '',
            inputAddres: '',
            isShowForm: false,//将文章折叠起来
            tempFilePath:'../../images/touxiang.png'
          })
          that.getArticleList();
          // //点击确定之后复制到粘贴板
          // wx.showModal({
          //   title: '小程序路径',
          //   content: 'pages/message/message?no='+that.data.no+'&g_id='+that.data.id,
          // })
        },
        fail:function(res){
          wx.showToast({
            title: '文章上传失败请重新上传',
            icon: 'none',
          })
        },
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      id:options.id,//公众号的id
      name:options.name,//公众号的名称
      headpath:options.headpath,//公众号的头像路径
      describe:options.describe,//公众号简介
    })
    //获取文章列表
    that.getArticleList();
  

  },
  //获取文章列表
   getArticleList:function(){
    var that=this
     wx.cloud.callFunction({
         name:"Getarticleinfo",
         data:{
           id: that.data.id //公众号id
         },    
       }).then(res=>{
         console.log("article的返回值", res)
         if (res.result.data[0] !== undefined) {
           that.setData({
             post_key: res.result.data,
           })

         } else {
           wx.showToast({
             title: '作者还没有发表文章，请先发布文章',
             icon: 'none',
           })
         }
        
         console.log("获得的文章列表是：",that.data.post_key)

       }).catch(error => {
         // handle error
         console.log(error)
         wx.showToast({
           title: '联网失败',
           icon: 'fail',
         })
       })
  },
  //删除函数
  delete1:function(event){
    var that=this
    var index=event.currentTarget.dataset.index;
    var nos=that.data.post_key[index].no;//编号
    console.log("文章",index,nos,that.data.id)

    wx.showModal({
      title: '提示',
      content: '本文章的留言内容也删除',
      success:function(res){
        if(res.confirm){
          wx.showToast({
            title: '正在删除',
            icon:'loading',
          })
          wx.cloud.callFunction({
            //删除该文章的信息和文章对应的留言
            //可以通过公众号的id和文章
            name:"deleteArticleMess",
            data:{
              no:nos,//文章标号
              g_id:that.data.id//公众号id
            },
            success:function(res){
              //再重新获取文章列表
              that.getArticleList()
            },
            fail:function(res){
              console.log("错误信息",res)
              wx.showToast({
                title: '服务器错误',
                icon: 'none',
              })
            },
          })
        }else if(res.cancel){
          console.log('用户点击取消')
        }
      }
    })

  },

  //编辑函数  准备在这个功能里边写修改题目，描述和图片
  edit: function (event){
    var that=this
    that.setData({
      isSubmit:false,//改成提交文章
      isShowForm:true
    })
    //获得需要修改的文章标题以及简介等
    var index = event.currentTarget.dataset.index
    var _id = that.data.post_key[index]._id;//获得需要修改的文章信息的id
    var title=that.data.post_key[index].title//标题
    var describe=that.data.post_key[index].describe//简介
    var no = that.data.post_key[index].no;//编号
    var url=that.data.post_key[index].url//网址
    var imageTitle=that.data.post_key[index].imageTitle
    var fileID=that.data.post_key[index].fileID
    that.setData({
      article_id:_id,
      inputAddres:url,
      inputDesc:describe,
      inputNum:no,
      inputTitle:title,
      tempFilePath:imageTitle,
      fileID:fileID,

      url:url,
      describe:describe,
      no:no,
      title:title,
      tempFilePath:imageTitle,
      
    })

  },
  //更新文章按钮所触发的事件
  updatedata:function(){
    var that=this
    //判断数据是否为空 一个也不行
    if (this.data.title == "" || this.data.describe == "" || this.data.tempFilePath==""||this.data.url==""||this.data.no==""){
      wx.showToast({
        title: '标题、描述、文章配图、编号和网址不能为空',
        icon:'none'
      })
      console.log("标题", this.data.title, "描述", this.data.describe, "路径", this.data.cloudPath, "网址", this.data.url, "编号", this.data.no)
    }else{
      //上传到数据库
      wx:wx.showToast({
        title: '更新中',
        icon:'loading'
      })
      wx.cloud.callFunction({
        name:'Updatearticle',
        data:{
          _id:that.data.article_id,//需要修改的文章信息的id
          title:that.data.title,//文章的标题
          no:that.data.no,//文章的编号
          url:that.data.url,//上传文章的网址
          describe:that.data.describe,//上传文章的简介
          imageTitle:that.data.cloudPath,//上传文章的图片
          fileID:that.data.fileID,//上传路径的fileID，下载的时候会用到
          date:Date.now(),//上传文章的上传时间
        },
        success:function(res){
          that.setData({
            inputTitle: '',
            inputDesc: '',
            inputNum: '',
            inputAddres: '',
            isShowForm: false,//将文章折叠起来
            tempFilePath:'../../images/touxiang.png'
          })
          that.getArticleList();

        },
        fail:function(res){
          console.log("失败结果是",res)
          wx.showToast({
            title: '文章更新失败请重新上传',
            icon: 'none',
          })
        },
      })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    // 获取文章列表
    that.getArticelList();

    //完成停止加载
    wx.hideNavigationBarLoading();

    //停止下拉刷新 
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})