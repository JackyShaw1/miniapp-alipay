Page({
  data: {
    companyName: '',
    nsrsbh: '',

    arr01: [
      {
        id: 0,
        name: '购买新设备',
      },
      {
        id: 1,
        name: '扩大公司规模',
      },
      {
        id: 2,
        name: '公司上市',
      },
      {
        id: 3,
        name: '扩大营业规模',
      },
    ],
    arr02: [
      {
        id: 0,
        name: '一年',
      },
      {
        id: 1,
        name: '两年',
      },
      {
        id: 2,
        name: '三年',
      },
      {
        id: 3,
        name: '四年',
      },
    ],
    arrIndex01: 0,
    arrIndex02: 0
  },
  onLoad(query) {
    let {nsrsbh, companyName } = query;
    this.setData({ companyName: companyName, nsrsbh: nsrsbh });
  },
  bindObjPickerChange01(e) {
    this.setData({
      arrIndex01: e.detail.value,
    });
  },
   bindObjPickerChange02(e) {
    this.setData({
      arrIndex02: e.detail.value,
    });
  },
  formSubmit(e) {
    my.showToast({
      type: 'none',
      content: '次功能暂未开通',
      duration: 3000,
      success: () => {
      },
    });
    
  }
});


