

export const getMockdata = () => {
    let obj = {
      baseInfo: {
        nsrmc:'广州海昊某某公司',
        nsrsbh:'91440114353514613A',
        sshy:'其他未列明金属制品制造',
        kyrq:'2015-08-14',
        nslxmc:'一般纳税人',
        zczb:'50',
        gszch:'440121000237226',
        zzjgdm:'353514613',
        dbrmc:'梁某某',
        dbr_zjhm:'440111198502021234',
        jyfw:'商品零售贸易（许可审批类商品除外）;商品批发贸易（许可审批类商品除外）;技术进出口;货物进出口（专营专控商品除外）;五金配件制造、加工;五金制品涂装、喷涂;金属表面处理及热处理加工;'
      },
      investInfo: [
        {tzbl: "50", tzfjjxzmc: "内资个人", tzfmc: "梁杰焯", tzje: "0"},
        {tzbl: "50", tzfjjxzmc: "内资个人", tzfmc: "慕容国坚", tzje: "0"},
        {tzbl: "50", tzfjjxzmc: null, tzfmc: "梁杰焯", tzje: "0"},
        {tzbl: "50", tzfjjxzmc: null, tzfmc: "慕容国坚", tzje: "0"}
      ],
      other: {
        
      }
  }
  let str = '';
  for(let i=0; i < 18; i++){
    let chart = ''
    if(i <= 16){
      chart = getCode(true);
    } else {
      chart = getCode(false);
    }
    str += chart;
  }
  obj.baseInfo.nsrmc = '公司名称XXX' + getCode(false);
  obj.baseInfo.nsrsbh = str;
  return obj;
}


function getCode(state){
  // let flag = Math.random()>0.5 ? true : false;
  let codeIndex;
  if(state){
      /* Ascll码表: 0-9: 48~57; A-Z: 65~90 */
    codeIndex = Math.floor(Math.random()*(57 - 48) + 48);
  }else{
    codeIndex = Math.floor(Math.random()*(90 - 65) + 65);
  }
  return String.fromCharCode(codeIndex);
}
