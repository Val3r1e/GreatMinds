import nltk
from nltk.corpus import PlaintextCorpusReader
import pickle
import os
from collections import Counter
import sys

'''tagging the txt-files, creating a noun list and count the frequencies. List, Conter and tagged text are pickled.
python3 noun_lists.py "../corpus/CSchiller"
python3 noun_lists.py "../corpus/CStein"
python3 noun_lists.py "../corpus/CGoethe"
python3 noun_lists.py "../corpus/FSchiller"
python3 noun_lists.py "../corpus/whole/decades"
python3 noun_lists.py "../corpus/whole/every_five_years"
python3 noun_lists.py "../corpus/whole/every_year"
'''

def tag_files(direc):

    with open('nltk_german_classifier_data.pickle', 'rb') as t:
        tagger = pickle.load(t)

    for subdir, dirs, files in os.walk(direc):
        for file in files:
            if ((file.endswith('.txt')) and (not("nounlist" in file))):
                filename = os.path.join(direc, file)
                wordlist = PlaintextCorpusReader(direc, '.*')
                name = (filename.split("/"))[-1]
                #to_tag = wordlist.words(filename)
                to_tag = wordlist.words(name)

                tagged = tagger.tag(to_tag)
                name = name.replace(".txt", "")
                p = filename.split("/")
                path = p[0] + "/" + p[1] + "/" + p[2] + "/" + p[3]+ "/tagged/"

                with open('%stagged_%s_data.pickle' %(path, name), 'wb') as f:
                    pickle.dump(tagged, f)
                
                nouns = []
                for word in tagged:
                    if word [1] == 'NN':
                        nouns.append(word[0])

                path = path.replace("tagged", "nouns")
                with open('%snoun-list_%s_data.pickle' %(path, name), 'wb') as f:
                    pickle.dump(nouns, f)
                
                #count noun frequency:
                noun_frequency = Counter(nouns)
                with open('%snoun-frequ_%s_data.pickle' %(path, name), 'wb') as f:
                    pickle.dump(noun_frequency, f)
                
                with open('%snounlist_%s.txt' %(path, name), 'w') as f:
                    f.write("\n".join(nouns))

#---------Main-----------

def main():

    direc = sys.argv[1]
    
    tag_files(direc)

if __name__ == '__main__':
    main()
