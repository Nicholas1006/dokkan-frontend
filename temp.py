from dokkanfunctions import *
directory="data/"
cards=storedatabase(directory,"cards.csv")

unitid="1026331"
unit=searchbycolumn(code=unitid,column=0,database=cards)[0]
for level in range(1,141):
    stats=getUnitStats(unit,level)
    print(level, stats["HP"], stats["ATK"], stats["DEF"])