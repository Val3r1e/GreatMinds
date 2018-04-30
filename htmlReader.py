"""Terminal: python3 htmlReader.py "path/to/directory" """

from bs4 import BeautifulSoup
import bs4
import os
import datetime
from webbrowser import open_new_tab
import sys

def extract(direc):
    """I left all the print-statements in it so it'll be easier for us to adapt the code to the other folders. If we don't need them
    eventually, we can throw them all out of course"""

    #direc = "../data/briefe-an-charlotte-stein-band-1"         #add your directory

    fileindex = 1
    date = "XXXX"                                    #in case there is no date

    for file in os.listdir(direc):
        if file.endswith(".html"):
            filename = os.path.join(direc, str(fileindex)+".html") # this way he runs through the files in the right order (so we get the right year for each letter)
            fileindex += 1
            with open(filename, "r") as openfile:
                soup = BeautifulSoup(openfile, 'html.parser')
                print(filename+"\n")

                body = ""
                number = "YYY"
                h4_counter = 0
                document = soup.find_all(["h3","h4","p"])
                #print(document)
                #print (type(numbers))

                for element in document:
                    if element.name == "h3":
                        date = element.text

                    elif element.name == "h4":
                        if h4_counter != 0:
                            #print("Jetzt schreibe ich Nummer ", number)
                            intoHtml(date, number, body)
                            body = ""
                            #print("Counter: ", h4_counter)

                        number = element.text
                        h4_counter += 1
                        #print(number)

                    elif element.name == "p":
                        body += "<br>"+element.text

                if h4_counter != 0:
                    #print("Jetzt schreibe ich Nummer ", number)
                    intoHtml(date, number, body)
                    body = ""
                    #print("Counter: ", h4_counter)

def intoHtml(date, number, body):

    filename = date + " - " + number + '.html'
    f = open("ignore/letters/"+filename, 'w')

    #the %s is a placeholder for a variable --> they are defined below
    wrapper= """<html>
    <head>
    <title>%s, %s </title>
    </head>
    <body><h4>%s - %s</h4><p>%s</p></body>
    </html>"""

    #definition for %s
    whole = wrapper % (date, number, date, number, body)      #depending on the order e.g. date goes in place of first %s and so on
    f.write(whole)
    f.close()

    open_new_tab(filename)

def main():

    path = sys.argv[1]
    extract(path)

if __name__ == '__main__':
    main()
