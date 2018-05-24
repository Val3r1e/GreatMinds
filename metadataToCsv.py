import os
import sys
import json
from pprint import pprint
import csv
from collections import Counter

def countAll():
    rootdir = "Letters/CharlotteStein2/NewMetadata"

    yearList = []

    for subdirs, dirs, files in os.walk(rootdir):
        for file in files:
            if file.endswith('.json'):
                config = json.loads(open(os.path.join(subdirs, file)).read())

                if "Year" in config:
                    yearList.append(config["Year"])

    counter = Counter(yearList)
    pprint(counter)
                   
    keys = ["Year"]
    values = ["Amount"]

    for x in counter:
        keys.append(x)
        values.append(counter[x])
    
    csvList = list(zip(keys, values))

    print(csvList)
    
    out = csv.writer(open("Try4.csv", "w", newline=""), quoting=csv.QUOTE_MINIMAL)
    out.writerows(csvList)


    #pprint(listYear)


#------- Main -------

countAll()