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
#unitid=input("What is the unit id?")
unitid="1019591"
eza=True
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

        if passiveskill[4]=="0":
            print("状態異常にならない/does not become abnormal")
        elif passiveskill[4]=="1":
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
            print("change type ki sphere to type ki sphere",end=" ")
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
            print("ATK per (specific) type ki sphere",end=" ")
        elif passiveskill[4]=="65":
            print("ATK & DEF +70%; plus an additional ATK +15% and DEF +10% per TEQ Ki Sphere obtained(TEQ #17)",end=" ")
        elif passiveskill[4]=="66":
            print("ATK and DEF up equal amount per (specific) type ki sphere",end=" ")
        elif passiveskill[4]=="67":
            print("changes ki sphere of a certain type to rainbow",end=" ")
        elif passiveskill[4]=="68":
            print("(randomly changes ki spheres from a random type to 1 type) or (unique effects per ki sphere condition e.g. recover hp ")
            print("reduces damage recieved by", passiveskill[15], "per ki sphere obtained", end=" ")
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
                print("KI+ ",end=" ")
            elif(passiveskill[15]=="3"):
                print("DR+",end=" ")
            print(passiveskill[13],"up to",passiveskill[14])
        elif passiveskill[4]=="101":
            print("Forsees enemy super attack")
        elif passiveskill[4]=="103":
            print("Transforms")
        elif passiveskill[4]=="109":
            print("revive")
        elif passiveskill[4]=="110":
            print("nullification with condition e.g. gogeta has to ultra super first, str gohan has to dodge first")
            if(passiveskill[13]=="2"):
                print("Unarmed Super Attacks directed at this character")
        elif(passiveskill[4]=="114"):
            print("HELD BY STANDBY UUB, POSSIBLY DAMAGE REDUCTION PER KI SPHERE")
        elif passiveskill[4]=="119":
            print("Nullifies")
            if(passiveskill[13]=="0"):
                print("Unarmed Super Attacks directed at this character")
        else:
            print("UNKNOWN EFFECT",passiveskill[4],end=" ")
            

        if (passiveskill[10]=="1" or passiveskill[9]!="1") :
            print("for",passiveskill[9], "turns", end=" ")


        if passiveskill[3]=="1":
            print("At the start of turn",end=" ")
        elif passiveskill[3]=="2":
            print("a")
        elif passiveskill[3]=="3":
            print("when attacking an extreme type enemy",end=" ")
        elif passiveskill[3]=="4":
            print("When performing a super attack",end=" ")
        elif passiveskill[3]=="5":
            print("When attacking the enemy",end=" ")
        elif passiveskill[3]=="6":
            print("When being hit",end=" ")
        elif passiveskill[3]=="7":
            print("When attack recieved",end=" ")
        elif passiveskill[3]=="9":
            print("deliver the final blow for the effect on the next attack",end=" ")
        elif passiveskill[3]=="11":
            print("High chance to launch up to 2 additional attacks/stats when ki is something or more",end=" ")
        elif passiveskill[3]=="14":
            print("Which each final blow delivered",end=" ")
        elif passiveskill[3]=="15":
            print("With X amount of ki spheres",end=" ")
        else:
            print("UNKNOWN TRIGGER",end=" ")

        if(causalityExtractor(passiveskill[12])!=[]):
            causalityCondition=causalityExtractor(passiveskill[12])
            for row in skill_causalities:
                if row[0] in causalityCondition:
                    CausalityRow=row

                    if(CausalityRow[1]=="1"):
                        print("When HP is", CausalityRow[2], "or more", end=" ")
                    elif(CausalityRow[1]=="2"):
                        print("When HP is ", CausalityRow[2], "or less", end=" ")
                    elif(CausalityRow[1]=="3"):
                        print("When ki is", int(CausalityRow[2])//33, "or more",end=" ")
                    elif(CausalityRow[1]=="24"):
                        print("When attack recieved",end=" ")
                    elif(CausalityRow[1]=="30"):
                        print("When guard is activated",end=" ")
                    elif(CausalityRow[1]=="34"):
                        print("When there are no", searchbyid(CausalityRow[3],codecolumn=0,database=card_categories,column=1)[0], "category enemies", end=" ")
                    elif(CausalityRow[1]=="42"):
                        print("With",CausalityRow[3], "or more ")
                        if(CausalityRow[2]=="63"):
                            print("STR ki spheres obtained",end=" ")
                        elif(CausalityRow[2]=="31"):
                            print("INT ki spheres obtained",end=" ")
                        else:
                            print("UNKNOWN KI SPHERE TYPE",end=" ")
                    elif(CausalityRow[1]=="46"):
                        print("Where there is an extreme class enemy", end=" ")
                    elif(CausalityRow[1]=="48"):
                        print("When the enemy is hit by the characters ultra super attack",end=" ")
                    elif(CausalityRow[1]=="49"):
                        print("LR UUB, Nullifies Unarmed Super Attacks directed at the character")
                    elif(CausalityRow[1]=="51"):
                        print("Held by LR UUB, Reduces damage received by 10% per Type Ki Sphere obtained and guards all attacks with 3 or more Type Ki Spheres obtained for 1 turn from the character's entry turn")
                    else:
                        print("UNKNOWN CAUSALITY CONDITION",CausalityRow,end=" ")
            
        if(passiveskill[8]=="0"):
            print("RAW STATS INCREASE",end=" ")

        elif(passiveskill[8]=="1"):
            print("Only 5 characters have this, IDK what it does",end=" ")

        elif(passiveskill[8]=="2"):
            print("PERCENTAGE INCREASE",end=" ") 

        elif(passiveskill[8]=="3"):
            print("IDK",end=" ")
        else:
            print("UNKNOWN STAT INCREASE",end=" ")
        
        print(";")
        print("")