const F2 = require('../../plugin/my-f2.min.js');
import dashBoardChart  from '../components/chart/dashBoard-chart'

Page({
  data: {
    companyName: '',
    nsrsbh: '',
    productList: [
      {
        productName: "江苏银行",
        productId: 1,
        imgUrl: '../../images/product-img/jiangsu-bank-logo.png'
      },
      {
        productName: "交通银行",
        productId: 2,
        imgUrl: '../../images/product-img/jiaotong-bank-logo.png'
      },
      {
        productName: "平安银行",
        productId: 3,
        imgUrl: '../../images/product-img/pingan-bank-logo.png'
      }
    ],
    dataObj: {
      scoreInfo: null
    },
    creditRating: {
      rating: '',
      paraphrase: ''
    },
  },
  onLoad(query) {
    let {nsrsbh, companyName } = query;
    this.setData({ companyName: companyName, nsrsbh: nsrsbh });
    let that = this;
    my.getStorage({
      key: 'reportData',
      success: function(res) {
        let data = res.data;
        let { scoreInfo } =  data.dataObj[nsrsbh];
        that.setData({ dataObj: {
          scoreInfo: scoreInfo // 评分
        }});
        console.log(that.data.dataObj);
      },
      fail: function(res) {
        my.alert({ title: '读取缓存失败', content: res });
      } 
    })
  },

   onReady() {
    var that = this;
     /************************ 仪表盘 图表*********************/ 
    my.createSelectorQuery()
      .select('#dashBored-chart')
      .boundingClientRect()
      .exec((res) => {
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
    my.navigateTo({
      url: `../reportPage/reportPage?nsrsbh=${nsrsbh}&companyName=${companyName}`
    });
  }
});
