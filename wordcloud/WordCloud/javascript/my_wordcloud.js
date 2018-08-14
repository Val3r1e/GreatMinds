function create_wordcloud(name, year, steps){
    // e.g.: "../json_cloud_data_tf-idf/CSchiller/0/CSchiller_0000_0.json";
    var requestURL = "../json_cloud_data_tf-idf/" + name + "/" + steps + "/" + name + "_" + year + "_" + steps + ".json";
    var request = new XMLHttpRequest();
    var myLink = "https://github.com/Val3r1e/GreatMinds"
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
            labels:[{
                text:"Hello Sailor!",
                visible:true,
                x:"50%",
                y:"50%",
                backgroundColor:"blue #29A2CC",
                fontFamily:"Georgia",
                fontColor:"black",
                fontSize:14,
                height:"15%",
                width:"10%",
                borderRadius:"5px"
            }],
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
                        //width: 200,
                        //htmlMode:true,
                        
                        padding:"10%",
                        borderRadius: "5px",
                        visible: false,
                        sticky:true,
                        timeout:5000,
                        x:"1%",
                        y:"1%",
                        fontSize: 18,
                        backgroundColor: '#D32F2F',
                        text: '<div class="chart-tooltip">%text <br><a href="#">Click here for more info</a></div>',
                        //borderColor: 'none',
                        alpha: 0.8,
                        fontColor: 'white',
                        fontFamily: 'Georgia',
                        // distance:0,
                        // calloutWidth:6,
                        // calloutHeight:10,
                        // callout:true,
                        // calloutPosition:"bottom"
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

        function NodeLabel(hook, labelIndex) {
            return {
                   text: hook,
                   hook: hook,
                   fontColor: '#fff',
                   fontSize: 15,
                   padding:5,
                   offsetY: -35,
                   callout:true,
                   visible:true,
                   position: 'bottom',
                   backgroundColor: labelIndex == 0 ? '#2196f3': '#e91e63'
            }
          }
           
        // global array for NodeLabels since you can only update the whole array
        // var nodeLabelsArray = [];
        
        // // hash table for markers
        // var nodeLabelsHashTable = {};
        // // nodeLabelsHashTable['labelindex_0'] = {};
        // // nodeLabelsHashTable['labelindex_1'] = {};
        
        // /*
        // * Register a node_click event and then render a chart with the markers
        // */
        zingchart.bind('LetterDiv','label_click', function() {
            if(confirm("Show a list of all correspondig letters?")){
                txt = "And now for something completely different.";
                document.getElementById("LetterDiv").innerHTML = txt;
            }

        


        /*
            * example output: node:plot=2;index=9
            */
            // var labelHookString = 'label:index=' + e.labelindex;
            
            // // check hash table. Add marker
            // if (!nodeLabelsHashTable['labelindex_' + e.labelindex][e.labelid]) {
                
            //     // create a marker
            //     var newNodeLabel = new NodeLabel(labelHookString, e.labelindex);
            
            //     nodeLabelsHashTable['labelindex_' + e.labelindex][e.labelid] = true;
            //     nodeLabelsArray.push(newNodeLabel);
                
            //     // render the marker
            //     myConfig.labels = nodeLabelsArray;
            //     zingchart.exec('LetterDiv', 'setdata', {
            //         data: myConfig
            //     });
            // } 
        });

        // zingchart.label_click = function(p){
        //     var el = document.getElementsByClassName("chart-tooltip");
        //     if(el){
        //         for (var n = 0; n < el.length; n++){
        //             el[n].addEventListener('click', function(e){
        //                 zingchart.exec(p.id, 'locktooltip');

        //             });
        //             el[n].addEventListener('mouseout',function(e){
        //                 zingchart.exec(p.id, 'unlocktooltip');
        //             }); 
        //         }
        //     }
        // };
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

