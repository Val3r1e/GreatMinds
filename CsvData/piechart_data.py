'''get Data for piechart in the form (Name|total Amount)
   python3 piechart_data.py ../visualizations/data/linechart_data.csv'''

import csv
import sys
import os
from pprint import pprint

def create_piechart_data(file):
    '''get off my ass pylint'''

    total_schiller = 0
    total_christiane = 0
    total_frauSchiller = 0
    total_stein = 0

    with open(file, "r") as csvfile:
        myreader = csv.DictReader(csvfile, delimiter = ',')
        for row in myreader:
            total_schiller += int(row['NumberSchiller'])
            total_frauSchiller += int(row['NumberFrauSchiller'])
            total_stein += int(row['NumberStein'])
            total_christiane += int(row['NumberChristiane'])
    
    pie_data = [tuple(["Name"] + ["TotalAmount"]), tuple(["Schiller"]+[total_schiller]),
                tuple(["FrauSchiller"]+[total_frauSchiller]), tuple(["Stein"]+[total_stein]),
                tuple(["Christiane"]+[total_christiane])]
    
    pprint(pie_data)
    
    into_csv(pie_data)

def into_csv(liste):
    """writes csv file of the data"""
    
    with open("../visualizations/data/piechart_data.csv","w") as csvfile:

        writer = csv.writer(csvfile)

        for x in liste:
            writer.writerow(x)

def main():
    
    file = sys.argv[1]

    create_piechart_data(file)

if __name__ == '__main__':
    main()