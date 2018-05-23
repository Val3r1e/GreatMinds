from bs4 import BeautifulSoup
import bs4
import os
import datetime
from webbrowser import open_new_tab
import sys
from pprint import pprint
import json
import re

'''eg: python3 htmlReader_FrauSchiller.py "../ignore/letters/FrauSchiller/html" "../ignore/letters/FrauSchiller/meta" '''

def metadata(direc):
    '''direc indicates, which files are loaded (the extracted html letters)
    and destinaton is the place where the metadata files will be saved'''
    
    for file in os.listdir(direc):
        if file.endswith(".html"):
            filename = os.path.join(direc, file)
            with open(filename, "r") as openfile:
                soup = BeautifulSoup(openfile, 'html.parser')
                print("\n\n"+filename+"\n")

                write_metadata(soup, filename, direc)

def write_metadata(soup, filename, direc):
    '''metadata with collection, title, number, year, date, signature'''

    filename = filename.replace(".html",".json")
    name = filename.replace("ignore/letters/FrauSchiller/html/","ignore/letters/FrauSchiller/meta/")
    metadata = {}

    metadata["Collection"] = "Briefe Goethes an Frau Schiller"

    #---------title and number--------
    head = soup.find("h4")
    headline = head.text
    split = headline.split('. ')
    if len(split)>1:
        metadata["Number"] = split[0]
        title = split[1]
        metadata["Title"] = split[1]
    else:
        metadata["Number"] = split
        title = split
        metadata["Title"] = "none"  


    #------------date and place------------
    date = soup.find("p", class_ = "date")

    string_date = date

    months = {"Januar":"Jan", "Jänner":"Jan", "Jan":"Jan", "Februar":"Feb", "Febr":"Feb", "März":"Mar", 
              "April":"Apr", "Mai":"May", "Juni":"Jun", "Juli":"Jul", "August":"Aug", "Aug":"Aug", 
              "September":"Sep", "Sept":"Sep", "October":"Oct", "Oktober":"Oct", "November":"Nov", 
              "Novbr":"Nov", "Nov":"Nov", "December":"Dec", "Dezember":"Dec", "Dec":"Dec"}
    
    if date == None:
        metadata["Date"] = "none"
        metadata["Place"] = "none"

    # make it readable for computers (I hope)
    else:
        date = (date.text).replace(".", "")
        date = date.replace("{","")
        date = date.replace("}","")
        date = date.replace("\n","")
        date = date.replace("(","")
        date = date.replace(")","")
        date = date.replace(",","")
        #print(date)

        date = date.split(" ")
        day = "none"
        jahr = "none"
        written_on = date

        # remove all entries like "" or " ":
        date = list(filter(None, date))
        #print(date)

        # not always correct bcs st the place is missing ... 
        metadata["Place"] = date[0]
        print(date[0])

        for substring in date: 
            for k in months:
                if k in substring:
                    month = months[k]

                    i = date.index(substring)

                    # sometimes the day is missing, it's just "Juni 1798" or sth.
                    if date[i-1].isdigit():
                        day = date[i-1].replace(" ", "")
                    
                    # sometimes the year is missing
                    if date[i] != date[-1]:
                        jahr = str(re.findall(r'\d+', date[i+1])).replace("[","") #finds all digits
                        jahr = jahr.replace("]","")
                        jahr = jahr.replace("'","")
                        # if date[i+1].isdigit():
                        #     jahr = date[i+1].replace(" ", "")

                    written_on = day + " " + month + " " + jahr

        print(written_on)

        metadata["Date"] = written_on
        metadata["Year"] = jahr

    if string_date == None:
        metadata["StringDate"] = "none"
    else:
        metadata["StringDate"] = string_date.text


    #-------------signature-----------------
    signature = soup.find("p", class_="signature")
    if signature == None:
        metadata["signature"] = "none"
    else:
        metadata["signature"] = signature.text


    #------- author and recipient------------
    metadata["Author"] = "Goethe"
    metadata["Recipient"] = "Frau Charlott Schiller"

    json.dump(metadata, open(name,'w'))


def main():

    direc = sys.argv[1]
    #destination = sys.argv[2]

    metadata(direc)

if __name__ == '__main__':
    main()
