import nltk
import string
import os

from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem.porter import PorterStemmer

path = '../../../../../Downloads/tf-idf'
token_dict = {}

def tokenize(text):
    tokens = nltk.word_tokenize(text)
    stems = []
    for item in tokens:
        stems.append(PorterStemmer().stem(item))
    return stems

for dirpath, dirs, files in os.walk(path):
    for f in files:
        fname = os.path.join(dirpath, f)
        print("fanme=", fname)
        with open(fname, "rb") as f:
            text = f.read()
            token_dict[f] = text.lower().translate(None, string.punctuation)

tfidf = TfidfVectorizer(tokenizer=tokenize, stop_words='english')
tfs = tfidf.fit_transform(token_dict.values())

str = 'all great and precious things are lonely.'
response = tfidf.transform([str])
print (response)

feature_names = tfidf.get_feature_names()
for col in response.nonzero()[1]:
    print(feature_names[col], ' - ', response[0, col])

#------------- and this actually works: -----------------

S1 = "The car is driven on the road"
S2 = "The truck is driven on the highway"

vectorizer = TfidfVectorizer()
response = vectorizer.fit_transform([S1, S2])
terms = vectorizer.get_feature_names()
resp_array = response.toarray()

#print(vectorizer)
print(response)
print(terms)
print(resp_array)

term_dict = {}
number_of_docs = 2
not_full = True

for i in range(number_of_docs):
    for j in range(len(terms)):
        if resp_array[i][j] != 0:
            term_dict[terms[j]] = resp_array[i][j]
        else:
            pass

        if len(term_dict) == len(terms):
            break
    
    if len(term_dict) == len(terms):
        break
        