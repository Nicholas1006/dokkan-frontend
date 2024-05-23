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

def sub_target_types_extractor(sub_target_type_set_id,sub_target_types,card_categories,DEVELOPEREXCEPTIONS=False):
    temp=searchbycolumn(code=sub_target_type_set_id,database=sub_target_types,column=1)
    output={}
    output["Category"]=[]
    output["Excluded Category"]=[]
    for line in temp:   
        if(line[2]=="1"):
            output["Category"].append(CategoryExtractor(line[3],card_categories))
        elif(line[2]=="2"):
            output["Excluded Category"].append(CategoryExtractor(line[3],card_categories))
        elif(line[2]=="3"):
            output["Amount of times to turn giant"]=1
        else:
            output["Category"].append("UNKNOWN")
            if(DEVELOPEREXCEPTIONS==True):
                raise Exception("Unknown sub target type")
    return (output)

class hiPoNode:
    def __init__(self,code,parentNode):
        self.code=code
        self.parentNode=parentNode
        self.childrenID=[]
        self.BuffType=None
        self.BuffAmount=0
        if(parentNode==None):
            self.Path=-1
        else:
            self.Path=parentNode.Path

class hiPoBoard:
    def __init__(self,headNode):
        self.head=headNode
        self.connections=[]
        self.nodes=[]

def createHiPoBoard(headID,potential_squares,potential_square_relations):
    headNode=hiPoNode(headID,None)
    headNode.Path=[]
    headNode.Path.append(headID)
    headNode.BuffType=None
    headNode.BuffAmount=0
    headNode.childrenID=searchbycolumn(code=headID,column=1,database=potential_squares)
    headNode.childrenID=sortultralist(ultralist=headNode.childrenID,slot=0)
    return(headNode)

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

def parseSuperAttack(unit,card_specials,special_sets,specials,DEVEXCEPTIONS=False):
    output={}
    card_specials=searchbycolumn(code=unit[0],column=1,database=card_specials)
    card_specials=removeDuplicatesUltraList(ultraList=card_specials,slot=0)
    for card_special in card_specials:
        superSet=searchbycolumn(code=card_special[2],column=0,database=special_sets)
        superID=superSet[0][0]
        superName=superSet[0][1]
        superDescription=superSet[0][2]
        superMinKi=card_special[6]
        superPriority=card_special[3]
        superStyle=card_special[4]
        superCausality=superSet[0][3]
        superAimTarget=superSet[0][4]
        superIsInactive=superSet[0][7]
        card_specials=searchbycolumn(code=superID,column=1,database=specials)
        for special in card_specials:
            specialsEffect=parseSpecials(special,DEVEXCEPTIONS)    

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
    elif(specialRow[3]=="111"):
        output["Status"]="Disabled action"
    else:
        output["Status"]="UNKNOWN"
        if(DEVEXCEPTIONS==True):
            raise Exception("Unknown special attack effect")
    return(output)
        


def parseHiddenPotential(Potential_board_id,potential_squares,potential_square_relations,potential_events,DEVEXCEPTIONS=False):
    #WIP

    nodesSearched={}
    
    nodesSearching={}
    allNodes=searchbycolumn(code=Potential_board_id,column=1,database=potential_squares)
    pathNodes=[]
    for node in allNodes:
        if(node[4]=="1"):
            pathNodes.append(node[0])
        if("" in searchbyid(code=node[0],codecolumn=1,database=potential_square_relations,column=2)):
            nodesSearched[node[0]]=0
    furthestNodesFound=nodesSearched.copy()
    newNodes=True
    
    while(newNodes==True):
        newNodes=False
        for node in furthestNodesFound:
            connections=searchbyid(code=node,codecolumn=1,database=potential_square_relations,column=2)
            for connection in connections:
                if(connection!=""):
                    if(connection[:-2] not in pathNodes):
                        if(connection[:-2] not in nodesSearched and connection[:-2] not in nodesSearching):
                            nodesSearching[connection[:-2]]=nodesSearched[node]
                            newNodes=True
                    else:
                        if(connection[:-2] not in nodesSearched and connection[:-2] not in nodesSearching):
                            path=searchbyid(code=connection[:-2],codecolumn=0,database=potential_squares,column=5)
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
        eventid=searchbyid(code=node,codecolumn=0,database=potential_squares,column=2)[0]
        event=searchbycolumn(code=eventid,database=potential_events,column=0)[0]
        if(event[1]=="PotentialEvent::Hp"):
            output[nodesSearched[node]]["HP"]+=int(event[3])
        elif(event[1]=="PotentialEvent::Atk"):
            output[nodesSearched[node]]["ATK"]+=int(event[3])
        elif(event[1]=="PotentialEvent::Defense"):
            output[nodesSearched[node]]["DEF"]+=int(event[3])


   
    return(output)

        
def parseLeaderSkill(unit,dokkan_fields,skill_causalities,cards,card_unique_info_set_relations,leader_skill_line,leader_skills,card_categories,sub_target_types,DEVEXCEPTIONS=False):
    output={}

    output["Buff"]={}
    if(leader_skill_line[8]=="0"):
        output["Buff"]["Type"]="Raw stats"
        output["Buff"]["+ or -"]="+"

    elif(leader_skill_line[8]=="1"):
        output["Buff"]["Type"]="Raw stats"
        output["Buff"]["+ or -"]="-"

    elif(leader_skill_line[8]=="2"):
        output["Buff"]["Type"]="Percentage"
        output["Buff"]["+ or -"]="+"

    elif(leader_skill_line[8]=="3"):
        output["Buff"]["Type"]="Percentage"
        output["Buff"]["+ or -"]="-"
    else:
        output["Buff"]["Type"]="Unknown"
        output["Buff"]["+ or -"]="Unknown"
        if(DEVEXCEPTIONS==True):
                raise Exception("Unknown stat increase type")
    
    output["Target"]={}
    efficiacy_values=leader_skill_line[7].replace("[","").replace("]","").split(",")
    output["Target"]=(sub_target_types_extractor(leader_skill_line[4],sub_target_types,card_categories,DEVEXCEPTIONS))
    if(leader_skill_line[3]=="4"):
        output["Target"]["Allies or enemies"]="Enemies"
    elif(leader_skill_line[3]=="2"):
        output["Target"]["Allies or enemies"]="Allies"
    if leader_skill_line[6]=="0":
        return(None)
    elif(leader_skill_line[6]=="1"):
        output["ATK"]=int(efficiacy_values[0])
    elif(leader_skill_line[6]=="2"):
        #Enemy ["DEF", ??, ??] 
        output["DEF"]=int(efficiacy_values[0])
    elif(leader_skill_line[6]=="3"):
        #Category ["HP and ATK", "DEF", ""] 
        output["HP"]=int(efficiacy_values[0])
        output["ATK"]=int(efficiacy_values[0])
        output["DEF"]=int(efficiacy_values[1])
    elif(leader_skill_line[6]=="5"):
        #Category ["Ki", "", ""] 
        output["Ki"]=int(efficiacy_values[0])
    elif(leader_skill_line[6]=="13"):
        #All types damage reduction
        output["DR"]=100-int(efficiacy_values[0])
    elif(leader_skill_line[6]=="16"):
        #Single type [Typing, "ATK", ""] 
        output["Target"]["Typing"]=typefinder(efficiacy_values[0],printing=True)
        output["ATK"]=int(efficiacy_values[1])
    elif(leader_skill_line[6]=="17"):
        #Single type [Typing, "DEF", ""] 
        output["Target"]["Typing"]=typefinder(efficiacy_values[0],printing=True)
        output["DEF"]=int(efficiacy_values[1])
    elif(leader_skill_line[6]=="18"):
        #Single type [Typing, "ATK and DEF", ""] 
        output["Target"]["Typing"]=typefinder(efficiacy_values[0],printing=True)
        output["ATK"]=int(efficiacy_values[1])
        output["DEF"]=int(efficiacy_values[2])
    elif(leader_skill_line[6]=="19"):
        #Single type [Type, "HP", ""] 
        output["Target"]["Typing"]=typefinder(efficiacy_values[0],printing=True)
        output["HP"]=int(efficiacy_values[1])
    elif(leader_skill_line[6]=="20"):
        #Single Type (Type, "Ki", "") 
        output["Target"]["Typing"]=typefinder(efficiacy_values[0],printing=True)
        output["Ki"]=int(efficiacy_values[1])
    elif(leader_skill_line[6]=="44"):
        #Single Type (Type, HP, ATK) 
        output["Target"]["Typing"]=typefinder(efficiacy_values[0],printing=True)
        output["HP"]=int(efficiacy_values[1])
        output["ATK"]=int(efficiacy_values[2])
    elif(leader_skill_line[6]=="50"):
        #Immune to negative effects
        output["Status"]=["Immune to negative effects"]
    elif(leader_skill_line[6]=="58"):
        #Heal per ki of own type
        output["Building Stat"]= {"Cause":"Ki sphere obtained", "Type":"Own type"}
        output["Heals"]=int(efficiacy_values[0])
    elif(leader_skill_line[6]=="59"):
        #ATK per ki sphere obtained
        output["Building Stat"]= {"Cause":"Ki sphere obtained", "Type":"Any"}
        output["ATK"]=int(efficiacy_values[0])
    elif(leader_skill_line[6]=="61"):
        #ATK and DEF per ki sphere obtained
        output["Building Stat"]= {"Cause":"Ki sphere obtained", "Type":"Any"}
        output["ATK"]=int(efficiacy_values[0])
        output["DEF"]=int(efficiacy_values[1])
    elif(leader_skill_line[6]=="64"):
        #ATK per ki sphere obtained of a type
        output["Building Stat"]= {"Cause":"Ki sphere obtained", "Type":KiOrbType(efficiacy_values[0],DEVEXCEPTIONS=DEVEXCEPTIONS)}
        output["ATK"]=int(efficiacy_values[1])
        output["Target"]["Typing"]=typefinder(efficiacy_values[0],printing=True)
    elif(leader_skill_line[6]=="71"):
        #HP based ["Min ATK", "MAX ATK", ???] 
        output["Building Stat"]={"Cause":"HP", "Type":"More HP remaining"}
        output["ATK"]=int(efficiacy_values[1])
        output["Building Stat"]["Min"]=int(efficiacy_values[0])
        output["Building Stat"]["Max"]=int(efficiacy_values[1])
    elif(leader_skill_line[6]=="82"):
        #Typing [Typing, "HP and ATK and DEF", ""] 
        output["Target"]["Class"]=extractClassType(efficiacy_values[0],DEVEXCEPTIONS=DEVEXCEPTIONS)[0]
        output["Target"]["Typing"]=extractClassType(efficiacy_values[0],DEVEXCEPTIONS=DEVEXCEPTIONS)[1]
        output["HP"]=int(efficiacy_values[1])
        output["ATK"]=int(efficiacy_values[1])
        output["DEF"]=int(efficiacy_values[1])
    elif(leader_skill_line[6]=="83"):
        #Typing ki
        output["Ki"]=int(efficiacy_values[1])
    elif(leader_skill_line[6]=="84"):
        #Typing HP ATK and DEF
        output["HP"]=int(efficiacy_values[1])
        output["ATK"]=int(efficiacy_values[1])
        output["DEF"]=int(efficiacy_values[1])
    elif(leader_skill_line[6]=="93"):
        #All types or specific type HP
        output["Target"]["Class"]=extractClassType(efficiacy_values[0],DEVEXCEPTIONS=DEVEXCEPTIONS)[0]
        output["Target"]["Typing"]=extractClassType(efficiacy_values[0],DEVEXCEPTIONS=DEVEXCEPTIONS)[1]
        output["HP"]=int(efficiacy_values[1])
    elif(leader_skill_line[6]=="102"):
        output["Times to turn giant"]=int(efficiacy_values[1])
    elif(leader_skill_line[6]=="104"):
        #Category ["HP", "ATK","DEF"] 
        output["HP"]=int(efficiacy_values[0])
        output["ATK"]=int(efficiacy_values[1])
        output["DEF"]=int(efficiacy_values[2])
    else:
        output["Ki"]="UNKNOWN"
        output["HP"]="UNKNOWN"
        output["ATK"]="UNKNOWN"
        output["DEF"]="UNKNOWN"
        if(DEVEXCEPTIONS==True):
            raise Exception("Unknown leader skill")
        
    if(leader_skill_line[5]!=""):
        causalityCondition=logicalCausalityExtractor(leader_skill_line[5])
        causalityCondition=CausalityLogicalExtractor(unit,dokkan_fields,causalityCondition,card_categories,skill_causalities,cards,card_unique_info_set_relations,DEVEXCEPTIONS=DEVEXCEPTIONS)
        output["Condition"]=causalityCondition
    return(output)

def turnintoJson(data,filename, directoryName="" ):
    if filename.endswith(".json")==False:
        filename+=".json"
    if(directoryName!=""):
        if(directoryName[-1]!="/"):
            directoryName+="/"
    with open(directoryName+filename, 'w') as f:
        json.dump(data, f, indent=4)

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

def extractPassiveLine(passive_skills, passive_skill_set_relations,dokkan_fields,dokkan_field_passive_skill_relations,battle_params,unit,skill_causalities,card_unique_info_set_relations,cards,passiveskill,sub_target_types,card_categories,printing=False,DEVEXCEPTIONS=False):
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
        TargetRow=searchbycolumn(code=passiveskill[6],database=sub_target_types,column=1)[0]
        TargetCategory=CategoryExtractor(TargetRow[3],card_categories=card_categories)
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
        domainID=searchbyid(code=passiveskill[0],codecolumn=2,database=dokkan_field_passive_skill_relations,column=1)[0]
        effects["Domain expansion"]["ID"]=domainID
        domainName=searchbyid(code=domainID,codecolumn=1,database=dokkan_fields,column=2)[0]
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
        type1=binaryOrbType(passiveskill[13])
        type2=binaryOrbType(passiveskill[14])
        effects["Ki change"]["From"]=type1
        effects["Ki change"]["To"]=type2
        
    elif passiveskill[4]=="68":
        if(passiveskill[13]=="4"):
            effects["Heals"]+=int(passiveskill[15])
            effects["Building Stat"]["Cause"]={"Cause":"Ki sphere obtained", "Type":KiOrbType(passiveskill[14])}
        else:
            #buffs per ki sphere
            effects["Building Stat"]["Cause"]={"Cause":"Ki sphere obtained", "Type":binaryOrbType(passiveskill[13])}
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
        effects["Ki change"]["From"]=["AGL","TEQ","INT","STR","PHY","Rainbow"]
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
        params=searchbycolumn(code=passiveskill[14],database=battle_params,column=1)
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
        kiSphereType=binaryOrbType(passiveskill[13])
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
        causalityCondition=CausalityLogicalExtractor(unit,dokkan_fields,causalityCondition,card_categories,skill_causalities,cards,card_unique_info_set_relations,DEVEXCEPTIONS=DEVEXCEPTIONS)
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
        result=result.split(",")
        for x in result:
            if "u" in x:
                result.remove(x)
        return(result)

def logicalCausalityExtractor(causality):
    if(causality==""):
        return([])
    else:
        result=causality.split('","compiled')[0]
        result=result.split('source":"')[1]
        result=result.replace("\\u0026","&")
        return(result)
    
def CausalityLogicalExtractor(unit,dokkan_fields,causality,card_categories,skill_causalities,cards,card_unique_info_set_relations,printing=True,DEVEXCEPTIONS=False):
    result=causality.replace("|"," or ").replace("&"," and ")
    currentCausality=""
    for x in result:
        if(x.isnumeric()):
            currentCausality+=x
        else:
            if(currentCausality!=""):
                newCausality=causalityLogicFinder(unit,dokkan_fields,currentCausality,card_categories,skill_causalities,cards,card_unique_info_set_relations,printing=True,DEVEXCEPTIONS=DEVEXCEPTIONS)
                result=result.replace(currentCausality,newCausality)
            currentCausality=""

    if(currentCausality!=""):
        newCausality=causalityLogicFinder(unit,dokkan_fields,currentCausality,card_categories,skill_causalities,cards,card_unique_info_set_relations,printing=True,DEVEXCEPTIONS=DEVEXCEPTIONS)
        result=result.replace(currentCausality,newCausality)
    return(result)

def smallestCommonSubstring(string1,string2):
    if(string1==string2):
        return(string1)
    else:
        longestString=""
        for letter1 in range(0,len(string1)):
            if(len(string1)-letter1>len(longestString)):
                for letter2 in range(0,len(string2)):
                    if(len(string2)-letter2>len(longestString)):
                        templetter1=letter1
                        templetter2=letter2
                        currentString=""
                        while (templetter1<len(string1) and templetter2<len(string2)):
                            if(string1[templetter1]==string2[templetter2]):
                                currentString+=string1[templetter1]
                                templetter1+=1
                                templetter2+=1
                            else:
                                templetter1=len(string1)+1
                                templetter2=len(string2)+2
                        if len(currentString)>len(longestString):
                            longestString=currentString
        return(longestString)

def CategoryExtractor(CategoryId,card_categories):
    for category in card_categories:
        if category[0]==CategoryId:
            return(category[1])

def causalityLogicFinder(unit,dokkan_fields,causalityCondition,card_categories,skill_causalities,cards,card_unique_info_set_relations,printing=True,DEVEXCEPTIONS=False):
    output=""
    for row in skill_causalities:
        if row[0] == causalityCondition:
            CausalityRow=row
            if(CausalityRow[1]=="0"):
                #WIP
                output+=("")
            elif(CausalityRow[1]=="1"):
                output+=("When HP is ")
                output+=(CausalityRow[2])
                output+=( "% or more")
            elif(CausalityRow[1]=="2"):
                output+=("When HP is ")
                output+=(CausalityRow[2])
                output+=("% or less")
            elif(CausalityRow[1]=="3"):
                output+=("When ki is ")
                
                Ca2=int(CausalityRow[2])
                unit31=int(unit[31])
                output+=str((Ca2*unit31)//99)
                
                output+=(" or more")
            elif(CausalityRow[1]=="4"):
                output+=("When ki is ")
                
                Ca2=int(CausalityRow[2])
                unit31=int(unit[31])
                output+=str((Ca2*unit31)//99)
                
                output+=(" or less")
            elif(CausalityRow[1]=="5"):
                output+=("Starting from the ")
                output+=(ordinalise(int(CausalityRow[2])+1))
                output+=(" turn from the start of battle")
            elif(CausalityRow[1]=="8"):
                output+=("When ATK is higher than enemy's")
            elif(CausalityRow[1]=="14"):

                output=output
                #aged out condition
                #WIP
            elif(CausalityRow[1]=="15"):
                output+=("When facing ")
                output+=(CausalityRow[2])
                output+=(" or more enemies")
            elif(CausalityRow[1]=="16"):
                output+=("When facing less than ")
                output+=(CausalityRow[2])
                output+=(" enemies")
            elif(CausalityRow[1]=="17"):
                output+=("When enemy's health is ")
                output+=(CausalityRow[2])
                output+=("% or more")
            elif(CausalityRow[1]=="18"):
                output+=("When enemy's health is ")
                output+=(CausalityRow[2])
                output+=("% or less")
            elif(CausalityRow[1]=="19"):
                if(CausalityRow[2]=="0"):
                    output+=("As the 1st attacker in the turn")
                elif(CausalityRow[2]=="1"):
                    output+=("As the 2nd attacker in the turn")
                elif(CausalityRow[2]=="2"):
                    output+=("As the 3rd attacker in the turn")
                else:
                    print("UNKNOWN ATTACK POSITION")
                    if(DEVEXCEPTIONS==True):
                        raise Exception("Unknown attack position")

            elif(CausalityRow[1]=="24"):
                output+=("When attack recieved ")
            elif(CausalityRow[1]=="25"):
                output+=("When this character delivers the final blow")

            elif(CausalityRow[1]=="30"):
                output+=("When guard is activated ")
            elif(CausalityRow[1]=="31"):
                output+=("When 3 attacks in a row")
            elif(CausalityRow[1]=="33"):
                output+=("When HP is between ")
                output+=(CausalityRow[2])
                output+=("% and ")
                output+=(CausalityRow[3])
                output+=("%")
            elif(CausalityRow[1]=="34"):
                if(CausalityRow[2]=="0"):
                    target="allies on the team "
                elif(CausalityRow[2]=="1"):
                    target="enemies "
                elif(CausalityRow[2]=="2"):
                    target="allies on the same turn "

                categoryType=searchbyid(CausalityRow[3],codecolumn=0,database=card_categories,column=1)[0]

                if(CausalityRow[4]=="0"):
                    output+=("When there are no ")
                    output+=(categoryType)
                    output+=(" category ")
                    output+=(target)
                else:
                    output+=("When there are ")
                    output+=(CausalityRow[4])
                    output+=(" or more ")
                    output+=(categoryType)
                    output+=(" category ")
                    output+=(target)    
            elif(CausalityRow[1]=="35"):
                output+=("When the team includes")
                if(extractClassType(CausalityRow[2],DEVEXCEPTIONS=DEVEXCEPTIONS)==(["Super"],["PHY","STR","INT","TEQ","AGL"])):
                    output+=(" all five Super types")
                elif(extractClassType(CausalityRow[2],DEVEXCEPTIONS=DEVEXCEPTIONS)==(["Extreme"],["PHY","STR","INT","TEQ","AGL"])):
                    output+=(" all five Extreme types")
                else:
                    print("UNKNOWN TYPE")
                    if(DEVEXCEPTIONS==True):
                        raise Exception("Unknown type")
                
            elif(CausalityRow[1]=="38"):
                Status=binaryStatus(CausalityRow[2])
                output+=("When the target enemy is ")
                output+=Status
            elif(CausalityRow[1]=="39"):
                output+=("When the target enemy is ")
                output+=(CausalityRow[2])
                output+=(" or more categories")
            elif(CausalityRow[1]=="40"):
                output+=("A super is being performed")
            elif(CausalityRow[1]=="41"):
                if(CausalityRow[2]=="0"):
                    output+=("When there is an ally on the team whose name includes ")
                elif(CausalityRow[2]=="1"):
                    output+=("When there is an ally attacking on the same turn whose name includes ")
                elif(CausalityRow[2]=="2"):
                    output+=("When there is an enemy whose name includes ")
                else:
                    output+=("UNKNOWN NAME TYPE")
                    if(DEVEXCEPTIONS==True):
                        raise Exception("Unknown name type")

                card_unique_info_id=searchbyid(code=CausalityRow[3],codecolumn=2,database=card_unique_info_set_relations,column=1)
                possible_names=[]
                for id in card_unique_info_id:
                    if(searchbyid(code=id,codecolumn=3,database=cards,column=1)!=None):
                        possible_names.append(searchbyid(code=id,codecolumn=3,database=cards,column=1))
                likelyName=possible_names[0][0]
                for name in possible_names[1:]:
                    likelyName=smallestCommonSubstring(likelyName,name[0]) 
                output+=likelyName

                    
                if(CausalityRow[2]!="2"):
                    output+=(" On the team")
            elif(CausalityRow[1]=="42"):
                output+=("With ")
                output+=(CausalityRow[3])
                output+=(" or more ")
                kiSphereType=binaryOrbType((CausalityRow[2]))
                for orbType in kiSphereType:
                    output+=(orbType)
                    output+=(" or ")
                output=output[:-4]
                output+=(" Ki Spheres obtained")
            elif(CausalityRow[1]=="43"):
                output+=("After evading an attack")
            elif(CausalityRow[1]=="44"):
                if(CausalityRow[2]=="0" or CausalityRow[2]=="1"):
                    output+=("Starting from the turn in which the character performs their ")
                    output+=(ordinalise(CausalityRow[3]))
                    output+=(" super attack in battle")
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
                categoryType=searchbyid(CausalityRow[3],codecolumn=0,database=card_categories,column=1)[0]

                card_unique_info_id=searchbyid(code=CausalityRow[4],codecolumn=2,database=card_unique_info_set_relations,column=1)
                possible_names=[]
                for id in card_unique_info_id:
                    if(searchbyid(code=id,codecolumn=3,database=cards,column=1)!=None):
                        possible_names.append(searchbyid(code=id,codecolumn=3,database=cards,column=1))
                likelyName=possible_names[0][0]
                for name in possible_names[1:]:
                    likelyName=smallestCommonSubstring(likelyName,name[0]) 

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
                output+=searchbyid(code=CausalityRow[2],codecolumn=1,database=dokkan_fields,column=2)[0]
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

def binaryOrbType(kiOrbType):
    output=[]
    AllTypes=True
    AllOrbs=True
    kiOrbType=int(kiOrbType)
    binarykiOrb=bin(int(kiOrbType))[2:]
    binarykiOrb=binarykiOrb.zfill(10)
    if(binarykiOrb[0:4])=="0111":
        output.append("Sweet treats")
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
    return(output)
    
def TransformationReverseUnit(card, cards, passive_skills, passive_skill_set_relations,printing=True):
    for passiveskillpiece in passive_skills:
        if passiveskillpiece[13]==card[0]:
            #is a transformation
            for passiverelation in passive_skill_set_relations:#
                if passiverelation[2]==passiveskillpiece[0]:
                    #passiveset found
                    for unit in cards:
                        if unit[21][0:-2]==passiverelation[1]:
                            return(unit)
    
def activeSkillTransformationReverseUnit(card,active_skills, card_active_skills, cards,printing=True):
    for possibleactive in active_skills:
        if(possibleactive[6]==card[0]):
            #unit comes from an active skill
            for possibleactivelink in card_active_skills:
                if possibleactivelink[2]==possibleactive[1]:
                    #link found
                    for unit in cards:
                        if unit[0]==possibleactivelink[1]:
                            return(unit)

def activeSkillTransformationUnit(card,active_skills, card_active_skills, cards,printing=True):
    for possibleactivelink in card_active_skills:
        if possibleactivelink[1]==card[0]:
            #they have an active
            for possibleactive in active_skills:
                if possibleactivelink[2]==possibleactive[1]:
                    
                    #has a transforming one, defined in possibleactive
                    for unit in cards:
                        if unit[0]==possibleactive[6]:
                            return(unit)

def dokkanreverseunit(card,card_awakening_routes, cards,printing=True):
    for awakenable_unit in card_awakening_routes:
        if awakenable_unit[1]=="CardAwakeningRoute::Dokkan":
            if(card[0])==(awakenable_unit[3]):
                for unit in cards:
                    if unit[0]==awakenable_unit[2]:
                        return(unit)
    return(None)

def qualifyAsDFETUR(card,printing=True):
    if qualifyUsable(card) and card[4]=="58" and ((card[29]=="" and card[0][0]=="1")==False):
        return(True)
    else:
        return(False)
    
def qualifyAsDFE(card, card_awakening_routes, cards, active_skills, card_active_skills,passive_skills,passive_skill_set_relations,printing=True):
    if(qualifyAsDFELR(card, card_awakening_routes, cards,active_skills,card_active_skills,passive_skills,passive_skill_set_relations) or qualifyAsDFETUR(card)):
        return(True)
    else:
        return(False)            

def qualifyAsDFELR(card, card_awakening_routes, cards,active_skills,card_active_skills,passive_skills,passive_skill_set_relations,printing=True):
    assumeFalse=False
    reversed=dokkanreverseunit(card,card_awakening_routes, cards)
    if(reversed==None):
        assumeFalse=(False)
    elif(reversed[4]=="58"):
        return(True)
        
    reversed=activeSkillTransformationReverseUnit(card,active_skills, card_active_skills, cards)
    if(reversed==None):
        assumeFalse=(False)
    else:
        return(qualifyAsDFELR(reversed, card_awakening_routes, cards,active_skills,card_active_skills,passive_skills,passive_skill_set_relations))
    
    reversed=TransformationReverseUnit(card, cards, passive_skills, passive_skill_set_relations)
    if(reversed==None):
        assumeFalse=(False)
    else:
        return(qualifyAsDFELR(reversed, card_awakening_routes, cards,active_skills,card_active_skills,passive_skills,passive_skill_set_relations))
    
    if assumeFalse==False:
        return(False)
    
def qualifyAsLR(card,printing=True):
    if qualifyUsable(card) and (getrarity(card)=="lr"):
        return(True)
    else:
        return(False)
    
def qualifyEZA(card,optimal_awakening_growths,printing=True):
    directory="data/"
    if qualifyUsable(card) and (checkeza(optimal_awakening_growths,card)):
        return(True)
    else:
        return(False)

def qualifyUsable(card,printing=True):
    if ((card[21]=="" and card[23]=="")==False) and (card[53]!="2030-12-31 23:59:59") and (card[53]!="2038-01-01 00:00:00") and (card[0][0]!="5") and (card[0][0]!="9") and (card[0][-1]=="0") and (card[22]!=""):
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
        if (card[53]!="2030-12-31 23:59:59") and (card[0][0]!="9") and (card[0][-1]=="0") and (card[22]!="") and ((("final_"+card[0]+".png") not in acquiredlist)) and (checkeza(optimal_awakening_growths,card)):
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

def createDFEWallpapers(cards, directory, card_awakening_routes, active_skills, card_active_skills, passive_skills,passive_skill_set_relations,printing=True):
    if(printing): print("Creating DFE wallpapers")
    acquiredlist = os.listdir(r'./assets/DFE wallpapers')
    leader_skills=storedatabase(directory,"leader_skills.csv")
    total=0
    for card in cards:
        if qualifyAsDFE(card, card_awakening_routes, cards, active_skills, card_active_skills,passive_skills,passive_skill_set_relations) and (((definewith0(card[0])+".png") not in acquiredlist)):
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
            if(fileType!="sticker_mask"):
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
    
def passivename(unit,passive_skills,printing=True):
    return(listtostr(searchbyid(str(int(float(unit[21]))), 0, passive_skills, 1)))

def floattoint(number,printing=True):
    if(type(number)==str):
        number=float(number)
    if number%1==0:
        return(int(number))
    else:
        return(number)

def checkeza(optimal_awakening_growths,unit,printing=True):
    for eza in optimal_awakening_growths:
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

    
def combinelinks(linklist,lvl,link_skills,link_skill_lvs,link_skill_efficacies,printing=True):
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
            linkid=searchedbyid(link, 1, link_skills, 0)[0]
            linkcode=searchedbyid(linkid, 1, link_skill_lvs, 0)[lvl-1]
            for linkdetails in link_skill_efficacies:
            
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

#used in sort function, inputs 2 strings and
#returns 0 if first word is first alphabetically
#returns 1 if second word is first alphabetically
#returns 0 if words are the same
def sortwords(word0,word1,printing=True):
    mylist=[word0,word1]
    mylist.sort()
    if mylist[0]==word0:
        return(0)
    else: return(1)
    
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

#used to get stats based on the hidden potential id of the character
def hipostats(hipoid,percentage,statwanted,printing=True):
    #all 55%
    if int(percentage)==55:
        #special
        if int(hipoid)>200:
            HP=1600
            ATK=1600
            DEF=1600
        #rank S
        elif str(hipoid)[-2]=="3":
            HP=2800
            ATK=2800
            DEF=2800
        
        #rank A
        elif str(hipoid)[-2]=="2":
            HP=2000
            ATK=2000
            DEF=2000
        
        #rank B
        elif str(hipoid)[-2]=="1":
            HP=1200
            ATK=1200
            DEF=1200
        
        
    
    #all 100%
    if int(percentage)==100:
        #rank S
        if str(hipoid)[-2]=="3":
            HP=7000
            ATK=7000
            DEF=7000
            typeextra=560
        
        #Rank A
        elif str(hipoid)[-2]=="2":
            HP=5000
            ATK=5000
            DEF=5000
            typeextra=400
        
        #Rank B
        elif str(hipoid)[-2]=="1":
            HP=3000
            ATK=3000
            DEF=3000
            typeextra=240
        
        #Deal with individual typings
        
        #SPECIAL B
        if int(hipoid)>200:
            HP=4000
            ATK=4000
            DEF=4000
        
        #SPECIAL A
        elif int(hipoid)>100:
            HP=5000
            ATK=5000
            DEF=5000
        #AGL
        elif str(hipoid)[-1]=="0":
            HP-=typeextra
            DEF+=typeextra
        
        #TEQ
        elif str(hipoid)[-1]=="1":
            HP-=typeextra
            ATK+=typeextra
            
        #INT
        
        #STR
        elif str(hipoid)[-1]=="3":
            DEF-=typeextra
            ATK+=typeextra
        
        #PHY
        elif str(hipoid)[-1]=="4":
            HP+=typeextra
            DEF-=typeextra
    if statwanted=="HP":
        return(HP)
    elif statwanted=="ATK":
        return(ATK)
    elif statwanted=="DEF":
        return(DEF)
    else:
        return("NO STAT WANTED!!!!!!!!!!!!!")
    
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
    #add if unit is TUR EZA
    #elif unit[13]=="140":
    #    return("EZA UR")
    #add if TUR
    elif unit[5]=="4":
        return("ur")
    #add if SSR
    elif unit[5]=="3":
        return("ssr")
    #add if SR
    elif unit[5]=="2":
        return("sr")
    #add if R
    elif unit[5]=="1":
        return("r")
    #add if N
    elif unit[5]=="0":
        return("n")
        
    
    return("ERROR IN GETRARITY UNIT MAX LEVEL IS",unit[13])

def swapToUnitWith0(unit,cards):
    unitId=definewith0(unit[0])
    for card in cards:
        if card[0]==unitId:
            return(card)
    return(None)

def swapToUnitWith1(unit,cards):
    unitId=definewith1(unit[0])
    for card in cards:
        if card[0]==unitId:
            return(card)
    return(None)

def getpassiveid(unit,cards, optimal_awakening_growths,passive_skill_set_relations, eza=False, printing=False):
    unitPassiveId=unit[21]
    if(eza):
        if(swapToUnitWith1(unit,cards)!=None):
            unitEZA=swapToUnitWith1(unit,cards)
        else:
            return(getpassiveid(unit,cards, optimal_awakening_growths,passive_skill_set_relations, eza=False, printing=printing))
        unitEZAGrowthId=unitEZA[16][0:-2]
        if(unitEZAGrowthId==""):
            return(getpassiveid(unit,cards, optimal_awakening_growths,passive_skill_set_relations, eza=False, printing=printing))
        unitEZAPassiveId=searchbyid(code=unitEZAGrowthId,codecolumn=1,database=optimal_awakening_growths,column=5)
        #unitEZAPassiveId=map(floattoint,unitEZAPassiveId)
        for element in unitEZAPassiveId:
            if element!= unitPassiveId:
                unitEZAPassiveId=element
        
        unitEZAPassiveList=searchbyid(code=unitEZAPassiveId[0:-2],codecolumn=1,database=passive_skill_set_relations,column=2)
        return(unitEZAPassiveList)
    else:
        unitPassiveId=unitPassiveId[0:-2]
        unitPassiveList=searchbyid(code=unitPassiveId,codecolumn=1,database=passive_skill_set_relations,column=2)
        return(unitPassiveList)

#retrieves full character name(e.g. "E.TEQ LR Nightmarish Impact Legendary Super Saiyan Broly 4016881")
def getfullname(unit,leader_skills,printing=True):
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
    temp+=(listtostr(searchedbyid(unit[22],0,leader_skills,1)))
    temp+=" "
    
    #get unit id
    temp+=(unit[0])
    temp+=" "
    
    #return variable
    return(temp)
    
def getallcategories(unitid,card_card_categories,card_categories,printing=True):
    temp1=searchedbyid(unitid, 1, card_card_categories, 2)
    categoryList=[]
    if temp1!=None:
        for x in temp1:
            categoryList.append(searchedbyid(x,0,card_categories,1)[0])
    return(categoryList)

def getalllinks(unit,link_skills,printing=True):
    linksList=[]
    for x in range(23,30):
       if(unit[x]!=""):
        code=unit[x]
        code=float(code)
        code=int(code)
        code=str(code)
        temp1=searchbyid(code,0,link_skills,1)
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

#easier way to include all (non-stat) details of a unit
def getfullabilities(unit,leader_skills,passive_skill_sets,card_active_skills,active_skill_sets,card_card_categories,card_categories,link_skills,slinks,printing=True):
    #create empty string
    temp=""
    temp+=(getfullname(unit,leader_skills))
    
    #new line
    temp+=("\n")
    
    #print leader skill
    temp+=("Leader skill:")
    temp+=listtostr(searchedbyid(unit[22],0,leader_skills,2))    
    #new line
    
    temp+=("\n")
    #print links
    temp+=("+--------------------------------------------------+")
    temp+=("\n")
    temp+=("Links:")
    temp+=("\n")
    temp+=getalllinks(unit,link_skills,slinks,True)
    temp+=("\n")
    #print categories
    temp+=("Categories:")
    temp+=("\n")
    temp+=(getallcategories(unit[0],card_card_categories,card_categories))
    
    temp+=("+--------------------------------------------------+")
    
    temp+=("\n")
    #print passive skill
    temp+=("Passive skill:")
    temp+=listtostr((searchedbyid(unit[21],0,passive_skill_sets,1)))
    temp+=("\n")
    temp+=listtostr((searchedbyid(unit[21],0,passive_skill_sets,2)))
    temp+=("\n")
    
    temp+=("+--------------------------------------------------+")
    #print unit active skill if they have one
    if searchedbyid(unit[0],1,card_active_skills,2)!=None:
        temp+=("\n")
        temp+=("Active skill: ")
        
        #print active skill name
        temp+=listtostr((searchedbyid(listtostr(searchedbyid(unit[0],1,card_active_skills,2)),0,active_skill_sets,1)))
        temp+=("\n")
        
        #print active skill condition
        temp+=listtostr((searchedbyid(listtostr(searchedbyid(unit[0],1,card_active_skills,2)),0,active_skill_sets,3)))
        temp+=("\n")
        
        #print active skill effect
        temp+=listtostr((searchedbyid(listtostr(searchedbyid(unit[0],1,card_active_skills,2)),0,active_skill_sets,2)))
        temp+=("\n")
    if(printing): print(Style.RESET_ALL,end="")
    return(temp)

def getstatsnohipo(unit,printing=True):
    
    temp=""
    #template
    temp+=("Stats   |Base    |Max  lvl")
    temp+=("\n")
    
    #HP
    temp+=("HP      |")
    #base 
    temp+=(unit[6].ljust(8))
    temp+=("|")
    #Max lvl
    temp+=(unit[7].ljust(8))
    temp+=("\n")
    
    #ATK
    temp+=("ATK     |")
    #base 
    temp+=(unit[8].ljust(8))
    temp+=("|")
    #Max lvl
    temp+=(unit[9].ljust(8))
    temp+=("\n")
    
    #DEF
    temp+=("DEF     |")
    #base 
    temp+=(unit[10].ljust(8))
    temp+=("|")
    #Max lvl
    temp+=(unit[11].ljust(8))
    temp+=("\n")
    
    return(temp)

def ezastat(minlvl,maxlvl,printing=True):
    minlvl=int(minlvl)
    maxlvl=int(maxlvl)
    return(round(((maxlvl-minlvl)*0.4839)+maxlvl))

def getstatswithhipo(unit,eza,printing=True):
    temp=""
    
    temp+="Stats   |"
    #only add base if EZA'd
    if eza==False:
        temp+="Base    |"
    
    #template
    temp+=("Max  lvl|Max  55%|Max 100%")
    temp+=("\n")
    #HP
    temp+=("HP      |")
    #for non eza'd unit
    if eza==False:
        #base 
        temp+=(unit[6].ljust(8))
        temp+=("|")
        #Max lvl
        temp+=(unit[7].ljust(8))
        temp+=("|")
        #Max 55%
        temp+=(str(int(unit[7])+hipostats(unit[52],55,"HP")).ljust(8))
        temp+=("|")
        #Max 100%
        temp+=(str(int(unit[7])+hipostats(unit[52],100,"HP")).ljust(8))
        temp+=("\n")

    #for unit post'EZA
    elif eza==True:
        #Max lvl
        temp+=(str(ezastat(unit[6],unit[7])).ljust(8))
        temp+=("|")
        #Max 55%
        temp+=(str(int(ezastat(unit[6],unit[7]))+hipostats(unit[52],55,"HP")).ljust(8))
        temp+=("|")
        #Max 100%
        temp+=(str(int(ezastat(unit[6],unit[7]))+hipostats(unit[52],100,"HP")).ljust(8))
        temp+=("\n")

    #ATK
    temp+=("ATK     |")
    
    if eza==False:
        #base 
        temp+=(unit[8].ljust(8))
        temp+=("|")
        
        #Max lvl
        temp+=(unit[9].ljust(8))
        temp+=("|")
    
        #Max 55%
        temp+=(str(int(unit[9])+hipostats(unit[52],55,"ATK")).ljust(8))
        temp+=("|")
        #Max 100%
        temp+=(str(int(unit[9])+hipostats(unit[52],100,"ATK")).ljust(8))
        temp+=("\n")
        
    elif eza==True:
        #Max lvl
        temp+=(str(ezastat(unit[8],unit[9])).ljust(8))
        temp+=("|")
        #Max 55%
        temp+=(str(int(ezastat(unit[8],unit[9]))+hipostats(unit[52],55,"ATK")).ljust(8))
        temp+=("|")
        #Max 100%
        temp+=(str(int(ezastat(unit[8],unit[9]))+hipostats(unit[52],100,"ATK")).ljust(8))
        temp+=("\n")

    #DEF
    temp+=("DEF     |")
    if eza==False:
        #base 
        temp+=(unit[10].ljust(8))
        temp+=("|")
        #Max lvl
        temp+=(unit[11].ljust(8))
        temp+=("|")
        #Max 55%
        temp+=(str(int(unit[11])+hipostats(unit[52],55,"DEF")).ljust(8))
        temp+=("|")
        #Max 100%
        temp+=(str(int(unit[11])+hipostats(unit[52],100,"DEF")).ljust(8))
        
    elif eza==True:
        #Max lvl
        temp+=(str(ezastat(unit[10],unit[11])).ljust(8))
        temp+=("|")
        #Max 55%
        temp+=(str(int(ezastat(unit[10],unit[11]))+hipostats(unit[52],55,"DEF")).ljust(8))
        temp+=("|")
        #Max 100%
        temp+=(str(int(ezastat(unit[10],unit[11]))+hipostats(unit[52],100,"DEF")).ljust(8))
        temp+=("\n")
    
    return(temp)