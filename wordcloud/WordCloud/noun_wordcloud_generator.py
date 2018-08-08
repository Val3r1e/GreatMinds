import sys
import os
from os import path
import numpy as np 
from PIL import Image
from wordcloud import WordCloud, STOPWORDS
from stop_words import get_stop_words
from pprint import pprint
from collections import defaultdict

'''
python3 noun_wordcloud_generator.py "../Text/nouns/"
'''

def generate_wc(direc, name, steps):
    '''
    decides which of the functions should be called depending on the given period of time
    '''

    direc = direc + name + "/"

    if int(steps) == 0:
        whole(direc, name, steps)
    elif int(steps) == 1:
        each_year(direc, name, steps)
    else:
         step_years(direc, name, steps)


#----------------------------- different datasets---------------------------------

def whole(direc, name, steps):
    '''creates dataset for the whole data of the given person'''
    data = []
    
    for file in os.listdir(direc):
        filename = os.path.join(direc, file)
        if file.endswith(".txt"):
            #print(filename)
            with open(filename, "r") as openfile:
                text = openfile.read()
                data.append(text)
    
    text = " ".join(data)

    create_wordcloud(text, name, steps, "whole")


def each_year(direc, name, steps):
    '''creates datasets for each year for the given person'''

    data = defaultdict(list)

    for file in os.listdir(direc):
        filename = os.path.join(direc, file)
        f_name = ((filename.split("/"))[-1]).replace(".txt","")
        year = (f_name.split("_"))[1]
        if file.endswith(".txt"):
            with open(filename, "r") as openfile:
                text = openfile.read()
                data[year].append(text)
    
    for key in data:
        text = ' '.join(data[key])
        create_wordcloud(text, name, steps, key)


def step_years(direc, name, steps):
    '''creates datasets for steps of five or ten years'''

    if int(steps) == 5:
        years = [i for i in range(1775, 1830, 5)]
    elif int(steps) == 10:
        years = [i for i in range(1775, 1835, 10)]
    else:
        print("this shouldn't have happend")
        sys.exit(1)
        
    data = defaultdict(list)

    for file in os.listdir(direc):
        filename = os.path.join(direc, file)
        f_name = ((filename.split("/"))[-1]).replace(".txt","")
        file_year = (f_name.split("_"))[1]
        if file.endswith(".txt"):
            for year in years:
                if int(file_year) <= year:
                    with open(filename, "r") as openfile:
                        text = openfile.read()
                        data[year].append(text)
                        break
    
    for key in data:
        text = ' '.join(data[key])
        create_wordcloud(text, name, steps, key)

#--------------------------- creating the actual wordcloud -------------------------------

def create_wordcloud(text, name, steps, year):
    currdir = path.dirname(__file__)

    stopwords = get_stop_words("german")
    stopwords += ["Nov", "März", "Jun", "Morgen", "Jan", "Apr", "Sept" "Leben", "Möchten", "Frau"]

    mask = np.array(Image.open(path.join(currdir, "shapes/cloud.png")))
    wc = WordCloud(background_color="white",
                    font_path="/System/Library/Fonts/HelveticaNeue.ttc",  #Add Path to Fonts on your Computer
                    max_words=300,
                    mask=mask,                  #masks whatever figure you put in a picture of! Is really awesome!
                    stopwords=stopwords,
                    prefer_horizontal=1.2,      #this way only horizontal words, to change, just delete
                    #colormap="tab20b")
                    colormap="Greens")          #Add different Colormap here, can be found here: https://matplotlib.org/users/colormaps.html
    
    wc.generate(text)
    wc.to_file(path.join(currdir, "clouds_nouns/%s/%s/%s_%s_%s.png" %(name, steps, name, year, steps)))


#------------------------ error and main ---------------------------
def error(string, names, steps):
    
    test = string.split(" ")
    
    if len(test) != 2:
        print('Please enter one of the given names and one of the given numbers separated by a whitespace!')
        sys.exit(1)
        
    if not test[1].isdigit():
        print("The second parameter has to be one of the given numbers.")
        sys.exit(1)
    
    if ((test[0] not in names) or (test[1] not in steps)):
        print("Please select one parameter of each of the given lists")
        sys.exit(1)

def main():

    root = sys.argv[1]

   #------------------- create all -----------------------
    names = ["whole", "CSchiller", "CStein", "CGoethe", "FSchiller"]
    steps = ["0", "1", "5", "10"]

    for name in names:
        for step in steps:
            generate_wc(root, name, step)
        print("Done with %s" %name)

    #------------------ create manually ------------------
    # repeat = True

    # print("\nCreates a wordcloud for the given options:\n" +
    #         "1. name ('whole', 'CGoethe', 'CSchiller', 'CStein' or 'FSchiller')\n" + 
    #         "2. period of time ('0', '1', '5', '10')\n"+
    #         "For example: 'all 0' creates a wordcloud depicting all available Letters.\n")

    # while repeat:
    #     s = input("Please enter a name followed by a whitespace and a number: \n")

    #     error(s, names, steps)
    #     params = s.split(" ")
    #     name = params[0]
    #     steps = params[1]
    #     generate_wc(root, name, steps)

    #     r = input("\nCreate another wordcloud? Press 'y'[yes] or 'n'[no]. \n")

    #     if r == "n":
    #         repeat = False

if __name__ == '__main__':
    main()