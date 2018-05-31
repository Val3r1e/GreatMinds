import os
import sys
import json
from pprint import pprint
import csv
from collections import Counter
from collections import defaultdict
import collections

def intoCsv():
    
    rootdir = "Letters/"
    yearList = []

    key = ["Year"]
    value = ["Amount"]

    for subdirs, dirs, files in os.walk(rootdir):
        for file in files:
            if file.endswith('.json'):
                config = json.loads(open(os.path.join(subdirs, file)).read())

                if "Year" in config:
                    yearList.append(config["Year"])

    counter = Counter(yearList)
    pprint(counter)
    
    for x in counter:
        key.append(x)
        value.append(counter[x])

    csvList = list(zip(key,value))

    print(csvList)
    
    out = csv.writer(open("Try5.csv", "w", newline=""), quoting=csv.QUOTE_MINIMAL)
    out.writerows(csvList)
             
    

    #-----------------Second Version--------------------

    # rootdir = "Letters/CharlotteStein2/NewMetadata"
    # rootdir2 = "Letters/Schiller1/meta"
    # rootdir3 = "Letters/Schiller2/meta"
    

    # steinList = []
    # schillerList1 = []
    # schillerList2 = []

    # #-----Stein-----

    # for subdirs, dirs, files in os.walk(rootdir):
    #     for file in files:
    #         if file.endswith('.json'):
    #             config = json.loads(open(os.path.join(subdirs, file)).read())

    #             if "Year" in config:
    #                 steinList.append(config["Year"])

    # counter1 = Counter(steinList)
    # pprint(counter1)

    # #-----Schiller1-----

    # for subdirs, dirs, files in os.walk(rootdir2):
    #     for file in files:
    #         if file.endswith('.json'):
    #             config = json.loads(open(os.path.join(subdirs, file)).read())

    #             if "Year" in config:
    #                 schillerList1.append(config["Year"])

    # counter2 = Counter(schillerList1)
    # pprint(counter2)

    # #-----Schiller2-----

    # for subdirs, dirs, files in os.walk(rootdir3):
    #     for file in files:
    #         if file.endswith('.json'):
    #             config = json.loads(open(os.path.join(subdirs, file)).read())

    #             if "Year" in config:
    #                 schillerList2.append(config["Year"])

    # counter3 = Counter(schillerList2)
    # pprint(counter3)
                   
    # keys1 = ["YearStein"]
    # keys2 = ["YearSchiller1"]
    # keys3 = ["YearSchiller2"]
    # value1 = ["Stein"]
    # value2 = ["Schiller1"]
    # value3 = ["Schiller2"]


    # for x in counter1:
    #     keys1.append(x)
    #     value1.append(counter1[x])

    # for x in counter2:
    #     keys2.append(x)
    #     value2.append(counter2[x])

    # for x in counter3:
    #     keys3.append(x)
    #     value3.append(counter3[x])
    
    # csvList = list(zip(keys1,value1,keys2,value2,keys3,value3))
    # #csvList2 = list(zip(keys2,value2))

    # print(csvList)
    
    # out = csv.writer(open("Try4.csv", "w", newline=""), quoting=csv.QUOTE_MINIMAL)
    # out.writerows(csvList)

    #-----------------------Old Version-----------------------

    # steinList = []

    # for subdirs, dirs, files in os.walk(rootdir):
    #     for file in files:
    #         if file.endswith('.json'):
    #             config = json.loads(open(os.path.join(subdirs, file)).read())

    #             if "Year" in config:
    #                 steinList.append(config["Year"])

    # counter = Counter(steinList)
    # pprint(counter)
                   
    # keys = ["Year"]
    # values = ["Amount"]

    # for x in counter:
    #     keys.append(x)
    #     values.append(counter[x])

    
    # csvList = list(zip(keys, values))

    # print(csvList)
    
    # out = csv.writer(open("Try4.csv", "w", newline=""), quoting=csv.QUOTE_MINIMAL)
    # out.writerows(csvList)


    #pprint(listYear)


#------- Main -------

intoCsv()