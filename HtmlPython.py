from bs4 import BeautifulSoup
import os

def findDate():

    direc = "data/briefe-an-charlotte-stein-band-1"         #add your directory 

    for file in os.listdir(direc):
        if file.endswith(".html"):
            filename = os.path.join(direc, file)
            with open(filename, "r") as openfile:
                soup = BeautifulSoup(openfile, 'html.parser')

            for time in soup.find_all("h3"):                #exchange h3 for any tag you are looking for (should work...I hope...)
                print(time.text)                            #for now it only prints the text of the tag but it's a start
        


findDate()