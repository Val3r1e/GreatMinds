from pytagcloud import create_tag_image, create_html_data, make_tags, LAYOUT_MIX
from pytagcloud.lang.counter import get_tag_counts
from pytagcloud.colors import COLOR_SCHEMES
import webbrowser
import re
from nltk.corpus import stopwords
from nltk import word_tokenize
from collections import Counter
from string import Template
import os
import time

# f = open("../corpus/CSchiller/1797_CSchiller.txt", 'r')
# text = f.read()
# words = re.findall(r'\w+', text)
# stops = set(stopwords.words("german"))
# meaningful_words = [w for w in words if not w in stops]
# lower_words = [word.lower() for word in meaningful_words]

# word_counts = Counter(lower_words)
# counts = dict(word_counts)
# text = ""
# for i in counts.keys():
#     if counts[i] > 11: 
#         text = text + (' ' + i) * counts[i]
def wordcloud(direc):
    
    text = ""

    with open(direc) as f:
        lines = f.readlines()
        text = "".join(lines)

    words = word_tokenize(text)

    tags = make_tags(get_tag_counts(text), maxsize=90)
    data = create_html_data(tags, (1600,1200), layout = LAYOUT_MIX, fontname='Philiosopher', rectangular=True)

    template_file = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../corpus/'), 'r')    
    html_template = Template(template_file.read())
     
    context = {}
     
    tags_template = '<li class="cnt" style="top: %(top)dpx; left: %(left)dpx; height: %(height)dpx;"><a class="tag %(cls)s" href="#%(tag)s" style="top: %(top)dpx;\
    left: %(left)dpx; font-size: %(size)dpx; height: %(height)dpx; line-height:%(lh)dpx;">%(tag)s</a></li>'
     
    context['tags'] = ''.join([tags_template % link for link in data['links']])
    context['width'] = data['size'][0]
    context['height'] = data['size'][1]
    context['css'] = "".join("a.%(cname)s{color:%(normal)s;}\
    a.%(cname)s:hover{color:%(hover)s;}" %
                              {'cname':k,
                               'normal': v[0],
                               'hover': v[1]} 
                             for k,v in data['css'].items())
     
    html_text = html_template.substitute(context)
     
    html_file = open(os.path.join(self.test_output, 'cloud.html'), 'w')
    html_file.write(html_text)
    html_file.close() 

wordcloud("../corpus/CSchiller/1797_CSchiller.txt")