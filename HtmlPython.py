from bs4 import BeautifulSoup
import os
import datetime
from webbrowser import open_new_tab

def findDate():

    direc = "data/briefe-an-charlotte-stein-band-1"         #add your directory 

    for file in os.listdir(direc):
        if file.endswith(".html"):
            filename = os.path.join(direc, file)
            with open(filename, "r") as openfile:
                soup = BeautifulSoup(openfile, 'html.parser')
            
            for date in soup.find_all("h3"):                    #searches for the date but problem: only files with date at the top get searched
                for number in soup.find_all("h4"):
                    #for day in soup.find_all("p", attrs={"class": "center"}):      #way to find the individual days
                    intoHtml(date.text, number.text, "The Letter")

def intoHtml(date, number, body):

    filename = date + "  " + number + '.html'
    f = open(filename, 'w')

    #the %s is a placeholder for a variable --> they are defined below
    wrapper= """<html>
    <head>
    <title>%s, %s </title>                  
    </head>
    <body><p>%s</p></body>
    </html>"""

    #definition for %s
    whole = wrapper % (date, number, body)      #depending on the order e.g. date goes in place of first %s and so on
    f.write(whole)
    f.close()

    filename = "/Letters/" + filename       #Should put it in directory Letters but it doesn't... don't know why
        
    open_new_tab(filename)

findDate()
