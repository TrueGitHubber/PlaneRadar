from requests import get
import sys
import json
import time

def getFilters():
    filters = {}
    f = open("filters.txt", "r", encoding = "utf-8")
    r = f.read().split('\n')
    print(r)
    f.close()
    for filter in r:
        nameFilter, content =filter.split("=")
        filters[nameFilter]=[]
        if content == "":
            continue
        for el in content.split("&"):
            filters[nameFilter].append(el)
    return filters


def writeDataPlanes(data):
    formatJson = {}
    formatJson["result"] = []
    i = 0
    n = 1
    filters = getFilters()
    for key in data:
        if(key != "full_count" and key != "version" and key != "stats"):
            if(data[key][13] == ""):
                data[key][13] = "_None" + str(n)
                n += 1
            if(str(data[key][18]) == ""):
                data[key][18] = None
            if(str(data[key][8]) == ""):
                data[key][8]= None
            if(str(data[key][11]) == ""):
                data[key][11] = None
            if(str(data[key][12]) == ""):
                data[key][12] = None

            try:
                if(len(filters["Airlines"])>0):
                    if data[key][18] == None or CodeToNameAirline[data[key][18]] not in filters["Airlines"]:
                        continue
                if len(filters["Departure"])>0:
                    if data[key][11] == None or data[key][11] not in filters["Departure"]:
                        continue
                if len(filters["Arrival"])>0:
                    if data[key][12] == None or data[key][12] not in filters["Arrival"]:
                      continue
            except:
                continue


            formatJson["result"].append({})

            formatJson["result"][i]["id"] = key
            formatJson["result"][i]["flight"] = data[key][13]
            formatJson["result"][i]["airlineIATA"] = data[key][18]
            try:
                formatJson["result"][i]["airline"] = CodeToNameAirline[data[key][18]]
            except:
                formatJson["result"][i]["airline"] = None
            formatJson["result"][i]["latitude"] = data[key][1]
            formatJson["result"][i]["longitude"] = data[key][2]
            formatJson["result"][i]["direction"] = data[key][3]
            formatJson["result"][i]["height"] = data[key][4]
            formatJson["result"][i]["speed"] = data[key][5]
            formatJson["result"][i]["model"] = data[key][8]
            formatJson["result"][i]["departure"] = data[key][11]
            formatJson["result"][i]["arrival"] = data[key][12]
            i+=1
    formatJson["result"] = sorted(formatJson["result"], key=lambda el: el["flight"])
    print(formatJson)
    formatJson = json.dumps(formatJson)
    f = open("nowPlanesInfo.json", "w", encoding = "utf-8")
    f.write(formatJson)
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
        time.sleep(3-(time.time()-t1-0.0005))
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

def readDict(pathToFile):
    f = open(pathToFile, "r", encoding = "utf-8")
    newDict = f.read()
    f.close()
    newDict = json.loads(newDict)
    return newDict

if __name__ == "__main__":
    CodeToNameAirline = readDict("converterCodeToNameAirline.txt")
    while(1):
        try:
            getPlanes()
        except:
            print(sys.exc_info())
            continue