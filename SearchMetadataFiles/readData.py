#!/usr/bin/env python3
import os
import sys
import json
from pprint import pprint

def readData():
    rootdir = "data"

    firstPub = 0
    noFirstPub = 0
    type = 0
    noType = 0
    title = 0
    noTitle = 0
    year = 0
    noYear = 0
    bookTitle = 0
    noBookTitle = 0
    publisher = 0
    noPublisher = 0
    pages = 0
    noPages = 0
    series = 0
    noSeries = 0

    firstPubDict = {}
    no_firstPub = []
    typesDict = {}
    yearsDict = {}
    no_year = []
    bookTitleDict = {}
    no_bookTitle = []
    publisherDict = {}
    no_publisher = []
    pagesDict = {}
    no_pages = []

    count = {}

    for subdir, dirs, files in os.walk(rootdir):
        for file in files:
            if file.endswith('.json'):
                config = json.loads(open(os.path.join(subdir, file)).read())

                if "firstpub" in config:
                    firstPub += 1
                    count["FirstPublished"] = firstPub
                    firstPubDict.update({subdir.replace('-',' ').replace('data/',''): config["firstpub"]})
                else:
                    noFirstPub += 1
                    count["No FirstPublished"] = noFirstPub
                    no_firstPub.append(subdir.replace('-',' ').replace('data/',''))
                if "type" in config:
                    type += 1
                    count["Type"] = type
                    typesDict.update({subdir.replace('-',' ').replace('data/',''): config["type"]})
                else:
                    noType += 1
                    count["No Type"] = noType
                if "title" in config:
                    title += 1
                    count["Title"] = title
                else:
                    noTitle += 1
                    count["No Title"] = noTitle
                if "year" in config:
                    year += 1
                    count["year"] = year
                    yearsDict.update({subdir.replace('-',' ').replace('data/',''): config["year"]})
                else:
                    noYear += 1
                    count["No Year"] = noYear
                    no_year.append(subdir.replace('-',' ').replace('data/',''))
                if "booktitle" in config:
                    bookTitle += 1
                    count["Booktitle"] = bookTitle
                    bookTitleDict.update({subdir.replace('-',' ').replace('data/',''): config["booktitle"]})
                else:
                    noBookTitle += 1
                    count["No Booktitle"] = noBookTitle
                    no_bookTitle.append(subdir.replace('-',' ').replace('data/',''))
                if "publisher" in config:
                    publisher += 1
                    count["Publisher"] = publisher
                    publisherDict.update({subdir.replace('-',' ').replace('data/',''): config["publisher"]})
                else:
                    noPublisher += 1
                    count["No Publisher"] = noPublisher
                    no_publisher.append(subdir.replace('-',' ').replace('data/',''))
                if "pages" in config:
                    pages += 1
                    count["pages"] = pages
                    pagesDict.update({subdir.replace('-',' ').replace('data/',''): config["pages"]})
                else:
                    noPages += 1
                    count["No Pages"] = noPages
                    no_pages.append(subdir.replace('-',' ').replace('data/',''))
                if "series" in config:
                    series += 1
                    count["Series"] = series
                else:
                    noSeries += 1
                    count["No Series"] = noSeries

    """those functions write the data into .json files"""
    json.dump(firstPubDict, open("ignore/evaluation/first-published.json",'w'))
    json.dump(no_firstPub, open("ignore/evaluation/missing-firstPubl.json", 'w'))
    json.dump(typesDict, open("ignore/evaluation/types.json", 'w'))
    json.dump(yearsDict, open("ignore/evaluation/years.json", 'w'))
    json.dump(no_year, open("ignore/evaluation/no-years.json", 'w'))
    json.dump(bookTitleDict, open("ignore/evaluation/booktitles.json", 'w'))
    json.dump(no_bookTitle, open("ignore/evaluation/no-years.json", 'w'))
    json.dump(publisherDict, open("ignore/evaluation/publisher.json", 'w'))
    json.dump(no_publisher, open("ignore/evaluation/no-publisher.json", 'w'))
    json.dump(pagesDict, open("ignore/evaluation/pages.json", 'w'))
    json.dump(no_pages, open("ignore/evaluation/no-pages.json", 'w'))
    json.dump(count, open("ignore/evaluation/count.json", 'w'))

    print("\n")
    print("Counter: ")
    pprint(count)
    print("\n")
    print("Works from which we know the date: ")
    pprint(firstPubDict)



readData()
