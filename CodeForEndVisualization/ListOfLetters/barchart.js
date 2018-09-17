//-------------------------- Global Variables ------------------------------

var wordClicked = false;
//var clickedWords; //to remember, which word was clicked last, maybe for multiselect??
var clickedWord = "";
var wordId;
var myConfig;
var yearOpen = false;
var personOpen = false;
var openYear;
var openPerson;
var visibleLetters;
var visibleLettersPeople;
var barSelected = false; //to be able to return to the wordcloud shown before you clicked on something
var legendSelected = false; 
var selectedPerson = 'whole';
var selectedYear;
var wcBeforeBarSelected;
var wcBeforeLegendSelected;
var wcBeforeWordSelected;
var currentWC;


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
                        barSelected = true; //Why do we need this??

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

                        //'whole' is just a placeholder until we figure out how to get the actual name:
                        // Mit rectangleClassArray[a] solltest du eigentlich auf den jeweiligen Namen zugreifen können
                        // In "wanted" ist das Jahr und in "activeName" der eigene Name!
                        if(!wordClicked){
                            Remove();
                            create_wordcloud(activeName, d.data.Year, version);
                        }
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

                        if(!wordClicked){
                            Remove();
                            create_wordcloud(wcBeforeBarSelected[0], wcBeforeBarSelected[1], wcBeforeBarSelected[2]);

                        }
                    }
                    //No bar but person on legend is selected, clicking on part of bar of that person
                    else if(active === "0" && active_link == activeName){
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
                    }
                    //Bar and person on legend is selected, clicking on part of bar of that person
                    else if(active === d.data.Year && active_link == activeName){
                        d3.select(this)
                        .style("stroke", "none");

                        for (j = 0; j < yearArray.length; j++) {
                            if(yearArray[j] != wanted){
                                d3.select("#id" + yearArray[j] + "-" + activeName)
                                .style("opacity", 1);
                            }
                        }

                        active = "0";
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
                    if(!wordClicked){
                        Remove();
                        var my_name_here = this.id.split("id").pop();
                        selectedPerson = my_name_here;
                        console.log(my_name_here);
                        show_letters_from(my_name_here);
                        create_wordcloud(my_name_here, 1111, 0) //creates the wordcloud of the person over all the letters
                    }
                    
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

                    if(!wordClicked){
                        selectedPerson = 'whole';
                        Remove();
                        show_letters_from('whole');
                        create_wordcloud(wcBeforeLegendSelected[0], wcBeforeLegendSelected[1], wcBeforeLegendSelected[2]);
                    }
                }
                //No person on legend but person on bar was selected  
                else if(active_link === "0" && active != "0"){
                    
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
                }
                //Person on legend and bar selected 
                else if(active_link == this.id.split("id").pop() && active != "0"){

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
                }
                else if(active === "0" && active_link == this.id.split("id").pop()){
                    console.log("Here");
                }
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

            //make other bars visible again
            for (i = 0; i < legendClassArray.length; i++) {
                if (legendClassArray[i] != class_keep){
                    d3.selectAll(".class" + legendClassArray[i])
                    .transition()
                    .duration(1000)
                    //.delay(750)
                    .style("opacity", 1);
                }
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
            bars("data/vis_data_5.csv", version);
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
function init_page(name, year, steps){
    //currentWC = [name, year, steps];
    create_wordcloud(name, year, steps);
    create_small_bars();
}

// ---------------- Code for small bars to show letter amount -----------------
function create_small_bars(){
    count_visible_letters();
    //console.log(visibleLetters);
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

function trigger_new_cloud(){
    Remove();
    word = document.getElementById("herr_made").innerHTML;
    var current = document.getElementsByClassName("open");
    if(current.length > 1){ 
        //something is open
        var this_wc = current[current.length-1].id;
        var elements = this_wc.split("_"); //it's either "ul_year" or "ul_name_year"
        if(elements.length == 2){
            //year is open, no person
            if(word != "Wunschpunsch"){
                selected_wordcloud(word, 'whole', elements[1], 1);
            }else{
                create_wordcloud('whole', elements[1], 1);
            }
        }else{
            //person is open
            if(word != "Wunschpunsch"){
                selected_wordcloud(word, elements[1], elements[2], 1);
            }else{
                create_wordcloud(elements[1], elements[2], 1);
            }
        }
    }else{
        //Wordcloud of everything
        if(word != "Wunschpunsch"){
            selected_wordcloud(word, 'whole', 1111, 0);
        }else{
            create_wordcloud('whole', 1111, 0);
        }   
        //--- alternative way to get the current wordcloud: ----
        //create_wordcloud(currentWC[0],currentWC[1], currentWC[2]);
        
    }
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

    if(selectedPerson != 'whole'){
        name = selectedPerson;
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

    function open(element_id){
        this_ulElement = load_ul(element_id);
        this_imgElement = load_img(element_id);
        this_ulElement.className = "open";
        this_imgElement.src = "opened.gif";
        if(!wordClicked){
            // currentWC = [name, year, steps];
            // Remove();
            // create_wordcloud(name, year, steps);
            document.getElementById("herr_made").innerHTML = "Wunschpunsch";
            document.getElementById("herr_made").onchange();
        }else{
            //currentWC = [name, year, steps];
            // Remove();
            // selected_wordcloud(clickedWord);
            document.getElementById("herr_made").innerHTML = clickedWord;
            document.getElementById("herr_made").onchange();
        }
    }

    function close(element_id){
        this_ulElement = load_ul(element_id);
        this_imgElement = load_img(element_id);
        this_ulElement.className = "closed";
        this_imgElement.src = "closed.gif";
        if(requestOnPerson){ //Request to close a person
            //currentWC = ['whole', year, steps];
            if(!wordClicked){
                // Remove();
                // create_wordcloud(currentWC[0], currentWC[1], currentWC[2]);
                document.getElementById("herr_made").innerHTML = "Wunschpunsch";
                document.getElementById("herr_made").onchange();
            }else{
                // Remove();
                // selected_wordcloud(clickedWord);
                document.getElementById("herr_made").innerHTML = clickedWord;
                document.getElementById("herr_made").onchange();
            }
        }else{ //meaning: it's a request to close a year
            //currentWC = [name, 1111, 0];
            if(!wordClicked){
                // Remove();
                // create_wordcloud(name, 1111, 0);
                document.getElementById("herr_made").innerHTML = "Wunschpunsch";
                document.getElementById("herr_made").onchange();
            }else{
                // Remove();
                // selected_wordcloud(clickedWord);
                document.getElementById("herr_made").innerHTML = clickedWord;
                document.getElementById("herr_made").onchange();
            }
        }
    }

    if (ulElement){
        //open
        if (ulElement.className == 'closed'){
            //to ensure, only one year and max. one person is open at the same time:
            if(requestOnYear){
                if(!yearOpen){
                    yearOpen = true;
                    openYear = id;
                }else{
                    if(personOpen){
                        close(openPerson);
                        personOpen = false;
                        openPerson = "";
                    }
                    close(openYear);
                    yearOpen = true;
                    openYear = id;
                }
            }
            if(requestOnPerson){
                if(!personOpen){
                    personOpen = true;
                    openPerson = id;
                }else{
                    close(openPerson);
                    personOpen = true;
                    openPerson = id;
                }
            }
            open(id);
        //close
        }else{
            if(requestOnYear){
                openPerson = "";
                personOpen = false;
                openYear = "";
                yearOpen = false;
            }
            if(requestOnPerson){
                openPerson = "";
                personOpen = false;
            }
            close(id);
        }
    }
}

//------------- Load the letters --------------
function Load(clickedButton){
    Remove();
    $("#LetterDiv").load("../../AllLetters/" + clickedButton + ".html")
}

//-------- Remove previous text/Letters from the div ---------
function Remove(){
    $("#LetterDiv").empty();
    zingchart.exec("LetterDiv", "destroy");
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

//-------- help to get the CSS style for another function ---------
function getStyle(element, style){
    var result;
    if(element.currentStyle){
        result = element.currentStyle(style);
    }else if(window.getComputedStyle){
        result = document.defaultView.getComputedStyle(element, null).getPropertyValue(style);

    }else{
        result = 'unknown';
    }
    //console.log(result);
    return result;
}

//---------- highlight the selected word, highlighting the background doesn't work --------
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
        //document.getElementById(wordId).style.fill = "#f394f4";
}

//-------- if a name in the legend gets selected ------------
function show_letters_from(name){
    var allButtons = document.getElementsByClassName("openLetterButton");
    if(name == 'whole'){
        for(i = 0; i < allButtons.length; i++){
            var thisButton = allButtons[i];
            thisButton.style.display ="block";
        }
        return_to_normal();
    }else{
        for(i = 0; i < allButtons.length; i++){
            var thisButton = allButtons[i];
            thisButton.style.display ="none";
            if(thisButton.id.split("_")[1] == name){
                thisButton.style.display = "block";
            }
        }
        create_small_bars();
        hide_empty_sections();
    }
}

//----------- only show corresponding letters in list -----------
function show_corresponding_letters(word){
    var letterIndexURL = "../../wordcloud/Text/wordindex/word-letter_index.json";
    var letterIndexRequest = new XMLHttpRequest();
    letterIndexRequest.open('GET', letterIndexURL);
    letterIndexRequest.responseType = 'json';
    letterIndexRequest.send();
    letterIndexRequest.onload = function(){
        //letterIndex contains an Index like this: {'Word1':[list of all letters containing Word1], 'Word2':[...],...}
        var letterIndex = letterIndexRequest.response;

        var letters = letterIndex[word];
        var allButtons = document.getElementsByClassName("openLetterButton");
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
        create_small_bars();
        hide_empty_sections();
    }

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

//--------- After a word is deselected: bring back all hidden elements -----------
function return_to_normal(){
    //bring back all the Letters
    var allButtons = document.getElementsByClassName("openLetterButton");
    for(i = 0; i < allButtons.length; i++){
        var thisButton = allButtons[i]
        thisButton.style.display ="block";
    }
    //update the small bars
    create_small_bars();
    show_all_sections();
}

//------------- create the wordclouds ---------------
function create_wordcloud(name, year, steps){
    // var thisName = get_name(name);
    // var thisYear = get_year(year);
    //console.log(name, year, steps);
    count_visible_letters();

    var cloudDataURL = "data/cloud_data_tf-idf/" + name + "/" + steps + "/" + name + "_" + year + "_" + steps + ".json";
    var cloudDataRequest = new XMLHttpRequest();
    cloudDataRequest.open('GET', cloudDataURL);
    cloudDataRequest.responseType = 'json';
    cloudDataRequest.send();
    cloudDataRequest.onload = function(){
        var myText = cloudDataRequest.response;
        myConfig = {
            type: 'wordcloud',
            // title:{
            //     text: thisName + " " + thisYear,
            //     visible:false,
            //     width:150, 
            //     height: 50,
            //     paddingBottom: "20px",
            //     margin:"20px"
            // },
            options: {
                words : myText,
                minLength: 4,
                ignore: ['frau','leben'],
                maxItems: 50,
                aspect: 'spiral',
                rotate: false,
                
                colorType: 'palette',
                palette: ["#7b1fa2"],// "#512da8", "#283593", "#6a1b9a", "#0d47a1", "#1565c0", "#01579b", "#0288d1", "#0d47a1", "#6200ea", "#8e24aa"],
                //['#D32F2F','#1976D2','#9E9E9E','#E53935','#1E88E5','#7E57C2','#F44336','#2196F3','#A1887F'],
            
                style: {
                    // backgroundColor: '#24F211',
                    // borderRadius: 10,
                    fontFamily: 'Marcellus SC',
                    padding:"3px",
                    
                    hoverState: {
                        //backgroundColor: 'lightgrey',
                        //borderColor: 'none',
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
            width: '100%'
        });

        // In order to return to wordclouds shown before you selected something:
        if(!legendSelected){
            wcBeforeLegendSelected = [name, year, steps];
        }
        if(!barSelected){
            wcBeforeBarSelected = [name, year, steps];
        }
        //wcBeforeWordSelected = [name, year, steps]; //to remember the whole wc in case only one word is selected

        zingchart.bind('LetterDiv','label_click', function(p){
            var word = p.text;
            wordClicked = true;
            clickedWord = word;
            document.getElementById("herr_made").innerHTML = clickedWord;
            document.getElementById("herr_made").onchange();
        });
    }
}

//------------ render the wordclouds in which one word is selected --------------
function render_selected_wordcloud(cloudData){
    var selectedConfig = myConfig;
    selectedConfig.options.words = cloudData;
    zingchart.render({
        id:'LetterDiv',
        data: selectedConfig,
        height:'100%',
        width:'100%'
    });
    
    highlight_word(word);
    show_corresponding_letters(word);
    
    zingchart.bind('LetterDiv','label_click', function(p){
        var selectedWord = p.text;
        //click on the same word = deselect
        if(selectedWord == word){
            wordClicked = false;
            clickedWord = "";
            return_to_normal();
            //trigger the new cloud instead of calling it here
            //to avoid recursion
            document.getElementById("herr_made").innerHTML = "Wunschpunsch";
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
    //console.log("create cloud with " + word + name + year);
    // var selectedText = [];
    // if(year == 1111){
    //     //load from file (faster and more accurate)
    //     var selectedCloudDataURL = "data/noun_wc_data/" + word + ".json";
    //     var selectedCloudDataRequest = new XMLHttpRequest();
    //     selectedCloudDataRequest.open('GET', selectedCloudDataURL);
    //     selectedCloudDataRequest.responseType = 'json';
    //     selectedCloudDataRequest.send();
    //     selectedCloudDataRequest.onload = function(){
    //         selectedText = selectedCloudDataRequest.response;
    //         render_selected_wordcloud(selectedText);
    //     }

    // }else{
        //compute the tf-idf scores on the fly
        var toGet = [];
        var data = {};
        var words = {};
        var cloudData = [];

        function load_letter_Index(callback){
            var httpRequestURL = "data/word-letter_index.json";
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

        //toGet is a list of the names of all the letters 
        //that match the request
        load_letter_Index(function(letterInd){
            var letterIndex = JSON.parse(letterInd);
            var letters = letterIndex[word];
            for(i = 0; i < letters.length; i++){
                var parameters = letters[i].split("_");
                if(year == 1111){
                    toGet.push(letters[i]);
                }else if(name == 'whole'){
                    if(parameters[0] == year){
                        toGet.push(letters[i]);
                    }
                }else{
                    if((parameters[0] == year) && (parameters[1] == name)){
                        toGet.push(letters[i]);
                    }
                }
            }
           
            //noun_frequ is a map of {letter1:{noun1:x, noun2: y}, letter2:{...}, ...}
            load_noun_frequencies(function(noun_freq){
                var noun_frequencies = JSON.parse(noun_freq);
                for(i = 0; i < toGet.length; i++){
                    var noun_frequency = noun_frequencies[toGet[i]];
                    //add up all the frequencies of all letters per noun:
                    for(var key in noun_frequency){
                        if(data[key] == undefined){
                            data[key] = noun_frequency[key];
                            words[key] = 1;
                        }else{
                            data[key] += noun_frequency[key];
                            words[key] += 1;
                        }
                    }
                }
                //divide each sum by the number of letters the word is occuring in
                //and create the data for the wordcloud
                for(var key in data){
                    data[key] = (data[key] / words[key]);
                    cloudData.push({"text":key, "count":data[key]});
                }
                render_selected_wordcloud(cloudData);
            });
        });
    //}
}

// --------------------- END ----------------------- END ------------------------ END ------------------------
// (But maybe I still need the rest, so please don't delete it for now :))

//---------------- show only the selected word (we are not supposed to use it but I like^^) --------------------
function single_word_wc(word){
    Remove();
    var singleConfig = myConfig;
    delete singleConfig.options.words;
    singleConfig.options.text = word;
    singleConfig.options.style.fontSize = 40;
    singleConfig.options.style.tooltip.text = "'%text' \n Click to return\nto Wordcloud"
    zingchart.render({ 
        id: 'LetterDiv', 
        data: singleConfig, 
        height: '100%', 
        width: '100%'
    });

    zingchart.bind('LetterDiv','label_click', function(p){

        var letterIndexURL = "../../wordcloud/Text/wordindex/word-letter_index.json";
        var letterIndexRequest = new XMLHttpRequest();
        letterIndexRequest.open('GET', letterIndexURL);
        letterIndexRequest.responseType = 'json';
        letterIndexRequest.send();
        letterIndexRequest.onload = function(){
            //return to normal
            wordClicked = false;
            clickedWord = "";
            Remove();
            create_wordcloud(wcBeforeWordSelected[0], wcBeforeWordSelected[1], wcBeforeWordSelected[2]);
            //make all letters visible again:
            var letterIndex = letterIndexRequest.response;
            //var letters = letterIndex[word];
            var allButtons = document.getElementsByClassName("openLetterButton");
            for(i = 0; i < allButtons.length; i++){
                var thisButton = allButtons[i]
                thisButton.style.display ="block";
            }
            create_small_bars();
            //bring back all years and people:
            var toggleYears = document.getElementsByClassName("toggle_year");
            var togglePeople = document.getElementsByClassName("toggle_person");

            for(i = 0; i < togglePeople.length; i++){
                togglePeople[i].style.display = "block";
            }

            for(i = 0; i < toggleYears.length; i++){
                toggleYears[i].style.display = "block";
                
            }
        }
    });
}



//-------------- Just in case we manage to place the title in a place where it's readable: ----------
function get_year(year){
    if (year == "1111"){
        var thisYear = "";
    }else{
        var thisYear = year;
    }
    return thisYear;
}

function get_name(name){
    var names = {"whole": "Everyone","CSchiller":"Charlotte von Schiller", "CGoethe":"Christiane Goethe", "FSchiller": "Friedrich Schiller", "CStein": "Charlotte von Stein"};
    var thisName = "unknown";
    for(i in names){
        if (name == i){
            thisName = names[i];
        }
    }
    return thisName;
}

function set_title(name, year){
    if (year == "1111"){
        var thisYear = "";
    }else{
        var thisYear = year;
    }
    var names = {"whole": "Everyone","CSchiller":"Charlotte von Schiller", "CGoethe":"Christiane Goethe", "FSchiller": "Friedrich Schiller", "CStein": "Charlotte von Stein"};
    var thisName = "unknown";
    for(i in names){
        if (name == i){
            thisName = names[i];
        }
    }
    document.getElementById("LetterTitle").innerHTML = thisName + " " + thisYear;
}