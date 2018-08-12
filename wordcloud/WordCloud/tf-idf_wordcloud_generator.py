import sys
import math
import os
import json
from os import path
import numpy as np 
from PIL import Image
from sklearn.feature_extraction.text import TfidfVectorizer
from wordcloud import WordCloud, STOPWORDS
from stop_words import get_stop_words
from pprint import pprint
from collections import defaultdict

'''
python3 tf-idf_wordcloud_generator.py "../Text/nouns/"
'''

def generate_wc(direc, name, steps):
    '''generates wordclouds ranked with tf-idf scores'''
    
    direc = direc + name + "/"
    
    if int(steps) == 0:
        data, ids = whole(direc)
    elif int(steps) == 1:
        data, ids = each_year(direc)
    else:
        data, ids = step_years(direc, steps)

    scores, terms = create_tfidf_score(data)
    score_dict = {}
    year_counter = 0

    for doc_scores in scores:
        #für jedes Dokument (also für jede wordcloud, die erzeugt wird), wird ein dict angelegt
        for i in range(len(doc_scores)):
            score_dict[terms[i]] = doc_scores[i]
        
        year = ids[year_counter]
        year_counter += 1
        
        #pprint(score_dict)
        #create_wordcloud(score_dict, name, steps, year)
        scores_to_json(score_dict, name, steps, year)


#------------------ create different datasets --------------------

def whole(direc):
    data = []
    ids = ["0000"]

    for file in os.listdir(direc):
        filename = os.path.join(direc, file)
        if file.endswith(".txt"):
            with open(filename, "r") as openfile:
                text = openfile.read()
                data.append(text)
    
    text = [" ".join(data)]
    return text, ids


def each_year(direc):
    data = []
    ids = []
    for file in os.listdir(direc):
        filename = os.path.join(direc, file)
        name = ((filename.replace(direc, "")).split("_"))[1]
        if file.endswith(".txt"):
            with open(filename, "r") as openfile:
                text = openfile.read()
                ids.append(name)
                data.append(text)

    return data, ids


def step_years(direc, steps):
    if int(steps) == 5:
        years = [i for i in range(1775, 1831, 5)]
    elif int(steps) == 10:
        years = [i for i in range(1775, 1835, 10)]
    else:
        print("this shouldn't have happend")
        sys.exit(1)
    
    data = []
    ids = []
    temp_data = defaultdict(list)

    for file in os.listdir(direc):
        filename = os.path.join(direc, file)
        f_name = ((filename.split("/"))[-1]).replace(".txt","")
        file_year = (f_name.split("_"))[1]
        if file.endswith(".txt"):
            for year in years:
                if int(file_year) <= year:
                    with open(filename, "r") as openfile:
                        text = openfile.read()
                        temp_data[year].append(text)
                        break
    
    for key in temp_data:
        data.append(' '.join(temp_data[key]))
        ids.append(key)
    
    return data, ids


#---------------- create the tf-idf score based on the datasets ---------------

def create_tfidf_score(docs):
    '''
    computes the tf-idf scores for every word over all documents
    returns a matrix with [[scores doc 1],[scores doc 2],[...], ...]
    and an array with all the scored words (so that the scores index matches with the words)
    '''

    vectorizer = TfidfVectorizer()
    response = vectorizer.fit_transform(docs)
    terms = vectorizer.get_feature_names()
    scores = response.toarray()

    return scores, terms

    # print(vectorizer)
    # print(response)
    # print(terms)
    # print(resp_array)

    # create a dict with {word:score} for all words:

    # term_dict = {}
    # number_of_docs = len(docs)
    # not_full = True

    # for i in range(number_of_docs):

    #     for j in range(len(terms)):
    #         if scores[i][j] != 0:
    #             term_dict[terms[j]] = scores[i][j]
    #         else:
    #             pass

    #         if len(term_dict) == len(terms):
    #             break
        
    #     if len(term_dict) == len(terms):
    #         break
    
    # return term_dict


#----------------------- create the actual wordcloud ------------------------

def create_wordcloud(score_dict, name, steps, year):
    currdir = path.dirname(__file__)

    stopwords = get_stop_words("german")
    stopwords += ["nov", "märz", "jun", "morgen", "jan", "apr", "sept" "leben", "möchten", "frau"]
  
    mask = np.array(Image.open(path.join(currdir, "shapes/cloud.png")))
    wc = WordCloud(background_color="white",
                    font_path="/System/Library/Fonts/HelveticaNeue.ttc",  #Add Path to Fonts on your Computer
                    max_words=80,
                    mask=mask,                  #masks whatever figure you put in a picture of! Is really awesome!
                    stopwords=stopwords,
                    prefer_horizontal=1.2,      #this way only horizontal words, to change, just delete
                    #colormap="tab20b")
                    colormap="plasma",          #Add different Colormap here, can be found here: https://matplotlib.org/users/colormaps.html
                    relative_scaling=1)

    wc.generate_from_frequencies(score_dict)
    wc.to_file(path.join(currdir, "clouds_tf-idf/%s/%s/%s_%s_%s.png" %(name, steps, name, year, steps)))

#---------------- write the scores to .json files for javascript -----------------

def scores_to_json(score_dict, name, steps, year):
    
    to_write = {"data":[]}
    list_to_write = []

    for key in score_dict:
        list_to_write.append({"text":key, "count":score_dict[key]})
    
    json.dump(list_to_write, open("json_cloud_data_tf-idf/%s/%s/%s_%s_%s.json" %(name, steps, name, year, steps), 'w'))


#------------------------ error and main ---------------------------

def error(string):
    
    names = ["whole", "CSchiller", "CStein", "CGoethe", "FSchiller"]
    times = ["0", "1", "5", "10"]
    
    test = string.split(" ")
    
    if len(test) != 2:
        print('Please enter one of the given names and one of the given numbers separated by a whitespace!')
        sys.exit(1)
        
    if not test[1].isdigit():
        print("The second parameter has to be one of the given numbers.")
        sys.exit(1)
    
    if ((test[0] not in names) or (test[1] not in times)):
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

    # #------------------ create manually ------------------
    # repeat = True
    # print("\nCreates wordclouds by tf-idf scores for the given documents.\n" +
    #       "Pleas select a name and a period of time from the followin lists:\n" +
    #       "1. name ('whole', 'CGoethe', 'CSchiller', 'CStein' or 'FSchiller')\n" + 
    #       "2. period of time ('0', '1', '5', '10')\n"+
    #       "For example: 'all 0' creates scores for all terms over all documents.\n")

    # while repeat:
    #     s = input("Please enter a name followed by a whitespace and a number: \n")

    #     error(s)
    #     params = s.split(" ")
    #     name = params[0]
    #     steps = params[1]
    #     generate_wc(root, name, steps)

    #     r = input("\nCreate another Cloud? Press any key (except n) for yes or 'n' for no. \n")

    #     if r == "n":
    #         repeat = False

if __name__ == '__main__':
    main()
