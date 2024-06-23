from dokkanfunctions import *

from dokkanfunctions import *
from numpy import source


stringToFind = 'open_at'

includeAsElementOf=False

CSVtoExclude = []

try:
    inttoFind = int(stringToFind)
except ValueError:
    inttoFind = None

try:
    floattoFind = float(stringToFind)
except ValueError:
    floattoFind = None


directory = "dataGB/"
for filename in os.listdir(directory):
    if (filename.endswith(".csv") and filename not in CSVtoExclude):
        data = storedatabase(directory, filename)


        for row in data:
            for column in row:
                if(stringToFind!=None):
                    if (column==stringToFind or (includeAsElementOf and stringToFind in column)):
                        print(filename,data.index(row),row.index(column),data[0][row.index(column)])
                elif(inttoFind!=None or (includeAsElementOf and inttoFind in column)):
                    if column==inttoFind:
                        print(filename,data.index(row),row.index(column),data[0][row.index(column)])
                elif(floattoFind!=None or (includeAsElementOf and floattoFind in column)):
                    if column==floattoFind:
                        print(filename,data.index(row),row.index(column),data[0][row.index(column)])
    else:
        continue