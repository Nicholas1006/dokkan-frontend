import csv
from colorama import Fore, Style
import requests
import os
from PIL import Image
import time

def KiOrbType(kiOrbNumber):
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
    else:
        output="UNKNOWN"
    return(output)

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
        return(result)
    
def CausalityLogicalExtractor(causality,card_categories,skill_causalities,printing=True,DEVEXCEPTIONS=False):
    temp=causality.split('|')
    result=""
    for x in temp:
        result+=(causalityLogicFinder(x,card_categories,skill_causalities,printing=True,DEVEXCEPTIONS=DEVEXCEPTIONS))
        result+=(" or ")
    result=result[:-4]
    return(result)

def causalityLogicFinder(causalityCondition,card_categories,skill_causalities,printing=True,DEVEXCEPTIONS=False):
    output=""
    for row in skill_causalities:
        if row[0] == causalityCondition:
            CausalityRow=row

            if(CausalityRow[1]=="1"):
                output+=("When HP is")
                output+=(CausalityRow[2])
                output+=( "or more")
            elif(CausalityRow[1]=="2"):
                output+=("When HP is ")
                output+=(CausalityRow[2])
                output+=("or less")
            elif(CausalityRow[1]=="3"):
                output+=("When ki is")
                output+=str(int(CausalityRow[2])//33)
                output+=("or more")
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
                output+=("When attack recieved")
            elif(CausalityRow[1]=="30"):
                output+=("When guard is activated")
            elif(CausalityRow[1]=="34"):
                output+=("When there are no")
                output+=(searchbyid(CausalityRow[3],codecolumn=0,database=card_categories,column=1)[0])
                output+=( "category enemies")
            elif(CausalityRow[1]=="42"):
                output+=("With",CausalityRow[3], "or more ")
                if(CausalityRow[2]=="63"):
                    output+=("STR ki spheres obtained")
                elif(CausalityRow[2]=="31"):
                    output+=("INT ki spheres obtained")
                else:
                    output+=("UNKNOWN KI SPHERE TYPE")
                    if(DEVEXCEPTIONS==True):
                        raise Exception("Unknown ki sphere type")
            elif(CausalityRow[1]=="46"):
                output+=("Where there is an extreme class enemy")
            elif(CausalityRow[1]=="48"):
                output+=("When the enemy is hit by the characters ultra super attack")
            elif(CausalityRow[1]=="49"):
                output+=("LR UUB, Nullifies Unarmed Super Attacks directed at the character")
            elif(CausalityRow[1]=="51"):
                print("Held by LR UUB, Reduces damage received by 10% per Type Ki Sphere obtained and guards all attacks with 3 or more Type Ki Spheres obtained for 1 turn from the character's entry turn")
            else:
                output+=("UNKNOWN CAUSALITY CONDITION")
                if(DEVEXCEPTIONS==True):
                    raise Exception("Unknown causality condition")
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
    if (card[53]!="2030-12-31 23:59:59") and (card[53]!="2038-01-01 00:00:00") and (card[0][0]!="5") and (card[0][0]!="9") and (card[0][-1]=="0") and (card[22]!=""):
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
    

#this function takes in a piece of data
#checks within the destincation_csv along the search_column
#once it finds one that matches it will return that row's entry on the destincation_column
def searchbycolumn(source_entry, destination_csv, search_column, destination_column,printing=True):
    temp=[]
    for x in destination_csv:
        if source_entry==x[search_column]:
            temp.append(x[destination_column])

def searchbyid(code, codecolumn, database, column,printing=True):
    temp=[]
    for x in database:
        if code==x[codecolumn]:
            temp.append(x[column])
    if temp==[]:
        return(None)
    else:
        return(temp)
    
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
        
def listlist(mylist,printing=True):
    temp=""
    for x in mylist:
        temp+=(str(mylist.index(x)+1))
        temp+=(".")
        temp+=(x)
        temp+=("\n")
    return(temp)
#ultralist is a list consisting of other lists
#slot is the list value that is used across all lists to sort the individual lists
def sortultralist(ultralist,slot,reverse,printing=True):
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

def swapToUnitWith1(unit,cards):
    unitId=definewith1(unit[0])
    for card in cards:
        if card[0]==unitId:
            return(card)

def map(function, mylist):
    temp=[]
    if(mylist!=None):
        for element in mylist:
            temp.append(function(element))
    return(temp)


def getpassiveid(unit,cards, optimal_awakening_growths,passive_skill_set_relations, eza=False, printing=False):
    unitPassiveId=unit[21]
    if(eza):
        unitEZA=swapToUnitWith1(unit,cards)
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
    temp2=[]
    if temp1!=None:
        for x in temp1:
            temp2.append(searchedbyid(x,0,card_categories,1))
    return(temp2)

def getalllinks(unit,link_skills,slinks,showabilities,printing=True):
    temp1=""
    for x in range(23,30):
        temp1+=listtostr(searchedbyid(unit[x],0,link_skills,1))
        if showabilities==True:
            for link in slinks:
                if link[0]==listtostr(searchedbyid(unit[x],0,link_skills,1)):
                    temp1+=(": lvl1 = ")
                    temp1+=(link[1][0])
                    temp1+=(" : lvl10 = ")
                    temp1+=(link[1][9])
        temp1+="\n"
    return(temp1)
    
    
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