var cityData = require("./citys.js");

// 根据省市区名称获取对应编码;
export const getAreaCode = (list) => {
  let obj = {
    provinceCode: '',
    cityCode: '',
    areaCode: ''
  }
  jump:
  for(let i = 0; i < cityData.length; i++){
    if(cityData[i].name === list[0].name){
      obj.provinceCode = cityData[i].code;
      for(let j = 0; j < cityData[i].subList.length; j++){
        if(cityData[i].subList[j].name === list[1].name ){
          obj.cityCode = cityData[i].subList[j].code;
          for(let k = 0; k < cityData[i].subList[j].subList.length; k++){
            if(cityData[i].subList[j].subList[k].name === list[2].name){
              obj.areaCode = cityData[i].subList[j].subList[k].code;
              break jump;
            }
          }
        }
      }
    }
  }
  return obj;
}


export const getProCityCode = (cityAdCode) => {
  let obj = {
    provinceCode: '',
    cityCode: ''
  } 
  jump:
  for(let i = 0; i < cityData.length; i++){
    for(let j = 0; j < cityData[i].subList.length; j++){
      if(cityData[i].subList[j].code == cityAdCode){
        obj.provinceCode = cityData[i].code;
        obj.cityCode = cityData[i].subList[j].code;
        break jump;
      }
    }
  }
  return obj;
}