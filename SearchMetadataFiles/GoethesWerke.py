import os
import sys
import json
from pprint import pprint

#Prints for every firstpub the date and the path (including name of document) if no firstpub atribute
#it prints the same for year and if neither atributes are there it prints "Doesn't exist"
# def loadfiles():
#     rootdir = "data"
#     firstpub = []
#     year = []
#     print("First publishing dates:")

#     for subdir, dirs, files in os.walk(rootdir):
#         for file in files:
#             if file.endswith('.json'):
#                 config = json.loads(open(os.path.join(subdir, file)).read())
#                 if "firstpub" in config:
#                     """firstpub.append(config["firstpub"])"""
#                     print(subdir, config["firstpub"])
#                 if "year" in config:
#                     """year.append(config["year"])"""
#                     print(subdir, config["year"])
#                 else:
#                     print("Doesn't exist")
#                 """print(os.path.join(subdir, file))"""
#     """print(firstpub)"""
#     """print(year)"""

# #Prints the overall amount of files, the amount where "firstpub" exists and the amount where it doesn't
# def allAtributes():
#     rootdir = "data"

#     firstpub = 0
#     nothing = 0
#     overall = 0

#     for subdir, dirs, files in os.walk(rootdir):
#         for file in files:
#             if file.endswith('.json'):
#                 overall += 1
#                 config = json.loads(open(os.path.join(subdir, file)).read())
#                 if "firstpub" in config:
#                     firstpub += 1
#                 else:
#                     nothing += 1
#     print("Amount of files: ", overall)
#     print("firstpub exists: ", firstpub)
#     print("No firstpub: ", nothing)

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

def countAll():
    rootdir = "data"

    firstpub = 0
    Nofirstpub = 0
    Type = 0
    NoType = 0
    title = 0
    Notitle = 0
    year = 0
    Noyear = 0
    booktitle = 0
    Nobooktitle = 0
    publisher = 0
    Nopublisher = 0
    pages = 0
    Nopages = 0
    series = 0
    Noseries = 0

    for subdir, dirs, files in os.walk(rootdir):
        for file in files:
            if file.endswith('.json'):
                config = json.loads(open(os.path.join(subdir, file)).read())
                if "firstpub" in config:
                    firstpub += 1
                if "firstpub" not in config:
                    Nofirstpub += 1
                if "type" in config:
                    Type += 1
                if "type" not in config:
                    NoType += 1
                if "title" in config:
                    title += 1
                if "title" not in config:
                    Notitle += 1
                if "year" in config:
                    year += 1
                if "year" not in config:
                    Noyear += 1
                if "booktitle" in config:
                    booktitle += 1
                if "booktitle" not in config:
                    Nobooktitle += 1
                if "publisher" in config:
                    publisher += 1
                if "publisher" not in config:
                    Nopublisher += 1
                if "pages" in config:
                    pages += 1
                if "pages" not in config:
                    Nopages += 1
                if "series" in config:
                    series += 1
                if "series" not in config:
                    Noseries += 1

    print("\nfirstpub: ", firstpub, "\n")
    print("Nofirstpub: ", Nofirstpub, "\n")
    print("type: ", Type, "\n")
    print("Notype: ", NoType, "\n")
    print("title: ", title, "\n")
    print("Notitle: ", Notitle, "\n")
    print("year: ", year, "\n")
    print("Noyear: ", Noyear, "\n")
    print("booktitle: ", booktitle, "\n")
    print("Nobooktitle: ", Nobooktitle, "\n")
    print("publisher: ", publisher, "\n")
    print("Nopublisher: ", Nopublisher, "\n")
    print("pages: ", pages, "\n")
    print("Nopages: ", Nopages, "\n")
    print("series: ", series, "\n")
    print("Noseries: ", Noseries, "\n")


#Main


print("\nThe occurence of the most important atributes:\n")

countAll()

print("\nA closer look on firstpub:")

names()

print("\n")
