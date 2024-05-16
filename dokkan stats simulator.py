from dokkanfunctions import *
from numpy import source

directory="data/"
cards=storedatabase(directory,"cards.csv")
leader_skills=storedatabase(directory,"leader_skills.csv")
passive_skill_sets=storedatabase(directory,"passive_skill_sets.csv")
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

unitid="4026911"
eza=False
DEVEXCEPTIONS=True
GLOBALCHECK=False




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
    cardsToCheck=[mainunit]


missingPassiveCount=0
missingUnitCount=0

unitCount=0
passivecount=0
#passive skill set id is mainunit[21]
#passive=(passivename(mainunit,passive_skills))
#passiveIdList=getpassiveid(mainunit,cards,optimal_awakening_growths,passive_skill_set_relations,eza)
#print(passive)
for unit in cardsToCheck:
    unitPassive=[]
    
    unitCount+=1
    passiveIdList=getpassiveid(unit,cards,optimal_awakening_growths,passive_skill_set_relations,eza)
    if (passiveIdList!=None and qualifyUsable(unit)):
        for passiveskill in passive_skills[1:]:
            if (passiveskill[0] in passiveIdList):
                
                if(True):
                    output=(extractPassiveLine(passive_skills, passive_skill_set_relations,dokkan_fields,dokkan_field_passive_skill_relations,battle_params,unit,skill_causalities,card_unique_info_set_relations,cards,passiveskill,sub_target_types,card_categories,printing=False,DEVEXCEPTIONS=DEVEXCEPTIONS))
                    output=shortenPassiveDictionary(output)
                    output=shortenPassiveDictionary(output)
                    passivecount+=1
                    unitPassive.append(output)
    print("Unit count:",unitCount, "Passive count:",passivecount)
