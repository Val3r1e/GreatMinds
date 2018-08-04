'''
sort the letters by years (but since the metadata is quite incomplete there are probably a lot of them missing)

Terminal: python3 txt_for_each_year.py "../../Letters/"

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
                        f_name = filename.split(" ")
                        
                        if f_name[0] == "000":
                            pass
                        elif f_name[0].isdigit():
                            # we used the metadata years for the csv data, so we don't want to get all the letters
                            # called "1796-1826" or "Briefe von ..." or "Italien..." because they are not depicted in our data ... 
                            # we COULD get ALL the letters by just using the following line and miss the if, 
                            # but that wouldn't match our numbers -.-
                            data[f_name[0]].append(txt_body)
                        else:
                            pass

    for key in data:
        string = ' '.join(data[key])
        intoTxt(string, str(key))


def intoTxt(whole, name):
    
    filename = name + ".txt"

    f = open("../txt/every_year/"+filename, 'w') 
    f.write(whole)
    f.close()

    open_new_tab(filename)


#---------Main-----------

def main():

    root = sys.argv[1]
    
    join_txt_files(root)

if __name__ == '__main__':
    main()