'''
train and create a german pos-tagger to be used with nltk
(done in the python shell by command line, just copy everything)
must-have: TIGER Corpus in conll09 format from uni stuttgart
''''

import nltk
import random
from ClassifierBasedGermanTagger import ClassifierBasedGermanTagger

corp = nltk.corpus.ConllCorpusReader('.', 'tiger_release_aug07.corrected.16012013.conll09',
                                     ['ignore', 'words', 'ignore', 'ignore', 'pos'],
                                     encoding='utf-8')

tagged_sents = [sentence for sentence in corp.tagged_sents()]
i = math.floor(len(tagged_sents)*0.1)
test_sents = tagged_sents[0:i]
train_sents = tagged_sents[i:]
tagger = ClassifierBasedGermanTagger(train = train_sents)
accuracy = tagger.evaluate(testing_sents)


#--------------save trained tagger (done)-------------------------

import pickle
with open('nltk_german_classifier_data.pickle', 'wb') as f:
    pickle.dump(tagger, f, protocol=2)


#-------------load trained tagger and use on an example ----------

with open('nltk_german_classifier_data.pickle', 'rb') as f:
    my_tagger = pickle.load(f)

my_tagger.tag(['Goethe', 'war', 'ein', 'komischer', 'Vogel'])