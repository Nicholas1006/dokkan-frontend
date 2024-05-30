from globals import *
from dokkanfunctions import *
from numpy import source
directory="dataJP/"
cardsJP=storedatabase(directory,"cards.csv")


eza=True
DEVEXCEPTIONS=False
GLOBALCHECK=False
MAKEJSON=True
CUTJSON=True

CALCPASSIVE=True
CALCLEADER=True
CALCHIPO=True
CALCACTIVE=True
CALCSUPERATTACK=True
CALCLEVELS=True
CALCBASIC=True
CALCMULTIPLIER=True
CALCSTANDBY=True

passiveTime=0.0
leaderTime=0.0
hipoTime=0.0
activeTime=0.0
superTime=0.0
levelTime=0.0
basicTime=0.0
jsonTime=0.0
megaJsonTime=0.0
standbyTime=0.0
multiplierTime=0.0

cardIDsToCheck=["4027631"]
#cardIDsToCheck=["4026911","4025741","4028381","4026401","4027631","4027301","4025781","4026541"]

cardsToCheck=[]

if GLOBALCHECK:
    for unit in cardsJP:
        if qualifyUsable(unit):
            cardsToCheck.append(unit)
else:
    for ID in cardIDsToCheck:
        for unit in cardsJP:
            if unit[0]==ID:
                cardsToCheck.append(unit)


missingPassiveCount=0
missingUnitCount=0

unitCount=0
passivecount=0
#passive skill set id is mainunit[21]
#passive=(passivename(mainunit,passive_skills))
#passiveIdList=getpassiveid(mainunit,cards,optimal_awakening_growths,passive_skill_set_relations,eza)
#print(passive)
longestPassive=["a"]
MegaPassiveJson={}
HiPoBoards={}

for unit in cardsToCheck:
    unitCount+=1
    unitDictionary={}
    unit1=swapToUnitWith1(unit)
    unitGB=switchUnitToGlobal(unit)
    if(CALCBASIC):
        basicStart=time.time()
        unitDictionary["ID"]=unit[0]
        unitDictionary["Typing"]=getUnitTyping(unit)
        unitDictionary["Class"]=getUnitClass(unit)
        if(unitGB!=None):
            unitDictionary["Name"]=unitGB[1]
        else:
            unitDictionary["Name"]=unit[1]
        unitDictionary["Rarity"]=getrarity(unit)
        unitDictionary["Max Level"]=unit[13]
        unitDictionary["Max HP"]=unit1[7]
        unitDictionary["Max ATK"]=unit1[9]
        unitDictionary["Max DEF"]=unit1[11]
        unitDictionary["Categories"]=getallcategories(unit[0],printing=True)
        unitDictionary["Links"]=getalllinks(unit)
        basicTime+=time.time()-basicStart
    


    unitDictionary["Passive"]={}
    if(CALCPASSIVE):
        passiveStart=time.time()
        unitDictionary["Passive"]=parsePassiveSkill(unit,eza,DEVEXCEPTIONS)
        passiveTime+=time.time()-passiveStart

    unitDictionary["Stats at levels"]={}
    if(CALCLEVELS):
        levelStart=time.time()
        unitDictionary["Stats at levels"]=getStatsAtAllLevels(unit1)
        levelTime+=time.time()-levelStart
    
    unitDictionary["Leader Skill"]={}
    if(CALCLEADER):
        leaderStart=time.time()
        unitDictionary["Leader Skill"]=parseLeaderSkill(unit,unit[22][:-2],DEVEXCEPTIONS)
        leaderTime+=time.time()-leaderStart

    unitDictionary["Hidden Potential"]={}
    if(CALCHIPO):
        hipoStart=time.time()
        if(unit1[52][:-2]not in HiPoBoards):
            HiPoBoards[unit1[52][:-2]]=parseHiddenPotential(unit1[52][:-2],DEVEXCEPTIONS)
        unitDictionary["Hidden Potential"]=HiPoBoards[unit1[52][:-2]]
        hipoTime+=time.time()-hipoStart

    unitDictionary["Super Attack"]={}
    if(CALCSUPERATTACK):
        superStart=time.time()
        unitDictionary["Super Attack"]=parseSuperAttack(unit,eza,DEVEXCEPTIONS)
        superTime+=time.time()-superStart

    unitDictionary["Active Skill"]={}
    if(CALCACTIVE):    
        activeStart=time.time()
        unitDictionary["Active Skill"]=parseActiveSkill(unit,eza,DEVEXCEPTIONS)
        activeTime+=time.time()-activeStart






    unitDictionary["Ki Multiplier"]={}
    if(CALCMULTIPLIER):
        multiplierStart=time.time()
        unitDictionary["Ki Multiplier"]=getKiMultipliers(unit)
        multiplierTime+=time.time()-multiplierStart
    

    unitDictionary["Standby Skill"]={}
    if(CALCSTANDBY):
        standbyStart=time.time()
        unitDictionary["Standby Skill"]=parseStandby(unit,DEVEXCEPTIONS)
        standbyTime+=time.time()-standbyStart




    jsonName=unit[0]

    
    MegaPassiveJson[unit[0]]=unitDictionary



    if(MAKEJSON):
        jsonStart=time.time()
        if(GLOBALCHECK):
            MegaPassiveJson[unit[0]]=unitDictionary
        if(CUTJSON):
            turnintoJson(unitDictionary, jsonName,directoryName="jsonsCompressed")
        else:
            turnintoJson(unitDictionary, jsonName,directoryName="jsons")
        jsonTime+=time.time()-jsonStart
    print("Unit count:",unitCount)
    

if(GLOBALCHECK and MAKEJSON):
    megaJsonStart=time.time()
    turnintoJson(MegaPassiveJson, "MegaPassiveJson",directoryName="jsonsCompressed")
    megaJsonTime+=time.time()-megaJsonStart



print("Basic time:",round(basicTime,2))
print("Leader time:",round(leaderTime,2))
print("Passive time:",round(passiveTime,2))
print("Super time:",round(superTime,2))
print("Level time:",round(levelTime,2))
print("HiPo time:",round(hipoTime,2))
print("Multiplier time:",round(multiplierTime,2))
print("Active time:",round(activeTime,2))
print("Standby time:",round(standbyTime,2))
print("Json time:",round(jsonTime,2))
print("MegaJson time:",round(megaJsonTime,2))
print("Total time:",round(passiveTime+leaderTime+hipoTime+activeTime+superTime+levelTime+basicTime+jsonTime+megaJsonTime+multiplierTime+standbyTime,2))