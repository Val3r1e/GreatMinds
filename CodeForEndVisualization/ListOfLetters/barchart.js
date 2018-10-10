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
var toggleWhileLegendSelected = false;
var legendSelected = false;
var loadedLetter;
var letterLoaded = false;
var loading;
var quoteCounter = 0;
var csvDataList = [];
var csvData_1;
var csvData_5;
var dataVersion; 
var deselectWord = false;
var firstLoad = true;
var clickedBar = 0;     //Braucht Jahr
var clickedPerson = 0;  //Braucht Name
var columns = ["Year", "FSchiller", "CSchiller", "CStein", "CGoethe"];

//-------------------- BARCHART -----------------------

//---------------------- only gets called once at the beginning never again after that!! -----------------------
function bars(data,version){

    d3.csv(data, function(d, i, columns){
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
    }, 

    function(error,data){
        if (error) throw error;
        daten(data,version);
    }); 
      
}

//----------------------- if you  want to call the visualization again with a different data set call this one with an Array (not cvs) ---------------------
function daten(data,version){

    dataVersion = version;

    // count_visible_letters();
    // var csvData = convertArrayOfObjectsToCSV(csvDataList);
    // console.log(csvData);

    var svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 85},
        width = 2000 - margin.left - margin.right,
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
        .range(["#8f97c4", "#7b1fa2", "#5c6bc0", "#9575cd"]);

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    var active_link = "0";
    var legendClassArray = [];
    var active = "0";
    var rectangleClassArray = ["FSchiller","CSchiller", "CStein", "CGoethe"];
    var yearArray = [];
    var wanted = "0";
    var activeName = "0";

    var keys = columns.slice(1);

        x.domain(data.map(function(d) { return d.Year; }));
        y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
        z.domain(keys);

        var rectangle = g.append("g")
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
            .attr("width", x.bandwidth()); // Width of bars -1 smaller +1 bigger etc

            if(clickedBar != 0){

                barSelected = true;

                for (j = 0; j < rectangleClassArray.length; j++) {
                    d3.select("#id" + clickedBar + "-" + rectangleClassArray[j])
                    .style("stroke", "black")
                    .style("stroke-width", 1.5);
                }

                active = clickedBar;

                for(j=0; j<yearArray.length; j++){
                    for(h=0; h<rectangleClassArray.length; h++){
                        if(yearArray[j]!=active){
                            d3.select("#id" + yearArray[j] + "-" + rectangleClassArray[h])
                            .style("opacity", 0.5);
                        }
                    }
                }
            }
            
            rectangle.on("mouseover", function (d) {

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
                        .style("stroke-width", 0.000001);
                    }
                }
                else if(active === "0" && active_link == activeName){

                    for (j = 0; j < rectangleClassArray.length; j++){
                        d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                        .style("cursor", "none")
                        .style("stroke", "pink")
                        .style("stroke-width", 0.000001);
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
                    clickedBar = active;

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
                else if (active === d.data.Year && active_link === "0" /*|| clickedBar === d.data.Year*/){
                    barSelected = false;
                    toggleWhileBarSelected = false;

                    for (j = 0; j < rectangleClassArray.length; j++) {
                        d3.select("#id" + wanted + "-" + rectangleClassArray[j])
                        .style("stroke", "none");
                    }

                    active = "0";
                    clickedBar = 0;

                    for(j=0; j<yearArray.length; j++){
                        for(h=0; h<rectangleClassArray.length; h++){
                            d3.select("#id" + yearArray[j] + "-" + rectangleClassArray[h])
                            .style("opacity", 1)
                            .attr("width", x.bandwidth())
                            .attr("x", function(d) {return x(d.data.Year);});
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
                    clickedBar = active;

                    document.getElementById("message_from_bar").innerHTML = d.data.Year;
                    document.getElementById("report_steps").innerHTML = version;
                    document.getElementById("message_from_bar").onchange();

                    
                }
                //Bar and person on legend is selected, clicking on part of bar of that person
                else if(active === d.data.Year && active_link == activeName){
                    barSelected = false;
                    toggleWhileBarSelected = false;
                    d3.select(this)
                    .style("stroke", "none");

                    for (j = 0; j < yearArray.length; j++) {
                        if(yearArray[j] != wanted){
                            d3.select("#id" + yearArray[j] + "-" + activeName)
                            .style("opacity", 1);
                        }
                    }
                    active = "0";
                    clickedBar = 0;
                    document.getElementById("message_from_bar").onchange();
                }
            })
            .on('dblclick', function(d) {
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
                                .style("opacity", 0.5)
                                .attr("width", x.bandwidth() / 1.5)
                                .attr("x", function(d) {
                                    if(yearArray[j] < wanted) {
                                        return x(d.data.Year) - 7;
                                    }
                                    else if(yearArray[j] > wanted) {
                                        return x(d.data.Year) + 10;
                                    }
                                });
                            }
                            else {
                                d3.select("#id" + yearArray[j] + "-" + rectangleClassArray[h])
                                .remove();
                                g.append("g").selectAll("rect")
                                    .data(d3.stack().keys(keys)(data))
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
                                    .attr("y", function(d) { return y(d[1]); })
                                    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                                    .attr("width", x.bandwidth());

                                //create_new_bars(wanted);

                                
                            }
                        }
                    }
                    document.getElementById("message_from_bar").innerHTML = d.data.Year;
                    document.getElementById("report_steps").innerHTML = version;
                    document.getElementById("message_from_bar").onchange();

                    
                    
                    
                }
            })

        //----------------------- NEW BARS ------------------------

        // ----- Code for small bars to show letter amount -----
        function create_new_bars(){
            count_visible_letters();
            d3.select("svg").selectAll("rect").remove();
            var allBars = document.getElementsByClassName("toggle_year");
            for(i = 0; i < allBars.length; i++){
                var id = allBars[i].id;
                g.append("g")
                    .data(d3.stack().keys(keys)(data))      // Stack function, stacks bars
                    .enter(new_bar(id)).append("g")
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
                    .attr("width", x.bandwidth());
            }
            
        }

        function new_bar(id){

            var barYear = id.split("_")[1];
            var data = [visibleLetters[barYear]];
        
            var divs = d3.select("#"+id).selectAll("svg")
            .data(data);
        
            var newdivs = d3.select("#"+id).selectAll("svg")
            .data(data)
            .enter().append("svg");
        
            divs = divs.merge(newdivs);
        
            var color = d3.scaleLinear()
            .domain([0, 300])
            .range(["powderblue", "midnightblue"]);
                
            divs.style("width", function(d) { return d + x.bandwidth; })
            .attr("class", "rect")
            .style("background-color", function(d){ return color(d)});
        }
            
        /* --------- x-axis --------- */
        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .attr("font-weight", "bold")        // Bold Years
            .call(d3.axisBottom(x))
            .attr("font-family", "Merriweather") // Schriftart
            .attr("font-size", 15);  // Schriftgröße;

        /* -------- Amount tag on the top left -------- */
        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .attr("font-weight", "bold")        // Bold y-axis
            .attr("font-family", "Merriweather") // Schriftart
            .attr("font-size", 15)  // Schriftgröße
            .append("text")
            .attr("x", 2)       // Hight x-axis
            .attr("y", y(y.ticks().pop()) + 0.5)    // Hight y-axis
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")    // bold text
            .attr("font-family", "Merriweather") // Schriftart
            .attr("font-size", 15)  // Schriftgröße
            .attr("text-anchor", "start")   // text position
            .text("Amount");    // Text

    /* --------- Legend in top right corner --------- */
    var legend = g.append("g")
        // .attr("font-family", "sans-serif") // Schriftart
        .attr("font-family", "Merriweather") // Schriftart
        .attr("font-size", 15)  // Schriftgröße
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
        .attr("transform", function(d, i) { return "translate(0," + i * 40 + ")"; });

    legendClassArray = legendClassArray.reverse();

    legend.append("rect")  // Rectangles of legend
        .attr("x", width - 50)  
        .attr("width", 30)
        .attr("height", 30)
        .attr("fill", z)
        //------------- Add Id-------------
        .attr("id", function (d) {
            return ("id" + d);
        })
        .on("mouseover", function(){ 
            if (active_link === "0" /*|| clickedPerson === this.id.split("id").pop()*/){
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
                clickedPerson = active_link;

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
                clickedPerson = active_link;

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
                clickedPerson = active_link;

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

                console.log("Here2");

                d3.select(this)           
                .style("stroke", "none");

                active_link = "0";
                clickedPerson = active_link;

                for (i = 0; i < legendClassArray.length; i++) {              
                    d3.select("#id" + legendClassArray[i])
                    .style("opacity", 1);
                }

                //-------------------------------------------------
                for(j=0; j<legendClassArray.length; j++){
                    if(legendClassArray[j] != active_link){
                        d3.select("#id" + active + "-" + legendClassArray[j])
                        .style("cursor", "pointer")
                        .style("stroke", "red")         //Stroke works for all, should be black
                        .style("stroke-width", 1.5)
                        .style("opacity", 1);           //Opacity doesn't work for some reason
                    }
                }

                document.getElementById("message_from_legend").onchange();
            }
        });

        //If new dataset is loaded but Person was selected bfore
        /*if(clickedPerson != "0"){
            legendSelected = true;
    
            console.log("in clicked person");

            active_link = clickedPerson;
    
            for (i = 0; i < legendClassArray.length; i++){
                if (legendClassArray[i] == clickedPerson) {
                    d3.select("#id" + legendClassArray[i])
                    .style("stroke", "black")
                    .style("stroke-width", 1);
                }
            }

            for (i = 0; i < legendClassArray.length; i++){
                if (legendClassArray[i] != active_link) {
                    d3.select("#id" + legendClassArray[i])
                    .style("opacity", 0.5);
                }
            }
    
            for (i = 0; i < legendClassArray.length; i++) {
                if (legendClassArray[i] != clickedPerson) {
                    d3.selectAll(".class" + legendClassArray[i])
                    .transition()
                    .duration(1000)          
                    .style("opacity", 0.5);
                }
            }
        }*/

    legend.append("text") // Text of legends 
        .attr("x", width - 60)  // Same -x moves it closer to y-axis
        .attr("y", 15)         //The higher the x the farther down it goes (closer to x-axis)
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

        //make other bars visible again
        for (j = 0; j < legendClassArray.length; j++) {
            if (legendClassArray[j] != class_keep){
                d3.selectAll(".class" + legendClassArray[j])
                .transition()
                .duration(1000)
                .style("opacity", 1);
            }
        }
    }
}

//-------------------------- Call visualization with specified data ------------------------------
function init(version){

    bars("data/vis_data_5.csv", 5);

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
            //daten(csvData_1,1);
            bars("data/vis_data_1.csv", 1);
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
            //bars("data/vis_data_1_all.csv", version);
            //daten(csvData_5,5);
            bars("data/vis_data_5.csv", 5);
        })
}

//----- Create the first wordcloud and the first small bars next to the years ------
function init_page(){
    document.getElementById("herr_made").innerHTML = "wunschpunsch";
    document.getElementById("herr_made").onchange();
}

//------------------------ LOADINGSCREEN ------------------

// ----- calculating the clouds and the list takes a while so here is a loading screen: -----------
function showListAndWC(){
    document.getElementById("loader").style.display = "none";
    document.getElementById("quote").style.display = "none";
    document.getElementById("quoteAuthor").style.display = "none";
    document.getElementById("LetterDiv").style.display = "block";
    document.getElementById("ButtonDiv").style.display = "block";

    if(firstLoad){
        init(5);
        firstLoad = false;
    }
}

function loadListAndWC(){
    newQuote();
    document.getElementById("loader").style.display = "block";
    document.getElementById("quote").style.display = "block";
    document.getElementById("quoteAuthor").style.display = "block";
    document.getElementById("LetterDiv").style.display = "none";
    document.getElementById("ButtonDiv").style.display = "none";
}

//------ some short quotes to make the waiting more pleasant (feel free to add some) --------
function newQuote(){
    quotes = ["Es hört doch jeder nur, was er versteht", "Mit dem Wissen wächst der Zweifel", "Die Welt urteilt nach dem Scheine",
              "Wo viel Licht ist, ist starker Schatten", "Es irrt der Mensch, solang er strebt", "Zur Resignation gehört Charakter",
              "Es nimmt der Augenblick, was Jahre geben", "Edel sei der Mensch, hilfreich und gut", "Glücklich allein ist die Seele, die liebt"];
    document.getElementById("quote").innerHTML = quotes[quoteCounter];
    quoteCounter = (quoteCounter + 1) % quotes.length;
}

//------------------------ SIDEBAR -----------------------

function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//---------- set title for sidebar --------------
function setTitle(word, name, year, steps){
    year = parseInt(year);
    steps = parseInt(steps);
    if(word == "wunschpunsch"){
        word = "";
    }else{
        word = "containing '" + capitalizeFirstLetter(word) + "'";
    }
    if(year == 1111){
        year = "All Letters <br>";
    }else{
        if(steps !=5){
            year = year + "<br>";
        }
    }
    if(name == 'whole'){
        name = ""
    }else{
        if(name == "FSchiller"){
            name = "Friedrich von Schiller<br>"
        }else if(name == "CGoethe"){
            name = "Christiane von Goethe<br>"
        }else if(name == "CSchiller"){
            name = "Charlotte von Schiller<br>"
        }else if(name == "CStein"){
            name = "Charlotte von Stein<br>"
        }
    }
    if(steps == 5){
        year = (year - 4) + " - " + year  + "<br>";
    }
    document.getElementById("WCTitle").innerHTML = name + year + word;
}

//--------- set the filter in the sidebar ------------
function setFilter(word, name, year, steps){
    // steps = parseInt(steps);
    // year = parseInt(year);

    if(word != "wunschpunsch"){
        word = capitalizeFirstLetter(word);
        // document.getElementById("filterhead").style.display = "block";
        document.getElementById("filtersub").style.display = "block";
        document.getElementById("filterword").innerHTML = word + "<span class='tooltiptext'>&nbsp;X&nbsp;</span>";
        document.getElementById("filterword").style.display = "block";
    }else{
        // document.getElementById("filterhead").style.display = "none";
        document.getElementById("filtersub").style.display = "none";
        document.getElementById("filterword").innerHTML = "";
        document.getElementById("filterword").style.display = "none";
    }
    // if(legendSelected && !toggleWhileLegendSelected){
    //     if(name != "whole"){
    //         document.getElementById("filtername").innerHTML = name + "<span class='tooltiptext'>&nbsp;X&nbsp;</span>";
    //         document.getElementById("filtername").style.display = "block";
    //     }else{
    //         document.getElementById("filtername").innerHTML = "";
    //         document.getElementById("filtername").style.display = "none";
    //     }
    // }
    
    // if(barSelected && !toggleWhileBarSelected){
    //     if(year != 1111){
    //         if(steps === 5){
    //             document.getElementById("filteryear").innerHTML = year + " - " + (year + 4) + "<span class='tooltiptext'>&nbsp;X&nbsp;</span>";
                
    //         }else{
    //             document.getElementById("filteryear").innerHTML = year + "<span class='tooltiptext'>&nbsp;X&nbsp;</span>";
    //         }
    //         document.getElementById("filteryear").style.display = "block";
    //     }else{
    //         document.getElementById("filteryear").innerHTML = "";
    //         document.getElementById("filteryear").style.display = "none";
    //     }
    // }
}

//-------- if a filter gets deselected in the sidebar -------------
function deselectFilter(clickedElement){
    wordClicked = false;
    deselectWord = true;
    clickedWord = "";
    document.getElementById("herr_made").innerHTML = "wunschpunsch";
    document.getElementById("herr_made").onchange();
    barchart_data("wunschpunsch");

    // ------- In case all the other stuff shoul be deselectable in the sidebar: -------
    // if(clickedElement == "filteryear"){
    //     barSelected = false;
    //     toggleWhileBarSelected = false;
    //     document.getElementById("filteryear").innerHTML = "";
    //     document.getElementById("filteryear").style.display = "none";
    // }
    // if(clickedElement == "filtername"){
    //     legendSelected = false;
    //     toggleWhileLegendSelected = false;
    //     document.getElementById("filtername").innerHTML = "";
    //     document.getElementById("filtername").style.display = "none";
    // }
    // if(clickedElement == "filterword"){
    //     wordClicked = false;
    //     deselectWord = true;
    //     clickedWord = "";
    //     document.getElementById("herr_made").innerHTML = "wunschpunsch";
    // }
    // document.getElementById("herr_made").onchange();
    // barchart_data("wunschpunsch");
    
}

//---------------------------------- MAIN -----------------------------------

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

    ulElement = load_ul_element(id);
    imgElement = load_img_element(id);

    if (ulElement){
        //for (de-)selecting the letters
        if(letterLoaded){
            loadedLetter.style.color = "#000000";
            loadedLetter = undefined;
            letterLoaded = false;
        }
        //open element
        if (ulElement.className == 'closed'){
            toggled = true;
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
                toggled = false;
                if(personOpen){
                    change(openPerson,"close");
                    personOpen = false;
                    openPerson = "";
                }
                openYear = "";
                yearOpen = false;
            }
            if(requestOnPerson){
                toggled = true;
                openPerson = "";
                personOpen = false;
            }
            change(id,"close");
        }
    }
}

//---- we need one main function to trigger a new cloud because otherwise it would be a recursive mess --------
function trigger_new_cloud(){

    loadListAndWC();
    loading = setTimeout(showListAndWC, 1500);

    remove_list();
    remove_cloud();
    
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
            if(!barSelected || toggleWhileBarSelected || (barSelected && toggled)){
                if(barSelected){
                    if((elements[1] >= year - 4) && (elements[1]) <= year){
                        year = elements[1];
                        steps = 1;
                    }else{
                        close_everyting();
                    }
                }else{
                    year = elements[1];
                    steps = 1;
                }
            }
            if(!legendSelected){
                name = 'whole';
            }
            wordcloud_data(word, name, year, steps);
        }else{ //person is open
            var nameStays = true;
            if(!barSelected || toggleWhileBarSelected || (barSelected && toggled)){
                if(barSelected){
                    if((elements[2] >= year - 4) && (elements[2]) <= year){
                        year = elements[2];
                        steps = 1;
                    }else{
                        nameStays = false;
                        name = 'whole';
                        close_everyting();
                    }
                }else{
                    year = elements[2];
                    steps = 1;
                }
            }
            else if(!barSelected || toggleWhileBarSelected){
                year = elements[2];
                steps = 1;
            }
            if(!legendSelected && nameStays){
                name = elements[1];
            }
            wordcloud_data(word, name, year, steps);
        }
    }else{ //outside layer
        if(!barSelected){
            year = 1111;
            steps = 0;
        }
        if(!legendSelected){
            name = 'whole';
        }
        wordcloud_data(word, name, year, steps);
    }
    //console.log("set parameters to "+ word +" "+ name +" "+ year +" "+ steps);
    setFilter(word, name, year, steps);
    show_corresponding_letters(word);
}

//-------------------------------- WORDCLOUDS ----------------------------------

function render_wordcloud(cloudData){

    myConfig = {
        type: 'wordcloud',
        options: {
            words : cloudData,
            minLength: 4,
            ignore: ['frau','leben', 'brief'],
            maxItems: 50,
            aspect: 'spiral',
            rotate: false,
            colorType: 'palette',
            palette: ["#7b1fa2"],// "#512da8", "#283593", "#6a1b9a", "#0d47a1", "#1565c0", "#01579b", "#0288d1", "#0d47a1", "#6200ea", "#8e24aa"],
            //['#D32F2F','#1976D2','#9E9E9E','#E53935','#1E88E5','#7E57C2','#F44336','#2196F3','#A1887F'],
        
            style: {
                fontFamily: 'Marcellus SC',
                padding:"3px",
                cursor: 'hand',
                
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
        barchart_data(word);
        wordClicked = true;
        deselectWord = false;
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
            barchart_data("wunschpunsch");
            deselectWord = true;
            wordClicked = false;
            clickedWord = "";
            document.getElementById("herr_made").innerHTML = "wunschpunsch";
            document.getElementById("herr_made").onchange();
        }else{ 
            barchart_data(selectedWord);
            //click on another word: that word gets selected
            wordClicked = true;
            deselectWord = false;
            clickedWord = selectedWord;
            document.getElementById("herr_made").innerHTML = selectedWord ;
            document.getElementById("herr_made").onchange();
        } 
    });
}

// ----------------------------- COMPUTE DATA ON THE FLY --------------------------

//---- compute tf-idf scores for the wordclouds in the fly -----------------
function wordcloud_data(word, name, year, steps){
    console.log("request on " + word +" "+ name +" "+ year +" "+ steps);
    setTitle(word, name, year, steps);
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
    //var totalCount = [];

    //toGet is a list of the names of all the letters matching the requested word
    load_letter_Index(function(letterInd){
        var letterIndex = JSON.parse(letterInd); // {word1:[letter1, letter2 ,...], word2[letterx, lettery,...],...}
        var letters = letterIndex[word]; //List of all Letters containing the selected word

        if(steps == 0){
            if(name == 'whole'){ //everything
                toGet = letters;
            }else{
                for(i = 0; i < letters.length; i++){
                    var letterName = letters[i].split("_")[1];
                    if(letterName == name){
                        toGet.push(letters[i]);
                    }
                }
            }
        }
        else if(steps == 1){
            for(i = 0; i < letters.length; i++){
                var letterYear = letters[i].split("_")[0];
                var letterName = letters[i].split("_")[1];
                if(name == 'whole'){ //all the letters from the open year
                    if(letterYear == year){
                        toGet.push(letters[i]);
                    }
                }else{ //year & person open -> year and person have to match
                    if((letterYear == year) && (letterName == name)){
                        toGet.push(letters[i]);
                    }
                }
            }
        }
        else if(steps == 5){
            for(i = 0; i < letters.length; i++){
                var letterYear = letters[i].split("_")[0];
                var letterName = letters[i].split("_")[1];
                if(name == 'whole'){
                    if((letterYear >= year - 4)&&(letterYear <=year)){
                        toGet.push(letters[i]);
                    }
                }else{
                    if((letterYear >= year - 4)&&(letterYear <=year) && (letterName == name)){
                        toGet.push(letters[i]);
                    }
                }
            }
        }
        
        numberOfDocs = toGet.length;
        // console.log(toGet);
        // console.log("Number of Docs: " + numberOfDocs);
        
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
            // console.log("TF Data: ");
            // console.log(tf_data);
            // console.log("Gesamtwortzahl: " + doc_length);
            
            //------ compute tf-idf score on the fly (not sure if this is the right way though^^) -----
            var tfIdf_scores = {};
            for(var key in tf_data){
                // var idf_score = compute_idf_score(key);
                
                var idf_score = Math.log(numberOfDocs / docs_containing_word[key]);
                var tf_score = (tf_data[key] / doc_length);

                tfIdf_scores[key] = (tf_score * idf_score);
                //totalCount.push({"text":key, "count":tf_data[key]});
                cloudData.push({"text":key, "count":tfIdf_scores[key]});
                // if(key == word){
                //     console.log(word + " : " + tfIdf_scores[word]);
                // }
            }
            if(wordClicked){
                //console.log(clickedWord, ": ", tfIdf_scores[clickedWord]);
            }
            
            // console.log("Docs containing word: ");
            // console.log(docs_containing_word);
            // console.log(cloudData);
            if(word != "wunschpunsch"){
                render_selected_wordcloud(cloudData);
                //render_selected_wordcloud(totalCount);
            }else{
                render_wordcloud(cloudData);
                //render_wordcloud(totalCount);
            }
            
        });
    });
}

// ------ computing the data for the barchart on the fly -----------
function barchart_data(word){

    var barChartLettters = {};

    load_letter_Index(function(letterInd){
        var letterIndex = JSON.parse(letterInd);
        var letters = letterIndex[word];
        for(var i = 0; i < letters.length; i++){
            var letterYear = letters[i].split("_")[0];
            var letterName = letters[i].split("_")[1];

            if(barChartLettters[letterYear] == undefined){
                barChartLettters[letterYear] = {};
                barChartLettters[letterYear][letterName] = 0;
            }
            if(barChartLettters[letterYear][letterName] == undefined){
                barChartLettters[letterYear][letterName] = 0;
            }else{
                barChartLettters[letterYear][letterName] += 1;
            }
        }
        csvDataList = [];
        csvData_1 = [];
        csvData_5 = [];
        keyYears = [1780, 1785, 1790, 1795, 1800, 1805, 1810, 1815, 1820];

        for(var key in barChartLettters){
            var tmpDict = {"Year":0, "FSchiller":0, "CSchiller":0, "CStein":0, "CGoethe":0, "total":0};
            tmpDict["Year"] = key;
            for(var nameKey in barChartLettters[key]){
                tmpDict[nameKey] = barChartLettters[key][nameKey];
            }
            tmpDict["total"] = tmpDict["FSchiller"] + tmpDict["CSchiller"] + tmpDict["CStein"] + tmpDict["CGoethe"];
            csvDataList.push(tmpDict);
        }
        csvData_1 = csvDataList;

        var tmpDict5 = {};
        for(i = 0; i < csvDataList.length; i++){
            for(var j = 0; j < keyYears.length; j++){
                if(tmpDict5[keyYears[j]] == undefined){
                    tmpDict5[keyYears[j]] = {"Year":keyYears[j], "FSchiller":0, "CSchiller":0, "CStein":0, "CGoethe":0, "total":0};
                }
                if(csvDataList[i]["Year"] <= keyYears[j]){
                    tmpDict5[keyYears[j]]["FSchiller"] += csvDataList[i]["FSchiller"];
                    tmpDict5[keyYears[j]]["CSchiller"] += csvDataList[i]["CSchiller"];
                    tmpDict5[keyYears[j]]["CStein"] += csvDataList[i]["CStein"];
                    tmpDict5[keyYears[j]]["CGoethe"] += csvDataList[i]["CGoethe"];
                    tmpDict5[keyYears[j]]["total"] += csvDataList[i]["total"];
                    break;
                }
            }
        }

        for(var key5Year in tmpDict5){
            csvData_5.push(tmpDict5[key5Year]);
        }
        // console.log(csvData_1);
        // console.log(csvData_5);

        if(dataVersion == 5){
            d3.select("svg").selectAll("*").remove();
            daten(csvData_5,5);
            console.log(clickedBar);
            console.log(clickedPerson);
        }
        else if(dataVersion == 1){
            d3.select("svg").selectAll("*").remove();
            daten(csvData_1,1);
        }

        //------------------------------ A lot of if's and else's to enable the clicking correctly --------------------------

        //When nothing is selected before and word is selected or deselected
        // if((!barSelected && wordClicked && !legendSelected) || (!barSelected && deselectWord && !legendSelected)){ 
            
        //     if(dataVersion == 5){
        //         d3.select("svg").selectAll("*").remove();
        //         daten(csvData_5,5);
        //     }
        //     else if(dataVersion == 1){
        //         d3.select("svg").selectAll("*").remove();
        //         daten(csvData_1,1);
        //     }

        // }
        // //When only bar is selected and you select or deselect a word  --> What should happen: data changes according to word but bar stays selected and other bars are still visible just not fully colored
        // else if((barSelected && wordClicked && !legendSelected) || (barSelected && deselectWord && !legendSelected)){

        // }
        // //Only person on legend is selected and you select or deselect a word  --> What should happen: data changes according to word but person says selected (on legend and bars) and other bars are still visible just grey
        // else if((!barSelected && wordClicked && legendSelected) || (!barSelected && deselectWord && legendSelected)){

        // }
        // //Bar and person on legend is selected and you select or deselect word --> What should happen: data changes but person and bar stay selected and other bars are still visible just grey
        // else if((barSelected && wordClicked && legendSelected) || (barSelected && deselectWord && legendSelected)){

        // }

    });        
}

// --------------------- LOADING AND REMOVING STUFF ---------------------

//------------- Load the letters --------------
function Load(clickedButton){
    letterLoaded = true;
    remove_cloud();
    remove_list();
    var thisButton = document.getElementById(clickedButton);
    console.log(thisButton);
    if(thisButton == loadedLetter){
        thisButton.style.color = "#000000";
        letterLoaded = false;
        document.getElementById("herr_made").onchange();
    }else{
        if(loadedLetter!= undefined){
            loadedLetter.style.color = "#000000";
        }
        loadedLetter = thisButton;
        // thisButton.style.color = "#8b0000"; //die sieht man gar nicht
        thisButton.style.color = "#a286d6";
        $("#LetterDiv").load("../../AllLetters/" + clickedButton + ".html");
    }
}

//-------- Remove previous List from the div ---------
function remove_list(){
    $("#LetterDiv").empty();
}

//-------- Remove previous List from the div ---------
function remove_cloud(){
    zingchart.exec("LetterDiv", "destroy");
}

//------- load elements for toggle functionn ---------
function load_ul_element(id){
    var ul = "ul_" + id;
    return document.getElementById(ul);
}

function load_img_element(id){
    var img = "img_" + id;
    return document.getElementById(img);
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

//----------------------- SMALL BARS ------------------------

// ----- Code for small bars to show letter amount -----
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

// ---------------------------- HELPERS -----------------------------
function close_everyting(){
    
    if(yearOpen){
        if(personOpen){
            Person_ulElement = load_ul_element(openPerson);
            Person_imgElement = load_img_element(openPerson);
            Person_ulElement.className = "closed";
            Person_imgElement.src = "closed.gif";
            personOpen = false;
            openPerson = "";
        }
        Year_ulElement = load_ul_element(openYear);
        Year_imgElement = load_img_element(openYear);
        Year_ulElement.className = "closed";
        Year_imgElement.src = "closed.gif";
        yearOpen = false;
        openYear = "";
    }

}
//---------------- open or close elements in the list, called from toggle ------------------
function change(element_id, toDo){
    if(barSelected){
        toggleWhileBarSelected = true;
    }else{
        toggleWhileBarSelected = false;
    }

    if(legendSelected){
        toggleWhileLegendSelected = true;
    }else{
        toggleWhileLegendSelected = false;
    }

    this_ulElement = load_ul_element(element_id);
    this_imgElement = load_img_element(element_id);

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
            wordId = allWCWords[i].parentNode.id;
            document.getElementById(wordId).childNodes[0].style.fill = "#fd00ff"; //"#b81b34";
            break;
        }
    }
}

//----------- only show letters in list that match the selection (bar/legend/word) -----------
function show_corresponding_letters(word){
    //letterIndex contains an Index like this: {'Word1':[list of all letters containing Word1], 'Word2':[...],...}
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
                    if(!((thisButton.id.split("_")[0] <= year) && (thisButton.id.split("_")[0] > parseInt(year) - parseInt(steps)))){
                        thisButton.style.display ="none";
                    }
                }
            }   
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

//--------- After a word/bar/name is deselected: bring back all hidden elements -----------
function return_to_normal(){
    all_buttons_visible();
    create_small_bars();
    show_all_sections();
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