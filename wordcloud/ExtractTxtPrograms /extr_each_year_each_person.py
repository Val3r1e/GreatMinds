from bs4 import BeautifulSoup
import bs4
import os
import sys
from webbrowser import open_new_tab
from collections import defaultdict

'''
Terminal:
python3 extr_each_year_each_person.py "../../Letters/Charlotte-Schiller/html/"
python3 extr_each_year_each_person.py "../../Letters/Charlotte-von-Stein/html/"
python3 extr_each_year_each_person.py "../../Letters/Friedrich-Schiller/html/"
python3 extr_each_year_each_person.py "../../Letters/Christiane-Goethe/html/"
'''

def join_by_year(direc):
    '''joins the txt files for each year per person'''
    
    data = defaultdict(list)
    # it's amazing, it's a dict containing lists for each key *_* How great is that??

    for file in os.listdir(direc):
        if file.endswith(".html"):
            filename = os.path.join(direc, file)
            with open(filename, "r") as openfile:
                soup = BeautifulSoup(openfile, 'html.parser')

                txt_body = ""
                p_counter = 0
                document = soup.find_all()

                for element in document:
                    if element.name == "p":
                        txt_body += "\n" + element.text
                        p_counter += 1
                    else:
                        pass
                
                if p_counter != 0:
                    txt_body.encode('ascii', errors='ignore')
                    filename = filename.replace(direc,"").replace(".html","")
                    f_name = filename.split("_")
                    name = f_name[0] + "_" + f_name[1]
                    data[name].append(txt_body)
    
    for key in data:
        #join all the list entries for each key to one big string per key (= the whole text of that year)
        string = ' '.join(data[key]) 
        into_txt(string, str(key))


def into_txt(whole, name):
        
    filename = name + ".txt"
    direc_name = (name.split("_"))[1]

    f = open("../txt/people/" + direc_name + "/" + filename, 'w') 
    f.write(whole)
    f.close()

    open_new_tab(filename)


#---------Main-----------

def main():

    root = sys.argv[1]
    
    join_by_year(root)

if __name__ == '__main__':
    main()