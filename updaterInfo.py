import sys
import json
import time
import geocoder
from requests import get


def getFilters():
    filters = {}
    f = open("filters.txt", "r", encoding = "utf-8")
    r = f.read().split('\n')
    f.close()
    filters["Airlines"] = []
    filters["Departure"] = []
    filters["Arrival"] = []
    filters["Flight"] = []
    for filter in r:
        nameFilter, content =filter.split("=")
        filters[nameFilter]=[]
        if content == "":
            continue
        for el in content.split("&"):
            filters[nameFilter].append(el)
    return filters

def proFilters(data,formatJson, i, n):
    for key in data:
        if (key != "full_count" and key != "version" and key != "stats"):
            if (data[key][13] == ""):
                data[key][13] = "_None" + str(n)
                n += 1
            if (str(data[key][18]) == ""):
                data[key][18] = None
            if (str(data[key][8]) == ""):
                data[key][8] = None
            if (str(data[key][11]) == ""):
                data[key][11] = None
            if (str(data[key][12]) == ""):
                data[key][12] = None

            try:
                if (len(filters["Airlines"]) > 0):
                    if data[key][18] == None or CodeToNameAirline[data[key][18]] not in filters["Airlines"]:
                        continue
                if len(filters["Departure"]) > 0:
                    if data[key][11] == None or data[key][11] not in filters["Departure"]:
                        continue
                if len(filters["Arrival"]) > 0:
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
            i += 1
    return formatJson, i, n


def writeDataPlanes(data):
    formatJson = simpeFilters(data)

    return formatJson
def simpeFilters(data):
    formatJson = {}

    formatJson["result"] = []
    i = 0
    n = 1
    for key in data:
        if (key != "full_count" and key != "version" and key != "stats"):
            if (data[key][13] == ""):
                data[key][13] = "_None" + str(n)
                n += 1
            if (str(data[key][18]) == ""):
                data[key][18] = None
            if (str(data[key][8]) == ""):
                data[key][8] = None
            if (str(data[key][11]) == ""):
                data[key][11] = None
            if (str(data[key][12]) == ""):
                data[key][12] = None

            try:
                if (len(filters["Airlines"]) > 0):
                    if data[key][18] == None or CodeToNameAirline[data[key][18]] not in filters["Airlines"]:
                        continue
                if len(filters["Departure"]) > 0:
                    if data[key][11] == None or data[key][11] not in filters["Departure"]:
                        continue
                if len(filters["Arrival"]) > 0:
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
            i += 1
    formatJson["result"] = sorted(formatJson["result"], key=lambda el: el["flight"])
    formatJson = json.dumps(formatJson)
    return formatJson

def writeDataPlanes(data):
    formatJson = simpeFilters(data)

    return formatJson
def getPlanes():
    t1 = time.time()
    try:
        url = "https://data-live.flightradar24.com/zones/fcgi/feed.js"
        headers = {}
        headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
        req = get(url, headers = headers, timeout = 10)
        data = req.json()
        return writeDataPlanes(data)
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

def getProPlanes():
    t1 = time.time()
    formatJson = {}
    formatJson["result"] = []
    i = 0
    n = 1
    for filterName in filters:
        for filterValue in filters[filterName]:
            if(filterName == "Airlines"):
                url = "https://data-live.flightradar24.com/zones/fcgi/feed.js?callsign="+NameAirlineToCode[filterValue]

            elif(filterName == "Arrival"):
                url = "https://data-live.flightradar24.com/zones/fcgi/feed.js?to="+filterValue
            elif(filterName == "Departure"):
                url = "https://data-live.flightradar24.com/zones/fcgi/feed.js?from="+filterValue
            else:
                continue


            try:
                headers = {}
                headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
                req = get(url, headers = headers, timeout = 10)
                data = req.json()
                formatJson, i, n = proFilters(data,formatJson,i,n)
            except:
                if "ReadTimeout" in str(sys.exc_info()):
                    print("ReadTimeout")
                    getPlanes()
                elif "sleep length must be non-negative" in str(sys.exc_info()):
                    print("Too long")
                else:
                    print(sys.exc_info())
                    print(req.status_code)
                    exit(2)
   # formatJson["result"] = sorted(formatJson["result"], key=lambda el: el["flight"])
    formatJson = json.dumps(formatJson)

    print(time.time() - t1)

    return formatJson


def lastPoint():
    f = open("nowPlanesInfo.json", "r", encoding="utf-8")
    newDict = f.read()
    f.close()
    newDict = json.loads(newDict)
    allFlights = newDict['result']
    for flight in allFlights:
        if (flight['id'] == newQuery):
            return [flight["latitude"], flight["longitude"]]
    print("I don`t know this flight ID")
    exit(3)


def getTime(a):
    if (a == None):
        return a
    return time.ctime(int(a))


def reverseGeocoder(point):
   # point = [61.668832,50.836461]
    try:
        g = geocoder.yandex(point, method='reverse')
        if (g.state == None):
            g = geocoder.google(point, method='reverse')
        print(g.state)
        return g.state
    except:
        return None


def getCars(state):
    try:
        if (state == None):
            print("I don`t know where is plane")
            return None
        url = "http://84.201.139.189:8080/devapi-2/popular/models?city=" + regioncenter[state]
        headers = {}
        headers[
            "user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
        req = get(url, headers=headers, timeout=5)
        data = req.json()
        return data["data"]
    except:
        if "ReadTimeout" in str(sys.exc_info()):
            print("ReadTimeout avito")
            getCars(state)
        elif "KeyError" in str(sys.exc_info()):
            print(state + " not in regions list")
            return None
        else:
            print(sys.exc_info())
            print(req.status_code)
            return None


def writeDataTrajectory(data,f1):
    formatJson = {}
    formatJson["result"] = {}
    formatJson["result"]["trail"] = []
    i = 0
    n = 1

    for el in reversed(data["trail"]):
        formatJson["result"]["trail"].append([el["lat"], el["lng"]])
        # formatJson["result"][i]["latitude"] = el["lat"]
        # formatJson["result"][i]["longitude"] = el["lng"]
        # formatJson["result"][i]["direction"] = el["hd"]
        # formatJson["result"][i]["height"] = el["alt"]
        # formatJson["result"][i]["speed"] = el["spd"]
        i += 1
    formatJson["result"]["speed"] = data["trail"][0]["spd"]
    formatJson["result"]["height"] = data["trail"][0]["alt"]

    formatJson["result"]["airline"] = data["airline"]["name"] if data["airline"] != None else None

    formatJson["result"]["aircraftModel"] = data["aircraft"]["model"]["text"] if data["aircraft"] != None else None
    formatJson["result"]["aircraftID"] = data["aircraft"]["hex"] if data["aircraft"] != None else None

    formatJson["result"]["flightNumber"] = data["identification"]["number"]["default"]
    formatJson["result"]["scheduledDeparture"] = data["time"]["scheduled"]["departure"]
    formatJson["result"]["scheduledDeparture"] = getTime(formatJson["result"]["scheduledDeparture"])

    formatJson["result"]["scheduledArrival"] = data["time"]["scheduled"]["arrival"]
    formatJson["result"]["scheduledArrival"] = getTime(formatJson["result"]["scheduledArrival"])

    formatJson["result"]["realDeparture"] = data["time"]["real"]["departure"]
    formatJson["result"]["realDeparture"] = getTime(formatJson["result"]["realDeparture"])

    formatJson["result"]["realArrival"] = data["time"]["real"]["arrival"]
    formatJson["result"]["realArrival"] = getTime(formatJson["result"]["realArrival"])

    formatJson["result"]["estimatedArrival"] = data["time"]["estimated"]["arrival"]
    formatJson["result"]["estimatedArrival"] = getTime(formatJson["result"]["estimatedArrival"])

    formatJson["result"]["airportDeparture"] = data["airport"]["origin"]["name"] if data["airport"]["origin"] != None else None
    formatJson["result"]["airportArrival"] = data["airport"]["destination"]["name"] if data["airport"]["destination"] != None else None

    formatJson["result"]["coordsAirportArrival"] = [data["airport"]["destination"]["position"]["latitude"],
                                                    data["airport"]["destination"]["position"]["longitude"]] if data["airport"]["destination"] != None else None

    writeJson("nowPlanesInfo.json", f1)

    lastP = lastPoint()
    formatJson["result"]["trail"].append(lastP)

 #   for i in range(len(formatJson["result"]["trail"])-1):
        #if(abs(formatJson["result"]["trail"][i][0]-formatJson["result"]["trail"][i+1][0])>10):
       #     formatJson["result"]["trail"][i + 1][0] += 360
   #     if(abs(formatJson["result"]["trail"][i][1]-formatJson["result"]["trail"][i+1][1])>50):
   #         formatJson["result"]["trail"][i+1][1] += 360

    state = reverseGeocoder(lastP)
    formatJson["result"]["city"] = state

    formatJson["result"]["avito"] = getCars(state)

    formatJson = json.dumps(formatJson)
    return formatJson


def getTrajectory(flightID, f1):
    t1 = time.time()
    try:
        url = "https://data-live.flightradar24.com/clickhandler/?version=1.5&flight=" + flightID
        headers = {}
        headers[
            "user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
        req = get(url, headers=headers, timeout=10)
        data = req.json()
        # В статусе лежит инофрмация с аэропорта(задержан ли рейс и т.д.) в aircraft лежит информация о том, что за самолёт, стране где он зарегистрирован
        # и его изображения. В airport подробная информация об аэропортах вылета и прибытия во flightHistory лежит история полётов
        # в тайм лежит время отправления и прибытия по расписанию, реальное и ожидаемое
        # в trail хранится траектория
        return writeDataTrajectory(data, f1)
    except:
        if "ReadTimeout" in str(sys.exc_info()):
            print("ReadTimeout")
            getTrajectory(flightID)
        elif "sleep length must be non-negative" in str(sys.exc_info()):
            print("Too long")
        else:
            print(sys.exc_info())
            print(req.status_code)
            exit(4)
    print("Information received in: " + str(time.time() - t1) + " seconds")

def writeJson(filename, formatJson):
    f = open(filename, "w", encoding="utf-8")
    f.write(formatJson)
    f.close()

def getQuery():
    f = open("choosenFlight.txt", "r", encoding="utf-8")
    lastQuery = f.read()
    f.close()
    return lastQuery
if __name__ == "__main__":
    regioncenter = {'Archangel Region': 'arhangelsk',
                    'Rostov Region': 'rostov-na-donu',
                    'Moscow Region': 'moskva',
                    'Krasnoyarsk Territory': 'krasnoyarsk',
                    'Volgograd Region': 'volgograd',
                    'Chelyabinsk Region': 'chelyabinsk',
                    'Leningrad Region':'sankt-peterburg',
                    'Republic of Tatarstan': 'kazan',
                    'Samara Region': 'samara',
                    'Novosibirsk Region': 'novosibirsk',
                    'Sverdlovsk Region': 'ekaterinburg',
                    'Nizhniy Novgorod Region': 'nizhniy_novgorod',
                    'Omsk Region': 'omsk',
                    'Perm Territory': 'perm',
                    'Voronezh Region': 'voronezh',
                    'Republic of Bashkortostan': 'ufa',
                    'Primorye Territory': 'vladivostok',
                    'Republic of Mari El': 'yoshkar-ola',
                    'Kamchatka Territory': 'petropavlovsk-kamchatskiy',
                    'Republic of Buryatia': 'ulan-ude',
                    'Bryansk Region': 'bryansk',
                    'Ulyanovsk Region': 'ulyanovsk',
                    'Ryazan Region': 'ryazan',
                    'Tyumen Region2': 'hanty-mansiysk',
                    'Tyumen Region3': 'naryan-mar',
                    'Belgorod Region': 'belgorod',
                    'Republic of Khakassia': 'abakan',
                    'Khabarovsk Territory': 'habarovsk',
                    'Kaluga Region': 'kaluga',
                    'Krasnodar Territory': 'krasnodar',
                    'Republic of Daghestan': 'mahachkala',
                    'Smolensk Region': 'smolensk',
                    'Republic of Karelia': 'petrozavodsk',
                    'Penza Region': 'penza',
                    'Novgorod Region': 'velikiy_novgorod',
                    'Republic of Adygea': 'maykop',
                    'Kurgan Region': 'kurgan',
                    'Ivanovo Region': 'ivanovo',
                    'Kirov Region': 'kirovskaya_oblast_kirov',
                    'Trans-Baikal Territory': 'chita',
                    'Orenburg Region': 'orenburg',
                    'Irkutsk Region': 'irkutsk',
                    'Altai Territory': 'barnaul',
                    'Udmurtian Republic': 'izhevsk',
                    'Kursk Region': 'kursk',
                    'Vladimir Region': 'vladimir',
                    'Republic of Sakha (Yakutia)': 'yakutsk',
                    'Republic of Mordovia': 'saransk',
                    'Tomsk Region': 'tomsk',
                    'Vologda Region': 'vologda',
                    'Tambov Region': 'tambov',
                    'Kaliningrad Region': 'kaliningrad',
                    'Tver Region': 'tver',
                    'Tyumen Region4': 'salehard',
                    'Komi Republic': 'syktyvkar',
                    'Republic of Severnaya Ossetia-Alania': 'vladikavkaz',
                    'Pskov Region': 'pskov',
                    'Republic of Altai': 'gorno-altaysk',
                    'Chechen Republic': 'groznyy',
                    'Chuvash Republic': 'cheboksary',
                    'Yaroslavl Region': 'yaroslavl',
                    'Tula Region': 'tula',
                    'Kemerovo Region': 'kemerovo',
                    'Republic of Kalmykia': 'elista',
                    'Saratov Region': 'saratov',
                    'Astrakhan Region': 'astrahan',
                    'Republic of Ingushetia': 'magas',
                    'Oryol Region': 'orel',
                    'Murmansk Region': 'murmansk',
                    'Kostroma Region': 'kostroma',
                    'Stavropol Territory': 'stavropol',
                    'Republic of Crimea': 'simferopol',
                    'Lipetsk Region': 'lipetsk',
                    'Karachayevo-Circassian Republic': 'cherkessk',
                    'Kabardino-Balkarian Republic': 'nalchik',
                    'Republic of Tyva':'kyzyl',
                    'Amurskaya oblast': 'amurskaya_oblast_blagoveschensk',
                    'Jewish Autonomous Region' : 'birobidzhan',
                    'Chukotka Autonomous Area': 'anadyr',
                    'Sakhalin Region': 'yuzhno-sahalinsk',
                    'Magadan Region':'magadan',
                    'Tyumen Region' : 'tyumen'}
    CodeToNameAirline = readDict("converterCodeToNameAirline.txt")
    NameAirlineToCode = {v: k for k, v in CodeToNameAirline.items()}
    while(1):
        allTime = time.time()
        filters = getFilters()
        newQuery = getQuery()
        try:
            if(len(filters["Airlines"])>0 or len(filters["Arrival"])>0 or len(filters["Departure"])>0):
                f1 = getProPlanes()
                print("Getting info about flight with id:" + newQuery)
                if newQuery == "stop":
                    f = open("trajectoryInfo.json", "w", encoding="utf-8")
                    f.write('{"result": [[0,0]]}')
                    f.close()
                    writeJson("nowPlanesInfo.json", f1)
                    continue
                f2 = getTrajectory(newQuery, f1)
            else:
                f1 = getPlanes()
                print("Getting info about flight with id:" + newQuery)
                if newQuery == "stop":
                    f = open("trajectoryInfo.json", "w", encoding="utf-8")
                    f.write('{"result": [[0,0]]}')
                    f.close()
                    writeJson("nowPlanesInfo.json", f1)
                    continue
                f2 = getTrajectory(newQuery, f1)
            writeJson("trajectoryInfo.json", f2)
            print("It takes "+str(time.time()-allTime)+" seconds")
            print("Success\n")
            time.sleep(3-(time.time()-allTime))
        except:
            print(sys.exc_info())
            continue