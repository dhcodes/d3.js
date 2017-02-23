'use strict';

//enter data
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function (error, data) {
  var time = [];
  var place = [];
  data.forEach(function (item) {
    time.push(item.Seconds);
    place.push(item.Place);
  });

  //general setup
  var margin = { top: 50, right: 80, bottom: 100, left: 50 };
  var padding = 10;
  function calcWidth() {
    console.log(window.innerWidth);
    if (window.innerWidth > 1000) {
      return 900;
    }
    return window.innerWidth;
  }
  var width = calcWidth() - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  //add graph to body of webpage
  var svg = d3.select('body').append('svg').attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //x scale
  var xScale = d3.scaleTime().domain(d3.extent(time)).range([width, 0]);

  //y scale
  var yScale = d3.scaleLinear().domain(d3.extent(place).reverse()).range([height, 0]);

  //tooltip
  var tooltip = d3.select('body').append('g').attr('class', 'tooltip').style('bottom', '10%').style('visibility', 'hidden');

  //add data to graph
  var node = svg.selectAll('g').data(data).enter().append('g');

  node.append('circle').attr('class', 'circle').attr('r', 3.5).attr('cx', function (d, i) {
    return xScale(d.Seconds);
  }).attr('cy', function (d) {
    return yScale(d.Place);
  }).style('fill', function (d) {
    if (d.Doping == "") {
      return 'black';
    } else {
      return 'red';
    }
  }).on('mouseover' || 'click', function (d, i) {
    tooltip.style('visibility', 'visible').html('<p>Name: ' + d.Name + '<br/>Year: ' + d.Year + '<br/>Country: ' + d.Nationality + '<br/>Time: ' + d.Time + '<br/>Alleged: ' + d.Doping + '</p>');
  }).on('mouseout', function () {
    console.log('away');
    tooltip.style('visibility', 'hidden');
  });

  node.append('text').attr('class', 'names').attr('x', function (d, i) {
    return xScale(d.Seconds) + 5;
  }).attr('y', function (d, i) {
    return yScale(d.Place) + 5;
  }).text(function (d) {
    return d.Name;
  });

  //x-axis
  svg.append('g').call(d3.axisBottom(xScale).tickFormat(function (d) {
    return d3.min(time) - d;
  })).attr("transform", "translate(0," + (height + padding) + ")");

  svg.append('text').attr('x', 0).attr('y', -20).attr('text-anchor', 'end').style('font-size', '11').text('Place').attr('transform', 'rotate(-90)');

  //y-axis
  var yAxis = svg.append('g').call(d3.axisLeft(yScale).ticks(8)).attr("transform", "translate(" + -padding + ",0)");

  svg.append('text').attr('x', width).attr('y', height + 40).style('font-size', '11').attr('text-anchor', 'end').text('Seconds Behind Fastest Sprint');

  //legend
  var legend = svg.append('g');
  var legX = width - 200,
      legY = height - 250;

  var legendData = [{
    'color': 'red',
    'label': 'Riders with doping allegations'
  }, {
    'color': 'black',
    'label': 'Riders with no doping allegations'
  }];

  legend.append('text').attr('x', legX).attr('y', legY).text("Legend");

  legend.selectAll('.legend').data(legendData).enter().append('circle').attr('cx', function (d, i) {
    return legX + 20;
  }).attr('cy', function (d, i) {
    return legY + 20 + 20 * i;
  }).attr('r', 4).style('fill', function (d) {
    return d.color;
  });

  legend.selectAll('.label').data(legendData).enter().append('text').attr('class', 'names').attr('x', function (d, i) {
    return legX + 35;
  }).attr('y', function (d, i) {
    return legY + 23 + 20 * i;
  }).text(function (d) {
    return d.label;
  });

  //title
  svg.append('text').attr('x', width / 2).attr('y', 0).attr('class', 'title').attr('text-anchor', 'middle').text('Fastest Cyclist Sprints - Alpe D\'Huez');
});