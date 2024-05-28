import glob
from dokkanfunctions import *
from numpy import source
time1=time.time()
directory="data/"
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


unitid="1000010"
eza=True
DEVEXCEPTIONS=True
GLOBALCHECK=True
CUTJSON=True
MAKEJSON=True
CALCPASSIVE=True
CALCLEADER=True
CALCHIPO=True



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
    unitDictionary["ID"]=unit[0]
    unitDictionary["Typing"]=getUnitTyping(unit)
    unitDictionary["Class"]=getUnitClass(unit)
    unitDictionary["Name"]=unit[1]
    unitDictionary["Rarity"]=getrarity(unit)
    unitDictionary["Max Level"]=unit[13]
    unitDictionary["Max HP"]=swapToUnitWith1(unit)[7]
    unitDictionary["Max ATK"]=swapToUnitWith1(unit)[9]
    unitDictionary["Max DEF"]=swapToUnitWith1(unit)[11]
    unitDictionary["Categories"]=getallcategories(unit[0],printing=True)
    unitDictionary["Links"]=getalllinks(unit)
    unitDictionary["Passive"]={}
    if(CALCPASSIVE):
        passiveIdList=getpassiveid(unit,eza)
        if (passiveIdList!=None and qualifyUsable(unit)):
            for passiveskill in passive_skills[1:]:
                if (passiveskill[0] in passiveIdList):
                    output=(extractPassiveLine(unit,passiveskill,printing=False,DEVEXCEPTIONS=DEVEXCEPTIONS))
                    #output=shortenPassiveDictionary(output)
                    if(CUTJSON):
                        output=shortenPassiveDictionary(output)
                    passivecount+=1
                    unitDictionary["Passive"][passiveskill[0]]=output
                    
                    

    

    
    if(CALCLEADER):
        leader_skill_line=searchbycolumn(code=unit[22][:-2],database=leader_skills,column=1,printing=False)
        unitDictionary["Leader Skill"]={}
        for line in leader_skill_line:
            ParsedLeaderSkill=parseLeaderSkill(unit,line,DEVEXCEPTIONS)
            if (ParsedLeaderSkill!=None):
                unitDictionary["Leader Skill"][line[0]] = ParsedLeaderSkill
    #unit[22] is leader skill set id
    


    unitDictionary["Hidden Potential"]={}
    unit1=swapToUnitWith1(unit)
    if(CALCHIPO):
        if(unit1[52][:-2]not in HiPoBoards):
            HiPoBoards[unit1[52][:-2]]=parseHiddenPotential(unit1[52][:-2],DEVEXCEPTIONS)

        unitDictionary["Hidden Potential"]=HiPoBoards[unit1[52][:-2]]
        #unit[52] is the potential board id

    unitDictionary["Super Attack"]=parseSuperAttack(unit,eza,DEVEXCEPTIONS)

    unitDictionary["Active Skill"]={}
    unitDictionary["Ki Multiplier"]={}
    unitDictionary["Standby Skill"]={}

    jsonName=unit[0]
    
    if(MAKEJSON):
        if(GLOBALCHECK):
            MegaPassiveJson[unit[0]]=unitDictionary
        if(CUTJSON):
            turnintoJson(unitDictionary, jsonName,directoryName="jsonsCompressed")
        else:
            turnintoJson(unitDictionary, jsonName,directoryName="jsons")
    print("Unit count:",unitCount, "Passive count:",passivecount)
    
print("All done in ",time.time()-time1," seconds")
if(GLOBALCHECK and MAKEJSON):
    turnintoJson(MegaPassiveJson, "MegaPassiveJson",directoryName="jsonsCompressed")