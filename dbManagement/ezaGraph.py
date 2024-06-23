import datetime
from dokkanfunctions import *
from globals import *
import datetime
import matplotlib.pyplot as plt

def dateTimeToInt(dateTime):
    return(int(datetime.datetime.strptime(dateTime, '%Y-%m-%d %H:%M:%S').timestamp()))

def intToDateTime(intTime):
    return(datetime.datetime.fromtimestamp(intTime).strftime('%Y-%m-%d %H:%M:%S'))

def releaseTime(unit):
    return(dateTimeToInt(unit[53]))

def ezaReleaseTime(unit):
    card_awakening_routes_rows=searchbycolumn(code=unit[0], database=card_awakening_routesJP, column=2)
    ezaRoutes=searchbycolumn(code="1", database=card_awakening_routes_rows, column=7)
    if ezaRoutes==[]:
        return(None)
    else:
        return(dateTimeToInt(ezaRoutes[0][10]))
    
def sezaReleaseTime(unit):
    card_awakening_routes_rows=searchbycolumn(code=unit[0], database=card_awakening_routesJP, column=2)
    sezaRoutes=searchbycolumn(code="2", database=card_awakening_routes_rows, column=7)
    if sezaRoutes==[]:
        return(None)
    else:
        return(dateTimeToInt(sezaRoutes[0][10]))

data={}
ezaData={}


for unit in cardsJP[1:]:
    if(unit[13] in ["140","150"] and unit[0][-1]=="1"): 
        initialRelease=releaseTime(unit)
        if(initialRelease!=None):
            if(initialRelease not in data):
                data[initialRelease]=1
            else:
                data[initialRelease]+=1
        ezaRelease=ezaReleaseTime(unit)
        if(ezaRelease!=None):
            if(ezaRelease not in ezaData):
                ezaData[ezaRelease]=1
            else:
                ezaData[ezaRelease]+=1
                

interval=60*60*24

min=min(data.keys())
max=dateTimeToInt(str(datetime.datetime.now())[:-7])

intervaledData=[]
intervaledEzaData=[]

#For every day
for day in range(min, max, interval):
    if(day< dateTimeToInt(str(datetime.datetime.now())[:-7])):
        #count up all the units that were released on that day
        count=0
        for release in data.keys():
            if(release>=day and release<day+interval):
                count+=data[release]
        intervaledData.append(count)

        ezacount=0
        for release in ezaData.keys():
            if(release>=day and release<day+interval):
                ezacount+=ezaData[release]
        intervaledEzaData.append(ezacount)

cumulativeIntervalData=[]
cumulativeIntervalEzaData=[]
for i in range(len(intervaledData)):
    cumulativeIntervalData.append(sum(intervaledData[:i+1]))
    cumulativeIntervalEzaData.append(sum(intervaledEzaData[:i+1]))

all_dates=[]
for i in range(len(intervaledData)):
    all_dates.append(intToDateTime(min+i*interval))

plt.plot(cumulativeIntervalData, label="Units released")
plt.plot(cumulativeIntervalEzaData, label="Units EZA'd")
plt.fill_between(x=all_dates, y1=cumulativeIntervalData, y2=cumulativeIntervalEzaData, color="grey", alpha=0.5)
plt.show()

difference=[]
for i in range(len(cumulativeIntervalData)):
    difference.append(cumulativeIntervalData[i]-cumulativeIntervalEzaData[i])
plt.plot(difference)
plt.show()


print(max-min)