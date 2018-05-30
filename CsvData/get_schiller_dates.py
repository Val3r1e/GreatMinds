import os
import sys
import json
import csv
from pprint import pprint
from collections import Counter
import collections 

''' python3 get_dates.py "../ignore/letters/" '''

def getData(rootdir):
    """gets the year and the date from the metadatafiles (.json files)"""

    dates = []
    years = []

    for subdir, dirs, files in os.walk(rootdir):
        for file in files:
            if file.endswith('.json'):
                config = json.loads(open(os.path.join(subdir, file)).read())

                if "Date" in config:
                    dates.append(config["Date"])
                    date = str(config["Date"])
                    date = date.split(" ")
                    # years.append(date[-1])

                if "Year" in config:
                    year = config["Year"]
                    if year.isdigit():
                        years.append(config["Year"])

                else:
                    pass
    counter = Counter(years)

    head = [tuple(["Year"] + ["NumberOfLetters"])]

    ordered = collections.OrderedDict(sorted(counter.items()))
    ordered = list(ordered.items())

    for x in ordered:
        head.append(x)

    pprint(head)

    into_csv(head)


    ''' in order to write it in the csv file - it writes lines not columns,
    so each year has to be "in line" with it's number '''
    # col_1 = ["Year"]
    # col_2 = ["NumberOfLetters"]

    # keys=["Year"]
    # values=["NumberOfLetters"]

    # for x in counter:
    #     keys.append(int(x))
    #     values.append(counter[x])
    
    # csv_list = list(zip(keys, values))

    # pprint(csv_list)

    # into_csv(csv_list)
                

def into_csv(liste):
    """writes csv file of the data"""
    
    
    with open("../ignore/letters/SchillerYears.csv","w") as csvfile:

        writer = csv.writer(csvfile)

        for x in liste:
            writer.writerow(x)

        # #write a dict in two rows like this:
        # writer.writerow(dictionary.keys())
        # writer.writerow(dictionary.values())

    

def main():

    root = sys.argv[1]
    
    getData(root)

if __name__ == '__main__':
    main()
