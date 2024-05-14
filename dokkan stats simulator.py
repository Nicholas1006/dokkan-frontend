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

unitid="1023191"
eza=False
DEVEXCEPTIONS=False
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
#passive skill set id is mainunit[21]
#passive=(passivename(mainunit,passive_skills))
#passiveIdList=getpassiveid(mainunit,cards,optimal_awakening_growths,passive_skill_set_relations,eza)
#print(passive)

for unit in cardsToCheck:
    unitCount+=1
    passiveIdList=getpassiveid(unit,cards,optimal_awakening_growths,passive_skill_set_relations,eza)
    if (passiveIdList!=None and qualifyUsable(unit)):
        for passiveskill in passive_skills[1:]:
            if (passiveskill[0] in passiveIdList):
                
                if(passiveskill[8]=="0"):
                    BuffType=("Raw stats Increase")
                    BuffPrefix="+"
                    BuffSuffix=""

                elif(passiveskill[8]=="1"):
                    BuffType=("Raw stats Decrease")
                    BuffPrefix="-"
                    BuffSuffix=""

                elif(passiveskill[8]=="2"):
                    BuffType=("Percentage Increase") 
                    BuffPrefix="+"
                    BuffSuffix="%"

                elif(passiveskill[8]=="3"):
                    BuffType=("Percentage Decrease")
                    BuffPrefix="-"
                    BuffSuffix="%"
                else:
                    print("UNKNOWN STAT INCREASE type",end=" ")
                    if(DEVEXCEPTIONS==True):
                            raise Exception("Unknown stat increase type")
                

                if passiveskill[11]!="100":
                    print(passiveskill[11],"% chance of",end=" ")

                TargetCategory=None
                if(passiveskill[6]!="0"):
                    TargetRow=searchbycolumn(source_entry=passiveskill[6],destination_csv=sub_target_types,search_column=1)[0]
                    TargetCategory=CategoryExtractor(TargetRow[3],card_categories=card_categories)

                externalTarget=True
                if(passiveskill[5]=="1"):
                    #print("Own",end=" ")
                    externalTarget=False
                elif(passiveskill[5]=="2"):
                    print("All allies",end=" ")
                elif(passiveskill[5]=="3"):
                    print("Enemy",end=" ")
                elif(passiveskill[5]=="4"):
                    print("All enemies",end=" ")
                elif(passiveskill[5]=="12"):
                    print("Super class allies",end=" ")
                elif(passiveskill[5]=="13"):
                    print("Extreme class allies",end=" ")
                elif(passiveskill[5]=="14"):
                    print("Super class enemies",end=" ")
                elif(passiveskill[5]=="15"):
                    print("Extreme class enemies",end=" ")
                elif(passiveskill[5]=="16"):
                    print("All allies(self excluded)",end=" ")
                else:
                    print("UNKNOWN TARGET",passiveskill[5],end=" ")
                    if(DEVEXCEPTIONS==True):
                        raise Exception("UNKNOWN TARGET")
                if(externalTarget and TargetCategory!=None):
                    print("in the",TargetCategory,"Category",end=" ")



                if passiveskill[4]=="1":
                    print("ATK",BuffPrefix,passiveskill[13],BuffSuffix,end=" ")
                elif passiveskill[4]=="2":
                    print("DEF",BuffPrefix,passiveskill[13],BuffSuffix,end=" ")
                elif passiveskill[4]=="3":
                    if passiveskill[13]==passiveskill[14]:
                        print("ATK & DEF",BuffPrefix,passiveskill[13],BuffSuffix,end=" ")
                    else:
                        print("ATK",BuffPrefix,passiveskill[13],BuffSuffix,"DEF",BuffPrefix,passiveskill[14],BuffSuffix,end=" ")
                elif passiveskill[4]=="4":
                    print("Heals", passiveskill[13], "HP",end=" ")
                elif passiveskill[4]=="5":
                    print("ki",BuffPrefix,passiveskill[13],end=" ")
                elif passiveskill[4]=="9":
                    print("stun all enemies", end=" ")
                elif passiveskill[4]=="13":
                    print("Reduces damage recieved by", 100-int(passiveskill[13]),"%", end=" ")
                elif passiveskill[4]=="16":
                    typing=extractAllyTyping(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)
                    print(typing,"type allies ATK",BuffPrefix,passiveskill[14],BuffSuffix,end=" ")
                elif passiveskill[4]=="17":
                    typing=extractAllyTyping(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)
                    print(typing,"type allies DEF",BuffPrefix,passiveskill[14],BuffSuffix,end=" ")
                elif passiveskill[4]=="18":
                    typing=extractAllyTyping(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)
                    print(typing,"type allies ATK and DEF",BuffPrefix,passiveskill[14],BuffSuffix,end=" ")
                elif passiveskill[4]=="20":
                    typing=extractAllyTyping(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)
                    print(typing,"type allies ki",BuffPrefix,passiveskill[14],end=" ")
                elif passiveskill[4]=="24":
                    print("disables enemy guard")
                elif passiveskill[4]=="28":
                    print("Recover",passiveskill[13], "% of damage dealt as health",end=" ")
                elif passiveskill[4]=="38":
                    print("High chance of massively raising ATK for 1 turn")
                elif passiveskill[4]=="47":
                    print("敵にガードされない/Not guarded by the enemy")
                elif passiveskill[4]=="48":
                    print("Seals",end=" ")
                elif passiveskill[4]=="50":
                    print("Immune to negative effects",end=" ")
                elif passiveskill[4]=="51":
                    type1=KiOrbType(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)
                    type2=KiOrbType(passiveskill[14],DEVEXCEPTIONS=DEVEXCEPTIONS)
                    print("change" ,type1, "ki sphere to", type2 ,"ki sphere",end=" ")
                elif passiveskill[4]=="52":
                    print("survive K.O attacks",end=" ")
                elif passiveskill[4]=="53":
                    print("DEF reduced to 0",end=" ")
                elif passiveskill[4]=="59":
                    print("ATK",BuffPrefix,passiveskill[13],BuffSuffix,"ki sphere",end=" ")
                elif passiveskill[4]=="60":
                    print("DEF",BuffPrefix,passiveskill[13],BuffSuffix,"ki sphere",end=" ")
                elif passiveskill[4]=="61":
                    if passiveskill[13]==passiveskill[14]:
                        print("ATK & DEF +",passiveskill[13]," per ki sphere obtained",end=" ")
                    else:
                        print("ATK +",passiveskill[13], "and DEF +",passiveskill[14],"per ki sphere",end=" ")
                elif passiveskill[4]=="64":
                    print("ATK +",passiveskill[14]," per", end=" ")
                    typing=KiOrbType(passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS)
                    print(typing,"ki sphere obtained",end=" ")
                elif passiveskill[4]=="65":
                    print("ATK & DEF +70%; plus an additional ATK +15% and DEF +10% per TEQ Ki Sphere obtained(TEQ #17)",end=" ")
                elif passiveskill[4]=="66":
                    print("ATK and DEF up equal amount per (specific) type ki sphere",end=" ")
                elif passiveskill[4]=="67":
                    print("Randomly changes ki sphere of a certain type",end=" ")
                    if(passiveskill[13]=="15"):
                        type1="PHY"
                    elif(passiveskill[13]=="23"):
                        type1="STR"
                    elif(passiveskill[13]=="27"):
                        type1="INT"
                    elif(passiveskill[13]=="29"):
                        type1="TEQ"
                    elif(passiveskill[13]=="30"):
                        type1="INT"
                    elif(passiveskill[13]=="31"):
                        type1="ANY?"
                    else:
                        type1=("Unknown ki sphere type")
                        if(DEVEXCEPTIONS==True):
                            raise Exception("Unknown ki sphere type")

                    if(passiveskill[14]=="4"):
                        type2="INT"
                    elif(passiveskill[14]=="16"):
                        type2="PHY"
                    elif(passiveskill[14]=="32"):
                        type2="rainbow"
                    else:
                        type2=("unknown ki sphere type")
                        if(DEVEXCEPTIONS==True):
                            raise Exception("Unknown ki sphere type")
                    
                    print("(",type1,"excluded) to",type2,"ki spheres", end=" ")
                    
                elif passiveskill[4]=="68":
                    if(passiveskill[13]=="4"):
                        print("HP",BuffPrefix,passiveskill[15],BuffSuffix,"per",KiOrbType(passiveskill[14]) ,"ki sphere obtained",end=" ")
                    elif(passiveskill[13]=="32"):
                        #buffs per rainbow ki sphere
                        if(passiveskill[14]=="1"):
                            print("ATK",BuffPrefix,passiveskill[15],BuffSuffix," per rainbow ki sphere obtained",end=" ")
                        elif(passiveskill[14]=="4"):
                            print("Chance of performing a critical hit +",passiveskill[15]," per rainbow ki sphere obtained",end=" ")
                        else:
                            print("UNKNOWN BUFF")
                            if(DEVEXCEPTIONS==True):
                                raise Exception("Unknown buff")
                    elif(passiveskill[13]=="63"):
                        if(passiveskill[14]=="1"):
                            print("ATK",BuffPrefix,passiveskill[15],BuffSuffix," per ki sphere obtained",end=" ")
                        elif(passiveskill[14]=="3"):
                            print("DEF",BuffPrefix,passiveskill[15],BuffSuffix," per ki sphere obtained",end=" ")
                        elif(passiveskill[14]=="4"):
                            print("Chance of performing a critical hit",BuffPrefix,passiveskill[15],BuffSuffix," per ki sphere obtained",end=" ")
                        else:
                            print("UNKNOWN BUFF")
                            if(DEVEXCEPTIONS==True):
                                raise Exception("Unknown buff")
                    elif(passiveskill[13]=="448"):
                        if(passiveskill[14]=="2"):
                            print("Recovers",BuffPrefix,passiveskill[15],BuffSuffix,"HP per sweet treat obtained",end=" ")
                        else:
                            print("UNKNOWN BUFF")
                            if(DEVEXCEPTIONS==True):
                                raise Exception("Unknown buff")
                    else:
                        print("UNKNOWN huh?",passiveskill[13],end=" ")
                        if(DEVEXCEPTIONS==True):
                            raise Exception("UNKNOWN huh?")
                elif passiveskill[4]=="69":
                    print("Changes all ki spheres to a certain type",end=" ")
                elif passiveskill[4]=="71":
                    print("The more HP remaining when the character attacks for the 1st time in a turn, the greater the additional ATK boost received within the turn (up to ")
                    print(passiveskill[14],end=" ")
                    print(")",end=" ")
                elif passiveskill[4]=="72":
                    print("The more HP remaining when the character receives an attack for the 1st time in a turn, the greater the additional DEF boost received within the turn (up to ",passiveskill[14],")",end=" ")
                elif passiveskill[4]=="73":
                    print("Raises ATK and DEF based on more HP",end=" ")
                elif passiveskill[4]=="76":
                    print("effective against all",end=" ")
                elif passiveskill[4]=="78":
                    print("Guard",end=" ")
                elif passiveskill[4]=="79":
                    print("Giant form/rage",end=" ")
                elif passiveskill[4]=="80":
                    print("Counter without dodge",end=" ")
                elif passiveskill[4]=="81":
                    print("Launches an additional attack with a",passiveskill[15],"% chance of becoming a super attack",end=" ")
                elif passiveskill[4]=="82":
                    print(extractClassType(classTypeNumber=passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS),"Type & DEF",BuffPrefix,passiveskill[14],BuffSuffix,end=" ")
                elif passiveskill[4]=="83":
                    print(extractClassType(classTypeNumber=passiveskill[13],DEVEXCEPTIONS=DEVEXCEPTIONS),"Type Ki",BuffPrefix,passiveskill[14],BuffSuffix,end=" ")
                elif passiveskill[4]=="90":
                    print(passiveskill[13],"% chance to crit",end=" ")
                elif passiveskill[4]=="91":
                    print(passiveskill[13], "% chance to dodge",end=" ")
                elif passiveskill[4]=="92":
                    print("Attacks guaranteed to hit",end=" ")
                elif passiveskill[4]=="95":
                    print("Dodge and counter",end=" ")
                elif passiveskill[4]=="96":
                    if(passiveskill[13]=="4"):
                        kiSphereType=("INT")
                    elif(passiveskill[13]=="32"):
                        kiSphereType=("Rainbow")
                    elif(passiveskill[13]=="63"):
                        kiSphereType=("Any")
                    else:
                        print("Unknown ki sphere type",passiveskill[13],end=" ")
                        if(DEVEXCEPTIONS==True):
                            raise Exception("Unknown ki sphere type")

                    print("plus an additional",passiveskill[14], "ki per",kiSphereType ,"ki sphere obtained",end=" ")
                    
                elif passiveskill[4]=="97":
                    print("nullification")
                elif passiveskill[4]=="98":
                    if(passiveskill[15]=="0"):
                        print("ATK",BuffPrefix,end=" ")
                    elif(passiveskill[15]=="1"):
                        print("DEF",BuffPrefix,end=" ")
                    elif(passiveskill[15]=="2"):
                        print("Chance to perform a critical hit + ",end=" ")
                    elif(passiveskill[15]=="3"):
                        print("DR",BuffPrefix,end=" ")
                    elif(passiveskill[15]=="4"):
                        print("Reduces damage recieved for 1 turn by", end=" ")
                    elif(passiveskill[15]=="5"):
                        print("Ki",BuffPrefix,end=" ")
                    else:
                        print("UNKNOWN STAT INCREASE",end=" ")
                        if(DEVEXCEPTIONS==True):
                            raise Exception("Unknown stat increase")
                    print(passiveskill[13],"up to",passiveskill[14],end=" ")
                elif passiveskill[4]=="101":
                    print("Forsees enemy super attack",end=" ")
                elif passiveskill[4]=="103":
                    name=searchbyid(code=passiveskill[13],codecolumn=0,database=cards,column=1,printing=False)[0]
                    print("Transforms into",name,end=" ")
                    if(passiveskill[14]!="0"):
                        print("Starting from the",ordinalise(int(passiveskill[14])+1),"turn from the start of battle",end=" ")
                elif passiveskill[4]=="109":
                    print("revive",end=" ")
                elif passiveskill[4]=="110":
                    print("nullification with condition e.g. gogeta has to ultra super first, str gohan has to dodge first",end=" ")
                    if(passiveskill[13]=="2"):
                        print("and countering with",end=" ")
                elif(passiveskill[4]=="114"):
                    print("HELD BY STANDBY UUB, POSSIBLY DAMAGE REDUCTION PER KI SPHERE",end=" ")
                elif passiveskill[4]=="119":
                    print("Nullifies",end=" ")
                    if(passiveskill[13]=="0"):
                        print("Unarmed Super Attacks directed at this character",end=" ")
                else:
                    print("UNKNOWN EFFECT",passiveskill[4],end=" ")
                    if(DEVEXCEPTIONS==True):
                            raise Exception("Unknown effect")
                    

                

                
                
                

                if (passiveskill[9]!="99" and (passiveskill[10]=="1" or passiveskill[9]!="1")) :
                    print("for",passiveskill[9], "turns", end=" ")



                if passiveskill[3]=="1":
                    print("At the start of turn",end=" ")
                elif passiveskill[3]=="3":
                    print("when attacking",end=" ")
                elif passiveskill[3]=="4":
                    print("When performing a super attack",end=" ")
                elif passiveskill[3]=="5":
                    print("When attacking the enemy",end=" ")
                elif passiveskill[3]=="6":
                    print("When being hit",end=" ")
                elif passiveskill[3]=="7":
                    print("When attack recieved",end=" ")
                elif passiveskill[3]=="9":
                    print("at the end of the turn",end=" ")
                elif passiveskill[3]=="11":
                    print("after all units select their ki spheres",end=" ")
                elif passiveskill[3]=="14":
                    print("Which each final blow delivered",end=" ")
                elif passiveskill[3]=="15":
                    print("With X amount of ki spheres",end=" ")
                else:
                    print("UNKNOWN TRIGGER",end=" ")
                    if(DEVEXCEPTIONS==True):
                            raise Exception("Unknown trigger")

                

                if(causalityExtractor(passiveskill[12])!=[]):
                    causalityCondition=logicalCausalityExtractor(passiveskill[12])
                    causalityCondition=CausalityLogicalExtractor(unit,causalityCondition,card_categories,skill_causalities,cards,card_unique_info_set_relations,DEVEXCEPTIONS=DEVEXCEPTIONS)
                    print(causalityCondition,end=" ")

                    
                                

                if(passiveskill[10]=="1"):
                    print("Once only", end=" ")
                    
                
                
                print(";")
                print("")
