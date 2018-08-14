function create_wordcloud(name, year, steps){
    // e.g.: "json_cloud_data_tf-idf/CSchiller/0/CSchiller_0000_0.json";
    var requestURL = "json_cloud_data_tf-idf/" + name + "/" + steps + "/" + name + "_" + year + "_" + steps + ".json";
    var request = new XMLHttpRequest();

    var thisYear = get_year(year);
    var thisName = get_name(name);

    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function(){
        var myText = request.response;
        console.log(myText);

        var myConfig = {
            type: 'wordcloud',
            title:{
                text: thisName + " " + thisYear,
                visible:true,
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
                palette: ['#D32F2F','#1976D2','#9E9E9E','#E53935','#1E88E5','#7E57C2','#F44336','#2196F3','#A1887F'],
            
                style: {
                    fontFamily: 'Merriweather',
                    padding:"4px",
                    
                    hoverState: {
                        backgroundColor: '#1976D2',
                        borderColor: 'none',
                        borderRadius: 10,
                        fontColor: 'white'
                    },
                    tooltip: {
                        text: "%text\n tf-idf index: %hits \n Click on the word to show a list with corresponding letters",
                        visible: true,
                        alpha: 0.8,
                        backgroundColor: '#D32F2F',
                        borderColor: 'none',
                        borderRadius: 3,
                        fontColor: 'white',
                        fontFamily: 'Georgia',
                        fontSize:16,
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

        zingchart.bind('LetterDiv','label_click', function() {
            if(confirm("Show a list of all correspondig letters?")){
                txt = "And now for something completely different.";
                document.getElementById("LetterDiv").innerHTML = txt;
            }
        });
    }
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
}

