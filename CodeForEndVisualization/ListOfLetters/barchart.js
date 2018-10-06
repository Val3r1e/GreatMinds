//-------------------------- Global Variables ------------------------------

var wordClicked = false;
var clickedWord = "";
var wordId;
var myConfig;
var yearOpen = false;
var personOpen = false;
var openYear;
var openPerson;
var visibleLetters;
var visibleLettersPeople;
var barSelected = false;
var toggleWhileBarSelected = false;
var legendSelected = false;
var loadedLetter;

//-------------------- Barchart -----------------------

function bars(data,version){

    var svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 1250 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1)      //Makes Barchart bigger/smaller
        .align(0.3);            //Moves barchart closer/further away from y-axis

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    //Color
    var z = d3.scaleOrdinal()
        //      FSchiller, CSchiller, CStein, CGoethe
        .range(["#9fa8da", "#7b1fa2", "#5c6bc0", "#9575cd"]);

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    var active_link = "0";
    var legendClassArray = [];
    var active = "0";
    var rectangleClassArray = ["FSchiller","CSchiller", "CStein", "CGoethe"];
    var yearArray = [];
    var wanted = "0";
    var activeName = "0";

    d3.csv(data, function(d, i, columns){
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
    }, 
    
    function(error, data){

        if (error) throw error;

        var keys = data.columns.slice(1);

            x.domain(data.map(function(d) { return d.Year; }));
            y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
            z.domain(keys);

            g.append("g")
                .selectAll("g")
                .data(d3.stack().keys(keys)(data))      // Stack function, stacks bars
                .enter().append("g")
                .attr("fill", function(d,i){ return z(i); })     // Coloring the bars, z-axis
                .attr("class", function(d,i){
                    classLabel = rectangleClassArray[i];
                    return "class" + classLabel;
                })
                .selectAll("rect")
                .data(function(d) { return d;})
                .enter().append("rect")
                .attr("x", function(d) { return x(d.data.Year);})
                .attr("id", function(d,i){
                    var a = 0;
                    for(f=0; f<yearArray.length; f++){
                        if(d.data.Year == yearArray[f]){
                            a += 1;
                        }
                    }

                    yearArray.push(d.data.Year);

                    return ("id" + d.data.Year + "-" + rectangleClassArray[a]);
                })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth()) // Width of bars -1 smaller +1 bigger etc
                .on("mouseover", function (d) {

                    //The Year of the Bar
                    wanted = this.id.split("id").pop();
                    wanted = wanted.slice(0, 4);

                    //The Name of the Bar
                    activeName = this.id.split("id").pop();
                    activeName = activeName.slice(5);

                    //No Bar and nothing on legend selected
                    if(active === "0" && active_link === "0"){

                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "pointer")
                            .style("stroke", "purple")
                            .style("stroke-width", 1.3);
                        }  
                        tooltip
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                        .html(d.data.Year + ": " + d.data.total); 
                    }
                    //One Bar and nothing on legend selected and hovering above selected Bar
                    else if(active == d.data.Year && active_link === "0"){

                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "pointer");
                        }
                        tooltip
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                        .html(d.data.Year + ": " + d.data.total); 
                    }
                    //One Bar and nothing on legend selected and hovering above not selected Bar
                    else if(active != d.data.Year && active_link === "0"){

                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "default");
                        }   
                        tooltip
                        .style("display","none");
                    }
                    //No Bar and one Person on legend selected and hovering above selected person bar
                    else if(active === "0" && active_link == activeName){
                        d3.select("#id" + wanted + "-" + activeName)
                        .style("cursor", "pointer")
                        .style("stroke", "purple")
                        .style("stroke-width", 1.3);

                        amount = d[1]-d[0];

                        tooltip
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                        .html(activeName + ": " + amount); 
                    }
                    //No Bar and one Person on legend selected and hovering above not selected person part
                    else if(active === "0" && active_link != activeName){

                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "default");
                        } 
                    }
                    //First one Bar and then one Person on legend selected and hovering above selected person part
                    else if(active == d.data.Year && active_link == activeName){

                        d3.select(this)
                        .style("cursor", "pointer");

                        amount = d[1]-d[0];
                        tooltip
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                        .html(activeName + ": " + amount); 
                    }
                    //First one Bar and then one Person on legend selected and hovering above not selected person part but on selected bar
                    else if(active == d.data.Year && active_link != activeName){
                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "default");
                        } 
                    }
                    //First one Bar and then one Person on legend selected but hovering above not selected bar and parts
                    else if(active != d.data.Year && active_link != activeName){
                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "default");
                        }
                    }
                    //First person on legend then one Bar selected and hovering above selected person part
                    else if(active_link == activeName && active == d.data.Year){
                        d3.select(this)
                        .style("cursor", "pointer");
                        
                        amount = d[1]-d[0];
                        tooltip
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                        .html(activeName + ": " + amount); 
                    }
                    //First person on legend then one Bar selected and hovering above not selected person part but on selected bar
                    else if(active_link != activeName && active == d.data.Year){
                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "default");
                        }
                    }
                    //First person on legend then one Bar selected but hovering above not selected bar or parts
                    else if(active_link != activeName && active != d.data.Year){
                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "default");
                        }
                    }
                    //First person on legend then one BAr selected but hovering above same name part but different year
                    else if(active_link == activeName && active != d.data.Year){
                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "default");
                        }
                    }
                })
                .on("mouseout", function (d){

                    if(active === "0" && active_link === "0"){

                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "none")
                            .style("stroke", "pink")
                            .style("stroke-width", 0.2);
                        }
                    }
                    else if(active === "0" && active_link == activeName){

                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "none")
                            .style("stroke", "pink")
                            .style("stroke-width", 0.2);
                        }
                    }

                    tooltip
                    .style("display","none");
                })
                .on("click", function(d){

                    //No Bar or Person on legend is selected
                    if (active === "0" && active_link === "0"){
                        barSelected = true;

                        for (j = 0; j < rectangleClassArray.length; j++) {
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("stroke", "black")
                            .style("stroke-width", 1.5);
                        }

                        active = d.data.Year;

                        for(j=0; j<yearArray.length; j++){
                            for(h=0; h<rectangleClassArray.length; h++){
                                if(yearArray[j]!=active){
                                    d3.select("#id" + yearArray[j] + "-" + rectangleClassArray[h])
                                    .style("opacity", 0.5);
                                }
                            }
                        }
                        document.getElementById("message_from_bar").innerHTML = d.data.Year;
                        document.getElementById("report_steps").innerHTML = version;
                        document.getElementById("message_from_bar").onchange();
                        // In "wanted" ist das Jahr und in "activeName" der eigene Name!
                      
                    }
                    //Bar is selected but no person on legend, clicking on selected part
                    else if (active === d.data.Year && active_link === "0"){
                        barSelected = false;

                        for (j = 0; j < rectangleClassArray.length; j++) {
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("stroke", "none");
                        }

                        active = "0";

                        for(j=0; j<yearArray.length; j++){
                            for(h=0; h<rectangleClassArray.length; h++){
                                d3.select("#id" + yearArray[j] + "-" + rectangleClassArray[h])
                                .style("opacity", 1);
                            }
                        }
                        document.getElementById("message_from_bar").onchange();
                        
                    }
                    //No bar but person on legend is selected, clicking on part of bar of that person
                    else if(active === "0" && active_link == activeName){
                        barSelected = true;
                        d3.select(this)
                        .style("stroke", "black")
                        .style("stroke-width", 1.5);

                        for (j = 0; j < yearArray.length; j++) {
                            if(yearArray[j] != wanted){
                                d3.select("#id" + yearArray[j] + "-" + activeName)
                                .style("opacity", 0.5);
                            }
                        }
                        active = d.data.Year;

                        document.getElementById("message_from_bar").innerHTML = d.data.Year;
                        document.getElementById("report_steps").innerHTML = version;
                        document.getElementById("message_from_bar").onchange();

                        
                    }
                    //Bar and person on legend is selected, clicking on part of bar of that person
                    else if(active === d.data.Year && active_link == activeName){
                        barSelected = false;
                        d3.select(this)
                        .style("stroke", "none");

                        for (j = 0; j < yearArray.length; j++) {
                            if(yearArray[j] != wanted){
                                d3.select("#id" + yearArray[j] + "-" + activeName)
                                .style("opacity", 1);
                            }
                        }
                        active = "0";
                        document.getElementById("message_from_bar").onchange();
                    }
                })
                
            /* --------- x-axis --------- */
            g.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height + ")")
                .attr("font-weight", "bold")        // Bold Years
                .call(d3.axisBottom(x));

            /* -------- Amount tag on the top left -------- */
            g.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y).ticks(null, "s"))
                .attr("font-weight", "bold")        // Bold y-axis
                .append("text")
                .attr("x", 2)       // Hight x-axis
                .attr("y", y(y.ticks().pop()) + 0.5)    // Hight y-axis
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")    // bold text
                .attr("text-anchor", "start")   // text position
                .text("Amount");    // Text

        /* --------- Legend in top right corner --------- */
        var legend = g.append("g")
            .attr("font-family", "sans-serif") // Schriftart
            .attr("font-size", 10)  // Schriftgröße
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            //------------- Add Class and fill legendClassArray-------------
            .attr("class", function (d) {
                legendClassArray.push(d); 
                return "legend";
            })
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legendClassArray = legendClassArray.reverse();

        legend.append("rect")  // Rectangles of legend
            .attr("x", width - 50)  
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z)
            //------------- Add Id-------------
            .attr("id", function (d) {
                return ("id" + d);
            })
            .on("mouseover", function(){ 
                if (active_link === "0"){
                    d3.select(this)
                    .style("stroke","purple")
                    .style("stroke-width",0.8)
                    .style("cursor", "pointer");
                }
            })
            .on("mouseout", function(){
                if (active_link === "0"){
                    d3.select(this)
                    .style("stroke","pink")
                    .style("stroke-width",0.2);
                }
            })
            .on("click", function(d){
                //No person on legend and no bar selected
                if(active_link === "0" && active === "0"){
                    legendSelected = true;
                    d3.select(this)           
                    .style("stroke", "black")
                    .style("stroke-width", 1);

                    active_link = this.id.split("id").pop();

                    erase(this);

                    for (i = 0; i < legendClassArray.length; i++){
                        if (legendClassArray[i] != active_link) {
                            d3.select("#id" + legendClassArray[i])
                            .style("opacity", 0.5);
                        }
                    }
                    document.getElementById("message_from_legend").innerHTML = active_link;
                    document.getElementById("message_from_legend").onchange();
                    
                }
                //Person on legend was selected but no bar
                else if(active_link === this.id.split("id").pop() && active === "0"){
                    legendSelected = false;
                    d3.select(this)           
                    .style("stroke", "none");

                    active_link = "0"; 

                    for (i = 0; i < legendClassArray.length; i++) {              
                        d3.select("#id" + legendClassArray[i])
                        .style("opacity", 1);
                    }

                    putBack(d);

                    //make other bars visible again
                    for (j = 0; j < yearArray.length; j++) {
                        for(h = 0; h < legendClassArray.length; h++){
                            d3.select("#id" + yearArray[j] + "-" + legendClassArray[h])
                            .transition()
                            .duration(1000)
                            //.delay(750)
                            .style("opacity", 1);
                        }
                    }

                    document.getElementById("message_from_legend").onchange();
                        
                }
                //No person on legend but person on bar was selected  
                else if(active_link === "0" && active != "0"){
                    legendSelected = true;
                    
                    d3.select(this)           
                    .style("stroke", "black")
                    .style("stroke-width", 1);

                    //Person
                    active_link = this.id.split("id").pop();

                    for (j = 0; j < legendClassArray.length; j++){
                        if (legendClassArray[j] != active_link) {
                            d3.select("#id" + legendClassArray[j])
                            .style("opacity", 0.5)
                            .style("cursor", "default");
                        }
                    }

                    for(j=0; j<legendClassArray.length; j++){
                        if(legendClassArray[j] != active_link){
                            d3.select("#id" + active + "-" + legendClassArray[j])
                            .style("cursor", "default")
                            .style("stroke", "pink")
                            .style("stroke-width", 0.2)
                            .style("opacity", 0.5);
                        }
                    }
                    document.getElementById("message_from_legend").innerHTML = active_link;
                    document.getElementById("message_from_legend").onchange();
                }
                //Person on legend and bar selected 
                else if(active_link == this.id.split("id").pop() && active != "0"){
                    legendSelected = false;

                    d3.select(this)           
                    .style("stroke", "none");

                    for (i = 0; i < legendClassArray.length; i++) {              
                        d3.select("#id" + legendClassArray[i])
                        .style("opacity", 1);
                    }

                    for(j=0; j<legendClassArray.length; j++){
                        if(legendClassArray[j] != active_link){
                            d3.select("#id" + active + "-" + legendClassArray[j])
                            .style("cursor", "pointer")
                            .style("stroke", "black")
                            .style("stroke-width", 1.5)
                            .style("opacity", 1);
                        }
                    }

                    active_link = "0";
                    document.getElementById("message_from_legend").onchange();
                }
                /*else if(active === "0" && active_link == this.id.split("id").pop()){
                    console.log("Here");
                }*/
            });

        legend.append("text") // Text of legends 
            .attr("x", width - 60)  // Same -x moves it closer to y-axis
            .attr("y", 9.5)         //The higher the x the farther down it goes (closer to x-axis)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });

        function erase(d){
            
            class_keep = d.id.split("id").pop();

            //Make all other bars less visible
            for (i = 0; i < legendClassArray.length; i++) {
                if (legendClassArray[i] != class_keep) {
                    d3.selectAll(".class" + legendClassArray[i])
                    .transition()
                    .duration(1000)          
                    .style("opacity", 0.5);
                }
            }
        } 

        function putBack(d){

            console.log("here2");

            //make other bars visible again
            for (j = 0; j < legendClassArray.length; j++) {
                //if (legendClassArray[j] != class_keep){
                    d3.selectAll(".class" + legendClassArray[j])
                    .transition()
                    .duration(1000)
                    //.delay(750)
                    .style("opacity", 1);
                //}
            }
        }
    });
}

function barsZoom(data, version) {
    var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1250 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1)      //Makes Barchart bigger/smaller
        .align(0.3);            //Moves barchart closer/further away from y-axis

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    //Color
    var z = d3.scaleOrdinal()
        //      FSchiller, CSchiller, CStein, CGoethe
        .range(["#9fa8da", "#7b1fa2", "#5c6bc0", "#9575cd"]);

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    var active_link = "0";
    var legendClassArray = [];
    var active = "0";
    var rectangleClassArray = ["FSchiller","CSchiller", "CStein", "CGoethe"];
    var yearArray = [];
    var wanted = "0";
    var activeName = "0";

    d3.csv(data, function(d, i, columns){
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
    }, 

    function(error, data){

        if (error) throw error;

        var keys = data.columns.slice(1);
            x.domain(data.map(function(d) {return d.Year;}));
            console.log(data.map(function(d) { return d.Year;}));
            y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
            z.domain(keys);

            g.append("g")
                .selectAll("g")
                .data(d3.stack().keys(keys)(data))      // Stack function, stacks bars
                .enter().append("g")
                .attr("fill", function(d,i){ return z(i); })     // Coloring the bars, z-axis
                .attr("class", function(d,i){
                    classLabel = rectangleClassArray[i];
                    return "class" + classLabel;
                })
                .selectAll("rect")
                .data(function(d) { return d;})
                .enter().append("rect")
                .attr("x", function(d) { return x(d.data.Year);})
                .attr("id", function(d,i){
                    var a = 0;
                    for(f=0; f<yearArray.length; f++){
                        if(d.data.Year == yearArray[f]){
                            a += 1;
                        }
                    }

                    yearArray.push(d.data.Year);

                    return ("id" + d.data.Year + "-" + rectangleClassArray[a]);
                })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth()) // Width of bars -1 smaller +1 bigger etc
                .on("mouseover", function (d) {

                    //The Year of the Bar
                    wanted = this.id.split("id").pop();
                    wanted = wanted.slice(0, 4);

                    //The Name of the Bar
                    activeName = this.id.split("id").pop();
                    activeName = activeName.slice(5);

                    //No Bar and nothing on legend selected
                    if(active === "0" && active_link === "0"){

                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "pointer")
                            .style("stroke", "purple")
                            .style("stroke-width", 1.3);
                        }  
                        tooltip
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                        .html(d.data.Year + ": " + d.data.total); 
                    }
                    //One Bar and nothing on legend selected and hovering above selected Bar
                    else if(active == d.data.Year && active_link === "0"){

                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "pointer");
                        }
                        tooltip
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                        .html(d.data.Year + ": " + d.data.total); 
                    }
                    //One Bar and nothing on legend selected and hovering above not selected Bar
                    else if(active != d.data.Year && active_link === "0"){

                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "default");
                        }   
                        tooltip
                        .style("display","none");
                    }
                    //No Bar and one Person on legend selected and hovering above selected person bar
                    else if(active === "0" && active_link == activeName){
                        d3.select("#id" + wanted + "-" + activeName)
                        .style("cursor", "pointer")
                        .style("stroke", "purple")
                        .style("stroke-width", 1.3);

                        amount = d[1]-d[0];

                        tooltip
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                        .html(activeName + ": " + amount); 
                    }
                    //No Bar and one Person on legend selected and hovering above not selected person part
                    else if(active === "0" && active_link != activeName){

                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "default");
                        } 
                    }
                    //First one Bar and then one Person on legend selected and hovering above selected person part
                    else if(active == d.data.Year && active_link == activeName){

                        d3.select(this)
                        .style("cursor", "pointer");

                        amount = d[1]-d[0];
                        tooltip
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                        .html(activeName + ": " + amount); 
                    }
                    //First one Bar and then one Person on legend selected and hovering above not selected person part but on selected bar
                    else if(active == d.data.Year && active_link != activeName){
                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "default");
                        } 
                    }
                    //First one Bar and then one Person on legend selected but hovering above not selected bar and parts
                    else if(active != d.data.Year && active_link != activeName){
                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "default");
                        }
                    }
                    //First person on legend then one Bar selected and hovering above selected person part
                    else if(active_link == activeName && active == d.data.Year){
                        d3.select(this)
                        .style("cursor", "pointer");
                        
                        amount = d[1]-d[0];
                        tooltip
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                        .html(activeName + ": " + amount); 
                    }
                    //First person on legend then one Bar selected and hovering above not selected person part but on selected bar
                    else if(active_link != activeName && active == d.data.Year){
                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "default");
                        }
                    }
                    //First person on legend then one Bar selected but hovering above not selected bar or parts
                    else if(active_link != activeName && active != d.data.Year){
                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "default");
                        }
                    }
                    //First person on legend then one BAr selected but hovering above same name part but different year
                    else if(active_link == activeName && active != d.data.Year){
                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "default");
                        }
                    }
                })
                .on("mouseout", function (d){

                    if(active === "0" && active_link === "0"){

                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "none")
                            .style("stroke", "pink")
                            .style("stroke-width", 0.2);
                        }
                    }
                    else if(active === "0" && active_link == activeName){

                        for (j = 0; j < rectangleClassArray.length; j++){
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("cursor", "none")
                            .style("stroke", "pink")
                            .style("stroke-width", 0.2);
                        }
                    }

                    tooltip
                    .style("display","none");
                })
                .on("click", function(d){

                    //No Bar or Person on legend is selected
                    if (active === "0" && active_link === "0"){
                        barSelected = true;

                        for (j = 0; j < rectangleClassArray.length; j++) {
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("stroke", "black")
                            .style("stroke-width", 1.5);
                        }

                        active = d.data.Year;

                        for(j=0; j<yearArray.length; j++){
                            for(h=0; h<rectangleClassArray.length; h++){
                                if(yearArray[j]!=active){
                                    d3.select("#id" + yearArray[j] + "-" + rectangleClassArray[h])
                                    .style("opacity", 0.5);
                                }
                            }
                        }
                        document.getElementById("message_from_bar").innerHTML = d.data.Year;
                        document.getElementById("report_steps").innerHTML = version;
                        document.getElementById("message_from_bar").onchange();
                        // In "wanted" ist das Jahr und in "activeName" der eigene Name!
                    
                    }
                    //Bar is selected but no person on legend, clicking on selected part
                    else if (active === d.data.Year && active_link === "0"){
                        barSelected = false;

                        for (j = 0; j < rectangleClassArray.length; j++) {
                            d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                            .style("stroke", "none");
                        }

                        active = "0";

                        for(j=0; j<yearArray.length; j++){
                            for(h=0; h<rectangleClassArray.length; h++){
                                d3.select("#id" + yearArray[j] + "-" + rectangleClassArray[h])
                                .style("opacity", 1);
                            }
                        }
                        document.getElementById("message_from_bar").onchange();
                        
                    }
                    //No bar but person on legend is selected, clicking on part of bar of that person
                    else if(active === "0" && active_link == activeName){
                        barSelected = true;
                        d3.select(this)
                        .style("stroke", "black")
                        .style("stroke-width", 1.5);

                        for (j = 0; j < yearArray.length; j++) {
                            if(yearArray[j] != wanted){
                                d3.select("#id" + yearArray[j] + "-" + activeName)
                                .style("opacity", 0.5);
                            }
                        }
                        active = d.data.Year;

                        document.getElementById("message_from_bar").innerHTML = d.data.Year;
                        document.getElementById("report_steps").innerHTML = version;
                        document.getElementById("message_from_bar").onchange();

                        
                    }
                    //Bar and person on legend is selected, clicking on part of bar of that person
                    else if(active === d.data.Year && active_link == activeName){
                        barSelected = false;
                        d3.select(this)
                        .style("stroke", "none");

                        for (j = 0; j < yearArray.length; j++) {
                            if(yearArray[j] != wanted){
                                d3.select("#id" + yearArray[j] + "-" + activeName)
                                .style("opacity", 1);
                            }
                        }
                        active = "0";
                        document.getElementById("message_from_bar").onchange();
                    }
                })
                .on('dblclick', function(d, i){
                    d3.select(!this)
                        .attr('opacity', 0.5)
                        .attr('width', x.bandwidth - 100)
                    
                })
                
            /* --------- x-axis --------- */
            g.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height + ")")
                .attr("font-weight", "bold")        // Bold Years
                .call(d3.axisBottom(x));

            /* -------- Amount tag on the top left -------- */
            g.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y).ticks(null, "s"))
                .attr("font-weight", "bold")        // Bold y-axis
                .append("text")
                .attr("x", 2)       // Hight x-axis
                .attr("y", y(y.ticks().pop()) + 0.5)    // Hight y-axis
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")    // bold text
                .attr("text-anchor", "start")   // text position
                .text("Amount");    // Text

        /* --------- Legend in top right corner --------- */
        var legend = g.append("g")
            .attr("font-family", "sans-serif") // Schriftart
            .attr("font-size", 10)  // Schriftgröße
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            //------------- Add Class and fill legendClassArray-------------
            .attr("class", function (d) {
                legendClassArray.push(d); 
                return "legend";
            })
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legendClassArray = legendClassArray.reverse();

        legend.append("rect")  // Rectangles of legend
            .attr("x", width - 50)  
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z)
            //------------- Add Id-------------
            .attr("id", function (d) {
                return ("id" + d);
            })
            .on("mouseover", function(){ 
                if (active_link === "0"){
                    d3.select(this)
                    .style("stroke","purple")
                    .style("stroke-width",0.8)
                    .style("cursor", "pointer");
                }
            })
            .on("mouseout", function(){
                if (active_link === "0"){
                    d3.select(this)
                    .style("stroke","pink")
                    .style("stroke-width",0.2);
                }
            })
            .on("click", function(d){
                //No person on legend and no bar selected
                if(active_link === "0" && active === "0"){
                    legendSelected = true;
                    d3.select(this)           
                    .style("stroke", "black")
                    .style("stroke-width", 1);

                    active_link = this.id.split("id").pop();

                    erase(this);

                    for (i = 0; i < legendClassArray.length; i++){
                        if (legendClassArray[i] != active_link) {
                            d3.select("#id" + legendClassArray[i])
                            .style("opacity", 0.5);
                        }
                    }
                    document.getElementById("message_from_legend").innerHTML = active_link;
                    document.getElementById("message_from_legend").onchange();
                    
                }
                //Person on legend was selected but no bar
                else if(active_link === this.id.split("id").pop() && active === "0"){
                    legendSelected = false;
                    d3.select(this)           
                    .style("stroke", "none");

                    active_link = "0"; 

                    for (i = 0; i < legendClassArray.length; i++) {              
                        d3.select("#id" + legendClassArray[i])
                        .style("opacity", 1);
                    }

                    putBack(d);

                    //make other bars visible again
                    for (j = 0; j < yearArray.length; j++) {
                        for(h = 0; h < legendClassArray.length; h++){
                            d3.select("#id" + yearArray[j] + "-" + legendClassArray[h])
                            .transition()
                            .duration(1000)
                            //.delay(750)
                            .style("opacity", 1);
                        }
                    }

                    document.getElementById("message_from_legend").onchange();
                        
                }
                //No person on legend but person on bar was selected  
                else if(active_link === "0" && active != "0"){
                    legendSelected = true;
                    
                    d3.select(this)           
                    .style("stroke", "black")
                    .style("stroke-width", 1);

                    //Person
                    active_link = this.id.split("id").pop();

                    for (j = 0; j < legendClassArray.length; j++){
                        if (legendClassArray[j] != active_link) {
                            d3.select("#id" + legendClassArray[j])
                            .style("opacity", 0.5)
                            .style("cursor", "default");
                        }
                    }

                    for(j=0; j<legendClassArray.length; j++){
                        if(legendClassArray[j] != active_link){
                            d3.select("#id" + active + "-" + legendClassArray[j])
                            .style("cursor", "default")
                            .style("stroke", "pink")
                            .style("stroke-width", 0.2)
                            .style("opacity", 0.5);
                        }
                    }
                    document.getElementById("message_from_legend").innerHTML = active_link;
                    document.getElementById("message_from_legend").onchange();
                }
                //Person on legend and bar selected 
                else if(active_link == this.id.split("id").pop() && active != "0"){
                    legendSelected = false;

                    d3.select(this)           
                    .style("stroke", "none");

                    for (i = 0; i < legendClassArray.length; i++) {              
                        d3.select("#id" + legendClassArray[i])
                        .style("opacity", 1);
                    }

                    for(j=0; j<legendClassArray.length; j++){
                        if(legendClassArray[j] != active_link){
                            d3.select("#id" + active + "-" + legendClassArray[j])
                            .style("cursor", "pointer")
                            .style("stroke", "black")
                            .style("stroke-width", 1.5)
                            .style("opacity", 1);
                        }
                    }

                    active_link = "0";
                    document.getElementById("message_from_legend").onchange();
                }
                /*else if(active === "0" && active_link == this.id.split("id").pop()){
                    console.log("Here");
                }*/
            });

        legend.append("text") // Text of legends 
            .attr("x", width - 60)  // Same -x moves it closer to y-axis
            .attr("y", 9.5)         //The higher the x the farther down it goes (closer to x-axis)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });

        function erase(d){
            
            class_keep = d.id.split("id").pop();

            //Make all other bars less visible
            for (i = 0; i < legendClassArray.length; i++) {
                if (legendClassArray[i] != class_keep) {
                    d3.selectAll(".class" + legendClassArray[i])
                    .transition()
                    .duration(1000)          
                    .style("opacity", 0.5);
                }
            }
        } 

        function putBack(d){

            console.log("here2");

            //make other bars visible again
            for (j = 0; j < legendClassArray.length; j++) {
                //if (legendClassArray[j] != class_keep){
                    d3.selectAll(".class" + legendClassArray[j])
                    .transition()
                    .duration(1000)
                    //.delay(750)
                    .style("opacity", 1);
                //}
            }
        }
    });
}

//-------------------------- Call visualization with specified data ------------------------------
function init(version){

    bars("data/vis_data_5.csv", version);

    d3.select("#data1")
        .attr("font-family", "sans-serif") 
        .attr("font-size", 10)
        .text("Every year")
        .on("mouseover", function(d){
            d3.select(this)
            .style("opacity", 0.5)
            .style("cursor", "pointer");
        })
        .on("mouseout", function(d){
            d3.select(this)
            .style("opacity", 1);
        })
        .on("click", function(d,i) {
            d3.select("svg").selectAll("*").remove();
            bars("data/vis_data_1.csv", version);
        })

    d3.select("#data5")
        .attr("font-family", "sans-serif") 
        .attr("font-size", 10)
        .text("Every 5 years")
        .on("mouseover", function(d){
            d3.select(this)
            .style("opacity", 0.5)
            .style("cursor", "pointer");
        })
        .on("mouseout", function(d){
            d3.select(this)
            .style("opacity", 1);
        })
        .on("click", function(d,i) {
            d3.select("svg").selectAll("*").remove();
            bars("data/vis_data_1_all.csv", version);
        })

    /*if(version === 1){
        d3.select("svg").selectAll("*").remove();
        bars("data/vis_data_1.csv", version);
    }
    else if(version === 5){
        d3.select("svg").selectAll("*").remove();
        bars("data/vis_data_5.csv", version);
    }*/
}

//----------------------- Create the first wordcloud and the first small bars next to the years ----------------
function init_page(){
    document.getElementById("herr_made").innerHTML = "wunschpunsch";
    document.getElementById("herr_made").onchange();
    create_small_bars();
}

// ---------------- Code for small bars to show letter amount -----------------
function create_small_bars(){
    count_visible_letters();
    d3.select("div").selectAll("divchart").remove();
    var allBars = document.getElementsByClassName("spanYear");
    for(i = 0; i < allBars.length; i++){
        var id = allBars[i].id;
        small_bar(id);
    }
}

//---- creates the specific small bar, called from the for-Loop --------
function small_bar(id){

    var barYear = id.split("_")[1];
    var data = [visibleLetters[barYear]];

    var divs = d3.select("#"+id).selectAll("div")
    .data(data);

    var newdivs = d3.select("#"+id).selectAll("div")
    .data(data)
    .enter().append("div");

    divs = divs.merge(newdivs);

    var color = d3.scaleLinear()
    .domain([0, 300])
    .range(["powderblue", "midnightblue"]);
        
    divs.style("width", function(d) { return d + "px"; })
    .attr("class", "divchart")
    .style("background-color", function(d){ return color(d)})
    .text(function(d) { return d; });
}

//---- we need one main function to trigger a new cloud because otherwise it would be a recursive mess --------
function trigger_new_cloud(){
    Remove();
    word = document.getElementById("herr_made").innerHTML; //don't put "var" in front of word, it doesn't work, can't remember why though^^ 
    var year = document.getElementById("message_from_bar").innerHTML;
    var name = document.getElementById("message_from_legend").innerHTML;
    var steps = document.getElementById("report_steps").innerHTML;
    var current = document.getElementsByClassName("open");
    if(current.length > 1){ 
        //something is open
        var this_wc = current[current.length-1].id;
        var elements = this_wc.split("_"); //it's either "ul_<year>" or "ul_<name>_<year>"
        if(elements.length == 2){ //year is open, no person
            if(!barSelected || toggleWhileBarSelected){
                year = elements[1];
                steps = 1;
            }
            if(!legendSelected){
                name = 'whole';
            }
            console.log("Cloud: " + name, year, steps);
            selected_wordcloud(word, name, year, steps);
        }else{ //person is open
            if(!barSelected || toggleWhileBarSelected){
                year = elements[2];
                steps = 1;
            }
            if(!legendSelected){
                name = elements[1];
            }
            console.log("Cloud: " + name, year, steps);
            selected_wordcloud(word, name, year, steps);
        }
    }else{ //outside layer
        if(!barSelected){
            year = 1111;
            steps = 0;
        }
        if(!legendSelected){
            name = 'whole';
        }
        console.log("Cloud: " + name, year, steps);
        selected_wordcloud(word, name, year, steps);
    }
    show_corresponding_letters(word);
}

//------- toggle between opened and closed years and names in the List of Letters:
function toggle(id, name, year, steps){

    var requestOnPerson = false;
    var requestOnYear = false;
    
    if(name == 'whole'){
        requestOnPerson = false;
        requestOnYear = true;
    }else{
        requestOnPerson = true;
        requestOnYear = false;
    }

    ulElement = load_ul(id);
    imgElement = load_img(id);

    function load_ul(id){
        ul = "ul_" + id;
        return document.getElementById(ul);
    }

    function load_img(id){
        img = "img_" + id;
        return document.getElementById(img);
    }

    function change(element_id, toDo){
        if(barSelected){
            toggleWhileBarSelected = true;
        }else{
            toggleWhileBarSelected = false;
        }

        this_ulElement = load_ul(element_id);
        this_imgElement = load_img(element_id);

        if(toDo == "open"){
            this_ulElement.className = "open";
            this_imgElement.src = "opened.gif";
        }else{
            this_ulElement.className = "closed";
            this_imgElement.src = "closed.gif";
        }

        if(!wordClicked){
            document.getElementById("herr_made").innerHTML = "wunschpunsch";
            document.getElementById("herr_made").onchange();
        }else{
            document.getElementById("herr_made").innerHTML = clickedWord;
            document.getElementById("herr_made").onchange();
        }
    }

    if (ulElement){
        //open element
        if (ulElement.className == 'closed'){
            //to ensure only one year and max. one person is open at the same time:
            if(requestOnYear){
                if(!yearOpen){
                    yearOpen = true;
                    openYear = id;
                }else{
                    if(personOpen){
                        change(openPerson,"close");
                        personOpen = false;
                        openPerson = "";
                    }
                    change(openYear, "close");
                    yearOpen = true;
                    openYear = id;
                }
            }
            if(requestOnPerson){
                if(!personOpen){
                    personOpen = true;
                    openPerson = id;
                }else{
                    change(openPerson,"close");
                    personOpen = true;
                    openPerson = id;
                }
            }
            change(id,"open");
        //close
        }else{
            if(requestOnYear){
                if(personOpen){
                    change(openPerson,"close");
                    personOpen = false;
                    openPerson = "";
                }
                openYear = "";
                yearOpen = false;
            }
            if(requestOnPerson){
                openPerson = "";
                personOpen = false;
            }
            change(id,"close");
        }
    }
}

//------------- Load the letters --------------
function Load(clickedButton){
    Remove();
    var thisButton = document.getElementById(clickedButton);
    if(thisButton == loadedLetter){
        thisButton.style.color = "#000000";
        document.getElementById("herr_made").onchange();
    }else{
        thisButton.style.color = "#fd00ff";
        $("#LetterDiv").load("../../AllLetters/" + clickedButton + ".html");
    }
    loadedLetter = thisButton;
}

//-------- Remove previous text/Letters from the div ---------
function Remove(){
    $("#LetterDiv").empty();
    zingchart.exec("LetterDiv", "destroy");
}

//------------ callback functions to load JSON files ----------
function load_letter_Index(callback){
    var httpRequestURL = "data/word-letter_index2.json";
    var httpRequest = new XMLHttpRequest();
    httpRequest.onload = function(){
        callback(httpRequest.response);
    };
    httpRequest.open('GET', httpRequestURL);
    httpRequest.send();
}

function load_noun_frequencies(callback){
    var httpRequestURL = "data/noun_frequencies.json";
    var httpRequest = new XMLHttpRequest();
    httpRequest.onload = function(){
        callback(httpRequest.response);
    };
    httpRequest.open('GET', httpRequestURL);
    httpRequest.send();
}

//--- count all visible letters so the small bars can be adjusted and years/persons with no letters can be hidden ---
function count_visible_letters(){
    visibleLetters = {};
    visibleLettersPeople = {};
    var allButtons = document.getElementsByClassName("openLetterButton");
    for(i = 0; i < allButtons.length; i++){
        var thisButton = allButtons[i];
        var thisStyle = getStyle(thisButton, 'display');
        var letterYear = thisButton.id.split("_")[0];
        var letterName = thisButton.id.split("_")[1];
        if(thisStyle == "block"){
            //visibleLettersPeople = { year : {name:count, otherName:count,...}, otherYear : {name:count, otherName:count,...},...}
            if(visibleLettersPeople[letterYear] == undefined){
                visibleLettersPeople[letterYear] = {};
                visibleLettersPeople[letterYear][letterName] = 0;
            }
            if(visibleLettersPeople[letterYear][letterName] == undefined){
                visibleLettersPeople[letterYear][letterName] = 0;
            }
       
            else{
                visibleLettersPeople[letterYear][letterName] += 1;
            }
            if(visibleLetters[letterYear] == undefined){
                visibleLetters[letterYear] = 1;

            }else{
                visibleLetters[letterYear] += 1;
            }
             
        }else{ //add the invisible ones with counter 0 so they can later be matched for styling reasons
            if(visibleLettersPeople[letterYear] == undefined){
                visibleLettersPeople[letterYear] = {};
                visibleLettersPeople[letterYear][letterName] = 0;
            }
            if(visibleLettersPeople[letterYear][letterName] == undefined){
                visibleLettersPeople[letterYear][letterName] = 0;
            }
       
            if(visibleLetters[letterYear] == undefined){
                visibleLetters[letterYear] = 0;
            }
        }
    }
    // console.log(visibleLettersPeople);
}

//-------- help getting the CSS style for other functions ---------
function getStyle(element, style){
    var result;
    if(element.currentStyle){
        result = element.currentStyle(style);
    }else if(window.getComputedStyle){
        result = document.defaultView.getComputedStyle(element, null).getPropertyValue(style);
    }else{
        result = 'unknown';
    }
    return result;
}

//---------- highlight the selected word --------
function highlight_word(word){
    var allWCWords = document.getElementsByTagName("tspan");
    for(i = 0; i < allWCWords.length; i++){
        if(allWCWords[i].innerHTML == word){
            wordId = allWCWords[i].parentNode.id //+ "-path";
            document.getElementById(wordId).childNodes[0].style.fill = "#fd00ff"; //"#b81b34";
            //allWCWords[i].parentNode.style.backgroundColor = "#B6B6B6";
            break;
        }
    }
}

//----------- only show letters in list that match the selection (bar/legend/word) -----------
function show_corresponding_letters(word){
    //letterIndex contains an Index like this: {'Word1':[list of all letters containing Word1], 'Word2':[...],...}
    console.log("showing letters of " + word);
    return_to_normal();
    load_letter_Index(function(letterInd){
        var letterIndex = JSON.parse(letterInd);
        var allButtons = document.getElementsByClassName("openLetterButton");
        if(wordClicked){
            var letters = letterIndex[word];
            for(i = 0; i < allButtons.length; i++){
                for(j = 0; j < letters.length; j++){
                    var thisButton = allButtons[i]
                    thisButton.style.display ="none";
                    if(thisButton.id == letters[j]){
                        thisButton.style.display = "block";
                        break;
                    }
                }
            }
        }

        if(barSelected){       
            var year = document.getElementById("message_from_bar").innerHTML;
            var steps = document.getElementById("report_steps").innerHTML;
            for(i = 0; i < allButtons.length; i++){
                var thisButton = allButtons[i];
                var thisStyle = getStyle(thisButton, 'display');
                if(thisStyle == "block"){
                    if(!((thisButton.id.split("_")[0] >= year) && (thisButton.id.split("_")[0] < parseInt(year) + parseInt(steps)))){
                        thisButton.style.display ="none";
                    }
                }
            }
            console.log("in " + year + " with steps " + steps);    
        }
        if(legendSelected){        
            var name = document.getElementById("message_from_legend").innerHTML;
            for(i = 0; i < allButtons.length; i++){
                var thisButton = allButtons[i];
                var thisStyle = getStyle(thisButton, 'display');
                if(thisStyle == "block"){
                    if(thisButton.id.split("_")[1] != name){
                        thisButton.style.display ="none";
                    }
                }
            }
            console.log("from " + name);
        }
        create_small_bars();
        hide_empty_sections();
        
    });
}

//----------- hide a year or person if there is no letter left to show -------------
function hide_empty_sections(){
    //hide years and people in case they have no corresponding letters:
    var toggleYears = document.getElementsByClassName("toggle_year");
    var togglePeople = document.getElementsByClassName("toggle_person");
    var years = {};
    var people = {};
    var id;

    for(i = 0; i < togglePeople.length; i++){
        id = togglePeople[i].id.split("_");
        var name = id[0];
        var year = id[1];
        if(people[year] == undefined){
            people[year] = {};
        }
        people[year][name] = togglePeople[i];
    }
    for(var year in people){
        for(var name in people[year]){
            if(visibleLettersPeople[year][name] == 0){
                people[year][name].style.display = "none";
            }
        }
    }

    for(i = 0; i < toggleYears.length; i++){
        id = toggleYears[i].id.split("_");
        var year = id[1];
        years[year] = toggleYears[i];
    }
    for(var year in years){
        if (visibleLetters[year] == 0){
            years[year].style.display = "none";
        }
    }
}

 //---------- bring back all years and people -------------
function show_all_sections(){
    var toggleYears = document.getElementsByClassName("toggle_year");
    var togglePeople = document.getElementsByClassName("toggle_person");

    for(i = 0; i < togglePeople.length; i++){
        togglePeople[i].style.display = "block";
    }
    for(i = 0; i < toggleYears.length; i++){
        toggleYears[i].style.display = "block";  
    }
}

//----------- bring back all buttons ----------------
function all_buttons_visible(){
    var allButtons = document.getElementsByClassName("openLetterButton");
    for(i = 0; i < allButtons.length; i++){
        var thisButton = allButtons[i]
        thisButton.style.display ="block";
    }
}

//--------- After a word/bar/name is deselected: bring back all hidden elements -----------
function return_to_normal(){
    //bring back all the Letters
    all_buttons_visible();
    //update the small bars
    create_small_bars();
    show_all_sections();
}

//------------- create the wordclouds ---------------
// function create_wordcloud(name, year, steps){
function render_wordcloud(cloudData){

    count_visible_letters();

    myConfig = {
        type: 'wordcloud',
        options: {
            words : cloudData,
            minLength: 4,
            ignore: ['frau','leben'],
            maxItems: 50,
            aspect: 'spiral',
            rotate: false,
            colorType: 'palette',
            palette: ["#7b1fa2"],// "#512da8", "#283593", "#6a1b9a", "#0d47a1", "#1565c0", "#01579b", "#0288d1", "#0d47a1", "#6200ea", "#8e24aa"],
            //['#D32F2F','#1976D2','#9E9E9E','#E53935','#1E88E5','#7E57C2','#F44336','#2196F3','#A1887F'],
        
            style: {
                fontFamily: 'Marcellus SC',
                padding:"3px",
                
                hoverState: {
                    borderRadius: 10,
                    fontColor: 'grey'
                },
                tooltip: {
                    text: "'%text'\n tf-idf index: %hits \n Click me!",
                    visible: true,
                    alpha: 0.8,
                    backgroundColor: 'lightgrey',
                    borderColor: 'none',
                    borderRadius: 6,
                    fontColor: 'black',
                    fontFamily: 'Ubuntu Mono',
                    fontSize:18,
                    padding: 5,
                    textAlpha: 1,
                    wrapText: true
                }
            }
        }
    };
    
    zingchart.render({ 
        id: 'LetterDiv', 
        data: myConfig, 
        height: '100%', 
        width: '100%',
        autoResize: true
    });

    zingchart.bind('LetterDiv','label_click', function(p){
        var word = p.text;
        wordClicked = true;
        clickedWord = word;
        document.getElementById("herr_made").innerHTML = clickedWord;
        document.getElementById("herr_made").onchange();
    });
}

//------------ render the wordclouds in which one word is selected --------------
function render_selected_wordcloud(cloudData){
    var selectedConfig = myConfig;
    selectedConfig.options.words = cloudData;
    zingchart.render({
        id:'LetterDiv',
        data: selectedConfig,
        height:'100%',
        width:'100%',
        autoResize: true
    });
    
    highlight_word(word);
    
    zingchart.bind('LetterDiv','label_click', function(p){
        var selectedWord = p.text;
        //click on the same word = deselect
        if(selectedWord == word){
            wordClicked = false;
            clickedWord = "";
            document.getElementById("herr_made").innerHTML = "wunschpunsch";
            document.getElementById("herr_made").onchange();
        }else{ 
            //click on another word: that word gets selected
            wordClicked = true;
            clickedWord = selectedWord;
            document.getElementById("herr_made").innerHTML = selectedWord ;
            document.getElementById("herr_made").onchange();
        }  
    });
}

//---- create the wordclouds in which one word is selected -----------------
function selected_wordcloud(word, name, year, steps){
    // d_j: all currently open letters containing the selected Word W = toGet
    // D: Corpus (here: all currently open letters containing the selected Word W) = d_j = toGet
    // w_i: word the score is computed for
    // tf(w_i, d_j) = (# of w_i in d_j) / (total # of words in d_j) 
    //              = tf_data[key] / doc_length
    // idf(w_i, D)  = log[(# of CURRENTLY OPEN letters containing the selected word W) / (# of CURRENTLY OPEN letters containing w_i)] 
    //              = log(numberOfDocs / docs_containing_word[key]) 
    // tf-idf(w_i, d_j) = tf * idf

    var toGet = []; //all the letters that are currently open and are depicted in the wordcloud
    var tf_data = {}; //collect the frequencies of each word over all the letters
    var docs_containing_word = {}; //count how many documents contain each of the words
    var doc_length = 0; //total wordcount
    var numberOfDocs = 0; //number of docs containing the selected word
    var cloudData = [];
    var totalCount = [];

    //toGet is a list of the names of all the letters matching the requested word
    load_letter_Index(function(letterInd){
        var letterIndex = JSON.parse(letterInd); // {word1:[letter1, letter2 ,...], word2[letterx, lettery,...],...}
        var letters = letterIndex[word]; //List of all Letters containing the selected word

        for(i = 0; i < letters.length; i++){
            var parameters = letters[i].split("_"); //format letter: 'year_name_number'
            if(year == 1111){ //in this case we need all the letters
                toGet.push(letters[i]);
            }else if(name == 'whole'){ //all the letters from the open year
                if(parameters[0] == year){
                    toGet.push(letters[i]);
                }
            }else{ //year & person open -> year and person have to match
                if((parameters[0] == year) && (parameters[1] == name)){
                    toGet.push(letters[i]);
                }
            }
        }
        numberOfDocs = toGet.length;
        console.log(toGet);
        console.log("Number of Docs: " + numberOfDocs);
        
        load_noun_frequencies(function(noun_freq){
            var frequencies = JSON.parse(noun_freq); //{letter1:{noun1: x, noun2: y}, letter2:{...}, ...}

            //---- get the Data for the tf-score: -----
            //go through all the letters and all the nouns in it and compute the absolute number of
            //occurences of each noun in the data by adding up the frequencies
            for(i = 0; i < toGet.length; i++){
                var thisLetter = toGet[i];
                var noun_frequency = frequencies[thisLetter]; // map of all nouns which letter x contains
                for(var key in noun_frequency){ //iterate through all nouns of each letter
                    if(tf_data[key] === undefined){ 
                        tf_data[key] = noun_frequency[key]; //tf_data: Map of all nouns with their absolute number
                        docs_containing_word[key] = 1;
                    }else{
                        tf_data[key] += noun_frequency[key];
                        docs_containing_word[key] += 1;
                    }
                    doc_length += noun_frequency[key]; //sum of the number of words of all letters containing the word
                }
            }
            console.log("TF Data: ");
            console.log(tf_data);
            console.log("Gesamtwortzahl: " + doc_length);
            
            //------ compute tf-idf score on the fly (not sure if this is the right way though^^) -----
            for(var key in tf_data){
                // var idf_score = compute_idf_score(key);
                var tfIdf_scores = {};
                var idf_score = Math.log(numberOfDocs / docs_containing_word[key]);
                var tf_score = (tf_data[key]); // doc_length);

                tfIdf_scores[key] = (tf_score * idf_score);
                totalCount.push({"text":key, "count":tf_data[key]});
                cloudData.push({"text":key, "count":tfIdf_scores[key]});
                if(key == word){
                    console.log(word + " : " + tfIdf_scores[word]);
                }
            }
                
            console.log("Docs containing word: ");
            console.log(docs_containing_word);
            console.log(cloudData);
            if(word != "wunschpunsch"){
                //render_selected_wordcloud(cloudData);
                render_selected_wordcloud(totalCount);
            }else{
                //render_wordcloud(cloudData);
                render_wordcloud(totalCount);
            }
            
        });
    });
}


//---- create the wordclouds in which one word is selected -----------------
// function selected_wordcloud(word, name, year, steps){
//     //console.log("create cloud with " + word + name + year);
//     // var selectedText = [];
//     // if(year == 1111){
//     //     //load from file (faster and more accurate)
//     //     var selectedCloudDataURL = "data/noun_wc_data/" + word + ".json";
//     //     var selectedCloudDataRequest = new XMLHttpRequest();
//     //     selectedCloudDataRequest.open('GET', selectedCloudDataURL);
//     //     selectedCloudDataRequest.responseType = 'json';
//     //     selectedCloudDataRequest.send();
//     //     selectedCloudDataRequest.onload = function(){
//     //         selectedText = selectedCloudDataRequest.response;
//     //         render_selected_wordcloud(selectedText);
//     //     }

//     // }else{
//         //compute the tf-idf scores on the fly
//         var toGet = [];
//         var tf_data = {};
//         // var docs_containing_word = 0;
//         var docs_containing_word = {};
//         var cloudData = [];
//         var doc_length = 0;
//         var yearCountMap = {};
//         var personCountMap = {};
//         //var numberOfDocs = 1; //(1 to count the "open" part as well)
//         var numberOfDocs = 0;

//         //toGet is a list of the names of all the letters 
//         //that match the request
//         load_letter_Index(function(letterInd){
//             var letterIndex = JSON.parse(letterInd); // {word1:[letter1, letter2 ,...], word2[letterx, lettery,...],...}
//             var letters = letterIndex[word]; //List of all Letters containing that word
//             for(i = 0; i < letters.length; i++){
//                 var parameters = letters[i].split("_");
//                 if(year == 1111){
//                     toGet.push(letters[i]); //in this case we need all the letters
//                 }else if(name == 'whole'){ //all the letters from the open year
//                     if(parameters[0] == year){
//                         toGet.push(letters[i]);
//                     }else{ 
//                         //to compute the amount of other "documents" of the same "type" (all letters per year) in D
//                         if(yearCountMap[parameters[0]] == undefined){
//                             yearCountMap[parameters[0]] = [];
//                         }
//                         yearCountMap[parameters[0]].push(letters[i]);
                        
//                     }
//                 }else{ //year & person open -> year and person have to match
//                     if((parameters[0] == year) && (parameters[1] == name)){
//                         toGet.push(letters[i]);
//                     }else{
//                         // compute amount of "documents" in total (group them in year_person groups)
//                         if(personCountMap[parameters[0]] == undefined){
//                             personCountMap[parameters[0]] = {};
//                             personCountMap[parameters[0]][parameters[1]] = [letters[i]];
//                         }else if(personCountMap[parameters[0]][parameters[1]] == undefined){
//                             personCountMap[parameters[0]][parameters[1]] = [letters[i]];
//                         }else{
//                             personCountMap[parameters[0]][parameters[1]].push(letters[i]);
//                         }
//                     }
//                 }
//             }
//             //var doc_number = letters.length; // number of docs that contain the selected word
//             //numberOfDocs = letters.length;          
            
//             load_noun_frequencies(function(noun_freq){

//                 //---- function to compute the idf-part of the score
//                 function compute_idf_score(keyword){
//                     var docs_with_this_word = 0;
//                     if(year == 1111){
//                         docs_with_this_word = docs_containing_word[keyword];
//                     }else if(name == 'whole'){ //only a year is open
//                         for(var c_year in yearCountMap){
//                             var br = false;
//                             for(j = 0; j < yearCountMap[c_year].length; j++){
//                                 var nounMap = noun_frequencies[yearCountMap[c_year][j]];
//                                 for(var noun in nounMap){
//                                     if(noun == keyword){
//                                         docs_with_this_word += 1;
//                                         br = true;
//                                         break;
//                                     }
//                                 }
//                                 if(br){break;}
//                             }
//                         }
//                     }else{ //year & person open
//                         for(var c_year in personCountMap){
//                             for(var c_person in personCountMap[c_year]){
//                                 var br = false;
//                                 for(j = 0; j < personCountMap[c_year][c_person].length; j++){
//                                     var nounMap = noun_frequencies[personCountMap[c_year][c_person][j]];
//                                     for(var noun in nounMap){
//                                         if(noun == keyword){
//                                             docs_with_this_word += 1;
//                                             br = true;
//                                             break;
//                                         }
//                                     }
//                                     if(br){break;}
//                                 }
//                             }
//                         }
//                     }
//                     var score = Math.log(numberOfDocs / docs_with_this_word);
//                     console.log(score);
//                     return score;
//                 }

//                 var noun_frequencies = JSON.parse(noun_freq); //{letter1:{noun1: x, noun2: y}, letter2:{...}, ...}

//                 //get the number of "documents" in the set of docs containing the selected word
//                 if(year == 1111){
//                     numberOfDocs = letters.length;
//                 }else if(name == 'whole'){
//                     for(var key in yearCountMap){
//                         numberOfDocs += 1;
//                     }
//                 }else{
//                     for(var key in personCountMap){
//                         for(var otherKey in personCountMap[key]){
//                             numberOfDocs +=1;
//                         }
//                     }
//                 }

//                 //---- get the Data for the tf-score: -----
//                 //go through all the letters and all the nouns in it and compute the absolute number of
//                 //occurences of each noun in the data by adding up the frequencies
//                 for(i = 0; i < toGet.length; i++){
//                     var noun_frequency = noun_frequencies[toGet[i]]; // map of all nouns which letter x contains
//                     for(var key in noun_frequency){ //iterate through all nouns of each letter
//                         if(tf_data[key] == undefined){ 
//                             tf_data[key] = noun_frequency[key]; //tf_data: Map of all nouns with their absolute number

//                             for(i = 0; i < letters.length; i++){
//                                 var idf_nouns = noun_frequencies[letters[i]];
//                                 for(var noun_key in idf_nouns){
//                                     if(noun_key == key){
//                                         if (docs_containing_word[noun_key] == undefined){
//                                             docs_containing_word[noun_key] = 1;
//                                         }
//                                         else{
//                                             docs_containing_word[noun_key] += 1;
//                                         }
//                                         break;
//                                     }
//                                 }
//                             }
//                             // docs_containing_word[key] = 1;
                            
//                         }else{
//                             tf_data[key] += noun_frequency[key];
//                             // docs_containing_word[key] += 1;
//                         }
//                         doc_length += noun_frequency[key]; //sum of the number of words of all letters containing the selected word
//                     }
//                 }
                
//                 //------ compute tf-idf score on the fly (not sure if this is the right way though^^) -----
//                 for(var key in tf_data){
//                     var idf_score = compute_idf_score(key);
//                     //var idf_score = Math.log(numberOfDocs / docs_containing_word[key]);
//                     var tf_score = (tf_data[key] / doc_length);

//                     tf_data[key] = (tf_score * idf_score);
//                     cloudData.push({"text":key, "count":tf_data[key]});
//                 }
//                 render_selected_wordcloud(cloudData);
//             });
//         });
//     //}
// }