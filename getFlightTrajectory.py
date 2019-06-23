import sys
import json
import time
import sys
from requests import get

def writeDataPlanes(data):
    formatJson = {}
    formatJson["result"] = []
    i = 0
    n = 1
    for el in reversed(data["trail"]):
        formatJson["result"].append({})

        formatJson["result"][i]["latitude"] = el["lat"]
        formatJson["result"][i]["longitude"] = el["lng"]
        formatJson["result"][i]["direction"] = el["hd"]
        formatJson["result"][i]["height"] = el["alt"]
        formatJson["result"][i]["speed"] = el["spd"]
        i+=1
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
    print(time.time()-t1)

if __name__ == "__main__":
    try:
        #getTrajectory("2100b8bb")
        getTrajectory(sys.argv[1])
    except:
        print(sys.exc_info())