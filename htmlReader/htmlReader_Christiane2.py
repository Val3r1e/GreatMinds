'''Terminal: python3 htmlReader.py "path/to/directory" "path/to/extracted/html-letters'''
'''eg: python3 htmlReader_Christiane2.py "../data/briefwechsel-mit-seiner-frau-band-ii" "../ignore/letters/Christiane2/html" '''

from bs4 import BeautifulSoup
import bs4
import os
import datetime
from webbrowser import open_new_tab
import sys
from pprint import pprint
import json
import re

#  briefwechsel-zwischen-schiller-und-goethe-band-2

def open_file(direc, destination):

    fileindex = 1

    for file in os.listdir(direc):
        if file.endswith(".html"):
            filename = os.path.join(direc, str(fileindex)+".html") #runs through the files in the right order
            fileindex += 1
            with open(filename, "r") as openfile:
                soup = BeautifulSoup(openfile, 'html.parser')
                print("\n\n"+filename+"\n")

                extract(soup, destination)
    
    metadata(destination, direc)


def extract(soup, destination):
    
    txt_body = ""
    html_body = []
    year = "XXXX"
    number = "YYY"
    date = ""
    title_counter = 0
    document = soup.find_all()

    """to find out which tags exist in each document: """
    tags = []
    for tag in document:
        if tag.name not in tags:
            tags.append(tag.name)
    print(tags)

    body_tags = ["p", "br", "a", "table", "hr", "ol", "u", "b", "dl"]

    """decide what happens with each part and write the files: """
    for element in document:
        if element.name == "h3":
            year = element.text

        elif element.name == "h4":
            if title_counter != 0:
                into_html(year, number, date, html_body, destination)
                into_txt(year, number, date, txt_body, destination)
                txt_body = ""
                del html_body[:]

            number = (element.text).lstrip()
            title_counter += 1

        elif element.name in body_tags:
            txt_body += element.text
            html_body.append(element)
        else:
            pass
        
    if title_counter != 0:
        into_html(year, number, date, html_body, destination)
        into_txt(year, number, date, txt_body, destination)
        txt_body = ""
        del html_body[:]


def into_html(year, number, date, body, destination):
    '''letter into html'''
    
    if "X" in year:
        year = "1795"

    number = number.zfill(3)
    filename = year + " - " + number + '.html'

    f = open(destination+"/"+filename, 'w') 

    letter = ""
    for element in body:
        letter += str(element)
        
    wrapper= """<!DOCTYPE HTML>
    <html lang="DE">
    <head>
        <meta charset="utf-8" />
        <title>%s, %s </title>
    </head>
    <body>
        <header>
            <h3>%s</h3>
            <h4>%s</h4>
            <h5>%s</h5>
        </header>
        <article> %s </article>
    </body>
    </html>"""

    whole = wrapper % (year, number, year, number, date, letter)
    f.write(whole)
    f.close()

    open_new_tab(filename)


def into_txt(year, number, date, body, destination):
    '''letter as raw txt (at least I hope it's raw^^)'''
    
    if "X" in year:
        year = "1795"
    
    number = number.zfill(3)
    destination = destination.replace("html", "txt/")
    
    filename = year + " - " + number + '.txt'

    f = open(destination+filename, 'w') 

    body.encode('ascii', errors='ignore')

    wrapper= "%s \n %s \n %s \n %s"

    whole = wrapper % (year, number, date, body)
    f.write(whole)
    f.close()

    open_new_tab(filename)


def metadata(direc, source):
    '''direc indicates, which files are loaded (the extracted html letters)
    and source is the path to the original directory in order to get the name of it
    for "collection"'''
    
    for file in os.listdir(direc):
        if file.endswith(".html"):
            filename = os.path.join(direc, file)
            with open(filename, "r") as openfile:
                soup = BeautifulSoup(openfile, 'html.parser')
                print("\n\n"+filename+"\n")

                write_metadata(soup, filename, direc, source)

def write_metadata(soup,filename, direc, source):
    '''metadata with collection, title, number, year, date, signature, author and recipient'''

    filename = filename.replace(".html",".json")
        
    name = filename.replace("ignore/letters/Christiane2/html/","ignore/letters/Christiane2/meta/")
    metadata = {}

    metadata["Collection"] = source.replace("data/","")

    #---------title and number--------
    head = soup.find("h4")
    headline = head.text
    split = headline.split(' ')
    if len(split)>1:
        metadata["Number"] = split[0]
        title = split[1]
        metadata["Title"] = split[1]
    else:
        metadata["Number"] = "none"
        title = split
        metadata["Title"] = split  


    #-------------year--------------
    year = soup.find("h3")
    metadata["Year"] = year.text


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
        place = ((date[0]).replace("[", "")).replace("]", "")
        metadata["Place"] = place
        print(place)

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
    if "Goethe" in title:
        metadata["Author"] = "Goethe"
        metadata["Recipient"] = "Christiane"

    elif "Christiane" in title:
        metadata["Author"] = "Christiane"
        metadata["Recipient"] = "Goethe"
    
    elif "August" in title:
        metadata["Author"] = "August"
        metadata["Recipient"] = "Goethe"
    
    else:
        metadata["Author"] = "unknown"
        metadata["Recipient"] = "unknown"
    
    json.dump(metadata, open(name,'w'))


def main():

    source = sys.argv[1]
    destination = sys.argv[2]

    open_file(source, destination)

if __name__ == '__main__':
    main()
