
# coding: utf-8

# In[111]:


from bs4 import BeautifulSoup as bs
import bs4
import os
import datetime
import webbrowser 
import sys
from pprint import pprint
import json


# In[112]:


direc = "C:\\Users\\kokts\\Desktop\\CS4DM\\visualizing-great-minds\\data\\briefe-an-charlotte-stein-band-1"
source = sys.argv[1]
destination = sys.argv[2]


# In[132]:


direc = "C:\\Users\\kokts\\Desktop\\CS4DM\\visualizing-great-minds\\data\\briefe-an-charlotte-stein-band-1"

def extract():
    """I left all the print-statements in it so it'll be easier for us to adapt the code to the other folders. If we don't need them
    eventually, we can throw them all out of course"""

    #direc = "../data/briefe-an-charlotte-stein-band-1"         #add your directory
   
    fileindex = 1
    year = "XXXX"                                    #in case there is no date
   


    for file in os.listdir(direc):
        if file.endswith(".html"):
            filename = os.path.join(direc, str(fileindex)+".html") # this way he runs through the files in the right order (so we get the right year for each letter)
            fileindex += 1
            with open(filename, "r", encoding="utf8") as openfile:
                soup = bs(openfile, 'lxml')
                print(filename+"\n")
                
                txt_body = ""
                html_body = []
                number = "YYY"
                date = ""
                h4_counter = 0
                    
                document = soup.find_all(["h3","h4","p"])
                print(document)
                print (type(number))
                html = []
                """to find out which tags exist in each document: """
                document = soup.find_all()
                tags = []
                for tag in document:
                    if tag.name not in tags:
                        tags.append(tag.name)
                print("Tags: ")
                print(tags)
                    
                for element in document:
                    if element.name == "h3":
                        year = (element.text).replace(".","")
                    elif element.name == "h4":
                        if h4_counter != 0:
                            print("Jetzt schreibe ich Nummer ", number)
                            intoHtml(year, number, date, html_body)
                            into_txt(year, number, date, txt_body)
                            txt_body = ""
                            html_body = []
                            print("Counter: ", h4_counter)
                            for tag in soup.find("h4").next_siblings:
                                if tag.name == "h4":
                                    break
                                else:
                                    if(tag.name == "p" or tag.name == "br" or tag.name == "a" or tag.name == "table" or tag.name == "hr" or tag.name == "ol" or tag.name == "u" or tag.name == "span" or tag.name == "b" or tag.name == "dl"):
                                        #(str(tag)) != '\n'):
                                        txt_body += (str(tag))
                                        html_body.append(tag)
                            print("Inside h4: ")
                            print(html_body)
                            intoHtml(year, number, date, html_body)
                            html_body = []
                            number = element.text
                            h4_counter += 1
                            print(number)
                        elif element.name == "p":
                            txt_body += "<br>"+element.text
                            html_body.append(element)
                                
                if h4_counter != 0:
                    print("Jetzt schreibe ich Nummer ", number)
                    intoHtml(year, number, date, html_body)
                    into_txt(year, number, date, txt_body)
                    txt_body = ""
                    html_body = []
                    #letter = []
                    print("Counter: ", h4_counter)
                    
    
                
    
                
                    


# In[133]:


def intoHtml(year, number, date, html_body):
    filename = date + " - " + number + '.html'
    f = open("C:\\Users\\kokts\\Desktop\\CS4DM\\visualizing-great-minds\\data\\briefe-an-charlotte-stein-band-1\\letters\\" + filename, 'w', encoding="utf8")
    
    #the %s is a placeholder for a variable --> they are defined below
    wrapper= """<!DOCTYPE HTML>
    <html lang="DE">
    <head>
        <meta charset="utf-8" />
        <title>%s, %s </title>
    </head>
    <body>
        <header>
            <h3>%s</h3>
            <h4>%s</h4>
            <h5>%s</h5>
        </header>
        <article> %s </article>
    </body>
    </html>"""

    #definition for %s
    whole = wrapper % (date, number, date, number, body)      #depending on the order e.g. date goes in place of first %s and so on
    f.write(whole)
    f.close()

    webbrowser.open_new_tab('file:///' + os.getcwd() + '/' + 'f')
    
    


# In[134]:


def into_txt(year, number, date, html_body):
    '''letter as raw txt (at least I hope it's raw^^)'''
    
    filename = year + " - " + number + '.txt'
    
    destination = "C:\\Users\\kokts\\Desktop\\CS4DM\\visualizing-great-minds\\data\\briefe-an-charlotte-stein-band-1\\letters\\"
    destination = destination.replace("html", "txt/")
    

    f = open(destination+filename, 'w') 

    html_body.encode('ascii', errors='ignore')

    wrapper= "%s \n %s \n %s \n %s"

    whole = wrapper % (year, number, date, body)
    f.write(whole)
    f.close()

    webbrowser.open_new_tab(filename)


# In[135]:


def metadata(direc):
    
     
    for file in os.listdir(direc):
        if file.endswith(".html"):
            filename = os.path.join(direc, file)
            with open(filename, "r") as openfile:
                soup = bs(openfile, 'lxml')
                print("\n\n"+filename+"\n")

                write_metadata(soup, filename, direc)


# In[136]:


def write_metadata(soup,filename, direc):
    '''metadata with collection, title, number, year, date, signature, author and recipient'''

    filename = filename.replace(".html",".json")
    name = filename.replace("C:\\Users\\kokts\\Desktop\\CS4DM\\visualizing-great-minds\\data\\briefe-an-charlotte-stein-band-1\\letters\\html","C:\\Users\\kokts\\Desktop\\CS4DM\\visualizing-great-minds\\data\\briefe-an-charlotte-stein-band-1\\letters\\meta")
    metadata = {}

    metadata["Collection"] = source.replace("data/","")

    # title and number
    head = soup.find("h4")
    headline = head.text
    split = headline.split('. ')
    if len(split)>1:
        metadata["Number"] = split[0]
        title = split[1]
        metadata["Title"] = split[1]
    else:
        metadata["Number"] = "none"
        title = split
        metadata["Title"] = split
        
    

    year = soup.find("h3")
   
    if year == None:
        metadata["Year"] = "None"
    else:
        metadata["Year"] = year.text

    date = soup.find("p", class_ = "date")
    if date == None:
         metadata["Date"] = "None"
    else:
         metadata["Date"] = date.text

    signature = soup.find("p", class_="signature")
    if signature == None:
        metadata["signature"] = "None"
    else:
        metadata["signature"] = signature.text

    """# author and recipient
    if title == "An Schiller." or "An Schiller":
        metadata["Author"] = "Goethe"
        metadata["Recipient"] = "Schiller"
    if title == "An Goethe." or "An Goethe":
        metadata["Author"] = "Schiller"
        metadata["Recipient"] = "Goethe"
        
    """
    print(metadata)
    json.dump(metadata, open(name,'w'))


# In[137]:


extract()


# In[138]:


metadata("C:\\Users\\kokts\\Desktop\\CS4DM\\visualizing-great-minds\\data\\briefe-an-charlotte-stein-band-1\\letters")

