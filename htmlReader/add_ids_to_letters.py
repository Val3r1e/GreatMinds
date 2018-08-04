from bs4 import BeautifulSoup
import bs4
import os

'''
add an id to the body tag of each letter
eg:
python3
import add_ids_to_letters as addid
addid.open_file('../Letters/FrauSchiller/html/')
'''

def open_file(direc):

    for file in os.listdir(direc):
        if file.endswith(".html"):
            filename = os.path.join(direc, file)
            with open(filename, "r") as openfile:
                soup = BeautifulSoup(openfile, 'html.parser')
                name = filename.replace(direc,"")
                letter_id = name.replace(".html","")
                soup.find("body")["id"] = letter_id
                with open(filename, "w") as f:
                    f.write(str(soup))
                #print(letter_id)
