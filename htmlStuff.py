from bs4 import BeautifulSoup
import bs4
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

def extract():
    direc = "data/briefe-an-charlotte-stein-band-1"         #add your directory

    for file in os.listdir(direc):
        if file.endswith(".html"):
            filename = os.path.join(direc, file)
            with open(filename, "r") as openfile:
                soup = BeautifulSoup(openfile, 'html.parser')

            for date in soup.find_all("h3"):
                for number in soup.find_all("h4"):
                    letter = soup.find('p')
                    body = " "
                    while True:
                        if isinstance(letter, bs4.element.Tag):
                            if letter.name == 'h4':
                                break
                            else:
                                body += letter.text
                                letter = letter.nextSibling
                        else:
                            letter = letter.nextSibling

                    intoHtml("ignore/letters/"+date.text, number.text, body)
#findDate()
extract()
