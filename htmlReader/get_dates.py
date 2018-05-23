import os
import sys
import json
import csv
from pprint import pprint
from collections import Counter

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

    summe = 0 #just to check if it got every letter
    counter = Counter(years)
    for x in counter:
        summe += counter[x]
        
    print(len(years))
    print(summe)

    pprint(counter)

    ''' in order to write it in the csv file - it writes lines not columns,
    so each year has to be "in line" with it's number '''
    keys = ["Year"]
    values = ["Number of Letters"]
    for x in counter:
        keys.append(x)
        values.append(counter[x])
    
    csv_list = list(zip(keys, values))

    print(csv_list)

    into_csv(csv_list)
                

def into_csv(liste):
    """writes csv file of the data"""
    
    
    with open("SchillerYears.csv","w") as csvfile:

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
