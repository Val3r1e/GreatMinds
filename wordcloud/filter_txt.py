'''python3 filter_txt.py txt/every_five_years
   filters the txt files in the given direc by the stopwordlist'''

import sys
import os
from webbrowser import open_new_tab
import nltk
from nltk.corpus import stopwords

def filter_txt(direc):

    stopWords = set(stopwords.words('german'))

    for file in os.listdir(direc):
        text = ""
        filtered = ""
        if file.endswith(".txt"):
            filename = os.path.join(direc, file)
            with open(filename, "r") as openfile:
                lines = openfile.readlines()
                text = "".join(lines)

            text = nltk.word_tokenize(text)

            for w in text:
                if (w.lower()).strip() not in stopWords:
                    filtered += w + " "

            name = filename.replace("txt/every_five_years/","").replace(".txt","")
            #name = "/filtered/filtered_" + name
            name = "filtered/filtered_" + name
            #print(name)
            
            intoTxt(filtered, name)

def intoTxt(whole, name):
    
    filename = name + ".txt"

    f = open("../wordcloud/txt/every_five_years/"+filename, 'w') 
    f.write(whole)
    f.close()

    open_new_tab(filename)

def main():
    
    root = sys.argv[1]
    
    filter_txt(root)

if __name__ == '__main__':
    main()