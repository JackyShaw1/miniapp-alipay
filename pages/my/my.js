import { getTaxData } from '../../api/index';
let app = getApp();
Page({
  data: {
    userInfo: {
      nickName: app.globalData.userInfo.nickName,
      avatar: app.globalData.userInfo.avatar,
      authCode: app.globalData.userInfo.authCode
    },
    onTitleTap: 'handleTitleTap',
    swipeIndex: null,
    listData: [],
    right1: [{ type: 'delete', text: '删除' }]
  },
  onLoad(query) {
    let that = this;
    my.getAuthCode({ // 获取授权码
      scopes: 'auth_user',
      success: (res) => {
        my.getAuthUserInfo({// 获取用户信息
          success: (userInfo) => {
            console.log(userInfo);
            app.globalData.userInfo = {
              authCode: res.authCode,
              nickName: userInfo.nickName,
              avatar: userInfo.avatar
            }
            that.setData({
              userInfo: {
                nickName: app.globalData.userInfo.nickName,
                avatar: app.globalData.userInfo.avatar,
                authCode: app.globalData.userInfo.authCode
              }
            })
          }
        });
      },
      fail: (res) => {
        // my.alert({
        //   content: res.authErrorScope,
        //   success: () => {
        //     my.switchTab({
        //       url: '../home/home'
        //     });
        //   }
        // });
        my.switchTab({url: '../home/home'});
      }
    });
  },
  onShow(){
    this.getCompanyList();
  },
  handleTitleTap(e) {
    if(!this.data.panels[0].content.length) {
      my.confirm({
        title: '提示',
        content: '您还没有认证的企业, 请先认证企业',
        confirmButtonText: '认证',
        cancelButtonText: '取消',
        success: (result) => {
          if(result.confirm){
            my.switchTab({
              url: '../home/home', 
            });
          }
        },
      });
    }
    const { index } = e.currentTarget.dataset;
    const panels = this.data.panels;
    // android does not supprt Array findIndex
    panels[index].expanded = !panels[index].expanded;
    this.setData({
      panels: [...panels],
    });
  },
  async getCompanyList(){ 
    let data = await this.getCompanyData(); // 从缓存中读取数据;
    console.log(data);
    if(data && data.list){ // 缓存中有数据;
      this.setData({ listData: data.list });
      if(data.list.length === 0) {
        app.globalData.auth = false;
      }
    } else { // 缓存中没有数据
      app.globalData.auth = false;
    }
  },
  async companyHandler(e){ // 点击公司列表;
    let {nsrsbh, companyName } = e.target.dataset;
    let data = await this.getCompanyData(); // 从缓存中读取数据;
    // 检验当前认证的纳税识别号的报告是否有数据;
    if(data.dataObj[nsrsbh]){
      my.navigateTo({
        url: `../reportPage/reportPage?nsrsbh=${nsrsbh}&companyName=${companyName}`
      });
    } else {
      let currentData = await this.getReportAllData(nsrsbh); // 后台获取数据
      data.dataObj[nsrsbh] = currentData;
      my.setStorage({
        key: 'reportData',
        data: data,
        success: function() {
          my.navigateTo({
            url: `../reportPage/reportPage?nsrsbh=${nsrsbh}&companyName=${companyName}`
          })
        },
        fail: function(){

        }
      });
    }
  },
  async onRightItemClick(e) {
    let that = this;
    let _index = e.index;
    let nsrsbh = this.data.listData[_index].nsrsbh;
    let data = await that.getCompanyData();
    my.confirm({
      title: '提示',
      content: `确认要删除该企业认证信息吗?`,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          data.list.splice(_index,1);
          delete data.dataObj[nsrsbh];
          if(data.list.length === 0){
             app.globalData.auth = false;
          }
          that.setCompanyData(data);
          e.done();
        } else {
         
        }
      },
    });
  },
  onItemClick(e) {
    my.alert({
      content: `dada${e.index}`,
    });
  },
  onSwipeStart(e) {
    this.setData({
      swipeIndex: e.index || null,
    });
  },
  setCompanyData(data) {
    let that = this;
    my.setStorage({
      key: 'reportData',
      data: data,
      success: function() {
        that.getCompanyList();
      },
      fail: function(){
   
      }
    });
  },
  getCompanyData(){
    return new Promise((resolve, reject) => {
      my.getStorage({
        key: 'reportData',
        success: function(res) {
          resolve(res.data);
        },
        fail: function(res){
          reject(res.errorMessage);
          my.alert({content: res.errorMessage});
        }
      });
    });
  },
  makePhoneCall() {
    my.makePhoneCall({ number: '4008036188' });
  },
  getReportAllData(nsrsbh){
    let that = this;
    let params = { nsrsbh: nsrsbh };
    my.showLoading({content: '加载中...'});
    return getTaxData(params).then((res) => {
      let {data} = res;
      let obj = {
        baseInfo: JSON.parse(data.jcxxInfo), // 基础数据
        scoreInfo: JSON.parse(data.scoreInfo), // 评分
        manger: JSON.parse(data.bseInfo), // 经营稳定性评价
        earnProfit: JSON.parse(data.proeInfo), // 获利能力评价
        performance: JSON.parse(data.periInfo), // 履约意愿评价
        growUp: JSON.parse(data.salerInfo), // 成长能力评价
      }
      my.hideLoading({
        page: that,  // 防止执行时已经切换到其它页面，page指向不准确
      });
      return obj;
    });
  },
});
