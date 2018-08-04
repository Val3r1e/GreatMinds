import nltk
from nltk.corpus import PlaintextCorpusReader
import pickle

root = '../Charlotte/'
wordlist = PlaintextCorpusReader(root, '.*')
wordlist.fileids()
charlotte = wordlist.words('Charlotte.txt')
# other = wordlist.words('other.txt')
# join = charlotte + other


with open('nltk_german_classifier_data.pickle', 'rb') as f:
    tagger = pickle.load(f)

charlotte_tagged = tagger.tag(charlotte)

with open('tagged_charlotte_data.pickle', 'wb') as f:
    pickle.dump(charlotte_tagged, f)


charlotte_nouns = []

for word in charlotte_tagged:
    if x[1] == 'NN':
        charlotte_nouns.append(x[0])
