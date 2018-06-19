'''
sort the letters by years (but since the metadata is quite incomplete there are probably a lot of them missing)

Terminal: python3 txt_for_five_years.py "../Letters/"

Timespan: 1776 - 1829
'''

from bs4 import BeautifulSoup
import bs4
import os
import datetime
from webbrowser import open_new_tab
import sys
from pprint import pprint
import json
import nltk
from nltk.corpus import stopwords
import csv
from collections import defaultdict

def join_txt_files(direc):
    
    start_year = 1775
    years = []

    while start_year <= 1830:
        years.append(start_year)
        start_year += 5
        
    filenames = defaultdict(list)
    
    for subdir, dirs, files in os.walk(direc):
        for file in files:
            if file.endswith('.json'):
                f_name = os.path.join(direc, file)
                config = json.loads(open(os.path.join(subdir, file)).read())
                year = (config["Year"]).lstrip()
                for number in years:
                    if year.isdigit():
                        if int(year) <= number:
                            f_name = f_name.replace("../Letters/","").replace(".json","")
                            filenames[number].append(f_name)
                            break
    
    #pprint(filenames)

    data = defaultdict(list)

    for subdir, dirs, files in os.walk(direc):
        for file in files:
            if file.endswith('.html'):
                filename = os.path.join(direc, file)
                with open(os.path.join(subdir, file), "r") as openfile:   
                    soup = BeautifulSoup(openfile, 'html.parser')

                    txt_body = ""
                    p_counter = 0
                    document = soup.find_all()
                    
                    for element in document:
                        if element.name == "p":
                            txt_body += "\n" + element.text
                            p_counter += 1
                        else:
                            pass

                    if p_counter != 0:
                        txt_body.encode('ascii', errors='ignore')
                        filename = filename.replace("../Letters/","").replace(".html","")

                        for key in filenames:
                            if filename in filenames[key]:
                                data[key].append(txt_body)
                                break

    for key in data:
        string = ' '.join(data[key])
        intoTxt(string, str(key))


def intoTxt(whole, name):
    
    filename = name + ".txt"

    f = open("../wordcloud/txt/every_five_years/"+filename, 'w') 
    f.write(whole)
    f.close()

    open_new_tab(filename)


#---------Main-----------

def main():

    root = sys.argv[1]
    
    join_txt_files(root)

if __name__ == '__main__':
    main()