import os
from os import path
import sys
from bs4 import BeautifulSoup
import bs4
import re
import nltk
from nltk.corpus import PlaintextCorpusReader as PCR
import json
import pickle

def get_all_words():

    direc = "../nouns_steps/whole/"

    words = set()

    corpus = PCR(direc, '.*')
    all_files = corpus.fileids()
    txt_files = []
    #zuerst Liste aller zu durchsuchenden Files erstellen:
    for file in all_files:
        if ".txt" in file:
            txt_files.append(file)
    
    #dann aus jedem dieser Files alle Wörter zum Set hinzufügen(doppelte werden übergangen)
    for file in txt_files:
        text = corpus.words(file)
        for word in text:
            words.add(word.casefold())

    words = sorted(words)
    #print(words)
    #print(len(words))
    # json.dump(words, open("../all_nouns.json", 'w'))
    # with open('../all_nouns_set.pickle', 'wb') as f:
    #     pickle.dump(words, f)

    return words

def create_word_index():

    root = "../../../Letters/" 
    letter_root = "../../../AllLetters"
    words = get_all_words()
    names = ["CSchiller", "CStein", "CGoethe", "FSchiller"]
    index = {}
    wunschpunsch = [file.replace(".html", "") for file in os.listdir(letter_root)]
    #visibility = {}

    for word in words:
        filenames = []
        for name in names:
            direc = root + name + "/txt"
            for file in os.listdir(direc):
                if file.endswith(".txt"):
                    filename = os.path.join(direc, file)
                    f_name = file.replace(".txt", "")
                   # visibility[f_name] = False;
                    with open(filename, 'r') as openfile:
                        text = (openfile.read()).casefold()
                        if word.casefold() in text:
                            filenames.append(f_name)
        
        index[word] = filenames
    
    index["wunschpunsch"] = wunschpunsch
    json.dump(index, open("word-letter_index2.json", 'w'))
    #json.dump(visibility, open("visibility.json", 'w'))


def main():
    
    create_word_index()
    #get_all_words()

if __name__ == '__main__':
    main()

