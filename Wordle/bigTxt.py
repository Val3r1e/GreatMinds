from bs4 import BeautifulSoup
import bs4
import os
import datetime
from webbrowser import open_new_tab
import sys
from pprint import pprint
import json


def extract (direc):
                                
    whole = ""

    for file in os.listdir(direc):
        if file.endswith(".html"):
            filename = os.path.join(direc, file)
            with open(filename, "r") as openfile:
                soup = BeautifulSoup(openfile, 'html.parser')
                print(filename)

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
                    wrapper= "%s \n"
                    whole += wrapper % (txt_body)

                    txt_body = ""

    intoTxt(txt_body, whole)


def intoTxt(body, whole):
    
    filename = 'Schiller2.txt'

    f = open("BigTxt/"+filename, 'w') 
    f.write(whole)
    f.close()

    open_new_tab(filename)


#---------Main-----------

extract("Letters/Schiller2/html")