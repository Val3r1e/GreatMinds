import os
from os import path
import sys
from bs4 import BeautifulSoup
import bs4
import re

def get_letter_lists(word):

    root = "../Text/nouns/"
    names = ["whole", "CSchiller", "CStein", "CGoethe", "FSchiller"]
    filenames = []

    for name in names:
        direc = root + name + "/"
        for file in os.listdir(direc):
            if file.endswith(".txt"):
                filename = os.path.join(direc, file)
                with open(filename, 'r') as openfile:
                    text = (openfile.read()).casefold()
                    if word.casefold() in text:
                        filenames.append(file)

    print("Dateien:",filenames)
    print(len(filenames))

def list_to_html(filenames):

    wrapper = """
    <div class="WordLetterList">
        <ul>
            %s
        </ul>
    </div>"""

    buttons = []

    for name in filenames:
        buttons.append("""<button onclick="Load(this.id)" id=%s> %s </button>""" %())



def main():
    
    word = sys.argv[1]
    get_letter_lists(word)

if __name__ == '__main__':
    main()

