import json
import sys
from sklearn.feature_extraction.text import TfidfVectorizer

def text_all_words():
    '''gets the text of each letter containing a certain word
    word_list: contains all possible nouns once as a map with all the letters containg that noun'''

    with open('word-letter_index.json') as f:
        word_list = json.load(f)

    #print(word_list)

    for word in word_list:
        docs = []
        text = ""
        for letter in word_list[word]:
            name = letter + ".txt"
            filename = "../filtered_letters/" + name

            with open(filename, 'r') as openfile:
                text += openfile.read()

        # Hier solls nur ein Dokument geben, da pro Wort ja nur eine WC
        # erzeugt wird. Falls das noch gefiltert werden soll, muss das 
        # noch ergänzt werden wie im wc_generatore  
        docs.append(text)
        print(word)
        #print(docs)
        if docs[0] != '':
            scores, terms = create_tfidf_score(docs)
            for doc_scores in scores:
                #für jedes Dokument (also für jede wordcloud, die erzeugt wird), wird ein dict angelegt
                score_dict = {}
                for i in range(len(doc_scores)):
                    score_dict[terms[i]] = doc_scores[i]

                sorted_score_dict = sorted(score_dict.items(), key=lambda x:x[1], reverse=True)

                term_words = {}
                for entry in sorted_score_dict:
                    term_words[entry[0]] = entry[1]
                
                #pprint(score_dict)
                scores_to_json(term_words, word)
        else:
            pass



def create_tfidf_score(docs):
    '''
    computes the tf-idf scores for every word over all documents
    returns a matrix with [[scores doc 1],[scores doc 2],[...], ...]
    and an array with all the scored words (so that the scores index matches with the words)
    '''
    try:
        vectorizer = TfidfVectorizer()
        response = vectorizer.fit_transform(docs)
        terms = vectorizer.get_feature_names()
        scores = response.toarray()
    except ValueError:
        pass

    return scores, terms

def scores_to_json(score_dict, word):
    
    to_write = {"data":[]}
    list_to_write = []

    for key in score_dict:
        list_to_write.append({"text":key, "count":score_dict[key]})
    
    json.dump(list_to_write, open("../wc_per_word/%s.json" %word, 'w'))

def main():

    text_all_words()

if __name__ == '__main__':
    main()
