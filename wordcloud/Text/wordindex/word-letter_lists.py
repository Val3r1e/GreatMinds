import os
from os import path
import sys
from bs4 import BeautifulSoup
import bs4
import re
import nltk
from nltk.corpus import PlaintextCorpusReader as PCR
from nltk import word_tokenize
import json
import pickle

def get_all_words():

    #direc = "../nouns_steps/whole/"
    direc = "../filtered_letters/"

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

def create_word_index2():
    
    root = "../filtered_letters/" 
    words = get_all_words()
    names = ["CSchiller", "CStein", "CGoethe", "FSchiller"]
    index = {}
    wunschpunsch = [file.replace(".txt", "") for file in os.listdir(root)]

    for word in words:
        print(word)
        filenames = []
        for file in os.listdir(root):
            if file.endswith(".txt"):
                filename = os.path.join(root, file)
                f_name = file.replace(".txt", "")
                # visibility[f_name] = False;
                with open(filename, 'r') as openfile:
                    #print(filename)
                    raw = openfile.read()
                    tokens = word_tokenize(raw)
                    letter_words = [w.casefold() for w in tokens]
                    if word.casefold() in letter_words:
                        filenames.append(f_name)
            else:
                pass
        
        index[word] = filenames
    
    index["wunschpunsch"] = wunschpunsch
    json.dump(index, open("word-letter_index5.json", 'w'))
    #json.dump(visibility, open("visibility.json", 'w'))

def main():
    
    create_word_index2()
    #get_all_words()

if __name__ == '__main__':
    main()

