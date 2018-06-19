'''e.g.: python3 wordCloud_.py ../txt/filtered/filtered_til_1785.txt '''

import sys
from os import path
import numpy as np
from PIL import Image
from wordcloud import WordCloud, STOPWORDS
from stop_words import get_stop_words

def readTxt(name):
    
    currdir = path.dirname(__file__)
    
    text = ""

    with open(name) as f:
        lines = f.readlines()
        text = "".join(lines)

    mask = np.array(Image.open(path.join(currdir, "shapes/goethe.png")))     #for ex. exchange line for cloud

    stopwords = get_stop_words("german")

    stopwords += ["bey","seyn","heute", "muß", "ganz", "gar", "geht", "gleich", 
                "de", "et", "sey", "Nov", "März", "wohl", "allein", "eben", 
                "erst", "Jun", "sagen", "Morgen", "schon", "Jan", "Apr", "Leben", "möchte"]

    #Information about Wordcloud here: https://amueller.github.io/word_cloud/generated/wordcloud.WordCloud.html#wordcloud.WordCloud

    wc = WordCloud(background_color="white",
                    font_path="/System/Library/Fonts/HelveticaNeue.ttc",  #Add Path to Fonts on your Computer
                    max_words=200,
                    mask=mask,                  #masks whatever figure you put in a picture of! Is really awesome!
                    stopwords=stopwords,
                    #prefer_horizontal=1.2,      #this way only horizontal words, to change, just delete
                    colormap="tab20b")          #Add different Colormap here, can be found here: https://matplotlib.org/users/colormaps.html
    
    wc.generate(text)

    wc.to_file(path.join(currdir, "Wordclouds/til_1785.png"))


#readTxt("Charlotte2.txt")

def main():
    
    root = sys.argv[1]
    
    readTxt(root)

if __name__ == '__main__':
    main()#