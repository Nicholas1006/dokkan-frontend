import { unitDisplay } from "./unitDisplay.js";
import {extractDigitsFromString,
       arraysHaveOverlap,
       getFirstInDictionary,
       calculateAdditionalChance,
       LightenColor,
       isEmptyDictionary,
       updateQueryStringParameter,
       splitTextByWords,
       advantageCalculator,
       typeToInt,
       classToInt
 } from "./commonFunctions.js";
let baseDomain=window.location.origin;

class kiCircleClass{
    constructor(passiveLineKey,CausalityLogic,performedChance,superChance,critChance){
        this.attack=0;
        this.defense=0;
        this.damageReduction=0;
        this.dodgeChance=0;
        this.guard=false;

        this.CausalityLogic=CausalityLogic;
        this.attackPerformed=false;
        this.Ki=0;
        this.displayedKi=0;
        if(performedChance==100 || passiveLineKey=="0" ){
            this.attackPerformed=true
        }
        this.passiveLineKey=passiveLineKey;
        this.superChance=superChance
        this.performedChance=performedChance;
        this.critChance=critChance;
        this.attackStat=0;
        this.displayedAttackStat=0;
        this.imageUrl = currentJson["Resource ID"];
        this.superPerformed=false
        if(this.superChance==100){
            this.superPerformed=true
        }
        this.superBuffs={"ATK": 0, "DEF": 0, "Enemy ATK": 0, "Enemy DEF": 0, "Crit": 0, "Evasion": 0};
        this.activeAttackMultiplier=1;
        
        
        this.KiCircle=document.createElement("div");
        this.KiCircle.id="ki-circle";
        this.KiCircle.name=passiveLineKey;
        let queryCount=0;
        if(this.critChance!=0){
            queryCount++
        }
        if(this.superChance!=0 && this.superChance!=100 && this.passiveLineKey!="0" && this.passiveLineKey!="Active"){
            queryCount++
        }
        if(this.performedChance!=0 && this.performedChance!=100 && this.passiveLineKey!="0" && this.passiveLineKey!="Active"){
            queryCount++
        }
        if(queryCount==0){
            this.KiCircle.style.gridTemplateRows="230px"+(" 35px".repeat(queryCount));
        }
        let setHeight=45.6%+(queryCount*6.9);
        this.KiCircle.style.height=setHeight+"%";

        let circleBase=document.createElement("div");
        circleBase.id="circle-base";
        if(currentJson.Type=="AGL"){
            circleBase.style.backgroundImage = "url('/dbManagement/DokkanFiles/global/en/layout/en/image/ingame/battle/chara_icon/ing_type_gauge_base_00.png')";
        }
        else if(currentJson.Type=="TEQ"){
            circleBase.style.backgroundImage = "url('/dbManagement/DokkanFiles/global/en/layout/en/image/ingame/battle/chara_icon/ing_type_gauge_base_01.png')";
        }
        else if(currentJson.Type=="INT"){
            circleBase.style.backgroundImage = "url('/dbManagement/DokkanFiles/global/en/layout/en/image/ingame/battle/chara_icon/ing_type_gauge_base_02.png')";
        }
        else if(currentJson.Type=="STR"){
            circleBase.style.backgroundImage = "url('/dbManagement/DokkanFiles/global/en/layout/en/image/ingame/battle/chara_icon/ing_type_gauge_base_03.png')";
        }
        else if(currentJson.Type=="PHY"){
            circleBase.style.backgroundImage = "url('/dbManagement/DokkanFiles/global/en/layout/en/image/ingame/battle/chara_icon/ing_type_gauge_base_04.png')";
        }
        circleBase.style.backgroundSize = "100% 100%";
        circleBase.style.backgroundPosition = "center";
        circleBase.style.backgroundRepeat = "no-repeat";
        circleBase.style.zIndex = "0";
        this.KiCircle.appendChild(circleBase);
        if(currentJson["Rarity"]=="lr"){
            this.maxKi=24;
        }
        else{
            this.maxKi=12;
        }

        
        

        let unitImage = document.createElement("div");
        unitImage.className = "ki-unit-image";
        this.KiCircle.appendChild(unitImage);
        unitImage.id="unit-circle-image";
        let assetID=currentJson["ID"].slice(0, -1)+ "0";
        unitImage.style.backgroundImage = "url('/dbManagement/DokkanFiles/global/en/character/card/" +assetID+"/card_"+assetID+"_circle.png')";
        unitImage.style.backgroundSize = "100% 100%";
        unitImage.style.backgroundPosition = "center";
        unitImage.style.backgroundRepeat = "no-repeat";
        unitImage.style.zIndex = "1";

        
        this.segments=[]
        for (let i = 0; i < 12; i++) {
            let circleSegment = document.createElement("div");
            this.segments.push(circleSegment);
            this.KiCircle.appendChild(circleSegment);
            circleSegment.className = "ki-circle-segment";
            
            let rotateOffset=(15 + (i * 30));
            let rotateOffsetRadians=rotateOffset*(Math.PI/180);
            let xOffset = Math.sin(rotateOffsetRadians)*81 + 59;
            let yOffset = (1-Math.cos(rotateOffsetRadians))*74-24;
            circleSegment.style.transform += "translate(" + xOffset + "%, " + yOffset + "%) "
            
            circleSegment.style.transform += "rotateZ("+(rotateOffset) + "deg)";
            circleSegment.style.zIndex = "2";
        }
        if(this.maxKi==24){
            for (let i=12; i<24; i++){
                let circleSegment = document.createElement("div");
                this.segments.push(circleSegment);
                this.KiCircle.appendChild(circleSegment);
                circleSegment.className = "ki-circle-segment";

                let rotateOffset=(15 + (i * 30));
                let rotateOffsetRadians=(rotateOffset)*(Math.PI/180);
                let xOffset = Math.sin(rotateOffsetRadians)*83 + 59;
                let yOffset = (1-Math.cos(rotateOffsetRadians))*77-27;
                circleSegment.style.transform += "translate(" + xOffset + "%, " + yOffset + "%) "
                circleSegment.style.transform += "rotateZ("+(rotateOffset) + "deg)";
                circleSegment.style.transform += "scaleY(1.3) scaleX(1.1)";



    //            circleSegment.style.transform = "rotateY(-45deg) scaleY(1.3) scaleX(1.1) translate(50px, -10px)";
                //set the circle segment to the front of the circle
                circleSegment.style.zIndex = "1";
                //add the circle segment to the circle
            }
        }

        this.damageText=document.createElement("div");
        this.KiCircle.appendChild(this.damageText);
        this.damageText.className="ki-damage-text";
        this.damageText.id="ki-damage-text";
        this.damageText.style.width="300px"
        this.damageText.style.height="50px"
        this.damageText.style.zIndex = "4";
        

        this.superAttackName=document.createElement("div");
        this.superAttackName.className="super-attack-name";
        this.superAttackName.style.backgroundImage = "url('/dbManagement/DokkanFiles/global/en/character/card/"+this.imageUrl+"/en/card_"+this.imageUrl+"_sp_name.png')";
        this.superAttackName.style.display="none";
        this.KiCircle.appendChild(this.superAttackName);

        this.superAttackWords=document.createElement("div");
        this.superAttackWords.className="super-attack-words";
        this.superAttackWords.classList.add("ultra-super")
        this.KiCircle.appendChild(this.superAttackWords);

        this.superAttackWords.image=document.createElement("img");
        this.superAttackWords.appendChild(this.superAttackWords.image);

        let querySlotsTaken=0;
        this.critChanceQuery=document.createElement("button");
        this.critChanceQuery.id="crit-chance-query";
        this.critChanceQuery.innerHTML="Does the "+this.critChance+"% chance to crit activate?"
        this.critChanceQuery.passiveLineKey=this.passiveLineKey
        this.critChanceQuery.style.cursor="pointer";
        this.critChanceQuery.style.zIndex="6";
        this.critChanceQuery.parentClass=this;
        if(this.critChance==0){
            this.critChanceQuery.style.background="#FF5C35";
            this.critChanceQuery.style.display="none"
            this.critPerformed=false
        }
        else if(this.critChance<100){
            if(Math.random()<this.critChance/100){
                this.critChanceQuery.style.background="#FF5C35";
                this.critChanceQuery.style.display="block"
                this.critPerformed=false
                this.critChanceQuery.style.gridRow=querySlotsTaken+2;
                querySlotsTaken++;
            }
            else{
                this.critChanceQuery.style.background="#00FF00"
                this.critChanceQuery.style.display="block"
                this.critChanceQuery.classList.add("active");
                this.critPerformed=true
                this.critChanceQuery.style.gridRow=querySlotsTaken+2;
                querySlotsTaken++;
            }
        }
        else if(this.critChance==100){
            this.critChanceQuery.style.background="#00FF00"
            this.critChanceQuery.style.display="block"
            this.critChanceQuery.classList.add("active");
            this.critChanceQuery.style.pointerEvents="none";
            this.critChanceQuery.style.cursor="default";
            this.critPerformed=true
            this.critChanceQuery.gridRow=querySlotsTaken+2;
            querySlotsTaken++;
        }

        this.critChanceQuery.addEventListener(
            "click", function(){
                if(this.classList.contains("active")){
                    this.parentClass.toggleCritPerformed(false);
                }
                else{
                    this.parentClass.toggleCritPerformed(true);
                }
                updatePassiveStats();
            }
        )
        this.KiCircle.appendChild(this.critChanceQuery);

        this.superChanceQuery=document.createElement("button");
        this.superChanceQuery.id="super-chance-query";
        this.superChanceQuery.innerHTML="Does the "+this.superChance+"% chance this is a super attack activate?"
        this.superChanceQuery.passiveLineKey=this.passiveLineKey
        if(this.superChance==0){
            this.superChanceQuery.style.background="#FF5C35";
            this.superChanceQuery.style.display="none"
            this.superPerformed=false
        }
        else if(this.superChance<100){
            if(Math.random() < this.superChance/100){
                this.superChanceQuery.style.display="block"
                this.superChanceQuery.style.background="#FF5C35";
                this.superPerformed=false;
                this.superChanceQuery.style.gridRow=querySlotsTaken+2;
                querySlotsTaken++;
            }
            else{
                this.superChanceQuery.style.display="block"
                this.superChanceQuery.style.background="#00FF00"
                this.superChanceQuery.classList.add("active");
                this.superPerformed=true
                this.superChanceQuery.style.gridRow=querySlotsTaken+2;
                querySlotsTaken++;
            }
        }
        else if(this.superChance==100 && this.passiveLineKey!="0" && this.passiveLineKey!="active"){
            this.superChanceQuery.style.background="#00FF00"
            this.superChanceQuery.style.display="none"
            this.superChanceQuery.classList.add("active");
            this.superPerformed=true
        }
        else if(this.passiveLineKey=="0" || this.passiveLineKey=="active"){
            this.superChanceQuery.style.display="none";
        }
        
        this.superChanceQuery.style.cursor="pointer"
        this.superChanceQuery.style.zIndex = "6";
        this.superChanceQuery.parentClass=this
        this.superChanceQuery.addEventListener(
            'click', function(){
                if(this.classList.contains("active")){
                    this.parentClass.toggleSuperPerformed(false)
                }
                else{
                    this.parentClass.toggleSuperPerformed(true)
                }
                updatePassiveStats();
            }
        )
        this.KiCircle.appendChild(this.superChanceQuery);
        

        this.performedChanceQuery=document.createElement("button");
        this.performedChanceQuery.id="performed-chance-query";
        this.performedChanceQuery.innerHTML="Does the "+this.performedChance+"% chance to attack activate?"
        this.performedChanceQuery.passiveLineKey=this.passiveLineKey
        if(this.performedChance==0){
            this.performedChanceQuery.style.background="#FF5C35";
            this.performedChanceQuery.style.display="none"
            this.superPerformed=false
            this.attackPerformed=false
        }
        else if(this.performedChance<100){
            if(Math.random() < this.performedChance/100){
                this.performedChanceQuery.style.background="#FF5C35";
                this.performedChanceQuery.style.display="block"
                this.attackPerformed=false;
                this.performedChanceQuery.style.gridRow=querySlotsTaken+2;
                querySlotsTaken++;
            }
            else{
                this.performedChanceQuery.style.background="#00FF00";
                this.performedChanceQuery.style.display="block"
                this.attackPerformed=true
                this.performedChanceQuery.classList.add("active");
                this.performedChanceQuery.style.gridRow=querySlotsTaken+2;
                querySlotsTaken++;
            }            
        }
        else if(this.performedChance==100 && this.passiveLineKey!="0" && this.passiveLineKey!="active"){
            this.performedChanceQuery.style.background="#00FF00";
            this.performedChanceQuery.style.display="none"
            this.performedChanceQuery.classList.add("active");
            this.attackPerformed=true
        }
        else if(this.passiveLineKey=="0" || this.passiveLineKey=="active"){
            this.performedChanceQuery.style.display="none";
        }
            
        this.performedChanceQuery.style.cursor="pointer"
        this.performedChanceQuery.style.zIndex = "6";
        this.performedChanceQuery.parentClass=this
        this.performedChanceQuery.addEventListener('click', function(){
            if(this.classList.contains("active")){
                this.parentClass.toggleAttackPerformed(false)
            }
            else{
                this.parentClass.toggleAttackPerformed(true)
            }
            updatePassiveStats();
        })
        this.KiCircle.appendChild(this.performedChanceQuery);
        //this.performedChanceQuery.style.transform = "translate(0px, 200px)";

    }

    getElement(){
        return this.KiCircle;
    }

    updateFromBuffs(buffs,superBuffs){
        this.superAttackMultiplier=1
        this.superAttackAssetID=-1;
        this.superBuffs={...superBuffs};
        this.damageReduction=buffs["Damage Reduction"];
        this.dodgeChance=buffs["Dodge Chance"];
        this.critChance=buffs["Crit Chance"];
        if(activeMultipliers["Dodge"]!=null){
            this.dodgeChance+=(activeMultipliers["Dodge"]*100);
        }
        this.guard=buffs["Guard"];


        if(this.passiveLineKey=="0"){
            this.Ki=0;
            for (const kiSourcesKey in kiSources){
                this.Ki+=parseInt(kiSources[kiSourcesKey]);
            }
            this.Ki+=buffs["Ki"];
            this.superAttackID=findSuperAttackID(this.Ki);
            if(this.superAttackID==-1){
                this.superPerformed=false;
            }
            else{
                this.superPerformed=true;
            }
        }
        else if(this.passiveLineKey=="Active"){
            if(currentJson["Rarity"]=="lr"){
                this.Ki=24;
            }
            else{
                this.Ki=12;
            }
            this.superAttackID="Active";
        }
        else{
            if(this.superPerformed){
                this.Ki=currentJson["SuperMinKi"];
                this.superAttackID=currentJson["AdditionalSuperID"];
            }
            else{
                this.Ki=0;
                for (const kiSourcesKey in kiSources){
                    this.Ki+=parseInt(kiSources[kiSourcesKey]);
                }
                this.Ki+=buffs["Ki"];
                this.superAttackID="-1";
            }
        }
        this.updateKi(this.Ki);
        if(this.superAttackID!="-1" && this.superAttackID!="Active"){
            const superAttack=currentJson["Super Attack"][this.superAttackID]
            this.superAttackMultiplier=superAttack["Multiplier"]/100;
            this.superAttackMultiplier+=skillOrbBuffs["SuperBoost"]*0.05;
            this.superAttackAssetID=superAttack["special_name_no"];
            if("SpecialBonus" in superAttack){
                if(superAttack["SpecialBonus"]["Type"]=="SA multiplier increase"){
                    this.superBuffs["ATK"]+=superAttack["SpecialBonus"]["Amount"]/100
                }
            }
            if("superBuffs" in superAttack){
                for (const superBuffKey of Object.keys(superAttack["superBuffs"])){
                    if (!(superAttack["superBuffs"][superBuffKey]["Target"].includes("excluded") || superAttack["superBuffs"][superBuffKey]["Target"].includes("Enem"))){
                        this.superBuffs["ATK"]+=parseInt(superAttack["superBuffs"][superBuffKey]["ATK"]||0);
                        this.superBuffs["DEF"]+=parseInt(superAttack["superBuffs"][superBuffKey]["DEF"]||0);
                        this.superBuffs["Crit Chance"]+=parseInt(superAttack["superBuffs"][superBuffKey]["Crit Chance"]||0);
                    }
                }
            }
            this.superAttackPerformed=superAttack;
        }

        else if(this.superAttackID=="Active"){
            const active = currentJson["Active Skill"];
            this.activeAttackMultiplier=active["Attack"]["Multiplier"]/100;
            this.activeAttackMultiplier+=skillOrbBuffs["SuperBoost"]*0.05;
            this.superPerformed=true;
        }
        
        this.superAttackMultiplier+=this.superBuffs["ATK"]/100;
        

        this.attack=baseStats["ATK"];

        this.attack*=(1+(leaderBuffs["ATK"]/100));

        this.attack*=(1+(buffs["SOT ATK %"]+supportBuffs["ATK"])/100)
        this.attack+=buffs["SOT ATK flat"]
        
        this.attack*=1;//Item boost
        
        this.attack*=(1+linkBuffs["ATK"]/100);
        if(this.passiveLineKey=="Active"){
            this.attack*=(this.activeAttackMultiplier+(1+activeMultipliers["ATK"]));
        }
        else{
            this.attack*=(1+activeMultipliers["ATK"]);//Active boost
        }
        this.attack*=(currentJson["Ki Multiplier"][this.Ki]/100);
        
        this.attack*=(1+buffs["MOT ATK %"]/100)
        this.attack+=buffs["MOT ATK flat"]

        this.attack*=this.superAttackMultiplier;

        this.attack*=(1+domainBuffs["ATK"]/100);
        if(this.passiveLineKey=="Finish"){
            this.attack*=(this.finishBuffs);
        }

        this.critChance=(buffs["Crit Chance"]+superBuffs["Crit"])/100;
        this.critChance=(1-this.critChance)*(1-(skillOrbBuffs["Crit"]/100));
        this.critChance=1-this.critChance;
        this.changeCritChance(this.critChance);



        this.defense=baseStats["DEF"];

        this.defense*=(1+(leaderBuffs["DEF"]/100));

        this.defense*=(1+(buffs["SOT DEF %"]+supportBuffs["DEF"])/100)
        this.defense+=buffs["SOT DEF flat"]
        
        this.defense*=1;//Item boost
        
        this.defense*=1+linkBuffs["DEF"]/100;
        if(this.passiveLineKey=="Active"){
            this.defense*=(this.activeAttackMultiplier+(activeMultipliers["DEF"]));
        }
        else{
            this.defense*=(1+activeMultipliers["DEF"]);//Active boost
        }
        
        this.defense*=(1+buffs["MOT DEF %"]/100)
        this.defense+=buffs["MOT DEF flat"]

        this.defense*=(1+(this.superBuffs["DEF"] / 100));

        this.defense*=(1+domainBuffs["DEF"]/100);
        if(this.passiveLineKey=="Finish"){
            this.defense*=(this.finishBuffs);
        }
        this.defense=Math.floor(this.defense);

        
        this.updateValue(this.attack,this.superPerformed);
        this.updateSuperAttack(this.superAttackID)

        return(0)
    }

    updateDefensiveFromBuffs(buffs,superBuffs){
        this.superBuffs={...superBuffs};
        this.damageReduction=buffs["Damage Reduction"];
        this.dodgeChance=buffs["Dodge Chance"];
        if(activeMultipliers["Dodge"]!=null){
            this.dodgeChance+=(activeMultipliers["Dodge"]*100);
        }
        this.guard=buffs["Guard"];
        
        this.defense=baseStats["DEF"];

        this.defense*=(1+(leaderBuffs["DEF"]/100));

        this.defense*=(1+(buffs["SOT DEF %"]+supportBuffs["DEF"])/100)
        this.defense+=buffs["SOT DEF flat"]
        
        this.defense*=1;//Item boost
        
        this.defense*=1+linkBuffs["DEF"]/100;
        if(this.passiveLineKey=="Active"){
            this.defense*=(this.activeAttackMultiplier+(activeMultipliers["DEF"]));
        }
        else{
            this.defense*=(1+activeMultipliers["DEF"]);//Active boost
        }
        
        this.defense*=(1+buffs["MOT DEF %"]/100)
        this.defense+=buffs["MOT DEF flat"]

        this.defense*=(1+(this.superBuffs["DEF"] / 100));

        this.defense*=(1+domainBuffs["DEF"]/100);
        if(this.passiveLineKey=="Finish"){
            this.defense*=(this.finishBuffs);
        }
        this.defense=Math.floor(this.defense);

        return(0)
    }

    updateKiFromBuffs(buffs){
        if(this.passiveLineKey=="0"){
            this.Ki=0;
            for (const kiSourcesKey in kiSources){
                this.Ki+=parseInt(kiSources[kiSourcesKey]);
            }
            this.Ki+=buffs["Ki"];
            this.superAttackID=findSuperAttackID(this.Ki);
        }
        else if(this.passiveLineKey=="Active"){
            if(currentJson["Rarity"]=="lr"){
                this.Ki=24;
            }
            else{
                this.Ki=12;
            }
        }
        else{
            if(this.superPerformed){
                this.Ki=currentJson["SuperMinKi"];
            }
            else{
                this.Ki=0;
                for (const kiSourcesKey in kiSources){
                    this.Ki+=parseInt(kiSources[kiSourcesKey]);
                }
                this.Ki+=buffs["Ki"];
            }
        }
        this.updateKi(this.Ki);
        return(this.Ki)
    }

    updateValue(targetValue) {
        targetValue=parseInt(targetValue);
        if(targetValue=="-1"){
            this.animating=false;
            this.displayedAttackStat=-1;
            while (this.damageText.firstChild) {
                this.damageText.removeChild(this.damageText.firstChild);
            }
        }
        else if(this.displayedAttackStat==targetValue){
            return
        }
        else{
            this.animating=true;
            if(targetValue<0){
                targetValue=0
            }
            else if(targetValue>2147483648){
                targetValue=2147483648
            }
            this.attackStat = targetValue;
            const duration = 500; // duration of the animation in milliseconds
            const frameRate= 60;
            const frameDuration = 1000 / frameRate; // 60 frames per second
            const totalFrames = Math.round(duration / frameDuration);
        
            this.nextToShow = this.displayedAttackStat;
            this.increment = Math.round((targetValue - this.displayedAttackStat) / totalFrames);
        
            const animate = () => {
                this.nextToShow+=this.increment
                if((this.increment>0 && this.nextToShow>this.attackStat) || (this.increment<0 && this.nextToShow<this.attackStat)){
                    this.nextToShow=this.attackStat;
                    this.displayValueQuickly(this.attackStat);
                }
                //if its going to go past the value
                else if((this.nextToShow>this.attackStat && this.displayedAttackStat<this.attackStat) || (this.nextToShow<this.attackStat && this.displayedAttackStat>this.attackStat)){
                    this.nextToShow=this.attackStat;
                    this.displayValueQuickly(this.attackStat);
                }
                //if it is going the right way and still has progress
                else if(this.nextToShow==this.attackStat){
                    this.displayValueQuickly(this.nextToShow);
                    return 0;
                }
                else{
                    this.displayValueQuickly(this.nextToShow);
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        }
    }

    displayValueQuickly(value){
        if(value<1){
            value=0
        }
        else if(value>2147483648){
            value=2147483648
        }
        else if(isNaN(value)){
            value=0;
        }
        while (this.damageText.firstChild) {
            this.damageText.removeChild(this.damageText.firstChild);
        }

        for (let char of value.toString()) {
            const numDiv = document.createElement('div');
            if(this.superPerformed){
                numDiv.className = "ki-damage-text-numDiv-red";
                numDiv.classList.add(`num-red-${char}`);
            }
            else{
                numDiv.className = "ki-damage-text-numDiv-yellow";
                numDiv.classList.add(`num-yellow-${char}`);
            }
            this.damageText.appendChild(numDiv);
        }
        this.displayedAttackStat=value
    }

    changeGridRow(rowNumber){
        this.KiCircle.style.gridRow = rowNumber;
    }
    getGridRow(){
        return this.KiCircle.style.gridRow
    }

    updateSuperAttack(superAttackID=this.superAttackID){
        if(superAttackID==-1 || superAttackID=="Active" || superAttackID=="Finish"){
            this.superAttackName.style.display="none";
            this.superAttackWords.style.display="none";
            this.damageText.style.animation="none";
        }
        else{
            this.superAttackAssetID=currentJson["Super Attack"][this.superAttackID]["special_name_no"];
            this.superAttackName.style.display="block";
            this.superAttackWords.style.display="block";
            const currentOffset=((Date.now()/1000)%5)
            this.superAttackWords.style.animation="none";
            this.damageText.style.animation="none";

            //this line causes a css reload before the animationDelays are applied
            void this.superAttackWords.offsetWidth;
            
            this.superAttackWords.style.animation="swap4off1on 5s infinite";
            this.damageText.style.animation="swap4on1off 5s infinite";
            this.superAttackWords.style.animationDelay="-"+currentOffset+"s";
            this.damageText.style.animationDelay="-"+currentOffset+"s";
            this.superAttackWords.classList.remove("super");
            this.superAttackWords.classList.remove("ultra-super");
            this.superAttackWords.classList.remove("unit-super");
            if(currentJson["Super Attack"][this.superAttackID]["superStyle"]=="Normal"){
                this.superAttackName.style.backgroundImage = "url('/dbManagement/DokkanFiles/global/en/character/card/"+this.imageUrl+"/en/card_"+this.imageUrl+"_sp_name.png')";
                this.superAttackWords.image.src="/dbManagement/DokkanFiles/global/en/ingame/battle/effect/battle_140000/en/Images_sp_atk_str-1.png"
                this.superAttackWords.classList.add("super")
            }
            else if(currentJson["Super Attack"][this.superAttackID]["superStyle"]=="Hyper"){
                this.superAttackName.style.backgroundImage = "url('/dbManagement/DokkanFiles/global/en/character/card/"+this.imageUrl+"/en/card_"+this.imageUrl+"_sp0"+this.superAttackAssetID+"_name.png')";
                this.superAttackWords.image.src="/dbManagement/DokkanFiles/global/en/ingame/battle/effect/battle_140000/en/Images_sp2_atk_str-1.png"
                this.superAttackWords.classList.add("ultra-super")
            }
            else if(currentJson["Super Attack"][this.superAttackID]["superStyle"]=="Condition"){
                this.superAttackName.style.backgroundImage = "url('/dbManagement/DokkanFiles/global/en/character/card/"+this.imageUrl+"/en/card_"+this.imageUrl+"_sp0"+this.superAttackAssetID+"_name.png')";
                this.superAttackWords.image.src="/dbManagement/DokkanFiles/global/en/condition_special/000002/special_cutin_icon_text_image.png"
                this.superAttackWords.classList.add("unit-super")
            }
        }
    }



    updateCausalityLogic(CausalityLogic){
        this.CausalityLogic=CausalityLogic
    }
    updateKi(value){
        let maxKi;
        for (const passiveSlider of document.getElementById("passive-query-container").children){
            //if the innerHTML of the next sibling starts with how much ki is there
            if(passiveSlider.nextSibling!=null){
                if(passiveSlider.nextSibling.innerHTML.startsWith("How much ki is there")){
                    passiveSlider.value=value
                    passiveSlider.nextSibling.innerHTML="How much ki is there: "+value
                }
            }
        }
        if(currentJson["Rarity"]=="lr"){
            maxKi=24;
        }
        else{
            maxKi=12;
        }
        if(value>maxKi){
            value=maxKi;
        }
        else if(value<0){
            value=0
        }
        else{
            value=value
        }
        this.Ki=value;


        for (let i = 0; i < maxKi; i++) {
            //get the current segment
            let currentSegment = this.segments[i];
            if (i < this.Ki && i+12 >= this.Ki) {
                if(i>=12){
                    currentSegment.style.zIndex = "3";
                    currentSegment.style.display="block";
                }
                if(i<2 && currentJson["Ki Circle Segments"][i+1]=="equal"){
                    currentSegment.classList.add("weaker");

                }
                else{
                    currentSegment.classList.add(currentJson["Ki Circle Segments"][i+1]);
                }
            } else {
                if(i>=12){
                    currentSegment.style.zIndex = "1";
                    currentSegment.style.display="none";
                }
                if(i<2 && currentJson["Ki Circle Segments"][i+1]=="equal"){
                    currentSegment.classList.remove("weaker");

                }
                else{
                    currentSegment.classList.remove(currentJson["Ki Circle Segments"][i+1]);
                }
            }
        }
        this.displayedKi=value
    }

    changeSuperChance(value){
        this.superChance=Math.round(value*10000)/100
        this.superChanceQuery.innerHTML="Does the "+this.superChance+"% chance this is a super attack activate?"

        this.reAlignQueries();

        if(this.superChance==0){
            if(this.superPerformed==true){
                this.superPerformed=false;
                updatePassiveStats();
            }
        }
        else if(this.superChance==100){
            if(this.superPerformed==false){
                this.superPerformed=true;
                updatePassiveStats();
            }
        }
        
    }

    toggleSuperPerformed(isActivated){
        if(isActivated){
            this.superChanceQuery.classList.add("active")
            this.superChanceQuery.style.background="#00FF00"
            this.superPerformed=true
            this.toggleAttackPerformed(true);
        }
        else{
            this.superChanceQuery.classList.remove("active")
            this.superChanceQuery.style.background="#FF5C35"
            this.superPerformed=false
        }
    }

    changePerformedChance(value){
        this.performedChance=Math.round(value*10000)/100
        this.performedChanceQuery.innerHTML="Does the "+this.performedChance+"% chance to perform an attack activate?"


        this.reAlignQueries()

        this.KiCircle.style.display="block";
        this.performedChanceQuery.style.display="block";
        if(this.performedChance==0){
            if(this.attackPerformed==true){
                this.attackPerformed=false;
                this.KiCircle.style.display="none";
                updatePassiveStats();
            }
        }
        else if(this.performedChance==100){
            if(this.attackPerformed==false){
                this.attackPerformed=true;
                this.performedChanceQuery.style.display="none";
                updatePassiveStats();
            }
        }
    }

    reAlignQueries(){
        let queryCount=0;
        if(this.critChance!=0){
            queryCount++
        }
        if(this.superChance!=0 && this.superChance!=100){
            queryCount++
        }
        if(this.performedChance!=0 && this.performedChance!=100){
            queryCount++
        }
        this.KiCircle.style.gridTemplateRows="230px"+(" 35px".repeat(queryCount));
        let setHeight=230+(queryCount*35);
        this.KiCircle.style.height=setHeight+"px";

        let querySlotsUsed=0;

        if(this.critChance==0){
            this.critChanceQuery.style.display="none";
        }
        else{
            this.critChanceQuery.style.display="block";
            this.critChanceQuery.style.gridRow=querySlotsUsed+2;
            querySlotsUsed++;
        }

        if(this.performedChance==100 || this.passiveLineKey=="0" || this.passiveLineKey=="Active"){
            this.performedChanceQuery.style.display="none";
        }
        else if(this.performedChance==0){
            this.KiCircle.style.display="none";
        }
        else{
            this.performedChanceQuery.style.display="block";    
            this.performedChanceQuery.style.gridRow=querySlotsUsed+2;
            querySlotsUsed++;
        }

        if(this.superChance==0 || this.superChance==100 || this.passiveLineKey=="0" || this.passiveLineKey=="Active" ){
            this.superChanceQuery.style.display="none";
        }
        else{
            this.superChanceQuery.style.display="block";
            this.superChanceQuery.style.gridRow=querySlotsUsed+2;
            querySlotsUsed++;
        }

    }

    toggleAttackPerformed(isActivated){
        if(isActivated){
            this.performedChanceQuery.classList.add("active")
            this.performedChanceQuery.style.background="#00FF00"
            this.attackPerformed=true
            if(this.superChance!=0 && this.superChance!=100){
                this.superChanceQuery.style.display="block"
            }
        }
        else{
            this.performedChanceQuery.classList.remove("active")
            this.performedChanceQuery.style.background="#FF5C35"
            this.attackPerformed=false
            this.toggleSuperPerformed(false);
        }
    }

    changeCritChance(value){
        this.critChance=Math.min(Math.round(value*10000)/100,100);
        this.critChanceQuery.innerHTML="Does the "+this.critChance+"% chance to crit activate?"

        this.reAlignQueries();

        if(this.critChance==0){
            this.toggleCritPerformed(false);
        }
        if(this.critChance==100){
            this.critChanceQuery.style.cursor="default";
            this.critChanceQuery.style.pointerEvents="none";
            this.toggleCritPerformed(true);
        }
        else{
            this.critChanceQuery.style.pointerEvents="auto";
            this.critChanceQuery.style.cursor="pointer";

        }
    }
    
    toggleCritPerformed(isActivated){
        if(isActivated){
            this.critChanceQuery.classList.add("active")
            this.critChanceQuery.style.background="#00FF00"
            this.critPerformed=true
        }
        else{
            this.critChanceQuery.classList.remove("active")
            this.critChanceQuery.style.background="#FF5C35"
            this.critPerformed=false
        }
    }

    display(thisDisplayed){
        if(thisDisplayed){
            this.KiCircle.style.display="grid";
        }
        else{
            this.KiCircle.style.display="none";
        }
    }

    iterateCausalityLogic(passiveSliderName, iterationAmount){
        for (let Causality in this.CausalityLogic){
            if(Causality==passiveSliderName){
                this.CausalityLogic[Causality]+=parseInt(iterationAmount)
            }
        }
    }

    getDefense(){
        return(this.defense);
    }

    getAttack(){
        return(this.attack);
    }

    getDodgeChance(){
        return(this.dodgeChance);
    }

    getDamageReduction(){
        return(this.damageReduction)
    }

    getGuard(){
        return(this.guard)
    }
}


class equipNodeQuery{
    constructor(variableToChange,imageLocation){
        this.selfContainer=document.createElement("div");
        this.selfContainer.id="equip-node-container";
        this.selfContainer.style.display="grid";
        this.variableToChange=variableToChange;

        let image=document.createElement("div");
        image.id="equip-node-image";
        image.style.backgroundImage="url('"+imageLocation+"')";
        this.selfContainer.appendChild(image);
        this.selfContainer.classConstruction=this;

        this.numberInput=document.createElement("input");
        this.numberInput.id="equip-node-input";
        this.numberInput.type="number";
        this.numberInput.min=0;
        this.numberInput.max=32;
        this.numberInput.value=0;
        this.numberInput.addEventListener('input', function(){
            if(this.value<0){
                this.value=0;
            }
            else if(this.value>32){
                this.value=32;  
            }
            skillOrbBuffs[variableToChange]=parseInt(this.value);
            this.parentNode.value=parseInt(this.value);
            this.parentNode.parentNode.classList.add("Edited");
            updatePassiveStats();
        })
        this.selfContainer.value=0;
        this.selfContainer.appendChild(this.numberInput);
    }
    updateValue(Value){
        skillOrbBuffs[this.variableToChange]=Value;
        this.numberInput.value=parseInt(Value);
    }

    getElement(){
        return(this.selfContainer);
    }
}

class statsContainerClass{
    constructor(startHP, startATK, startDEF){
        this.selfContainer=document.createElement("div");
        this.selfContainer.style.display="grid";
        this.selfContainer.style.gridTemplateColumns="1fr 1fr 1fr";
        this.selfContainer.classConstruction=this;
        
        this.startHP=startHP;
        this.startATK=startATK;
        this.startDEF=startDEF;

        this.queryHP=0;
        this.queryATK=0;
        this.queryDEF=0;

        this.finalHP=startHP;
        this.finalATK=startATK;
        this.finalDEF=startDEF;
        
        
        this.initialHPDisplay=document.createElement("div");
        this.initialHPDisplay.id="initial-HP-display";
        this.initialHPDisplay.style.gridRow="1";
        this.initialHPDisplay.innerHTML="HP: "+startHP+"+";
        this.selfContainer.appendChild(this.initialHPDisplay);

        this.initialATKDisplay=document.createElement("div");
        this.initialATKDisplay.id="initial-ATK-display";
        this.initialATKDisplay.style.gridRow="2";
        this.initialATKDisplay.innerHTML="ATK: "+startATK+"+";
        this.selfContainer.appendChild(this.initialATKDisplay);

        this.initialDEFDisplay=document.createElement("div");
        this.initialDEFDisplay.id="initial-DEF-display";
        this.initialDEFDisplay.style.gridRow="3";
        this.initialDEFDisplay.innerHTML="DEF: "+startDEF+"+";        
        this.selfContainer.appendChild(this.initialDEFDisplay);

        this.extraHPQuery=document.createElement("input");
        this.extraHPQuery.id="extra-HP-input";
        this.extraHPQuery.value=0;
        this.extraHPQuery.step=100;
        this.extraHPQuery.min=0;
        this.extraHPQuery.type="number";
        this.extraHPQuery.style.gridRow="1";
        this.extraHPQuery.style.gridColumn="2";
        this.extraHPQuery.addEventListener("input",function(){
            this.value=parseInt(this.value) || 0;
            this.parentNode.classConstruction.queryHP=parseInt(this.value);
            this.parentNode.classConstruction.refreshStats();
            updatePassiveStats();
        })
        this.selfContainer.appendChild(this.extraHPQuery);

        this.extraATKQuery=document.createElement("input");
        this.extraATKQuery.id="extra-ATK-input";
        this.extraATKQuery.value=0;
        this.extraATKQuery.step=100;
        this.extraATKQuery.min=0;
        this.extraATKQuery.type="number";
        this.extraATKQuery.style.gridRow="2";
        this.extraATKQuery.style.gridColumn="2";
        this.selfContainer.appendChild(this.extraATKQuery);
        this.extraATKQuery.addEventListener("input",function(){
            this.value=parseInt(this.value) || 0;
            this.parentNode.classConstruction.queryATK=parseInt(this.value);
            this.parentNode.classConstruction.refreshStats();
            updatePassiveStats();
        })

        this.extraDEFQuery=document.createElement("input");
        this.extraDEFQuery.id="extra-DEF-input";
        this.extraDEFQuery.value=0;
        this.extraDEFQuery.step=100;
        this.extraDEFQuery.min=0;
        this.extraDEFQuery.type="number";
        this.extraDEFQuery.style.gridRow="3";
        this.extraDEFQuery.style.gridColumn="2";
        this.extraDEFQuery.addEventListener("input",function(){
            this.value=parseInt(this.value) || 0;
            this.parentNode.classConstruction.queryDEF=parseInt(this.value);
            this.parentNode.classConstruction.refreshStats();
            updatePassiveStats();
        })
        this.selfContainer.appendChild(this.extraDEFQuery);

        this.finalHPDisplay=document.createElement("div");
        this.finalHPDisplay.id="final-HP-display";
        this.finalHPDisplay.style.backgroundImage="url('/dbManagement/assets/misc/potential/cha_detail_st_base_hp_textadded.png')";
        this.finalHPDisplay.style.gridRow="4";
        this.finalHPDisplay.style.gridColumn="1";
        this.finalHPDisplay.innerHTML=this.finalHP;
        this.selfContainer.appendChild(this.finalHPDisplay);

        this.finalATKDisplay=document.createElement("div");
        this.finalATKDisplay.id="final-ATK-display";
        this.finalATKDisplay.style.backgroundImage="url('/dbManagement/assets/misc/potential/cha_detail_st_base_atk_textadded.png')";
        this.finalATKDisplay.style.gridRow="4";
        this.finalATKDisplay.style.gridColumn="2";
        this.finalATKDisplay.innerHTML=this.finalATK;
        this.selfContainer.appendChild(this.finalATKDisplay);

        this.finalDEFDisplay=document.createElement("div");
        this.finalDEFDisplay.id="final-DEF-display";
        this.finalDEFDisplay.style.backgroundImage="url('/dbManagement/assets/misc/potential/cha_detail_st_base_def_textadded.png')";
        this.finalDEFDisplay.style.gridRow="4";
        this.finalDEFDisplay.style.gridColumn="3";
        this.finalDEFDisplay.innerHTML=this.finalDEF;
        this.selfContainer.appendChild(this.finalDEFDisplay);
    }

    refreshStats(){
        this.finalHP=this.startHP+this.queryHP;
        this.finalATK=this.startATK+this.queryATK;
        this.finalDEF=this.startDEF+this.queryDEF;

        this.finalHPDisplay.innerHTML=this.finalHP;
        this.finalATKDisplay.innerHTML=this.finalATK;
        this.finalDEFDisplay.innerHTML=this.finalDEF;

        baseStats["HP"]=this.finalHP;
        baseStats["ATK"]=this.finalATK;
        baseStats["DEF"]=this.finalDEF;
    }

    updateInitialHP(HP,refresh=true){
        this.startHP=HP;
        this.initialHPDisplay.innerHTML="HP: "+HP+"+";
        if(refresh){
            this.refreshStats();
        }
    }

    updateInitialATK(ATK,refresh=true){
        this.startATK=ATK;
        this.initialATKDisplay.innerHTML="ATK: "+ATK+"+";
        if(refresh){
            this.refreshStats();
        }
    }

    updateInitialDEF(DEF,refresh=true){
        this.startDEF=DEF;
        this.initialDEFDisplay.innerHTML="DEF: "+DEF+"+";
        if(refresh){
            this.refreshStats();
        }
    }

    getElement(){
        return(this.selfContainer);
    }
}

class superAttackQueryHolder{

    constructor(superAttack,maxPerTurn,maxTurns,unitID){
        this.superAttack=superAttack;
        this.selfContainer=document.createElement("div");
        this.selfContainer.style.display="grid";
        this.selfContainer.id="superAttackQueryHolder";
        for(const key of Object.keys(superAttack["superBuffs"])){
            if(superAttack["superBuffs"][key]["Duration"]!="1" && superAttack["superBuffs"][key]["Duration"]!="2"){
                let buffs=superAttack["superBuffs"][key];
                let buffHolder= new superAttackQuery(buffs,maxPerTurn,maxTurns,unitID,superAttack);
                this.selfContainer.appendChild(buffHolder.getElement());
            }
        }
    }
    getElement(){
        return this.selfContainer;
    }
}

class pictureDiv{
    constructor(textContent,insertedDivDictionary){
        this.selfContainer=document.createElement("div");
        this.selfContainer.style.display="flex";
        this.selfContainer.style.flexWrap="wrap";
        this.textContentList=splitTextByWords(textContent,Object.keys(insertedDivDictionary));
        for (const textSegment of this.textContentList){
            if(textSegment in insertedDivDictionary){
                this.selfContainer.appendChild(insertedDivDictionary[textSegment]);
                if(this[textSegment]){
                    this[textSegment].push(insertedDivDictionary[textSegment]);
                }
                else{
                    this[textSegment]=[insertedDivDictionary[textSegment]];
                }
            }
            else{
                let textDiv=document.createElement("div");
                textDiv.innerHTML=textSegment;
                this.selfContainer.appendChild(textDiv);
                
            }
        }
    }
    getElement(){
        return this.selfContainer;
    }
}

class superAttackQuery{
    constructor(buffs,maxPerTurn,maxTurns,unitID,superAttack){
        document.getElementById("super-container").style.display="grid";
        this.selfContainer=document.createElement("div");
        this.selfContainer.buffs=buffs;
        this.selfContainer.superAttack=superAttack;
        this.selfContainer.superAttackName=superAttack["superName"];
        this.selfContainer.buffsDuration=buffs["Duration"];
        this.selfContainer.nextToShow=0;
        this.selfContainer.style.display="grid";
        this.superAttackSlider = document.createElement('input');
        this.superAttackSlider.parentClass=this;
        this.superAttackSlider.value=0;
        this.superAttackQuestion = document.createElement('div');
        this.superAttackQuestion.superAttackName= this.selfContainer.superAttackName;
        this.insertedUnitDiv=new unitDisplay();

        const insertedSuperAttackDiv=document.createElement("div");
        insertedSuperAttackDiv.className="super-attack-query-question-super-attack-name";

        this.numberInput=document.createElement("input");
        this.numberInput.type="number";
        this.numberInput.min=0;
        this.numberInput.max=Math.min(Math.floor((buffs["Duration"]-1)/2),maxTurns)*maxPerTurn;
        this.numberInput.value=0;
        this.numberInput.className="super-attack-query-number-input";
        this.numberInput.parentClass=this;
        this.numberInput.addEventListener(
            'input', function(){
                if(this.value<0){
                    this.value=0;
                }
                else if(this.value>Math.min(Math.floor((buffs["Duration"]-1)/2),maxTurns)*maxPerTurn){
                    this.value=Math.min(Math.floor((buffs["Duration"]-1)/2),maxTurns)*maxPerTurn;
                }
                this.parentClass.superAttackSlider.value=parseInt(this.value);
                this.parentClass.currentValue=parseInt(this.value);
                updateSuperAttackStacks()

            }       
        );

        const replacementDictionary = {};
        replacementDictionary[unitID] = this.insertedUnitDiv.getElement();
        replacementDictionary[this.selfContainer.superAttackName] = insertedSuperAttackDiv;
        replacementDictionary["NUMBERINPUT"]=this.numberInput;
        this.superAttackQuestion.superAttackText=new pictureDiv("How many times has"+unitID+"performed "+this.selfContainer.superAttackName+" within the last "+buffs["Duration"]+" turns?NUMBERINPUT",replacementDictionary);
        this.superAttackQuestion.superAttackText.getElement().className="super-attack-query-question";
        const unitJsonPromise= getJsonPromise("/dbManagement/jsons/",unitID,".json");
        unitJsonPromise.then(
            unit => {
                this.insertedUnitDiv.setResourceID(unit["Resource ID"]);
                this.insertedUnitDiv.setClass(unit["Class"]);
                this.insertedUnitDiv.setType(unit["Type"]);
                this.insertedUnitDiv.setRarity(unit["Rarity"]);
                this.insertedUnitDiv.setUrl(baseDomain+"/cards/index.html?id="+unit["ID"]);
                this.insertedUnitDiv.setDisplayExtraInfo(false);
                this.insertedUnitDiv.setExactWidth("60px");
                this.insertedUnitDiv.setExactHeight("60px");
                this.insertedUnitDiv.setDisplay(true);

                if(this.selfContainer.superAttack.special_name_no=="0"){
                    insertedSuperAttackDiv.style.backgroundImage="url('/dbManagement/DokkanFiles/global/en/character/card/"+unit["Resource ID"]+"/en/card_"+unit["Resource ID"]+"_sp_name.png')";
                }
                else{
                    insertedSuperAttackDiv.style.backgroundImage="url('/dbManagement/DokkanFiles/global/en/character/card/"+unit["Resource ID"]+"/en/card_"+unit["Resource ID"]+"_sp0"+this.selfContainer.superAttack.special_name_no+"_name.png')"
                }

            }
        )
        this.selfContainer.appendChild(this.superAttackQuestion.superAttackText.getElement());
        this.superAttackQuestion.innerHTML = this.superAttackSlider.textContent;
        this.superAttackQuestion.style.gridRow = 1;
        this.superAttackSlider.type = "range";
        this.superAttackSlider.style.cursor = "pointer";
        this.superAttackSlider.min = 0;
        this.superAttackSlider.max=Math.min(Math.floor((buffs["Duration"]-1)/2),maxTurns)*maxPerTurn;
        this.superAttackSlider.value = 0;
        this.superAttackSlider.id="super-slider";
        this.superAttackSlider.style.gridRow = 0;
        this.selfContainer.appendChild(this.superAttackQuestion);
        this.selfContainer.appendChild(this.superAttackSlider);
        this.superAttackSlider.addEventListener('input', function(){
            this.parentClass.superAttackQuestion.superAttackText.NUMBERINPUT[0].value=parseInt(this.value);
            this.parentClass.currentValue=parseInt(this.value);
            updateSuperAttackStacks();
        });

        
    }

    getElement(){
        return this.selfContainer;
    }
}

class passiveButton{
    constructor(min, max, label, parent) {
        this.min = min;
        this.max = max;
        this.label = label;
        this.value = this.max;
        this.selfContainer = document.createElement('div');
        this.element = document.createElement('button');
        this.selfContainer.appendChild(this.element);
        this.element.classList.add('passive-button');
        this.element.innerHTML = this.label;
        this.element.value = this.value;
        this.element.style.background="#FF5C35"
        this.element.style.cursor = "pointer";
        this.element.onclick = function(){
            if(this.classList.contains('active')){
                this.classList.remove('active');
                this.style.background="#FF5C35"
            }
            else{
                this.classList.add('active');
                this.style.background="#00FF00"
            }
            updatePassiveStats()
        };
        this.updateParent(parent);
        if(
            this.label.includes("Ki Spheres have been obtained on this turn?")||
            this.label.includes("Is the Domain ")||
            this.label.startsWith("Is Ki at least ")||
            this.label.includes("Ki Spheres been obtained")||
            this.label.includes("Is a super being performed")||
            this.label.includes("Has this character performed an attack on this turn")||
            this.label.includes("Has this character been hit by a ") ||
            this.label.includes("Has this character been hit on this turn?")
            ){
                if(HIDEUNNEEDEDPASSIVE){
                    this.parent.selfContainer.style.display="none"
                }
        }
    }


    getElement(){
        return this.selfContainer;
    }

    getValue(){
        return(this.element.classList.contains('active'))
    }

    updateParent(parent){
        this.parent=parent
        this.element.parent=parent
    }
}

class passiveSlider {
    constructor(min, max, label, parent) {
        this.parent=parent
        this.selfContainer=document.createElement("div");
        this.element = document.createElement("input");
        this.elementLabel = document.createElement("label");
        this.selfContainer.appendChild(this.elementLabel);
        this.selfContainer.appendChild(this.element);
        this.label=label;
        this.min = min;
        this.max = max;
        this.value = this.min;
        this.element.type = "range";
        this.element.parent=this;
        this.element.min = this.min;
        this.element.max = this.max;
        this.element.value = this.min;
        this.element.step = 1;
        this.element.addEventListener("input", function(){
            this.parent.updateValueAndLabel();
            updateKiSphereBuffs();
        });
        
        this.elementLabel.innerHTML = this.label+": "+this.value;
        if(
            this.label.includes("How much ki is there")||
            this.label.includes("Ki Spheres have been obtained on this turn?")||
            this.label==("How many attacks has this character performed on this turn?")||
            this.label==("How many super attacks has this character performed on this turn?")
            ){
                if(HIDEUNNEEDEDPASSIVE){
                    this.parent.selfContainer.style.display="none"
                }
        }
    }

    updateValueAndLabel() {
        this.value = parseInt(this.element.value);
        this.elementLabel.innerHTML = this.label+": "+this.value;
        if(this.value==this.max){
            this.elementLabel.innerHTML+="+";
        }



    }

    getElement() {
        return this.selfContainer;
    }
}

class passiveQuery{
    constructor(type, buttonName,sliderName, min, max){
        this.selfContainer=document.createElement("div");
        this.min = min;
        this.max = max;
        this.buttonName = buttonName;
        this.sliderName = sliderName;
        this.type = type;
        this.create();
    }

    changeType(type){
        this.selfContainer.style.display=("block")
        this.type = type;
        this.create();
    }

    create(){
        while(this.selfContainer.firstChild){
            this.selfContainer.removeChild(this.selfContainer.firstChild);
        }
        if(this.type=="slider"){
            this.queryElement = new passiveSlider(this.min, this.max, this.sliderName, this);
            this.selfContainer.appendChild(this.queryElement.getElement());
        }
        else if(this.type=="button"){
            this.queryElement = new passiveButton(this.min, this.max, this.buttonName, this);
            this.selfContainer.appendChild(this.queryElement.getElement());
        }
        else{
            console.error("Error: Invalid passive query type.")
        }
    }

    getElement(){
        return this.selfContainer;
    }

    currentValue(){
        if(this.type=="button"){
            return(this.queryElement.element.classList.contains('active') )
        }
        else if(this.type=="slider"){
            return(this.queryElement.element.value)
        }
    }

    updateValue(value,runUpdatePassiveBuffs=true){
        if(this.type=="button"){
            if(value){
                this.queryElement.element.classList.add("active")
                this.queryElement.element.style.background="#00FF00"
            }
            else{
                this.queryElement.element.classList.remove("active")   
                this.queryElement.element.style.background="#FF5C35"
            }
        }
        else if(this.type=="slider"){
            this.queryElement.element.value=value
            this.queryElement.updateValueAndLabel()
        }
        if(runUpdatePassiveBuffs){
            updatePassiveStats()
        }
    }

    updateCondition(){
        this.queryElement.updateCondition();
    }
}


// CONSTANT GLOBAL VARIABLES
const HIDEUNNEEDEDPASSIVE=true;
let finishType;
let currentJson = null;
let linkData=null;
let domainData=null;
let activeAttackPerformed=false;
let finishDisplayed=false;
let finishSkillCharges=0;

let regularAttacksPerformed=true;

let isEza;
let isSeza;

let baseStats={"ATK": 0, "DEF": 0, "HP": 0};

let leaderBuffs={"HP": 400, "ATK": 400, "DEF": 400, "Ki": 6};
let superBuffs={"ATK": 0, "DEF": 0, "Enemy ATK": 0, "Enemy DEF": 0, "Crit": 0, "Evasion": 0};
let linkBuffs={"ATK":0,"DEF":0,"Enemy DEF":0,"Heal":0,"KI":0,"Damage Reduction":0,"Crit":0,"Evasion":0};
let skillOrbBuffs={"Additional":0,"Crit":0,"Evasion":0,"Attack":0,"Defense":0,"SuperBoost":0,"Recovery":0}
let domainBuffs={"ATK":0,"DEF":0,"Increased damage recieved":0}
let supportBuffs={"ATK": 0, "DEF":0, "Dodge":0, "Crit": 0}
let currentKiSphere;
let currentKiSphereAmount=3;
let rainbowKiSphereAmount=1;
let activeMultipliers={"ATK":0,"DEF":0,"Effective against all":false,"Guard":false,"Dodge Chance":0,"Crit Chance":0,"Redirect attacks to me":false};

let currentDomain="null";
let kiSources={"leader":6,"Support":0,"Links":0,"Active":0,"Domain":0,"Orbs":0};
let additionalAttacks={};
let kiCircleDictionary=[];
let passiveQueryList=[];
let passiveChanceList={};
let relevantPassiveEffects=["Ki","ATK","Heals","DEF","Guard","Disable Other Line","Dodge chance","Crit Chance","DR","Additional Attack"]

let attackRecievedType="normal";
let attackRecievedTiming="after";
let enemyClass="Super";
let enemyTyping="STR";
let enemyATK=1900000;
let enemyDEF=2000000;
let enemyDR=65;
let enemyATKThreshold=10000000;
let startingStats={};
let finalStats={};
let recievingDamageStats={};


function getJsonPromise(prefix,name,suffix) {
    return fetch(prefix + name + suffix)
      .then(response => {
          if (!response.ok) {
            if(name[6]=="0"){
                name=name.slice(0, -1)+ "1";
                updateQueryStringParameter("id",name);
                return(getJsonPromise(prefix,name,suffix))
            }
            else{
              throw new Error('Network response was not ok' + response.statusText);
            }
          }
          return response.json();
        }
      )
      .catch(error => {
          console.error('Error fetching JSON:', error);
          throw error; // Re-throw the error to propagate it to the caller
      }
    );
}




/**
  They wouldnt let me use eval in a loop so I'm doing this instead
  It just calls eval again
 */
function evaluate(expression){
    return(eval(expression));
}


function findSuperAttackID(kiAmount,causalities=null){
    //no unit super conditions
    let superAttackId="-1";
    let superMinKi=0;
    let minKiToSuperAttack=25;
    if(causalities==null){
        for (const superKey in currentJson["Super Attack"]){
            const superAttack=currentJson["Super Attack"][superKey];
            minKiToSuperAttack=Math.min(superAttack["superMinKi"],minKiToSuperAttack);
            if(parseInt(superAttack["superMinKi"])<=kiAmount && parseInt(superAttack["superMinKi"])>=parseInt(superMinKi)){
                if("superCondition" in superAttack){
                    let conditionLogic = " "+superAttack.superCondition.Logic+" ";
                    for (const causalityKey of Object.keys(superAttack.superCondition.Causalities)){
                        conditionLogic=conditionLogic.replaceAll(causalityKey,superAttack.superCondition.Causalities[causalityKey]["Button"]["Name"])
                    }
                    for(const passiveQuery of Object.values(passiveQueryList)){
                        conditionLogic=conditionLogic.replaceAll(passiveQuery.queryElement.label,passiveQuery.currentValue());
                    }
                    if(evaluate(conditionLogic)){
                        superMinKi=superAttack["superMinKi"];
                        superAttackId=superKey;
                    }
                }
                else{
                    superMinKi=superAttack["superMinKi"];
                    superAttackId=superKey;
                }
            }
        }
    }
    else{

    }
    return(superAttackId);
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};


  



function prepareCausalityLogic(CausalityLogic,KiCircleObject){
    for(const Cause of Object.keys(CausalityLogic)){
        if(Cause.startsWith("Is Ki at least")){
            CausalityLogic[Cause]=(KiCircleObject.Ki >= parseInt(extractDigitsFromString(Cause).replaceAll(" ","")));
        }
        else if(Cause=="How much ki is there on this turn?"){
            CausalityLogic[Cause]=(KiCircleObject.Ki);
        }
    }
    return(CausalityLogic)
}

function includedInSupportBuff(passiveLine){
    if(passiveLine["Target"]["Target"]=="Self"){
        return (true);
    }
    if(passiveLine["Target"]["Target"]=="Allies"){
        if("Category" in passiveLine["Target"]){
            let categoryQualified=false;
            for(const key of passiveLine["Target"]["Category"]["Included"]){
                if(currentJson["Categories"].includes(key)){
                  categoryQualified=true;
                } 
            }
            for(const key of passiveLine["Target"]["Category"]["Excluded"]){
                if(currentJson["Categories"].includes(key)){
                  categoryQualified=false;
                } 
            }
            return (categoryQualified);
        }
    }
    return(false)
}


function updatePassiveStats(){
    for(const attack of Object.values(kiCircleDictionary)){
        attack.display(false);
    }

    //MAJOR WIP
    for (const key in additionalAttacks){
        additionalAttacks[key]="Unactivated";
    }
    additionalAttacks[0]="Activated";
    kiCircleDictionary[0].changeGridRow(1);

    if(skillOrbBuffs["Additional"]!=0){
        additionalAttacks["Hidden potential"]="Offered"
    }
    
    

    let currentActivePassiveMultipliers={};
    let iteratingCausalityLogic=queriesToLogic(passiveQueryList);
    let iteratingPassiveBuffs;
    let iteratingAttackRow=2;
    let iteratingSuperAttackBuffs={...superBuffs};
    let attacksPerformed=0;
    let lastAttack="0";
    //create a list that runs through all the different timings to see which passive skills activate
    
    //Account for previously built stats
    
    //  Start of turn
    progressCausalityLogic(iteratingCausalityLogic,"Start of turn");
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Start of turn","Single activator",iteratingCausalityLogic)
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Start of turn","Disable Other Line",iteratingCausalityLogic)
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"All","Building Stat",iteratingCausalityLogic)
    
    if(activeAttackPerformed){
        const activecontainer=document.getElementById("active-container");

        
        progressCausalityLogic(iteratingCausalityLogic,"Right before super attack");
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(SOT stat)","Single activator",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(SOT stat)","Disable Other Line",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(MOT stat)","Single activator",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(MOT stat)","Disable Other Line",iteratingCausalityLogic)
        activecontainer.kiCircle.display(true);
        activecontainer.kiCircle.updateKiFromBuffs(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers),iteratingSuperAttackBuffs);
        attacksPerformed+=1;
        iteratingCausalityLogic=prepareCausalityLogic(iteratingCausalityLogic,activecontainer.kiCircle);
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(SOT stat)","Single activator",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(SOT stat)","Disable Other Line",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(MOT stat)","Single activator",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(MOT stat)","Disable Other Line",iteratingCausalityLogic)
        activecontainer.kiCircle.updateFromBuffs(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers),iteratingSuperAttackBuffs);
        iteratingSuperAttackBuffs=activecontainer.kiCircle.superBuffs;
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after attack","Single activator",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after attack","Disable Other Line",iteratingCausalityLogic)


        //      Right after attack
        progressCausalityLogic(iteratingCausalityLogic,"Right after super attack");
        iteratingPassiveBuffs =(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers));
        for (const additionalAttack of iteratingPassiveBuffs["Additional Attack"]){
            if(additionalAttacks[additionalAttack]=="Unactivated"){
                additionalAttacks[additionalAttack]="Offered";
                kiCircleDictionary[additionalAttack].display(true);
            }
        }
    }
    else if(currentJson["Active Skill"]!=null){
        if("Attack" in currentJson["Active Skill"]){
            const activecontainer=document.getElementById("active-container");
            activecontainer.kiCircle.display(false);
            activecontainer.kiCircle.updateKi(0);
            activecontainer.kiCircle.updateValue(0);
        }
    }
    //  if (an attacking active skill is performed){
        //      Right before attack(SOT stat)
        //      Right before attack(MOT stat)
        //      *record the stats at this point and save them to be displayed
        //  }
    //  When ki spheres collected
    progressCausalityLogic(iteratingCausalityLogic,"When ki spheres collected");
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"When ki spheres collected","Single activator",iteratingCausalityLogic)
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"When ki spheres collected","Disable Other Line",iteratingCausalityLogic)
    //  After all ki collected
    progressCausalityLogic(iteratingCausalityLogic,"After all ki collected");
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"After all ki collected","Single activator",iteratingCausalityLogic)
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"After all ki collected","Disable Other Line",iteratingCausalityLogic)
    if("How much ki is there on this turn?" in iteratingCausalityLogic){
        iteratingCausalityLogic["How much ki is there on this turn?"]=kiCircleDictionary[0].updateKiFromBuffs(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers),iteratingSuperAttackBuffs);
    }

    

    

    //  for(each time that an attack is recieved before we attack){
    //      Right before being hit
    if(attackRecievedTiming=="before" && attackRecievedType=="normal"){
        progressCausalityLogic(iteratingCausalityLogic,"Right before being hit by normal");
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before being hit","Single activator",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before being hit","Disable Other Line",iteratingCausalityLogic)
    }
    else if(attackRecievedTiming=="before" && attackRecievedType=="super"){
        progressCausalityLogic(iteratingCausalityLogic,"Right before being hit by super");
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before being hit","Single activator",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before being hit","Disable Other Line",iteratingCausalityLogic)
    }

    if(attackRecievedTiming=="before" && (attackRecievedType=="normal" || attackRecievedType=="super")){
        kiCircleDictionary[0].updateDefensiveFromBuffs(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers),iteratingSuperAttackBuffs);
        recievingDamageStats={};
        recievingDamageStats["Defense"]=kiCircleDictionary[0].getDefense();
        recievingDamageStats["Dodge chance"]=Math.min(kiCircleDictionary[0].getDodgeChance(),100)/100;
        recievingDamageStats["Dodge chance"]=1 - (1-(recievingDamageStats["Dodge chance"]))*(1-(skillOrbBuffs["Evasion"]/100));
        recievingDamageStats["Dodge chance"]=Math.round(recievingDamageStats["Dodge chance"]*1000)/10;
        recievingDamageStats["Damage Reduction"]= Math.min(kiCircleDictionary[0].getDamageReduction(),100);
        recievingDamageStats["Guard"]= kiCircleDictionary[0].getGuard();
        let recievingDamageStatsString="";
        recievingDamageStatsString+="DEF: "+recievingDamageStats["Defense"].toLocaleString()+"\n";
        if(recievingDamageStats["Dodge chance"]>0){
            recievingDamageStatsString+="Dodge chance: "+recievingDamageStats["Dodge chance"]+"%\n";
        }
        if(recievingDamageStats["Damage Reduction"]>0){
            recievingDamageStatsString+="Damage Reduction: "+recievingDamageStats["Damage Reduction"]+"%\n";
        }
        if(recievingDamageStats["Guard"]==true){
            recievingDamageStatsString+="Guard against all: "+"\n";
        }
    }

    if(attackRecievedTiming=="before" && attackRecievedType=="normal"){
        progressCausalityLogic(iteratingCausalityLogic,"Right after being hit by normal");
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after being hit","Single activator",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after being hit","Disable Other Line",iteratingCausalityLogic)
    }
    else if(attackRecievedTiming=="before" && attackRecievedType=="super"){
        progressCausalityLogic(iteratingCausalityLogic,"Right after being hit by super");
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after being hit","Single activator",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after being hit","Disable Other Line",iteratingCausalityLogic)
    }

    kiCircleDictionary[0].updateDefensiveFromBuffs(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers),iteratingSuperAttackBuffs);
    startingStats={};
    startingStats["Defense"]=kiCircleDictionary[0].getDefense();
    startingStats["Dodge chance"]=Math.min(kiCircleDictionary[0].getDodgeChance(),100)/100;
    startingStats["Dodge chance"]=1 - (1-(startingStats["Dodge chance"]))*(1-(skillOrbBuffs["Evasion"]/100));
    startingStats["Dodge chance"]=Math.round(startingStats["Dodge chance"]*1000)/10;
    startingStats["Damage Reduction"]= Math.min(kiCircleDictionary[0].getDamageReduction(),100);
    startingStats["Guard"]= kiCircleDictionary[0].getGuard();
    let startingStatsString="";
    startingStatsString+="DEF: "+startingStats["Defense"].toLocaleString()+"\n";
    if(startingStats["Dodge chance"]>0){
        startingStatsString+="Dodge chance: "+startingStats["Dodge chance"]+"%\n";
    }
    if(startingStats["Damage Reduction"]>0){
        startingStatsString+="Damage Reduction: "+startingStats["Damage Reduction"]+"%\n";
    }
    if(startingStats["Guard"]==true){
        startingStatsString+="Guard against all: "+"\n";
    }
    document.getElementById("starting-stats").innerText=startingStatsString;



    //      *Record stats
    //  }
    //      Right before attack(SOT stat)
    progressCausalityLogic(iteratingCausalityLogic,"Right before super attack");
    //Right before super attack
    //Right before normal attack
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(SOT stat)","Single activator",iteratingCausalityLogic)
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(SOT stat)","Disable Other Line",iteratingCausalityLogic)
    //      Right before attack(MOT stat)
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(MOT stat)","Single activator",iteratingCausalityLogic)
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(MOT stat)","Disable Other Line",iteratingCausalityLogic)
    //      *Record stats
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after attack","Single activator",iteratingCausalityLogic,false)
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after attack","Disable Other Line",iteratingCausalityLogic,false)
    
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"All","Building Stat",iteratingCausalityLogic)
    
    kiCircleDictionary[0].display(true);
    kiCircleDictionary[0].updateKiFromBuffs(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers),iteratingSuperAttackBuffs);
    attacksPerformed+=1;

    iteratingCausalityLogic=prepareCausalityLogic(iteratingCausalityLogic,kiCircleDictionary[0]);
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(SOT stat)","Single activator",iteratingCausalityLogic)
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(SOT stat)","Disable Other Line",iteratingCausalityLogic)
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(MOT stat)","Single activator",iteratingCausalityLogic)
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(MOT stat)","Disable Other Line",iteratingCausalityLogic)
    kiCircleDictionary[0].updateFromBuffs(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers),iteratingSuperAttackBuffs);
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after attack","Single activator",iteratingCausalityLogic)
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after attack","Disable Other Line",iteratingCausalityLogic)
    iteratingSuperAttackBuffs=kiCircleDictionary[0].superBuffs;


    //      Right after attack
    if(kiCircleDictionary[0]["superPerformed"]){
        progressCausalityLogic(iteratingCausalityLogic,"Right after super attack");
    }
    else if(kiCircleDictionary[0]["attackPerformed"]){
        progressCausalityLogic(iteratingCausalityLogic,"Right after normal attack");
    }

    iteratingPassiveBuffs =(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers));
    for (const additionalAttack of iteratingPassiveBuffs["Additional Attack"]){
        if(additionalAttacks[additionalAttack]=="Unactivated"){
            additionalAttacks[additionalAttack]="Offered";
            kiCircleDictionary[additionalAttack].display(true);
        }
    }
    //Right after super attack
    //Right after normal attack

    //  for(each attack done){
    while(Object.values(additionalAttacks).includes("Offered")){
        const nextLineToActivate=getFirstInDictionary(additionalAttacks,["Offered"]);


        if(nextLineToActivate=="Hidden potential"){
            let additionalChance=calculateAdditionalChance(skillOrbBuffs["Additional"],attacksPerformed);
            kiCircleDictionary[nextLineToActivate].changePerformedChance(additionalChance["Normal"]+additionalChance["Super"])
            let chanceTheAdditionalIsASuper=additionalChance["Super"]/(additionalChance["Super"]+additionalChance["Normal"])
            kiCircleDictionary[nextLineToActivate].changeSuperChance(chanceTheAdditionalIsASuper)
            if(additionalChance["Normal"]!=0){
                kiCircleDictionary[nextLineToActivate].display(true)
            }
        }
        //if super is actually performed
        if(kiCircleDictionary[nextLineToActivate]["superChanceQuery"].classList.contains("active")){
            progressCausalityLogic(iteratingCausalityLogic,"Right before super attack");
            kiCircleDictionary[nextLineToActivate].toggleSuperPerformed(true);
        }
        //if normal is actually performed
        else if(kiCircleDictionary[nextLineToActivate]["performedChanceQuery"].classList.contains("active")){
            progressCausalityLogic(iteratingCausalityLogic,"Right before normal attack");
            kiCircleDictionary[nextLineToActivate].toggleAttackPerformed(true);
        }
        else{
            kiCircleDictionary[nextLineToActivate].updateValue(0);
            kiCircleDictionary[nextLineToActivate].updateKi(0);
            kiCircleDictionary[nextLineToActivate].toggleSuperPerformed(false);
            kiCircleDictionary[nextLineToActivate].toggleAttackPerformed(false);
        }

        kiCircleDictionary[nextLineToActivate].changeGridRow(iteratingAttackRow);
        iteratingAttackRow++;
        kiCircleDictionary[nextLineToActivate].display(true);    
        if(kiCircleDictionary[nextLineToActivate]["performedChanceQuery"].classList.contains("active")){
            lastAttack=nextLineToActivate;
            //currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(SOT stat)",iteratingCausalityLogic)
            //currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(MOT stat)",iteratingCausalityLogic)
            
            currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"All","Building Stat",iteratingCausalityLogic)
            kiCircleDictionary[nextLineToActivate].updateKiFromBuffs(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers),iteratingSuperAttackBuffs);
            attacksPerformed+=1;
            iteratingCausalityLogic=prepareCausalityLogic(iteratingCausalityLogic,kiCircleDictionary[0]);
            currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(SOT stat)","Single activator",iteratingCausalityLogic)
            currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(SOT stat)","Disable Other Line",iteratingCausalityLogic)
            currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(MOT stat)","Single activator",iteratingCausalityLogic)
            currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before attack(MOT stat)","Disable Other Line",iteratingCausalityLogic)
            kiCircleDictionary[nextLineToActivate].updateFromBuffs(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers),iteratingSuperAttackBuffs);
            
            iteratingSuperAttackBuffs=kiCircleDictionary[nextLineToActivate].superBuffs;
        }
        else{
        }
        
        //if super is actually performed
        if(kiCircleDictionary[nextLineToActivate]["superPerformed"]){
            progressCausalityLogic(iteratingCausalityLogic,"Right after super attack");
            currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after attack","Single activator",iteratingCausalityLogic)
            currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after attack","Disable Other Line",iteratingCausalityLogic)
        }
        //if normal is actually performed
        else if(kiCircleDictionary[nextLineToActivate]["attackPerformed"]){
            progressCausalityLogic(iteratingCausalityLogic,"Right after normal attack");
            currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after attack","Single activator",iteratingCausalityLogic)
            currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after attack","Disable Other Line",iteratingCausalityLogic)
        }

        //      Right after attack
        iteratingPassiveBuffs =(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers));
        for (const additionalAttack of iteratingPassiveBuffs["Additional Attack"]){
            if(additionalAttacks[additionalAttack]=="Unactivated"){
                additionalAttacks[additionalAttack]="Offered";
                kiCircleDictionary[additionalAttack].display(true);
            }
        }

        additionalAttacks[nextLineToActivate]="Activated";


    }
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after attack","Single activator",iteratingCausalityLogic)
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after attack","Disable Other Line",iteratingCausalityLogic)
    if(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers)["Debuff"].includes("Unable to attack")){
        for (const additional in additionalAttacks){
            additionalAttacks[additional]="Unactivated";
            kiCircleDictionary[additional].display(false);
            kiCircleDictionary[additional].updateValue(0);
            kiCircleDictionary[additional].attackPerformed=false;
        }
    }

    for (const additional in additionalAttacks){
        if(additionalAttacks[additional]=="Unactivated"){
            kiCircleDictionary[additional].attackPerformed=false;
        }
    }

    if(attackRecievedTiming=="after" && attackRecievedType=="normal"){
        progressCausalityLogic(iteratingCausalityLogic,"Right before being hit by normal");
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before being hit","Single activator",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before being hit","Disable Other Line",iteratingCausalityLogic)
    }
    else if(attackRecievedTiming=="after" && attackRecievedType=="super"){
        progressCausalityLogic(iteratingCausalityLogic,"Right before being hit by super");
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before being hit","Single activator",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right before being hit","Disable Other Line",iteratingCausalityLogic)
    }

    if(attackRecievedTiming=="after" && (attackRecievedType=="normal" || attackRecievedType=="super")){
        kiCircleDictionary[lastAttack].updateDefensiveFromBuffs(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers),iteratingSuperAttackBuffs);
        recievingDamageStats["Defense"]=kiCircleDictionary[lastAttack].getDefense();
        recievingDamageStats["Dodge chance"]=Math.min(kiCircleDictionary[lastAttack].getDodgeChance(),100)/100;
        recievingDamageStats["Dodge chance"]=1 - (1-(recievingDamageStats["Dodge chance"]))*(1-(skillOrbBuffs["Evasion"]/100));
        recievingDamageStats["Dodge chance"]=Math.round(recievingDamageStats["Dodge chance"]*1000)/10;
        recievingDamageStats["Damage Reduction"]= Math.min(kiCircleDictionary[lastAttack].getDamageReduction(),100);
        recievingDamageStats["Guard"]= kiCircleDictionary[lastAttack].getGuard();

            
        let recievingDamageStatsString="";
        recievingDamageStatsString+="DEF: "+recievingDamageStats["Defense"].toLocaleString()+"\n";
        if(recievingDamageStats["Dodge chance"]>0){
            recievingDamageStatsString+="Dodge chance: "+recievingDamageStats["Dodge chance"]+"%\n";
        }
        if(recievingDamageStats["Damage Reduction"]>0){
            recievingDamageStatsString+="Damage Reduction: "+recievingDamageStats["Damage Reduction"]+"%\n";
        }
        if(recievingDamageStats["Guard"]==true){
            recievingDamageStatsString+="Guard against all: "+"\n";
        }
    }

    if(attackRecievedTiming=="after" && attackRecievedType=="normal"){
        progressCausalityLogic(iteratingCausalityLogic,"Right after being hit by normal");
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after being hit","Single activator",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after being hit","Disable Other Line",iteratingCausalityLogic)
    }
    else if(attackRecievedTiming=="after" && attackRecievedType=="super"){
        progressCausalityLogic(iteratingCausalityLogic,"Right after being hit by super");
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after being hit","Single activator",iteratingCausalityLogic)
        currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"Right after being hit","Disable Other Line",iteratingCausalityLogic)
    }
    currentActivePassiveMultipliers=activatePassiveLines(currentActivePassiveMultipliers,"All","Building Stat",iteratingCausalityLogic)
    kiCircleDictionary[lastAttack].updateDefensiveFromBuffs(activePassiveMultipliersToPassiveBuffs(currentActivePassiveMultipliers),iteratingSuperAttackBuffs);

    

    finalStats={}
    
    finalStats["Defense"]= kiCircleDictionary[lastAttack].getDefense();
    finalStats["Dodge chance"]= Math.min(kiCircleDictionary[lastAttack].getDodgeChance(),100)/100;
    finalStats["Dodge chance"]=1 - (1-(finalStats["Dodge chance"]))*(1-(skillOrbBuffs["Evasion"]/100));
    finalStats["Dodge chance"]=Math.round(finalStats["Dodge chance"]*1000)/10;
    finalStats["Damage Reduction"]= Math.min(kiCircleDictionary[lastAttack].getDamageReduction(),100);
    finalStats["Guard"]= kiCircleDictionary[lastAttack].getGuard();

    let finalStatsString="";
    finalStatsString+="DEF: "+finalStats["Defense"].toLocaleString()+"\n";
    if(finalStats["Dodge chance"]>0){
        finalStatsString+="Dodge chance: "+finalStats["Dodge chance"]+"%\n";
    }
    if(finalStats["Damage Reduction"]>0){
        finalStatsString+="Damage Reduction: "+finalStats["Damage Reduction"]+"%\n";
    }
    if(finalStats["Guard"]==true){
        finalStatsString+="Guard against all: "+"\n";
    }


    document.getElementById("final-stats").innerText=finalStatsString;
    updateDamageTakenQueryContainer();
}


function activePassiveMultipliersToPassiveBuffs(activePassiveMultipliers){
    let buffs={
        "Ki":0,
        "SOT ATK %":0, "SOT ATK flat":0, "MOT ATK %":0, "MOT ATK flat":0, "Enemy ATK":0,
        "SOT DEF %":0, "SOT DEF flat":0, "MOT DEF %":0, "MOT DEF flat":0, "Enemy DEF":0,
        "Forsee Super Attack": false,
        "Guaranteed Hit": false,
        "Guard": false,
        "Dodge Chance": 0,
        "Effective Against All":false,
        "Additional Attack":[],
        "Heal %":0,
        "Heal flat":0,
        "Debuff":[],
        "Damage Reduction":0,
        "Crit Chance": 0
    }
    const SOTTIMINGS=["Start of turn","After all ki collected","Right before attack(SOT stat)","When ki spheres collected"]
    const MOTTIMINGS=["Right before being hit","Right after being hit","Right before attack(MOT stat)","Right after attack","End of turn"]
    for (const passiveLineKey in activePassiveMultipliers){
        const activatedLine=currentJson["Passive"][passiveLineKey];
        if(activatedLine["Type"]=="Single activator"){
            if("Ki" in activatedLine){
                //Ki increase
                if(activatedLine["Buff"]["+ or -"]=="+"){
                    buffs["Ki"]+=activatedLine["Ki"];
                }
                //Ki decrease
                else{
                    buffs["Ki"]-=activatedLine["Ki"];
                }
            }
            if("ATK" in activatedLine){
                if(activatedLine["Buff"]["Type"]=="Percentage"){
                    if(activatedLine["Buff"]["+ or -"]=="+"){
                        //Start of turn attack % increase
                        if(SOTTIMINGS.includes(activatedLine["Timing"])){
                            buffs["SOT ATK %"]+=activatedLine["ATK"];
                        }
                        //Middle of turn attack % increase
                        else{
                            buffs["MOT ATK %"]+=activatedLine["ATK"]
                        }
                    }
                    else{
                        //Start of turn attack % decrease
                        if(SOTTIMINGS.includes(activatedLine["Timing"])){
                            buffs["SOT ATK %"]-=activatedLine["ATK"];
                        }
                        //Middle of turn attack % decrease
                        else{
                            buffs["MOT ATK %"]-=activatedLine["ATK"]
                        }
                    }
                }
                else{
                    if(activatedLine["Buff"]["+ or -"]=="+"){
                        //Start of turn attack flat increase
                        if(SOTTIMINGS.includes(activatedLine["Timing"])){
                            buffs["SOT ATK flat"]+=activatedLine["ATK"];
                        }
                        //Middle of turn attack flat increase
                        else{
                            buffs["MOT ATK flat"]+=activatedLine["ATK"]
                        }
                    }
                    else{
                        //Start of turn attack flat decrease
                        if(SOTTIMINGS.includes(activatedLine["Timing"])){
                            buffs["SOT ATK flat"]-=activatedLine["ATK"];
                        }
                        //Middle of turn attack flat decrease
                        else{
                            buffs["MOT ATK flat"]-=activatedLine["ATK"]
                        }
                    }
                }
            }
            if("DEF" in activatedLine){
                if(activatedLine["Buff"]["Type"]=="Percentage"){
                    if(activatedLine["Buff"]["+ or -"]=="+"){
                        //Start of turn defense % increase
                        if(SOTTIMINGS.includes(activatedLine["Timing"])){
                            buffs["SOT DEF %"]+=activatedLine["DEF"];
                        }
                        //Middle of turn defense % increase
                        else{
                            buffs["MOT DEF %"]+=activatedLine["DEF"]
                        }
                    }
                    else{
                        //Start of turn defense % decrease
                        if(SOTTIMINGS.includes(activatedLine["Timing"])){
                            buffs["SOT DEF %"]-=activatedLine["DEF"];
                        }
                        //Middle of turn defense % decrease
                        else{
                            buffs["MOT DEF %"]-=activatedLine["DEF"]
                        }
                    }
                }
                else{
                    if(activatedLine["Buff"]["+ or -"]=="+"){
                        //Start of turn defense flat increase
                        if(SOTTIMINGS.includes(activatedLine["Timing"])){
                            buffs["SOT DEF flat"]+=activatedLine["DEF"];
                        }
                        //Middle of turn defense flat increase
                        else{
                            buffs["MOT DEF flat"]+=activatedLine["DEF"]
                        }
                    }
                    else{
                        //Start of turn defense flat decrease
                        if(SOTTIMINGS.includes(activatedLine["Timing"])){
                            buffs["SOT DEF flat"]-=activatedLine["DEF"];
                        }
                        //Middle of turn defense flat decrease
                        else{
                            buffs["MOT DEF flat"]-=activatedLine["DEF"]
                        }
                    }
                }
            }
            if("Forsee Super Attack" in activatedLine){
                buffs["Forsee Super Attack"]=true;
            }
            if("Guaranteed Hit" in activatedLine){
                buffs["Guaranteed Hit"]=true;
            }
            if("Dodge Chance" in activatedLine){
                buffs["Dodge Chance"]+=activatedLine["Dodge Chance"]
            }
            if("Effective Against All" in activatedLine){
                buffs["Effective Against All"]=true;
            }
            if("Additional Attack" in activatedLine){
                buffs["Additional Attack"].push(passiveLineKey);
            
            }
            if("Heals" in activatedLine){
                if(activatedLine["Buff"]["Type"]=="Percentage"){
                    //Heal percentage
                    if(activatedLine["Buff"]["+ or -"]=="+"){
                        buffs["Heal %"]+=activatedLine["Heals"];
                    }
                    //Self inflict damage percentage
                    else{
                        buffs["Heal %"]-=activatedLine["Heals"];
                    }
                }
                else{
                    //Heal flat
                    if(activatedLine["Buff"]["+ or -"]=="+"){
                        buffs["Heal flat"]+=activatedLine["Heals"];
                    }
                    //Self inflict damage flat
                    else{
                        buffs["Heal flat"]-=activatedLine["Heals"];
                    }
                }
            }
            if("Status" in activatedLine){
                buffs["Debuff"]=buffs["Debuff"].concat(activatedLine["Status"]);
            }
            if("DR" in activatedLine){
                //DR increase
                if(activatedLine["Buff"]["+ or -"]=="+"){
                    buffs["Damage Reduction"]+=activatedLine["DR"];
                }
                //DR decrease
                else{
                    buffs["Damage Reduction"]-=activatedLine["DR"];
                }
            }
            if("Crit Chance" in activatedLine){
                buffs["Crit Chance"]+=activatedLine["Crit Chance"];
            }
            if("Guard" in activatedLine){
                buffs["Guard"]=activatedLine["Guard"];
            }
        }
        else if(activatedLine["Type"]=="Building Stat"){
            const buffMultiplier=activePassiveMultipliers[passiveLineKey];
            if(includedInSupportBuff(activatedLine)){
                if("Ki" in activatedLine){
                    //Ki increase
                    if(activatedLine["Buff"]["+ or -"]=="+"){
                        buffs["Ki"]+=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["Ki"]*buffMultiplier);
                    }
                    //Ki decrease
                    else{
                        buffs["Ki"]-=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["Ki"]*buffMultiplier);
                    }
                }
                if("ATK" in activatedLine){
                    if(activatedLine["Buff"]["Type"]=="Percentage"){
                        if(activatedLine["Buff"]["+ or -"]=="+"){
                            //Start of turn attack % increase
                            if(SOTTIMINGS.includes(activatedLine["Timing"])){
                                buffs["SOT ATK %"]+=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["ATK"]*buffMultiplier);
                            }
                            //Middle of turn attack % increase
                            else{
                                buffs["MOT ATK %"]+=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["ATK"]*buffMultiplier);
                            }
                        }
                        else{
                            //Start of turn attack % decrease
                            if(SOTTIMINGS.includes(activatedLine["Timing"])){
                                buffs["SOT ATK %"]-=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["ATK"]*buffMultiplier);
                            }
                            //Middle of turn attack % decrease
                            else{
                                buffs["MOT ATK %"]-=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["ATK"]*buffMultiplier);
                            }
                        }
                    }
                    else{
                        if(activatedLine["Buff"]["+ or -"]=="+"){
                            //Start of turn attack flat increase
                            if(SOTTIMINGS.includes(activatedLine["Timing"])){
                                buffs["SOT ATK flat"]+=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["ATK"]*buffMultiplier);
                            }
                            //Middle of turn attack flat increase
                            else{
                                buffs["MOT ATK flat"]+=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["ATK"]*buffMultiplier);
                            }
                        }
                        else{
                            //Start of turn attack flat decrease
                            if(SOTTIMINGS.includes(activatedLine["Timing"])){
                                buffs["SOT ATK flat"]-=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["ATK"]*buffMultiplier);
                            }
                            //Middle of turn attack flat decrease
                            else{
                                buffs["MOT ATK flat"]-=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["ATK"]*buffMultiplier);
                            }
                        }
                    }
                }
                if("DEF" in activatedLine){
                    if(activatedLine["Buff"]["Type"]=="Percentage"){
                        if(activatedLine["Buff"]["+ or -"]=="+"){
                            //Start of turn defense % increase
                            if(SOTTIMINGS.includes(activatedLine["Timing"])){
                                buffs["SOT DEF %"]+=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["DEF"]*buffMultiplier);
                            }
                            //Middle of turn defense % increase
                            else{
                                buffs["MOT DEF %"]+=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["DEF"]*buffMultiplier);
                            }
                        }
                        else{
                            //Start of turn defense % decrease
                            if(SOTTIMINGS.includes(activatedLine["Timing"])){
                                buffs["SOT DEF %"]-=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["DEF"]*buffMultiplier);
                            }
                            //Middle of turn defense % decrease
                            else{
                                buffs["MOT DEF %"]-=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["DEF"]*buffMultiplier);
                            }
                        }
                    }
                    else{
                        if(activatedLine["Buff"]["+ or -"]=="+"){
                            //Start of turn defense flat increase
                            if(SOTTIMINGS.includes(activatedLine["Timing"])){
                                buffs["SOT DEF flat"]+=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["DEF"]*buffMultiplier);
                            }
                            //Middle of turn defense flat increase
                            else{
                                buffs["MOT DEF flat"]+=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["DEF"]*buffMultiplier);
                            }
                        }
                        else{
                            //Start of turn defense flat decrease
                            if(SOTTIMINGS.includes(activatedLine["Timing"])){
                                buffs["SOT DEF flat"]-=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["DEF"]*buffMultiplier);
                            }
                            //Middle of turn defense flat decrease
                            else{
                                buffs["MOT DEF flat"]-=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["DEF"]*buffMultiplier);
                            }
                        }
                    }
                }
                if("Dodge Chance" in activatedLine){
                    buffs["Dodge Chance"]+=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["Dodge Chance"]*buffMultiplier);
                }
                if("Heals" in activatedLine){
                    if(activatedLine["Buff"]["Type"]=="Percentage"){
                        //Heal percentage
                        if(activatedLine["Buff"]["+ or -"]=="+"){
                            buffs["Heal %"]+=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["Heals"]*buffMultiplier);
                        }
                        //Self inflict damage percentage
                        else{
                            buffs["Heal %"]-=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["Heals"]*buffMultiplier);
                        }
                    }
                    else{
                        //Heal flat
                        if(activatedLine["Buff"]["+ or -"]=="+"){
                            buffs["Heal flat"]+=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["Heals"]*buffMultiplier);
                        }
                        //Self inflict damage flat
                        else{
                            buffs["Heal flat"]-=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["Heals"]*buffMultiplier);
                        }
                    }
                }
                if("DR" in activatedLine){
                    //DR increase
                    if(activatedLine["Buff"]["+ or -"]=="+"){
                        buffs["Damage Reduction"]+=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["DR"]*buffMultiplier);
                    }
                    //DR decrease
                    else{
                        buffs["Damage Reduction"]-=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["DR"]*buffMultiplier);
                    }
                }
                if("Crit Chance" in activatedLine){
                    buffs["Crit Chance"]+=Math.min(activatedLine["Building Stat"]["Max"],activatedLine["Crit Chance"]*buffMultiplier);
                }
            }
        }
    }
    return buffs;
}


function progressCausalityLogic(causalityLogic,progressingDetails){
    if(progressingDetails=="Start of turn"){

    }
    else if(progressingDetails=="When ki spheres collected"){

    }
    else if(progressingDetails=="After all ki collected"){

    }
    else if(progressingDetails=="Right before being hit by normal"){
        iterateCausalityThatContains(causalityLogic,"Has this character been hit by a normal attack")
        iterateCausalityThatContains(causalityLogic,"How many normal attacks has this character recieved")
        iterateSpecificCausality(causalityLogic,"Has this character been hit on this turn?")
    }
    else if(progressingDetails=="Right before being hit by super"){
        iterateCausalityThatContains(causalityLogic,"Has this character been hit by a super attack")
        iterateCausalityThatContains(causalityLogic,"How many super attacks has this character recieved")
        iterateSpecificCausality(causalityLogic,"Has this character been hit on this turn?")
    }
    else if(progressingDetails=="Right after being hit by normal"){
        iterateCausalityThatContains(causalityLogic,"How many attacks has this character recieved")

        iterateSpecificCausality(causalityLogic,"How many attacks has this character recieved on this turn?")
        iterateCausalityThatContains(causalityLogic,"Has attack been recieved ")
    }
    else if(progressingDetails=="Right after being hit by super"){
        iterateSpecificCausality(causalityLogic,"How many attacks has this character recieved?")

        iterateSpecificCausality(causalityLogic,"How many attacks has this character recieved on this turn?")
        iterateCausalityThatContains(causalityLogic,"Has attack been recieved ")
    }
    else if(progressingDetails=="Right after dodging normal"){
        iterateSpecificCausality(causalityLogic,"How many attacks has been evaded?")

        iterateSpecificCausality(causalityLogic,"Has this unit evaded an attack on this turn?")
    }
    else if(progressingDetails=="Right after dodging super"){
        iterateSpecificCausality(causalityLogic,"How many attacks has been evaded?")
        iterateSpecificCausality(causalityLogic,"Has this unit evaded an attack on this turn?")

        iterateSpecificCausality(causalityLogic,"How many super attacks has this character recieved?")
    }
    else if(progressingDetails=="Right before normal attack"){
        
    }
    else if(progressingDetails=="Right before super attack"){
        
    }
    else if(progressingDetails=="Right after normal attack"){
        iterateCausalityThatContains(causalityLogic,"How many attacks has this character performed")
    }
    else if(progressingDetails=="Right after super attack"){
        iterateCausalityThatContains(causalityLogic,"How many super attacks has this character performed")

        iterateCausalityThatContains(causalityLogic,"How many attacks has this character performed")
    }

    return(0);
}


function iterateCausalityThatContains(causalityLogic,causalityThatContains){
    for (const causality of Object.keys(causalityLogic)){
        if(causality.includes(causalityThatContains)){
            if( typeof (causalityLogic[causality]) == "number" ){
                causalityLogic[causality]=1+causalityLogic[causality]
            }
            else{
                causalityLogic[causality]=true
            }
        }
    }
}
function iterateSpecificCausality(causalityLogic,causalityToIterate){
    if(causalityToIterate in causalityLogic){
        if( typeof (causalityLogic[causalityToIterate]) == "number" ){
            causalityLogic[causalityToIterate]=1+causalityLogic[causalityToIterate]
        }
        else{
            causalityLogic[causalityToIterate]=true
        }
    }
}


/**
 * Activates passive lines based on the given conditions. Returns an object with all the IDs of the passive lines that are active, with the value of the multiplier of that passive line.
 * @param {Object} previousActiveLineMultipliers - An object with the IDs of the passive lines that were previously active, with the value of the multiplier of that passive line.
 * @param {String} exec_timing_type - The type of timing for the passive lines to activate.
 * @param {String} activationType - The type of passive lines to activate. Can be "Single activator", "Disable Other Line", "Building Stat", or "All".
 * @param {Object} causalityLogic - An object with the IDs of the causalities as keys, and the value of the causality as values.
 * @returns {Object} - An object with all the IDs of the passive lines that are active, with the value of the multiplier of that passive line.
 */
function activatePassiveLines(previousActiveLineMultipliers,exec_timing_type,activationType,causalityLogic,thisTurnActivationCounted=true){
    let updatedPassiveLineMultipliers={...previousActiveLineMultipliers}
    let activateablePassiveLines=[];

    if(activationType=="Single activator"){
        for (const passiveLine of Object.values(currentJson["Passive"])){
            if(passiveLine["Timing"]==exec_timing_type || exec_timing_type=="All"){
                if(passiveLine["Type"]=="Single activator" && !(Object.keys(previousActiveLineMultipliers).includes(passiveLine["ID"]))){
                    if(thisTurnActivationCounted || passiveLine["Length"]!="1"){
                        if("Additional Attack" in passiveLine || !("Chance" in passiveLine)){
                            activateablePassiveLines.push(passiveLine)
                        }
                        else if(("Chance" in passiveLine && !("Additional Attack" in passiveLine))){
                            if(passiveChanceList[passiveLine["ID"]].getValue()){
                                activateablePassiveLines.push(passiveLine)
                            }
                        }
                    }
                }
            }
        }
        for(const passiveLine of activateablePassiveLines){
            if("Condition" in passiveLine){
                let conditionLogic=" "+passiveLine["Condition"]["Logic"]+" ";
                conditionLogic=conditionLogic.replaceAll("("," ( ").replaceAll(")", " ) ");
                for (const causalityKey of Object.keys(passiveLine["Condition"]["Causalities"])){
                    const causality=passiveLine["Condition"]["Causalities"][causalityKey];
                    let buttonLogic=false;
                    if("Button" in causality){
                        if(causality["Button"]["Name"] in causalityLogic){
                            buttonLogic=causalityLogic[causality["Button"]["Name"]];
                        }
                    }
                    
                    let sliderLogic=false;
                    if("Slider" in causality){
                        if(causality["Slider"]["Name"] in causalityLogic){
                            sliderLogic=causalityLogic[causality["Slider"]["Name"]]+causality["Slider"]["Logic"];
                            sliderLogic=(" "+causality["Slider"]["Logic"]+" ")
                            .replaceAll(" >",(" "+causalityLogic[causality["Slider"]["Name"]])+" >")
                            .replaceAll(" <",(" "+causalityLogic[causality["Slider"]["Name"]])+" <")
                            .replaceAll(" =",(" "+causalityLogic[causality["Slider"]["Name"]])+" =");
                            sliderLogic=evaluate(sliderLogic);
                        }
                    }

                    const overallLogic=(buttonLogic||sliderLogic);

                    conditionLogic=conditionLogic.replaceAll(" "+causalityKey+" ",    " "+overallLogic+" ");
                }

                if(evaluate(conditionLogic)){
                    updatedPassiveLineMultipliers[passiveLine["ID"]]=1;
                }
            }
            else{
                    updatedPassiveLineMultipliers[passiveLine["ID"]]=1;
            }
        }
    }
    if(activationType=="Disable Other Line"){
        for (const passiveLine of Object.values(currentJson["Passive"])){
            if(passiveLine["Timing"]==exec_timing_type || exec_timing_type=="All"){
                if(passiveLine["Type"]=="Disable Other Line"){
                    if("Additional Attack" in passiveLine || !("Chance" in passiveLine)){
                        activateablePassiveLines.push(passiveLine)
                    }
                    else if(("Chance" in passiveLine && !("Additional Attack" in passiveLine))){
                        if(passiveChanceList[passiveLine["ID"]].getValue()){
                            activateablePassiveLines.push(passiveLine)
                        }
                    }
                }
            }
        }
        for(const passiveLine of activateablePassiveLines){    
            if("Condition" in passiveLine){
                let conditionLogic=" "+passiveLine["Condition"]["Logic"]+" ";
                for (const causalityKey of Object.keys(passiveLine["Condition"]["Causalities"])){
                    const causality=passiveLine["Condition"]["Causalities"][causalityKey];
                    let buttonLogic=false;
                    if("Button" in causality){
                        if(causality["Button"]["Name"] in causalityLogic){
                            buttonLogic=causalityLogic[causality["Button"]["Name"]];
                        }
                    }
                    
                    let sliderLogic=false;
                    if("Slider" in causality){
                        if(causality["Slider"]["Name"] in causalityLogic){
                            sliderLogic=causalityLogic[causality["Slider"]["Name"]]+causality["Slider"]["Logic"];
                            sliderLogic=evaluate(sliderLogic);
                        }
                    }

                    const overallLogic=(buttonLogic||sliderLogic);

                    conditionLogic=conditionLogic.replaceAll(" "+causalityKey+" ",    " "+overallLogic+" ");
                }

                if(evaluate(conditionLogic)){
                    delete updatedPassiveLineMultipliers[passiveLine["Disable Other Line"]["Line"]]
                }
            }
            else{
                    delete updatedPassiveLineMultipliers[passiveLine["Disable Other Line"]["Line"]]
            }
        }
    }
    if(activationType=="Building Stat"){
        for (const passiveLine of Object.values(currentJson["Passive"])){
            if(passiveLine["Timing"]==exec_timing_type || exec_timing_type=="All"){
                if(passiveLine["Type"]=="Building Stat"){
                    if(thisTurnActivationCounted || passiveLine["Length"]!="1"){
                        if("Condition" in passiveLine){
                            let conditionLogic=" "+passiveLine["Condition"]["Logic"]+" ";
                            conditionLogic=conditionLogic.replaceAll("("," ( ").replaceAll(")", " ) ");
                            for (const causalityKey of Object.keys(passiveLine["Condition"]["Causalities"])){
                                const causality=passiveLine["Condition"]["Causalities"][causalityKey];
                                let buttonLogic=false;
                                if("Button" in causality){
                                    if(causality["Button"]["Name"] in causalityLogic){
                                        buttonLogic=causalityLogic[causality["Button"]["Name"]];
                                    }
                                }
                                
                                let sliderLogic=false;
                                if("Slider" in causality){
                                    if(causality["Slider"]["Name"] in causalityLogic){
                                        sliderLogic=causalityLogic[causality["Slider"]["Name"]]+causality["Slider"]["Logic"];
                                        sliderLogic=evaluate(sliderLogic);
                                    }
                                }
            
                                const overallLogic=(buttonLogic||sliderLogic);
            
                                conditionLogic=conditionLogic.replaceAll(" "+causalityKey+" ",    " "+overallLogic+" ");
                            }
            
                            if(evaluate(conditionLogic)){
                                if("Additional Attack" in passiveLine || !("Chance" in passiveLine)){
                                    activateablePassiveLines.push(passiveLine)
                                }
                                else if(("Chance" in passiveLine && !("Additional Attack" in passiveLine))){
                                    if(passiveChanceList[passiveLine["ID"]].getValue()){
                                        activateablePassiveLines.push(passiveLine)
                                    }
                                }
                            }
                        }
                        else{
                            if("Additional Attack" in passiveLine || !("Chance" in passiveLine)){
                                activateablePassiveLines.push(passiveLine)
                            }
                            else if(("Chance" in passiveLine && !("Additional Attack" in passiveLine))){
                                if(passiveChanceList[passiveLine["ID"]].getValue()){
                                    activateablePassiveLines.push(passiveLine)
                                }
                            }
                        }
                    }
                }
            }
        }
        for(const passiveLine of activateablePassiveLines){    
            if(passiveLine["Timing"]==exec_timing_type || exec_timing_type=="All"){
                if(passiveLine["Type"]=="Building Stat"){
                    let buffMultiplier=0;
                    if(passiveLine["Building Stat"]["Cause"]["Cause"]=="HP"){
                        if(passiveLine["Building Stat"]["Cause"]["Type"]=="More HP remaining"){
                            buffMultiplier=(((passiveLine["Building Stat"]["Max"]-passiveLine["Building Stat"]["Min"])*(causalityLogic[passiveLine["Building Stat"]["Slider"]]/100))+passiveLine["Building Stat"]["Min"])/passiveLine["Building Stat"]["Max"];
                        }
                        else if(passiveLine["Building Stat"]["Cause"]["Type"]=="Less HP remaining"){
                            buffMultiplier=((-(passiveLine["Building Stat"]["Max"]-passiveLine["Building Stat"]["Min"])*(causalityLogic[passiveLine["Building Stat"]["Slider"]]/100))+passiveLine["Building Stat"]["Max"])/passiveLine["Building Stat"]["Max"];
                        }
                    }
                    else if(passiveLine["Building Stat"]["Cause"]["Cause"]=="Ki sphere obtained"){
                        let kiSphereCount=0;
                        for (const type of passiveLine["Building Stat"]["Cause"]["Type"]){
                            if(type=="Rainbow"){
                                kiSphereCount+=rainbowKiSphereAmount;
                            }
                            else{
                                if(currentKiSphere==type){
                                    kiSphereCount+=currentKiSphereAmount;
                                }
                            }
                        }
                        buffMultiplier=kiSphereCount;
                    }
                    else{
                        buffMultiplier=causalityLogic[passiveLine["Building Stat"]["Slider"]];
                    }
                    buffMultiplier=Math.min(buffMultiplier,passiveLine["Building Stat"]["Max"]);
                    if(buffMultiplier!=0){
                        updatedPassiveLineMultipliers[passiveLine["ID"]]=buffMultiplier;
                    }
                }
            }
        }
    }



    return(updatedPassiveLineMultipliers)
}





function createLeaderStats(){
    const leaderContainer=document.getElementById('leader-container');

    const kiLabel=document.createElement('div');
    leaderContainer.appendChild(kiLabel);
    kiLabel.id="ki-label";
    kiLabel.style.gridRow="1";
    kiLabel.style.gridColumn="2";
    kiLabel.innerText="Ki:"
    kiLabel.style.fontWeight="bold";

    const statsLabel=document.createElement('div');
    leaderContainer.appendChild(statsLabel);
    statsLabel.id="ki-label";
    statsLabel.style.gridRow="1";
    statsLabel.style.gridColumn="3";
    statsLabel.innerHTML="HP<br>ATK<br>DEF:"
    statsLabel.style.fontWeight="bold";

    const seperateOrJoin=document.createElement('div');
    leaderContainer.appendChild(seperateOrJoin);
    seperateOrJoin.gridColumn="1";
    seperateOrJoin.id="seperate-or-join-leader";
    seperateOrJoin.classList.add('JointLeader');
    seperateOrJoin.style.cursor="pointer";
    seperateOrJoin.addEventListener('click', function(){
      if(seperateOrJoin.classList.contains("SeperateLeader")){
        seperateOrJoin.classList.remove('SeperateLeader');
        seperateOrJoin.classList.add('JointLeader');
  //      seperateOrJoin.style.width="110px";
        leaderAInputKi.style.display="none";
        leaderBInputKi.style.display="none";
        leaderTotalInputKi.style.display="block";
        leaderAInputStats.style.display="none";
        leaderBInputStats.style.display="none";
        leaderTotalInputStats.style.display="block";
      } else {
        seperateOrJoin.classList.remove('JointLeader');
        seperateOrJoin.classList.add('SeperateLeader');
  //      seperateOrJoin.style.width="220px";
        leaderAInputKi.style.display="block";
        leaderBInputKi.style.display="block";
        leaderTotalInputKi.style.display="none";
        leaderAInputStats.style.display="block";
        leaderBInputStats.style.display="block";
        leaderTotalInputStats.style.display="none";
      }
    });

    let leaderAInputKi=document.createElement('input');
    leaderAInputKi.id="leader-A-Input-Ki";
    leaderAInputKi.type="number";
    leaderAInputKi.min=0;
    leaderAInputKi.max=4;
    leaderAInputKi.step=1;
    leaderAInputKi.value=3;

    leaderAInputKi.style.gridColumn="2";
    leaderAInputKi.style.gridRow="2";
    leaderContainer.appendChild(leaderAInputKi);
    
    let leaderBInputKi=document.createElement('input');
    leaderBInputKi.id="leader-B-Input-Ki";
    leaderBInputKi.type="number";
    leaderBInputKi.min=0;
    leaderBInputKi.max=4;
    leaderBInputKi.step=1;
    leaderBInputKi.value=3;
    
    leaderBInputKi.style.gridColumn="2";
    leaderBInputKi.style.gridRow="3";
    leaderContainer.appendChild(leaderBInputKi);


    let leaderTotalInputKi=document.createElement('input');
    leaderTotalInputKi.id="leader-Total-Input-Ki";
    leaderTotalInputKi.type="number";
    leaderTotalInputKi.min=0;
    leaderTotalInputKi.max=8;
    leaderTotalInputKi.step=1;
    leaderTotalInputKi.value=6;

    leaderTotalInputKi.style.gridColumn="2";
    leaderTotalInputKi.style.gridRow="2";
    leaderContainer.appendChild(leaderTotalInputKi);
    

    leaderAInputKi.addEventListener('input', function(){
        if(parseInt(leaderAInputKi.value)>200){
            leaderAInputKi.value=200;
        }
        else if (parseInt(leaderAInputKi.value)<0){
            leaderAInputKi.value=0;
        }
        leaderTotalInputKi.value=parseInt(leaderAInputKi.value)+parseInt(leaderBInputKi.value);
        leaderBuffs.Ki=leaderTotalInputKi.value;
        kiSources.leader=leaderBuffs.Ki;
        updatePassiveStats()
    });

    leaderBInputKi.addEventListener('input', function(){
        if(parseInt(leaderBInputKi.value)>200){
            leaderBInputKi.value=200;
        }
        else if (parseInt(leaderBInputKi.value)<0){
            leaderBInputKi.value=0;
        }
        leaderTotalInputKi.value=parseInt(leaderAInputKi.value)+parseInt(leaderBInputKi.value);
        leaderBuffs.Ki=leaderTotalInputKi.value;
        kiSources.leader=leaderBuffs.Ki;
        updatePassiveStats()
    });
    
    leaderTotalInputKi.addEventListener('input', function(){
        if(parseInt(leaderTotalInputKi.value)>400){
            leaderTotalInputKi.value=400;
        }
        else if (parseInt(leaderTotalInputKi.value)<0){
            leaderTotalInputKi.value=0;
        }
        leaderBuffs.Ki=leaderTotalInputKi.value;
        kiSources.leader=leaderBuffs.Ki;
        updatePassiveStats()
        leaderAInputKi.value=Math.floor(parseInt(leaderTotalInputKi.value)/2);
        if(parseInt(leaderTotalInputKi.value)%2==0){
            leaderBInputKi.value=Math.floor(parseInt(leaderTotalInputKi.value)/2);
        } else {
            leaderBInputKi.value=Math.floor(parseInt(leaderTotalInputKi.value)/2)+1;
        }
    });
    leaderAInputKi.style.display="none";
    leaderBInputKi.style.display="none";
    leaderTotalInputKi.style.display="block";

    let leaderAInputStats=document.createElement('input');
    leaderAInputStats.id="leader-A-Input-Stats";
    leaderAInputStats.type="number";
    leaderAInputStats.min=0;
    leaderAInputStats.max=220;
    leaderAInputStats.step=1;
    leaderAInputStats.value=200;

    leaderAInputStats.style.gridColumn="3";
    leaderAInputStats.style.gridRow="2"
    leaderContainer.appendChild(leaderAInputStats);
    
    let leaderBInputStats=document.createElement('input');
    leaderBInputStats.id="leader-B-Input-Stats";
    leaderBInputStats.type="number";
    leaderBInputStats.min=0;
    leaderBInputStats.max=220;
    leaderBInputStats.step=1;
    leaderBInputStats.value=200;

    leaderBInputStats.style.gridColumn="3";
    leaderBInputStats.style.gridRow="3"
    leaderContainer.appendChild(leaderBInputStats);


    let leaderTotalInputStats=document.createElement('input');
    leaderTotalInputStats.id="leader-total-Input-Stats";
    leaderTotalInputStats.type="number";
    leaderTotalInputStats.min=0;
    leaderTotalInputStats.max=440;
    leaderTotalInputStats.step=1;
    leaderTotalInputStats.value=400;

    leaderTotalInputStats.style.gridColumn="3";
    leaderTotalInputStats.style.gridRow="2"
    leaderContainer.appendChild(leaderTotalInputStats);
    

    leaderAInputStats.addEventListener('input', function(){
        if(parseInt(leaderAInputStats.value)>leaderAInputStats.max){
            leaderAInputStats.value=leaderAInputStats.max;
        }
        else if (parseInt(leaderAInputStats.value)<0){
            leaderAInputStats.value=0;
        }
        leaderTotalInputStats.value=parseInt(leaderAInputStats.value)+parseInt(leaderBInputStats.value);
        leaderBuffs.HP=leaderTotalInputStats.value;
        leaderBuffs.ATK=leaderTotalInputStats.value;
        leaderBuffs.DEF=leaderTotalInputStats.value;
        updatePassiveStats()
    });

    leaderBInputStats.addEventListener('input', function(){
        if(parseInt(leaderBInputStats.value)>leaderBInputStats.max){
            leaderBInputStats.value=leaderBInputStats.max;
        }
        else if (parseInt(leaderBInputStats.value)<0){
            leaderBInputStats.value=0;
        }
        leaderTotalInputStats.value=parseInt(leaderAInputStats.value)+parseInt(leaderBInputStats.value);
        leaderBuffs.HP=leaderTotalInputStats.value;
        leaderBuffs.ATK=leaderTotalInputStats.value;
        leaderBuffs.DEF=leaderTotalInputStats.value;
        updatePassiveStats()
    });
    
    leaderTotalInputStats.addEventListener('input', function(){
        if(parseInt(leaderTotalInputStats.value)>leaderTotalInputStats.max){
            leaderTotalInputStats.value=leaderTotalInputStats.max;
        }
        else if (parseInt(leaderTotalInputStats.value)<0){
            leaderTotalInputStats.value=0;
        }
        leaderBuffs.HP=leaderTotalInputStats.value;
        leaderBuffs.ATK=leaderTotalInputStats.value;
        leaderBuffs.DEF=leaderTotalInputStats.value;
        updatePassiveStats()
        leaderAInputStats.value=Math.floor(parseInt(leaderTotalInputStats.value)/2);
        if(parseInt(leaderTotalInputStats.value)%2==0){
            leaderBInputStats.value=Math.floor(parseInt(leaderTotalInputStats.value)/2);
        } else {
            leaderBInputStats.value=Math.floor(parseInt(leaderTotalInputStats.value)/2)+1;
        }
    });
    leaderAInputStats.style.display="none";
    leaderBInputStats.style.display="none";
    leaderTotalInputStats.style.display="block";


    
}

function createLinkStats(){
    //TODO Link buttons are stored at dbManagement/DokkanFiles/global/en/layout/en/image/common/btn/cha_linkskill_label_gold.png
    const linksContainer=document.getElementById('links-container');
    let links =currentJson["Links"];
    let linkNumber=0;
    for (const linkid in links){
      let link=links[linkid]
      let linkName = link;
      let linkLevel = 10;
      let linkButton = document.createElement('button');
      linkButton.innerHTML = linkName + " <br>Level: " + linkLevel;
      linkButton.id="links-button";
      linkButton.style.display="block"
      linkButton.style.background="#00FF00"
      linkButton.style.gridRow= linkNumber*2;
      linkButton.classList.add('active');
      let linkSlider = document.createElement('input');
      linkSlider.type = "range";
      linkSlider.min = 1;
      linkSlider.max = 10;
      linkSlider.value = 10;
      linkSlider.id="links-slider";
      if(linkNumber%2==0){
        linkButton.style.gridRow= linkNumber*2+4;
        linkSlider.style.gridRow= linkNumber*2+5;
        linkButton.style.gridColumn=1;
        linkSlider.style.gridColumn=1;
      }
      else{
        linkButton.style.gridRow= (-1+linkNumber)*2+4;
        linkSlider.style.gridRow= (-1+linkNumber)*2+5;
        linkButton.style.gridColumn=3;
        linkSlider.style.gridColumn=3;
      }
      linksContainer.appendChild(linkButton);
      
      linksContainer.appendChild(linkSlider);

      linkButton.onclick = function(){
        if(linkButton.classList.contains('active')){
          linkButton.style.background="#FF5C35"
          linkButton.classList.remove('active');
        } else {
          linkButton.classList.add('active');
          linkButton.style.background="#00FF00"
        }
        createLinkBuffs()
        updatePassiveStats()
      }
      linkSlider.addEventListener('input', function(){
        linkLevel = linkSlider.value;
        linkButton.innerHTML = linkName + " <br>Level: " + linkLevel;
        createLinkBuffs();
        updatePassiveStats()
        
      });
      linkNumber+=1;
    };

    
    let allLinksSlider = document.createElement('input');
    allLinksSlider.type = "range";
    allLinksSlider.min = 1;
    allLinksSlider.max = 10;
    allLinksSlider.value = 10;
    allLinksSlider.id="links-slider";
    allLinksSlider.style.gridRowStart = "3";
    allLinksSlider.style.gridRowEnd = "3";
    allLinksSlider.style.gridColumnStart = "1";
    allLinksSlider.style.gridColumnEnd = "4";
    allLinksSlider.addEventListener('input', function(){
      let linksContainer = document.querySelector('#links-container');
      let linkSliders = linksContainer.querySelectorAll('input[type=range]');
      linkSliders.forEach((slider, index) => {
        slider.value = allLinksSlider.value;
        let linkName = linksContainer.querySelectorAll('button')[index].textContent.split(' Level')[0];
        linksContainer.querySelectorAll('button')[index].innerHTML = linkName + " <br>Level: " + allLinksSlider.value;
      });

      createLinkBuffs();
      updatePassiveStats()
    });
    linksContainer.appendChild(allLinksSlider);

    let allLinksButton = document.createElement('button');
    allLinksButton.innerHTML = "All Links";
    allLinksButton.id="links-button";
    allLinksButton.style.background="#00FF00"
    allLinksButton.style.gridRowStart = "2";
    allLinksButton.style.gridRowEnd = "3";
    allLinksButton.style.gridColumnStart = "1";
    allLinksButton.style.gridColumnEnd = "4";
    allLinksButton.classList.add('active');
    allLinksButton.onclick = function(){
      if(allLinksButton.classList.contains('active')){
        allLinksButton.style.background="#FF5C35"
        allLinksButton.classList.remove('active');
        let linkButtons = linksContainer.querySelectorAll('button');
        linkButtons.forEach((button, index) => {
          button.classList.remove('active');
          button.style.background="#FF5C35"
        });
      }
      else{
        allLinksButton.classList.add('active');
        allLinksButton.style.background="#00FF00"
        let linkButtons = linksContainer.querySelectorAll('button');
        linkButtons.forEach((button, index) => {
          button.classList.add('active');
          button.style.background="#00FF00"
        });
      }
      createLinkBuffs();
      updatePassiveStats()
    }
    linksContainer.appendChild(allLinksButton);


    //create an paragraph so that none of the sliders are .lastchild
    let linkBuffsDiv = document.createElement('p');
    linkBuffsDiv.innerHTML = "Link Buffs: ";
    linksContainer.appendChild(linkBuffsDiv);

    const linkPartnerContainer = document.getElementById('link-partner-container');
    const linkPartnerButton = document.getElementById('link-partner-button');
    linkPartnerButton.onclick = function(){
        let activeLinks={};
        let linkButtons = document.querySelector('#links-container').querySelectorAll('button');


        // Iterate over each link slider and button
        linkButtons.forEach(
            (button) => {
                if(button.textContent.split(' Level')[0]!="All Links"){
                    activeLinks[button.textContent.split(' Level')[0]]=button.classList.contains('active');
                }
            }
        );

        const linksJsonPromise = getJsonPromise(baseDomain,"/dbManagement/uniqueJsons/unitBasics/Links.json","");
        linksJsonPromise.then(
            linksJson => {
            const allLinkPartners = findLinkPartners(activeLinks,linksJson);
            updateLinkPartnerDisplay(allLinkPartners);
            }
        )
    }

    const linkPartnerDisplay = document.getElementById('link-partner-display');
}

function findLinkPartners(activeLinks,linksJson, inactiveNeeded=true){
    let enabledLinks = Object.keys(activeLinks).filter(key => activeLinks[key]);
    let allLinkPartners = [];
    for(const unitID in linksJson){
        if(linksJson[unitID].every(element => enabledLinks.includes(element))){
            allLinkPartners.push(unitID);
        }
    }

    if(inactiveNeeded){
        //WIP
    }

    return(allLinkPartners);
}

function updateLinkPartnerDisplay(allLinkPartners){
    //WIP
}

function updateBaseStats(refreshKi=true){
    let levelSlider=document.getElementById('level-slider');
    let ATK = parseInt(currentJson["Stats at levels"][levelSlider.value]["ATK"]);
    let DEF = parseInt(currentJson["Stats at levels"][levelSlider.value]["DEF"]);
    let HP = parseInt((currentJson["Stats at levels"][levelSlider.value]["HP"]));

    const statsContainerObject = document.getElementById('stats-container').firstChild.classConstruction;
    const starButton=document.getElementById('star-button');
    const toggleButtons = Array.from(document.querySelectorAll('.toggle-btn1, .toggle-btn2, .toggle-btn3, .toggle-btn4'));
    let Additional=0;
    let Crit=0;
    let Evasion=0;
    let type_atk=0;
    let type_def=0;
    let super_attack_boost=0;
    let recovery_boost=0;
    const skill_orb_container=document.getElementById('all-skill-orb-container');
    if(starButton.classList.contains('active') || starButton.classList.contains('rainbow')){
        ATK += parseInt(currentJson["Hidden Potential"]["0"]["ATK"])
        DEF += parseInt(currentJson["Hidden Potential"]["0"]["DEF"])
        HP += parseInt(currentJson["Hidden Potential"]["0"]["HP"])

        Additional+=parseInt(currentJson["Hidden Potential"]["0"]["Additional"])
        Crit+=parseInt(currentJson["Hidden Potential"]["0"]["Crit"])
        Evasion+=parseInt(currentJson["Hidden Potential"]["0"]["Evasion"])
        type_atk+=parseInt(currentJson["Hidden Potential"]["0"]["Type ATK"])
        type_def+=parseInt(currentJson["Hidden Potential"]["0"]["Type DEF"])
        super_attack_boost+=parseInt(currentJson["Hidden Potential"]["0"]["Super Attack boost"])
        recovery_boost+=parseInt(currentJson["Hidden Potential"]["0"]["Recovery boost"])

    }
    
    toggleButtons.forEach((button, index) => {
      if(button.classList.contains('active')){
        ATK += parseInt(currentJson["Hidden Potential"][index+1]["ATK"])
        DEF += parseInt(currentJson["Hidden Potential"][index+1]["DEF"])
        HP += parseInt(currentJson["Hidden Potential"][index+1]["HP"])
        Additional+=parseInt(currentJson["Hidden Potential"][index+1]["Additional"])
        Crit+=parseInt(currentJson["Hidden Potential"][index+1]["Crit"])
        Evasion+=parseInt(currentJson["Hidden Potential"][index+1]["Evasion"])
        type_atk+=parseInt(currentJson["Hidden Potential"][index+1]["Type ATK"])
        type_def+=parseInt(currentJson["Hidden Potential"][index+1]["Type DEF"])
        super_attack_boost+=parseInt(currentJson["Hidden Potential"][index+1]["Super Attack boost"])
        recovery_boost+=parseInt(currentJson["Hidden Potential"][index+1]["Recovery boost"])
      }
    })

    if((currentJson["Rarity"]=="ur" || currentJson["Rarity"]=="lr") && !(skill_orb_container.classList.contains('Edited'))){
        skill_orb_container.additionalNode.updateValue(Additional)
        skill_orb_container.critNode.updateValue(Crit)
        skill_orb_container.evasionNode.updateValue(Evasion)
        skill_orb_container.typeATKBoostNode.updateValue(type_atk)
        skill_orb_container.typeDEFBoostNode.updateValue(type_def)
        skill_orb_container.superAttackBoostNode.updateValue(super_attack_boost)
        skill_orb_container.recoveryBoostNode.updateValue(recovery_boost)
    }

    baseStats={"HP":HP,"ATK":ATK,"DEF":DEF};
    statsContainerObject.updateInitialHP(HP,false);

    
    statsContainerObject.updateInitialATK(ATK,false);
    
    
    statsContainerObject.updateInitialDEF(DEF,false);

    statsContainerObject.refreshStats();
    if(refreshKi){
        updatePassiveStats();
    }


  }
  
function createTransformationContainer(){
    let transformationContainer=document.getElementById('awaken-container');
    let previousTransformations = currentJson["Transforms from"]
    if( Array.isArray(previousTransformations) && previousTransformations.length){
        for (const transformationID of previousTransformations){
            
            const transformationJsonPromise = getJsonPromise("/dbManagement/jsons/",transformationID,".json");
            const transformationButton = new unitDisplay();
            transformationButton.setDisplayExtraInfo(false);
            transformationButton.setDisplay(true);
            transformationButton.setWidthFit(true);
            transformationButton.setHeightFit(true);
            transformationButton.container.style.gridRow="1";
            transformationContainer.appendChild(transformationButton.getElement());
            transformationJsonPromise.then(
                transformationJson => {
                    transformationButton.setResourceID(transformationJson["Resource ID"]);
                    transformationButton.setClass(transformationJson["Class"]);
                    transformationButton.setType(transformationJson["Type"]);
                    transformationButton.setRarity(transformationJson["Rarity"]);
                    transformationButton.setUrl(baseDomain+"/cards/index.html?id="+transformationID+"&SEZA="+isSeza+"&EZA="+isEza);
                }
            )
        }
    } 
    let transformations =currentJson["Transformations"];
    if( Array.isArray(transformations) && transformations.length){
        for (const transformationID of transformations){
            const transformationJsonPromise = getJsonPromise("/dbManagement/jsons/",transformationID,".json");
            const transformationButton = new unitDisplay();
            transformationButton.setDisplayExtraInfo(false);
            transformationButton.setDisplay(true);
            transformationButton.setWidthFit(true);
            transformationButton.setHeightFit(true);
            transformationButton.container.style.gridRow="1";
            transformationContainer.appendChild(transformationButton.getElement());
            transformationJsonPromise.then(
                transformationJson => {
                    transformationButton.setResourceID(transformationJson["Resource ID"]);
                    transformationButton.setClass(transformationJson["Class"]);
                    transformationButton.setType(transformationJson["Type"]);
                    transformationButton.setRarity(transformationJson["Rarity"]);
                    transformationButton.setUrl(baseDomain+"/cards/index.html?id="+transformationID+"&SEZA="+isSeza+"&EZA="+isEza);
                }
            )
        }
    } 
    
}

function createLevelSlider(){
    let levelSlider=document.getElementById('level-slider');
    let levelInput=document.getElementById('level-input');
    levelSlider.min=currentJson["Min Level"];
    levelInput.min=currentJson["Min Level"];
    levelSlider.max = currentJson["Max Level"];
    levelInput.max=currentJson["Max Level"];
    levelInput.value=currentJson["Max Level"];
    levelSlider.value=currentJson["Max Level"];
    if(currentJson["Min Level"]==currentJson["Max Level"]){
        levelInput.disabled = true;
        levelSlider.style.display = "none";
    }
    else{
        levelInput.disabled = false;
        levelSlider.style.display = "block";
    }

    levelSlider.addEventListener('input', function(){
        levelInput.value=levelSlider.value;
        updateBaseStats();
    });

    levelInput.addEventListener('input', function(){
      if(levelInput.value>levelSlider.max){
        levelInput.value=levelSlider.max;
      }
        levelSlider.value=levelInput.value;
        updateBaseStats();
    });

    
}

function createStatsContainer(){
    const statsContainer=document.getElementById('stats-container');
    const statsContainerObject= new statsContainerClass(0,0,0);
    statsContainer.appendChild(statsContainerObject.getElement());
}

function createPathButtons(){
    const pathButtons = Array.from(document.querySelectorAll('.toggle-btn1, .toggle-btn2, .toggle-btn3, .toggle-btn4'));
    pathButtons[0].style.gridColumn = "1"
    pathButtons[0].style.gridRow = "1"

    pathButtons[1].style.gridColumn = "3"
    pathButtons[1].style.gridRow = "1"

    pathButtons[2].style.gridColumn = "1"
    pathButtons[2].style.gridRow = "3"

    pathButtons[3].style.gridColumn = "3"
    pathButtons[3].style.gridRow = "3"
    // Add event listeners to toggle buttons
    pathButtons.forEach(button => {
      button.addEventListener('click', function() {
        button.classList.toggle('active');
        const starButton=document.getElementById('star-button');
        //if 55% is not active, make it active
        if (!starButton.classList.contains('active')) {
          starButton.classList.toggle('active');
        }
        //if every button is active, turn on rainbow star
        if(pathButtons.every(button => button.classList.contains('active'))){
          starButton.classList.remove('active');
          starButton.classList.add('rainbow')
        }
        //if rainbow star is active, turn it off 
        else{
          starButton.classList.remove('rainbow');
        }
        updateBaseStats();
      });
    });
}

function createDokkanAwakenContainer(){
    let AwakeningsContainer=document.getElementById('awaken-container');
    let Awakenings =currentJson["Dokkan awakenings"];
    if( Array.isArray(Awakenings) && Awakenings.length){
    }for (const AwakeningsID of Awakenings){
        const awakeningJsonPromise = getJsonPromise("/dbManagement/jsons/",AwakeningsID,".json");
        const AwakeningsButton = new unitDisplay();
        AwakeningsButton.setDisplayExtraInfo(false);
        AwakeningsButton.setDisplay(true);
        AwakeningsButton.setWidthFit(true);
        AwakeningsButton.setHeightFit(true);
        AwakeningsButton.container.style.gridRow="1";
        AwakeningsContainer.appendChild(AwakeningsButton.getElement());
        awakeningJsonPromise.then(
            awakeningJson => {
                AwakeningsButton.setResourceID(awakeningJson["Resource ID"]);
                AwakeningsButton.setClass(awakeningJson["Class"]);
                AwakeningsButton.setType(awakeningJson["Type"]);
                AwakeningsButton.setRarity(awakeningJson["Rarity"]);
                AwakeningsButton.setUrl(baseDomain+"/cards/index.html?id=" + awakeningJson["ID"]);
            }
        )
    }

    let previousAwakenings =currentJson["Dokkan Reverse awakenings"];
    if( Array.isArray(previousAwakenings) && previousAwakenings.length){
    }for (const AwakeningsID of previousAwakenings){
        const previousAwakeningJsonPromise = getJsonPromise("/dbManagement/jsons/",AwakeningsID,".json");
        const AwakeningsButton = new unitDisplay();
        AwakeningsButton.setDisplayExtraInfo(false);
        AwakeningsButton.setDisplay(true);
        AwakeningsButton.setWidthFit(true);
        AwakeningsButton.setHeightFit(true);
        AwakeningsButton.container.style.gridRow="2";
        AwakeningsContainer.appendChild(AwakeningsButton.getElement());
        previousAwakeningJsonPromise.then(
            previousAwakeningJson => {
                AwakeningsButton.setResourceID(previousAwakeningJson["Resource ID"]);
                AwakeningsButton.setClass(previousAwakeningJson["Class"]);
                AwakeningsButton.setType(previousAwakeningJson["Type"]);
                AwakeningsButton.setRarity(previousAwakeningJson["Rarity"]);
                AwakeningsButton.setUrl(baseDomain+"/cards/index.html?id=" + previousAwakeningJson["ID"]);
            }
        )
    }

}

function createStarButton(){
    const toggleButtons = Array.from(document.querySelectorAll('.toggle-btn1, .toggle-btn2, .toggle-btn3, .toggle-btn4'));
    const starButton=document.getElementById('star-button');
    starButton.classList.add('active');
    starButton.addEventListener('click', function() {
      if(starButton.classList.contains('active')){
        starButton.classList.remove('active');
        starButton.classList.add('rainbow')
        toggleButtons.forEach(button => button.classList.add('active'));   
      } else if(starButton.classList.contains('rainbow')){
        starButton.classList.remove('rainbow');
        toggleButtons.forEach(button => button.classList.remove('active'));
      } else {
        starButton.classList.add('active');
      }
        updateBaseStats();
    });
}


function createKiCirclesWithClass(){
    let kiContainer = document.getElementById("ki-container");
    while (kiContainer.firstChild) {
        kiContainer.removeChild(kiContainer.firstChild);
    }
    
    let row=2;
    for(const attack in additionalAttacks){
        let kiCircle;
        if(attack=="0"){        
            kiCircle = new kiCircleClass(attack,queriesToLogic(passiveQueryList),100,100,0);
        }
        else if(attack=="Hidden potential"||additionalAttacks[attack]=="Predictor" ){
            kiCircle = new kiCircleClass(attack,queriesToLogic(passiveQueryList),0,0,0);
        }
        else{
            kiCircle = new kiCircleClass(attack,queriesToLogic(passiveQueryList),currentJson["Passive"][attack]["Chance"]||100,currentJson["Passive"][attack]["Additional Attack"]["Chance of super"],0);
        }
        kiCircleDictionary[attack]=(kiCircle);
        if(attack==0){
            kiCircle.changeGridRow("1");
        }
        else{
            kiCircle.changeGridRow(2);
        }
        kiContainer.appendChild(kiCircle.getElement());
        
    }
}




function typeToColor(type){
    if(type.toLowerCase()=="agl"){
        return("#0000FF")
    }
    if(type.toLowerCase()=="str"){
        return("#FF0000")
    }
    if(type.toLowerCase()=="teq"){
        return("#00FF00")
    }
    if(type.toLowerCase()=="phy"){
        return("#FFFF00")
    }
    if(type.toLowerCase()=="int"){
        return("#FF00FF")
    }
    if(type.toLowerCase()=="candy"){
        return("#FFFFFF")
    }
}


function colorToBackground(color){
    if(color=="#0000FF"){
        return("#28147C")
    }
    if(color=="#FF0000"){
        return("#711100")
    }
    if(color=="#00FF00"){
        return("#004f17")
    }
    if(color=="#FFFF00"){
        return("#b07404")
    }
    if(color=="#FF00FF"){
        return("#680474")
    }
    if(color=="#FFFFFF"){
        return("#FFFFFF")
    }
}

function updateQueryListWithPassiveLine(passiveLine){
    if(passiveLine["Condition"]!=undefined){
        for(const CausalityKey of Object.keys(passiveLine["Condition"]["Causalities"])){
            const Causality = passiveLine["Condition"]["Causalities"][CausalityKey];
            let queryUpdated=false;
            if(isEmptyDictionary(Causality.Button)){
                if(isEmptyDictionary(Causality.Slider)){
                    console.log("EMPTY CONDITION???");
                }
                else{
                    for (const query of passiveQueryList){
                        if(query.sliderName==Causality.Slider["Name"]){
                            query.min=Math.min(Causality.Slider["Min"],query.min);
                            query.max=Math.max(Causality.Slider["Max"],query.max);
                            query.changeType("slider");
                            queryUpdated=true;
                        }
                    }
                    if(queryUpdated==false){
                        passiveQueryList.push( new passiveQuery("slider","",Causality.Slider["Name"],Causality.Slider["Min"],Causality.Slider["Max"]) );
                    }
                }
            }
            else{
                if(isEmptyDictionary(Causality.Slider)){
                    for (const query of passiveQueryList){
                        if(query.buttonName==Causality.Button["Name"]){
                            queryUpdated=true;
                        }
                    }
                    if(queryUpdated==false){
                        passiveQueryList.push( new passiveQuery("button",Causality.Button["Name"],0,0) );
                    }
                }
                //You have a button and a slider
                else{
                    for (const query of passiveQueryList){
                        if(query.buttonName==Causality.Button["Name"] && query.type=="button"){
                            queryUpdated=true;
                        }
                    }
                    if(queryUpdated==false){
                        for (const query of passiveQueryList){
                            if(query.sliderName==Causality.Slider["Name"]){
                                query.min=(Math.min(Causality.Slider["Min"],query.min)||query.min);
                                query.max=(Math.max(Causality.Slider["Max"],query.max)||query.max);
                                query.changeType("slider");
                                queryUpdated=true;
                            }
                        }
                    }
                    if(queryUpdated==false){
                        passiveQueryList.push( new passiveQuery("button",Causality.Button["Name"],Causality.Slider["Name"],Causality.Slider["Min"],Causality.Slider["Max"]) );
                    }
                }
            }
        }
    }

    if("Building Stat" in passiveLine){
        let queryUpdated=false;
        let sliderName=passiveLine["Building Stat"]["Slider"];
        let slowestStatAmount=Number.MAX_SAFE_INTEGER;
        for (const param of Object.keys(passiveLine)){
            if(param=="ATK" || param=="DEF" || param=="Ki" || param=="DR" || param=="Crit Chance"){
                slowestStatAmount=Math.min(slowestStatAmount,passiveLine[param]);
            }
        }
        if(sliderName.includes("Ki Spheres have been obtained")){
            slowestStatAmount=1;
        }
        let min=Math.floor(passiveLine["Building Stat"]["Min"]/slowestStatAmount);
        let max=Math.ceil(passiveLine["Building Stat"]["Max"]/slowestStatAmount);

        
        for (const query of passiveQueryList){
            if(query.sliderName==sliderName){
                query.min=Math.min(min,query.min);
                query.max=Math.max(max,query.max);
                query.changeType("slider");
                queryUpdated=true;
            }
        }
        if(!queryUpdated){
            if(passiveLine["Building Stat"]["Cause"]["Cause"]=="Look Elsewhere"){
                passiveQueryList.push( new passiveQuery("slider","",sliderName,min,max) );
            }
            else if(passiveLine["Building Stat"]["Cause"]["Cause"]=="HP"){
                passiveQueryList.push( new passiveQuery("slider",passiveLine["Building Stat"]["Slider"],sliderName,0,100) );
            }
            else{
                passiveQueryList.push( new passiveQuery("slider","",passiveLine["Building Stat"]["Slider"],min,max) );
            }
        }
    }
}

function updateQueryListWithUnitSuperLine(unitSuperAttack){
    for(const CausalityKey of Object.keys(unitSuperAttack["superCondition"]["Causalities"])){
        const Causality = unitSuperAttack["superCondition"]["Causalities"][CausalityKey];
        let queryUpdated=false;
        if(isEmptyDictionary(Causality.Button)){
            if(isEmptyDictionary(Causality.Slider)){
                console.log("EMPTY CONDITION???");
            }
            else{
                for (const query of passiveQueryList){
                    if(query.sliderName==Causality.Slider["Name"]){
                        query.min=Math.min(Causality.Slider["Min"],query.min);
                        query.max=Math.max(Causality.Slider["Max"],query.max);
                        query.changeType("slider");
                        queryUpdated=true;
                    }
                }
                if(queryUpdated==false){
                    passiveQueryList.push( new passiveQuery("slider","",Causality.Slider["Name"],Causality.Slider["Min"],Causality.Slider["Max"]) );
                }
            }
        }
        else{
            if(isEmptyDictionary(Causality.Slider)){
                for (const query of passiveQueryList){
                    if(query.buttonName==Causality.Button["Name"]){
                        queryUpdated=true;
                    }
                }
                if(queryUpdated==false){
                    passiveQueryList.push( new passiveQuery("button",Causality.Button["Name"],0,0) );
                }
            }
            //You have a button and a slider
            else{
                for (const query of passiveQueryList){
                    if(query.buttonName==Causality.Button["Name"] && query.type=="button"){
                        queryUpdated=true;
                    }
                }
                if(queryUpdated==false){
                    for (const query of passiveQueryList){
                        if(query.sliderName==Causality.Slider["Name"]){
                            query.min=(Math.min(Causality.Slider["Min"],query.min)||query.min);
                            query.max=(Math.max(Causality.Slider["Max"],query.max)||query.max);
                            query.changeType("slider");
                            queryUpdated=true;
                        }
                    }
                }
                if(queryUpdated==false){
                    passiveQueryList.push( new passiveQuery("button",Causality.Button["Name"],Causality.Slider["Name"],Causality.Slider["Min"],Causality.Slider["Max"]) );
                }
            }
        }
    }
}

function updateChanceList(passiveLine){
    const newChanceQuery=new passiveButton(
        0,
        0,
        "Does the "+passiveLine["Chance"]+" chance of "+passiveLine["Brief effect description"]+" activate?",
        null
    );
    newChanceQuery.referenceLine=passiveLine;
    passiveChanceList[passiveLine["ID"]]=(newChanceQuery);
}

function createDomainContainer(){
    
    //TODO: DOMAIN IMAGE IS STORED IN C:/Users/horva/OneDrive - Trinity College Dublin/Documents/dokkan/frontend/dbManagement/DokkanFiles/global/en/outgame/extension/dokkan_field/field_thumb_image_3007 and similar
    let domainContainer=document.getElementById('domain-container');
    const domainDropDown=document.createElement('div');
    domainDropDown.className="domain-dropdown";
    domainDropDown.label=document.createElement('label');
    domainDropDown.label.textContent="Domain: ";
    domainDropDown.select=document.createElement('select');
    domainDropDown.appendChild(domainDropDown.label);
    domainDropDown.appendChild(domainDropDown.select);
    domainDropDown.select.addEventListener("change", function(){
        currentDomain=domainDropDown.select.value
        refreshDomainBuffs()
    })
    domainContainer.domain=domainDropDown;
    domainContainer.appendChild(domainDropDown);

    const nullOption = document.createElement('option');
    nullOption.value = null;
    nullOption.textContent = "No domain";
    if(currentJson["Domain"]!=null && currentJson["Domain"]["Locked"]==true){
        currentDomain=currentJson["Domain"]["ID"];
        const option = document.createElement('option');
        option.value = currentDomain;
        option.textContent = domainData[currentDomain]["Name"];
        domainDropDown.select.appendChild(option);
    }
    else if(currentJson["Domain"]!=null && currentJson["Domain"]["Locked"]==false){
        currentDomain=currentJson["Domain"]["ID"];
        domainDropDown.select.appendChild(nullOption);
        for (const domainKey in domainData){
            const domain = domainData[domainKey];
            const option = document.createElement('option');
            option.value = domain["ID"];
            option.textContent = domain["Name"];
            domainDropDown.select.appendChild(option);
            if(domain["ID"]==currentDomain){
                option.selected=true;
            }
        }
        
    }
    else if(currentJson["Domain"]==null){
        currentDomain="null";    
        domainDropDown.select.appendChild(nullOption);  
        for (const domainKey in domainData){
            const domain = domainData[domainKey];
            const option = document.createElement('option');
            option.value = domain["ID"];
            option.textContent = domain["Name"];
            domainDropDown.select.appendChild(option);
        }
    }

    const domainImage=document.createElement('img');
    domainContainer.appendChild(domainImage);
    domainImage.className="domain-image";
    domainImage.id="domain-image";
    domainImage.style.display="none";
    refreshDomainBuffs(false);
}

function refreshDomainBuffs(updatePassiveStatsBool=true){
    for(const Query of passiveQueryList){
        if(Query.type=="button"){
            if(Query.buttonName.startsWith("Is the Domain ") && Query.buttonName.includes(" active")){
                const queryDomain=Query.buttonName.substring(14,Query.buttonName.length-7);
                if(currentDomain=="null"){
                    Query.updateValue(false)
                }
                else{
                    Query.updateValue(domainData[currentDomain]["Name"]==queryDomain,false);
                }
            }
        }
    }

    domainBuffs={"ATK":0,"DEF":0,"Increased damage recieved":0}
    if(currentDomain!="null"){
        domainBuffs={"ATK":0,"DEF":0,"Increased damage recieved":0};
        let domain=domainData[currentDomain];
        for (const efficiacyKey in domain["Efficiacies"]){
            const efficiacy = domain["Efficiacies"][efficiacyKey];
            let efficiacyActive=false;
            if(efficiacy["superCondition"]!=undefined){
                let efficiacyLogic=efficiacy["superCondition"]["Logic"];
                efficiacyLogic=" "+efficiacyLogic+" ";
                efficiacyLogic=efficiacyLogic.replaceAll("("," ( ").replaceAll(")"," ) ");
                for (const causalityKey of Object.keys(efficiacy["superCondition"]["Causalities"])){
                    const causality = efficiacy["superCondition"]["Causalities"][causalityKey];
                    let categoryMatch= false;
                    if(causality["Category"]=="any"){
                        categoryMatch=true;
                    }
                    else{
                        categoryMatch=currentJson.Categories.includes(causality["Category"]);
                    }
                    let classMatch=false;
                    if(causality["Class"]=="any"){
                        classMatch=true;
                    }
                    else{
                        classMatch=currentJson.Class.toUpperCase()==(causality["Class"]).toUpperCase();
                    }
                    if(categoryMatch && classMatch){
                        efficiacyLogic=efficiacyLogic.replaceAll(" "+causalityKey+" "      ,      " true ");
                    }
                    else{
                        efficiacyLogic=efficiacyLogic.replaceAll(" "+causalityKey+" "      ,      " false ");
                    }
                }
                efficiacyActive=eval(efficiacyLogic);
            }
            if(efficiacy["Effect"]["Type"]=="ATK & DEF" && efficiacyActive && (efficiacy["Timing"] == "On domain Being out" || efficiacy["Timing"]=="At the start of turn")){
                domainBuffs["ATK"]+=efficiacy["Effect"]["ATK"];
                domainBuffs["DEF"]+=efficiacy["Effect"]["DEF"];
            }
        }
        
    }

    const domainImage=document.getElementById('domain-image');
    if(currentDomain=="null"){
        domainImage.style.display="none";
    }
    else{
        domainImage.style.display="block";
        domainImage.src="/dbManagement/DokkanFiles/global/en/outgame/extension/dokkan_field/field_thumb_image_"+domainData[currentDomain]["Resource ID"]+"/field_thumb_image_"+domainData[currentDomain]["Resource ID"]+".png"
    }

    if(updatePassiveStatsBool){
        updatePassiveStats()
    }
}


function createPassiveContainer(){
    passiveQueryList=[]
    passiveChanceList=[]
    let passiveSupportContainer=document.getElementById('passive-support-container');
    let passiveQueryContainer = document.getElementById('passive-query-container');
    let passiveChanceContainer=document.getElementById('passive-chance-container');
    while (passiveQueryContainer.firstChild) {
        passiveQueryContainer.removeChild(passiveQueryContainer.firstChild);
    }
    while (passiveChanceContainer.firstChild) {
        passiveChanceContainer.removeChild(passiveChanceContainer.firstChild);
    }


    if(!(passiveSupportContainer.firstChild)){
        const passiveATKSupport=document.createElement('div');
        passiveATKSupport.label=document.createElement('label');
        passiveATKSupport.input=document.createElement('input');
        passiveATKSupport.input.type="number";
        passiveATKSupport.input.value="0";
        passiveATKSupport.addEventListener('input', function(){
            if(this.input.value==""){
                supportBuffs["ATK"]=0;
            }
            else{
                supportBuffs["ATK"]=parseInt(this.input.value);
            }
            updatePassiveStats();
        });
        passiveATKSupport.appendChild(passiveATKSupport.label);
        passiveATKSupport.appendChild(passiveATKSupport.input);
        passiveATKSupport.label.textContent="ATK Support: ";
        passiveSupportContainer.ATKsupport=passiveATKSupport;
        passiveSupportContainer.appendChild(passiveATKSupport);
        

        const passiveDEFSupport=document.createElement('div');
        passiveDEFSupport.label=document.createElement('label');
        passiveDEFSupport.input=document.createElement('input');
        passiveDEFSupport.input.type="number";
        passiveDEFSupport.input.value="0";
        passiveDEFSupport.appendChild(passiveDEFSupport.label);
        passiveDEFSupport.appendChild(passiveDEFSupport.input);
        passiveDEFSupport.addEventListener('input', function(){
            if(this.input.value==""){
                supportBuffs["DEF"]=0;
            }
            else{
                supportBuffs["DEF"]=parseInt(this.input.value);
            }
            updatePassiveStats();
        });
        passiveDEFSupport.label.textContent="DEF Support: ";
        passiveSupportContainer.DEFsupport=passiveDEFSupport;
        passiveSupportContainer.appendChild(passiveDEFSupport);

        const passiveKiSupport=document.createElement('div');
        passiveKiSupport.label=document.createElement('label');
        passiveKiSupport.input=document.createElement('input');
        passiveKiSupport.input.type="number";
        passiveKiSupport.input.value="0";
        passiveKiSupport.appendChild(passiveKiSupport.label);
        passiveKiSupport.appendChild(passiveKiSupport.input);
        passiveKiSupport.addEventListener('input', function(){
            if(passiveKiSupport.input.value==""){
                kiSources.Support=0;
            }
            else{
                kiSources.Support=parseInt(passiveKiSupport.input.value);
            }
            updatePassiveStats();
        });
        passiveKiSupport.label.textContent="Ki Support: ";
        passiveSupportContainer.Kisupport=passiveKiSupport;
        passiveSupportContainer.appendChild(passiveKiSupport);
    }
    
    
    
    let passiveList=currentJson.Passive;

    for (const passiveLineKey of Object.keys(passiveList)) {
        if(arraysHaveOverlap(relevantPassiveEffects, Object.keys(passiveList[passiveLineKey]))){
            updateQueryListWithPassiveLine(passiveList[passiveLineKey]);
        }
        if(Object.keys(passiveList[passiveLineKey]).includes("Chance") && !(Object.keys(passiveList[passiveLineKey]).includes("Additional Attack"))){
            updateChanceList(passiveList[passiveLineKey]);
        }
    }

    for (const superAttack of Object.values(currentJson["Super Attack"])) {
        if("superCondition" in superAttack){
            updateQueryListWithUnitSuperLine(superAttack);
        }
    }

    for (const query of passiveQueryList) {
        passiveQueryContainer.appendChild(query.getElement());
    }

    for (const query of Object.values(passiveChanceList)){
        passiveChanceContainer.appendChild(query.getElement());
    }
}

function initialiseAspects() {
    updateCharacterIcon('character-icon', currentJson["Resource ID"], currentJson.Type);
    document.getElementById("level-container").style.display="flex";

    //change the background of the slider to the type color
    document.title="["
    document.title+=currentJson["Leader Skill"]["Name"];
    document.title+="] ";
    document.title+=currentJson.Name;

    additionalAttacks={0: "Unactivated"};
    for (const passiveLineKey of Object.keys(currentJson.Passive)) {
        if("Additional Attack" in currentJson.Passive[passiveLineKey]){
            additionalAttacks[passiveLineKey]="Unactivated";
        }
    }
    if(currentJson["Rarity"]=="ur" || currentJson["Rarity"]=="lr"){
        additionalAttacks["Hidden potential"]= "Unactivated";
    }

  }

function createSuperAttackContainer(){

    let superQuestionsContainer= document.getElementById('super-attack-questions-container');
    while (superQuestionsContainer.firstChild) {
        superQuestionsContainer.removeChild(superQuestionsContainer.firstChild);
    }
    let superAttackss=currentJson["Super Attack"];
    for (const key of Object.keys(superAttackss)){
        let superAttack = superAttackss[key];
        let superAttackObject;
        if(superAttack["superStyle"]=="Normal"){
            superAttackObject = new superAttackQueryHolder(superAttack,currentJson["Max Super Attacks"],currentJson["Max Appearances In Form"],currentJson["ID"]);
        }
        else{
            superAttackObject = new superAttackQueryHolder(superAttack,1,currentJson["Max Appearances In Form"],currentJson["ID"]);
        }
        if(superAttackObject.getElement().firstChild){
            superQuestionsContainer.appendChild(superAttackObject.getElement());
        }
    }
    for(const key of currentJson["Transforms from"]){
        let transformPromise;
        const urlParams=new URLSearchParams(window.location.search);
        if(isSeza){
            transformPromise=getJsonPromise('/dbManagement/jsonsSEZA/',key,'.json');
        }
        else if(isEza){
            transformPromise=getJsonPromise('/dbManagement/jsonsEZA/',key,'.json');
        }
        else{
            transformPromise=getJsonPromise('/dbManagement/jsons/',key,'.json');
        }
        transformPromise.then((json)=>{
            let superAttackss=json["Super Attack"];
            for (const key of Object.keys(superAttackss)){
                let superAttack = superAttackss[key];
                let superAttackObject;
                if(superAttack["superStyle"]=="Normal"){
                    superAttackObject = new superAttackQueryHolder(superAttack,json["Max Super Attacks"],json["Max Appearances In Form"],json["ID"]);
                }
                else{
                    superAttackObject = new superAttackQueryHolder(superAttack,1,json["Max Appearances In Form"],json["ID"]);
                }
                if(superAttackObject.getElement().firstChild){
                superQuestionsContainer.appendChild(superAttackObject.getElement());
            }
            }
        });
    }
}



 function updateCharacterIcon(){
    const imageContainer = document.getElementById("character-icon");
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }

    const cardImage=new unitDisplay();
    cardImage.setResourceID(currentJson["Resource ID"]);
    cardImage.setClass(currentJson["Class"]);
    cardImage.setType(currentJson["Type"]);
    cardImage.setRarity(currentJson["Rarity"]);
    cardImage.setDisplayExtraInfo(false);
    cardImage.setDisplay(true);
    cardImage.setWidthFit(true);
    cardImage.setHeightFit(true);

    if(currentJson["Can SEZA"]){
        cardImage.setPossibleEzaLevel("seza");
        if(isSeza){
            cardImage.setEzaLevel("seza");
        }
        else if(isEza){
            cardImage.setEzaLevel("eza");
        }
        else{
            cardImage.setEzaLevel("none");
        }
        cardImage.addPressableEza(function(){
            updateQueryStringParameter('EZA', !isEza);
            updateQueryStringParameter('SEZA', 'false');
            loadPage();
        })
        cardImage.addPressableSeza(function(){
            updateQueryStringParameter('EZA', 'true');
            updateQueryStringParameter('SEZA', !isSeza);
            loadPage();
        })
    }
    else if(currentJson["Can EZA"]){
        cardImage.setPossibleEzaLevel("eza");
        if(isEza){
            cardImage.setEzaLevel("eza");
        }
        else{
            cardImage.setEzaLevel("none");
        }
        cardImage.addPressableEza(function(){
            updateQueryStringParameter('EZA', !isEza);
            loadPage();
        })
    }



    if(isSeza){
        cardImage.setEzaLevel("seza");
    }
    else if(isEza){
        cardImage.setEzaLevel("eza");
    }
    else{
        cardImage.setEzaLevel("none");
    }
    if(currentJson["Can SEZA"]){
        cardImage.setPossibleEzaLevel("seza");
        cardImage.addPressableEza(function(){

        })
    }
    else if(currentJson["Can EZA"]){
        cardImage.setPossibleEzaLevel("eza");
        cardImage.addPressableSeza(function(){
            
        })
    }
    else{
        cardImage.setPossibleEzaLevel("none");
    }

    imageContainer.appendChild(cardImage.getElement());
    //imageContainer.style.backgroundColor = colorToBackground(typeToColor(type));


    document.body.style.backgroundColor = colorToBackground(typeToColor(currentJson["Type"]));
}

function updateSuperAttackStacks(){
    let superAttacksQuestionsContainer = document.querySelector('#super-attack-questions-container');
    let superAttackStacks = superAttacksQuestionsContainer.children;
    let totalATKBuff = 0;
    let totalDEFBuff = 0;
    let totalEnemyDEFBuff = 0;
    let totalEnemyATKBuff = 0;
    let totalCritBuff = 0;
    let totalEvasionBuff = 0;

    for (const superAttack of superAttackStacks){
        if (superAttack.children.length!=0) {
            for(const question of superAttack.children){
                let superAttacksPerformed;
                let buffs=question.buffs;
                for(const div of question.children){
                    if(div.localName=="input"){
                        superAttacksPerformed = parseInt(div.value);
                    }
                }
                for (const buffKey in buffs){
                    const buff=buffs[buffKey];
                    if(buffKey=="ATK"){
                        if(buffs["Target"] == "Self"){
                            totalATKBuff += buff*superAttacksPerformed;
                        }
                        else if(buffs["Target"] == "Enemy"){
                            totalEnemyATKBuff += buff*superAttacksPerformed;
                        }
                        else{
                            console.log("UNKNOWN TARGET");
                        }
                    }
                    if(buffKey=="DEF"){
                        if(buffs["Target"] == "Self"){
                            totalDEFBuff += buff*superAttacksPerformed;
                        }
                        else if(buffs["Target"] == "Enemy"){
                            totalEnemyDEFBuff += buff*superAttacksPerformed;
                        }
                        else{
                            console.log("UNKNOWN TARGET");
                        }
                    }
                    if(buffKey=="Crit"){
                        totalCritBuff += buff*staAmount*superAttacksPerformed;
                    }
                    if(buffKey=="Evasion"){
                        totalEvasionBuff += buff*superAttacksPerformed;
                    }
                }
            }
            
        };
    }

    superBuffs={"ATK": totalATKBuff, "DEF": totalDEFBuff, "Enemy ATK": totalEnemyATKBuff, "Enemy DEF": totalEnemyDEFBuff, "Crit": totalCritBuff, "Evasion": totalEvasionBuff};
    updatePassiveStats();
    
}   

function createLinkBuffs(){
    // Select all link sliders and buttons within a specific parent
    let linksContainer = document.querySelector('#links-container');
    let linkSliders = linksContainer.querySelectorAll('input[type=range]');
    let linkButtons = linksContainer.querySelectorAll('button');

    // Initialize variables to store the total link buffs
    let totalATKBuff = 0;
    let totalDEFBuff = 0;
    let totalEnemyDEFBuff = 0;
    let totalHealBuff = 0;
    let totalKIBuff = 0;
    let totalDamageReductionBuff = 0;
    let totalCritBuff = 0;
    let totalEvasionBuff = 0;

    // Iterate over each link slider and button
    linkSliders.forEach((slider, index) => {
      if(linkButtons[index].textContent.split(' Level')[0]=="All Links") return;
      if(!linkButtons[index].classList.contains('active')) return;
      let linkName = linkButtons[index].textContent.split(' Level')[0];
      
      let linkLevel = parseInt(slider.value);
      let linksData = linkData[linkName][linkLevel];

      // Add the link buffs to the total link buffs
      totalATKBuff += linksData.ATK || 0;
      totalDEFBuff += linksData.DEF || 0;
      totalEnemyDEFBuff += linksData.ENEMYDEF || 0;
      totalHealBuff += linksData.HEAL || 0;
      totalKIBuff += linksData.KI || 0;
      totalDamageReductionBuff += linksData.DREDUCTION || 0;
      totalCritBuff += linksData.CRIT || 0;
      totalEvasionBuff += linksData.EVASION || 0;
    });

    // Create a paragraph element to display the total link buffs
    linkBuffs={"ATK":totalATKBuff,"DEF":totalDEFBuff,"Enemy DEF":totalEnemyDEFBuff,"Heal":totalHealBuff,"KI":totalKIBuff,"Damage Reduction":totalDamageReductionBuff,"Crit":totalCritBuff,"Evasion":totalEvasionBuff};
    kiSources["Links"] = totalKIBuff;
    let linkBuffElement = document.createElement('p');
    linkBuffElement.style.width=""
    linkBuffElement.id = "link-buffs";
    linkBuffElement.innerHTML = "Link Buffs: ";
    if (totalATKBuff) linkBuffElement.innerHTML += "<br>ATK: " + totalATKBuff + "% ";
    if (totalDEFBuff) linkBuffElement.innerHTML += "<br>DEF: " + totalDEFBuff + "% ";
    if (totalEnemyDEFBuff) linkBuffElement.innerHTML += "<br>Enemy DEF: " + totalEnemyDEFBuff + "% ";
    if (totalHealBuff) linkBuffElement.innerHTML += "<br>Heal: " + totalHealBuff + "% ";
    if (totalKIBuff) linkBuffElement.innerHTML += "<br>KI: " + totalKIBuff + " ";
    if (totalDamageReductionBuff) linkBuffElement.innerHTML += "<br>Damage Reduction: " + totalDamageReductionBuff + "% ";
    if (totalCritBuff) linkBuffElement.innerHTML += "<br>Crit: " + totalCritBuff + "% ";
    if (totalEvasionBuff) linkBuffElement.innerHTML += "<br>Evasion: " + totalEvasionBuff + "% ";
    //remove the old paragraph from the links container
    linksContainer.removeChild(linksContainer.lastChild);



    // Append the paragraph element to the links container
    linksContainer.appendChild(linkBuffElement);
  }


function queriesToLogic(queries){
    let output={}
    for (const query of queries){
        if(query["type"]=="slider"){
            output[query["sliderName"]]=parseInt(query.currentValue());
        }
        else if(query["type"]=="button"){
            output[query["buttonName"]]=query.currentValue();
        }
    }
    return(output);
}


function createSkillOrbContainer(){
    let skillOrbContainer=document.getElementById('all-skill-orb-container');
    skillOrbContainer.style.display="grid";
    skillOrbContainer.additionalNode=new equipNodeQuery("Additional","/dbManagement/DokkanFiles/global/en/outgame/extension/potential/pot_skill_01_on.png")
    skillOrbContainer.appendChild(skillOrbContainer.additionalNode.getElement());

    skillOrbContainer.critNode=new equipNodeQuery("Crit","/dbManagement/DokkanFiles/global/en/outgame/extension/potential/pot_skill_02_on.png")
    skillOrbContainer.appendChild(skillOrbContainer.critNode.getElement());

    skillOrbContainer.evasionNode=new equipNodeQuery("Evasion","/dbManagement/DokkanFiles/global/en/outgame/extension/potential/pot_skill_03_on.png")
    skillOrbContainer.appendChild(skillOrbContainer.evasionNode.getElement());

    skillOrbContainer.typeATKBoostNode=new equipNodeQuery("Attack","/dbManagement/DokkanFiles/global/en/outgame/extension/potential/pot_skill_04_on.png")
    skillOrbContainer.appendChild(skillOrbContainer.typeATKBoostNode.getElement());

    skillOrbContainer.typeDEFBoostNode=new equipNodeQuery("Defense","/dbManagement/DokkanFiles/global/en/outgame/extension/potential/pot_skill_05_on.png")
    skillOrbContainer.appendChild(skillOrbContainer.typeDEFBoostNode.getElement());

    skillOrbContainer.superAttackBoostNode=new equipNodeQuery("SuperBoost","/dbManagement/DokkanFiles/global/en/outgame/extension/potential/pot_skill_06_on.png")
    skillOrbContainer.appendChild(skillOrbContainer.superAttackBoostNode.getElement());

    skillOrbContainer.recoveryBoostNode=new equipNodeQuery("Recovery","/dbManagement/DokkanFiles/global/en/outgame/extension/potential/pot_skill_07_on.png")
    skillOrbContainer.appendChild(skillOrbContainer.recoveryBoostNode.getElement());


}

function changePassiveButton(buttonName, value){
    for (const Query of passiveQueryList){
        if(Query.buttonName==buttonName){
            Query.updateValue(value);
        }
    }
}

function changePassiveSlider(sliderName, value){
    for (const Query of passiveQueryList){
        if(Query.sliderName==sliderName){
            Query.updateValue(value);
        }
    }
}

function updateKiSphereBuffs(pageLoad=false){
    let kiGain=0;
    kiGain+=rainbowKiSphereAmount;
    if(currentJson["Type"]==currentKiSphere){
        kiGain+=currentKiSphereAmount;
    }
    if(currentKiSphere!="Candy"){
        kiGain+=currentKiSphereAmount;
    }

    for(const Query of passiveQueryList){
        if(Query.type=="slider"){
            if(Query.sliderName.startsWith("How many ")&& Query.sliderName.includes("Ki Spheres have been obtained on this turn?")){
                let kiText=Query["sliderName"].substring(9,Query["sliderName"].length-44);
                let kiTypes=kiText.split(" or ");
                let specificKiGain=0;
                if(kiText==""|| kiText==" "){
                    specificKiGain+=currentKiSphereAmount;
                    specificKiGain+=rainbowKiSphereAmount;
                }
                for (const kiType of kiTypes){
                    if(kiType==currentKiSphere){
                        specificKiGain+=currentKiSphereAmount;
                    }
                    if(kiType=="Rainbow"){
                        specificKiGain+=rainbowKiSphereAmount;
                    }
                }
                Query.updateValue(specificKiGain);
            }
        }
        else if(Query.type=="button"){
            if(Query.buttonName.startsWith("Has ")&& Query.buttonName.includes("Ki Spheres been obtained on this turn?")){
                const kiNeeded=extractDigitsFromString(Query.buttonName).replaceAll(" ","")
                const viableKiTypes=Query.buttonName.substring(14,Query.buttonName.length-39).split(" or ")
                let kiProgress=0
                for (const kiType of viableKiTypes){
                    if(kiType==currentKiSphere){
                        kiProgress+=currentKiSphereAmount
                    }
                    if(kiType=="Rainbow"){
                        kiProgress+=rainbowKiSphereAmount
                    }
                }
                Query.updateValue(kiProgress>=kiNeeded)
            }
        }
    }
    

    kiSources["Orbs"]=kiGain;
    if(pageLoad==false){
        updatePassiveStats();
    }
}

function createFinishContainer(){
    let maxChargeCount=0;
    const finishcontainer=document.getElementById("finish-container");
    if(currentJson["Finish Skill"]==null){
        finishcontainer.style.display="none";
    }
    else{
        finishType=Object.values(currentJson["Finish Skill"])[0]["Standby Exclusivity"]
        for (const possibleFinish of Object.values(currentJson["Finish Skill"])){
            if("Multiplier" in possibleFinish){
                finishDisplayed=true
            }
            if(possibleFinish["Standby Exclusivity"]=="charge"){
                maxChargeCount=Math.ceil((possibleFinish["Max multiplier"]-possibleFinish["Multiplier"])/possibleFinish["Multipler per charge"]);
            }
        }
        if(finishDisplayed){
            finishcontainer.titleLabel=document.createElement("label");
            finishcontainer.appendChild(finishcontainer.titleLabel);
            for(const possibleFinish of Object.values(currentJson["Finish Skill"])){
                finishcontainer.titleLabel.innerText+=possibleFinish["Name"];
                finishcontainer.titleLabel.innerText+="/n";
            }
            
            finishcontainer.Button=document.createElement("button");
            finishcontainer.Button = document.createElement('button');
            finishcontainer.Button.innerHTML = "Activate Finish Skill?";
            finishcontainer.Button.style.background="#FF5C35";
            finishcontainer.Button.style.zIndex=10;
            finishcontainer.Button.style.cursor="pointer";
            finishcontainer.Button.style.position="relative";
            finishcontainer.Button.parentClass=finishcontainer;
            finishcontainer.Button.onclick = function(){
            if(this.classList.contains('active')){
                if(finishType=="revival"){
                    changePassiveButton("Has this character or an ally attacking in the same turn been KO'd on this turn?",false);
                }
                this.style.background="#FF5C35"
                this.classList.remove('active');
                finishSkillPerformed=false
                updatePassiveStats();
            }
            else{
                if(finishType=="revival"){
                    changePassiveButton("Has this character or an ally attacking in the same turn been KO'd on this turn?",true);
                }
                finishSkillPerformed=true;
                this.classList.add('active');
                this.style.background="#00FF00"
                updatePassiveStats();
                //CALCULATE BASED ON CHARGES AND SUCH
            }

            finishcontainer.Slider=document.createElement("input");
            finishcontainer.Slider.type="range";
            finishcontainer.Slider.min=0;
            finishcontainer.Slider.max=maxChargeCount;
            finishcontainer.Slider.value=0;
            finishcontainer.Slider.style.position="relative";
            finishcontainer.Slider.style.zIndex="10";
            finishcontainer.appendChild(finishcontainer.Slider);
            finishcontainer.Slider.label=document.createElement("label");
            finishcontainer.Slider.label.innerHTML="Charges: "+finishcontainer.Slider.value
            finishcontainer.appendChild(finishcontainer.Slider.label);
            if(maxChargeCount==0){
                finishcontainer.Slider.style.display="none";
                finishcontainer.Slider.label.style.display="none";
            }
            finishcontainer.Slider.oninput=function(){
                finishSkillCharges=finishcontainer.Slider.value
                this.label.innerHTML="Charges: "+finishSkillCharges
                updatePassiveStats();
            }
            updatePassiveStats();
            }
            finishcontainer.appendChild(finishcontainer.Button);

            finishcontainer.kiCircle=new kiCircleClass("Finish",queriesToLogic(passiveQueryList),100,100,0);
            finishcontainer.kiCircle.updateKi("24");
            finishcontainer.appendChild(finishcontainer.kiCircle.getElement());
        }
    }
}


function createActiveContainer(){
    const activecontainer=document.getElementById("active-container");
    if(currentJson["Active Skill"]==null){
        activecontainer.style.display="none";
    }
    else{
        let needsDisplay=false;
        const relevantActiveEffects=[
            "ATK Buff",
            "DEF Buff",
            "Heals",
            "Ki Buff",
            "Effective against all",
            "Guard",
            "Crit Chance",
            "Dodge Chance",
            "Redirect attacks to me",
            "Effective Against All"
        ]

        for(const effectKey in currentJson["Active Skill"]["Effects"]){
            const effect=currentJson["Active Skill"]["Effects"][effectKey]["Effect"]["Buff"];
            if(relevantActiveEffects.includes(effect)){
                needsDisplay=true;
                break;
            }
        }

        if("Attack" in currentJson["Active Skill"]){
            needsDisplay=true;
        }

        if(!needsDisplay){
            activecontainer.style.display="none";
        }
        else{
            activecontainer.titleLabel=document.createElement("label");
            activecontainer.appendChild(activecontainer.titleLabel);
            activecontainer.titleLabel.innerText=currentJson["Active Skill"]["Name"];

            activecontainer.Condition=document.createElement("label");
            activecontainer.appendChild(activecontainer.Condition);
            activecontainer.Condition.innerText=currentJson["Active Skill"]["Condition Description"];
            
            activecontainer.Button=document.createElement("button");
            activecontainer.Button = document.createElement('button');
            activecontainer.Button.innerHTML = "Activate Active Skill?";
            activecontainer.Button.style.background="#FF5C35"
            activecontainer.Button.style.zIndex=10
            activecontainer.Button.style.cursor="pointer"
            activecontainer.Button.onclick = function(){
              if(activecontainer.Button.classList.contains('active')){
                activecontainer.Button.style.background="#FF5C35"
                activecontainer.Button.classList.remove('active');
                activeAttackPerformed=false
                activeMultipliers={"ATK":0,"DEF":0,"Effective against all":false,"Guard":false,"Dodge Chance":0,"Crit Chance":0,"Redirect attacks to me":false}
                kiSources["Active"]=0
              }
              else{
                activecontainer.Button.classList.add('active');
                activecontainer.Button.style.background="#00FF00"
                if("Attack" in currentJson["Active Skill"]){
                    activeAttackPerformed=true
                }
                for(const effectKey of Object.keys(currentJson["Active Skill"]["Effects"])){
                    const effect=currentJson["Active Skill"]["Effects"][effectKey]
                    if(effect["Effect"]["Buff"]=="Ki Buff"){
                        if(effect["Effect"]["+ or -"]=="+"){
                            kiSources["Active"]=effect["Effect"]["Amount"];
                        }
                        else{
                            kiSources["Active"]=-effect["Effect"]["Amount"];
                        }
                    }
                    else if(effect["Effect"]["Buff"]=="ATK Buff"){
                        if(effect["Effect"]["+ or -"]=="+"){
                            activeMultipliers["ATK"]=(effect["Effect"]["Amount"]/100);
                        }
                        else{
                            activeMultipliers["ATK"]=(effect["Effect"]["Amount"]/100);
                        }
                    }
                    else if(effect["Effect"]["Buff"]=="DEF Buff"){
                        if(effect["Effect"]["+ or -"]=="+"){
                            activeMultipliers["DEF"]=(effect["Effect"]["Amount"]/100);
                        }
                        else{
                            activeMultipliers["DEF"]=(effect["Effect"]["Amount"]/100);
                        }
                    }
                    else if(effect["Effect"]["Buff"]=="Dodge Chance"){
                        if(effect["Effect"]["+ or -"]=="+"){
                            activeMultipliers["Dodge"]=(effect["Effect"]["Amount"]/100);
                        }
                        else{
                            activeMultipliers["Dodge"]=-(effect["Effect"]["Amount"]/100);
                        }
                    }
                    else if(effect["Effect"]["Buff"]=="Crit Chance"){
                        if(effect["Effect"]["+ or -"]=="+"){
                            activeMultipliers["Crit"]=(effect["Effect"]["Amount"]/100);
                        }
                        else{
                            activeMultipliers["Crit"]=-(effect["Effect"]["Amount"]/100);
                        }
                    }
                    else if(effect["Effect"]["Buff"]=="Effective against all"){
                        activeMultipliers["Effective against all"]=true;
                    }
                    else if(effect["Effect"]["Buff"]=="Guard"){
                        activeMultipliers["Guard"]=true;
                    }
                    else if(effect["Effect"]["Buff"]=="Redirect attacks to me"){
                        activeMultipliers["Redirect attacks to me"]=true;
                    }
                    else{
                        console.log("UNACCOUNTED ACTIVE BUFF",effect["Effect"]["Buff"]);
                    }
                }
              }
              updatePassiveStats();
            }
            activecontainer.appendChild(activecontainer.Button);

            activecontainer.kiCircle=new kiCircleClass("Active",queriesToLogic(passiveQueryList),100,100,0);
            if(!("Attack" in currentJson["Active Skill"])){
                activecontainer.kiCircle.display(false);
            }

            activecontainer.appendChild(activecontainer.kiCircle.getElement());

        }

        
    }
}

function createDamageTakenContainer(){
    const damageTakenContainer=document.getElementById("enemy-defending-details-selection");
    const enemyTypingSelection = document.getElementById("enemy-defending-class-typing-selection");
    let columnCount=1;
    for (const possibleEnemyTyping of ["AGL","TEQ","INT","STR","PHY"]){
        const option=document.createElement("div");
        option.referenceTyping=possibleEnemyTyping;
        option.referenceData="Typing";
        option.style.backgroundImage='url("/dbManagement/DokkanFiles/global/en/layout/en/image/character/cha_type_icon_0'+typeToInt(possibleEnemyTyping)+'.png")';
        if(possibleEnemyTyping!=enemyTyping){
            option.style.filter="grayscale(90%)";
        }
        option.id="enemy-defending-class"+possibleEnemyTyping;
        option.className="enemy-defending-class-typing";
        option.style.gridRow="1";
        option.style.cursor="pointer";
        option.style.gridColumn=columnCount++;
        enemyTypingSelection.appendChild(option);
        option.addEventListener(
            "click", function(){
                enemyTyping=possibleEnemyTyping;
                updatePassiveStats();
            }
        )
    }

    columnCount=2;
    for (const possibleEnemyClass of ["Super","None","Extreme"]){
        const option=document.createElement("div");
        option.referenceClass=possibleEnemyClass;
        option.referenceData="Class";
        option.style.backgroundImage='url("/dbManagement/DokkanFiles/global/en/layout/en/image/character/cha_type_icon_'+classToInt(possibleEnemyClass)+typeToInt(enemyTyping)+'.png")';
        if(possibleEnemyClass!=enemyClass){
            option.style.filter="grayscale(90%)";
        }
        option.id="enemy-defending-typing"+possibleEnemyClass;
        option.className="enemy-defending-class-typing";
        option.style.gridColumn=columnCount++;
        option.style.gridRow="2";
        option.style.cursor="pointer";
        enemyTypingSelection.appendChild(option);
        option.addEventListener(
            "click", function(){
                enemyClass=possibleEnemyClass;
                updatePassiveStats();
            }
        )

    }
    //creating enemy typing and class complete
    const atkInput = document.getElementById("enemy-ATK-input");
    atkInput.value=(""+enemyATK).replace(/,/g, "").replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    atkInput.addEventListener("input", function(){
      // Remove any non-digit characters (except for commas)
      let value = this.value.replace(/,/g, "").replace(/\D/g, "");

      // Format the number with commas
      const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      // Update the input's value with the formatted number
      this.value = formattedValue;
      enemyATK=value;
      updateDamageTakenQueryContainer();
    });


    const defInput = document.getElementById("enemy-DEF-input");
    defInput.value=(""+enemyDEF).replace(/,/g, "").replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    defInput.addEventListener("input", function(){
      // Remove any non-digit characters (except for commas)
      let value = this.value.replace(/,/g, "").replace(/\D/g, "");

      // Format the number with commas
      const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      // Update the input's value with the formatted number
      this.value = formattedValue;
      enemyDEF=value;
      updateDamageTakenQueryContainer();
    });
    
    const drInput = document.getElementById("enemy-DR-input");
    drInput.value=(""+enemyDR).replace(/,/g, "").replace(/\D/g, "");
    drInput.addEventListener(
        "input", function(){
        // Remove any non-digit characters (except for commas)
        let value = this.value.replace(/,/g, "").replace(/\D/g, "");
        
        //limit the damageReduction to 100%
        if(value>100){
            value=100;
        }
        
        this.value=value;
        enemyDR=value;
        updateDamageTakenQueryContainer();
    })
    
    const atkThresholdInput = document.getElementById("enemy-ATK-threshold-input");
    atkThresholdInput.value=(""+enemyATKThreshold).replace(/,/g, "").replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    atkThresholdInput.addEventListener(
        "input", function(){
            // Remove any non-digit characters (except for commas)
            let value = this.value.replace(/,/g, "").replace(/\D/g, "");

            // Format the number with commas
            const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            // Update the input's value with the formatted number
            this.value = formattedValue;
            enemyATKThreshold=value;
            updateDamageTakenQueryContainer();
        }
    );
    //creating enemy stats input complete
    
    
    const beforeAttackTimnig=document.getElementById("attack-timing-before");
    if(attackRecievedTiming=="before"){
        beforeAttackTimnig.checked=true;
    }
    beforeAttackTimnig.addEventListener(
        "input", function(){
            attackRecievedTiming="before";
            updatePassiveStats();
        }
    )

    const afterAttackTimnig=document.getElementById("attack-timing-after");
    if(attackRecievedTiming=="after"){
        afterAttackTimnig.checked=true;
    }
    afterAttackTimnig.addEventListener(
        "input", function(){
            attackRecievedTiming="after";
            updatePassiveStats();
        }
    )

    const noneAttackType=document.getElementById("attack-type-none");
    if(attackRecievedType=="none"){
        noneAttackType.checked=true;
    }
    noneAttackType.addEventListener(
        "input", function(){
            attackRecievedType="none";
            updatePassiveStats();
        }
    )

    const normalAttackType=document.getElementById("attack-type-normal");
    if(attackRecievedType=="normal"){
        normalAttackType.checked=true;
    }
    normalAttackType.addEventListener(
        "input", function(){
            attackRecievedType="normal";
            updatePassiveStats();
        }
    )

    const superAttackType=document.getElementById("attack-type-super");
    if(attackRecievedType=="super"){
        superAttackType.checked=true;
    }
    superAttackType.addEventListener(
        "input", function(){
            attackRecievedType="super";
            updatePassiveStats();
        }
    )
}

function updateDamageTakenQueryContainer(){
    for (const option of document.getElementsByClassName("enemy-defending-class-typing")){
        if(option.referenceData=="Typing"){
            option.style.filter="grayscale(85%)";
            if(option.referenceTyping==enemyTyping){
                option.style.filter="grayscale(0%)";
            }
        }
        else if(option.referenceData=="Class"){
            option.style.backgroundImage='url("/dbManagement/DokkanFiles/global/en/layout/en/image/character/cha_type_icon_'+classToInt(option.referenceClass)+typeToInt(enemyTyping)+'.png")';
            option.style.filter="grayscale(85%)";
            if(option.referenceClass==enemyClass){
                option.style.filter="grayscale(0%)";
            }
        }
    }
    //fixing enemyTyping and class complete

    //create specific attack details selection
    const attackPerformedSelector = document.getElementById("attack-performed-selector");
    let attackCount=1;
    if(activeAttackPerformed){
        if(!Array.from(attackPerformedSelector.options).some(o => o.value == "active")){
            const option=document.createElement("option");
            option.id="attack-performed-active";
            option.textContent="1: Active: " + Math.floor(document.getElementById("active-container").kiCircle.getAttack()).toLocaleString('en-US') ;
            option.value="active";
            attackPerformedSelector.add(option,attackCount++);
        }
        else{
            const existingOption=Array.from(attackPerformedSelector.options).find(o => o.value == "active");
            existingOption.textContent="1: Active: " + Math.floor(document.getElementById("active-container").kiCircle.getAttack()).toLocaleString('en-US') ;
        }
    }
    else{
        if(Array.from(attackPerformedSelector.options).some(o => o.value == "active")){
            attackPerformedSelector.removeChild(document.getElementById("attack-performed-active"));
        }
    }

    for (const attack of Object.values(kiCircleDictionary)){
        if(attack.attackPerformed){
            
            if(!Array.from(attackPerformedSelector.options).some(o => o.value == attack.passiveLineKey)){
                const option=document.createElement("option");
                option.id="attack-performed-"+attack.passiveLineKey;
                option.value=attack.passiveLineKey;
                option.textContent=attackCount + ": " + Math.floor(attack.getAttack()).toLocaleString('en-US');
                attackPerformedSelector.add(option,attackCount++);
            }
            else{
                const existingOption=Array.from(attackPerformedSelector.options).find(o => o.value == attack.passiveLineKey);
                existingOption.textContent=attackCount + ": " + Math.floor(attack.getAttack()).toLocaleString('en-US');
                if(attackPerformedSelector.value == attack.passiveLineKey){
                    attackPerformedSelector.removeChild(existingOption);
                    attackPerformedSelector.add(existingOption,attackCount++);
                    attackPerformedSelector.value=attack.passiveLineKey;
                }
                else{
                    attackPerformedSelector.removeChild(existingOption);
                    attackPerformedSelector.add(existingOption,attackCount++);
                }
            }
        }
        else{
            if(Array.from(attackPerformedSelector.options).some(o => o.value == attack.passiveLineKey)){
                attackPerformedSelector.removeChild(document.getElementById("attack-performed-"+attack.passiveLineKey));
            }
        }
    }
    attackPerformedSelector.addEventListener(
        "change", function(){
            updateEnemyNumbers();
        }
    )
    if(!(Array.from(attackPerformedSelector.options).some(o => o.value == "all"))){
        const option=document.createElement("option");
        option.value="all";
        option.textContent="All";
        option.id="attack-performed-all";
        attackPerformedSelector.appendChild(option);
    }
    const allOption=document.getElementById("attack-performed-all");
    if(attackPerformedSelector.value=="all"){
        attackPerformedSelector.removeChild(allOption);
        attackPerformedSelector.appendChild(allOption);
        attackPerformedSelector.value="all";
    }
    else{
        attackPerformedSelector.removeChild(allOption);
        attackPerformedSelector.appendChild(allOption);
    }
    updateEnemyNumbers();
}
    

function updateEnemyNumbers(){
    const enemyAttackTaken=document.getElementById("enemy-attack-taken");
    let attackDealt;
    if(document.getElementById("attack-performed-selector").value=="all"){
        attackDealt=0;
        if(activeAttackPerformed){
            attackDealt+=calculateAttackRecieved(
                document.getElementById("active-container").kiCircle.getAttack(),
                document.getElementById("active-container").kiCircle.effectiveAgainstAll,
                document.getElementById("active-container").kiCircle.critPerformed,
                currentJson["Type"],
                currentJson["Class"],
                skillOrbBuffs["Attack"],
    
    
                enemyDEF,
                enemyDR/100,
                enemyTyping,
                enemyClass,
                enemyATKThreshold,
                0//skillOrbBuffs["Defense"],
            );
        }
        for (const attack of Object.values(kiCircleDictionary)){
            if(attack.attackPerformed){
                attackDealt+=calculateAttackRecieved(
                    attack.getAttack(),
                    attack.effectiveAgainstAll,
                    attack.critPerformed,
                    currentJson["Type"],
                    currentJson["Class"],
                    skillOrbBuffs["Attack"],
        
        
                    enemyDEF,
                    enemyDR/100,
                    enemyTyping,
                    enemyClass,
                    enemyATKThreshold,
                    0//skillOrbBuffs["Defense"],
                );
            }
        }
    }
    else if(document.getElementById("attack-performed-selector").value=="active"){
        attackDealt=calculateAttackRecieved(
            document.getElementById("active-container").kiCircle.getAttack(),
            document.getElementById("active-container").kiCircle.effectiveAgainstAll,
            document.getElementById("active-container").kiCircle.critPerformed,
            currentJson["Type"],
            currentJson["Class"],
            skillOrbBuffs["Attack"],


            enemyDEF,
            enemyDR/100,
            enemyTyping,
            enemyClass,
            enemyATKThreshold,
            0//skillOrbBuffs["Defense"],
        );
    }
    else{
        attackDealt=calculateAttackRecieved(
            kiCircleDictionary[document.getElementById("attack-performed-selector").value].getAttack(),
            kiCircleDictionary[document.getElementById("attack-performed-selector").value].effectiveAgainstAll,
            kiCircleDictionary[document.getElementById("attack-performed-selector").value].critPerformed,
            currentJson["Type"],
            currentJson["Class"],
            skillOrbBuffs["Attack"],


            enemyDEF,
            enemyDR/100,
            enemyTyping,
            enemyClass,
            enemyATKThreshold,
            0,//skillOrbBuffs["Defense"],
            false
        );
    }
    enemyAttackTaken.innerHTML="Damage dealt: "+Math.round(attackDealt,0).toLocaleString('en-US');

    const statsOnHit=document.getElementById("stats-on-hit");
    const enemyAttackDealt=document.getElementById("enemy-attack-dealt");
    let attackTaken;
    if(attackRecievedType!="none"){
        attackTaken=calculateAttackRecieved(
            enemyATK,
            false,
            false,
            enemyTyping,
            enemyClass,
            0,
            
            recievingDamageStats.Defense||0,
            (recievingDamageStats["Damage Reduction"]||0)/100,
            currentJson["Type"],
            currentJson["Class"],
            0,
            skillOrbBuffs["Defense"],
            recievingDamageStats.Guard||false
        )
        enemyAttackDealt.innerHTML="Damage taken: "+Math.round(attackTaken,0).toLocaleString('en-US');
        enemyAttackDealt.style.display="block";
        statsOnHit.innerHTML="DEF: "+ recievingDamageStats.Defense.toLocaleString('en-US')+"<br>";
        if(recievingDamageStats["Damage Reduction"] !=0){
            statsOnHit.innerHTML+=" DR: "+(recievingDamageStats["Damage Reduction"]||0)+"% <br>";
        }
        if(recievingDamageStats.Guard){
            statsOnHit.innerHTML+="Guard: "+recievingDamageStats.Guard;
        }
    }
    else{
        enemyAttackDealt.style.display="none";
        statsOnHit.style.display="none";
    }
    
}

function calculateAttackRecieved(
    attackerAttack,
    attackerEffectiveAgainstAll,
    attackerCritPerformed,
    attackerTyping,
    attackerClass,
    attackerSkillOrbBuffAttack,
    defenderDEF,
    defenderDR,
    defenderTyping,
    defenderClass,
    defenderATKThreshold,
    defenderSkillOrbBuffDefense,
    defenderPassiveGuard){


    let [advantageMultiplier,guardMultiplier]=advantageCalculator(attackerTyping, attackerClass, defenderTyping, defenderClass,defenderPassiveGuard);
    if(typeToInt(attackerTyping,true)-typeToInt(defenderTyping,true)==1 || typeToInt(attackerTyping,true)-typeToInt(defenderTyping,true)==-4){
        advantageMultiplier+=attackerSkillOrbBuffAttack*0.05;
    }
    else if(typeToInt(attackerTyping,true)-typeToInt(defenderTyping,true)==-1 || typeToInt(attackerTyping,true)-typeToInt(defenderTyping,true)==4){
        advantageMultiplier-=defenderSkillOrbBuffDefense*0.01;
    }
    if(attackerEffectiveAgainstAll){
        guardMultiplier=1;
        advantageMultiplier=1.5;
    }
    if(attackerCritPerformed){
        guardMultiplier=1;
        advantageMultiplier=1.875
        defenderDEF=0;
    }
    

    let variance=1;
    let DRToNormals=0;
    let attackDealt=(attackerAttack  * (1 - defenderDR) * (1 - DRToNormals) * advantageMultiplier * variance - defenderDEF) * guardMultiplier;
    if(attackDealt<defenderATKThreshold){
        attackDealt=0;
    }
    return(attackDealt);
    }



function createKiSphereContainer(){
    const kiSphereContainer=document.getElementById("ki-sphere-container");
    const rainbowQuery=document.getElementById("rainbow-sphere-query");
    const otherQuery=document.getElementById("other-sphere-query");
    kiSphereContainer.rainbowQuery=rainbowQuery;
    kiSphereContainer.otherQuery=otherQuery;

    const rainbowlabel=document.createElement("label");
    rainbowQuery.label=rainbowlabel;
    rainbowQuery.appendChild(rainbowlabel);
    rainbowlabel.innerHTML="How many rainbow ki spheres have been obtained: "+rainbowKiSphereAmount;

    const rainbowSlider=document.createElement("input");
    rainbowQuery.slider=rainbowSlider;
    rainbowQuery.appendChild(rainbowSlider)
    rainbowSlider.type="range";
    rainbowSlider.min=0;
    rainbowSlider.max=5;
    rainbowSlider.value=rainbowKiSphereAmount;
    rainbowSlider.addEventListener("input", function(){
        rainbowKiSphereAmount=parseInt(this.value);
        if(parseInt(this.value)==5){
            this.parentElement.parentElement.otherQuery.otherSlider.value=0;
            this.parentElement.parentElement.otherQuery.sufffixLabel.innerHTML="ki spheres have been obtained: "
            this.parentElement.parentElement.otherQuery.sufffixLabel.innerHTML+=0;
            currentKiSphereAmount=0;
        }
        else if(parseInt(this.value)+parseInt(this.parentElement.parentElement.otherQuery.otherSlider.value)>23){
            this.parentElement.parentElement.otherQuery.otherSlider.value=23-this.value;
            this.parentElement.parentElement.otherQuery.sufffixLabel.innerHTML="ki spheres have been obtained: "
            this.parentElement.parentElement.otherQuery.sufffixLabel.innerHTML+=23-this.value;
            currentKiSphereAmount=23-this.value;
        }
        else if(parseInt(this.parentElement.parentElement.otherQuery.otherSlider.value)==0 && parseInt(this.value)<5){
            this.parentElement.parentElement.otherQuery.otherSlider.value=1;
            this.parentElement.parentElement.otherQuery.sufffixLabel.innerHTML="ki spheres have been obtained: "
            this.parentElement.parentElement.otherQuery.sufffixLabel.innerHTML+=1;
            currentKiSphereAmount=1;
        }
        updateKiSphereBuffs()
        this.parentElement.label.innerHTML="How many rainbow ki spheres have been obtained: "+this.value;
    })

    const otherPrefixLabel=document.createElement("Label");
    otherPrefixLabel.innerHTML="How many";
    otherQuery.prefixLabel=otherPrefixLabel;
    otherQuery.appendChild(otherPrefixLabel)

    

    const otherDropdown=document.createElement("select");
    otherQuery.appendChild(otherDropdown)
    otherDropdown.addEventListener("change", function(){
        otherDropdown.style.backgroundColor=LightenColor(colorToBackground(typeToColor(otherDropdown.value)),50)
        updateKiSphereBuffs()
    })
    for (const orbType of ["STR","AGL","TEQ","INT","PHY","Candy"]){
        const option = document.createElement('option');
        option.style.backgroundColor=LightenColor(colorToBackground(typeToColor(orbType)),50);
        option.textContent = orbType;
        otherDropdown.appendChild(option);
        if(orbType==currentJson["Type"]){
            option.selected = true;
            currentKiSphere=orbType;
        }
    }
    otherDropdown.style.backgroundColor=LightenColor(colorToBackground(typeToColor(otherDropdown.value)),50)
    
    const otherSuffixLabel=document.createElement("Label");
    otherSuffixLabel.innerHTML="ki spheres have been obtained: 3";
    otherQuery.sufffixLabel=otherSuffixLabel;
    otherQuery.appendChild(otherSuffixLabel)
    
    
    const otherSlider=document.createElement("input");
    otherQuery.otherSlider=otherSlider;
    otherQuery.appendChild(otherSlider)
    otherSlider.type="range";
    otherSlider.min=0;
    otherSlider.max=23;
    otherSlider.value=currentKiSphereAmount;
    otherSlider.addEventListener("input", function(){
        if(parseInt(this.value)+parseInt(this.parentElement.parentElement.rainbowQuery.slider.value)>23){
            this.parentElement.parentElement.rainbowQuery.slider.value=23-this.value;
            this.parentElement.parentElement.rainbowQuery.label.innerHTML="How many rainbow ki spheres have been obtained: "
            this.parentElement.parentElement.rainbowQuery.label.innerHTML+=23-parseInt(this.value);
            rainbowKiSphereAmount=23-this.value
        }
        else if(parseInt(this.value)>0 && parseInt(this.parentElement.parentElement.rainbowQuery.slider.value)==5){
            this.parentElement.parentElement.rainbowQuery.slider.value=4;
            this.parentElement.parentElement.rainbowQuery.label.innerHTML="How many rainbow ki spheres have been obtained: "
            this.parentElement.parentElement.rainbowQuery.label.innerHTML+=4;
            rainbowKiSphereAmount=4
        }
        else if(parseInt(this.value)==0){
            this.parentElement.parentElement.rainbowQuery.slider.value=5;
            this.parentElement.parentElement.rainbowQuery.label.innerHTML="How many rainbow ki spheres have been obtained: "
            this.parentElement.parentElement.rainbowQuery.label.innerHTML+=5;
            rainbowKiSphereAmount=5
        }
        currentKiSphereAmount=parseInt(this.value)
        updateKiSphereBuffs();
        this.parentElement.sufffixLabel.innerHTML="ki spheres have been obtained: "+this.value;
    })
}




function polishPage(){
    if(document.getElementById("passive-query-container").firstChild==null){
        document.getElementById("passive-query-container").style.display="none";
    }
    else{
        document.getElementById("passive-query-container").style.display="block";
    }

    if(document.getElementById("active-container").firstChild==null){
        document.getElementById("active-container").style.display="none";
    }

    if(document.getElementById("finish-container").firstChild==null){
        document.getElementById("finish-container").style.display="none";
    }




    if(regularAttacksPerformed==false){
        document.getElementById("ki-container").style.display="none";
    }



}


export async function loadPage(firstTime=false){
    const urlParams=new URLSearchParams(window.location.search);
    let subURL = urlParams.get('id') || "None";
    isEza = urlParams.get("EZA") || "false";
    isEza=(isEza=="true");
    isSeza = urlParams.get("SEZA") || "false";
    isSeza=(isSeza=="true");

    let jsonPromise;
    if(isSeza){
    jsonPromise=getJsonPromise('/dbManagement/jsonsSEZA/',subURL,'.json');
    }
    else if(isEza){
    jsonPromise=getJsonPromise('/dbManagement/jsonsEZA/',subURL,'.json');
    }
    else{
    jsonPromise=getJsonPromise('/dbManagement/jsons/',subURL,'.json');
    }

    try{
        //await all JSON promises so they finish before continuing
        [currentJson, linkData, domainData] = await Promise.all([
            jsonPromise,
            getJsonPromise("/dbManagement/uniqueJsons/", "links", ".json"),
            getJsonPromise("/dbManagement/uniqueJsons/", "domains", ".json")
        ]);
        initialiseAspects();
        createPassiveContainer();
        if(firstTime){
            if(currentJson["Rarity"] == "lr" || currentJson["Rarity"] == "ur"){
                createSkillOrbContainer();
                createStarButton();
                createPathButtons();
            }
            createActiveContainer();
            createFinishContainer();
            createLeaderStats();
            createLinkStats();
            createLinkBuffs();
            createDokkanAwakenContainer();
            createTransformationContainer();
            createDomainContainer();
            createStatsContainer();
            createKiSphereContainer();
            createDamageTakenContainer();
        }
        else{
            //document.getElementById('ki-slider').dispatchEvent(new Event('input'));	
        }
        createLevelSlider();
        createSuperAttackContainer();
        updateBaseStats(false);
        if(currentJson["Rarity"] == "lr" || currentJson["Rarity"] == "ur"){
            const buttonContainer = document.getElementById('hipo-button-container');
            buttonContainer.style.display = "grid";
        }
        
        createKiCirclesWithClass();
        updateKiSphereBuffs(true);
        updatePassiveStats();
        polishPage();
        
        const scale = Math.min(
            document.body.scrollWidth /window.innerWidth,
            document.body.scrollHeight/ window.innerHeight
          );
    
        document.body.style.transform = `scale(${scale})`;
        document.body.style.transformOrigin = "top left";

    }
    catch(error){
        console.error("Error loading page data", error);
    }
}
loadPage(true)