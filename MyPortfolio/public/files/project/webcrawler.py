#Author: JohnM
 
import requests
from bs4 import BeautifulSoup
 
URL = "http://www.phenomenex.com"
 
checkedList = {"/home/index" : True}
 
def CrawlWebsite(_currentUrl, _checkedUrlList, level):
    if level == 20:
        return
 
    try:
        req = requests.get(_currentUrl)
    except:
        print("ERROR COULD NOT GET REQUEST. URL:", _currentUrl)
        return
 
    if req.status_code != requests.codes.ok:
        print("ERROR STATUS CODE NOT 200. URL:", _currentUrl)
        return
 
    soup = BeautifulSoup(req.text)
 
    print(_currentUrl)
 
    toSearchLink = []
 
    for a in soup.find_all('a', href = True):
        link = a['href'].lower()
 
        if "javascript" not in link and "#" not in link and "." not in link:
 
            if link not in _checkedUrlList:
                _checkedUrlList[link] = True
                toSearchLink.append(URL + link)
                print("LINK ADDED!: ",link)
           
    
    for nextLink in toSearchLink:
        CrawlWebsite(nextLink, _checkedUrlList, (level + 1))
 
 
 
CrawlWebsite(URL, checkedList, 0)
