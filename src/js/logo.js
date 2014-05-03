'use strict';

// resize/reload no jQuery
window.addEventListener('resize', function () {
  window.location.reload();
});

var wid = parseInt(d3.select('body').style('width'), 10),
    hei = parseInt(d3.select('body').style('height'), 10),
    shortest = Math.min(wid, hei),
    tiles = 8,
    w = Math.floor(shortest / tiles),
    h = Math.floor(shortest / tiles),
    wCount = Math.floor(wid/w),
    hCount = Math.floor(hei/h),
    color = d3.scale.category20b()
;

console.log('w: ' + w);
console.log('h: ' + h);

d3.select('#container')
  .style('width', w * wCount + 'px')
  .style('height', h * hCount + 'px')
  .on('click', click);
var vis = d3.select('#vis');
var svg = vis.append('svg')
          .attr('id', 'svg')
          .attr('width', w)
          .attr('height', h)
          .style('background', 'black');
var group = svg.append('g');

// setup mirrors
var mirrors = d3.select('#mirrors').append('g');
var iX = 0, iY = 0;
for (iX;iX < hCount; iX++) {
  for (iY;iY < wCount; iY++) {
    var mirrorDir = '';
    if (iY % 2) {
      if (iX % 2) {
        mirrorDir = 'mirrorXY';
      } else {
        mirrorDir = 'mirrorX';
      }
    } else {
      if (iX % 2)
        mirrorDir = 'mirrorY';
    }
    mirrors.append('svg')
      .attr('id', 'mirror-' + iX + '-' + iY)
      .attr('class', 'mirror ' + mirrorDir)
      .append('use').attr('xlink:href', '#svg')
      ;
  }
  iY = 0;
}
d3.selectAll('.mirror').style('width', w);
d3.selectAll('.mirror').style('height', h);

var xA = d3.scale.linear().range([0,w]);
var yA = d3.scale.linear().range([h,0]);

var poly = [
  {'x': 1.0, 'y': 2.0},
  {'x': 12.0, 'y': 1.0},
  {'x': 1.0, 'y': 1.0},
  {'x': 2.0, 'y': 12.0}
];

var poly2 = [
  {'x': 1.0, 'y': 2.0},
  {'x': 12.0, 'y': 1.0},
  {'x': 2.0, 'y': 12.0}
];

xA.domain(d3.extent(poly, function(d) {return d.x;}));
yA.domain(d3.extent(poly, function(d) {return d.y;}));

var line = d3.svg.line()
  .x(function(d) { return xA(d.x); })
  .y(function(d) { return yA(d.y); })
  .interpolate('linear-closed')
  ;

var path = group
  .append('path')
  .data([poly])
  .attr('stroke', '#eee')
  .attr('fill', '#fff')
  //.style('opacity', 0.7)
  .attr('d', line)
  //.each(loop)
;

var path2 = group
  .append('path')
  .data([poly2])
  .attr('stroke', '#ccc')
  .attr('fill', '#ddd')
  //.style('opacity', 0.8)
  .attr('d', line)
  //.each(loop)
;

function makePt() {
  return { 'x': _.random(0,2)*6, 'y': _.random(0,4)*3};
}
var toggle = false;
var msec = 1000;
var intervalId = 0;
function click() {
  /*jshint validthis: true */
  toggle = (toggle) ? false : true;
  console.log('click! animate?: ' + toggle);
  if (!toggle) clearInterval(intervalId);
  if (toggle) {
    clearInterval(intervalId);
    intervalId = setInterval(function() {
      var c = color(_.random(10));
      poly.shift();
      _.map(_.range(_.random(5)), poly.push(makePt()));
      path.transition()
        .duration(msec)
        .attr('fill', c)
        .attr('stroke', c)
        .attr('d', line)
      ;

      var d = color(_.random(20));
      poly2.shift();
      _.map(_.range(_.random(5)), poly2.push(makePt()));
      path2.transition()
        .delay(msec/2)
        .duration(msec)
        .attr('fill', d)
        .attr('stroke', d)
        .attr('d', line)
      ;

    }, msec + 10);
  }
}

click();


//function loop() {
  //var path = d3.select(this);
  //(function repeat() {
    ////(function waitFor(){
      ////var timeout = (isLooping) ? 1 : 100;
      ////setTimeout(function(){
        ////while(!isLooping)
          ////waitFor();
      ////}, timeout);
    ////})();

    //var first = poly.shift();
    //poly.push({ 'x': _.random(1,12), 'y': _.random(1,4)*3});
    //path = path.transition()
      //.duration(1000)
      //.attr('d', line)
      //.each('end', repeat);
  //})();
//}




