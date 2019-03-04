require('../../../plugin/f2-all.min.js');
const F2 = require('../../../plugin/my-f2.min.js');

export default function mangerDrawChart(canvas, data, width, height) {
    const Shape = F2.Shape;
   Shape.registerShape('interval', 'triangle', {
				getPoints: function getPoints(cfg) {
					var x = cfg.x;
					var y = cfg.y;
					var y0 = cfg.y0;
					var width = cfg.size;
					return [{
						x: x - width / 2,
						y: y0
					}, {
						x: x,
						y: y
					}, {
						x: x + width / 2,
						y: y0
					}];
				},
				draw: function draw(cfg, group) {
					var points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
					var leftPoints = [{
						x: points[0].x,
						y: points[0].y
					}, {
						x: points[1].x,
						y: points[1].y
					}, {
						x: points[1].x,
						y: points[0].y
					}];
					var rightPoints = [{
						x: points[1].x,
						y: points[1].y
					}, {
						x: points[2].x,
						y: points[2].y
					}, {
						x: points[1].x,
						y: points[0].y
					}];
					var left = group.addShape('polygon', {
						attrs: {
							points: leftPoints,
							fill: cfg.color
						}
					});

					var right = group.addShape('polygon', {
						attrs: {
							points: rightPoints,
							fill: "#0069cb"
						}
					});
					return [left, right]; // 将自定义Shape返回
				}
		});


    const chart = new F2.Chart({
        el: canvas,
        width,
        height,
        padding: ['auto', 40]
    });

    chart.source(data);
		chart.axis('genre', false);
		chart.axis('sold', {
				line: null
		});
		chart.legend(false);
		chart.interval().position('genre*sold').color('genre').shape('triangle');

		data.map(function(obj) {
      chart.guide().text({
        position: [obj.genre, obj.sold],
        content: obj.genre,
        style: {
          textAlign: 'center',
          textBaseline: 'bottom'
        },
        offsetY: -10
      });
		});
		chart.render();
}