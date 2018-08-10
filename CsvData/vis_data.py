import sys
import math
import os
import csv
from os import path
from collections import defaultdict
from pprint import pprint


def step_years(direc, steps):
    
    CSchiller_data = {}
    CStein_data = {}
    CGoethe_data = {}
    FSchiller_data = {}

    data_dict = {"CSchiller": CSchiller_data, "CStein": CStein_data, "CGoethe":CGoethe_data, "FSchiller": FSchiller_data}

    if int(steps) == 1:
        years = [i for i in range(1775, 1826)]
        
    elif int(steps) == 5:
        years = [i for i in range(1775, 1826, 5)]
        
    elif int(steps) == 10:
        years = [i for i in range(1775, 1826, 10)]

    else:
        print("Just 1, 5 or 10 year steps are possible, sorry")
        sys.exit(1)
    
    for y in years:
            for key in data_dict:
                (data_dict[key])[y] = 0
    
    for file in os.listdir(direc):
        filename = (file.replace(".html", "")).split("_")
        f_year = int(filename[0])
        dict_name = filename[1]
        for year in years:
            if f_year <= year:
                (data_dict[dict_name])[year] += 1
                break

    csv_data = [tuple(["Year"] + ["CSchiller"] + ["CStein"] + ["CGoethe"] + ["FSchiller"])]

    for year in years:
        temp_list = [year]
        for key in data_dict:
            temp_list.append((data_dict[key])[year])
        
        csv_data.append(tuple(temp_list))

    pprint(csv_data)
    into_csv(csv_data, steps)
            
def into_csv(liste, steps):
    """writes csv file of the data"""
    
    with open("../CodeForEndVisualization/Visualization/data/vis_data_%s.csv" %steps,"w") as csvfile:

        writer = csv.writer(csvfile)

        for x in liste:
            writer.writerow(x)

def main():

    root = sys.argv[1]
    steps = sys.argv[2]
    
    step_years(root, steps)

if __name__ == '__main__':
    main()
        