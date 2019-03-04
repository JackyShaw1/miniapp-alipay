
var fetch = require("../utils/fetch");
export const getAuthUrl = (params) => { // 获取认证Url;
    return fetch({
        url: `/applet/certUrl`,
        method: 'post',
        buIsHave: false,
        params: params
    });
};

export const getTaxData = (params) => { // 获取报告数据;
    return fetch({
        url: `/data/getAllChartInfo`,
        buIsHave: false,
        method: 'get',
        params: params
    });
};

export const pollingSearch = (params) => { // 轮询查询;
    return fetch({
        url: `/applet/cert/company`,
        method: 'post',
        buIsHave: false,
        params: params
    });
};
