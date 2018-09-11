''''
python3 filter_txt.py txt/every_five_years
filters the txt files in the given direc by the stopwordlist

'''

import sys
import os
from webbrowser import open_new_tab
import nltk
from nltk.corpus import stopwords
from nltk.corpus import PlaintextCorpusReader
import pickle

def filter_txt():
    '''filter letter by stopwords'''

    direc = "../../Letters/"
    stopWords = set(stopwords.words('german'))

    for subdir, dirs, files in os.walk(direc):
        for file in files:
            text = ""
            filtered = ""
            if file.endswith(".txt"):
                filename = os.path.join(subdir, file)
                #print(filename)
                with open(filename, "r") as openfile:
                    lines = openfile.readlines()
                    text = "".join(lines)

                text = nltk.word_tokenize(text)

                for w in text:
                    if (w.lower()).strip() not in stopWords:
                        filtered += w + " "

                name = filename.replace(direc,"")
                
                intoTxt(filtered, file)

def noun_filter():
    '''filter letters so only the nouns come through'''

    direc = "../../Letters/"
    stopWords = set(stopwords.words('german'))
    with open('../POS_tagger/nltk_german_classifier_data.pickle', 'rb') as t:
        tagger = pickle.load(t)
    
    for subdir, dirs, files in os.walk(direc):
        for file in files:
            if subdir.split("/")[-1] == "txt":
                wordlist = PlaintextCorpusReader(subdir, '.*')
                text = ""
                filtered = ""
                if file.endswith(".txt"):
                    filename = os.path.join(subdir, file)
                    to_tag_name = (filename.split("/"))[-1]
                    to_tag = wordlist.words(to_tag_name)
                    tagged = tagger.tag(to_tag)
                    to_tag_name = to_tag_name.replace(".txt", "")
                    path = "../Text/tagged_letters/"
                    with open('%stagged_%s.pickle' %(path, file.replace(".txt","")), 'wb') as f:
                        pickle.dump(tagged, f)
                    #print("dumped", file.replace(".txt",""))

                    nouns = []
                    for word in tagged:
                        if word[1] == 'NN':
                            nouns.append(word[0])
                    # print(file)
                    # print(nouns)
                    
                    # with open(filename, "r") as openfile:
                    #     lines = openfile.readlines()
                    #     text = "".join(lines)

                    # text = nltk.word_tokenize(text)

                    for w in nouns:
                        word = w.lower().strip()
                        if word not in stopWords:
                            filtered += w + " "
                    #print(filtered)
                    name = filename.replace(direc,"")
                    
                    intoTxt(filtered, file)
            else:
                pass


def intoTxt(whole, name):

    f = open("../Text/filtered_letters/" + name, 'w') 
    f.write(whole)
    f.close()

    open_new_tab(name)

def main():
    
    #filter_txt()
    noun_filter()
    print("done")

if __name__ == '__main__':
    main()