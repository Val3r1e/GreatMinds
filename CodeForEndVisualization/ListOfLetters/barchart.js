//-------------------------- Global Variables ------------------------------

var wordClicked = false;
//var clickedWords; //to remember, which word was clicked last, maybe for multiselect??
var clickedWord = "";
var myConfig;
var yearOpen = false;
var personOpen = false;
var openYear;
var openPerson;
var visibleLetters;
var visibleLettersPeople;
var barSelected = false; //to be able to return to the wordcloud shown before you clicked on something
var legendSelected = false; 
var wcBeforeBarSelected;
var wcBeforeLegendSelected;
var wcBeforeWordSelected;


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
                    yearArray.push(d.data.Year);
                    //console.log("id" + d.data.Year + "-" + rectangleClassArray[i])
                    return ("id" + d.data.Year + "-" + rectangleClassArray[i]);
                })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth()) // Width of bars -1 smaller +1 bigger etc
                .on("mouseover", function (d, i) {

                    wanted = this.id.split("id").pop();
                    wanted = wanted.slice(0, 4);
                    console.log(wanted);

                    for (j = 0; j < rectangleClassArray.length; j++) {
                        if (yearArray[i] === wanted) {
                            console.log(j);
                            console.log(rectangleClassArray[j]);
                            console.log("#id" + yearArray[i] + "-" + rectangleClassArray[j]);
                            console.log(d3.select("#id" + yearArray[i] + "-" + rectangleClassArray[j]));
                            d3.select("#id" + yearArray[i] + "-" + rectangleClassArray[j])
                                .style("cursor", "pointer")
                                .attr("stroke", "purple")
                                .attr("stroke-width", 0.8);
                        }
                    }

                    d3.select(this)
                        .style("cursor", "pointer")
                        .attr("stroke", "purple")
                        .attr("stroke-width", 0.8);

                    var amount = d[1] - d[0];

                    tooltip
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                        .html(d.data.Year + ": " + amount);
                })
                .on("mouseout", function (d, i) {
                    for (j = 0; j < rectangleClassArray.length; j++) {
                        console.log(j);
                        console.log(rectangleClassArray[j]);
                        console.log("#id" + yearArray[i] + "-" + rectangleClassArray[j]);
                        console.log(d3.select("#id" + yearArray[i] + "-" + rectangleClassArray[j]));
                        d3.select("#id" + yearArray[i] + "-" + rectangleClassArray[j])
                            .style("cursor", "none")
                            .attr("stroke", "pink")
                            .attr("stroke-width", 0.2);
                    }
                    tooltip
                    .style("display","none");
                })
                .on("click", function(d,i){
                    //nothing was selected before
                    if (active === "0"){
                        barSelected = true;
                        d3.select(this)
                        .style("stroke", "black")
                        .style("stroke-width", 1.5);
                        active = d.data.Year;
                        //'whole' is just a placeholder until we figure out how to get the actual name:
                        create_wordcloud('whole', d.data.Year, version);
                    }
                    //to deselect: same one clicked again
                    else if (active === d.data.Year){
                        barSelected = false;
                        d3.select(this)           
                        .style("stroke", "none");
                        active = "0";
                        create_wordcloud(wcBeforeBarSelected[0], wcBeforeBarSelected[1], wcBeforeBarSelected[2]);
                    }
                })
                /*.on("dblclick", function(d){ 
                    d3.select(this)
                    .style("stroke", "black")
                    .style("stroke-width", 1.5);
                    if(version === 5){
                        version = 1;
                        init(version);
                    }
                    else if(version === 1){
                        version = 5;
                        init(version);
                    }
                    tooltip
                    .style("display","none");
                    
                });*/
                
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
            })
            .on("click", function(d){
                //nothing was selected before
                if (active_link === "0"){
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
                    create_wordcloud(this.id.split("id").pop(), 1111, 0) //creates the wordcloud of the person over all the letters
                }
                //to deselect: click the same one again
                else if (active_link === this.id.split("id").pop()){
                    legendSelected = false;
                    d3.select(this)           
                    .style("stroke", "none");

                    active_link = "0"; 

                    for (i = 0; i < legendClassArray.length; i++) {              
                        d3.select("#id" + legendClassArray[i])
                        .style("opacity", 1);
                    }

                    putBack(d);
                    create_wordcloud(wcBeforeLegendSelected[0], wcBeforeLegendSelected[1], wcBeforeLegendSelected[2]);
                }
            });

        legend.append("text") // Text of legends 
            .attr("x", width - 60)  // Same -x moves it closer to y-axis
            .attr("y", 9.5)         //The higher the x the farther down it goes (closer to x-axis)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });

        function erase(d){
            
            class_keep = d.id.split("id").pop();
            idx = legendClassArray.indexOf(class_keep); 
            
            //Give selected bars black frame
            for (i = 0; i < legendClassArray.length; i++) {
                if (legendClassArray[i] == class_keep) {
                    d3.selectAll(".class" + legendClassArray[i])
                    .style("stroke", "black")
                    .style("stroke-width", 1);
                }
            }

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

            //take black frame away
            for (i = 0; i < legendClassArray.length; i++) {
                if (legendClassArray[i] == class_keep) {
                    d3.selectAll(".class" + legendClassArray[i])
                    .style("stroke", "none");
                }
            }

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
    create_wordcloud(name, year, steps);
    create_small_bars();
}


// ---------------- Code for small bars to show letter amount -----------------
function create_small_bars(){
    count_visible_letters();
    console.log(visibleLetters);
    d3.select("div").selectAll("divchart").remove();
    var allBars = document.getElementsByClassName("spanYear");
    for(i = 0; i < allBars.length; i++){
        var id = allBars[i].id;
        small_bar(id);
    }
}

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

    function open(element_id){
        this_ulElement = load_ul(element_id);
        this_imgElement = load_img(element_id);
        this_ulElement.className = "open";
        this_imgElement.src = "opened.gif";
        if(!wordClicked){
            //if no word selected: create normal wc
            create_wordcloud(name, year, steps);
        }else{
            //if one word selected: only show selected word
            single_word_wc(clickedWord); 
        }
    }

    function close(element_id){
        this_ulElement = load_ul(element_id);
        this_imgElement = load_img(element_id);
        this_ulElement.className = "closed";
        this_imgElement.src = "closed.gif";
        if(!wordClicked){
            if (name == 'whole'){
                create_wordcloud(name, 1111, 0);
            }
            else{
                create_wordcloud('whole', year, steps);
            }
        }else{
            single_word_wc(clickedWord);
        }
    }

    if (ulElement){
        //open
        if (ulElement.className == 'closed'){
            //to ensure, only one year and max one person is open at the same time:
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

//------------- create the wordclouds ---------------
function create_wordcloud(name, year, steps){
    Remove();
    var thisName = get_name(name);
    var thisYear = get_year(year);

    count_visible_letters();

    var cloudDataURL = "cloud_data_tf-idf/" + name + "/" + steps + "/" + name + "_" + year + "_" + steps + ".json";
    var cloudDataRequest = new XMLHttpRequest();
    cloudDataRequest.open('GET', cloudDataURL);
    cloudDataRequest.responseType = 'json';
    cloudDataRequest.send();
    cloudDataRequest.onload = function(){
        var myText = cloudDataRequest.response;
        myConfig = {
            type: 'wordcloud',
            title:{
                text: thisName + " " + thisYear,
                visible:false,
                width:150, 
                height: 50,
                paddingBottom: "20px",
                margin:"20px"
            },
            options: {
                words : myText,
                minLength: 4,
                ignore: ['frau','leben'],
                maxItems: 50,
                aspect: 'spiral',
                rotate: false,
                
                colorType: 'palette',
                palette: ["#7b1fa2", "#512da8", "#283593", "#6a1b9a", "#0d47a1", "#1565c0", "#01579b", "#0288d1", "#0d47a1", "#6200ea", "#8e24aa"],
                //['#D32F2F','#1976D2','#9E9E9E','#E53935','#1E88E5','#7E57C2','#F44336','#2196F3','#A1887F'],
            
                style: {
                    fontFamily: 'Marcellus SC',
                    padding:"3px",
                    
                    hoverState: {
                        //backgroundColor: 'lightgrey',
                        //borderColor: 'none',
                        borderRadius: 10,
                        fontColor: 'grey'
                    },
                    tooltip: {
                        text: "'%text'\n tf-idf index: %hits \n Click to show a list\nof corresponding letters",
                        visible: true,
                        alpha: 0.8,
                        backgroundColor: 'lightgrey',
                        //backgroundColor: 'none',
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

        wcBeforeWordSelected = [name, year, steps]; //to remember the whole wc in case only one word is selected
        

        zingchart.bind('LetterDiv','label_click', function(p){
        
            var letterIndexURL = "../../wordcloud/Text/wordindex/word-letter_index.json";
            var letterIndexRequest = new XMLHttpRequest();
            letterIndexRequest.open('GET', letterIndexURL);
            letterIndexRequest.responseType = 'json';
            letterIndexRequest.send();
            letterIndexRequest.onload = function(){
                //letterIndex contains an Index like this: {'Word1':[list of all letters containing Word1], 'Word2':[...],...}
                var letterIndex = letterIndexRequest.response;
                var word = p.text;
                wordClicked = true;
                clickedWord = word;

                //show selected word instead of wordcloud:
                single_word_wc(clickedWord);
                
                //show only corresponding letters in list:
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
        });
    }
}

//---------------- show only the selected word --------------------
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