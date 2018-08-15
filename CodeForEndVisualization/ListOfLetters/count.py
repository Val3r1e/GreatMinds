from bs4 import BeautifulSoup 
import bs4

def count():

    with open("LettersNestedList.html","r") as openfile:

        soup = BeautifulSoup(openfile, 'html.parser')

        #all = len(soup.find_all("button"))

        for tag in soup.find_all("li"):
            
            id = tag.get("id")
            #button = soup.find_all("button")
            buttonLength = len(soup.find_all("button"))

            i = 0

            for tag2 in soup.find_all("button"):
                
                buttonId = tag2.get("id")

                

                if buttonId.startswith(id):
                    
                    i += 1

                    print( id, " ", buttonId, " ", i)
        
       





count()