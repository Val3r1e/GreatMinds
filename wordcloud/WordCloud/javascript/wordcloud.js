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
            create_wordcloud(name, year, steps);
        }else{
            ulElement.className = "closed";
            imgElement.src = "closed.gif";
            //Remove the letter/wordcloud and show the wordcloud from the previous level:
            Remove();
            if (name == 'whole'){
                create_wordcloud(name, 1111, 0);
            }
            else{
                create_wordcloud('whole', year, steps);
            }
        }
    }
}

// ---------------- Code for bars to show letter amount -----------------
function bar(i,id){

    var data = [i];
  
    //var body = d3.select("body");

    var divs = d3.select("#"+id).selectAll("div")
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
    $("#LetterDiv").load("../../AllLetters/" + clickedButton + ".html")
}

//-------- Remove previous text/Letters from the div ---------
function Remove(){
    $("#LetterDiv").empty();
    zingchart.exec("LetterDiv", "destroy");
}

//------------- create the wordclouds ---------------
function create_wordcloud(name, year, steps){
    var cloudDataURL = "cloud_data_tf-idf/" + name + "/" + steps + "/" + name + "_" + year + "_" + steps + ".json";
    var wordURL = "../../wordcloud/Text/wordindex/word-letter_index.json";

    var thisYear = get_year(year);
    var thisName = get_name(name);

    var cloudDataRequest = new XMLHttpRequest();
    cloudDataRequest.open('GET', cloudDataURL);
    cloudDataRequest.responseType = 'json';
    cloudDataRequest.send();
    cloudDataRequest.onload = function(){
        var myText = cloudDataRequest.response;
        var myConfig = {
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
                        text: "%text\n tf-idf index: %hits \n Click on the word to show a list of corresponding letters",
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

        function get_word(id){
            return myText[id].text;
        }

        zingchart.bind('LetterDiv','label_click', function(p) {
                var wordRequest = new XMLHttpRequest();
                wordRequest.open('GET', wordURL);
                wordRequest.responseType = 'json';
                wordRequest.send();
                wordRequest.onload = function(){
                    var allWords = wordRequest.response;
                    var id = p.labelindex;
                    var word = get_word(id);
                    console.log(word);
                    var letters = allWords[word];
                    var visible_letters = {};
                    for (i = 0; i < letters.length; i){
                        visible_letters[letters[i]] = false;
                    console.log(visible_letters);
                    // var allButtons = document.getElementsByClassName("openLetterButton")
                    // for(i = 0; i < allButtons.length; i++){
                    //     for(j = 0; j < letters.length; j){
                    //         if(allButtons[i].id == letters[j]){
                    //             console.log(allButtons[i].id);
                    //         }
                    //     }
                    // }
                    // txt = "<h3>You clicked on '" + word + "'</h3>"+
                    //     "<h4>With ID " + id + "</h4>";
                    // document.getElementById("LetterDiv").innerHTML = txt;
                    //zingchart.exec("LetterDiv", "destroy");
            }
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

