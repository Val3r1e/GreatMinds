
# coding: utf-8

# In[10]:


from bs4 import BeautifulSoup as bs
import bs4
import os
import datetime
import webbrowser 
import sys

direc = "C:\\Users\\kokts\\Desktop\\CS4DM\\visualizing-great-minds\\data\\briefe-an-charlotte-stein-band-1"

def extract():
    """I left all the print-statements in it so it'll be easier for us to adapt the code to the other folders. If we don't need them
    eventually, we can throw them all out of course"""

    #direc = "../data/briefe-an-charlotte-stein-band-1"         #add your directory

    fileindex = 1
    date = "XXXX"                                    #in case there is no date

    for file in os.listdir(direc):
        if file.endswith(".html"):
            filename = os.path.join(direc, str(fileindex)+".html") # this way he runs through the files in the right order (so we get the right year for each letter)
            fileindex += 1
            with open(filename, "r", encoding="utf8") as openfile:
                soup = bs(openfile, 'lxml')
                print(filename+"\n")

                body = ""
                number = "YYY"
                h4_counter = 0
                document = soup.find_all(["h3","h4","p"])
                print(document)
                print (type(number))
                
                html = []

                for element in document:
                    if element.name == "h3":
                        date = element.text
                        

                    elif element.name == "h4":
                        if h4_counter != 0:
                            print("Jetzt schreibe ich Nummer ", number)
                            #intoHtml(date, number, body)
                            body = ""
                            print("Counter: ", h4_counter)
                            
                            for tag in soup.find("h4").next_siblings:
                                
                                if tag.name == "h4":
                                    break
                                else:
                                    if tag.name == "['\n', '" or tag.name == "', '\n', '" or tag.name == "\xa0" or tag.name == "', '\n']":
                                        html.append(tag)
                                    else:
                                        html.append(str(tag))
                            print("Inside h4: ")
                            print(html)
                            newHtml(date,number,html)
                            html = []
                            

                        number = element.text
                        h4_counter += 1
                        print(number)

                    elif element.name == "p":
                        body += "<br>"+element.text

                if h4_counter != 0:
                    print("Jetzt schreibe ich Nummer ", number)
                    #intoHtml(date, number, body)
                    body = ""
                    print("Counter: ", h4_counter)
                    
                
                    


# In[11]:


def newHtml(date, number, body):
    filename = date + " - " + number + '.html'
    f = open("C:\\Users\\kokts\\Desktop\\CS4DM\\visualizing-great-minds\\data\\briefe-an-charlotte-stein-band-1\\letters\\" + filename, 'w', encoding="utf8")
    
    #the %s is a placeholder for a variable --> they are defined below
    wrapper= """<html>
    <head>
    <title>%s, %s </title>
    </head>
    <body><h4>%s - %s</h4><p>%s</p></body>
    </html>"""

    #definition for %s
    whole = wrapper % (date, number, date, number, body)      #depending on the order e.g. date goes in place of first %s and so on
    f.write(whole)
    f.close()

    webbrowser.open_new_tab('file:///' + os.getcwd() + '/' + 'f')
    
    


# In[12]:


def intoHtml(date, number, body):

    filename = date + " - " + number + '.html'
    f = open("C:\\Users\\kokts\\Desktop\\CS4DM\\visualizing-great-minds\\data\\briefwechsel-mit-seiner-frau-band-i\\letters\\" + filename, 'w', encoding="utf8")

    #the %s is a placeholder for a variable --> they are defined below
    wrapper= """<html>
    <head>
    <title>%s, %s </title>
    </head>
    <body><h4>%s - %s</h4><p>%s</p></body>
    </html>"""

    #definition for %s
    whole = wrapper % (date, number, date, number, body)      #depending on the order e.g. date goes in place of first %s and so on
    f.write(whole)
    f.close()

    webbrowser.open_new_tab('file:///' + os.getcwd() + '/' + 'f')


# In[ ]:


extract()

