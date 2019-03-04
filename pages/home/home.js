import { getProCityCode } from '../../utils/index';
import { getAuthUrl, getTaxData } from '../../api/index'
const F2 = require('../../plugin/my-f2.min.js');
import dashBoardChart  from '../components/chart/dashBoard-chart'

let app = getApp();
Page({
  data: {
    isAuthStatus: app.globalData.auth,
    isHaveChart: false,
    bankList: [
        {
          thumb: 'icon01.png',
          title: '智能信贷'
        },
        {
          thumb: 'icon02.png',
          title: '融资租赁'
        },
        {
          thumb: 'icon03.png',
          title: '商业保理'
        },
        {
          thumb: 'icon04.png',
          title: '信用商务'
        }
    ],
    cityList: [
      {
        provinceCode: '440000',
        cityCode: '440100',
        areaName: '广东'
      },
      {
        provinceCode: '440000',
        cityCode: '440300',
        areaName: '深圳'
      },
      // {
      //   provinceCode: '370000',
      //   cityCode: '370100',
      //   areaName: '山东'
      // },
      // {
      //   provinceCode: '140000',
      //   cityCode: '140100',
      //   areaName: '山西'
      // },
      // {
      //   provinceCode: '610000',
      //   cityCode: '610100',
      //   areaName: '陕西'
      // },
      // {
      //   provinceCode: '430000',
      //   cityCode: '430100',
      //   areaName: '湖南'
      // }
    ],
    currentCity: app.globalData.currentCity,
    companyName: '',
    nsrsbh: '',
    dataObj: {
      scoreInfo: null
    },
    creditRating: {
      rating: '',
      paraphrase: ''
    },

  },
  onLoad() {

    this.checkIsAuth();
  },
  onShow(){
    console.log('show Function');
    var that = this;
    this.setData({isAuthStatus: app.globalData.auth});
    if(!this.data.isAuthStatus){ // 如果没有认证状态就认为, 没有图表
      this.setData({
        isHaveChart: false
      });
    }
    if(app.globalData.auth && !this.data.isHaveChart){
      my.getStorage({
        key: 'reportData',
        success: function(res) {
          let data =  res.data;
          if(data && data.list.length) {
            let {nsrsbh, companyName } = data.list[0];
            that.setData({
              companyName: companyName,
              nsrsbh: nsrsbh
            });
            let { scoreInfo } = data.dataObj[nsrsbh];
            that.setData({ dataObj: {
              scoreInfo: scoreInfo // 评分
            }});
            that.initChart();
          }
        },
        fail: function(res){
          my.alert({content: res.errorMessage});
        }
      });
    } 
  },
  async taxAuth(e){
    let that = this;
    // 读取缓存中的数据判断认证数量是否已经有5条!
    let authCode = await this.getAuthCode();
    app.globalData.userInfo.authCode = authCode;
    console.log(authCode);
    var data = await this.getCompanyData();
    if((data && data.list && (data.list.length < 5)) || !data){
       my.chooseCity({
        showLocatedCity: true,
        showHotCities: true,
        success: (res) => {
          let obj = getProCityCode(res.adCode);
          that.setData({ currentCity: res.city });
          app.globalData.currentCity = res.city;
          app.globalData.provinceCode = obj.provinceCode;
          app.globalData.cityCode = obj.cityCode;
          that.getUrl();
          //my.navigateTo({  url: '../auth/auth' });// 跳转认证授权页面
        }
      });
    } else {
      my.alert({title:"警告", content: '认证企业已经超出范围, 不能继续添加企业!'});
    }
    return data;
  },
  getUrl() {
    let timestamp = new Date().getTime();
    let { provinceCode, cityCode } =  app.globalData;
    let { authCode } = app.globalData.userInfo;
    let params = {
      proCode: provinceCode,
      cityCode: cityCode,
      reqId: timestamp,
      type: 'alipay-plus',
      appletAuthCode: authCode
    }
    my.showLoading({content: '加载中...'});
    getAuthUrl(params).then((res) => {
      my.hideLoading({}); 
      app.globalData.authUrl = res.data.certTaxUrl;
      app.globalData.reqId = res.data.reqId;
      my.navigateTo({  url: '../auth/auth' });// 跳转认证授权页面
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
          // my.alert({content: res.errorMessage});
        }
      });
    });
  },
  getAuthCode(){
    return new Promise((resolve, reject) => {
      my.getAuthCode({
        scopes: 'auth_user',
        success: (res) => {
          resolve(res.authCode);
        },
      });
    });
  },
  async checkIsAuth(){
    var that = this;
    let data = await this.getCompanyData(); // 从缓存中读取数据;
    if(data && data.list.length) {
      app.globalData.auth = true;
       let {nsrsbh, companyName } = data.list[0];
       that.setData({
         companyName: companyName,
         nsrsbh: nsrsbh
       });
      // 检验当前认证的纳税识别号的报告是否有数据;
      if(data.dataObj[nsrsbh]){
        that.setData({});
        let { scoreInfo } = data.dataObj[nsrsbh];
        that.setData({ dataObj: {
          scoreInfo: scoreInfo // 评分
        }});
        that.setData({
          isAuthStatus: true, // 认证状态设置为true; 
          isHaveChart: false
        });
      }
     
    } else {
      app.globalData.auth = false;
    }
  },
  async clickCityHandle(e){
    let {cityCode, provinceCode} = e.target.dataset;
    app.globalData.provinceCode = provinceCode;
    app.globalData.cityCode = cityCode;
    let authCode = await this.getAuthCode();
    app.globalData.userInfo.authCode = authCode;
    this.getUrl();
  },
  getReportAllData(nsrsbh){
    let that = this;
    let params = { nsrsbh: nsrsbh };
    my.showLoading({content: '加载中...'});
    return getTaxData(params).then((res) => {
      console.log(res);
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

  onReady(){
    if(this.data.isAuthStatus){
      this.initChart();
    }
  },
  initChart() {
    var that = this;
     /************************ 仪表盘 图表*********************/ 
    this.setData({isHaveChart: true});
    my.createSelectorQuery()
      .select('#dashBored-chart')
      .boundingClientRect()
      .exec((res) => {
        console.log(res);
        // 获取分辨率
        const pixelRatio = my.getSystemInfoSync().pixelRatio;
        // 获取画布实际宽高
        const canvasWidth = res[0].width;
        const canvasHeight = res[0].height;
        this.setData({
          width00: canvasWidth * pixelRatio,
          height00: canvasHeight * pixelRatio
        });
        const myCtx = my.createCanvasContext('dashBored-chart');
        myCtx.scale(pixelRatio, pixelRatio); // 必要！按照设置的分辨率进行放大
        const canvas = new F2.Renderer(myCtx);
        this.canvas = canvas;

        let { score, curDate } = this.data.dataObj.scoreInfo;
        
        if(typeof score === 'number' && !isNaN(score)){
          let newScore = (score*100).toFixed(2);
          let pointerText = '';
          let paraphrase = '';
          if(newScore < 51.6){
            newScore = 51.6;
            pointerText = 'A';
            paraphrase = '企业信用等级一般';
          } else if(newScore >= 51.6 && newScore < 57.8) {
              pointerText = 'A';
              paraphrase = '企业信用等级一般';
          } else if(newScore >= 57.8 && newScore < 65) {
              pointerText = 'AA';
              paraphrase = '企业信用等级良好';
          } else if(newScore >= 65 && newScore < 72.3) {
              pointerText = 'AAA';
              paraphrase = '企业信用等级较好';
          } else if(newScore >= 65 && newScore < 72.3) {
              pointerText = 'AAAA';
              paraphrase = '企业信用等级很好';
          }  else if(newScore >= 81.2){
              pointerText = 'AAAAA';
              paraphrase = '企业信用等级极好';
          }

          that.setData({
            creditRating: {
              rating: pointerText,
              paraphrase: paraphrase
            }
          });

          let data = [{
            pointer: pointerText,
            curDate: curDate,
            value: newScore,
            length: 2,
            y: 1.05 
          }];

          dashBoardChart(canvas, data, res[0].width, res[0].height);
        }
    });
  },
  addAuthAssess(e){
     my.scan({
      type: 'qr',
      success: (res) => {
        my.alert({ title: res.code });
      },
      fail: (res) => {
        
      }
    });
  },
  wsClickHandle(){
    my.ap.navigateToAlipayPage({
        path:'alipays://platformapi/startapp?appId=66666883&chInfo=ch_vzoom__chsub_tax',
        success:(res) => {
            my.alert({content:'系统信息' + JSON.stringify(res)});
        },
        fail:(error) => {
            my.alert({content:'系统信息' + JSON.stringify(error)});        
        }
    })
  },
  lookReportHander(){
    let { nsrsbh, companyName } = this.data;
    console.log(nsrsbh, companyName);
    my.navigateTo({
      url: `../reportPage/reportPage?nsrsbh=${nsrsbh}&companyName=${companyName}`
    });
  }
});
