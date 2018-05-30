import os
import sys
import json
import csv
from pprint import pprint
from collections import Counter
import collections 

''' python3 get_dates_all.py "../Letters/" '''

def getData(rootdir):
    """gets the year and the date from the metadatafiles (.json files)"""

    datesSchiller = []
    datesStein = []
    yearsSchiller = []
    yearsStein = []

    for subdir, dirs, files in os.walk(rootdir):
        for file in files:
            if file.endswith('.json'):
                config = json.loads(open(os.path.join(subdir, file)).read())

                if "schiller" in config["Collection"]:

                    if "Date" in config:
                        datesSchiller.append(config["Date"])
                        date = str(config["Date"])
                        date = date.split(" ")
                        # years.append(date[-1])

                    if "Year" in config:
                        year = config["Year"]
                        if year.isdigit():
                            yearsSchiller.append(config["Year"])

                elif "stein" in config["Collection"]:
                    if "Date" in config:
                        datesStein.append(config["Date"])
                        date = str(config["Date"])
                        date = date.split(" ")
                        # years.append(date[-1])

                    if "Year" in config:
                        year = config["Year"].strip()
                        if year.isdigit():
                            yearsStein.append(year)
                else:
                    pass
            else:
                pass

    counterSchiller = Counter(yearsSchiller)
    counterStein = Counter(yearsStein)
    #pprint(counterStein)

    orderedSchiller = collections.OrderedDict(sorted(counterSchiller.items()))
    orderedSchiller = list(orderedSchiller.items())

    orderedStein = collections.OrderedDict(sorted(counterStein.items()))
    orderedStein = list(orderedStein.items())

    all_years = []
    all_data = [tuple(["Year"] + ["NumberSchiller"] + ["NumberStein"])]

    for x in orderedSchiller:
        if x[0] not in all_years:
            all_years.append(x[0])
    for y in orderedStein:
        if y[0] not in all_years:
            all_years.append(y[0])
    
    all_years.sort()
    print(all_years)

    for x in all_years:
        Schiller_c = next((b for a, b in orderedSchiller if a == x), 0)
        Stein_c = next((d for c, d in orderedStein if c == x), 0)
        all_data.append(tuple([str(x)] + [str(Schiller_c)] + [str(Stein_c)]))


    pprint(all_data)

    into_csv(all_data)


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
    
    
    with open("../ignore/letters/great_data.csv","w") as csvfile:

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
