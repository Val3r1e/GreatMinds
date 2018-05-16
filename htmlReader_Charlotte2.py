from bs4 import BeautifulSoup
import bs4
import os
import datetime
from webbrowser import open_new_tab
import sys
from pprint import pprint
import json

def extract(direc, destination):
    fileindex = 1
    year = "XXXX"                                    #in case there is no date

    for file in os.listdir(direc):
        if file.endswith(".html"):
            filename = os.path.join(direc, str(fileindex)+".html") # this way he runs through the files in the right order (so we get the right year for each letter)
            fileindex += 1
            with open(filename, "r") as openfile:
                soup = BeautifulSoup(openfile, 'html.parser')
                print(filename)

                txt_body = ""
                html_body = []
                number = "YYYY"
                date = ""
                h4_counter = 0
                document = soup.find_all()
                body_tags = ["p", "table", "i", "a", "sup", "br", "span", "h2", "big", "b", "ol", "hr", "tt"]

                # """to find out which tags exist in each document: """
                # tags = []
                # for tag in document:
                #     if tag.name not in tags:
                #         tags.append(tag.name)
                # print(tags)
                
                """decide what happens with each part and write the files: """
                for element in document:
                    if element.name == "h3":
                        year = element.text

                    elif element.name == "h4":
                        if h4_counter != 0:
                            intoHtml(year, number, date, html_body)
                            intoTxt(year, number, date, txt_body)
                            txt_body = ""
                            #html_body = ""
                            del html_body[:]

                        number = element.text
                        h4_counter += 1

                    elif element.name == "h5":
                        date = element.text

                    # elif element.name == ("p" or "table" or "i" or "a" or "sup" or "br" or "span" or "h2" or "big" or "b" or "ol" or "li" or "hr" or "tr" or "td" or "th" or "tt" or ""):
                    #     txt_body += "\n" + element.text
                    #     #html_body += "<br>" + element.text
                    #     html_body.append(element)

                    elif element.name in body_tags:
                        txt_body += "\n" + element.text
                        html_body.append(element)
                    
                    else:
                        pass

                if h4_counter != 0:
                    intoHtml(year, number, date, html_body)
                    intoTxt(year, number, date, txt_body)
                    txt_body = ""
                    #html_body = ""
                    del html_body[:]

    metadata(destination, direc)

def intoHtml(year, number, date, body):

    filename = year + " - " + number + '.html'

    f = open("Letters/"+filename, 'w') 

    letter = ""
    for element in body:
        letter += str(element)

    wrapper= """<!DOCTYPE HTML>
    <html lang="DE">
        <head>
            <meta charset="utf-8" />
            <title> %s, %s </title>
        </head>
        <body>
            <header>
                <h4> %s - %s </h4>
                <h5> %s </h5>
            </header>
            <article>
                <p> %s </p>
            </article>
        </body>
    </html>"""

    whole = wrapper % (year, number, year, number, date, letter)    
    f.write(whole)
    f.close()

    open_new_tab(filename)

def intoTxt(year, number, date, body):
    
    filename = year + " - " + number + '.txt'

    f = open("Letters/"+filename, 'w') 

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

def write_metadata(soup, filename, direc, source):
    '''metadata with collection, title, number, year, date, signature, author and recipient'''

    filename = filename.replace(".html",".json")
    name = filename.replace("Letters/","Metadata/")
    metadata = {}

    metadata["Collection"] = source.replace("data/","")

    #number and year
    head = soup.find("h4")
    headline = head.text
    split = headline.split(" - ")

    if len(split) > 1:
        metadata["Year"] = split[0] 
        metadata["Number"] = split[1]
    else:
        metadata["Number and Year"] = split

    date = soup.find("h5")
    if date == None:
         metadata["Date"] = "None"
    else:
         metadata["Date"] = date.text

    signature = soup.find("p", class_="signature")      #doesn't work yet because signature is no longer a tag in the new html documents
    if signature == None:
        metadata["signature"] = "None"
    else:
        metadata["signature"] = signature.text

    json.dump(metadata, open(name,'w'))


def main():

    extract("data/briefe-an-charlotte-stein-band-2", "Letters/")


if __name__ == '__main__':
    main()

