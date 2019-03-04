const F2 = require('../../../plugin/my-f2.min.js');
require('../../../plugin/f2-all.min.js');
// require('@antv/f2/lib/geom/line');
// require('@antv/f2/lib/scale/time-cat');

export default function growUpDrawChart(canvas, data, width, height) {
    let chart = null;
    chart = new F2.Chart({
        el: canvas,
        width,
        height
    });
    chart.source(data, {
        SALES_AMOUNT_3M: {
            tickCount: 5,
            min: 0
        },
        ROW_ID_1: {
            range: [0, 1],
            tickCount: 4
        }
    });

    chart.tooltip({
        showCrosshairs: true,
        showItemMarker: false,
        onShow: function onShow(ev) {
            var items = ev.items;
            items[0].name = null;
            items[0].value = items[0].value;
        }
    });
    chart.axis('SALES_AMOUNT_3M', false);
    chart.axis('ROW_ID_1', false);
    // chart.axis('ROW_ID_1', {
    //     label: function label(text, index, total) {
    //         var textCfg = {};
    //         if (index === 0) {
    //         textCfg.textAlign = 'left';
    //         } else if (index === total - 1) {
    //         textCfg.textAlign = 'right';
    //         }
    //         return textCfg;
    //     }
    // });

    chart.area().position('ROW_ID_1*SALES_AMOUNT_3M');
    chart.line().position('ROW_ID_1*SALES_AMOUNT_3M');
    chart.render();
}