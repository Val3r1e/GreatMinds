import os
import sys
import json
from pprint import pprint

#Prints for every firstpub the date and the path (including name of document) if no firstpub atribute
#it prints the same for year and if neither atributes are there it prints "Doesn't exist"
def loadfiles():
    rootdir = "data"
    firstpub = []
    year = []
    print("First publishing dates:")

    for subdir, dirs, files in os.walk(rootdir):
        for file in files:
            if file.endswith('.json'):
                config = json.loads(open(os.path.join(subdir, file)).read())
                if "firstpub" in config:
                    """firstpub.append(config["firstpub"])"""
                    print(subdir, config["firstpub"])
                if "year" in config:
                    """year.append(config["year"])"""
                    print(subdir, config["year"])
                else:
                    print("Doesn't exist")
                """print(os.path.join(subdir, file))"""
    """print(firstpub)"""
    """print(year)"""

#Prints the overall amount of files, the amount where "firstpub" exists and the amount where it doesn't
def allAtributes():
    rootdir = "data"

    firstpub = 0
    nothing = 0
    overall = 0

    for subdir, dirs, files in os.walk(rootdir):
        for file in files:
            if file.endswith('.json'):
                overall += 1
                config = json.loads(open(os.path.join(subdir, file)).read())
                if "firstpub" in config:
                    firstpub += 1
                else:
                    nothing += 1
    print("Amount of files: ", overall)
    print("firstpub exists: ", firstpub)
    print("No firstpub: ", nothing)

#Prints a list with the documents where "firstpub" exists and one with the ones where it doesn't
def names():
    rootdir = "data"

    firstpub = 0
    nothing = 0

    firstpubL = {}
    nothingL = []

    for subdir, dirs, files in os.walk(rootdir):
        for file in files:
            if file.endswith('.json'):
                config = json.loads(open(os.path.join(subdir, file)).read())
                if "firstpub" in config:
                    firstpub += 1
                    firstpubL.update({subdir.replace('-',' ').replace('data/',''): config["firstpub"]})
                else:
                    nothing += 1
                    nothingL.append(subdir.replace('-',' ').replace('data/',''))
    print("\nfirstpub exists: ", firstpub, "\n")
    pprint(firstpubL)
    print("\nNo firstpub: ", nothing, "\n")
    pprint(nothingL)


#Main

    
#allAtributes()

names()



