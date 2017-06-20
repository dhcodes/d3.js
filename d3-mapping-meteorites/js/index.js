'use strict';

d3.json("https://unpkg.com/world-atlas@1/world/110m.json", function (error, world, zoomed) {

  if (error) throw error;
  //console.log(world)

  //set map size
  var height = window.innerHeight;
  var width = window.innerWidth;

  //append svg
  var svg = d3.select('body').append('svg').attr('width', width).attr('height', height);

  //set up d3 map projection
  var projection = d3.geoStereographic().scale(250).translate([width / 2, height / 2]);

  //set up the paths
  var geoPath = d3.geoPath().projection(projection);

  //add paths to svg
  var map = svg.append('path').datum(topojson.feature(world, world.objects.countries)).attr('d', geoPath).attr('fill', 'white').attr("stroke-width", 1).attr("stroke", "black");

  //call meteorite json data
  var impacts = d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', function (err, data, i) {
    if (error) throw error;

    var scale = d3.scaleLinear().domain([0, 2000000]).range([1, 15]);

    var tooltip = d3.select("body").append("div").attr('class', 'tooltip');

    var meteors = svg.append('g');

    meteors.selectAll('path').data(data.features).enter().append('path').attr('class', 'meteors').attr('fill', 'steelblue').attr('stroke', 'black').attr("stroke-width", 0.5).attr('d', geoPath.pointRadius(function (d, i) {
      if (d.properties.mass === null) {
        return 1;
      } else {
        return scale(d.properties.mass);
      }
    })).on('mouseover', function (d) {
      tooltip.style('visibility', 'visible').style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY + 10 + "px").html('Name: ' + d.properties.name + '<br/>' + 'Mass: ' + d.properties.mass + '<br/>' + 'Year: ' + new Date(d.properties.year).getFullYear() + '<br/>' + 'Fall: ' + d.properties.fall + '<br/>' + 'Rec-Class: ' + d.properties.recclass + '<br/>' + 'Rec-Lat: ' + parseFloat(d.properties.reclat).toFixed(2) + '<br/>' + 'Rec-Long: ' + parseFloat(d.properties.reclong).toFixed(2) + '<br/>');
    }).on('mouseout', function () {
      tooltip.html('');
      tooltip.style('visibility', 'hidden');
    });

    //apply zoom effect to map
    svg.call(d3.zoom().scaleExtent([0.75, 4]).on("zoom", zoomed));

    //zoom function
    function zoomed() {
      map.attr("transform", d3.event.transform);
      meteors.attr("transform", d3.event.transform);
    }
  });
  d3.select('body').append('div').attr('class', 'footer').html('Coded by <a href="https://github.com/dhcodes" target="_blank">dhcodes</a>');
});