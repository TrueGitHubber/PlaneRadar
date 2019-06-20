from requests import get
import sys
import json
import time

def writeDataPlanes(data):
    formatJson = {}
    formatJson["result"] = []
    i = 0
    for key in data:
        if(key != "full_count" and key != "version" and key != "stats"):
            formatJson["result"].append({})
            if(data[key][13] == ""):
                data[key][13] = None
            if(str(data[key][18]) == ""):
                data[key][18] = None
            if(str(data[key][8]) == ""):
                data[key][8]= None
            if(str(data[key][11]) == ""):
                data[key][11] = None
            if(str(data[key][12]) == ""):
                data[key][12] = None
            formatJson["result"][i]["flight"] = data[key][13]
            formatJson["result"][i]["airline"] = data[key][18]
            formatJson["result"][i]["latitude"] = data[key][1]
            formatJson["result"][i]["longitude"] = data[key][2]
            formatJson["result"][i]["direction"] = data[key][3]
            formatJson["result"][i]["height"] = data[key][4]
            formatJson["result"][i]["speed"] = data[key][5]
            formatJson["result"][i]["model"] = data[key][8]
            formatJson["result"][i]["departure"] = data[key][11]
            formatJson["result"][i]["arrival"] = data[key][12]
            i+=1

    f = open("nowPlanesInfo.json", "w", encoding = "utf-8")
    f.write(str(formatJson))
    f.close()
def getPlanes():
    t1 = time.time()
    try:
        url = "https://data-live.flightradar24.com/zones/fcgi/feed.js"
        headers = {}
        headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
        req = get(url, headers = headers, timeout = 10)
        data = req.json()
        writeDataPlanes(data)
        time.sleep(5-(time.time()-t1-0.0005))
    except:
        if "ReadTimeout" in str(sys.exc_info()):
            print("ReadTimeout")
            getPlanes()
        elif "sleep length must be non-negative" in str(sys.exc_info()):
            print("Too long")
        else:
            print(sys.exc_info())
            print(req.status_code)
            exit(1)
    print(time.time()-t1)

if __name__ == "__main__":
    while(1):
        getPlanes()