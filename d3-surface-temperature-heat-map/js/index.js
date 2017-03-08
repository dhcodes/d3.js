

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', (err, data) => {
  let months = [];
  let years = [];
  let tempRange = [];
  if (err) {
    alert(err)
  }          
  else {
    //console.log(data)
    data.monthlyVariance.forEach((item)=>{
      months.push(item.month)
      years.push(item.year)
      tempRange.push(item.variance)
                 })
      
  }


const margin = {top: 100, left:100, right: 100, bottom: 100}

const width = 1000 - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;

let title = d3.select('body')
  .append('div')
  .attr('class', 'title')
  .style('text-align','center')
  .html('<h1>Monthly Global Land-Surface Temperature</h1><h2>1753 - 2015</h2>')

let svg = d3.select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//x scale
let xScale = d3.scaleLinear().domain(d3.extent(years)).range([0, width]);

//x axis  
let xAxis = svg.append('g')
  .call(d3.axisBottom(xScale)
  .ticks(10)
  .tickFormat(d=>d.toString().replace(',', '')))
  
  .attr("transform", "translate(0," + height + ")")

//x label
svg.append('text')
  .attr('x', 100)
  .attr('y', height+40)
  .attr('text-anchor', 'middle')
  .style('font-size', '15')
  .text('Year')

//y scale
let yScale = d3.scaleBand().domain(months).range([0, height]);
  
//y axis
let yAxis = svg.append('g')
  .call(d3.axisLeft(yScale)
  .ticks(12)
  .tickFormat(d=>{
    return convertMonth(d)
           }))
  
//y label
let yLabel = svg.append('text')
  .attr('x', -(height/2))
  .attr('y', -60)
  .attr('text-anchor', 'middle')
  .style('font-size', '15')
  .text('Months')
  .attr('transform','rotate(-90)')
  

//color scale
let colorScale = d3.scaleQuantize()
.domain(d3.extent(tempRange))
.range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c"])
//.interpolate(d3.interpolateYlOrRd);

  
//tooltip
let tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('visibility', 'hidden')
  
  
//cells
let cells = svg.selectAll('rect')
  .data(data.monthlyVariance)
  .enter()
  .append('g')
  .append('rect')
  .attr('height', height/12)
  .attr('width', width/(years.length/12))
  .attr('x', (d=>xScale(d.year)))
  .attr('y', (d=>yScale(d.month)))
  .attr('fill', (d=>colorScale(d.variance)))
  .on('mouseover', (d)=>{
    tooltip.style('visibility','visible')
      .html('<p>Date: ' + convertMonth(d.month) + ', ' + d.year + '<br>Temperature: ' + (data.baseTemperature + d.variance).toFixed(2) + '&deg; C<br>Variation: ' + d.variance + '&deg; C</p>')
  })
  .on('mouseout', (d)=>{
    tooltip.style('visibility', 'hidden')
  })



let legendText = svg.append('g')
  .attr('class', 'legend')
  .append('text')
  .attr('x', width - 200)
  .attr('y', height + 75)
  .text('Legend')

let legend = svg.append('g')
  .selectAll('rect')
  .data(()=>{
    let arr = [];
    let i = d3.min(tempRange);
    let x = d3.max(tempRange) - d3.min(tempRange)
    while (i<x) {
      arr.push(i);
      i+=x/5
    }
    return arr;
  })
  .enter()
  .append('rect')
  .attr('x', (d,i)=>width -260 +(i*25))
  .attr('y', height+30)
  .attr('width', 20)
  .attr('height', 20)
  .style('fill', (d, i)=>colorScale(d))

let coolerText = svg.append('g')
  .attr('class', 'legend')
  .append('text')
  .attr('x', width - 315)
  .attr('y', height + 45)
  .text('Cooler')
  
let hotterText = svg.append('g')
  .append('text')
  .attr('x', width - 50)
  .attr('y', height + 45)
  .text('Hotter')  
  
})

function convertMonth(num) {
  switch (num) {
      case 1: return 'January';
      case 2: return 'February';
      case 3: return 'March';
      case 4: return 'April';
      case 5: return 'May';
      case 6: return 'June';
      case 7: return 'July';
      case 8: return 'August';
      case 9: return 'September';
      case 10: return 'October';
      case 11: return 'November';
      case 12: return 'December';
           }
}