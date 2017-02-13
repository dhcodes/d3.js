
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', (err, data) => {
    let numData = [];
       let labelData = [];
       data.data.map((item)=>{
        labelData.push(new Date(item[0]))
        numData.push(item[1])
       })
  
       let margin = {top: 30, left:40, right: 20, bottom: 20};
      
       let width= window.innerWidth-margin.left - margin.right;
       let height = window.innerHeight-margin.top-margin.bottom;
       
       
            //console.log(labelData)
       
       let svg = d3.select('body')
                   .append('svg')
                   .attr('height', height)
                   .attr('width', width)
                   
       
       let scaleX = d3.scaleTime()
                 .range([0, width])
       .domain(d3.extent(labelData))
                 
                 
       
       let scaleY = d3.scaleLinear()
                      .domain(d3.extent(numData))
                      .rangeRound([height, margin.top])
      
      let tooltip = d3.select('body').append('g')
      .attr('class', 'tooltip')
	    .style('visibility', 'hidden')
      
      

    
      svg.selectAll('rect')
         .data(numData)
         .enter()
         .append('rect')
        .on('mouseover',(d,i)=>{
          tooltip.style('visibility', 'visible')
                 .style("top", (d3.event.pageY-10)+"px") 
                 .style("left",(d3.event.pageX)-150+"px")
                 .html('GDP: '+d+' Billon<br/>Date: '+labelData[i].toDateString())
                
      })
    .on('mouseout', ()=>tooltip.style('visibility','hidden'))
       
         .attr('x', (d, i)=>i*(width/labelData.length))
         .attr('y', (d, i)=> scaleY(d)-margin.bottom)
         .attr('width', width/labelData.length-1)
         .attr('height', (d,i)=>height - scaleY(d))
         .attr('fill', 'green')
         .attr('class', 'bar')
         .attr('transform', 'translate('+margin.left+')')
         
  
      
      
      svg.append('text')
         .attr('x', width/2)
         .attr('y', margin.top)
         .attr('class', 'title')
         .attr('text-anchor', 'middle')
         .text('US Gross Domestic Product: 1945-2015')
     
       svg.append('g')
      .attr('transform', 'translate('+margin.left+',' + (height - margin.bottom) + ')')
      .call(d3.axisBottom(scaleX)
        .ticks(10)
        .tickFormat(d3.timeFormat('%Y')))
           
  
       svg.append("g")
      .attr('transform', 'translate('+margin.left+', '+-(margin.bottom)+')')
      .call(d3.axisLeft(scaleY));  
      
})