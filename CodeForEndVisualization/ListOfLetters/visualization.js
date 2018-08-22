var wordClicked = false;
//var clickedWords; //to remember, which word was clicked last, maybe for multiselect??
var clickedWord = "";
var myConfig;
var currentWordcloud;
// var id_names = ["CStein", "CSchiller", "CGoethe", "FSchiller"];
var yearOpen = false;
var personOpen = false;
var openYear;
var openPerson;
var visibleLetters;

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
    console.log("Create Wordcloud");
    Remove();
    var thisName = get_name(name);
    var thisYear = get_year(year);

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
        
        currentWordcloud = [name, year, steps]; //to remember the whole wc in case only one word is selected

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
                        thisButton.style.display ="none"
                        if(thisButton.id == letters[j]){
                            thisButton.style.display = "block";
                            break;
                        }
                    }
                }
                }
        });
    }
}

//---------------- show only the selected word --------------------
function single_word_wc(word){
    console.log("Singe WC");
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
            create_wordcloud(currentWordcloud[0], currentWordcloud[1], currentWordcloud[2]);
            //make all letters visible again:
            var letterIndex = letterIndexRequest.response;
            //var letters = letterIndex[word];
            var allButtons = document.getElementsByClassName("openLetterButton");
                for(i = 0; i < allButtons.length; i++){
                    //for(j = 0; j < letters.length; j++){
                        var thisButton = allButtons[i]
                        // console.log(thisButton);
                        thisButton.style.display ="block";
                        //visibleLetters[((thisButton.id).split("_"))[0]] = counter;
                    //}
                }
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