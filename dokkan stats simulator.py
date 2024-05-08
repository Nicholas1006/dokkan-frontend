from dokkanfunctions import *

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

unitid="4019601"
eza=True
DEVEXCEPTIONS=False


if unitid[-1]=="1":
    unitid=unitid[0:-1]+"0"
for unit in cards:
    if unit[0]==unitid:
        mainunit=unit


#passive skill set id is mainunit[21]
passive=(passivename(mainunit,passive_skills))
passiveIdList=getpassiveid(mainunit,cards,optimal_awakening_growths,passive_skill_set_relations,eza)
#print(passive)


for passiveskill in passive_skills:
    if passiveskill[0] in passiveIdList:
    #if True:

        if passiveskill[11]!="100":
            print(passiveskill[11],"% chance of",end=" ")

        if passiveskill[4]=="1":
            print("ATK +",passiveskill[13],end=" ")
        elif passiveskill[4]=="2":
            print("DEF +",passiveskill[13],end=" ")
        elif passiveskill[4]=="3":
            if passiveskill[13]==passiveskill[14]:
                print("ATK & DEF +",passiveskill[13],end=" ")
            else:
                print("ATK+",passiveskill[13],"DEF +",passiveskill[14],passiveskill[12],end=" ")
        elif passiveskill[4]=="4":
            print("Heals", passiveskill[13], "HP",end=" ")
        elif passiveskill[4]=="5":
            print("ki +",passiveskill[13],end=" ")
        elif passiveskill[4]=="7":
            print("戦闘終了後の獲得経験値が20%UP/20% increase in experience points earned after battle")
        elif passiveskill[4]=="9":
            print("change to stun all enemies")
        elif passiveskill[4]=="13":
            print("Reduces damage recieved by", 100-int(passiveskill[13]),"%", end=" ")
        elif passiveskill[4]=="16":
            print("certain type enemy ATK change")
        elif passiveskill[4]=="17":
            print("Certain type ally DEF and Ki up")
        elif passiveskill[4]=="18":
            print("Certain type allies ATK and DEF up")
        elif passiveskill[4]=="20":
            print("Certain type allies ki up")
        elif passiveskill[4]=="24":
            print("disables enemy guard")
        elif passiveskill[4]=="28":
            print("Recover percentage of damage dealt as health")
        elif passiveskill[4]=="38":
            print("High chance of massively raising ATK for 1 turn")
        elif passiveskill[4]=="47":
            print("敵にガードされない/Not guarded by the enemy")
        elif passiveskill[4]=="48":
            print("Seals",end=" ")
        elif passiveskill[4]=="50":
            print("Immune to negative effects",end=" ")
        elif passiveskill[4]=="51":
            type1=KiOrbType(passiveskill[13])
            if(type1=="UNKNOWN"):
                print("UNKNOWN TYPE",end=" ")
                if(DEVEXCEPTIONS==True):
                    raise Exception("Unknown type")
                
            type2=KiOrbType(passiveskill[14])
            if(type2=="UNKNOWN"):
                print("UNKNOWN TYPE",end=" ")
                if(DEVEXCEPTIONS==True):
                    raise Exception("Unknown type")
            print("change" ,type1, "ki sphere to", type2 ,"ki sphere",end=" ")
        elif passiveskill[4]=="52":
            print("survive K.O attacks",end=" ")
        elif passiveskill[4]=="53":
            print("With a chance[1] to reduce enemy's DEF to 0",end=" ")
        elif passiveskill[4]=="59":
            print("ATK per ki sphere",end=" ")
        elif passiveskill[4]=="60":
            print("DEF per ki sphere",end=" ")
        elif passiveskill[4]=="61":
            if passiveskill[13]==passiveskill[14]:
                print("ATK & DEF +",passiveskill[13]," per ki sphere obtained",end=" ")
            else:
                print("ATK +",passiveskill[13], "and DEF +",passiveskill[14],"per ki sphere",end=" ")
        elif passiveskill[4]=="64":
            print("ATK +",passiveskill[14]," per", end=" ")
            if(passiveskill[13]=="2"):
                print("INT",end=" ")
            elif(passiveskill[13]=="4"):
                print("PHY", end="")
            else:
                print("UNKNOWN TYPE",passiveskill[13],end=" ")
                if(DEVEXCEPTIONS==True):
                    raise Exception("Unknown type")
            print(" type ki sphere",end=" ")
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
            else:
                type1=("Unknown ki sphere type")

            if(passiveskill[14]=="4"):
                type2="INT"
            elif(passiveskill[14]=="16"):
                type2="PHY"
            elif(passiveskill[14]=="32"):
                type2="rainbow"
            else:
                type2=("unknown ki sphere type")
            
            print("(",type1,"excluded) to",type2,"ki spheres", end=" ")
            
        elif passiveskill[4]=="68":
            if(passiveskill[13]=="32"):
                #buffs per rainbow ki sphere
                if(passiveskill[14]=="1"):
                    print("ATK +",passiveskill[15]," per rainbow ki sphere obtained",end=" ")
                elif(passiveskill[14]=="4"):
                    print("Chance of performing a critical hit +",passiveskill[15]," per rainbow ki sphere obtained",end=" ")
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
            print("Raises ATK and DEF based on less HP",end=" ")
        elif passiveskill[4]=="72":
            print("Changes DEF based on HP",end=" ")
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
            print("additional with a",passiveskill[15],"% chance of becoming a super attack",end=" ")
        elif passiveskill[4]=="82":
            print("Held by 50% supports",end=" ")
        elif passiveskill[4]=="83":
            print("Held by 50% supports",end=" ")
        elif passiveskill[4]=="90":
            print(passiveskill[13],"% chance to crit",end=" ")
        elif passiveskill[4]=="91":
            print(passiveskill[13], "% chance to dodge",end=" ")
        elif passiveskill[4]=="92":
            print("Attacks guaranteed to hit",end=" ")
        elif passiveskill[4]=="95":
            print("Dodge and counter",end=" ")
        elif passiveskill[4]=="96":
            print("plus an additional",passiveskill[14], "ki per ki sphere obtained",end=" ")
            if(passiveskill[13]=="32"):
                print("Rainbow", end=" ")
        elif passiveskill[4]=="97":
            print("nullification")
        elif passiveskill[4]=="98":
            if(passiveskill[15]=="0"):
                print("ATK+",end=" ")
            elif(passiveskill[15]=="1"):
                print("DEF+",end=" ")
            elif(passiveskill[15]=="2"):
                print("Chance to perform a critical hit + ",end=" ")
            elif(passiveskill[15]=="3"):
                print("DR+",end=" ")
            elif(passiveskill[15]=="4"):
                print("Reduces damage recieved for 1 turn by", end=" ")
            elif(passiveskill[15]=="5"):
                print("Ki+",end="  ")
            else:
                print("UNKNOWN STAT INCREASE",end=" ")
                if(DEVEXCEPTIONS==True):
                    raise Exception("Unknown stat increase")
            print(passiveskill[13],"up to",passiveskill[14],end=" ")
        elif passiveskill[4]=="101":
            print("Forsees enemy super attack",end=" ")
        elif passiveskill[4]=="103":
            print("Transforms",end=" ")
        elif passiveskill[4]=="109":
            print("revive",end=" ")
        elif passiveskill[4]=="110":
            print("nullification with condition e.g. gogeta has to ultra super first, str gohan has to dodge first",end=" ")
            if(passiveskill[13]=="2"):
                print("Unarmed Super Attacks directed at this character",end=" ")
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
            if("|" in passiveskill[12]):
                causalityCondition=logicalCausalityExtractor(passiveskill[12])
                causalityCondition=CausalityLogicalExtractor(causalityCondition,card_categories,skill_causalities)
                print(causalityCondition,end=" ")

            else:
                causalityCondition=causalityExtractor(passiveskill[12])
                for row in skill_causalities:
                    if row[0] in causalityCondition:
                        CausalityRow=row

                        if(CausalityRow[1]=="1"):
                            print("When HP is", CausalityRow[2], "or more", end=" ")
                        elif(CausalityRow[1]=="2"):
                            print("When HP is ", CausalityRow[2], "or less", end=" ")
                        elif(CausalityRow[1]=="3"):
                            if(qualifyAsLR(card=mainunit)):
                                print("When ki is", int(CausalityRow[2])//33, "or more",end=" ")
                            else:
                                print("When ki is", int(CausalityRow[2])//25, "or more",end=" ")
                        elif(CausalityRow[1]=="5"):
                            print("Starting from the", int(CausalityRow[2])+1, "turn from the start of battle", end=" ")
                        elif(CausalityRow[1]=="19"):
                            if(CausalityRow[2]=="0"):
                                print("As the 1st attacker in the turn",end=" ")
                            elif(CausalityRow[2]=="1"):
                                print("As the 2nd attacker in the turn",end=" ")
                            elif(CausalityRow[2]=="2"):
                                print("As the 3rd attacker in the turn",end=" ")
                            else:
                                print("UNKNOWN ATTACK POSITION",end=" ")
                                if(DEVEXCEPTIONS==True):
                                    raise Exception("Unknown attack position")

                        elif(CausalityRow[1]=="24"):
                            print("When attack recieved",end=" ")
                        elif(CausalityRow[1]=="30"):
                            print("When guard is activated",end=" ")
                        elif(CausalityRow[1]=="34"):
                            if(CausalityRow[2]=="0"):
                                target="allies on the team"
                            elif(CausalityRow[2]=="1"):
                                target="enemies"
                            elif(CausalityRow[2]=="2"):
                                target="allies on the same turn"

                            categoryType=searchbyid(CausalityRow[3],codecolumn=0,database=card_categories,column=1)[0]

                            if(CausalityRow[4]=="0"):
                                print("When there are no", categoryType, "category", target, end=" ")
                            else:
                                print("When there are",CausalityRow[4],"or more", categoryType, "category", target, end=" ")

                        elif(CausalityRow[1]=="42"):
                            print("With",CausalityRow[3], "or more ")
                            if(CausalityRow[2]=="63"):
                                print("INT ki spheres obtained",end=" ")
                            elif(CausalityRow[2]=="31"):
                                print("INT ki spheres obtained",end=" ")
                            else:
                                print("UNKNOWN KI SPHERE TYPE",end=" ")
                                if(DEVEXCEPTIONS==True):
                                    raise Exception("Unknown ki sphere type")
                        elif(CausalityRow[1]=="40"):
                            print("With each super attack performed within the turn",end=" ")
                        elif(CausalityRow[1]=="46"):
                            print("Where there is an extreme class enemy", end=" ")
                        elif(CausalityRow[1]=="48"):
                            print("When the enemy is hit by the characters ultra super attack",end=" ")
                        elif(CausalityRow[1]=="49"):
                            print("LR UUB, Nullifies Unarmed Super Attacks directed at the character")
                        elif(CausalityRow[1]=="51"):
                            print("Held by LR UUB, Reduces damage received by 10% per Type Ki Sphere obtained and guards all attacks with 3 or more Type Ki Spheres obtained for 1 turn from the character's entry turn")
                        else:
                            print("UNKNOWN CAUSALITY CONDITION",end=" ")
                            if(DEVEXCEPTIONS==True):
                                raise Exception("Unknown causality condition")
            
        if(passiveskill[8]=="0"):
            print("RAW STATS INCREASE",end=" ")

        elif(passiveskill[8]=="1"):
            print("Only 5 characters have this, IDK what it does",end=" ")

        elif(passiveskill[8]=="2"):
            print("PERCENTAGE INCREASE",end=" ") 

        elif(passiveskill[8]=="3"):
            print("IDK",end=" ")
        else:
            print("UNKNOWN STAT INCREASE type",end=" ")
            if(DEVEXCEPTIONS==True):
                    raise Exception("Unknown stat increase type")
        
        print(";")
        print("")