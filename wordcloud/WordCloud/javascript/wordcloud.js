function create_wordcloud(name, year, steps){
    // e.g.: "../json_cloud_data_tf-idf/CSchiller/0/CSchiller_0000_0.json";
    var requestURL = "../json_cloud_data_tf-idf/" + name + "/" + steps + "/" + name + "_" + year + "_" + steps + ".json";
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function(){
        var myText = request.response;

        var myConfig = {
            type: 'wordcloud',
            options: {
            words : myText,
            minLength: 4,
            ignore: ['establish','this'],
            maxItems: 50,
            aspect: 'spiral',
            rotate: false,
            
            colorType: 'palette',
            palette: ['#D32F2F','#1976D2','#9E9E9E','#E53935','#1E88E5','#7E57C2','#F44336','#2196F3','#A1887F'],
            
            style: {
                fontFamily: 'Merriweather',
                
                hoverState: {
                backgroundColor: '#1976D2',
                borderColor: 'none',
                borderRadius: 3,
                fontColor: 'white'
                },
                tooltip: {
                  text: "Wouldn't it be nice to show the corresponding letter here?",
                  visible: true,
                
                  alpha: 0.9,
                  backgroundColor: '#D32F2F',
                  borderColor: 'none',
                  borderRadius: 3,
                  fontColor: 'white',
                  fontFamily: 'Georgia',
                  padding: 5,
                  textAlpha: 1,
                  width: 400,
                  wrapText: true
                }
            }
            }
        };
        
        zingchart.render({ 
            id: 'wordcloud', 
            data: myConfig, 
            height: '100%', 
            width: '100%' 
        });
    }
}

