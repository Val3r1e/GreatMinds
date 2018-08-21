
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
        //Old color style
        //d3.scaleOrdinal(d3.schemeCategory10);

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    var active_link = "0";
    var legendClassArray = [];
    var rectangleClassArray = [];

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

            l = 0;
            g.append("g")
                .selectAll("g")
                .data(d3.stack().keys(keys)(data))      // Stack function, stacks bars
                .enter().append("g")
                .attr("fill", function(d,i){ return z(i); })     // Coloring the bars, z-axis
                .selectAll("rect")
                .data(function(d) { return d;})
                .enter().append("rect")
                .attr("x", function(d) { return x(d.data.Year); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth()) // Width of bars -1 smaller +1 bigger etc
                .attr("class", function(d){
                    classLabel = d.name;
                    return "class" + classLabel;
                })
                .on("mouseover", function(d){ 
                    d3.select(this)
                    .style("cursor", "pointer")
                    .attr("stroke","purple")
                    .attr("stroke-width",0.8);
                    //.style("opacity", 0.5);

                    var amount = d[1] - d[0];
                    tooltip
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(d.data.Year + ": " + amount);
                })
                .on("mouseout", function(d){
                    d3.select(this)
                    .attr("stroke","pink")
                    .attr("stroke-width",0.2);
                    //.style("opacity", 1);

                    tooltip
                    .style("display","none");
                })
                .on("click", function(d){ 
                    d3.select(this)
                    .style("stroke", "black")
                    .style("stroke-width", 1.5);
                    if(version === 5){
                        version = 1;
                        init(version);
                    }
                    if(version === 1){
                        version = 5;
                        init(version);
                    }
                });
                
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
            .attr("id", function (d, i) {
                console.log("id" + d);
                return ("id" + d);
            })
            .on("mouseover", function(d){ 
                d3.select(this)
                .attr("stroke","purple")
                .attr("stroke-width",0.8)
                .style("cursor", "pointer");
                
            })
            .on("mouseout", function(d){
                d3.select(this)
                .attr("stroke","pink")
                .attr("stroke-width",0.2);
                //.style("cursor", "auto");
            })
            .on("click", function(d){
                if (active_link === "0"){
                    d3.select(this)           
                    .style("stroke", "black")
                    .style("stroke-width", 1);

                    active_link = this.id.split("id").pop();
                    plotSingle(this);

                    for (i = 0; i < legendClassArray.length; i++) {
                        if (legendClassArray[i] != active_link) {
                            d3.select("#id" + legendClassArray[i])
                            .style("opacity", 0.5);
                        }
                    }
                }
                else if (active_link === this.id.split("id").pop()) {
                    d3.select(this)           
                    .style("stroke", "none");

                    active_link = "0"; 

                    for (i = 0; i < legendClassArray.length; i++) {              
                        d3.select("#id" + legendClassArray[i])
                        .style("opacity", 1);
                    }
                }
            });

        legend.append("text") // Text of legends 
            .attr("x", width - 60)  // Same -x moves it closer to y-axis
            .attr("y", 9.5)         //The higher the x the farther down it goes (closer to x-axis)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });

        function plotSingle(d) {
            
            class_keep = d.id.split("id").pop();
            idx = legendClassArray.indexOf(class_keep);    

            for (i = 0; i < legendClassArray.length; i++) {
                if (legendClassArray[i] != class_keep) {
                    d3.selectAll(".class" + legendClassArray[i])
                    .transition()
                    .duration(1000)          
                    .style("opacity", 0.5);
                }
            }
        } 
    });
}

function init(version){

    bars("data/vis_data_5.csv",5);

    if(version === 1){
        //d3.select("svg").selectAll("*").remove();
        bars("data/vis_data_1.csv",version);
    }
    else if(version === 5){
        //d3.select("svg").selectAll("*").remove();
        bars("data/vis_data_5.csv",version);
    }

    d3.select("#data1")
    .on("click", function(d,i){
        version = 1;
        d3.select("svg").selectAll("*").remove();
        bars("data/vis_data_1.csv",version);
    })

    d3.select("#data5")
    .on("click", function(d,i){
        version = 5;
        d3.select("svg").selectAll("*").remove();
        bars("data/vis_data_5.csv",version);
    })
}