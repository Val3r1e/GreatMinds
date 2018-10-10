import os
import sys
import nltk
from nltk import word_tokenize
from collections import Counter
import json


def get_frequencies():
    direc = "../filtered_letters/"
    data = {};
    for file in os.listdir(direc):
        if file.endswith(".txt"):
            name = file.replace(".txt","")
            filename = os.path.join(direc, file)
            #print(filename)
            with open(filename,'r') as f:
                raw = f.read()
                tokens = word_tokenize(raw)
                words = [w.casefold() for w in tokens]
                word_counter = Counter(words)
                data[name] = word_counter

    json.dump(data, open("../noun_frequencies/noun_frequencies.json", 'w'))

get_frequencies()
        
