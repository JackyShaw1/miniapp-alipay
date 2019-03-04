App({
  onLaunch(options) { // 第一次打开
    // options.query == {number:1}
    // my.getLocation({
    //   success(res) {
    //     my.hideLoading();
    //     console.log(res)
    //     /* that对象为Page可以设置数据刷新界面
    //     that.setData({
    //       hasLocation: true,
    //       location: formatLocation(res.longitude, res.latitude)
    //     })
    //     */
    //   },
    //   fail() {
    //     my.hideLoading();
    //     my.alert({ title: '定位失败' });
    //   },
    // })
    // let that = this;
    // my.getAuthCode({
    //   scopes: 'auth_user',
    //   success: (res) => {
    //     that.globalData.userInfo.authCode = res.authCode;
    //   },
    // });
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
  globalData: {
    auth: false,
    token: false,
    userInfo: {
      authCode: '',
      nickName: '',
      avatar: '../../images/my-img/head.png'
    },
    currentCity: '深圳市',
    provinceCode: '440000',
    cityCode: '440300',
    authUrl: '',
    reqId: ''
  }
});
