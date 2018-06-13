import csv
import sys
import os

def create_piechart_data(file):

    with open(file, "r") as csvfile:
        reader = csv.reader(csvfile, delimiter = ' ', quotechar='|')
        for row in reader:
            print(row[2])


def main():
    
    file = sys.argv[1]
    
    create_piechart_data(file)

if __name__ == '__main__':
    main()