//converted from observable Hertzsprung–Russell code at:
//https://observablehq.com/@d3/hertzsprung-russell-diagram

(function () {
 
 
//sorting/processing the data by difference btw 2019 and 2010
//note if the statement for "metric" variable
  const width = 928;
  const height = 928; //Math.round(width * 1.2)
  const marginTop = 50;
  const marginRight = 0;
  const marginBottom = 50;
  const marginLeft = 100;

  // Ceate the scales.
  //HERE IS THE SCALE FOR color / min, max [-0.39, 2.19]
  const x = d3.scaleLinear([0, 100], [marginLeft, width - marginRight]);
  //HERE IS THE SCALE FOR absolute_magnitude / min, max are [-7, 19]
  const y = d3.scaleLinear([10, 0], [marginTop, height - marginBottom]);
  // const z = bv2rgb; //this just runs a function that converts the value to rgb

   const tooltip = d3.select("#chart")
    .append("div")
    .style("opacity", 0)
    .style("z-index", -1)
    .style("color", "#ffffff")
    .attr("class", "tooltip")
    .style("background-color", "#121212")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "8px")
    .style("position", "absolute")
    .style("width","30vh") //set width
      .style("bottom", "12vh")   // Position in bottom corner (adjust as needed)
    .style("right", "8vh") //Position in right corner
    .style("font-family", "Barlow, sans-serif")
    .style("text-transform", "uppercase")
    .style("font-size", 16);

    // MOUSE HOVER

    const mouseover = function(event,d) {
    d3.select(this).style("cursor","pointer")
      d3.select(this).transition()
              .duration('100')
              .attr("r", function(d){
      return r(d.views) + 3
      })
  tooltip.style("opacity",1)
  	    .style("z-index", 10)

    }

    const mousemove = function(event,d){
      tooltip
          .html("Title: " + d.primaryTitle + "<br>Views: " + d.views + "<br>Year: " + d.startYear + "<br>Primary cast size : " + d.primaryCast + "<br>% of Females in primary cast : " + d.percentageFemale + "<br>Full cast size : " + d.fullCast+ "<br>Gender of director: " + d.directorGender)
          // .style("left", (event.x + 5) + "px")
          // .style("top", (event.y + 5) + "px")
//             .style("position", "absolute")
//             .style("top", "300px")
//             .style("right", "200px")
//             .style("left", "auto");
    }

    const mouseleave = function(d) {
      tooltip.style("opacity",0)
          .style("z-index", -1)

      d3.select(this).transition()
      .duration('200')
      .attr("r", function(d){
        return r(d.views)
      });
    }




  const genreColor = d3.scaleOrdinal()
    .domain(["Comedy","Drama","Documentary","Action","Animation","Romance","Thriller","Sci Fi"])
     .range(["#D0FF59","#6B44EE","#5BA9C8","#EF008F","#FF4D00","#EE72FF","#B6ECFF","#86FF8A"])

    const r = d3.scaleSqrt()
  .domain(d3.extent(data, d => d.views)) // min–max of full cast size
  .range([5, 20]);     

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width+30)
      .attr("height", height)
      .attr("preserveAspectRatio", "xMinYMin meet") //need this to fill svg space properly
//          .attr("viewBox", "0 0 300 300")
      .attr("viewBox", [0, 0, width, height])
//       .attr("style", "max-width: calc(100% + 28px); height: auto;") don't need
//       .style("margin", "0 -14px") messing things up
      .style("background", "#121212")
      .style("color", "#fff")
      .style("display", "block")
      .attr("fill", "currentColor")
      .attr("font-family", "Barlow, sans-serif")
      .style("text-transform", "uppercase")
      .attr("font-size", 12);

  // Create a small (sub pixel) rectangle for each star.
  // svg.append("g")
  //   .selectAll("rect")
  //   .data(data)
  //   .join("rect")
  //   	//reading color and absolute_mag for x/y placements
  //     .attr("x", d => x(d.percentageFemale))
  //     .attr("y", d => y(d.rating))
  //     .attr("fill", d => z(d.percentageFemale)) //not a z axis! this is just coloring them based on the same color variable
  //     .attr("width", 6)
  //     .attr("height", 6);

  // svg.append("g")
  //   .selectAll("circle")
  //   .data(data)
  //   .join("circle")
  //   .attr("cx", d => x(d.percentageFemale))
  //   .attr("cy", d => y(d.rating))
  //   .attr("fill", d => genreColor(d.genre)) 
  //   // .attr("stroke", d => d.netflicOriginal == "yes" ? "#ffffff" : "none")
  //   // .attr("stroke-width", d => d.netflicOriginal == "yes" ? 1 : 0)
  //   .attr("opacity", d => d.netflicOriginal == "yes" ? 1 : 0.6)
  //   .attr("r", d => r(d.views));

 svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.percentageFemale))
    .attr("cy", d => y(d.rating))
    .attr("fill", d => genreColor(d.genre)) 
    .attr("stroke", d => d.netflicOriginal == "yes" ? "#ffffff" : "none")
    .attr("r", d => r(d.views))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  // Create the axes.
  // svg.append("g")
  //     .attr("transform", `translate(${marginLeft},0)`)
  //     .call(d3.axisLeft(d3.scaleLog(y.domain().map(m => Math.pow(10, 4.83 - m)), y.range())));

  svg.append("g")
      .attr("transform", `translate(${width - marginRight},0)`)
      .call(d3.axisRight(y).ticks(null, "f"));

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(null, "f"));

  svg.append("g")
      .attr("transform", `translate(0,${marginTop})`)
      .call(d3.axisTop(x).ticks(null, "f"));

svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(null, "f"));

  // svg.append("g")
  //     .attr("transform", `translate(0,${marginTop})`)
  //     .call(((temperatures) => d3.axisTop(x)
  //         .tickValues(temperatures.map(color))
  //         .tickFormat((_, i) => temperatures[i].toLocaleString("en")))
  //       (d3.range(3000, 10001, 1000).concat(20000)));

  svg.selectAll(".domain").remove();

 // svg.append("text")
 //      .attr("dy", 12)
 //      .attr("text-anchor", "middle")
 //      .attr("transform", `translate(${marginLeft},${(marginTop + height - marginBottom) / 2}) rotate(-90)`)
 //      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("← darker\xa0"))
 //      .call(text => text.append("tspan").attr("font-weight", "bold").text("\xa0Luminosity L☉\xa0"))
 //      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("\xa0brighter →")); 

  svg.append("text")
      .attr("dy", -6)
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width - marginRight},${(marginTop + height - marginBottom) / 2}) rotate(-90)`)
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("← lower "))
      .call(text => text.append("tspan").attr("font-weight", "600").text(" Rating "))
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text(" higher →"));

  svg.append("text")
      .attr("dy", -6)
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${marginLeft},${(marginTop + height - marginBottom) / 2}) rotate(90)`)
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("← higher "))
      .call(text => text.append("tspan").attr("font-weight", "600").text(" Rating "))
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text(" lower →"));

  svg.append("text")
      .attr("x", (marginLeft + width - marginRight) / 2)
      .attr("y", marginTop)
      .attr("dy", 12)
      .attr("text-anchor", "middle")
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("← lower "))
      .call(text => text.append("tspan").attr("font-weight", "600").text(" % of Females in primary cast"))
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text(" higher →"));

  svg.append("text")
      .attr("x", (marginLeft + width - marginRight) / 2)
      .attr("y", height - marginBottom)
      .attr("dy", -6)
      .attr("text-anchor", "middle")
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("← lower "))
      .call(text => text.append("tspan").attr("font-weight", "600").text(" % of Females in primary cast"))
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text(" higher →"));




//   return svg.node();
    const final_chart = svg.node();
document.getElementById("chart").appendChild(final_chart);


let lastClicked = null;

//menu interaction
d3.selectAll("li") //attach onclick to all the <li> tags 
.on("click", function(d, i) {
  const button = this.textContent //get the text of the button

    if (lastClicked === button) {
    d3.selectAll("circle")
      .transition()
      .duration(500)
      .style("opacity", 1);
    lastClicked = null;
    return;    
  }
    lastClicked = button;

  d3.selectAll("circle").each(function(d) { //update circles
  	//testing the clicked menu category
  	 let setOpacity = 1; //set Opacity
  	if(button.startsWith("Netflix")) { //if Netflix dim others
		if (d.netflicOriginal!=="yes") {
			setOpacity=0.2
 		}
  	}  	else if(button.startsWith("Other")) {//if Other dim Netflix
  	
		if (d.netflicOriginal=="yes") {
			setOpacity=0.2
  		}
  	} else { //if genre name equals button text make opaque/else dim others
		if (d.genre.toLowerCase().trim() !== button.toLowerCase().trim()) {
			setOpacity=0.2
			}
	}
	//change current circle to the proper opacity
		d3.select(this)
		 .transition()
		.duration(500) // 500ms transition for a smooth effect
		.style("opacity", setOpacity);
 
});
 
});


})()





