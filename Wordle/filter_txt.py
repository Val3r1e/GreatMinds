import sys
import os
from webbrowser import open_new_tab
import nltk
from nltk.corpus import stopwords
import decades_txt

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

            name = filename.replace("txt/","").replace(".txt","")
            name = "/filtered/filtered_" + name
            print(name)
            
            decades_txt.intoTxt(filtered, name)

def main():
    
    root = sys.argv[1]
    
    filter_txt(root)

if __name__ == '__main__':
    main()