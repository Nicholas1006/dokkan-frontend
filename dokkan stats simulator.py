from globals import *
from dokkanfunctions import *
from numpy import source
directory="dataJP/"
cards=storedatabase(directory,"cards.csv")
leader_skills=storedatabase(directory,"leader_skills.csv")
passive_skills=storedatabase(directory,"passive_skills.csv")
card_active_skills=storedatabase(directory,"card_active_skills.csv")
active_skill_sets=storedatabase(directory,"active_skill_sets.csv")
card_categories=storedatabase(directory,"card_categories.csv")
card_card_categories=storedatabase(directory,"card_card_categories.csv")
link_skills=storedatabase(directory,"link_skills.csv")
link_skill_lvs=storedatabase(directory,"link_skill_lvs.csv")
skill_causalities=storedatabase(directory,"skill_causalities.csv")
passive_skill_set_relations=storedatabase(directory,"passive_skill_set_relations.csv")
optimal_awakening_growths=storedatabase(directory,"optimal_awakening_growths.csv")
sub_target_types=storedatabase(directory,"sub_target_types.csv")
card_unique_info_set_relations=storedatabase(directory,"card_unique_info_set_relations.csv")
battle_params=storedatabase(directory,"battle_params.csv")
dokkan_fields=storedatabase(directory,"dokkan_fields.csv")
dokkan_field_passive_skill_relations=storedatabase(directory,"dokkan_field_passive_skill_relations.csv")
potential_squares=storedatabase(directory,"potential_squares.csv")
potential_events=storedatabase(directory,"potential_events.csv")
potential_square_relations=storedatabase(directory,"potential_square_relations.csv")
card_specials=storedatabase(directory,"card_specials.csv")
special_sets=storedatabase(directory,"special_sets.csv")
specials=storedatabase(directory,"specials.csv")
special_bonuses=storedatabase(directory,"special_bonuses.csv")


unitid="1024550"
eza=True
DEVEXCEPTIONS=True
GLOBALCHECK=True
MAKEJSON=True
CUTJSON=True

CALCPASSIVE=True
CALCLEADER=True
CALCHIPO=True
CALCACTIVE=True
CALCSUPERATTACK=True
CALCLEVELS=True
CALCBASIC=True

passiveTime=0.0
leaderTime=0.0
hipoTime=0.0
activeTime=0.0
superTime=0.0
levelTime=0.0
basicTime=0.0
jsonTime=0.0
megaJsonTime=0.0

if unitid[-1]=="1":
    unitid=unitid[0:-1]+"0"
for unit in cards:
    if unit[0]==unitid:
        mainunit=unit

cardsToCheck=[]

if GLOBALCHECK:
    for unit in cards:
        if qualifyUsable(unit):
            cardsToCheck.append(unit)
else:
    cardsToCheck.append(mainunit)


missingPassiveCount=0
missingUnitCount=0

unitCount=0
passivecount=0
#passive skill set id is mainunit[21]
#passive=(passivename(mainunit,passive_skills))
#passiveIdList=getpassiveid(mainunit,cards,optimal_awakening_growths,passive_skill_set_relations,eza)
#print(passive)
longestPassive=["a"]
if(GLOBALCHECK):
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
    unitDictionary["Standby Skill"]={}

    jsonName=unit[0]
    
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


print("Passive time:",passiveTime)
print("Leader time:",leaderTime)
print("HiPo time:",hipoTime)
print("Active time:",activeTime)
print("Super time:",superTime)
print("Level time:",levelTime)
print("Basic time:",basicTime)
print("Json time:",jsonTime)
print("MegaJson time:",megaJsonTime)
print("Total time:",passiveTime+leaderTime+hipoTime+activeTime+superTime+levelTime+basicTime+jsonTime+megaJsonTime)