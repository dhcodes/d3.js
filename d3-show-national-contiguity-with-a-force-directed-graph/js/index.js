'use strict';

var width = 700;
var height = 700;

var svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

var title = svg.append('text').attr('x', width / 2).attr('y', 40).attr('class', 'header').text('Force-Directed National Contiguity Graph').attr('text-anchor', 'middle');

d3.json('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json', function (err, data) {
  if (err) {
    console.log(err);
  } else {
    (function () {
      var dragstarted = function dragstarted() {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d3.event.subject.fx = d3.event.subject.x;
        d3.event.subject.fy = d3.event.subject.y;
      };

      var dragged = function dragged() {
        d3.event.subject.fx = d3.event.x;
        d3.event.subject.fy = d3.event.y;
      };

      var dragended = function dragended() {
        if (!d3.event.active) simulation.alphaTarget(0);
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
      };

      console.log(data);

      var simulation = d3.forceSimulation().force('link', d3.forceLink(data.links.id)).force('charge', d3.forceManyBody()).force('center', d3.forceCenter(width / 2, height / 2)).force("y", d3.forceY(0)).force("x", d3.forceX(0));

      var link = svg.selectAll('.link').data(data.links).enter().append('line').attr('class', 'link');

      var node = d3.select('.flags').selectAll('img').data(data.nodes).enter().append('img').attr('class', function (d) {
        return 'flag flag-' + d.code;
      })
      //.attr('r', 10)

      .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));

      var ticked = function ticked() {
        link.attr("x1", function (d) {
          return d.source.x;
        }).attr("y1", function (d) {
          return d.source.y;
        }).attr("x2", function (d) {
          return d.target.x;
        }).attr("y2", function (d) {
          return d.target.y;
        });

        node.style('left', function (d, i) {
          return d.x + 'px';
        }).style('top', function (d, i) {
          return d.y + 'px';
        }).style('class', 'node');
      };

      simulation.nodes(data.nodes).on('tick', ticked);

      simulation.force('link').links(data.links);
    })();
  }
});