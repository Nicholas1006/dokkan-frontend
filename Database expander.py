from progress.bar import Bar
import sqlite3 as sl
import pandas as pd

GLOBAL_DB_LOC = '16 Farmbot/source/data/gb.db'
JAPAN_DB_LOC = '16 Farmbot/source/data/jp.db'

bar = Bar('Expanding database file', max=217)
con = sl.connect(GLOBAL_DB_LOC)
with con:
    x = con.execute("""SELECT name FROM sqlite_master
WHERE type='table'
ORDER BY name;""")
    for title in x:
        title=title[0]
        mylist = "SELECT * FROM " + title + ";"
        y = con.execute(mylist)

        #Fetch column names
        columns = [description[0] for description in y.description]

        # Fetch data
        transferringdata = [entry for entry in y]
        
        # Create DataFrame with proper column names
        df = pd.DataFrame(transferringdata, columns=columns)
        
        fulltitle="data/"+title+".csv"
        df.to_csv(fulltitle, index=False)
        bar.next()
    bar.finish()
print("Database file expanded")