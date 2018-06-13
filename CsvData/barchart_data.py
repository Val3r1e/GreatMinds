'''get Data for barchart in theform (Year|total Amount)
   python3 barchart_data.py ../visualizations/data/linechart_data.csv'''

import csv
import sys
import os
from pprint import pprint

def get_barchart_data(file):
    
    data = [tuple(["Year"]+["TotalAmount"])]

    with open(file, "r") as csvfile:
        myreader = csv.DictReader(csvfile, delimiter = ',')
        for row in myreader:
            total = 0
            year = row['Year']
            total = (int(row['NumberSchiller']) + int(row['NumberFrauSchiller']) +
                     int(row['NumberStein']) + int(row['NumberChristiane']))
            
            entry = tuple([year]+[total])
            data.append(entry)

        
    pprint(data)
    into_csv(data, "barchart_data.csv")


def barchart_by_decades(file):
    '''since there are way to many years for a barchart: amount by five years'''
    
    data = [tuple(["Until"]+["TotalAmount"])]
    til_1780 = 0
    til_1785 = 0
    til_1790 = 0
    til_1795 = 0
    til_1800 = 0
    til_1805 = 0
    til_1810 = 0
    til_1815 = 0
    til_1820 = 0
    til_1825 = 0
    til_1830 = 0
    years = {1780: til_1780, 1785: til_1785, 1790: til_1790, 1795: til_1795, 1800: til_1800, 1805: til_1805, 
                   1810: til_1810, 1815: til_1815, 1820: til_1820, 1825: til_1825, 1830: til_1830}

    with open(file, "r") as csvfile:
        myreader = csv.DictReader(csvfile, delimiter = ',')
        for row in myreader:
            year = row['Year']
            for number in years:
                if int(year) <= number:
                    years[number] += (int(row['NumberSchiller']) + int(row['NumberFrauSchiller']) +
                                              int(row['NumberStein']) + int(row['NumberChristiane']))
                    break

        for key in years:
            data.append(tuple([key]+[years[key]]))
        
        into_csv(data, "barchart_data_five_years.csv")


def into_csv(liste, name):
    """writes csv file of the data"""
    
    with open("../visualizations/data/" + name, "w") as csvfile:

        writer = csv.writer(csvfile)

        for x in liste:
            writer.writerow(x)

def main():
    
    file = sys.argv[1]

    #get_barchart_data(file)
    barchart_by_decades(file)

if __name__ == '__main__':
    main()
