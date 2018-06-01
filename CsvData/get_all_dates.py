import os
import sys
import json
import csv
from pprint import pprint
from collections import Counter
import collections 

''' python3 get_all_dates.py "../Letters/" '''

def getData(rootdir):
    """gets the year and the date from the metadatafiles (.json files)"""

    #datesSchiller = []
    #datesStein = []
    yearsSchiller = []
    yearsStein = []
    yearsChristiane = []

    for subdir, dirs, files in os.walk(rootdir):
        for file in files:
            if file.endswith('.json'):
                config = json.loads(open(os.path.join(subdir, file)).read())

                if "schiller" in config["Collection"]:

                    # if "Date" in config:
                    #     datesSchiller.append(config["Date"])
                    #     date = str(config["Date"])
                    #     date = date.split(" ")
                    #     # years.append(date[-1])

                    if "Year" in config:
                        year = config["Year"]
                        if year.isdigit():
                            yearsSchiller.append(config["Year"])

                elif "stein" in config["Collection"]:
                    # if "Date" in config:
                    #     datesStein.append(config["Date"])
                    #     date = str(config["Date"])
                    #     date = date.split(" ")
                    #     # years.append(date[-1])

                    if "Year" in config:
                        year = config["Year"].strip()
                        if year.isdigit():
                            yearsStein.append(year)

                elif "seiner" in config["Collection"]:
                    # if "Date" in config:
                    #     datesStein.append(config["Date"])
                    #     date = str(config["Date"])
                    #     date = date.split(" ")
                    #     # years.append(date[-1])

                    if "Year" in config:
                        year = config["Year"].strip()
                        if year.isdigit():
                            yearsChristiane.append(year)
                else:
                    pass
            else:
                pass

    counterSchiller = Counter(yearsSchiller)
    counterStein = Counter(yearsStein)
    counterChristiane = Counter(yearsChristiane)
    #pprint(counterStein)

    orderedSchiller = collections.OrderedDict(sorted(counterSchiller.items()))
    orderedSchiller = list(orderedSchiller.items())
    #pprint(orderedSchiller)

    orderedStein = collections.OrderedDict(sorted(counterStein.items()))
    orderedStein = list(orderedStein.items())
    #pprint(orderedStein)

    orderedChristiane = collections.OrderedDict(sorted(counterChristiane.items()))
    orderedChristiane = list(orderedChristiane.items())
    #pprint(orderedChristiane)

    all_years = []
    all_data = [tuple(["Year"] + ["NumberSchiller"] + ["NumberStein"] + ["NumberChristiane"])]

    for x in orderedSchiller:
        if x[0] not in all_years:
            all_years.append(x[0])
    for x in orderedStein:
        if x[0] not in all_years:
            all_years.append(x[0])
    for x in orderedChristiane:
        if x[0] not in all_years:
            all_years.append(x[0])
    
    all_years.sort()
    #print(all_years)

    for x in all_years:
        Schiller_c = next((b for a, b in orderedSchiller if a == x), 0)
        Stein_c = next((d for c, d in orderedStein if c == x), 0)
        Christiane_c = next((d for c, d in orderedChristiane if c == x), 0)
        all_data.append(tuple([str(x)] + [str(Schiller_c)] + [str(Stein_c)] + [str(Christiane_c)]))

    pprint(all_data)
    into_csv(all_data)
                
def into_csv(liste):
    """writes csv file of the data"""
    
    with open("great_data.csv","w") as csvfile:

        writer = csv.writer(csvfile)

        for x in liste:
            writer.writerow(x)

def main():

    root = sys.argv[1]
    
    getData(root)

if __name__ == '__main__':
    main()
