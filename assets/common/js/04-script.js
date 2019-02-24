var url = 'https://www.mapquestapi.com/search/v2/radius?key=Gmjtd%7Clu6t2luan5%252C72%253Do5-larsq&origin=01609&units=m&maxMatches=4000&radius=105&hostedData=mqap.33454_DunkinDonuts&ambiguities=ignore',
  results = null,
  dunkin = [],
  circle = null,
  d3Circle = null;

var color = d3.scaleOrdinal().domain(
    [
      'Suffolk', 'Norfolk', 'Plymouth', 'Worcester', 'Nantucket', 'Middlesex',
      'Hampshire', 'Bristol', 'Hampden', 'Franklin', 'Essex', 'Dukes', 'Berkshire', 'Barnstable'
    ])
  .range(d3.schemeCategory20);

var width = 700,
  height = 500,
  circumference = 6371000 * Math.PI * 2,
  mile = 1609.34,
  centered;

var svg = d3.select('body').append('svg').attr('width', '700px').attr('height', '600px');
var listDiv = d3.select('body').append('div').attr('id', 'listDiv');
var list = listDiv.append('ul');
list.append('li').text('Click a county to get a list of Dunkin Donuts locations');
var gCircle3 = svg.append('g').attr('id', 'circleGroup3');
var gCircle2 = svg.append('g').attr('id', 'circleGroup2');
var g = svg.append('g');
var legend = svg.append('g')
  .attr('class', 'legend')
  .attr('x', 10)
  .attr('y', 450)
  .attr('height', 100)
  .attr('width', 200);

legend.append('rect')
  .attr('x', 10)
  .attr('y', 500)
  .attr('width', 125)
  .attr('height', 90)
  .style('fill', 'white')
  .style('stroke', 'black');

legend.append('text')
  .attr('x', 15)
  .attr('y', 515)
  .text('Distance (miles)');

legend.append('text')
  .attr('x', 15)
  .attr('y', 535)
  .text('1');

legend.append('rect')
  .attr('x', 35)
  .attr('y', 525)
  .attr('width', 10)
  .attr('height', 10)
  .style('fill', 'rgba(235, 109, 40)');

legend.append('text')
  .attr('x', 15)
  .attr('y', 555)
  .text('2');

legend.append('rect')
  .attr('x', 35)
  .attr('y', 545)
  .attr('width', 10)
  .attr('height', 10)
  .style('fill', 'rgba(235, 109, 40, 0.5)');

legend.append('text')
  .attr('x', 15)
  .attr('y', 575)
  .text('3');

legend.append('rect')
  .attr('x', 35)
  .attr('y', 565)
  .attr('width', 10)
  .attr('height', 10)
  .style('fill', 'rgba(235, 109, 40, 0.3)');


var projection = d3.geoConicConformal().scale(14000)
  .parallels([41 + 17 / 60, 41 + 29 / 60])
  .rotate([70 + 30 / 60, 0])
  .translate([height / 2, width / 2])
  .center([-1.8, 41.8]);
var path = d3.geoPath().projection(projection);

d3.json(url, function(d) {
  results = d.searchResults;

  results.forEach(function(store) {
    if (store.fields.state == 'MA') {
      dunkin.push(store);
      drawCircles(store.fields.lng, store.fields.lat, store.fields.address, store.fields.address2);
    }
  });
  // json from: https://github.com/deldersveld/topojson
  d3.json('assets/common/datasets/ma-counties.json', function(ma) {
    g.append('g')
      .attr('id', 'counties')
      .selectAll('path')
      .data(topojson.feature(ma, ma.objects.cb_2015_massachusetts_county_20m).features)
      .enter()
      .append('path')
      .attr('d', path)
      .style('stroke', 'black')
      .style('fill', 'rgba(255, 255, 255, 0)')
      .on('click', zoom);
  });

});

function drawCircles(lng, lat, address, address2) {
  var angle = mile / circumference * 360;
  var circle = d3.geoCircle().center([lng, lat]).radius(angle);

  g.append('path')
    .attr('id', address + address2)
    .attr('d', path(circle()))
    .attr('fill', 'rgba(235, 109, 40)');

  var angle2 = angle * 2;
  circle = d3.geoCircle().center([lng, lat]).radius(angle2);

  gCircle2.append('path')
    .attr('d', path(circle()))
    .attr('fill', 'rgba(235, 109, 40)');

  var angle3 = angle * 3;
  circle = d3.geoCircle().center([lng, lat]).radius(angle3);

  gCircle3.append('path')
    .attr('d', path(circle()))
    .attr('fill', 'rgba(235, 109, 40)');

}

function selectStore(store) {
  if (circle != null) {
    d3Circle = d3.select(circle).lower();
    circle.setAttribute('class', '');
  }
  circle = document.getElementById(store[0] + store[1]);
  console.log(circle.id);
  circle.setAttribute('class', 'selected');
  d3Circle = d3.select(circle).raise();
}

function zoom(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 2.5;
    centered = d;
    d3.select('#info').text('County:\n' + d.properties.NAME);
    list.selectAll('li').remove();
    dunkin.forEach(function(store) {
      if (store.fields.county == d.properties.NAME) {
        list.append('li').append('a')
          .data([
            [store.fields.address, store.fields.address2]
          ])
          .on('click', selectStore)
          .text(store.fields.address + '\n' + store.fields.address2);
      }
    });
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
    d3.select('#info').text('County:\n');
    list.selectAll('li').remove();
    list.append('li').text('Click a county to get a list of Dunkin Donuts locations');
  }

  g.selectAll('path')
    .classed('active', centered && function(d) { return d === centered; });

  g.transition()
    .duration(800)
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')
    .style('stroke-width', 1.5 / k + 'px');

  gCircle2.transition()
    .duration(800)
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')
    .style('stroke-width', 1.5 / k + 'px');

  gCircle3.transition()
    .duration(800)
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')
    .style('stroke-width', 1.5 / k + 'px');
}