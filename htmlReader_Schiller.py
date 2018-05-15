'''Terminal: python3 htmlReader.py "path/to/directory" "path/to/extracted/html-letters'''
'''eg: python3 htmlReader_Schiller.py "data/briefwechsel-zwischen-schiller-und-goethe-band-1" "ignore/letters/Schiller1/html" '''

#  briefwechsel-zwischen-schiller-und-goethe-band-1

from bs4 import BeautifulSoup
import bs4
import os
import datetime
from webbrowser import open_new_tab
import sys
from pprint import pprint
import json

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

    body_tags = ["p", "br", "a", "table", "hr", "ol", "u", "span", "b", "dl"]

    """decide what happens with each part and write the files: """
    for element in document:
        if element.name == "h3":
            year = (element.text).replace(".","")

        elif element.name == "h2":
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
    
     # especially for Schiller Bd1:
    if year == "XXXX":
        year = "1794"

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
    
    # especially for Schiller Bd1:
    if year == "XXXX":
        year = "1794"
    
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
    name = filename.replace("ignore/letters/Schiller1/html/","ignore/letters/Schiller1/meta/")
    metadata = {}

    metadata["Collection"] = source.replace("data/","")

    # title and number
    head = soup.find("h4")
    headline = head.text
    split = headline.split('. ')
    if len(split)>1:
        metadata["Number"] = split[0]
        title = split[1]
        metadata["Title"] = split[1]
    else:
        metadata["Number"] = "none"
        title = split
        metadata["Title"] = split  

    year = soup.find("h3")
    metadata["Year"] = year.text

    date = soup.find("p", class_ = "date")
    if date == None:
         metadata["Date"] = "None"
    else:
         metadata["Date"] = date.text

    signature = soup.find("p", class_="signature")
    if signature == None:
        metadata["signature"] = "None"
    else:
        metadata["signature"] = signature.text

    # author and recipient
    if "Schiller" in title:
        metadata["Author"] = "Goethe"
        metadata["Recipient"] = "Schiller"

    elif "Goethe" in title:
        metadata["Author"] = "Schiller"
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
