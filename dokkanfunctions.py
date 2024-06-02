from calendar import c
import csv
from xml import dom
from colorama import Fore, Style
from numpy import extract, short
import requests
import os
from PIL import Image
import time
import math
import json
from globals import *

def sub_target_types_extractor(sub_target_type_set_id,DEVELOPEREXCEPTIONS=False):
    global sub_target_typesJP
    global card_categoriesGB
    temp=searchbycolumn(code=sub_target_type_set_id,database=sub_target_typesJP,column=1)
    output={}
    output["Category"]=[]
    output["Excluded Category"]=[]
    for line in temp:   
        if(line[2]=="1"):
            output["Category"].append(CategoryExtractor(line[3]))
        elif(line[2]=="2"):
            output["Excluded Category"].append(CategoryExtractor(line[3]))
        elif(line[2]=="3"):
            output["Amount of times to turn giant"]=1
        else:
            output["Category"].append("UNKNOWN")
            if(DEVELOPEREXCEPTIONS==True):
                raise Exception("Unknown sub target type")
    return (output)

def filterUltraList(ultraList,slot,filter):
    #filter must be a List
    output=[]
    for line in ultraList:
        if(line[slot] in filter):
            output.append(line)
    return(output)

def removeDuplicatesUltraList(ultraList,slot):
    output=[]
    for line in ultraList:
        if(line[slot] not in output):
            output.append(line)
    return(output)

def superAttackMultiplierExtractor(superAttackID,super_attack_lvl,DEVEXCEPTIONS=False):
    global special_setsJP
    global special_bonusesJP
    specialRow=searchbycolumn(code=superAttackID,database=special_setsJP,column=0)
    growth_rate=int(specialRow[0][6])
    increase_rate=int(specialRow[0][5])
    multiplier=(100)+(increase_rate)+(growth_rate*(super_attack_lvl-1))
    special_bonus=searchbycolumn(code=specialRow[0][6],database=special_bonusesJP,column=0)

    return(multiplier)
    

def parseSuperAttack(unit,eza=False,DEVEXCEPTIONS=False):
    global card_specialsJP
    global special_setsJP
    global special_bonusesJP
    global specialsJP
    global optimal_awakening_growthsJP
    global skill_causalitiesJP
    global card_unique_info_set_relationsJP
    global cardsJP
    global card_categoriesGB
    output={}
    ableToEZA=qualifyEZA(unit)

    card_specialss=searchbycolumn(code=unit[0],column=1,database=card_specialsJP)
    card_specialss=removeDuplicatesUltraList(ultraList=card_specialss,slot=0)
    for card_special in card_specialss:
        superAttackDictionary={}
        superSet=searchbycolumn(code=card_special[2],column=0,database=special_setsJP)
        superAttackDictionary["superID"]=superSet[0][0]
        superAttackDictionary["superName"]=superSet[0][1]
        superAttackDictionary["superDescription"]=superSet[0][2]
        superAttackDictionary["superMinKi"]=card_special[6]
        superAttackDictionary["superPriority"]=card_special[3]
        superAttackDictionary["superStyle"]=card_special[4]
        superAttackDictionary["superMinLVL"]=card_special[5]
        superAttackDictionary["superCausality"]=superSet[0][3]
        superAttackDictionary["superAimTarget"]=superSet[0][4]
        superAttackDictionary["superIsInactive"]=superSet[0][7]
        if(superAttackDictionary["superStyle"]=="Condition"):
            causalityCondition=logicalCausalityExtractor(card_special[15])
            causalityCondition=CausalityLogicalExtractor(unit,causalityCondition,DEVEXCEPTIONS=DEVEXCEPTIONS)
            superAttackDictionary["superCondition"]=causalityCondition
        superAttackDictionary["SpecialBonus"]={}
        superAttackDictionary["SpecialBonus"]["ID"]=card_special[9]
        if(ableToEZA and eza and int(unit[14])<int(superAttackDictionary["superMinLVL"])):
            superAttackDictionary["Multiplier"]=superAttackMultiplierExtractor(superAttackID=superAttackDictionary["superID"],super_attack_lvl=int(unit[14])+5,DEVEXCEPTIONS=DEVEXCEPTIONS)
            card_supers=searchbycolumn(code=superAttackDictionary["superID"],column=1,database=specialsJP)
            for special in card_supers:
                specialsEffect=parseSpecials(special,DEVEXCEPTIONS)    
                superAttackDictionary[special[0]]=specialsEffect
            output[card_special[2]]=superAttackDictionary
        elif(ableToEZA and not (eza) and not (int(unit[14])<int(superAttackDictionary["superMinLVL"]))):
            superAttackDictionary["Multiplier"]=superAttackMultiplierExtractor(superAttackID=superAttackDictionary["superID"],super_attack_lvl=int(unit[14]),DEVEXCEPTIONS=DEVEXCEPTIONS)
            card_supers=searchbycolumn(code=superAttackDictionary["superID"],column=1,database=specialsJP)
            for special in card_supers:
                specialsEffect=parseSpecials(special,DEVEXCEPTIONS)    
                superAttackDictionary[special[0]]=specialsEffect
            output[card_special[2]]=superAttackDictionary
        elif(not ableToEZA):
            card_supers=searchbycolumn(code=superAttackDictionary["superID"],column=1,database=specialsJP)
            for special in card_supers:
                specialsEffect=parseSpecials(special,DEVEXCEPTIONS)    
                superAttackDictionary[special[0]]=specialsEffect
            output[card_special[2]]=superAttackDictionary

        if(superAttackDictionary["SpecialBonus"]["ID"]!="0"):
            superAttackDictionary["Multiplier"]=superAttackMultiplierExtractor(superAttackID=superAttackDictionary["superID"],super_attack_lvl=int(unit[14]),DEVEXCEPTIONS=DEVEXCEPTIONS)
            special_bonus=searchbycolumn(code=superAttackDictionary["SpecialBonus"]["ID"],column=0,database=special_bonusesJP)
            special_bonus=special_bonus[0]
            superAttackDictionary["SpecialBonus"]["Type"]=special_bonus[1]
            superAttackDictionary["SpecialBonus"]["Description"]=special_bonus[2]
            superAttackDictionary["SpecialBonus"]["Chance"]=special_bonus[7]
            superAttackDictionary["SpecialBonus"]["Duration"]=special_bonus[6]
            if(special_bonus[3]=="1"):
                superAttackDictionary["SpecialBonus"]["Type"]="SA multiplier increase"
                superAttackDictionary["SpecialBonus"]["Amount"]=special_bonus[9]
                
            elif(special_bonus[3]=="2"):
                superAttackDictionary["SpecialBonus"]["Type"]="Super attack Defense increase"
                superAttackDictionary["SpecialBonus"]["Amount"]=special_bonus[9]
                if(special_bonus[3]=="3"):
                    superAttackDictionary["SpecialBonus"]["Amount"]*=-1
            elif(special_bonus[3]=="3"):
                superAttackDictionary["SpecialBonus"]["Type"]="Super attack Attack and Defense increase"
                superAttackDictionary["SpecialBonus"]["Amount"]=special_bonus[9]
                if(special_bonus[3]=="3"):
                    superAttackDictionary["SpecialBonus"]["Amount"]*=-1
            elif(special_bonus[3]=="63"):
                superAttackDictionary["SpecialBonus"]["Type"]="Ki requirement decrease"
                superAttackDictionary["SpecialBonus"]["Amount"]=special_bonus[9]
            
    return(output)

def parseSpecials(specialRow,DEVEXCEPTIONS=False):
    output={}
    output["Type"]=specialRow[2][9:]
    output["Chance"]=specialRow[7]
    output["Duration"]=specialRow[6]
    output["Buff"]={}
    if(specialRow[5]=="0"):
        output["Buff"]["Type"]="Raw stats"
        output["Buff"]["+ or -"]="+"

    elif(specialRow[5]=="1"):
        output["Buff"]["Type"]="Raw stats"
        output["Buff"]["+ or -"]="-"

    elif(specialRow[5]=="2"):
        output["Buff"]["Type"]="Percentage"
        output["Buff"]["+ or -"]="+"

    elif(specialRow[5]=="3"):
        output["Buff"]["Type"]="Percentage"
        output["Buff"]["+ or -"]="-"
    else:
        output["Buff"]["Type"]="Unknown"
        output["Buff"]["+ or -"]="Unknown"
        if(DEVEXCEPTIONS==True):
                raise Exception("Unknown stat increase type")

    if(specialRow[4]=="1"):
        output["Target"]="Self"
    elif(specialRow[4]=="2"):
        output["Target"]="Allies"
    elif(specialRow[4]=="3"):
        output["Target"]="Enemy"
    elif(specialRow[4]=="4"):
        output["Target"]="All Enemies"
    elif(specialRow[4]=="12"):
        output["Target"]="Super class Allies"
    elif(specialRow[4]=="13"):
        output["Target"]="Extreme class Allies"
    elif(specialRow[4]=="16"):
        output["Target"]="Allies (self excluded)"
    else:
        output["Target"]="UNKNOWN"
        if(DEVEXCEPTIONS==True):
            raise Exception("Unknown target type")

    if(specialRow[3]=="1"):
        output["ATK"]=specialRow[9]
    elif(specialRow[3]=="2"):
        output["DEF"]=specialRow[9]
    elif(specialRow[3]=="3"):
        output["ATK"]=specialRow[9]
        output["DEF"]=specialRow[10]
    elif(specialRow[3]=="9"):
        output["Status"]="Stun"
    elif(specialRow[3]=="24"):
        output["Status"]="Disabled guard"
    elif(specialRow[3]=="48"):
        output["Status"]="Seals"
    elif(specialRow[3]=="76"):
        output["Status"]="Effective against all"
    elif(specialRow[3]=="84"):
        output["Heals"]=specialRow[9]
    elif(specialRow[3]=="90"):
        output["Crit Chance"]=specialRow[9]
    elif(specialRow[3]=="91"):
        output["Dodge chance"]=specialRow[9]
    elif(specialRow[3]=="111"):
        output["Status"]="Disabled action"
    else:
        output["Status"]="UNKNOWN"
        if(DEVEXCEPTIONS==True):
            raise Exception("Unknown special attack effect")
    return(output)
        
def parseHiddenPotential(Potential_board_id,DEVEXCEPTIONS=False):
    startTime=time.time()
    global potential_squaresJP
    global potential_square_relationsJP
    global potential_eventsJP

    nodesSearched={}
    
    nodesSearching={}
    allNodes=searchbycolumn(code=Potential_board_id,column=1,database=potential_squaresJP)
    allNodeIDs=[node[0] for node in allNodes]
    relevantRelations=[]
    for connection in potential_square_relationsJP:
        if(connection[1] in allNodeIDs):
            relevantRelations.append(connection)
    pathNodes=[]
    for node in allNodes:
        if(node[4]=="1"):
            pathNodes.append(node[0])
        if("" in searchbyid(code=node[0],codecolumn=1,database=relevantRelations,column=2)):
            nodesSearched[node[0]]=0
    furthestNodesFound=nodesSearched.copy()
    newNodes=True
    
    while(newNodes==True):
        newNodes=False
        for node in furthestNodesFound:
            connections=searchbyid(code=node,codecolumn=1,database=relevantRelations,column=2)
            for connection in connections:
                if(connection!=""):
                    if(connection[:-2] not in pathNodes):
                        if(connection[:-2] not in nodesSearched and connection[:-2] not in nodesSearching):
                            nodesSearching[connection[:-2]]=nodesSearched[node]
                            newNodes=True
                    else:
                        if(connection[:-2] not in nodesSearched and connection[:-2] not in nodesSearching):
                            path=searchbyid(code=connection[:-2],codecolumn=0,database=potential_squaresJP,column=5)
                            nodesSearching[connection[:-2]]=1+int(path[0][:-2])
                            newNodes=True
        nodesSearched.update(nodesSearching)
        furthestNodesFound=nodesSearching.copy()
        nodesSearching={}
                







    output={}
    output[0]={"HP":0,"ATK":0,"DEF":0}
    output[1]={"HP":0,"ATK":0,"DEF":0}
    output[2]={"HP":0,"ATK":0,"DEF":0}
    output[3]={"HP":0,"ATK":0,"DEF":0}
    output[4]={"HP":0,"ATK":0,"DEF":0}
    for node in nodesSearched:
        eventid=searchbyid(code=node,codecolumn=0,database=potential_squaresJP,column=2)[0]
        event=searchbycolumn(code=eventid,database=potential_eventsJP,column=0)[0]
        if(event[1]=="PotentialEvent::Hp"):
            output[nodesSearched[node]]["HP"]+=int(event[3])
        elif(event[1]=="PotentialEvent::Atk"):
            output[nodesSearched[node]]["ATK"]+=int(event[3])
        elif(event[1]=="PotentialEvent::Defense"):
            output[nodesSearched[node]]["DEF"]+=int(event[3])
    return(output)

def parseLeaderSkill(unit,leader_skill_id,DEVEXCEPTIONS=False):
    global dokkan_fieldsJP
    global skill_causalitiesJP
    global card_unique_info_set_relationsJP
    global cardsJP
    global card_categoriesGB
    global sub_target_typesJP
    global leader_skillsJP
    output={}
    leader_skill_lines=searchbycolumn(code=unit[22][:-2],database=leader_skillsJP,column=1,printing=False)
    for leader_skill_line in leader_skill_lines:
        output[leader_skill_line[0]]={}
        output[leader_skill_line[0]]["Buff"]={}
        if(leader_skill_line[8]=="0"):
            output[leader_skill_line[0]]["Buff"]["Type"]="Raw stats"
            output[leader_skill_line[0]]["Buff"]["+ or -"]="+"

        elif(leader_skill_line[8]=="1"):
            output[leader_skill_line[0]]["Buff"]["Type"]="Raw stats"
            output[leader_skill_line[0]]["Buff"]["+ or -"]="-"

        elif(leader_skill_line[8]=="2"):
            output[leader_skill_line[0]]["Buff"]["Type"]="Percentage"
            output[leader_skill_line[0]]["Buff"]["+ or -"]="+"

        elif(leader_skill_line[8]=="3"):
            output[leader_skill_line[0]]["Buff"]["Type"]="Percentage"
            output[leader_skill_line[0]]["Buff"]["+ or -"]="-"
        else:
            output[leader_skill_line[0]]["Buff"]["Type"]="Unknown"
            output[leader_skill_line[0]]["Buff"]["+ or -"]="Unknown"
            if(DEVEXCEPTIONS==True):
                    raise Exception("Unknown stat increase type")
        
        output[leader_skill_line[0]]["Target"]={}
        efficiacy_values=leader_skill_line[7].replace("[","").replace("]","").split(",")
        output[leader_skill_line[0]]["Target"]=(sub_target_types_extractor(leader_skill_line[4],DEVEXCEPTIONS))
        if(leader_skill_line[3]=="4"):
            output[leader_skill_line[0]]["Target"]["Allies or enemies"]="Enemies"
        elif(leader_skill_line[3]=="2"):
            output[leader_skill_line[0]]["Target"]["Allies or enemies"]="Allies"
        if leader_skill_line[6]=="0":
            output[leader_skill_line[0]]["NOT WORKING"]=True
        elif(leader_skill_line[6]=="1"):
            output[leader_skill_line[0]]["ATK"]=int(efficiacy_values[0])
        elif(leader_skill_line[6]=="2"):
            #Enemy ["DEF", ??, ??] 
            output[leader_skill_line[0]]["DEF"]=int(efficiacy_values[0])
        elif(leader_skill_line[6]=="3"):
            #Category ["HP and ATK", "DEF", ""] 
            output[leader_skill_line[0]]["HP"]=int(efficiacy_values[0])
            output[leader_skill_line[0]]["ATK"]=int(efficiacy_values[0])
            output[leader_skill_line[0]]["DEF"]=int(efficiacy_values[1])
        elif(leader_skill_line[6]=="5"):
            #Category ["Ki", "", ""] 
            output[leader_skill_line[0]]["Ki"]=int(efficiacy_values[0])
        elif(leader_skill_line[6]=="13"):
            #All types damage reduction
            output[leader_skill_line[0]]["DR"]=100-int(efficiacy_values[0])
        elif(leader_skill_line[6]=="16"):
            #Single type [Typing, "ATK", ""] 
            output[leader_skill_line[0]]["Target"]["Typing"]=typefinder(efficiacy_values[0],printing=True)
            output[leader_skill_line[0]]["ATK"]=int(efficiacy_values[1])
        elif(leader_skill_line[6]=="17"):
            #Single type [Typing, "DEF", ""] 
            output[leader_skill_line[0]]["Target"]["Typing"]=typefinder(efficiacy_values[0],printing=True)
            output[leader_skill_line[0]]["DEF"]=int(efficiacy_values[1])
        elif(leader_skill_line[6]=="18"):
            #Single type [Typing, "ATK and DEF", ""] 
            output[leader_skill_line[0]]["Target"]["Typing"]=typefinder(efficiacy_values[0],printing=True)
            output[leader_skill_line[0]]["ATK"]=int(efficiacy_values[1])
            output[leader_skill_line[0]]["DEF"]=int(efficiacy_values[2])
        elif(leader_skill_line[6]=="19"):
            #Single type [Type, "HP", ""] 
            output[leader_skill_line[0]]["Target"]["Typing"]=typefinder(efficiacy_values[0],printing=True)
            output[leader_skill_line[0]]["HP"]=int(efficiacy_values[1])
        elif(leader_skill_line[6]=="20"):
            #Single Type (Type, "Ki", "") 
            output[leader_skill_line[0]]["Target"]["Typing"]=typefinder(efficiacy_values[0],printing=True)
            output[leader_skill_line[0]]["Ki"]=int(efficiacy_values[1])
        elif(leader_skill_line[6]=="44"):
            #Single Type (Type, HP, ATK) 
            output[leader_skill_line[0]]["Target"]["Typing"]=typefinder(efficiacy_values[0],printing=True)
            output[leader_skill_line[0]]["HP"]=int(efficiacy_values[1])
            output[leader_skill_line[0]]["ATK"]=int(efficiacy_values[2])
        elif(leader_skill_line[6]=="50"):
            #Immune to negative effects
            output[leader_skill_line[0]]["Status"]=["Immune to negative effects"]
        elif(leader_skill_line[6]=="58"):
            #Heal per ki of own type
            output[leader_skill_line[0]]["Building Stat"]= {"Cause":"Ki sphere obtained", "Type":"Own type"}
            output[leader_skill_line[0]]["Heals"]=int(efficiacy_values[0])
        elif(leader_skill_line[6]=="59"):
            #ATK per ki sphere obtained
            output[leader_skill_line[0]]["Building Stat"]= {"Cause":"Ki sphere obtained", "Type":"Any"}
            output[leader_skill_line[0]]["ATK"]=int(efficiacy_values[0])
        elif(leader_skill_line[6]=="61"):
            #ATK and DEF per ki sphere obtained
            output[leader_skill_line[0]]["Building Stat"]= {"Cause":"Ki sphere obtained", "Type":"Any"}
            output[leader_skill_line[0]]["ATK"]=int(efficiacy_values[0])
            output[leader_skill_line[0]]["DEF"]=int(efficiacy_values[1])
        elif(leader_skill_line[6]=="64"):
            #ATK per ki sphere obtained of a type
            output[leader_skill_line[0]]["Building Stat"]= {"Cause":"Ki sphere obtained", "Type":KiOrbType(efficiacy_values[0],DEVEXCEPTIONS=DEVEXCEPTIONS)}
            output[leader_skill_line[0]]["ATK"]=int(efficiacy_values[1])
            output[leader_skill_line[0]]["Target"]["Typing"]=typefinder(efficiacy_values[0],printing=True)
        elif(leader_skill_line[6]=="71"):
            #HP based ["Min ATK", "MAX ATK", ???] 
            output[leader_skill_line[0]]["Building Stat"]={"Cause":"HP", "Type":"More HP remaining"}
            output[leader_skill_line[0]]["ATK"]=int(efficiacy_values[1])
            output[leader_skill_line[0]]["Building Stat"]["Min"]=int(efficiacy_values[0])
            output[leader_skill_line[0]]["Building Stat"]["Max"]=int(efficiacy_values[1])
        elif(leader_skill_line[6]=="82"):
            #Typing [Typing, "HP and ATK and DEF", ""] 
            output[leader_skill_line[0]]["Target"]["Class"]=extractClassType(efficiacy_values[0],DEVEXCEPTIONS=DEVEXCEPTIONS)[0]
            output[leader_skill_line[0]]["Target"]["Typing"]=extractClassType(efficiacy_values[0],DEVEXCEPTIONS=DEVEXCEPTIONS)[1]
            output[leader_skill_line[0]]["HP"]=int(efficiacy_values[1])
            output[leader_skill_line[0]]["ATK"]=int(efficiacy_values[1])
            output[leader_skill_line[0]]["DEF"]=int(efficiacy_values[1])
        elif(leader_skill_line[6]=="83"):
            #Typing ki
            output[leader_skill_line[0]]["Ki"]=int(efficiacy_values[1])
        elif(leader_skill_line[6]=="84"):
            #Typing HP ATK and DEF
            output[leader_skill_line[0]]["HP"]=int(efficiacy_values[1])
            output[leader_skill_line[0]]["ATK"]=int(efficiacy_values[1])
            output[leader_skill_line[0]]["DEF"]=int(efficiacy_values[1])
        elif(leader_skill_line[6]=="93"):
            #All types or specific type HP
            output[leader_skill_line[0]]["Target"]["Class"]=extractClassType(efficiacy_values[0],DEVEXCEPTIONS=DEVEXCEPTIONS)[0]
            output[leader_skill_line[0]]["Target"]["Typing"]=extractClassType(efficiacy_values[0],DEVEXCEPTIONS=DEVEXCEPTIONS)[1]
            output[leader_skill_line[0]]["HP"]=int(efficiacy_values[1])
        elif(leader_skill_line[6]=="102"):
            output[leader_skill_line[0]]["Times to turn giant"]=int(efficiacy_values[1])
        elif(leader_skill_line[6]=="104"):
            #Category ["HP", "ATK","DEF"] 
            output[leader_skill_line[0]]["HP"]=int(efficiacy_values[0])
            output[leader_skill_line[0]]["ATK"]=int(efficiacy_values[1])
            output[leader_skill_line[0]]["DEF"]=int(efficiacy_values[2])
        else:
            output[leader_skill_line[0]]["Ki"]="UNKNOWN"
            output[leader_skill_line[0]]["HP"]="UNKNOWN"
            output[leader_skill_line[0]]["ATK"]="UNKNOWN"
            output[leader_skill_line[0]]["DEF"]="UNKNOWN"
            if(DEVEXCEPTIONS==True):
                raise Exception("Unknown leader skill")
            
        if(leader_skill_line[5]!=""):
            causalityCondition=logicalCausalityExtractor(leader_skill_line[5])
            causalityCondition=CausalityLogicalExtractor(unit,causalityCondition,DEVEXCEPTIONS=DEVEXCEPTIONS)
            output[leader_skill_line[0]]["Condition"]=causalityCondition
        if("Typing" in output[leader_skill_line[0]]["Target"]):
            if(output[leader_skill_line[0]]["Target"]["Typing"]==["PHY","STR","INT","TEQ","AGL"]):
                output[leader_skill_line[0]]["Target"].pop("Typing")

    temp=output.copy()
    for line in temp:
        if("NOT WORKING" in output[line]):
            output.pop(line)
    return(output)

def turnintoJson(data,filename, directoryName="" ):
    if filename.endswith(".json")==False:
        filename+=".json"
    if(directoryName!=""):
        if(directoryName[-1]!="/"):
            directoryName+="/"
    with open(directoryName+filename, 'w') as f:
        json.dump(data, f, indent=4)

def JPExclusiveCheck(unitid):
    global cardsGB
    globalVersion=searchbycolumn(code=unitid,column=0,database=cardsGB)
    if(globalVersion==[]):
        return(True)
    else:
        return(False)

def parseStandby(unit,DEVEXCEPTIONS=False):
    #WIP
    global card_finish_skill_set_relationsJP
    global card_standby_skill_set_relationsJP
    global finish_skillsJP
    global finish_specialsJP
    global card_finish_skill_set_relationsJP

    output={}
    standby_skill_set_id=searchbyid(code=unit[0],codecolumn=1,database=card_standby_skill_set_relationsJP,column=2)
    if(standby_skill_set_id!=None):
        standby_skill_set_id=standby_skill_set_id[0]
        output["Standby or Finish"]="Standby"
        if(JPExclusiveCheck(unit[0])):
            global standby_skill_setsJP
            standby_skill_setsRow=searchbycolumn(code=standby_skill_set_id,database=standby_skill_setsJP,column=0)[0]
        else:
            global standby_skill_setsGB
            standby_skill_setsRow=searchbycolumn(code=standby_skill_set_id,database=standby_skill_setsGB,column=0)[0]
        output["ID"]=standby_skill_set_id
        output["Exec limit"]=standby_skill_setsRow[4]
        compiled_causality_conditions=standby_skill_setsRow[5]
        standby_skills_rows=searchbycolumn(code=standby_skill_set_id,database=standby_skillsJP,column=1)
        for standby_skill_row in standby_skills_rows:
            efficiacy_value=standby_skill_row[8].replace("[","").replace("]","").replace("{","").replace("}","").replace(" ","").replace('"',"").split(",")
            if(standby_skill_row[6]=="103"):
                output["Exchanges to"]=efficiacy_value[0]
            elif(standby_skill_row[6]=="115"):
                output["Standby Exclusivity"]=efficiacy_value[0][5:]
            elif(standby_skill_row[6]=="116"):
                output["Charge type"]={}
                output["Charge type"]["type"]=efficiacy_value[0][5:]
                output["Charge type"]["gauge_value"]=efficiacy_value[1][12:]
                output["Charge type"]["count_multiplier"]=efficiacy_value[2][17:]
                output["Charge type"]["max_effect_value"]=efficiacy_value[3][17:]
            else:
                if(DEVEXCEPTIONS):
                    raise Exception("Unknown standby skill")





    finish_skill_set_ids=searchbyid(code=unit[0],codecolumn=1,database=card_finish_skill_set_relationsJP,column=2)
    if(finish_skill_set_ids!=None):
        for finish_skill_set_id in finish_skill_set_ids:
            output[finish_skill_set_id]={}
            output[finish_skill_set_id]["Standby or Finish"]="Finish"
            if(JPExclusiveCheck(unit[0])):
                global finish_skill_setsJP
                finish_skill_setsRow=searchbycolumn(code=finish_skill_set_id,database=finish_skill_setsJP,column=0)[0]
            else:
                global finish_skill_setsGB
                finish_skill_setsRow=searchbycolumn(code=finish_skill_set_id,database=finish_skill_setsGB,column=0)[0]
            output[finish_skill_set_id]["ID"]=finish_skill_set_id
            output[finish_skill_set_id]["Name"]=finish_skill_setsRow[1]
            output[finish_skill_set_id]["Description"]=finish_skill_setsRow[2]
            if(finish_skill_setsRow[6]=="0"):
                output[finish_skill_set_id]["Timing"]="On activation"
            elif(finish_skill_setsRow[6]=="17"):
                output[finish_skill_set_id]["Timing"]="On Revive"
            elif(finish_skill_setsRow[6]=="6"):
                output[finish_skill_set_id]["Timing"]="On Counter"
            else:
                output[finish_skill_set_id]["Timing"]="UNKNOWN"
                if(DEVEXCEPTIONS):
                    raise Exception("Unknown timing")
                
            compiled_causality_conditions=finish_skill_setsRow[8]
            condition=standbylogicalCausalityExtractor(compiled_causality_conditions)
            output[finish_skill_set_id]["Condition"]=condition

            finish_special_id=finish_skill_setsRow[9]
            finish_special_multiplier=searchbyid(code=finish_special_id,codecolumn=0,database=finish_specialsJP,column=1)
            if(finish_special_multiplier!=None):
                finish_special_multiplier=finish_special_multiplier[0]
                output[finish_skill_set_id]["Multiplier"]=int(finish_special_multiplier)

            finish_skills_rows=searchbycolumn(code=finish_skill_set_id,database=finish_skillsJP,column=1)
            for finish_skill_row in finish_skills_rows:
                efficiacy_value=finish_skill_row[8].replace("[","").replace("]","").replace("{","").replace("}","").replace(" ","").replace('"',"").split(",")
                if(finish_skill_row[6]=="4"):
                    output[finish_skill_set_id]["Heals"]=int(efficiacy_value[0])
                elif(finish_skill_row[6]=="5"):
                    output[finish_skill_set_id]["Ki"]=int(efficiacy_value[0])
                elif(finish_skill_row[6]=="90"):
                    output[finish_skill_set_id]["Crit Chance"]=int(efficiacy_value[0])
                elif(finish_skill_row[6]=="103"):
                    output[finish_skill_set_id]["Exchanges to"]=efficiacy_value[0]
                elif(finish_skill_row[6]=="110"):
                    output[finish_skill_set_id]["CONFUSION"]=True
                elif(finish_skill_row[6]=="115"):
                    output[finish_skill_set_id]["Standby Exclusivity"]=efficiacy_value[0][5:]
                elif(finish_skill_row[6]=="116"):
                    output[finish_skill_set_id]["CONFUSION"]=True
                elif(finish_skill_row[6]=="117"):
                    output[finish_skill_set_id]["CONFUSION"]=True
                elif(finish_skill_row[6]=="118"):
                    output[finish_skill_set_id]["Multipler per charge"]=int(efficiacy_value[0])
                    output[finish_skill_set_id]["Max multiplier"]=int(efficiacy_value[1])
                elif(finish_skill_row[6]=="119"):
                    output[finish_skill_set_id]["CONFUSION"]=True
                elif(finish_skill_row[6]=="120"):
                    output[finish_skill_set_id]["CONFUSION"]=True

                    
                else:
                    if(DEVEXCEPTIONS):
                        raise Exception("Unknown finish skill")

        
        


    return(output)

def unicode_fixer(input):
    if isinstance(input, str):
        return input.encode('utf-8').decode('unicode-escape')
    elif isinstance(input, list):
        return [unicode_fixer(item) for item in input]
    elif isinstance(input, dict):
        return {key: unicode_fixer(value) for key, value in input.items()}
    else:
        return input




def standbylogicalCausalityExtractor(compiled_causality_conditions):
    causality=unicode_fixer(compiled_causality_conditions)
    causality=causality.replace(' ',"")
    causality=causality.replace('["&",["',"")
    causality=causality.replace('type",55,[1]],["',"Charge generated")
    causality=causality.replace('",["type",52],["int",',"")
    causality=causality.replace(']]]',"")
    causality=causality.replace('["type",40]',"When a super attack is aimed at this character")
    causality=causality.replace('["type",0]',"When this character revives")
    

    return(causality)



def getKiMultipliers(unit):
    maxMultiplier=float(unit[34])
    multipliers={}
    if(getrarity(unit)=="lr"):
        eball_mod_max=float(unit[34])
        eball_mod_mid=float(unit[32])
        for kiAmount in range(0,25):
            multipliers[int(kiAmount)]=((eball_mod_max-eball_mod_mid)/12)*(kiAmount-12)+eball_mod_mid
    else:
        eball_mod_max=float(unit[34])
        max_ki=12.0
        for kiAmount in range(0,13):
            multipliers[int(kiAmount)]=(eball_mod_max/2)+(eball_mod_max/2)*(kiAmount/max_ki)
    return(multipliers)

def getStatsAtAllLevels(unit):
    output={}
    for level in range(1,int(unit[13])+1):
        output[level]=getUnitStats(unit,level)
    return(output)

def shortenPassiveDictionary(oldPassiveDictionary):
    passiveDictionary=oldPassiveDictionary.copy()
    if "Revive" in passiveDictionary:
        if passiveDictionary["Revive"]["Activated"]==False:
            passiveDictionary.pop("Revive")
    if "Toggle Other Line" in passiveDictionary:
        if passiveDictionary["Toggle Other Line"]["Activated"]==False:
            passiveDictionary.pop("Toggle Other Line")
    if "Standby" in passiveDictionary:
        if "Change form" in passiveDictionary["Standby"]:
            if passiveDictionary["Standby"]["Change form"]["Activated"]==False:
                passiveDictionary["Standby"].pop("Change form")
        if "Damage enemy" in passiveDictionary["Standby"]:
            if passiveDictionary["Standby"]["Damage enemy"]["Activated"]==False:
                passiveDictionary["Standby"].pop("Damage enemy")
        if passiveDictionary["Standby"]["Activated"]==False:
            passiveDictionary.pop("Standby")
    if "Forsee Super Attack" in passiveDictionary:
        if passiveDictionary["Forsee Super Attack"]==False:
            passiveDictionary.pop("Forsee Super Attack")
    if "Guaranteed hit" in passiveDictionary:
        if passiveDictionary["Guaranteed hit"]==False:
            passiveDictionary.pop("Guaranteed hit")
    if "Dodge chance" in passiveDictionary:
        if passiveDictionary["Dodge chance"]==0:
            passiveDictionary.pop("Dodge chance")
    if "Effective against all" in passiveDictionary:
        if passiveDictionary["Effective against all"]==False:
            passiveDictionary.pop("Effective against all")
    if "Transformation" in passiveDictionary:
        if passiveDictionary["Transformation"]["Activated"]==False:
            passiveDictionary.pop("Transformation")
    if "Slot" in passiveDictionary:
        if passiveDictionary["Slot"]==None:
            passiveDictionary.pop("Slot")
    if "Additional attack" in passiveDictionary:
        if passiveDictionary["Additional attack"]["Activated"]==False:
            passiveDictionary.pop("Additional attack")
    if "Timing" in passiveDictionary:
        if passiveDictionary["Timing"]==None:
            passiveDictionary.pop("Timing")
    if "Building Stat" in passiveDictionary:
        if passiveDictionary["Building Stat"]["Cause"]==None:
            passiveDictionary.pop("Building Stat")
    if "ATK" in passiveDictionary:
        if passiveDictionary["ATK"]==0:
            passiveDictionary.pop("ATK")
    if "DEF" in passiveDictionary:
        if passiveDictionary["DEF"]==0:
            passiveDictionary.pop("DEF")
    if "Heals" in passiveDictionary:
        if passiveDictionary["Heals"]==0:
            passiveDictionary.pop("Heals")
    if "Ki" in passiveDictionary:
        if passiveDictionary["Ki"]==0:
            passiveDictionary.pop("Ki")
    if "Status" in passiveDictionary:
        if passiveDictionary["Status"]==[]:
            passiveDictionary.pop("Status")
    if "DR" in passiveDictionary:
        if passiveDictionary["DR"]==0:
            passiveDictionary.pop("DR")
    if "Guard" in passiveDictionary:
        if passiveDictionary["Guard"]==False:
            passiveDictionary.pop("Guard")
    if "Crit Chance" in passiveDictionary:
        if passiveDictionary["Crit Chance"]==0:
            passiveDictionary.pop("Crit Chance")
    if "Ki change" in passiveDictionary:
        if (passiveDictionary["Ki change"]["From"]==None and passiveDictionary["Ki change"]["To"]==None):
            passiveDictionary.pop("Ki change")
    if "Target" in passiveDictionary:
        if "Category" in passiveDictionary["Target"]:
            if passiveDictionary["Target"]["Category"]==None:
                passiveDictionary["Target"].pop("Category")
        if "Class" in passiveDictionary["Target"]:
            if passiveDictionary["Target"]["Class"]==[]:
                passiveDictionary["Target"].pop("Class")
        if "Type" in passiveDictionary["Target"]:
            if passiveDictionary["Target"]["Type"]==[]:
                passiveDictionary["Target"].pop("Type")
        if "Target" in passiveDictionary["Target"]:
            if passiveDictionary["Target"]["Target"]=="Self":
                passiveDictionary["Target"].pop("Target")
        if passiveDictionary["Target"]=={}:
            passiveDictionary.pop("Target")
    if "Chance" in passiveDictionary:
        if passiveDictionary["Chance"]=="100":
            passiveDictionary.pop("Chance")
    if "Length" in passiveDictionary:
        if passiveDictionary["Length"]==None:
            passiveDictionary.pop("Length")
    if "First turn to activate" in passiveDictionary:
        if passiveDictionary["First turn to activate"]==0:
            passiveDictionary.pop("First turn to activate")
    if "Condition" in passiveDictionary:
        if passiveDictionary["Condition"]==None:
            passiveDictionary.pop("Condition")
    if "Once only" in passiveDictionary:
        if passiveDictionary["Once only"]==False:
            passiveDictionary.pop("Once only")
    if "Counter" in passiveDictionary:
        if "Activated" in passiveDictionary["Counter"]:
            if "DR from normals" in passiveDictionary["Counter"]:
                if passiveDictionary["Counter"]["DR from normals"]==None:
                    passiveDictionary["Counter"].pop("DR from normals")
            if passiveDictionary["Counter"]["Activated"]==False:
                passiveDictionary.pop("Counter")
    if "Nullification" in passiveDictionary:
        if passiveDictionary["Nullification"]["Activated"]==False:
            passiveDictionary.pop("Nullification")
    if "Domain expansion" in passiveDictionary:
        if passiveDictionary["Domain expansion"]["Activated"]==False:
            passiveDictionary.pop("Domain expansion")
        

    return(passiveDictionary)

def extractPassiveLine(unit,passiveskill,printing=False,DEVEXCEPTIONS=False):
    global passive_skillsJP
    global passive_skill_set_relationsJP
    global dokkan_fieldsJP
    global dokkan_field_passive_skill_relationsJP
    global battle_paramsJP
    global skill_causalitiesJP
    global card_unique_info_set_relationsJP
    global cardsJP
    global sub_target_typesJP
    global card_categoriesGB
    effects={
        "ID": passiveskill[0],
        "Domain expansion": {
            "Activated": False,
            "ID": None,
            "Name": None
        },
        "Revive":{
            "Activated": False,
            "HP recovered": None
        },
        "Nullification": {
            "Activated": False,
            "Absorbed": 0
        },
        "Toggle Other Line":{
            "Activated": False,
            "Line": None
        },
        "Counter": {
            "Activated": False,
            "Multiplier": None,
            "DR from normals": None
        },
        "Standby": {
            "Activated": False,
            "Change form": {
                "Activated": False,
                "Unit": None
            },
            "Damage enemy": {
                "Activated": False,
                "Multiplier": None
            }
        },
        "Forsee Super Attack": False,
        "Guaranteed hit": False,
        "Dodge chance": 0,
        "Effective against all": False,
        "Transformation": {
            "Activated": False,
            "Unit": None,
            "Giant/Rage": False,
            "Min Turns": None,
            "Max Turns": None,
            "Reverse chance": None
        },
        "Slot": None,
        "Additional attack":{
            "Activated": False,
            "Chance of super": None
        },
        "Timing": None,
        "Building Stat":{
            "Min": 0,
            "Max": 0,
            "Cause": None
        },
        "ATK": 0,
        "DEF": 0,
        "Heals": 0,
        "Ki": 0,
        "Status": [],
        "DR": 0,
        "Guard": False,
        "Crit Chance": 0,
        "Crit Chance": 0,
        "Ki change": {
            "From": None,
            "To": None
        },
        "Target": {
            "Category": None,
            "Target": None,
            "Class": [],
            "Type": []
        },
        "Buff": {
            "Type": None,
            "+ or -": None
        },
        "Chance": None,
        "Length": None,
        #first turn counts as turn 0
        "First turn to activate": 0,
        "Condition": None,
        "Once only": False
    }
    if(passiveskill[8]=="0"):
        effects["Buff"]["Type"]="Raw stats"
        effects["Buff"]["+ or -"]="+"

    elif(passiveskill[8]=="1"):
        effects["Buff"]["Type"]="Raw stats"
        effects["Buff"]["+ or -"]="-"

    elif(passiveskill[8]=="2"):
        effects["Buff"]["Type"]="Percentage"
        effects["Buff"]["+ or -"]="+"

    elif(passiveskill[8]=="3"):
        effects["Buff"]["Type"]="Percentage"
        effects["Buff"]["+ or -"]="-"
    else:
        effects["Buff"]["Type"]="Unknown"
        effects["Buff"]["+ or -"]="Unknown"
        if(DEVEXCEPTIONS==True):
                raise Exception("Unknown stat increase type")
    

    effects["Chance"]=passiveskill[11]

    if(passiveskill[6]!="0"):
        TargetRow=searchbycolumn(code=passiveskill[6],database=sub_target_typesJP,column=1)[0]
        TargetCategory=CategoryExtractor(TargetRow[3])
        effects["Target"]["Category"]=TargetCategory


    if(passiveskill[5]=="1"):
        effects["Target"]["Target"]="Self"
    elif(passiveskill[5]=="2"):
        effects["Target"]["Target"]="Allies"
    elif(passiveskill[5]=="3"):
        effects["Target"]["Target"]="Enemy"
    elif(passiveskill[5]=="4"):
        effects["Target"]["Target"]="Enemies"
    elif(passiveskill[5]=="5"):
        effects["Target"]["Target"]="Allies"
        #For some reason int dfe future gohan has this on his ki support, even though this couldve been under 2
    elif(passiveskill[5]=="12"):
        effects["Target"]["Class"]="Super"
        effects["Target"]["Target"]="Allies"
    elif(passiveskill[5]=="13"):
        effects["Target"]["Class"]="Extreme"
        effects["Target"]["Target"]="Allies"
    elif(passiveskill[5]=="14"):
        effects["Target"]["Class"]="Super"
        effects["Target"]["Target"]="Enemies"
    elif(passiveskill[5]=="15"):
        effects["Target"]["Class"]="Extreme"
        effects["Target"]["Target"]="Enemies"
    elif(passiveskill[5]=="16"):
        effects["Target"]["Target"]="Allies(self excluded)"
    else:
        effects["Target"]["Target"]=("UNKNOWN TARGET")
        if(DEVEXCEPTIONS==True):
            raise Exception("UNKNOWN TARGET")

    
    if(passiveskill[4]=="0"):
        effects["Domain expansion"]["Activated"]=True
        domainID=searchbyid(code=passiveskill[0],codecolumn=2,database=dokkan_field_passive_skill_relationsJP,column=1)[0]
        effects["Domain expansion"]["ID"]=domainID
        domainName=searchbyid(code=domainID,codecolumn=1,database=dokkan_fieldsJP,column=2)[0]
        effects["Domain expansion"]["Name"]=domainName

    elif passiveskill[4]=="1":
        effects["ATK"]+=int(passiveskill[13])
    elif passiveskill[4]=="2":
        effects["DEF"]+=int(passiveskill[13])
    elif passiveskill[4]=="3":
        effects["ATK"]+=int(passiveskill[13])
        effects["DEF"]+=int(passiveskill[14])
    elif passiveskill[4]=="4":
        effects["Heals"]+=int(passiveskill[13])
    elif passiveskill[4]=="5":
        effects["Ki"]+=int(passiveskill[13])
    elif passiveskill[4]=="9":
        effects["Status"].append("Stun")
    elif passiveskill[4]=="13":
        effects["DR"]+=100-int(passiveskill[13])
    elif passiveskill[4]=="16":
        typing=extractAllyTyping(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)
        effects["ATK"]+=int(passiveskill[14])
        effects["Target"]["Type"]=typing
    elif passiveskill[4]=="17":
        typing=extractAllyTyping(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)
        effects["DEF"]+=int(passiveskill[14])
        effects["Target"]["Type"]=typing
    elif passiveskill[4]=="18":
        typing=extractAllyTyping(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)
        effects["ATK"]+=int(passiveskill[14])
        effects["DEF"]+=int(passiveskill[14])
        effects["Target"]["Type"]=typing
    elif passiveskill[4]=="20":
        typing=extractAllyTyping(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)
        effects["Ki"]+=int(passiveskill[14])
        effects["Target"]["Type"]=typing
    elif passiveskill[4]=="24":
        effects["Status"].append("Disable guard")
    elif passiveskill[4]=="28":
        effects["Heals"]+=int(passiveskill[13])
    elif passiveskill[4]=="38":
        if(DEVEXCEPTIONS==True):
            raise Exception("Unknown effect")
    elif passiveskill[4]=="47":
        if(DEVEXCEPTIONS==True):
            raise Exception("Unknown effect")
    elif passiveskill[4]=="48":
        effects["Status"].append("Seal")
    elif passiveskill[4]=="50":
        effects["Status"].append("Immune to negative effects")
    elif passiveskill[4]=="51":
        type1=KiOrbType(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)
        type2=KiOrbType(passiveskill[14],DEVEXCEPTIONS=DEVEXCEPTIONS)
        effects["Ki change"]["From"]=type1
        effects["Ki change"]["To"]=type2
    elif passiveskill[4]=="52":
        effects["Status"].append("Survive K.O attacks")
    elif passiveskill[4]=="53":
        effects["Status"].append("DEF reduced to 0")
    elif passiveskill[4]=="59":
        effects["Building Stat"]["Cause"]={"Cause":"Ki sphere obtained", "Type":"any"}
        effects["ATK"]+=int(passiveskill[13])
    elif passiveskill[4]=="60":
        effects["Building Stat"]["Cause"]={"Cause":"Ki sphere obtained", "Type":"any"}
        effects["DEF"]+=int(passiveskill[13])
    elif passiveskill[4]=="61":
        effects["Building Stat"]["Cause"]={"Cause":"Ki sphere obtained", "Type":"any"}
        effects["ATK"]+=int(passiveskill[13])
        effects["DEF"]+=int(passiveskill[13])
    elif passiveskill[4]=="64":
        typing=KiOrbType(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)
        effects["Building Stat"]["Cause"]={"Cause":"Ki sphere obtained", "Type":typing}
        effects["ATK"]+=int(passiveskill[14])
    elif passiveskill[4]=="65":
        typing=KiOrbType(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)
        effects["Building Stat"]["Cause"]={"Cause":"Ki sphere obtained", "Type":typing}
        effects["DEF"]+=int(passiveskill[14])
    elif passiveskill[4]=="66":
        typing=KiOrbType(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)
        effects["Building Stat"]["Cause"]={"Cause":"Ki sphere obtained", "Type":typing}
        effects["ATK"]+=int(passiveskill[14])
        effects["DEF"]+=int(passiveskill[14])
    elif passiveskill[4]=="67":
        type1=binaryOrbType(passiveskill[13],DEVEXCEPTIONS)
        type2=binaryOrbType(passiveskill[14],DEVEXCEPTIONS)
        effects["Ki change"]["From"]=type1
        effects["Ki change"]["To"]=type2
        
    elif passiveskill[4]=="68":
        if(passiveskill[13]=="4"):
            effects["Heals"]+=int(passiveskill[15])
            effects["Building Stat"]["Cause"]={"Cause":"Ki sphere obtained", "Type":KiOrbType(passiveskill[14],DEVEXCEPTIONS)}
        else:
            #buffs per ki sphere
            effects["Building Stat"]["Cause"]={"Cause":"Ki sphere obtained", "Type":binaryOrbType(passiveskill[13],DEVEXCEPTIONS)}
            if(passiveskill[14]=="1"):
                effects["ATK"]+=int(passiveskill[15])
            elif(passiveskill[14]=="2"):
                effects["Heals"]+=int(passiveskill[15])
            elif(passiveskill[14]=="3"):
                effects["DEF"]+=int(passiveskill[15])
            elif(passiveskill[14]=="4"):
                effects["Crit Chance"]+=int(passiveskill[15])
            elif(passiveskill[14]=="5"):
                effects["Dodge chance"]+=int(passiveskill[15])
            elif(passiveskill[14]=="6"):
                effects["DR"]+=int(passiveskill[15])
            else:
                if(DEVEXCEPTIONS==True):
                    raise Exception("Unknown buff")
    elif passiveskill[4]=="69":
        effects["Ki change"]["From"]=["AGL","TEQ","INT","STR","PHY","Rainbow","Sweet treats"]
        effects["Ki change"]["To"]=KiOrbType(passiveskill[13])
    elif passiveskill[4]=="71":
        if(int(passiveskill[13])>int(passiveskill[14])):
            #The less HP remaining the greater the stats boost
            effects["ATK"]+=int(passiveskill[13])
            effects["Building Stat"]["Cause"]={"Cause":"HP", "Type":"Less HP remaining"}
            effects["Building Stat"]["Max"]+=int(passiveskill[13])
            effects["Building Stat"]["Min"]+=int(passiveskill[14])
        else:
            #The more HP remaining the greater the stats boost
            effects["ATK"]+=int(passiveskill[14])
            effects["Building Stat"]["Cause"]={"Cause":"HP", "Type":"More HP remaining"}
            effects["Building Stat"]["Max"]+=int(passiveskill[14])
            effects["Building Stat"]["Min"]+=int(passiveskill[13])
    elif passiveskill[4]=="72":
        if(int(passiveskill[13])>int(passiveskill[14])):
            #The less HP remaining the greater the stats boost
            effects["DEF"]+=int(passiveskill[13])
            effects["Building Stat"]["Cause"]={"Cause":"HP", "Type":"Less HP remaining"}
            effects["Building Stat"]["Max"]+=int(passiveskill[13])
            effects["Building Stat"]["Min"]+=int(passiveskill[14])
        else:
            #The more HP remaining the greater the stats boost
            effects["DEF"]+=int(passiveskill[14])
            effects["Building Stat"]["Cause"]={"Cause":"HP", "Type":"More HP remaining"}
            effects["Building Stat"]["Max"]+=int(passiveskill[14])
            effects["Building Stat"]["Min"]+=int(passiveskill[13])
    elif passiveskill[4]=="73":
        if(int(passiveskill[13])>int(passiveskill[14])):
            #The less HP remaining the greater the stats boost
            effects["ATK"]+=int(passiveskill[13])
            effects["DEF"]+=int(passiveskill[13])
            effects["Building Stat"]["Cause"]={"Cause":"HP", "Type":"Less HP remaining"}
            effects["Building Stat"]["Max"]+=int(passiveskill[13])
            effects["Building Stat"]["Min"]+=int(passiveskill[14])
        else:
            #The more HP remaining the greater the stats boost
            effects["ATK"]+=int(passiveskill[14])
            effects["DEF"]+=int(passiveskill[14])
            effects["Building Stat"]["Cause"]={"Cause":"HP", "Type":"More HP remaining"}
            effects["Building Stat"]["Max"]+=int(passiveskill[14])
            effects["Building Stat"]["Min"]+=int(passiveskill[13])
    elif passiveskill[4]=="76":
        effects["Effective against all"]=True
    elif passiveskill[4]=="78":
        effects["Guard"]=True
    elif passiveskill[4]=="79":
        effects["Transformation"]["Activated"]=True
        effects["Transformation"]["Unit"]=passiveskill[13]
        effects["Transformation"]["Giant/Rage"]=True
        params=searchbycolumn(code=passiveskill[14],database=battle_paramsJP,column=1)
        for param in params:
            if(param[2]=="0"):
                effects["Transformation"]["Min Turns"]=param[3]
            elif(param[2]=="1"):
                effects["Transformation"]["Max Turns"]=param[3]
            elif(param[2]=="2"):
                effects["Transformation"]["Reverse chance"]=param[3]
        
    elif passiveskill[4]=="80":
        if(DEVEXCEPTIONS==True):
            raise Exception("Counter without dodge")
    elif passiveskill[4]=="81":
        effects["Additional attack"]["Activated"]=True
        effects["Additional attack"]["Chance of super"]=passiveskill[15]
    elif passiveskill[4]=="82":
        effects["ATK"]+=int(passiveskill[14])
        effects["DEF"]+=int(passiveskill[14])
        effects["Target"]["Type"]=extractClassType(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)[1]
        effects["Target"]["Class"]=extractClassType(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)[0]
    elif passiveskill[4]=="83":
        effects["Ki"]+=int(passiveskill[14])
        effects["Target"]["Type"]=extractClassType(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)[1]
        effects["Target"]["Class"]=extractClassType(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)[0]
    elif passiveskill[4]=="90":
        effects["Crit Chance"]+=int(passiveskill[13])
    elif passiveskill[4]=="91":
        effects["Dodge chance"]+=int(passiveskill[13])
    elif passiveskill[4]=="92":
        effects["Guaranteed hit"]=True
    elif passiveskill[4]=="95":
        if(DEVEXCEPTIONS==True):
            raise Exception("Dodge and counter")
    elif passiveskill[4]=="96":
        kiSphereType=binaryOrbType(passiveskill[13],DEVEXCEPTIONS)
        effects["Ki"]+=int(passiveskill[14])
        effects["Building Stat"]["Cause"]={"Cause":"Ki sphere obtained", "Type":kiSphereType}

        
    elif passiveskill[4]=="97":
        if(passiveskill[14]=="1"):
            effects["Nullification"]["Activated"]=True
            effects["Nullification"]["Absorbed"]=int(passiveskill[13])
        else:
            if(DEVEXCEPTIONS==True):
                raise Exception("Unknown effect")
    elif passiveskill[4]=="98":
        if(passiveskill[15]=="0"):
            effects["ATK"]+=int(passiveskill[13])
        elif(passiveskill[15]=="1"):
            effects["DEF"]+=int(passiveskill[13])
        elif(passiveskill[15]=="2"):
            effects["Crit Chance"]+=int(passiveskill[13])
        elif(passiveskill[15]=="3"):
            effects["Dodge chance"]+=int(passiveskill[13])
        elif(passiveskill[15]=="4"):
            #CONFUSED
            effects["DR"]+=int(passiveskill[13])
        elif(passiveskill[15]=="5"):
            effects["Ki"]+=int(passiveskill[13])
        else:
            if(DEVEXCEPTIONS==True):
                raise Exception("Unknown stat increase")
        effects["Building Stat"]["Cause"]={"Cause":"Look Elsewhere"}
        effects["Building Stat"]["Max"]+=int(passiveskill[14])
    elif passiveskill[4]=="101":
        effects["Forsee Super Attack"]=True
    elif passiveskill[4]=="103":
        effects["Transformation"]["Activated"]=True
        effects["Transformation"]["Unit"]=passiveskill[13]

        effects["First turn to activate"]+=(int(passiveskill[14]))
    elif passiveskill[4]=="109":
        effects["Revive"]["Activated"]=True
        effects["Revive"]["HP recovered"]=int(passiveskill[13])
    elif passiveskill[4]=="110":
        effects["Toggle Other Line"]["Activated"]=True
        effects["Toggle Other Line"]["Line"]=passiveskill[14]
    elif passiveskill[4]=="111":
        effects["Status"].append("Disable action")
    elif(passiveskill[4]=="114"):
        effects["Status"].append("Unable to attack")
    elif(passiveskill[4]=="115"):
        effects["Standby"]["Activated"]=True
        print("Standby finish effect?")
    elif(passiveskill[4]=="117"):
        effects["Standby"]["Activated"]=True
        effects["Standby"]["Change form"]["Activated"]=True
        revertUnit=str(int(unit[22][:-2]))+"0"
        effects["Standby"]["Change form"]["Unit"]=revertUnit
    elif passiveskill[4]=="119":
        effects["Nullification"]["Activated"]=True
    elif(passiveskill[4]=="120"):
        effects["Counter"]={"Activated":True, "Multiplier":passiveskill[14]}
        if(passiveskill[13]!="0"):
            effects["Counter"]["DR from normals"]=passiveskill[13]
        
    else:
        if(DEVEXCEPTIONS==True):
                raise Exception("Unknown effect")
        

    

    
    
    
    effects["Length"]=passiveskill[9]



    if passiveskill[3]=="1":
        effects["Timing"]="Start of turn"
    elif passiveskill[3]=="3":
        effects["Timing"]="Attacking"
    elif passiveskill[3]=="4":
        effects["Timing"]="On Super"
    elif passiveskill[3]=="5":
        effects["Timing"]="Attacking the enemy"
    elif passiveskill[3]=="6":
        effects["Timing"]="Being hit"
    elif passiveskill[3]=="7":
        effects["Timing"]="Hit recieved"
    elif passiveskill[3]=="9":
        effects["Timing"]="End of turn"
    elif passiveskill[3]=="11":
        effects["Timing"]="after all ki collected"
    elif passiveskill[3]=="12":
        effects["Timing"]="Activating standby"
    elif passiveskill[3]=="14":
        effects["Timing"]="When final blow delivered"
    elif passiveskill[3]=="15":
        effects["Timing"]="When ki spheres collected"
    else:
        print("UNKNOWN TRIGGER",end=" ")
        if(DEVEXCEPTIONS==True):
                raise Exception("Unknown trigger")

    

    if(causalityExtractor(passiveskill[12])!=[]):
        causalityCondition=logicalCausalityExtractor(passiveskill[12])
        causalityCondition=CausalityLogicalExtractor(unit=unit,causality=causalityCondition,DEVEXCEPTIONS=DEVEXCEPTIONS)
        effects["Condition"]=causalityCondition

        
                    

    if(passiveskill[10]=="1"):
        effects["Once only"]=True
        
    
    
    return(effects)

def KiOrbType(kiOrbNumber, DEVEXCEPTIONS=False):
    if(kiOrbNumber=="0"):
        output="AGL"
    elif(kiOrbNumber=="1"):
        output="TEQ"
    elif(kiOrbNumber=="2"):
        output="INT"
    elif(kiOrbNumber=="3"):
        output="STR"
    elif(kiOrbNumber=="4"):
        output="PHY"
    elif(kiOrbNumber=="5"):
        output="RAINBOW"
    else:
        output="UNKNOWN"
        if(DEVEXCEPTIONS==True):
            raise Exception("Unknown ki orb type")
    return(output)

def extractClassType(classTypeNumber, DEVEXCEPTIONS=False):
    outputClass=[]
    outputType=[]
    classTypeNumber=int(classTypeNumber)
    binaryclassTypeNumber=bin(int(classTypeNumber))[2:]
    binaryclassTypeNumber=binaryclassTypeNumber.zfill(32)
    if binaryclassTypeNumber[27]=="1" or binaryclassTypeNumber[15]=="1" or binaryclassTypeNumber[10]=="1":
        outputType.append("PHY")
    if binaryclassTypeNumber[28]=="1" or binaryclassTypeNumber[16]=="1" or binaryclassTypeNumber[11]=="1":
        outputType.append("STR")
    if binaryclassTypeNumber[29]=="1" or binaryclassTypeNumber[17]=="1" or binaryclassTypeNumber[12]=="1":
        outputType.append("INT")
    if binaryclassTypeNumber[30]=="1" or binaryclassTypeNumber[18]=="1" or binaryclassTypeNumber[13]=="1":
        outputType.append("TEQ")
    if binaryclassTypeNumber[31]=="1" or binaryclassTypeNumber[19]=="1" or binaryclassTypeNumber[14]=="1":
        outputType.append("AGL")
    
    if binaryclassTypeNumber[25]=="1":
        outputClass.append("Extreme")
    if binaryclassTypeNumber[26]=="1":
        outputClass.append("Super")

    if "1" in binaryclassTypeNumber[15:20]:
        outputClass.append("Super")
    if "1" in binaryclassTypeNumber[10:15]:
        outputClass.append("Extreme")

    return(outputClass,outputType)

def extractAllyTyping(typingID,DEVEXCEPTIONS=False):
    if(typingID=="0"):
        typing="AGL"
    elif(typingID=="1"):
        typing="TEQ"
    elif(typingID=="2"):
        typing="INT"
    elif(typingID=="3"):
        typing="STR"
    elif(typingID=="4"):
        typing="PHY"
    else:
        typing="UNKNOWN TYPE"
        if(DEVEXCEPTIONS==True):
            raise Exception("Unknown type")
    return(typing)

def filterIncompletePngs(directory, thresholdInBytes,printing=True):
    if(directory[-1]!="/"):
        directory+="/"
    assumeFalse=False
    allPngs=os.listdir(directory)
    for png in allPngs:
        if(os.path.isdir(directory+png)):
            if(filterIncompletePngs(directory+png, thresholdInBytes)):
                assumeFalse=True
        else:
            if(os.path.getsize(directory+png)<thresholdInBytes):
            
                os.remove(directory+png)
                assumeFalse=True
    return(assumeFalse)
            
def definewith0(unitid,printing=True):
    if unitid.endswith('1'):
        return unitid[:-1] + '0'
    else:
        return unitid
    
def definewith1(unitid,printing=True):
    if unitid.endswith('0'):
        return unitid[:-1] + '1'
    else:
        return unitid

def causalityExtractor(causality):
    if(causality==""):
        return([])
    else:
        result=causality.split("compiled")[1]
        result=result.replace('"',"")
        result=result.replace("\\","")
        result=result.replace("[","")
        result=result.replace("]","")
        result=result.replace(":","")
        result=result.replace("}","")
        result=result.replace(" ","")
        result=result.split(",")
        for x in result:
            if "u" in x:
                result.remove(x)
        return(result)

def logicalCausalityExtractor(causality):
    if(causality==""):
        return([])
    else:
        result=causality.split('","compiled')
        if(len(result)==1):
            result=causality.split('", "compiled')
        result=result[0]
        if(len(result.split('source":"'))!=1):
            result=result.split('source":"')[1]
        else:
            result=result.split('source": "')[1]
        result=unicode_fixer(result)
        return(result)
    
def CausalityLogicalExtractor(unit,causality,printing=True,DEVEXCEPTIONS=False):
    global skill_causalitiesJP
    global dokkan_fieldsJP
    global card_categoriesGB
    global cardsJP
    global card_unique_info_set_relationsJP

    output={}
    result=causality.replace("|"," or ").replace("&"," and ")
    currentCausality=""
    for x in causality:
        if(x.isnumeric()):
            currentCausality+=x
        else:
            if(currentCausality!=""):
                newCausality=causalityLogicFinder(unit,currentCausality,printing=True,DEVEXCEPTIONS=DEVEXCEPTIONS)
                output[currentCausality]=newCausality
                result=result.replace(currentCausality,newCausality)
            currentCausality=""

    if(currentCausality!=""):
        newCausality=causalityLogicFinder(unit=unit,causalityCondition=currentCausality,printing=True,DEVEXCEPTIONS=DEVEXCEPTIONS)
        result=result.replace(currentCausality,newCausality)
    return(result)

def longestCommonSubstring(listOfStrings):
    listOfStrings.sort(key=len)
    baseString=listOfStrings[0]
    longestString=""
    for startingChar in range(0,len(baseString)+1):
        for endingChar in range(startingChar,len(baseString)+1):
            validString=True
            for string in listOfStrings:
                if(baseString[startingChar:endingChar] not in string):
                    validString=False
                    break
        if(validString==True):
            if(len(baseString[startingChar:endingChar])>len(longestString)):
                longestString=baseString[startingChar:endingChar]


    return(longestString)


def CategoryExtractor(CategoryId):
    global card_categoriesGB
    for category in card_categoriesGB:
        if category[0]==CategoryId:
            return(category[1])

def causalityLogicFinder(unit,causalityCondition,printing=True,DEVEXCEPTIONS=False):
    #WIP TO MAKE IT RETURN IN A DICTIONARY
    global dokkan_fieldsJP
    global card_categoriesGB
    global skill_causalitiesJP
    global cardsJP
    global cardsGB
    global card_unique_info_set_relationsJP
    output={"Button":"",
            "Slider":
                {"Name":None,
                 "Logic":None}}
    for row in skill_causalitiesJP:
        if row[0] == causalityCondition:
            CausalityRow=row
            if(CausalityRow[1]=="0"):
                #WIP
                pass
            elif(CausalityRow[1]=="1"):
                text="Is HP "
                text+=CausalityRow[2]
                text+=" % or more?"
                output["Button"]["Name"]=text
                output["Slider"]["Name"]="What percentage of HP is remaining"
                output["Slider"]["Logic"]=">="
                output["Slider"]["Logic"]+=CausalityRow[2]
                output["Slider"]["Min"]=0
                output["Slider"]["Max"]=100

            elif(CausalityRow[1]=="2"):
                text="Is HP  "
                text+=CausalityRow[2]
                text+=" % or less?"
                output["Button"]["Name"]=text
                output["Slider"]["Name"]="What percentage of HP is remaining"
                output["Slider"]["Logic"]="<="
                output["Slider"]["Logic"]+=CausalityRow[2]
                output["Slider"]["Min"]=0
                output["Slider"]["Max"]=100
            elif(CausalityRow[1]=="3"):
                Ca2=int(CausalityRow[2])
                unit31=int(unit[31])
                kiAmount=(Ca2*unit31)//99

                text="Is ki "
                text+=kiAmount
                text+=" or more"
                output["Button"]["Name"]=text

                output["Slider"]["Name"]="How much ki is there"
                output["Slider"]["Logic"]=">="
                output["Slider"]["Logic"]+=str(kiAmount)
                output["Slider"]["Min"]=0
                output["Slider"]["Max"]=24
            elif(CausalityRow[1]=="4"):
                Ca2=int(CausalityRow[2])
                unit31=int(unit[31])
                kiAmount=(Ca2*unit31)//99

                text="Is ki "
                text+=kiAmount
                text+=" or less"
                output["Button"]["Name"]=text

                output["Slider"]["Name"]="How much ki is there"
                output["Slider"]["Logic"]="<="
                output["Slider"]["Logic"]+=str(kiAmount)
                output["Slider"]["Min"]=0
                output["Slider"]["Max"]=24
            elif(CausalityRow[1]=="5"):
                output["Button"]["Name"]="Is the turn count "
                output["Button"]["Name"]+=str(int(CausalityRow[2])+1)
                output["Button"]["Name"]+=" or more?"

                output["Slider"]["Name"]="What turn is it?"
                output["Slider"]["Logic"]=">="
                output["Slider"]["Logic"]+=str(int(CausalityRow[2])+1)
                output["Slider"]["Min"]=1
            elif(CausalityRow[1]=="8"):
                output["Button"]["Name"]="Is attack higher than enemy's?"
            elif(CausalityRow[1]=="9"):
                output["Button"]["Name"]="Is attack lower than enemy's?"
            elif(CausalityRow[1]=="14"):
                output["Button"]["Name"]="Is the first to attack?"
            elif(CausalityRow[1]=="15"):
                output["Button"]["Name"]="Is there "
                output["Button"]["Name"]+=CausalityRow[2]
                output["Button"]["Name"]+=" or more enemies?"
                
                output["Slider"]["Name"]="How many enemies are there?"
                output["Slider"]["Logic"]=">="
                output["Slider"]["Logic"]+=CausalityRow[2]
                output["Slider"]["Min"]=1
                output["Slider"]["Max"]=7
            elif(CausalityRow[1]=="16"):
                output["Button"]["Name"]="Is there less than "
                output["Button"]["Name"]+=CausalityRow[2]
                output["Button"]["Name"]+=" enemies?"
                
                output["Slider"]["Name"]="How many enemies are there?"
                output["Slider"]["Logic"]="<"
                output["Slider"]["Logic"]+=CausalityRow[2]
                output["Slider"]["Min"]=1
                output["Slider"]["Max"]=7
            elif(CausalityRow[1]=="17"):
                output["Button"]["Name"]="Is the enemy's health "
                output["Button"]["Name"]+=CausalityRow[2]
                output["Button"]["Name"]+=" % or more?"

                output["Slider"]["Name"]="What percentage of HP does the enemy have?"
                output["Slider"]["Logic"]=">="
                output["Slider"]["Logic"]+=CausalityRow[2]
                output["Slider"]["Max"]=100
            elif(CausalityRow[1]=="18"):
                output["Button"]["Name"]="Is the enemy's health "
                output["Button"]["Name"]+=CausalityRow[2]
                output["Button"]["Name"]+=" % or less?"

                output["Slider"]["Name"]="What percentage of HP does the enemy have?"
                output["Slider"]["Logic"]="<="
                output["Slider"]["Logic"]+=CausalityRow[2]
                output["Slider"]["Max"]=100
            elif(CausalityRow[1]=="19"):
                output["Button"]["Name"]="Is this the "
                output["Button"]["name"]+=ordinalise(int(CausalityRow[2])+1)
                output["Button"]["Name"]+=" attacker in the turn?"

                output["Slider"]["Name"]="What position is this character attacking in?"
                output["Slider"]["Logic"]="=="
                output["Slider"]["Logic"]+=int(str(CausalityRow[2])+1)#
                output["Slider"]["Min"]=1
                output["Slider"]["Max"]=3

            elif(CausalityRow[1]=="24"):
                output["Button"]["Name"]="Has attack been recieved?"
            elif(CausalityRow[1]=="25"):
                output["Button"]["Name"]="Has this character delivered the final blow?"

            elif(CausalityRow[1]=="30"):
                output["Button"]["Name"]="Has guard been activated?"
            elif(CausalityRow[1]=="31"):
                output["Button"]["Name"]="Has 3 attacks in a row?"
            elif(CausalityRow[1]=="33"):
                output["Button"]["Name"]="Is HP between "
                output["Button"]["Name"]+=CausalityRow[2]
                output["Button"]["Name"]+=" % and "
                output["Button"]["Name"]+=CausalityRow[3]
                output["Button"]["Name"]+=" %?"

                output["Slider"]["Name"]="What percentage of HP is remaining?"
                output["Slider"]["Logic"]=">="
                output["Slider"]["Logic"]+=CausalityRow[2]
                output["Slider"]["Logic"]+=" and <="
                output["Slider"]["Logic"]+=CausalityRow[3]
                output["Slider"]["Min"]=0
                output["Slider"]["Max"]=100
            elif(CausalityRow[1]=="34"):
                global card_categoriesGB
                if(CausalityRow[2]=="0"):
                    target="allies on the team "
                    output["Slider"]["Max"]=7
                elif(CausalityRow[2]=="1"):
                    target="enemies "
                    output["Slider"]["Max"]=7
                elif(CausalityRow[2]=="2"):
                    target="allies on the same turn "
                    output["Slider"]["Max"]=3
                categoryType=searchbyid(CausalityRow[3],codecolumn=0,database=card_categoriesGB,column=1)[0]

                output["Button"]["Name"]="Are there "


                if(CausalityRow[4]=="0"):
                    output["Button"]["Name"]="Are there no "
                    output["Button"]["Name"]+=categoryType
                    output["Button"]["Name"]+=" category "
                    output["Button"]["Name"]+=target

                    output["Slider"]["Name"]="How many "
                    output["Slider"]["Name"]+=categoryType
                    output["Slider"]["Name"]+=" category "
                    output["Slider"]["Name"]+=target
                    output["Slider"]["Logic"]="=="
                    output["Slider"]["Logic"]+=0
                    output["Slider"]["Min"]=0
                else:
                    output["Button"]["Name"]="Are there "
                    output["Button"]["Name"]+=CausalityRow[4]
                    output["Button"]["Name"]+=" or more "
                    output["Button"]["Name"]+=categoryType
                    output["Button"]["Name"]+=" category "
                    output["Button"]["Name"]+=target

                    output["Slider"]["Name"]="How many "
                    output["Slider"]["Name"]+=categoryType
                    output["Slider"]["Name"]+=" category "
                    output["Slider"]["Name"]+=target
                    output["Slider"]["Logic"]=">="
                    output["Slider"]["Logic"]+=CausalityRow[4]
                    output["Slider"]["Min"]=0
            elif(CausalityRow[1]=="35"):
                output["Button"]["Name"]="Does the team include "
                if(extractClassType(CausalityRow[2],DEVEXCEPTIONS=DEVEXCEPTIONS)==(["Super"],["PHY","STR","INT","TEQ","AGL"])):
                    output["Button"]["Name"]+="all five Super types"
                elif(extractClassType(CausalityRow[2],DEVEXCEPTIONS=DEVEXCEPTIONS)==(["Extreme"],["PHY","STR","INT","TEQ","AGL"])):
                    output["Button"]["Name"]+="all five Extreme types"
                else:
                    print("UNKNOWN TYPE")
                    if(DEVEXCEPTIONS==True):
                        raise Exception("Unknown type")
            elif(CausalityRow[1]=="37"):
                output["Button"]["Name"]="Is HP "
                output["Button"]["Name"]+=CausalityRow[2]
                output["Button"]["Name"]+=" % or less starting from the "
                output["Button"]["Name"]+=ordinalise(int(CausalityRow[3])+1)
                output["Button"]["Name"]+=" turn from the start of battle"

                output["Slider"]["Name"]="What percentage of HP is remaining?"
                output["Slider"]["Logic"]=">="
                output["Slider"]["Logic"]+=CausalityRow[2]
                output["Slider"]["Min"]=0
                output["Slider"]["Max"]=100
                #WIP figure out how to include the turn count
                #output+=("When HP is ")
                #output+=(CausalityRow[2])
                #output+=("% or less starting from the ")
                #output+=(ordinalise(int(CausalityRow[3])+1))
                #output+=(" turn from the start of battle")

            elif(CausalityRow[1]=="38"):
                Status=binaryStatus(CausalityRow[2])
                output["Button"]["Name"]="Is the target enemy "
                output["Button"]["Name"]+=Status
                output["Button"]["Name"]+="?"
            elif(CausalityRow[1]=="39"):
                #WIP I forgor what this means
                output+=("When the target enemy is ")
                output+=(CausalityRow[2])
                output+=(" or more categories")
            elif(CausalityRow[1]=="40"):
                output["Button"]["Name"]="Is a super being performed?"
            elif(CausalityRow[1]=="41"):
                if(CausalityRow[2]=="0"):
                    output["Button"]["Name"]="Is there is an ally on the team whose name includes "
                elif(CausalityRow[2]=="1"):
                    output["Button"]["Name"]="Is there is an enemy whose name includes "
                elif(CausalityRow[2]=="2"):
                    output["Button"]["Name"]="Is there is an ally attacking in the same turn whose name includes "
                else:
                    output+=("UNKNOWN NAME TYPE")
                    if(DEVEXCEPTIONS==True):
                        raise Exception("Unknown name type")
                card_unique_info_id=searchbyid(code=CausalityRow[3],codecolumn=2,database=card_unique_info_set_relationsJP,column=1)
                possible_names=[]
                for id in card_unique_info_id:
                    name=searchbycolumn(code=id,column=3,database=cardsGB)
                    for unit in name:
                        if(qualifyUsable(card=unit)):
                            possible_names.append(unit[1])
                likelyName=longestCommonSubstring(possible_names) 
                output["Button"]["Name"]+=likelyName

                    

            elif(CausalityRow[1]=="42"):
                output["Button"]["Name"]="Has "
                output["Button"]["Name"]+=CausalityRow[3]
                output["Button"]["Name"]+=" or more "
                kiSphereType=binaryOrbType(CausalityRow[2],DEVEXCEPTIONS)
                for orbType in kiSphereType:
                    output["Button"]["Name"]+=orbType
                    output["Button"]["Name"]+=" or "
                output["Button"]["Name"]=output["Button"]["Name"][:-4]
                output["Button"]["Name"]+=" Ki Spheres been obtained?"
            elif(CausalityRow[1]=="43"):
                output["Button"]["Name"]="Has this unit evaded an attack? "
            elif(CausalityRow[1]=="44"):
                if(CausalityRow[2]=="0" or CausalityRow[2]=="1"):
                    output["Button"]["Name"]="Has this character performed their "
                    output["Button"]["Name"]+=(ordinalise(CausalityRow[3]))
                    output["Button"]["Name"]+=(" super attack in battle")






                    #WIP CONTINUE FROM HERE
                elif(CausalityRow[2])=="2":
                    output+=("Starting from the turn in which the character performs their ")
                    output+=(ordinalise(CausalityRow[3]))
                    output+=(" attack in battle")
                elif(CausalityRow[2]=="3"):
                    output+=("Starting from the turn in which the character recieves their ")
                    output+=(ordinalise(CausalityRow[3]))
                    output+=(" attack in battle")
                elif(CausalityRow[2]=="4"):
                    output+=("Starting from the turn in which the character's guard is activated for the ")
                    output+=(ordinalise(CausalityRow[3]))
                    output+=(" time in battle")
                elif(CausalityRow[2]=="5"):
                    output+=("Starting from the turn in which the character evades the ")
                    output+=(ordinalise(CausalityRow[3]))
                    output+=(" attack in battle")
                else:
                    output+=("UNKNOWN NAME TYPE")
                    if(DEVEXCEPTIONS==True):
                        raise Exception("Unknown name type")
            elif(CausalityRow[1]=="45"):
                categoryType=searchbyid(CausalityRow[3],codecolumn=0,database=card_categoriesGB,column=1)[0]

                card_unique_info_id=searchbyid(code=CausalityRow[4],codecolumn=2,database=card_unique_info_set_relationsJP,column=1)
                possible_names=[]
                for id in card_unique_info_id:
                    name=searchbyid(code=id,codecolumn=3,database=cardsJP,column=1)
                    if (name!=None):
                        possible_names.append(name)
                likelyName=longestCommonSubstring(possible_names) 

                if(CausalityRow[2]=="0"):
                    output+=("When there is a ")
                    output+=(categoryType)
                    output+=(" Category ally whose name includes ")
                    output+=likelyName
                    output+=(" on the team")
                elif(CausalityRow[2]=="1"):
                    output+=("When there is a ")
                    output+=(categoryType)
                    output+=(" Category enemy whose name includes ")
                    output+=likelyName
                elif(CausalityRow[2]=="2"):
                    output+=("When there is a ")
                    output+=(categoryType)
                    output+=(" Category ally whose name includes ")
                    output+=likelyName
                    output+=(" attacking in the same turn")
                else:
                    output+=("UNKNOWN NAME TYPE")
                    if(DEVEXCEPTIONS==True):
                        raise Exception("Unknown name type")

            elif(CausalityRow[1]=="46"):
                output+=("Where there is an extreme class enemy")
            elif(CausalityRow[1]=="47"):
                output+=("When this character or an ally attacking in the same turn is KO'd")
            elif(CausalityRow[1]=="48"):
                output+=("When the enemy is hit by the characters ultra super attack")
            elif(CausalityRow[1]=="49"):
                if(CausalityRow[2]=="1"):
                    output+=("When the character is attacked by a ki blast super attack")
                elif(CausalityRow[2]=="2"):
                    output+=("When the character is attacked by an unarmed super attack")
                elif(CausalityRow[2]=="4"):
                    output+=("When the character is attacked by a physical super attack")
                else:
                    output+=("UNKNOWN SUPER ATTACK TYPE")
                    if(DEVEXCEPTIONS==True):
                        raise Exception("Unknown super attack type")
            elif(CausalityRow[1]=="51"):
                #WIP
                output+=("For ")
                output+=(CausalityRow[2])
                output+=(" turns from this characters entry turn")
            elif(CausalityRow[1]=="53"):
                output+=("After this characters finish effect is activated")
            elif(CausalityRow[1]=="54"):
                output+=("Starting from the turn in which the character's or an ally's Revival skill is activated")
            elif(CausalityRow[1]=="55"):
                output+=("Starting from the ")
                output+=ordinalise((str(int(CausalityRow[2])+1)))
                output+=(" turn from this character's entry turn")
            elif(CausalityRow[1]=="56"):
                output+=("When normal attack recieved")
            elif(CausalityRow[1]=="57"):
                output+=("While the Domain ")
                output+=searchbyid(code=CausalityRow[2],codecolumn=1,database=dokkan_fieldsJP,column=2)[0]
                output+=(" is active")
            elif(CausalityRow[1]=="58"):
                output+=("No Domain is active")
            elif(CausalityRow[1]=="61"):
                output+=("At the end of the turn in which attack was recieved")
            else:
                output+=("UNKNOWN CAUSALITY CONDITION")
                if(DEVEXCEPTIONS==True):
                    raise Exception("Unknown causality condition")
    return(output)

def binaryStatus(Statusid):
    output=""
    binaryId=bin(int(Statusid))[2:]
    binaryId=binaryId.zfill(11)
    if(binaryId[6]=="1"):
        output+='in "ATK down" status or '
    if(binaryId[5]=="1"):
        output+='in "DEF down" status or '
    if(binaryId[2]=="1"):
        output+="stunned or "
    if(binaryId[0]=="1"):
        output+="sealed or "
    
    output=output[:-4]
    return(output)

def binaryOrbType(kiOrbType,DEVEXCEPTIONS=False):
    output=[]
    AllTypes=True
    AllOrbs=True
    kiOrbType=int(kiOrbType)
    binarykiOrb=bin(int(kiOrbType))[2:]
    binarykiOrb=binarykiOrb.zfill(10)
    if(binarykiOrb[0:4])=="0111":
        output.append("Sweet treats")
    if(binarykiOrb[2]=="1"):
        output.append("Cookies")
    if(binarykiOrb[4]=="1"):
        output.append("Rainbow")
    if(binarykiOrb[5]=="1"):
        output.append("PHY")
    if(binarykiOrb[6]=="1"):
        output.append("STR")
    if(binarykiOrb[7]=="1"):
        output.append("INT")
    if(binarykiOrb[8]=="1"):
        output.append("TEQ")
    if(binarykiOrb[9]=="1"):
        output.append("AGL")
    if(output==[]):
        if(DEVEXCEPTIONS==True):
            raise Exception("Unknown orb type")
    return(output)
    
def TransformationReverseUnit(card,printing=True):
    global cardsJP
    global passive_skillsJP
    global passive_skill_set_relationsJP
    for passiveskillpiece in passive_skillsJP:
        if passiveskillpiece[13]==card[0]:
            #is a transformation
            for passiverelation in passive_skill_set_relationsJP:#
                if passiverelation[2]==passiveskillpiece[0]:
                    #passiveset found
                    for unit in cardsJP:
                        if unit[21][0:-2]==passiverelation[1]:
                            return(unit)
    
def activeSkillTransformationReverseUnit(card,printing=True):
    global active_skillsJP
    global card_active_skillsJP
    global cardsJP
    for possibleactive in active_skillsJP:
        if(possibleactive[6]==card[0]):
            #unit comes from an active skill
            for possibleactivelink in card_active_skillsJP:
                if possibleactivelink[2]==possibleactive[1]:
                    #link found
                    for unit in cardsJP:
                        if unit[0]==possibleactivelink[1]:
                            return(unit)

def activeSkillTransformationUnit(card,printing=True):
    global active_skillsJP
    global card_active_skillsJP
    global cardsJP
    for possibleactivelink in card_active_skillsJP:
        if possibleactivelink[1]==card[0]:
            #they have an active
            for possibleactive in active_skillsJP:
                if possibleactivelink[2]==possibleactive[1]:
                    
                    #has a transforming one, defined in possibleactive
                    for unit in cardsJP:
                        if unit[0]==possibleactive[6]:
                            return(unit)

def dokkanreverseunit(card,printing=True):
    global card_awakening_routesJP
    global cardsJP
    for awakenable_unit in card_awakening_routesJP:
        if awakenable_unit[1]=="CardAwakeningRoute::Dokkan":
            if(card[0])==(awakenable_unit[3]):
                for unit in cardsJP:
                    if unit[0]==awakenable_unit[2]:
                        return(unit)
    return(None)

def qualifyAsDFETUR(card,printing=True):
    if qualifyUsable(card) and card[4]=="58" and ((card[29]=="" and card[0][0]=="1")==False):
        return(True)
    else:
        return(False)
    
def qualifyAsDFE(card,printing=True):
    global card_awakening_routesJP
    global cardsJP
    global active_skillsJP
    global card_active_skillsJP
    global passive_skillsJP
    global passive_skill_set_relationsJP
    if(qualifyAsDFELR(card) or qualifyAsDFETUR(card)):
        return(True)
    else:
        return(False)            

def qualifyAsDFELR(card,printing=True):
    global card_awakening_routesJP
    global cardsJP
    global active_skillsJP
    global card_active_skillsJP
    global passive_skillsJP
    global passive_skill_set_relationsJP
    assumeFalse=False
    reversed=dokkanreverseunit(card)
    if(reversed==None):
        assumeFalse=(False)
    elif(reversed[4]=="58"):
        return(True)
        
    reversed=activeSkillTransformationReverseUnit(card)
    if(reversed==None):
        assumeFalse=(False)
    else:
        return(qualifyAsDFELR(reversed))
    
    reversed=TransformationReverseUnit(card)
    if(reversed==None):
        assumeFalse=(False)
    else:
        return(qualifyAsDFELR(reversed))
    
    if assumeFalse==False:
        return(False)
    
def qualifyAsLR(card,printing=True):
    if qualifyUsable(card) and (getrarity(card)=="lr"):
        return(True)
    else:
        return(False)
    
def qualifyEZA(card,printing=True):
    global optimal_awakening_growthsJP
    directory="data/"
    if qualifyUsable(card) and (checkeza(card)):
        return(True)
    else:
        return(False)

def switchUnitToGlobal(unitJP):
    global cardsGB
    unitGB = searchbycolumn(code=unitJP[0],database=cardsGB,column=0)
    if(unitGB!=[]):
        unitGB=unitGB[0]
    else:
        unitGB=None
    return(unitGB)

def qualifyUsable(card,printing=True):
    if ((card[21]=="" and card[23]=="")==False) and (card[53]!="2030-12-31 23:59:59") and(card[53]!='2030-01-01 00:00:00')and (card[53]!="2038-01-01 00:00:00") and (card[0][0]!="5") and (card[0][0]!="9") and (card[0][-1]=="0") and (card[22]!=""):
        return(True)
    else:
        return(False)

def createEZAWallpapers(cards, directory,printing=True):
    if(printing): print("Creating EZA wallpapers")
    acquiredlist = os.listdir(r'./assets/EZA wallpapers')
    leader_skills=storedatabase(directory,"leader_skills.csv")
    optimal_awakening_growths=storedatabase(directory,"optimal_awakening_growths.csv")
    total=0
    for card in cards:
        if (card[53]!="2030-12-31 23:59:59") and (card[0][0]!="9") and (card[0][-1]=="0") and (card[22]!="") and ((("final_"+card[0]+".png") not in acquiredlist)) and (checkeza(card)):
            unitid=card[0]
            if unitid[-1]=="1":
                unitid=str(int(unitid)-1)
            mainunit=card

        #background
            cframeurl=("assets/misc/cha_base_0")
        #element
            cframeurl+=(mainunit[12][-1])
            cframeurl+=("_0")
        #rarity
            cframeurl+=(mainunit[5])
            cframeurl+=(".png")


            cframe = Image.open(cframeurl).convert("RGBA")
            cframe=cframe.resize((200,200))

        #character icon
            ciconurl=("assets/thumb/")
            if card[48]=="" or card[48]=="0.0":
                ciconurl+=unitid
            else:
                ciconurl+=str(int(float(card[48])))
            ciconurl+=(".png")
            cicon = Image.open(ciconurl).convert("RGBA")
            cicon.resize((250,250))


        #rarity
            crarityurl=("assets/misc/cha_rare_")
            crarityurl+=(getrarity(mainunit))
            crarityurl+=(".png")
            crarity = Image.open(crarityurl).convert("RGBA")
            if getrarity(mainunit)=="ssr":
                crarity=crarity.resize((120,72))
            else:    
                crarity=crarity.resize((160,96))

        #element
            celementurl=("assets/misc/cha_type_icon_")
            if len(mainunit[12])==1:
                celementurl+=("0")
            celementurl+=(mainunit[12])
            celementurl+=(".png")
            celement = Image.open(celementurl).convert("RGBA")
            celement=celement.resize((90,90))
            if mainunit[12] in ("20","10"):
                if(printing): print("AGL ",end="")
            elif mainunit[12] in ("21","11"):
                if(printing): print("TEQ ",end="")
            elif mainunit[12] in ("22","12"):
                if(printing): print("INT ",end="")
            elif mainunit[12] in ("23","13"):
                if(printing): print("STR ",end="")
            elif mainunit[12] in ("24","14"):
                if(printing): print("PHY ",end="")

            (width,height)=(cicon.width+10,cicon.height+10)
            cfinal=Image.new("RGBA",(width,height))
            cfinal.paste(cframe, (25,35), cframe)
            cfinal.paste(cicon, (0,1), cicon)
            if getrarity(mainunit)=="n":
                cfinal.paste(crarity, (-37,160),crarity)
                if(printing): print("N ",end="")
            elif getrarity(mainunit)=="r":
                cfinal.paste(crarity, (-42,160), crarity)
                if(printing): print("R ",end="")
            elif getrarity(mainunit)=="sr":
                cfinal.paste(crarity, (-25,158), crarity)
                if(printing): print("SR ",end="")
            elif getrarity(mainunit)=="ssr":
                cfinal.paste(crarity, (-5,171), crarity)
                if(printing): print("SSR ",end="")
            elif getrarity(mainunit)=="ur":
                cfinal.paste(crarity, (-25,160), crarity)
                if(printing): print("UR ",end="")
            elif getrarity(mainunit)=="lr" or True:
                cfinal.paste(crarity, (-25,155),crarity)
                if(printing): print("LR ",end="")
            cfinal.paste(celement, (170,5),celement)
            
            if(printing): print(mainunit[1])
            wallpapername=("assets/EZA wallpapers/final_")
            wallpapername+=(unitid)
            wallpapername+=(".png")
            cfinal.save(wallpapername)
            total+=1
            if total%100==0:
                if(printing): print(total)
            #print("Created final asset for",total,getfullname(card,leader_skills))
    if(printing): print("All EZA assets created")

def parsePassiveSkill(unit,eza=False,DEVEXCEPTIONS=False):
    global passive_skillsJP
    output={}
    passiveIdList=getpassiveid(unit,eza)
    if (passiveIdList!=None and qualifyUsable(unit)):
        for passiveskill in passive_skillsJP[1:]:
            if (passiveskill[0] in passiveIdList):
                parsedLine=(extractPassiveLine(unit,passiveskill,printing=False,DEVEXCEPTIONS=DEVEXCEPTIONS))
                #output=shortenPassiveDictionary(output)
                output[passiveskill[0]]=parsedLine
    return(output)



def parseActiveSkill(unit,eza=False,DEVEXCEPTIONS=False):
    global card_active_skillsJP
    global active_skill_setsJP
    global ultimate_specialsJP
    global active_skillsJP
    global battle_paramsJP

    active_id=searchbyid(unit[0],codecolumn=1,database=card_active_skillsJP,column=2)
    if(active_id!=None):
        active_id=active_id[0]
        active_lineGB=searchbycolumn(code=active_id,column=0,database=active_skill_setsGB)
        active_lineJP=searchbycolumn(code=active_id,column=0,database=active_skill_setsJP)
        active_lineJP=active_lineJP[0]
        if(active_lineGB==[]):
            JPexclusive=True
        else:
            active_lineGB=active_lineGB[0]
            JPexclusive=False

        output={}
        if(JPexclusive):
            output["Name"]=active_lineJP[1]
            output["Description"]=active_lineJP[2]
        else:
            output["Name"]=active_lineGB[1]
            output["Description"]=active_lineGB[2]
        causalityCondition=logicalCausalityExtractor(active_lineJP[6])
        output["Condition"]={}
        output["Condition"]["Logic"]=causalityCondition
        causalityCondition=CausalityLogicalExtractor(unit,causalityCondition,DEVEXCEPTIONS=DEVEXCEPTIONS)
        output["Condition"].update(causalityCondition)
        output["Condition"]=causalityCondition
        output["Uses"]=int(active_lineJP[5])
        
        if(active_lineJP[7]!=""):
            special_id=active_lineJP[7][:-2]
            ultimate_row=searchbycolumn(code=special_id,database=ultimate_specialsJP,column=0)
            ultimate_row=ultimate_row[0]
            output["Attack"]={}
            output["Attack"]["Multiplier"]=int(ultimate_row[3])
            if(ultimate_row[4]=="0"):
                output["Attack"]["Target"]="Enemy"
            elif(ultimate_row[4]=="1"):
                output["Attack"]["Target"]="All enemies"

        effects_line=searchbycolumn(code=active_id,database=active_skillsJP,column=1)
        for line in effects_line:
            output[line[0]]={}
            output[line[0]]["Duration"]=active_lineJP[4]
            output[line[0]]["Effect"]={}
            
            
            if(line[4]=="0"):
                output[line[0]]["Effect"]["Type"]="Raw stats"
                output[line[0]]["Effect"]["+ or -"]="+"

            elif(line[4]=="1"):
                output[line[0]]["Effect"]["Type"]="Raw stats"
                output[line[0]]["Effect"]["+ or -"]="-"

            elif(line[4]=="2"):
                output[line[0]]["Effect"]["Type"]="Percentage"
                output[line[0]]["Effect"]["+ or -"]="+"

            elif(line[4]=="3"):
                output[line[0]]["Effect"]["Type"]="Percentage"
                output[line[0]]["Effect"]["+ or -"]="-"
            else:
                output[line[0]]["Effect"]["Type"]="Unknown"
                output[line[0]]["Effect"]["+ or -"]="Unknown"
                if(DEVEXCEPTIONS==True):
                        raise Exception("Unknown stat increase type")

            if(line[2]=="1"):
                output[line[0]]["Target"]="Self"
            elif(line[2]=="2"):
                output[line[0]]["Target"]="All allies"
            elif(line[2]=="3"):
                output[line[0]]["Target"]="Enemy"
            elif(line[2]=="4"):
                output[line[0]]["Target"]="All enemies"
            elif(line[2]=="13"):
                output[line[0]]["Target"]="Extreme class allies"
            elif(line[2]=="16"):
                output[line[0]]["Target"]="All allies other than this character on every turn"
            else:
                print("Unknown target")
                if(DEVEXCEPTIONS):
                    raise Exception("Unknown Target")

            if(line[5]=="1"):
                output[line[0]]["Effect"]["Buff"]="ATK Buff"
                output[line[0]]["Effect"]["Amount"]=int(line[6])
            elif(line[5]=="2"):
                output[line[0]]["Effect"]["Buff"]="DEF Buff"
                output[line[0]]["Effect"]["Amount"]=int(line[6])
            elif(line[5]=="4"):
                output[line[0]]["Effect"]["Buff"]="Heals"
                output[line[0]]["Effect"]["Amount"]=int(line[6])
            elif(line[5]=="5"):
                output[line[0]]["Effect"]["Buff"]="Ki Buff"
                output[line[0]]["Effect"]["Amount"]=int(line[6])
            elif(line[5]=="9"):
                output[line[0]]["Effect"]["Buff"]="Stun"
            elif(line[5]=="22"):
                output[line[0]]["Effect"]["Buff"]="Remove negative effects"
            elif(line[5]=="48"):
                output[line[0]]["Effect"]["Buff"]="Seal"
            elif(line[5]=="51"):
                output[line[0]]["Effect"]["Buff"]="Changes orbs"
                output[line[0]]["Effect"]["From"]=KiOrbType(line[6],DEVEXCEPTIONS)
                output[line[0]]["Effect"]["To"]=KiOrbType(line[7],DEVEXCEPTIONS)
            elif(line[5]=="76"):
                output[line[0]]["Effect"]["Buff"]="Effective against all"
            elif(line[5]=="78"):
                output[line[0]]["Effect"]["Buff"]="Guard"
            elif(line[5]=="79"):
                output[line[0]]["Effect"]["Buff"]="Giant form/Rage"
                output[line[0]]["Effect"]["Unit"]=line[6]
                battle_params=searchbycolumn(code=line[7],column=1,database=battle_paramsJP)
                for param in battle_params:
                    if(param[2]=="0"):
                        output[line[0]]["Effect"]["Min turns"]=int(param[3])
                    elif(param[2]=="1"):
                        output[line[0]]["Effect"]["Max turns"]=int(param[3])
                    elif(param[2]=="2"):
                        output[line[0]]["Effect"]["Reverse chance"]=int(param[3])
            elif(line[5]=="90"):
                output[line[0]]["Effect"]["Buff"]="Crit chance"
                output[line[0]]["Effect"]["Amount"]=int(line[6])
            elif(line[5]=="91"):
                output[line[0]]["Effect"]["Buff"]="Dodge chance"
                output[line[0]]["Effect"]["Amount"]=int(line[6])
            elif(line[5]=="92"):
                output[line[0]]["Effect"]["Buff"]="Guaranteed to hit"
            elif(line[5]=="103"):
                output[line[0]]["Effect"]["Buff"]="Transforms"
                output[line[0]]["Effect"]["Unit"]=line[6]
            elif(line[5]=="105"):
                output[line[0]]["Effect"]["Buff"]="Changes orbs"
                output[line[0]]["Effect"]["From"]=["AGL","TEQ","INT","STR","PHY","Rainbow","Sweet treats"]
                output[line[0]]["Effect"]["To"]=binaryOrbType(line[6],DEVEXCEPTIONS)
            elif(line[5]=="107"):
                output[line[0]]["Effect"]["Buff"]="Delays enemy attack"
                output[line[0]]["Effect"]["Amount"]=int(line[6])
            elif(line[5]=="111"):
                output[line[0]]["Effect"]["Buff"]="Disable action"
            elif(line[5]=="123"):
                output[line[0]]["Effect"]["Buff"]="Redirect attacks to me"
            else:
                if(DEVEXCEPTIONS):
                    print("UNKNOWN ACTIVE EFFECT")
                    raise Exception("Unknown Active")





        return(output)
    






def createDFEWallpapers(cards, directory,printing=True):
    global card_awakening_routesJP
    global active_skillsJP
    global card_active_skillsJP
    global passive_skillsJP
    global passive_skill_set_relationsJP
    if(printing): print("Creating DFE wallpapers")
    acquiredlist = os.listdir(r'./assets/DFE wallpapers')
    leader_skills=storedatabase(directory,"leader_skills.csv")
    total=0
    for card in cards:
        if qualifyAsDFE(card) and (((definewith0(card[0])+".png") not in acquiredlist)):
            unitid=card[0]
            if unitid[-1]=="1":
                unitid=str(int(unitid)-1)
            mainunit=card

        #background
            cframeurl=("assets/misc/cha_base_0")
        #element
            cframeurl+=(mainunit[12][-1])
            cframeurl+=("_0")
        #rarity
            cframeurl+=(mainunit[5])
            cframeurl+=(".png")


            cframe = Image.open(cframeurl).convert("RGBA")
            cframe=cframe.resize((200,200))

        #character icon
            ciconurl=("assets/thumb/")
            if card[48]=="" or card[48]=="0.0":
                ciconurl+=unitid
            else:
                ciconurl+=str(int(float(card[48])))
            ciconurl+=(".png")
            cicon = Image.open(ciconurl).convert("RGBA")
            cicon.resize((250,250))


        #rarity
            crarityurl=("assets/misc/cha_rare_")
            crarityurl+=(getrarity(mainunit))
            crarityurl+=(".png")
            crarity = Image.open(crarityurl).convert("RGBA")
            if getrarity(mainunit)=="ssr":
                crarity=crarity.resize((120,72))
            else:    
                crarity=crarity.resize((160,96))

        #element
            celementurl=("assets/misc/cha_type_icon_")
            if len(mainunit[12])==1:
                celementurl+=("0")
            celementurl+=(mainunit[12])
            celementurl+=(".png")
            celement = Image.open(celementurl).convert("RGBA")
            celement=celement.resize((90,90))
            if mainunit[12] in ("20","10"):
                if(printing): print("AGL ",end="")
            elif mainunit[12] in ("21","11"):
                if(printing): print("TEQ ",end="")
            elif mainunit[12] in ("22","12"):
                if(printing): print("INT ",end="")
            elif mainunit[12] in ("23","13"):
                if(printing): print("STR ",end="")
            elif mainunit[12] in ("24","14"):
                if(printing): print("PHY ",end="")

            (width,height)=(cicon.width+10,cicon.height+10)
            cfinal=Image.new("RGBA",(width,height))
            cfinal.paste(cframe, (25,35), cframe)
            cfinal.paste(cicon, (0,1), cicon)
            if getrarity(mainunit)=="n":
                cfinal.paste(crarity, (-37,160),crarity)
                if(printing): print("N ",end="")
            elif getrarity(mainunit)=="r":
                cfinal.paste(crarity, (-42,160), crarity)
                if(printing): print("R ",end="")
            elif getrarity(mainunit)=="sr":
                cfinal.paste(crarity, (-25,158), crarity)
                if(printing): print("SR ",end="")
            elif getrarity(mainunit)=="ssr":
                cfinal.paste(crarity, (-5,171), crarity)
                if(printing): print("SSR ",end="")
            elif getrarity(mainunit)=="ur":
                cfinal.paste(crarity, (-25,160), crarity)
                if(printing): print("UR ",end="")
            elif getrarity(mainunit)=="lr" or True:
                cfinal.paste(crarity, (-25,155),crarity)
                if(printing): print("LR ",end="")
            cfinal.paste(celement, (170,5),celement)
            
            
            wallpapername=("assets/DFE wallpapers/")
            wallpapername+=(unitid)
            wallpapername+=(".png")
            if(printing): print(mainunit[1])
            cfinal.save(wallpapername)
            total+=1
            if total%100==0:
                if(printing): print(total)
            #print("Created final asset for",total,getfullname(card,leader_skills))
    if(printing): print("All DFE assets created")

def createLRWallpapers(cards,directory,printing=True):
    if(printing): print("Creating LR wallpapers")
    acquiredlist = os.listdir(r'./assets/LR wallpapers')
    leader_skills=storedatabase(directory,"leader_skills.csv")
    total=0
    for card in cards:
        if (card[53]!="2030-12-31 23:59:59") and (card[0][0]!="9") and (card[0][-1]=="0") and (card[22]!="") and ((("final_"+card[0]+".png") not in acquiredlist)) and (getrarity(card)=="lr"):
            unitid=card[0]
            if unitid[-1]=="1":
                unitid=str(int(unitid)-1)
            mainunit=card

        #background
            cframeurl=("assets/misc/cha_base_0")
        #element
            cframeurl+=(mainunit[12][-1])
            cframeurl+=("_0")
        #rarity
            cframeurl+=(mainunit[5])
            cframeurl+=(".png")

            cframe = Image.open(cframeurl).convert("RGBA")
            cframe=cframe.resize((200,200))

        #character icon
            ciconurl=("assets/thumb/")
            if card[48]=="" or card[48]=="0.0":
                ciconurl+=unitid
            else:
                ciconurl+=str(int(float(card[48])))
            ciconurl+=(".png")
            cicon = Image.open(ciconurl).convert("RGBA")
            cicon.resize((250,250))


        #rarity
            crarityurl=("assets/misc/cha_rare_")
            crarityurl+=(getrarity(mainunit))
            crarityurl+=(".png")
            crarity = Image.open(crarityurl).convert("RGBA")
            if getrarity(mainunit)=="ssr":
                crarity=crarity.resize((120,72))
            else:    
                crarity=crarity.resize((160,96))

        #element
            celementurl=("assets/misc/cha_type_icon_")
            if len(mainunit[12])==1:
                celementurl+=("0")
            celementurl+=(mainunit[12])
            celementurl+=(".png")
            celement = Image.open(celementurl).convert("RGBA")
            celement=celement.resize((90,90))
            if mainunit[12] in ("20","10"):
                if(printing): print("AGL ",end="")
            elif mainunit[12] in ("21","11"):
                if(printing): print("TEQ ",end="")
            elif mainunit[12] in ("22","12"):
                if(printing): print("INT ",end="")
            elif mainunit[12] in ("23","13"):
                if(printing): print("STR ",end="")
            elif mainunit[12] in ("24","14"):
                if(printing): print("PHY ",end="")

            (width,height)=(cicon.width+10,cicon.height+10)
            cfinal=Image.new("RGBA",(width,height))
            cfinal.paste(cframe, (25,35), cframe)
            cfinal.paste(cicon, (0,1), cicon)
            if getrarity(mainunit)=="n":
                cfinal.paste(crarity, (-37,160),crarity)
                if(printing): print("N ",end="")
            elif getrarity(mainunit)=="r":
                cfinal.paste(crarity, (-42,160), crarity)
                if(printing): print("R ",end="")
            elif getrarity(mainunit)=="sr":
                cfinal.paste(crarity, (-25,158), crarity)
                if(printing): print("SR ",end="")
            elif getrarity(mainunit)=="ssr":
                cfinal.paste(crarity, (-5,171), crarity)
                if(printing): print("SSR ",end="")
            elif getrarity(mainunit)=="ur":
                cfinal.paste(crarity, (-25,160), crarity)
                if(printing): print("UR ",end="")
            elif getrarity(mainunit)=="lr" or True:
                cfinal.paste(crarity, (-25,155),crarity)
                if(printing): print("LR ",end="")
            cfinal.paste(celement, (170,5),celement)
            
            
            if(printing): print(mainunit[1])
            wallpapername=("assets/LR wallpapers/final_")
            wallpapername+=(unitid)
            wallpapername+=(".png")
            cfinal.save(wallpapername)
            total+=1
            if total%100==0:
                if(printing): print(total)
            
    if(printing): print("All LR wallpapers created")

def getUnitTyping(unit,printing=True,DEVEXCEPTIONS=False):
    if unit[12][-1]=="0":
        typing="AGL"
    elif unit[12][-1]=="1":
        typing="TEQ"
    elif unit[12][-1]=="2":
        typing="INT"
    elif unit[12][-1]=="3":
        typing="STR"
    elif unit[12][-1]=="4":
        typing="PHY"
    else:
        typing="UNKNOWN"
        if(DEVEXCEPTIONS==True):
            raise Exception("Unknown typing")
    return(typing)

def getUnitClass(unit,printing=True,DEVEXCEPTIONS=False):
    if(len(unit[12])==1):
        return(None)
    elif unit[12][0]=="1":
        return("Super")
    elif unit[12][0]=="2":
        return("Extreme")
    
def createFinalAsset(card,printing=True):
    if (card[53]!="2030-12-31 23:59:59") and (card[0][0]!="9") and (card[0][-1]=="0") and (card[22]!=""):
        unitid=card[0]
        if unitid[-1]=="1":
            unitid=str(int(unitid)-1)
        mainunit=card

    #background
        cframeurl=("assets/misc/cha_base_0")
    #element
        cframeurl+=(mainunit[12][-1])
        cframeurl+=("_0")
    #rarity
        cframeurl+=(mainunit[5])
        cframeurl+=(".png")


        cframe = Image.open(cframeurl).convert("RGBA")
        cframe=cframe.resize((200,200))

    #character icon
        ciconurl=("assets/thumb/")
        if card[48]=="" or card[48]=="0.0":
            ciconurl+=unitid
        else:
            ciconurl+=str(int(float(card[48])))
        ciconurl+=(".png")
        cicon = Image.open(ciconurl).convert("RGBA")
        cicon.resize((250,250))


    #rarity
        crarityurl=("assets/misc/cha_rare_")
        crarityurl+=(getrarity(mainunit))
        crarityurl+=(".png")
        crarity = Image.open(crarityurl).convert("RGBA")
        if getrarity(mainunit)=="ssr":
            crarity=crarity.resize((120,72))
        else:    
            crarity=crarity.resize((160,96))

    #element
        celementurl=("assets/misc/cha_type_icon_")
        if len(mainunit[12])==1:
            celementurl+=("0")
        celementurl+=(mainunit[12])
        celementurl+=(".png")
        celement = Image.open(celementurl).convert("RGBA")
        celement=celement.resize((90,90))

        (width,height)=(cicon.width+10,cicon.height+10)
        cfinal=Image.new("RGBA",(width,height))
        cfinal.paste(cframe, (25,35), cframe)
        cfinal.paste(cicon, (0,1), cicon)
        if getrarity(mainunit)=="n":
            cfinal.paste(crarity, (-37,160),crarity)
        elif getrarity(mainunit)=="r":
            cfinal.paste(crarity, (-42,160), crarity)
        elif getrarity(mainunit)=="sr":
            cfinal.paste(crarity, (-25,158), crarity)
        elif getrarity(mainunit)=="ssr":
            cfinal.paste(crarity, (-5,171), crarity)
        elif getrarity(mainunit)=="ur":
            cfinal.paste(crarity, (-25,160), crarity)
        elif getrarity(mainunit)=="lr" or True:
            cfinal.paste(crarity, (-25,155),crarity)
        cfinal.paste(celement, (170,5),celement)
        
        cfinal=cfinal.crop((10,10,256,235))
        
        name=("assets/final_assets/")
        name+=(unitid)
        name+=(".png")
        
        cfinal.save(name)

def scrapeallunitassetsv2(cards,thumb=False,full=False,bg=False,character=False,circle=False,cutin=False,effect=False,piece=False,sticker_mask=False,sp_cutin_1=False,printing=True):
    assetsNeeded=[]
    if thumb: assetsNeeded.append("thumb")
    if full: assetsNeeded.append("full")
    if bg: assetsNeeded.append("bg")
    if character: assetsNeeded.append("character")
    if circle: assetsNeeded.append("circle")
    if cutin: assetsNeeded.append("cutin")
    if effect: assetsNeeded.append("effect")
    if piece: assetsNeeded.append("piece")


    toScrapeList=[]
    amountScraped=0
    for unit in cards:
        if (unit[0][-1]=="0") and (unit[0][0]!="5") and (unit[53]!="2030-12-31 23:59:59") and (unit[0][0]!="9") and (unit[0][-1]=="0") and (unit[22]!=""):
            allAssetsDownloaded=True
            for dataType in assetsNeeded:
                if(allAssetsDownloaded==True):
                    temp=os.path.join("assets",dataType)
                    temp=os.path.join(temp,unit[0]+".png")
                    temp2=os.path.exists(temp)
                    if (False==temp2):
                        allAssetsDownloaded=False
            if(allAssetsDownloaded==False):
                toScrapeList.append(unit[0])

    if(printing): print("Now going to scrape",len(toScrapeList),"units")
    for unit in toScrapeList:
        if(printing):print(amountScraped,"/",len(toScrapeList),"scraping ",unit, end=": ")
        start_time=time.time()
        scrapeFullUnit(unit,thumb,full,bg,character,circle,cutin,effect,piece,sticker_mask,sp_cutin_1,printing)
        amountScraped+=1
        if(printing):print("took: ",round((time.time()-start_time),3)," seconds")

def scrapeallunitassets(cards,printing=True):
    scrapedunitsreader=open("Scraped units.txt", "r")
    scrapedunitslist=scrapedunitsreader.read()
    scrapedunitslist=scrapedunitslist.split("\n")

    scrapedunitsappender=open("Scraped units.txt", "a")
    toScrapeList=[]
    amountScraped=0
    for unit in cards:
        if (unit[0][-1]=="0") and (unit[0][0]!="5") and (unit[53]!="2030-12-31 23:59:59") and (unit[0][0]!="9") and (unit[0][-1]=="0") and (unit[22]!=""):
            if unit[0] not in scrapedunitslist:
                toScrapeList.append(unit[0])

    if(printing): print("Now going to scrape",len(toScrapeList),"units")
    for unit in cards:
        if (unit[0][-1]=="0") and (unit[0][0]!="5") and (unit[53]!="2030-12-31 23:59:59") and (unit[0][0]!="9") and (unit[0][-1]=="0") and (unit[22]!=""):
            if unit[0] not in scrapedunitslist:
                if(printing): print(amountScraped,"/",len(toScrapeList),"scraping ",unit[0], end=": ")
                start_time=time.time()
                scrapeFullUnit(unit[0])
                scrapedunitsappender.write(unit[0]+"\n")
                scrapedunitslist.append(unit[0])
                amountScraped+=1
                if(printing): print("took: ",round((time.time()-start_time),3)," seconds")

def scrapeassetspecific(filesource, fileDest,printing=True):
    if(printing): print(filesource)
    r = requests.get(filesource, allow_redirects=True, timeout=300)
    if("404" not in str(r._content)):
        open(fileDest, 'wb').write(r.content)
    else:
        if(printing): print(filesource," NOT FOUND ", )

def screpeassetlineant(fileID, fileType,printing=True):
    
    #filetype option:
    #thumb
    #full
    #bg
    #character
    #circle
    #cutin
    #effect
    #piece
    #sticker_mask
    #sp_cutin_1
    fileDest="assets/"+fileType+"/"+fileID+".png"
    
    if(os.path.isfile(fileDest)==False):
        if fileType=="thumb":filesource="https://glben.dokkaninfo.com/assets/global/en/character/thumb/card_"+fileID+"_thumb.png"
        elif fileType=="full": filesource="https://glben.dokkaninfo.com/assets/global/en/character/card/"+fileID+"/"+fileID+".png"
        elif fileType=="bg": filesource= "https://glben.dokkaninfo.com/assets/global/en/character/card/"+fileID+"/card_"+fileID+"_bg.png"
        elif fileType=="character": filesource= "https://glben.dokkaninfo.com/assets/global/en/character/card/"+fileID+"/card_"+fileID+"_character.png"
        elif fileType=="circle": filesource= "https://glben.dokkaninfo.com/assets/global/en/character/card/"+fileID+"/card_"+fileID+"_circle.png"
        elif fileType=="cutin": filesource= "https://glben.dokkaninfo.com/assets/global/en/character/card/"+fileID+"/card_"+fileID+"_cutin.png"
        elif fileType=="effect": filesource="https://glben.dokkaninfo.com/assets/global/en/character/card/"+fileID+"/card_"+fileID+"_effect.png"
        elif fileType=="piece": filesource="https://glben.dokkaninfo.com/assets/global/en/character/card/"+fileID+"/card_"+fileID+"_piece.png"
        elif fileType=="sticker_mask": filesource="https://glben.dokkaninfo.com/assets/global/en/character/card/"+fileID+"/card_"+fileID+"_sticker_mask.png"
        elif fileType=="sp_cutin_1": filesource="https://glben.dokkaninfo.com/assets/global/en/character/card/"+fileID+"/card_"+fileID+"sp_cutin_1.png"
        
        else: 
            if(printing): print(fileType, "fileType invalid")
        
        
        r = requests.get(filesource, allow_redirects=True, timeout=120)
        if("404 Not Found" not in str(r._content)):
            open(fileDest, 'wb').write(r.content)
        else:
            filesource=filesource.replace("global","japan")
            filesource=filesource.replace("/en","")
            r = requests.get(filesource, allow_redirects=True, timeout=120)
            if("404 Not Found" not in str(r._content)):
                open(fileDest, 'wb').write(r.content)
            elif(fileType!="sticker_mask"):
                if(printing): print(filesource," NOT FOUND ", )

def scrapeFullUnit(fileID,thumb=True,full=True,bg=True,character=True,circle=True,cutin=True,effect=True,piece=True,sticker_mask=True,sp_cutin_1=True,printing=True):
    assetsNeeded=[]
    if thumb: assetsNeeded.append("thumb")
    if full: assetsNeeded.append("full")
    if bg: assetsNeeded.append("bg")
    if character: assetsNeeded.append("character")
    if circle: assetsNeeded.append("circle")
    if cutin: assetsNeeded.append("cutin")
    if effect: assetsNeeded.append("effect")
    if piece: assetsNeeded.append("piece")

    for fileType in assetsNeeded:
        screpeassetlineant(fileID, fileType,printing)
    
def passivename(unit,printing=True):
    global passive_skillsJP
    return(listtostr(searchbyid(str(int(float(unit[21]))), 0, passive_skillsJP, 1)))

def floattoint(number,printing=True):
    if(type(number)==str):
        number=float(number)
    if number%1==0:
        return(int(number))
    else:
        return(number)

def checkeza(unit,printing=True):
    global optimal_awakening_growthsJP
    for eza in optimal_awakening_growthsJP[1:]:
        if str(int(float(unit[22]))) in str(int(float(eza[6]))):
            return(True)
    return(False)
    
def returnRow(ID, IDRow, database, printing=True):
    output=[]
    for row in database:
        if ID==row[IDRow]:
            output.append(row)
    return(output)

#this function takes in a piece of data
#checks within the destincation_csv along the column
#once it finds one that matches it will return that row's entry on the destination_column
#def searchbycolumn(code, database, column, printing=True):
#    temp=[]
#    for row in database:
#        if (code==row[column]):
#            temp.append(row)
#    return(temp)
                
def searchbycolumn(code, database, column, printing=True):
    return [row for row in database if code == row[column]]

    
#def searchbyid(code, codecolumn, database, column,printing=True):
#    temp=[]
#    for row in database:
#        if code==row[codecolumn]:
#            temp.append(row[column])
#    if temp==[]:
#        return(None)
#    else:
#        return(temp)
def searchbyid(code, codecolumn, database, column, printing=True):
    result = [row[column] for row in database if code == row[codecolumn]]
    return result if result else None

def combinelinks(linklist,lvl,printing=True):
    global link_skillsJP
    global link_skill_lvsJP
    global link_skill_efficaciesJP
    ATK=0
    DEF=0
    KI=0
    ENEMYDEF=0
    EVASION=0
    CRIT=0
    HEAL=0
    DREDUCTION=0
    #create variable for links that activate under certain hp. NO

    for link in linklist:
        if link!="":
            linkid=searchedbyid(link, 1, link_skillsJP, 0)[0]
            linkcode=searchedbyid(linkid, 1, link_skill_lvsJP, 0)[lvl-1]
            for linkdetails in link_skill_efficaciesJP:
            
                if linkcode==linkdetails[1]:

                
                    #retrieve all nessessary data from link
                    if linkdetails[3]=="1":
                        ATK+=float(linkdetails[11])
                    if linkdetails[3]=="2":
                        if linkdetails[4]=="1":
                            DEF+=float(linkdetails[11])
                        elif linkdetails[4]=="4":
                            ENEMYDEF+=float(linkdetails[11])
                    if linkdetails[3]=="3":
                        ATK+=float(linkdetails[11])
                        DEF+=float(linkdetails[12])
                    if linkdetails[3]=="4":
                        HEAL+=float(linkdetails[11])
                    if linkdetails[3]=="5":
                        KI+=float(linkdetails[11])
                    if linkdetails[3]=="13":
                        DREDUCTION+=(100-float(linkdetails[11]))
                    if linkdetails[3]=="90":
                        CRIT+=float(linkdetails[11])
                    if linkdetails[3]=="91":
                        EVASION+=float(linkdetails[11])
    return(ATK,DEF,KI,ENEMYDEF,EVASION,CRIT,HEAL,DREDUCTION)

def presentcharacter(unit,printing=True):
    if unit[3]=="STR":
        if(printing): print(Fore.RED,end="")
    elif unit[3]=="PHY":
        if(printing): print(Fore.YELLOW,end="")
    elif unit[3]=="INT":
        if(printing): print(Fore.MAGENTA,end="")
    elif unit[3]=="TEQ":
        if(printing): print(Fore.GREEN,end="")
    elif unit[3]=="AGL":
        if(printing): print(Fore.BLUE,end="")
    tempreturn=""
    
    #rarity
    tempreturn+=unit[4]
    tempreturn+=" "
    
    #element
    tempreturn+=unit[3]
    tempreturn+=" "
    
    #name
    tempreturn+=unit[2]
    tempreturn+=" "
    
    return(tempreturn)

def search(OGwordlist,searched,printing=True):
    wordlist=OGwordlist.copy()
    if searched.isdigit():
        if 1+len(wordlist)>int(searched):
            if(printing): print("Are you selecting entry no. ",searched," ", wordlist[int(searched)-1]," y/n: ",sep="")
            if input().upper()=="Y":
                if(printing): print(wordlist[int(searched)-1])
                return(wordlist[int(searched)-1])
            

    for x in reversed(wordlist):
        if searched.upper() not in x.upper():
            wordlist.remove(x)
    if len(wordlist)==0:
        if(printing): print("NO ENTRIES CONTAIN THAT")
        return(search(OGwordlist,input("Which one do you want to use?: ")))
    if len(wordlist)==1:
        if(printing): print(wordlist[0])
        return(wordlist[0])
    for y in wordlist:
        if(printing): print(1+wordlist.index(y),y)
    return(search(wordlist,input("Which one do you want to use?: ")))
        
#ultralist is a list consisting of other lists
#slot is the list value that is used across all lists to sort the individual lists
def sortultralist(ultralist,slot,reverse=False,printing=True):
    tempultralist=((sorted(ultralist, key=lambda x:x[slot])))
    if reverse:
        tempultralist.reverse()
    return(tempultralist)
    
#sorts through a list consisting of words and returns the sorted list
def wordsort(mylist,printing=True):
    mylist.sort()
    return(mylist)
    
#used to quickly store all data of a database
def storedatabase(directory,name,printing=True):
    directory+=name
    file = open(directory, encoding="Latin-1")
    dbtemp=csv.reader(file)
    name=[]
    for row in dbtemp:
        name.append(row)
    return(name)
    
def listtostr(mylist,printing=True):
    temp=""
    if mylist!=None:
        for x in mylist:
            temp+=str(x)
    return(temp)
#used initially to searched for and return a list of a specific character
def charactersearched(searcheded,database,printing=True):
    searchedoptions=[]
    for unit in database:
        if searcheded.lower() in unit[1].lower():
            searchedoptions.append(unit)
    return(searchedoptions)

#used to remove any unused entries in the database list
def removedupes(unit,searchedoptions,printing=True):
    #checks if unit id ends in 0
    if unit[0][-1]=="0":
        searchedoptions.remove(unit)
        return(True,searchedoptions)
    else:
        for x in searchedoptions:
            #check if passive_skill_set_id is already included or is empty
            if unit[21]=="":
                if unit!=x:
                    searchedoptions.remove(unit)
                    return(True,searchedoptions)
    return(False,searchedoptions)

#used to select which of the given options will be used in calculations
def choosechoice(choice,searchedoptions,printing=True):
    return(searchedoptions[choice-1])
    
#used to cross reference id's within diferent databases, unit column variable is used to see where the desired value is
def searchedbyid(code, codecolumn, database, column,printing=True):
    temp=[]
    for x in database:
        if code==x[codecolumn]:
            temp.append(x[column])
    if temp==[]:
        return(None)
    else:
        return(temp)
        
#used to find if a unit is SUPER/EXTREME class(includes code for if they are neither, but isn't very usable)
def superextremefinder(element,printing=True):
    if int(element)>19:
        return("E.")
    elif int(element)>9:
        return("S.")
    else:
        return(" ")

#Used to find the typing of the character (AGL/TEQ/INT/STR/PHY)
def typefinder(element,printing=True):
    if element[-1]=="0":
        return("AGL")
    if element[-1]=="1":
        return("TEQ")
    if element[-1]=="2":
        return("INT")
    if element[-1]=="3":
        return("STR")
    if element[-1]=="4":
        return("PHY")
    else:
        return("NO TYPING!!!!!!!!!!!!!")

def getrarity(unit,printing=True):
    #add if LR
    if unit[5]=="5":
        return("lr")
    elif unit[5]=="4":
        return("ur")
    elif unit[5]=="3":
        return("ssr")
    elif unit[5]=="2":
        return("sr")
    elif unit[5]=="1":
        return("r")
    elif unit[5]=="0":
        return("n")
        
    
    return("ERROR IN GETRARITY UNIT MAX LEVEL IS",unit[13])

def getUnitStats(unit,level,DEVEXCEPTIONS=False):
    global card_growthsJP
    hp_init=int(unit[6])
    hp_max=int(unit[7])
    atk_init=int(unit[8])
    atk_max=int(unit[9])
    def_init=int(unit[10])
    def_max=int(unit[11])
    level_max=int(unit[13])
    growthInfo=searchbycolumn(code=unit[15],column=1,database=card_growthsJP)
    coef=float(searchbyid(code=str(level),codecolumn=2,database=growthInfo,column=3)[0])
    stats={}
    stats["HP"]=math.floor((0.5 * (level - 1) * (hp_max - hp_init)) / (level_max - 1) + 0.5 * coef * (hp_max - hp_init) + hp_init)
    stats["ATK"]=math.floor((0.5 * (level - 1) * (atk_max - atk_init)) / (level_max - 1) + 0.5 * coef * (atk_max - atk_init) + atk_init)
    stats["DEF"]=math.floor((0.5 * (level - 1) * (def_max - def_init)) / (level_max - 1) + 0.5 * coef * (def_max - def_init) + def_init)
    return(stats)
    

def swapToUnitWith0(unit):
    global cardsJP
    unitId=definewith0(unit[0])
    for card in cardsJP:
        if card[0]==unitId:
            return(card)
    return(None)

def swapToUnitWith1(unit):
    global cardsJP
    unitId=definewith1(unit[0])
    for card in cardsJP:
        if card[0]==unitId:
            return(card)
    return(None)

def getpassiveid(unit,eza=False, printing=False):
    global cardsJP
    global optimal_awakening_growthsJP
    global passive_skill_set_relationsJP
    unitPassiveId=unit[21]
    if(eza):
        if(swapToUnitWith1(unit)!=None):
            unitEZA=swapToUnitWith1(unit)
        else:
            return(getpassiveid(unit,eza=False, printing=printing))
        unitEZAGrowthId=unitEZA[16][0:-2]
        if(unitEZAGrowthId==""):
            return(getpassiveid(unit,eza=False, printing=printing))
        unitEZAPassiveId=searchbyid(code=unitEZAGrowthId,codecolumn=1,database=optimal_awakening_growthsJP,column=5)
        #unitEZAPassiveId=map(floattoint,unitEZAPassiveId)
        for element in unitEZAPassiveId:
            if element!= unitPassiveId:
                unitEZAPassiveId=element
        
        unitEZAPassiveList=searchbyid(code=unitEZAPassiveId[0:-2],codecolumn=1,database=passive_skill_set_relationsJP,column=2)
        return(unitEZAPassiveList)
    else:
        unitPassiveId=unitPassiveId[0:-2]
        unitPassiveList=searchbyid(code=unitPassiveId,codecolumn=1,database=passive_skill_set_relationsJP,column=2)
        return(unitPassiveList)

#retrieves full character name(e.g. "E.TEQ LR Nightmarish Impact Legendary Super Saiyan Broly 4016881")
def getfullname(unit,printing=True):
    global leader_skillsJP
    #create empty variable
    temp=""
    
    temp+=(getrarity(unit))
        
    temp+=" "
    
    #add if unit is super or extreme
    temp+=(superextremefinder(unit[12]))
    temp+=""
    
    #add unit typing
    temp+=(typefinder(unit[12]))
    temp+=" "
    
    #get unit name
    temp+=(unit[1])
    temp+=" "
    
    #get unit leader skill name
    temp+=(listtostr(searchedbyid(unit[22],0,leader_skillsJP,1)))
    temp+=" "
    
    #get unit id
    temp+=(unit[0])
    temp+=" "
    
    #return variable
    return(temp)
    
def getallcategories(unitid,printing=True):
    global card_card_categoriesGB
    global card_categoriesGB
    temp1=searchedbyid(unitid, 1, card_card_categoriesJP, 2)
    categoryList=[]
    if temp1!=None:
        for x in temp1:
            categoryList.append(searchedbyid(x,0,card_categoriesGB,1)[0])
    return(categoryList)

def getalllinks(unit,printing=True):
    global link_skillsGB
    linksList=[]
    for x in range(23,30):
       if(unit[x]!=""):
        code=unit[x][:-2]
        temp1=searchbyid(code,0,link_skillsGB,1)
        linksList.append(temp1[0])

    return(linksList)
    
def ordinalise(number,printing=True):
    if(type(number)==str):
        number=int(number)
    if number==1:
        return("1st")
    elif number==2:
        return("2nd")
    elif number==3:
        return("3rd")
    else:
        return(str(number)+"th")

def ezastat(minlvl,maxlvl,printing=True):
    minlvl=int(minlvl)
    maxlvl=int(maxlvl)
    return(round(((maxlvl-minlvl)*0.4839)+maxlvl))

