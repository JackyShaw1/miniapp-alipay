// 封装my.httpRequest 方法
// 192.168.81.124:8080
//https://www.vzoom.com/v-miniapp
let baseUrl = 'https://www.vzoom.com/v-miniapp';
//let baseUrl = 'https://www.vzoom.com/d-wechat';
let httpRequestFun = function(obj) {
  return new Promise((resolve, reject) => {
    my.httpRequest({
      url: obj.buIsHave ? obj.url : baseUrl + obj.url,
      method: obj.method,
      timeout: 120000,
      data: obj.params,
      dataType: 'json',
      success: function(res) {
        if(res.data.httpCode == 200){
          resolve(res.data);
        }else if(res.data.httpCode == 408){
           reject(res);
        } else {
          my.alert({
            title: '服务器错误',
            content: res.data.msg
          });
           my.hideLoading();
        }
       
      },
      fail: function(res) {
        reject(res);
        let message = '';
        switch(res.error) {
          case 11: message = '无权跨域'; break;
          case 12: message = '网络出错'; break;
          case 13: message = '请求超时'; break;
          case 14: message = '解码失败'; break;
          case 19: message = 'HTTP错误'; break;
          default: message = '请求失败'; break;
        }
        my.hideLoading();
        my.alert({
          title: message
        });
      }
    });
  })
}

export default async function(obj) {
  let data =  await httpRequestFun(obj);
  return data;
}