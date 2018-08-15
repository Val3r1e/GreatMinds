//------- toggle between opened and closed years and names in the List of Letters:
function toggle(id, name, year, steps){
    ul = "ul_" + id;
    img = "img_" + id;
    ulElement = document.getElementById(ul);
    imgElement = document.getElementById(img);
    if (ulElement){
        if (ulElement.className == 'closed'){
            ulElement.className = "open";
            imgElement.src = "opened.gif";
            //Remove everything shown before and create the new wordcloud
            Remove();
            zingchart.exec('LetterDiv', 'destroy');
            create_wordcloud(name, year, steps);
        }else{
            ulElement.className = "closed";
            imgElement.src = "closed.gif";
            //Remove the letter/wordcloud and show the wordcloud from the previous level:
            Remove();
            zingchart.exec('LetterDiv', 'destroy');
            if (name == 'whole'){
                create_wordcloud(name, 1111, 0);
            }
            else{
                create_wordcloud('whole', year, steps);
            }
        }
    }
}

// ---------------- (Hopefully soon) Code for bars to show letter amount -----------------
function bar(i){

    var data = [i];

    var body = d3.select("body");

    var divs = body.selectAll("div")
    .data(data)
    .enter().append("div");
        
    var color = d3.scaleLinear()
    .domain([0, 300])
    .range(["powderblue", "midnightblue"]);
        
    divs.style("width", function(d) { return d + "px"; })
    .attr("class", "divchart")
    .style("background-color", function(d){ return color(d)})
    .text(function(d) { return d; });
}

//---------------- Just a try, won't stay! -------------------
function text(i){
    document.getElementById("try").innerHTML = "--Here should be a bar--";
}

//------------- Load the letters --------------
function Load(clickedButton){
    Remove();
    zingchart.exec("LetterDiv", "destroy");
    $("#LetterDiv").load("../../AllLetters/" + clickedButton + ".html")
}

//-------- Remove previous text/Letters from the div ---------
function Remove(){
    $("#LetterDiv").empty();
}

//------------- create the wordclouds ---------------
function create_wordcloud(name, year, steps){
    // e.g.: "json_cloud_data_tf-idf/CSchiller/0/CSchiller_0000_0.json";
    var requestURL = "json_cloud_data_tf-idf/" + name + "/" + steps + "/" + name + "_" + year + "_" + steps + ".json";
    var request = new XMLHttpRequest();
    // var myLink = "https://github.com/Val3r1e/GreatMinds"
    // var thisYear = get_year(year);
    // var thisName = get_name(name);
    
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function(){
        var myText = request.response;
        //console.log(myText);
        var myConfig = {
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
                palette: ["#7b1fa2", "#512da8", "#283593", "#6a1b9a", "#0d47a1", "#1565c0", "#01579b", "#0288d1", "#0d47a1", "#6200ea", "#8e24aa"],
                //['#D32F2F','#1976D2','#9E9E9E','#E53935','#1E88E5','#7E57C2','#F44336','#2196F3','#A1887F'],
            
                style: {
                    fontFamily: 'Marcellus SC',
                    padding:"5px",
                    
                    hoverState: {
                        //backgroundColor: '#D32F2F',
                        //borderColor: 'none',
                        //borderRadius: 10,
                        fontColor: 'grey'
                    },
                    tooltip: {
                        text: "%text\n tf-idf index: %hits \n Click on the word to show a list of corresponding letters",
                        visible: true,
                        alpha: 0.8,
                        //backgroundColor: '#1976D2',
                        borderColor: 'none',
                        borderRadius: 6,
                        fontColor: 'black',
                        fontFamily: 'Ubuntu Mono',
                        fontSize:18,
                        padding: 5,
                        textAlpha: 1,
                        wrapText: true
                    }
                    // tooltip: {
                    //     //width: 200,
                    //     //htmlMode:true,
                        
                    //     padding:"10%",
                    //     borderRadius: "5px",
                    //     visible: false,
                    //     sticky:true,
                    //     timeout:5000,
                    //     x:"1%",
                    //     y:"1%",
                    //     fontSize: 18,
                    //     backgroundColor: '#D32F2F',
                    //     text: '<div class="chart-tooltip">%text <br><a href="#">Click here for more info</a></div>',
                    //     //borderColor: 'none',
                    //     alpha: 0.8,
                    //     fontColor: 'white',
                    //     fontFamily: 'Georgia',
                    //     // distance:0,
                    //     // calloutWidth:6,
                    //     // calloutHeight:10,
                    //     // callout:true,
                    //     // calloutPosition:"bottom"
                    //     textAlpha: 1,
                    //     wrapText: true
                    // }
                }
            }
        };
        
        zingchart.render({ 
            id: 'LetterDiv', 
            data: myConfig, 
            height: '100%', 
            width: '100%'
        });

        zingchart.bind('LetterDiv','label_click', function(p) {
            //if(confirm("Show a list of all correspondig letters?")){
                headline = "<h2>And now for something completely different.</h2><br>";
                id = p.labelindex;
                txt = "<h3>The clicked label was label " + id + ".</h3><p>Albatros!</p>";
                // var labelText = myConfig.options.words;
                // console.log(labelText);
                document.getElementById("LetterDiv").innerHTML = headline + txt;
                zingchart.exec("LetterDiv", "destroy");
            //}
        });

    }

    //Just in case we manage to place the title in a place where it's readable:
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
}

