const F2 = require('../../../plugin/my-f2.min.js');
require('../../../plugin/f2-all.min.js');
// require('@antv/f2/lib/geom/line');
// require('@antv/f2/lib/scale/time-cat');

export default function dashBoardChart(canvas, data, width, height) {
    var Shape = F2.Shape;
    //自定义绘制数据的的形状
    Shape.registerShape('point', 'dashBoard', {
        getPoints: function getPoints(cfg) {
            var x = cfg.x;
            var y = cfg.y;

            return [{
                x: x,
                y: y
            }, {
                x: x,
                y: 0.4
            }];
        },
        draw: function draw(cfg, container) {
            var point1 = cfg.points[0];
            var point2 = cfg.points[1];
            point1 = this.parsePoint(point1);
            point2 = this.parsePoint(point2);
            
            var line = container.addShape('Polyline', {
                attrs: {
                    points: [point1, point2],
                    stroke: '#3cafbb',
                    lineWidth: 2
                }
            });

            var text = cfg.origin._origin.value.toString();
            // var text1 = container.addShape('Text', {
            //     attrs: {
            //         text: text,
            //         x: cfg.center.x,
            //         y: cfg.center.y,
            //         fill: '#ccc',
            //         fontSize: 14,
            //         textAlign: 'center',
            //         textBaseline: 'bottom'
            //     }
            // });
            var text2 = container.addShape('Text', {
                attrs: {
                    text: cfg.origin._origin.pointer,
                    x: cfg.center.x,
                    y: cfg.center.y,
                    fillStyle: '#3cafbb',
                    fontSize: 18,
                    textAlign: 'center',
                    textBaseline: 'center'
                }
            });

            var text3 = container.addShape('Text', {
                attrs: {
                    text: '评估于',
                    x: cfg.center.x,
                    y: cfg.center.y + 40,
                    fillStyle: '#ccc',
                    fontSize: 12,
                    textAlign: 'center',
                    textBaseline: 'bottom'
                }
            });

            var text4 = container.addShape('Text', {
                attrs: {
                    text: cfg.origin._origin.curDate,
                    x: cfg.center.x,
                    y: cfg.center.y + 60,
                    fillStyle: '#ccc',
                    fontSize: 12,
                    textAlign: 'center',
                    textBaseline: 'bottom'
                }
            });
            return [line, text2, text3, text4];
        }
    });

    var chart = new F2.Chart({
        el: canvas,
        width,
        height,
        animate: true
    });
    
    chart.source(data, {
        value: {
            type: 'linear',
            min: 0,
            max: 100,
            ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            nice: false
        },
        length: {
            type: 'linear',
            min: 0,
            max: 10
        },
        y: {
            type: 'linear',
            min: 0,
            max: 1
        }
    });

    chart.coord('polar', { // 极坐标系
        inner: 0,
        startAngle: -1.25 * Math.PI, // 起始弧度
        endAngle: 0.25 * Math.PI  // 结束弧度
    });

    //配置value轴刻度线
    chart.axis('value', {
        tickLine: {
            strokeStyle: '#ccc', 
            lineWidth: 2,
            length: -5 // 刻度线长度
        },
        label: null,
        grid: null,
        line: null
    });

    chart.axis('y', false);
    
    
    //绘制仪表盘辅助元素
   

    chart.guide().arc({
        start: [data[0].value, 1.05],
        end: [100, 1.05],
        style: {
            strokeStyle: '#ccc',
            lineWidth: 5,
            lineCap: 'round'
        }
    });

    chart.guide().arc({
        start: [0, 1.05],
        end: [data[0].value, 1.05],
        style: {
            strokeStyle: '#3cafbb',
            lineWidth: 5,
            lineCap: 'round'
        }
    });

    chart.guide().arc({
        start: [0, 1.2],
        end: [100, 1.2],
        style: {
            strokeStyle: '#ccc',
            lineWidth: 1
        }
    });
    
    var ticksTags = [
        {pointerX: 0, content: '0'},
        {pointerX: 10, content: '10'},
        {pointerX: 20, content: '20'},
        {pointerX: 30, content: '30'},
        {pointerX: 40, content: '40'},
        {pointerX: 50, content: '50'},
        {pointerX: 60, content: '60'},
        {pointerX: 70, content: '70'},
        {pointerX: 80, content: '80'},
        {pointerX: 90, content: '90'},
        {pointerX: 100, content: '100'},
    ];
    
    ticksTags.map((item) => {
        chart.guide().text({
            position: [item.pointerX, 0.9],
            content: '',
            style: {
                fillStyle: '#ccc',
                font: '10px Arial',
                textAlign: 'center'
            }
        });
    });

    

    chart.point().position('value*y').size('length').color('#1890FF').shape('dashBoard');
    chart.render();

}