// import { getMockdata } from '../../utils/mock'
import { pollingSearch } from '../../api/index'
let app = getApp();
let pageCloseState = false; // 页面关闭状态;
Page({
  data: {
    url: "",
    authData: {
      nsrsbh: '',
      companyName: ''
    }
  },
  onLoad() {
    // 调用轮询方法;
    pageCloseState = false;
    this.getPollingSearch();
    this.setData({ url: encodeURI(app.globalData.authUrl)});
  },
  onReady() {
  },
  onUnload() { // 页面被关闭
    pageCloseState = true;
  },
  async handlerMessage(){
    let data = {
      list: [],
      dataObj: {}
    };
    let { nsrsbh } = this.data.authData;
    let localData = await this.getCompanyData(); // 获取本地缓存数据
    if(localData && localData.list && localData.list.length < 5){ // 检验缓存数据是否有5条;
      data = {
        list: localData.list,
        dataObj: localData.dataObj
      };
      data.list = localData.list;
      data.list.push(this.data.authData);

      // 去重数组中的对象;
      let hash = {};
      const newArr = data.list.reduceRight((item, next) => {
          hash[next.nsrsbh] ? '' : hash[next.nsrsbh] = true && item.push(next);
          return item
      }, []);
      data.list = newArr;
      this.setCompanyData(data);
    } else {
      if(!localData){
        data.list.push(this.data.authData);
        this.setCompanyData(data); 
      } else {
        my.alert({title:"警告", content: '认证企业已经超出范围, 不能继续添加企业!'});
      }
    }
  },
  getPollingSearch() { // 轮询查询授权状态
    let that = this;
    setTimeout(()=>{
      let params = { reqId: app.globalData.reqId };
      pollingSearch(params).then((res) => {
        let { status, nsrsbh, companyName } = res.data;
        if(status == ""){ // 没有查到
          if(!pageCloseState){
             console.log("没有查到认证成功状态");
            that.getPollingSearch(); 
          }
        } else if(status == "1") { // 认证成功
          console.log("企业认证成功");
          that.setData({
            authData: { nsrsbh: nsrsbh, companyName: companyName }
          });
          that.handlerMessage();
        } else { // 认证失败
          my.redirectTo({url: `../fail/fail`});
        }
      }).catch((res) => {
        console.log(res);
        if(res.data.httpCode == 408){
          that.getPollingSearch();
        }
      });
    }, 2000);
  },
  setCompanyData(data) {
    let { nsrsbh, companyName } = this.data.authData
    my.setStorage({
      key: 'reportData',
      data: data,
      success: function() {
        my.redirectTo({url: `../success/success?nsrsbh=${nsrsbh}&companyName=${companyName}`});
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
  }
});
