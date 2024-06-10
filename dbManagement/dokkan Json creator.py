
from globals import *
from dokkanfunctions import *
from numpy import source
from progress.bar import Bar
directory="dataJP/"
cardsJP=storedatabase(directory,"cards.csv")

eza=False
DEVEXCEPTIONS=True
GLOBALPARSE=True
MAKEJSON=True

CALCPASSIVE=True
CALCLINKS=True
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
standbyTime=0.0
linksTime=0.0
multiplierTime=0.0

cardIDsToCheck=["1015051"]
#cardIDsToCheck=["4026911","4025741","4028381","4026401","4027631","4027301","4025781","4026541"]

cardsToCheck=[]

if GLOBALPARSE:
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
HiPoBoards={}

if GLOBALPARSE:
    bar = Bar('Parsing units', max=len(cardsToCheck))

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
            card_unique_info_id=unit[3]
            temp=searchbyid(code=card_unique_info_id,codecolumn=3,database=cardsGB,column=1)
            if(temp!=None):
                likelyName=longestCommonSubstring(temp)
                if(likelyName!=""):
                    unitDictionary["Name"]=likelyName
                else:
                    unitDictionary["Name"]=unit[1]
            else:
                unitDictionary["Name"]=unit[1]
        unitDictionary["Rarity"]=getrarity(unit)
        unitDictionary["Max Level"]=unit[13]
        unitDictionary["Max HP"]=unit[7]
        unitDictionary["Max ATK"]=unit[9]
        unitDictionary["Max DEF"]=unit[11]
        unitDictionary["Categories"]=getallcategories(unit[0],printing=True)
        basicTime+=time.time()-basicStart
    

    if(CALCLINKS):
        linksStart=time.time()
        unitDictionary["Links"]=getalllinkswithbuffs(unit)
        linksTime+=time.time()-linksStart

    unitDictionary["Transformations"]=[]

    unitDictionary["Passive"]={}
    if(CALCPASSIVE):
        passiveStart=time.time()
        parsedPassive=parsePassiveSkill(unit,eza,DEVEXCEPTIONS)
        for passiveLine in parsedPassive:
            parsedPassive[passiveLine]=shortenPassiveDictionary(parsedPassive[passiveLine])
        unitDictionary["Passive"]=parsedPassive
        passiveTime+=time.time()-passiveStart

    unitDictionary["Stats at levels"]={}
    if(CALCLEVELS):
        levelStart=time.time()
        unitDictionary["Stats at levels"]=getStatsAtAllLevels(unit)
        levelTime+=time.time()-levelStart
    
    unitDictionary["Leader Skill"]={}
    if(CALCLEADER):
        leaderStart=time.time()
        unitDictionary["Leader Skill"]=parseLeaderSkill(unit,unit[22][:-2],DEVEXCEPTIONS)
        leaderTime+=time.time()-leaderStart

    unitDictionary["Hidden Potential"]={}
    if(CALCHIPO):
        hipoStart=time.time()
        if(unit[52][:-2]not in HiPoBoards):
            HiPoBoards[unit[52][:-2]]=parseHiddenPotential(unit[52][:-2],DEVEXCEPTIONS)
        unitDictionary["Hidden Potential"]=HiPoBoards[unit[52][:-2]]
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

    if(unitDictionary["Passive"]!=None):
        for passiveLine in unitDictionary["Passive"]:
            if "Transformation" in unitDictionary["Passive"][passiveLine]:
                unitDictionary["Transformations"].append(unitDictionary["Passive"][passiveLine]["Transformation"]["Unit"])
    if(unitDictionary["Active Skill"]!=None):
        for activeLine in unitDictionary["Active Skill"]["Effects"]:
            if "Unit" in unitDictionary["Active Skill"]["Effects"][activeLine]["Effect"]:
                unitDictionary["Transformations"].append(unitDictionary["Active Skill"]["Effects"][activeLine]["Effect"]["Unit"])




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

    



    if(MAKEJSON):
        jsonStart=time.time()
        turnintoJson(unitDictionary, jsonName,directoryName="jsons")
        jsonTime+=time.time()-jsonStart
    if(GLOBALPARSE):
        bar.next()
    


if(GLOBALPARSE):
    bar.finish()
print("Basic time:",round(basicTime,2))
print("Links time:",round(linksTime,2))
print("Leader time:",round(leaderTime,2))
print("Passive time:",round(passiveTime,2))
print("Super time:",round(superTime,2))
print("Level time:",round(levelTime,2))
print("HiPo time:",round(hipoTime,2))
print("Multiplier time:",round(multiplierTime,2))
print("Active time:",round(activeTime,2))
print("Standby time:",round(standbyTime,2))
print("Json time:",round(jsonTime,2))
print("Total time:",round(passiveTime+linksTime+leaderTime+hipoTime+activeTime+superTime+levelTime+basicTime+jsonTime+multiplierTime+standbyTime,2))