import sys
import json
import time
import sys
from requests import get

def lastPoint():
    f = open("nowPlanesInfo.json", "r", encoding = "utf-8")
    newDict = f.read()
    f.close()
    newDict = json.loads(newDict)
    allFlights = newDict['result']
    for flight in allFlights:
        if(flight['id'] == newQuery):
            return [flight["latitude"], flight["longitude"]]
    exit(2)
def writeDataPlanes(data):
    formatJson ={}
    formatJson["result"] = {}
    formatJson["result"]["trail"] = []
    i = 0
    n = 1
    for el in reversed(data["trail"]):
        formatJson["result"]["trail"].append([el["lat"], el["lng"]])

        #formatJson["result"][i]["latitude"] = el["lat"]
       # formatJson["result"][i]["longitude"] = el["lng"]
       # formatJson["result"][i]["direction"] = el["hd"]
       # formatJson["result"][i]["height"] = el["alt"]
       # formatJson["result"][i]["speed"] = el["spd"]
        i+=1
    formatJson["result"]["trail"].append(lastPoint())
    formatJson = json.dumps(formatJson)
    f = open("trajectoryInfo.json", "w", encoding = "utf-8")
    f.write(formatJson)
    f.close()

def getTrajectory(flightID):
    t1 = time.time()
    try:
        url = "https://data-live.flightradar24.com/clickhandler/?version=1.5&flight="+flightID
        headers = {}
        headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
        req = get(url, headers = headers, timeout = 10)
        data = req.json() #В статусе лежит инофрмация с аэропорта(задержан ли рейс и т.д.) в aircraft лежит информация о том, что за самолёт, стране где он зарегистрирован
        #и его изображения. В airport подробная информация об аэропортах вылета и прибытия во flightHistory лежит история полётов
        #в тайм лежит время отправления и прибытия по расписанию, реальное и ожидаемое
        #в trail хранится траектория
        writeDataPlanes(data)
    except:
        if "ReadTimeout" in str(sys.exc_info()):
            print("ReadTimeout")
            getTrajectory(flightID)
        elif "sleep length must be non-negative" in str(sys.exc_info()):
            print("Too long")
        else:
            print(sys.exc_info())
            print(req.status_code)
            exit(1)
    print("Information received in: "+str(time.time()-t1)+" seconds")

def getQuery():
    f = open("choosenFlight.txt", "r", encoding = "utf-8")
    lastQuery = f.read()
    f.close()
    return lastQuery
if __name__ == "__main__":
    while(1):
        newQuery = getQuery()
        try:
            print("Getting info about flight with id:"+newQuery)
            if newQuery == "stop":
                f = open("trajectoryInfo.json", "w", encoding="utf-8")
                f.write('{"result": [[0,0]]}')
                f.close()
                continue
            getTrajectory(newQuery)
            print("Success\n")
            #getTrajectory(sys.argv[1])
        except:
            print(sys.exc_info())
        time.sleep(1)