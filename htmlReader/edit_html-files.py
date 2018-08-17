from bs4 import BeautifulSoup
import bs4
import os
import sys

'''
add an id to the body tag of each letter
eg:
python3
import add_ids_to_letters as addid
addid.open_file('../Letters/FrauSchiller/html/')
'''

def add_ids_to_letters(direc):

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

def give_class_to_buttons():

    filename = "../CodeForEndVisualization/ListOfLetters/LettersNestedList.html"
    with open(filename, "r") as openfile:
        soup = BeautifulSoup(openfile, 'html.parser')
        buttons = soup.find_all("button") 
        for button in buttons:
            button["class"] = "openLetterButton"
        with open(filename, 'w') as f:
            f.write(str(soup))

def give_class_to_toggle_img():
    filename = "../CodeForEndVisualization/ListOfLetters/LettersNestedList.html"
    with open(filename, "r") as openfile:
        soup = BeautifulSoup(openfile, 'html.parser')
        images = soup.find_all("img") 
        for image in images:
            image["class"] = "toggle_img"
        with open(filename, 'w') as f:
            f.write(str(soup))



def main():
    
    # direc = sys.argv[1]
    # add_ids_to_letters(direc)
    give_class_to_buttons()
    give_class_to_toggle_img();

if __name__ == '__main__':
    main()
