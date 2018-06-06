'''
sort the letters by decads (but since the metadata is quite incomplete there are probably a lot of them missing)

Terminal: python3 decades_txt.py "../Letters/"

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

def extract (direc):
    
    letters_til_1785 = []
    letters_til_1795 = []
    letters_til_1805 = []
    letters_til_1815 = []
    letters_til_1830 = []

    decade_ends = {1785:letters_til_1785, 1795:letters_til_1795, 1805:letters_til_1805, 
                   1815:letters_til_1815, 1830:letters_til_1830}

    for subdir, dirs, files in os.walk(direc):
        for file in files:
            if file.endswith('.json'):
                f_name = os.path.join(direc, file)
                config = json.loads(open(os.path.join(subdir, file)).read())
                year = (config["Year"]).lstrip()
                for number in decade_ends:
                    if year.isdigit():
                        if int(year) <= number:
                            f_name = f_name.replace("../Letters/","").replace(".json","")
                            (decade_ends[number]).append(f_name)
                            break

    whole_1785 = ""
    whole_1795 = ""
    whole_1805 = ""
    whole_1815 = ""
    whole_1830 = ""

    for subdir, dirs, files in os.walk(direc):
        for file in files:
            if file.endswith('.html'):
                filename = os.path.join(direc, file)
                with open(os.path.join(subdir, file), "r") as openfile:   
                    soup = BeautifulSoup(openfile, 'html.parser')
                    #print(filename)

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
                        
                        if filename in letters_til_1785:
                            wrapper= "%s \n"
                            whole_1785 += wrapper % (txt_body)

                        elif filename in letters_til_1795:
                            wrapper= "%s \n"
                            whole_1795 += wrapper % (txt_body)
                            
                        elif filename in letters_til_1805:
                            wrapper= "%s \n"
                            whole_1805 += wrapper % (txt_body)

                        elif filename in letters_til_1815:
                            wrapper= "%s \n"
                            whole_1815 += wrapper % (txt_body)

                        elif filename in letters_til_1830:
                            wrapper= "%s \n"
                            whole_1830 += wrapper % (txt_body)
                        else:
                            pass

                        txt_body = ""
                

    intoTxt(txt_body, whole_1785, "1785") 
    intoTxt(txt_body, whole_1795, "1795")            
    intoTxt(txt_body, whole_1805, "1805")            
    intoTxt(txt_body, whole_1815, "1815")
    intoTxt(txt_body, whole_1830, "1830")


def intoTxt(body, whole, year):
    
    filename = "til_" + year + ".txt"

    f = open("../Wordle/txt/"+filename, 'w') 
    f.write(whole)
    f.close()

    open_new_tab(filename)


#---------Main-----------

def main():

    root = sys.argv[1]
    
    extract(root)

if __name__ == '__main__':
    main()