class kiCircleClass{
    constructor(passiveLineKey,CausalityLogic,performedChance,superChance){
        this.CausalityLogic=CausalityLogic;
        this.attackPerformed=false;
        if(performedChance==100){
            this.attackPerformed=false
        }
        this.passiveLineKey=passiveLineKey;
        this.superChance=superChance
        this.performedChance=performedChance;
        this.attackStat=0;
        this.displayedAttackStat=0;
        this.imageUrl = currentJson["Resource ID"];
        this.superPerformed=false
        
        
        this.KiCircle=document.createElement("div");
        this.KiCircle.id="ki-circle";
        let queryCount=0;
        if(this.superChance!=0 && this.superChance!=100){
            queryCount++
        }
        if(this.performedChance!=0 && this.performedChance!=100){
            queryCount++
        }
        if(queryCount==0){
            this.KiCircle.style.gridTemplateRows="230px";
        }
        else if(queryCount==1){
            this.KiCircle.style.gridTemplateRows="230px 35px";
        }
        else if(queryCount==2){
            this.KiCircle.style.gridTemplateRows="230px 35px 35px";
        }
        let setHeight=queryCount*35+230;
        this.KiCircle.style.height=setHeight+"px";

        let circleBase=document.createElement("div");
        circleBase.id="circle-base";
        if(currentJson.Typing=="AGL"){
            circleBase.style.backgroundImage = "url('../dbManagement/assets/misc/chara_icon/ing_type_gauge_base_00.png')";
        }
        else if(currentJson.Typing=="TEQ"){
            circleBase.style.backgroundImage = "url('../dbManagement/assets/misc/chara_icon/ing_type_gauge_base_01.png')";
        }
        else if(currentJson.Typing=="INT"){
            circleBase.style.backgroundImage = "url('../dbManagement/assets/misc/chara_icon/ing_type_gauge_base_02.png')";
        }
        else if(currentJson.Typing=="STR"){
            circleBase.style.backgroundImage = "url('../dbManagement/assets/misc/chara_icon/ing_type_gauge_base_03.png')";
        }
        else if(currentJson.Typing=="PHY"){
            circleBase.style.backgroundImage = "url('../dbManagement/assets/misc/chara_icon/ing_type_gauge_base_04.png')";
        }
        circleBase.style.width="220px";
        circleBase.style.height="220px";
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
        unitImage.style.width = "220px";
        unitImage.style.height = "220px";
        let assetID=currentJson["ID"].slice(0, -1)+ "0";
        unitImage.style.backgroundImage = "url('../dbManagement/assets/circle/" + assetID + ".png')";
        unitImage.style.backgroundSize = "100% 100%";
        unitImage.style.backgroundPosition = "center";
        unitImage.style.backgroundRepeat = "no-repeat";
        unitImage.style.zIndex = "1";

        //for loop that iterates 12 times
        this.segments=[]
        for (let i = 0; i < 12; i++) {
            let circleSegment = document.createElement("div");
            this.segments.push(circleSegment);
            this.KiCircle.appendChild(circleSegment);
            circleSegment.className = "ki-circle-segment";
            
            let rotateOffset=(15 + (i * 30));
            let rotateOffsetRadians=rotateOffset*(Math.PI/180);
            let xOffset = Math.sin(rotateOffsetRadians)*85 + 55;
            let yOffset = (1-Math.cos(rotateOffsetRadians))*85-30;
            circleSegment.style.transform += "translate(" + xOffset + "px, " + yOffset + "px) "
            circleSegment.style.transform += "rotateZ("+(rotateOffset-3.5) + "deg)";
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
                let xOffset = Math.sin(rotateOffsetRadians)*85 + 55;
                let yOffset = (1-Math.cos(rotateOffsetRadians))*85-30;
                circleSegment.style.transform += "translate(" + xOffset + "px, " + yOffset + "px) "
                circleSegment.style.transform += "rotateZ("+(rotateOffset-3.5) + "deg)";
                circleSegment.style.transform += "scaleY(1.24)";



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
        this.superAttackName.style.backgroundImage = "url('../dbManagement/assets/sp_name_00/"+this.imageUrl+".png')";
        this.superAttackName.style.display="none";
        this.KiCircle.appendChild(this.superAttackName);
        this.superChanceQuery=document.createElement("button");
        this.superChanceQuery.id="super-chance-query";
        if(this.performedChance==0 || this.performedChance==100){
            this.superChanceQuery.style.gridRow="2"
        }
        else{
            this.superChanceQuery.style.gridRow="3"
        }
        this.superChanceQuery.innerHTML="Does the "+this.superChance+"% chance this is a super attack activate?"
        this.superChanceQuery.style.background="#FF5C35";
        this.superChanceQuery.passiveLineKey=this.passiveLineKey
        if(this.superChance==0){
            this.superChanceQuery.style.display="none"
            this.superPerformed=false
        }
        else if(this.superChance==100 && this.passiveLineKey!="0"){
            this.superChanceQuery.style.display="none"
            this.superChanceQuery.classList.add("active");
            this.superPerformed=true
        }
        else if(this.superChance==0){
            this.superChanceQuery.style.display="none"
        }
        
        this.superChanceQuery.style.cursor="pointer"
        this.superChanceQuery.style.zIndex = "6";
        this.superChanceQuery.parentClass=this
        this.superChanceQuery.addEventListener('click', function(){
            if(this.classList.contains("active")){
                this.parentClass.toggleSuperPerformed(false)
            }
            else{
                this.parentClass.toggleSuperPerformed(true)
            }
            refreshKiCircle()
        })
        if(this.passiveLineKey!="0"){
            this.KiCircle.appendChild(this.superChanceQuery);
        }
        //this.superChanceQuery.style.transform = "translate(0px, 200px)";
        

        this.performedChanceQuery=document.createElement("button");
        this.performedChanceQuery.id="performed-chance-query";
        this.performedChanceQuery.style.gridRow="2"
        this.performedChanceQuery.innerHTML="Does the "+this.performedChance+"% chance to attack activate?"
        this.performedChanceQuery.style.background="#FF5C35";
        this.performedChanceQuery.passiveLineKey=this.passiveLineKey
        if(this.performedChance==0){
            this.performedChanceQuery.style.display="none"
            this.superPerformed=false
        }
        else if(this.performedChance==100){
            this.performedChanceQuery.style.display="none"
            this.performedChanceQuery.classList.add("active");
            this.attackPerformed=true
        }
        else if(this.performedChance==0){
            this.performedChanceQuery.style.display="none"
            this.performedChanceQuery.classList.remove("active");
            this.attackPerformed=false
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
            refreshKiCircle();
        })
        this.KiCircle.appendChild(this.performedChanceQuery);
        //this.performedChanceQuery.style.transform = "translate(0px, 200px)";

    }

    getElement(){
        return this.KiCircle;
    }

    updateValue(targetValue) {
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
    
        let startValue = this.displayedAttackStat;
        let currentValue = startValue;
        let increment = (targetValue - startValue) / totalFrames;
        let currentFrame = 0;
    
        const animate = () => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            currentValue = Math.round(startValue + increment * progress * totalFrames);
    
            // Update the damage text
            while (this.damageText.firstChild) {
                this.damageText.removeChild(this.damageText.firstChild);
            }
    
            for (let char of currentValue.toString()) {
                const numDiv = document.createElement('div');
                numDiv.className = "ki-damage-text-numDiv";
                numDiv.classList.add(`num-${char}`);
                this.damageText.appendChild(numDiv);
            }
    
            if (currentFrame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                this.displayedAttackStat = this.attackStat; // Ensure the final value is set correctly
                while (this.damageText.firstChild) {
                    this.damageText.removeChild(this.damageText.firstChild);
                }
                for (let char of currentValue.toString()) {
                    const numDiv = document.createElement('div');
                    numDiv.className = "ki-damage-text-numDiv";
                    numDiv.classList.add(`num-${char}`);
                    this.damageText.appendChild(numDiv);
                }
            }
        };
    
        requestAnimationFrame(animate);
    }

    changeGridRow(rowNumber){
        this.KiCircle.style.gridRow = rowNumber;
    }
    getGridRow(){
        return this.KiCircle.style.gridRow
    }

    updateSuperAttack(superAttackID){
        if(superAttackID==-1){
            this.superAttackName.style.display="none";
        }
        else{
            this.superAttackName.style.backgroundImage = "url('../dbManagement/assets/sp_name_0"+superAttackID+"/"+this.imageUrl+".png')";
            this.superAttackName.style.display="block";
        }
    }

    updateCausalityLogic(CausalityLogic){
        this.CausalityLogic=CausalityLogic
    }
    updateConditions(superAttackMultiplierIncrease,superHasBeenPerformed){
        if(this.attackPerformed || additionalAttacks[this.passiveLineKey]=="Predictor"){
            this.superHasBeenPerformed=superHasBeenPerformed||this.superPerformed;
            this.activatedPassiveLineMultipliers={};
            this.passiveBuffs={};
            this.additionalAttacks={};
            this.superAttackMultiplier=1;
            this.SOTATK=1;
            this.MOTATK=1;
            this.SOTATKONSUPER=0;
            this.MOTATKONSUPER=0;
            this.EXTRAKIONSUPER=0;
            this.Ki=0;
            for (const kiSourcesKey in kiSources){
                this.Ki+=parseInt(kiSources[kiSourcesKey]);
            }

            const SOTTIMINGS=["Start of turn","After all ki collected","When ki spheres collected"]
            const MOTTIMINGS=["Being hit","Hit recieved","Attacking the enemy","Attacking"]
            const ONSUPERTIMING=["On Super"]
            let passiveLines=currentJson.Passive;
            for(const passiveLineKey in passiveLines){
                let passiveLine=passiveLines[passiveLineKey];
                let activatedCondition=true;
                let buffMultiplier=1
                if("Building Stat" in passiveLine){
                    const sliderName=passiveLine["Building Stat"]["Slider"];
                    buffMultiplier=this.CausalityLogic[sliderName];
                }
                if("Condition" in passiveLine){
                    let conditionLogic=" "+passiveLine["Condition"]["Logic"]+" ";
                    let conditionCausalities=passiveLine["Condition"]["Causalities"];
                    for(const conditionCausalityKey in conditionCausalities){
                        let conditionCausality=conditionCausalities[conditionCausalityKey];
                        let buttonLogic=false;
                        if("Button" in conditionCausality){
                            buttonLogic=this.CausalityLogic[conditionCausality["Button"]["Name"]];
                        }
                        let sliderLogic=false;
                        if("Slider" in conditionCausality){
                            sliderLogic=eval(this.CausalityLogic[conditionCausality["Slider"]["Name"]] + conditionCausality["Slider"]["Logic"]);
                        }
                        if(buttonLogic || sliderLogic){
                            conditionLogic=conditionLogic.replaceAll(" "+conditionCausalityKey+" "," "+true+" ");
                        }
                        else{
                            conditionLogic=conditionLogic.replaceAll(" "+conditionCausalityKey+" "," "+false+" ");
                        }
                    }
                    if(eval(conditionLogic)){
                        activatedCondition=true;
                    }
                    else{
                        activatedCondition=false;
                    }
                }
                if(activatedCondition){
                    dictionaryToggle(this.activatedPassiveLineMultipliers,passiveLineKey,buffMultiplier);
                    if("Toggle Other Line" in passiveLine){
                        dictionaryToggle(this.activatedPassiveLineMultipliers,passiveLine["Toggle Other Line"]["Line"],1);
                    }
                    if("Additional attack" in passiveLine){
                        this.additionalAttacks[passiveLineKey]="Offered";
                    }                
                }
            }

            for (const key in this.activatedPassiveLineMultipliers){
                const passiveLine=passiveLines[key];
                for (const passiveEffect in passiveLine){
                    const timingString = passiveLine["Timing"];
                    const targetString = passiveLine["Target"]["Target"];
                    let buffMultiplier=1;
                    if(passiveEffect=="ATK"||
                        passiveEffect=="Ki"
                    ){
                        if("Building Stat" in passiveLine){
                            buffMultiplier=this.CausalityLogic[passiveLine["Building Stat"]["Slider"]];
                            buffMultiplier=Math.min(buffMultiplier,passiveLine["Building Stat"]["Max"]);
                        }
                        if(!(targetString.includes("self excluded"))){
                            /*
                            if(timingString=="On Super"){
                                if(passiveLine["Calc option"]=="2"){
                                    this.SOTONSUPERATK+=buffMultiplier*(passiveLine.ATK||0)/100
                                }
                                else{
                                    this.MOTONSUPERATK+=buffMultiplier*(passiveLine.ATK||0)/100
                                }
                                this.EXTRAKIONSUPER+=buffMultiplier*(passiveLine.KI||0)
                            }
                            else{
                                if(passiveLine["Calc option"]=="2"){
                                    this.SOTATK+=buffMultiplier*(passiveLine.ATK||0)/100
                                }
                                else{
                                    this.MOTATK+=buffMultiplier*(passiveLine.ATK||0)/100
                                }
                                this.Ki+=buffMultiplier*(passiveLine.KI||0)
                            }
                            */

                            if(SOTTIMINGS.includes(timingString)){
                                this.SOTATK+=(buffMultiplier*(passiveLine.ATK||0))/100
                                this.Ki+=buffMultiplier*(passiveLine.Ki||0)
                            }
                            else if (MOTTIMINGS.includes(timingString)){
                                this.MOTATK+=buffMultiplier*(passiveLine.ATK||0)/100
                                this.Ki+=buffMultiplier*(passiveLine.Ki||0)
                            }
                            else if (ONSUPERTIMING.includes(timingString)){
                                this.MOTATKONSUPER+=buffMultiplier*(passiveLine.ATK||0)/100
                                this.EXTRAKIONSUPER+=buffMultiplier*(passiveLine.Ki||0)
                            }
                            else{
                                console.log("UNKNOWN TIMING",timingString)
                            }
                            
                        }
                    }
                    else if(passiveEffect=="ID" || passiveEffect=="Condition" || passiveEffect=="Timing" || passiveEffect=="Target" || passiveEffect=="Length" || passiveEffect=="Buff"||passiveEffect=="Building Stat"||passiveEffect=="Nullification"||passiveEffect=="Additional attack"){
                        continue;
                    }
                    else{
                        //console.log(passiveEffect)
                    }
                }
            }
            
            if(this.superPerformed){
                this.Ki+=this.EXTRAKIONSUPER;
            }
            this.Ki=Math.min(this.Ki,this.maxKi)
            
            //bring over the super attack boosts
            this.superAttackAssetID=1;
            this.atkRaise=superAttackMultiplierIncrease;
            let superMinKi=0;
            let tempatkRaise=0;
            let minKiToSuperAttack=25;
            if(this.passiveLineKey==0){
                for (const superKey in currentJson["Super Attack"]){
                    const superAttack=currentJson["Super Attack"][superKey];
                    minKiToSuperAttack=Math.min(superAttack["superMinKi"],minKiToSuperAttack);
                    if(parseInt(superAttack["superMinKi"])<=parseInt(this.Ki) && parseInt(superAttack["superMinKi"])>parseInt(superMinKi)){
                        superMinKi=superAttack["superMinKi"];
                        this.superAttackMultiplier=superAttack["Multiplier"]/100;
                        this.superAttackMultiplier+=skillOrbBuffs["SuperBoost"]*0.05;
                        this.superAttackAssetID=superAttack["special_name_no"];
                        this.superPerformed=true;
                        if("SpecialBonus" in superAttack){
                            if(superAttack["SpecialBonus"]["Type"]=="SA multiplier increase"){
                                this.superAttackMultiplier+=superAttack["SpecialBonus"]["Amount"]/100
                            }
                        }
                        if("superBuffs" in superAttack){
                            for (const superBuffKey of Object.keys(superAttack["superBuffs"])){
                                if (!(superAttack["superBuffs"][superBuffKey]["Target"].includes("excluded" || "enem"))){
                                    this.superAttackMultiplier+=(superAttack["superBuffs"][superBuffKey]["ATK"]||0)/100
                                    tempatkRaise+=(superAttack["superBuffs"][superBuffKey]["ATK"]||0)/100;
                                }
                            }
                        }
                        this.superAttackPerformed=superAttack;
                    }
                    
                }
            }
            else{
                if(this.superPerformed){
                    this.Ki=currentJson["SuperMinKi"];
                    this.superAttackID=currentJson["AdditionalSuperID"];
                    const superAttack=currentJson["Super Attack"][this.superAttackID];
                    this.superAttackMultiplier=superAttack["Multiplier"]/100;
                    this.superAttackAssetID=superAttack["special_name_no"];
                    this.superAttackMultiplier+=skillOrbBuffs["SuperBoost"]*0.05;
                    this.superPerformed=true;
                    if("SpecialBonus" in superAttack){
                        if(superAttack["SpecialBonus"]["Type"]=="SA multiplier increase"){
                            this.superAttackMultiplier+=superAttack["SpecialBonus"]["Amount"]/100
                        }
                    }
                    if("superBuffs" in superAttack){
                        for (const superBuffKey of Object.keys(superAttack["superBuffs"])){
                            if (!(superAttack["superBuffs"][superBuffKey]["Target"].includes("excluded" || "enem"))){
                                this.superAttackMultiplier+=(superAttack["superBuffs"][superBuffKey]["ATK"]||0)/100
                                tempatkRaise+=(superAttack["superBuffs"][superBuffKey]["ATK"]||0)/100;
                            }
                        }
                    }
                    
                }
                else{
                    tempatkRaise=0
                    
                }
            }

            if(this.superPerformed){
                this.MOTATK+=this.MOTATKONSUPER;
                this.SOTATK+=this.SOTATKONSUPER;
            }
            this.atkRaise+=tempatkRaise;
            this.superAttackMultiplier+=this.atkRaise
            this.updateSuperAttack(this.superAttackAssetID)

            const passiveSupportContainer=document.getElementById("passive-support-container");
            this.SOTATK+=(parseInt(passiveSupportContainer.ATKsupport.input.value)||0)/100;
            
            let finalValue=1;
            finalValue=Math.floor(finalValue*baseStats["ATK"]);
            finalValue=Math.floor(finalValue*(1+leaderBuffs["ATK"]/100));
            finalValue=Math.floor(finalValue*(this.SOTATK));//Start of turn passive stats
            finalValue=Math.floor(finalValue*(1));//Item boost
            finalValue=Math.floor(finalValue*(1+linkBuffs["ATK"]/100));
            finalValue=Math.floor(finalValue*(1));//Active boost
            finalValue=Math.ceil(finalValue*(currentJson["Ki Multiplier"][this.Ki]/100));
            finalValue=Math.floor(finalValue*(this.MOTATK));//Middle of turn passive stats
            this.superAttackMultiplier+=superBuffs["ATK"]/100;
            finalValue=Math.floor(finalValue*this.superAttackMultiplier);
            finalValue=Math.floor(finalValue*(1+domainBuffs["ATK"]/100));
            this.updateKi(this.Ki);
            if(this.attackStat!=finalValue){
                this.updateValue(finalValue);
            }
        }
        else{
            this.updateValue(0);
            this.updateKi(0);
            this.updateSuperAttack(0);
            this.superPerformed=false
            this.atkRaise=superAttackMultiplierIncrease;
        }
    }
    updateKi(value){
        let maxKi;
        for (const passiveSlider of document.getElementById("passive-query-container").children){
            //if the innerHTML of the next sibling starts with how much ki is there
            if(passiveSlider.nextSibling!=null){
                if(passiveSlider.nextSibling.innerHTML.startsWith("How much ki is there")){
                    passiveSlider.value=value
                    passiveSlider.nextSibling.innerHTML="How much ki is there: "+value
                    //WIP TO UPDATE PASSIVE SKILL LOGIC
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
    }

    changeSuperChance(value){
        let queryCount=0;
        if(this.superChance!=0 && this.superChance!=100){
            queryCount++
        }
        if(this.performedChance!=0 && this.performedChance!=100){
            queryCount++
        }
        if(queryCount==0){
            this.KiCircle.style.gridTemplateRows="230px";
        }
        else if(queryCount==1){
            this.KiCircle.style.gridTemplateRows="230px 35px";
        }
        else if(queryCount==2){
            this.KiCircle.style.gridTemplateRows="230px 35px 35px";
        }
        let setHeight=queryCount*35+230;
        this.KiCircle.style.height=setHeight+"px";


        this.superChance=Math.round(value*10000)/100
        this.superChanceQuery.innerHTML="Does the "+this.superChance+"% chance this is a super attack activate?"
        if(this.superChance==0){
            if(this.superHasBeenPerformed==true){
                this.superHasBeenPerformed=false;
                refreshKiCircle();
            }
            this.superChanceQuery.style.display="none";
        }
        else if(this.superChance==100){
            if(this.superHasBeenPerformed==false){
                this.superHasBeenPerformed=true;
                refreshKiCircle();
            }
            this.superChanceQuery.style.display="none";
        }
        else{
            this.superChanceQuery.style.display="block";
        }
        if(this.attackPerformed==false){
            this.superChanceQuery.style.display="none"
        }
        
    }

    toggleSuperPerformed(isActivated){
        if(isActivated){
            this.superChanceQuery.classList.add("active")
            this.superChanceQuery.style.background="#00FF00"
            this.superPerformed=true
        }
        else{
            this.superChanceQuery.classList.remove("active")
            this.superChanceQuery.style.background="#FF5C35"
            this.superPerformed=false
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
            this.superChanceQuery.style.display="none"
        }
    }

    changePerformedChance(value){
        this.performedChance=Math.round(value*10000)/100
        this.performedChanceQuery.innerHTML="Does the "+this.performedChance+"% chance to perform an attack activate?"


        let queryCount=0;
        if(this.superChance!=0 && this.superChance!=100){
            queryCount++
        }
        if(this.performedChance!=0 && this.performedChance!=100){
            queryCount++
        }
        if(queryCount==0){
            this.KiCircle.style.gridTemplateRows="230px";
        }
        else if(queryCount==1){
            this.KiCircle.style.gridTemplateRows="230px 35px";
        }
        else if(queryCount==2){
            this.KiCircle.style.gridTemplateRows="230px 35px 35px";
        }
        let setHeight=queryCount*35+230;
        this.KiCircle.style.height=setHeight+"px";


        if(this.performedChance==0){
            this.superChanceQuery.style.gridRow="2";
            if(this.attackPerformed==true){
                this.attackPerformed=false;
                refreshKiCircle();
            }
            this.performedChanceQuery.style.display="none";
        }
        else if(this.performedChance==100){
            this.superChanceQuery.style.gridRow="2";
            if(this.attackPerformed==false){
                this.attackPerformed=true;
                refreshKiCircle();
            }
            this.performedChanceQuery.style.display="none";
        }
        else{
            this.superChanceQuery.style.gridRow="3";
            this.performedChanceQuery.style.display="block";
        }
        if(this.performedChance==0){
            this.KiCircle.style.display="none";
        }
    }

    display(thisDisplayed){
        if((thisDisplayed || this.passiveLineKey=="0")&&additionalAttacks[this.passiveLineKey]!="Predictor"){
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
            refreshKiCircle();
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
            refreshKiCircle();
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
            refreshKiCircle();
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
            refreshKiCircle();
        })
        this.selfContainer.appendChild(this.extraDEFQuery);

        this.finalHPDisplay=document.createElement("div");
        this.finalHPDisplay.id="final-HP-display";
        this.finalHPDisplay.style.backgroundImage="url('../dbManagement/assets/misc/potential/cha_detail_st_base_hp_textadded.png')";
        this.finalHPDisplay.style.gridRow="4";
        this.finalHPDisplay.style.gridColumn="1";
        this.finalHPDisplay.innerHTML=this.finalHP;
        this.selfContainer.appendChild(this.finalHPDisplay);

        this.finalATKDisplay=document.createElement("div");
        this.finalATKDisplay.id="final-ATK-display";
        this.finalATKDisplay.style.backgroundImage="url('../dbManagement/assets/misc/potential/cha_detail_st_base_atk_textadded.png')";
        this.finalATKDisplay.style.gridRow="4";
        this.finalATKDisplay.style.gridColumn="2";
        this.finalATKDisplay.innerHTML=this.finalATK;
        this.selfContainer.appendChild(this.finalATKDisplay);

        this.finalDEFDisplay=document.createElement("div");
        this.finalDEFDisplay.id="final-DEF-display";
        this.finalDEFDisplay.style.backgroundImage="url('../dbManagement/assets/misc/potential/cha_detail_st_base_def_textadded.png')";
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

    constructor(superAttack,maxPerTurn,unitID){
        this.superAttack=superAttack;
        this.selfContainer=document.createElement("div");
        this.selfContainer.style.display="grid";
        this.selfContainer.id="superAttackQueryHolder";
        for(const key of Object.keys(superAttack["superBuffs"])){
            if(superAttack["superBuffs"][key]["Duration"]!="1" && superAttack["superBuffs"][key]["Duration"]!="2"){
                let buffs=superAttack["superBuffs"][key];
                let buffHolder= new superAttackQuery(buffs,maxPerTurn,unitID,superAttack["superName"]);
                this.selfContainer.appendChild(buffHolder.getElement());
            }
        }
    }
    getElement(){
        return this.selfContainer;
    }
}

class pictureText{
    constructor(prefixText,imageURL,suffixText, imageHref=""){
        this.selfContainer=document.createElement("div");
        this.suffixContainer=document.createElement("div");

        let prefix=document.createElement("label");
        prefix.innerHTML=prefixText;
        this.selfContainer.appendChild(prefix);

        let image=document.createElement("button");
        image.style.border="none";
        image.style.display="inline-block";
        
        if(imageHref!=""){
            image.href=imageHref;
        }
        image.addEventListener("click",function(){
            window.location.href=(imageHref);
        })        
        image.style.backgroundImage="url('"+imageURL+"')";
        image.style.width="50px";
        image.style.height="50px";
        image.style.backgroundSize="100% 100%";
        image.style.cursor="pointer";
        this.selfContainer.appendChild(image);

        let suffix=document.createElement("label");
        suffix.innerHTML=suffixText;
        this.selfContainer.appendChild(suffix);
    }
    updatePrefixText(prefixText){
        this.selfContainer.children[0].innerHTML=prefixText;
    }

    updateSuffixText(suffixText){
        this.selfContainer.children[2].innerHTML=suffixText;
    }

    updateImage(imageURL){
        this.selfContainer.children[1].style.backgroundImage="url('"+imageURL+"')";
    }


    getElement(){
        return this.selfContainer;
    }
}

class superAttackQuery{
    constructor(buffs,maxPerTurn,unitID,superAttackName){
        this.selfContainer=document.createElement("div");
        this.selfContainer.buffs=buffs;
        this.selfContainer.superAttackName=superAttackName;
        this.selfContainer.buffsDuration=buffs["Duration"];
        this.selfContainer.currentValue=0;
        this.selfContainer.style.display="grid";
        let superAttackSlider = document.createElement('input');
        superAttackSlider.value=0;
        let superAttackQuestion = document.createElement('label');
        superAttackQuestion.superAttackName= superAttackName;
        const urlParams=new URLSearchParams(window.location.search);
        superAttackQuestion.superAttackText=new pictureText("How many times has","../dbManagement/assets/final_assets/"+unitID+".png","performed "+superAttackName+" within the last "+buffs["Duration"]+" turns?: "+superAttackSlider.value, "index.html?id="+unitID+"&EZA="+isEza+"&SEZA="+isSeza);
        this.selfContainer.appendChild(superAttackQuestion.superAttackText.getElement());
        superAttackQuestion.innerHTML = superAttackSlider.textContent;
        superAttackQuestion.style.gridRow = 1;
        superAttackSlider.type = "range";
        superAttackSlider.style.cursor = "pointer";
        superAttackSlider.min = 0;
        superAttackSlider.max=Math.floor(maxPerTurn*((buffs["Duration"]-1)/2));
        superAttackSlider.value = 0;
        superAttackSlider.id="super-slider";
        superAttackSlider.style.gridRow = 0;
        this.selfContainer.appendChild(superAttackQuestion);
        this.selfContainer.appendChild(superAttackSlider);
        superAttackSlider.addEventListener('input', function(){
            this.parentElement.children[1].superAttackText.updateSuffixText("performed "+superAttackName+" within the last "+buffs["Duration"]+" turns?: "+superAttackSlider.value);
            superAttackQuestion.innerHTML = superAttackSlider.textContent;
            this.parentNode.currentValue=parseInt(superAttackSlider.value);
            for(const query of this.parentNode.parentNode.children){
                if(query.superAttackName==this.parentNode.superAttackName){
                    if(query.buffsDuration>this.parentNode.buffsDuration && query.currentValue<this.parentNode.currentValue){
                        query.currentValue=this.parentNode.currentValue;
                        for (const query2 of query.children){
                            if(query2.localName=="input"){
                                query2.value=this.parentNode.currentValue;
                            }
                            else if(query2.localName=="label"){
                                query2.currentValue=this.parentNode.currentValue;
                                query2.superAttackText.updateSuffixText("performed "+query2.superAttackName+" within the last "+query.buffsDuration+" turns?: "+superAttackSlider.value);
                            }
                        }
                    }
                    else if(query.buffsDuration<this.parentNode.buffsDuration && query.currentValue>this.parentNode.currentValue){
                        query.currentValue=this.parentNode.currentValue;
                        for (const query2 of query.children){
                            if(query2.localName=="input"){
                                query2.value=this.parentNode.currentValue;
                            }
                            else if(query2.localName=="label"){
                                query2.currentValue=this.parentNode.currentValue;
                                query2.superAttackText.updateSuffixText("performed "+query2.superAttackName+" within the last "+query.buffsDuration+" turns?: "+superAttackSlider.value);
                            }
                        }
                    }
                }
            }
            updateSuperAttackStacks();
        });

        
    }

    getElement(){
        return this.selfContainer;
    }
}

class passiveButton{
    constructor(min, max, label) {
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
        this.element.onclick = function(){
            if(this.classList.contains('active')){
                this.classList.remove('active');
                this.style.background="#FF5C35"
            }
            else{
                this.classList.add('active');
                this.style.background="#00FF00"
            }
            updatePassiveBuffs()
        };
    }


    getElement(){
        return this.selfContainer;
    }

    updateParent(parent){
        this.parent=parent
        this.element.parent=parent
    }
}

class passiveSlider {
    constructor(min, max, label) {
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
        this.element.min = this.min;
        this.element.max = this.max;
        this.element.value = this.min;
        this.element.step = 1;
        this.element.addEventListener("input", () => this.update());
        
        this.elementLabel.innerHTML = this.label+": "+this.value+"+";
        if(this.label=="How much ki is there"){
            //this.selfContainer.style.display="none";
        }
    }

    update() {
        this.value = parseInt(this.element.value);
        this.elementLabel.innerHTML = this.label+": "+this.value;
        if(this.value==this.max){
            this.elementLabel.innerHTML+="+";
        }
        updatePassiveBuffs()

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
        this.type = type;
        this.create();
    }

    create(){
        while(this.selfContainer.firstChild){
            this.selfContainer.removeChild(this.selfContainer.firstChild);
        }
        if(this.type=="slider"){
            this.queryElement = new passiveSlider(this.min, this.max, this.sliderName);
            this.queryElement.parent=this;
            this.selfContainer.appendChild(this.queryElement.getElement());
        }
        else if(this.type=="button"){
            this.queryElement = new passiveButton(this.min, this.max, this.buttonName);
            this.queryElement.updateParent(this);
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

    updateValue(value){
        if(this.type=="button"){
            if(value){
                this.queryElement.element.classList.add("active")
            }
            else{
                this.queryElement.element.classList.remove("active")   
            }
        }
        else if(this.type=="slider"){
            this.queryElement.element.value=value
            this.queryElement.update()
        }
    }

    updateCondition(){
        this.queryElement.updateCondition();
    }
}

class causalityList{
    constructor(CausalityLogic){
        this.CausalityLogic=CausalityLogic;
        this.passiveBuffs=[];
        this.activeLines={};
        this.updateActiveLines();
    }

    updateActiveLines(){
        this.activeLines={};
        let passiveLines=currentJson.Passive;
        for(const passiveLineKey in passiveLines){
            let passiveLine=passiveLines[passiveLineKey];
            let buffMultiplier=1;
            let lineActive=true;
            if("Condition" in passiveLine){
                let conditionLogic=" "+passiveLine["Condition"]["Logic"]+" ";
                conditionLogic=conditionLogic.replaceAll("("," ( ").replaceAll(")", " ) ");
                let conditionCausalities=passiveLine["Condition"]["Causalities"];
                for(const conditionCausalityKey in conditionCausalities){
                    let conditionCausality=conditionCausalities[conditionCausalityKey];
                    let buttonLogic;
                    let sliderLogic;
                    if("Button" in conditionCausality){
                        buttonLogic=this.CausalityLogic[conditionCausality["Button"]["Name"]] || false;
                    }
                    else{
                        buttonLogic=false
                    }
                    if("Slider" in conditionCausality){
                        //sliderLogic=this.CausalityLogic[conditionCausality["Slider"]["Name"]] || false;
                        let currentSliderValue=this.CausalityLogic[conditionCausality["Slider"]["Name"]]
                        sliderLogic=eval(currentSliderValue+conditionCausality["Slider"]["Logic"])
                    }
                    else{
                        sliderLogic=false
                    }
                    conditionLogic=conditionLogic.replaceAll(" "+conditionCausalityKey+" "," "+(buttonLogic || sliderLogic)+" ");
                }
                lineActive=eval(conditionLogic);
            }
            if("Building Stat" in passiveLine && lineActive){
                buffMultiplier*=this.CausalityLogic[passiveLine["Building Stat"]["Slider"]];
            }
            if(lineActive){
                this.activeLines[passiveLineKey]=buffMultiplier;
                if("Toggle Other Line" in passiveLine){
                    dictionaryToggle(this.activeLines, passiveLine["Toggle Other Line"]["Line"], 1);
                }
            }
        }
    }

    updateBuffs(){
        this.updateActiveLines();
        this.passiveBuffs={}
        this.additionalAttacks={}
        for (const passiveLineKey in this.activeLines){
            let passiveLine=currentJson.Passive[passiveLineKey];
            let buffMultiplier=this.activeLines[passiveLineKey];
            const timing = passiveLine["Timing"];
            let target;
            if(passiveLine["Target"]["Target"]=="Self"){
                target="Self"
            }
            else if(passiveLine["Target"]["Target"]=="Allies"){
                if("Category" in passiveLine["Target"]){
                    if(arraysHaveOverlap(passiveLine["Target"]["Category"]["Included"], currentJson["Categories"]) && !arraysHaveOverlap(passiveLine["Target"]["Category"]["Excluded"], currentJson["Categories"])){
                        target=""
                        for (const category of passiveLine["Target"]["Category"]["Included"]){
                            target+=category+", ";
                        }
                        target=target.slice(0, -2);
                        target+=" Allies";
                    }
                    else{
                        target=""
                        for (const category of passiveLine["Target"]["Category"]["Included"]){
                            target+=category+", ";
                        }
                        target=target.slice(0, -2);
                        target+=" Allies(self excluded)";
                    }
                }
                else{
                    target="Allies"
                }
            }
            else if(passiveLine["Target"]["Target"]=="Allies(self excluded)"){
                if("Category" in passiveLine["Target"]){
                    if(arraysHaveOverlap(passiveLine["Target"]["Category"]["Included"], currentJson["Categories"]) && !arraysHaveOverlap(passiveLine["Target"]["Category"]["Excluded"], currentJson["Categories"])){
                        target=""
                        for (const category of passiveLine["Target"]["Category"]["Included"]){
                            target+=category+", ";
                        }
                        target=target.slice(0, -2);
                        target+=" Allies(self excluded)";
                    }
                }
                else{
                    target="Allies(self excluded)"
                }
            }
            if(target==undefined){
                console.log("UNKNOWN TARGET: ",passiveLine)
            }

            if("Building Stat" in passiveLine){
                for(const buffType in passiveLine){
                    if(["ATK","DEF","Ki","DR","Crit Chance","Dodge chance"].includes(buffType)){
                        let buffAmount;
                        if(passiveLine["Building Stat"]["Slider"].includes("Ki Spheres have been obtained")){
                            buffAmount=(passiveLine[buffType]*buffMultiplier)
                        }
                        else{
                            buffAmount=(passiveLine[buffType]*buffMultiplier).clamp(passiveLine["Building Stat"]["Min"],passiveLine["Building Stat"]["Max"]);
                        }
                        const dictionaryFormat=
                        {[timing]:
                            {[target]:
                                {[buffType]:
                                    (buffAmount)
                                }
                            }
                        }
                        
                        this.passiveBuffs=addDictionaryValues(this.passiveBuffs,dictionaryFormat)
                    }
                    
                }
                if("Additional attack" in passiveLine){
                    console.log("BUILDING STAT ADDITIONALS???")
                    if(!(timing in this.passiveBuffs)){
                        this.passiveBuffs[timing]={}
                    }
                    if(!(target in this.passiveBuffs[timing])){
                        this.passiveBuffs[timing][target]={}
                    }
                    if(!("Additional attack" in this.passiveBuffs[timing][target])){
                        this.passiveBuffs[timing][target]["Additional attack"]=[]
                    }
                    let superChance=passiveLine["Additional attack"]["Chance of super"];
                    this.passiveBuffs[timing][target]["Additional attack"].push(superChance)
                }

            }

            else{
                for(const buffType in passiveLine){
                    if(["ATK","DEF","Ki","DR","Crit Chance","Dodge chance"].includes(buffType)){
                        let buffAmount=passiveLine[buffType];
                        const dictionaryFormat=
                        {[timing]:
                            {[target]:
                                {[buffType]:
                                    (buffAmount)
                                }
                            }
                        }
                        
                        this.passiveBuffs=addDictionaryValues(this.passiveBuffs,dictionaryFormat)
                    }
                }
                if("Additional attack" in passiveLine){
                    if(!(timing in this.passiveBuffs)){
                        this.passiveBuffs[timing]={}
                    }
                    if(!(target in this.passiveBuffs[timing])){
                        this.passiveBuffs[timing][target]={}
                    }
                    if(!("Additional attack" in this.passiveBuffs[timing][target])){
                        this.passiveBuffs[timing][target]["Additional attack"]=[]
                    }
                    let superChance=passiveLine["Additional attack"]["Chance of super"];
                    this.passiveBuffs[timing][target]["Additional attack"].push(superChance)
                    this.additionalAttacks[passiveLineKey]="Offered"
                }
            }
        }
    }

    OLDupdateBuffs(){
        let passiveBuffs={}
        let passiveLines=currentJson.Passive;
        let activatedPassiveLineMultipliers=[];
        for(const passiveLineKey in passiveLines){
            let passiveLine=passiveLines[passiveLineKey];
            let activatedCondition=true;
            let buffMultiplier=1
            if("Building Stat" in passiveLine){
                const sliderName=passiveLine["Building Stat"]["Slider"];;
                buffMultiplier=this.CausalityLogic[sliderName];
            }
            if("Condition" in passiveLine){
                let conditionLogic=" "+passiveLine["Condition"]["Logic"]+" ";
                let conditionCausalities=passiveLine["Condition"]["Causalities"];
                for(const conditionCausalityKey in conditionCausalities){
                    let conditionCausality=conditionCausalities[conditionCausalityKey];
                    let buttonLogic=this.CausalityLogic[conditionCausality["Button"]["Name"]];
                    //let sliderLogic=eval(this.CausalityLogic[conditionCausality["Slider"]["Name"]] + conditionCausality["Slider"]["Logic"]);
                    let sliderLogic=true
                    if(buttonLogic || sliderLogic){
                        conditionLogic=conditionLogic.replaceAll(" "+conditionCausalityKey+" "," "+true+" ");
                    }
                    else{
                        conditionLogic=conditionLogic.replaceAll(" "+conditionCausalityKey+" "," "+false+" ");
                    }
                }
                if(eval(conditionLogic)){
                    activatedCondition=true;
                }
                else{
                    activatedCondition=false;
                }
            }
            if(activatedCondition){
                dictionaryToggle(activatedPassiveLineMultipliers,passiveLineKey,buffMultiplier);
                const timing= passiveLine["Timing"];
                const target = passiveLine["Target"]["Target"];
                if("Toggle Other Line" in passiveLine){
                    dictionaryToggle(activatedPassiveLineMultipliers,passiveLine["Toggle Other Line"]["Line"],1);
                }

                
            }
        }
        for (const key in activatedPassiveLineMultipliers){
            const passiveLine=passiveLines[key];
            for (const passiveEffect in passiveLine){
                const timingString = passiveLine["Timing"];
                const targetString = passiveLine["Target"]["Target"];
                const buffMultiplier=1;
                let totalBuff=1;
                if(passiveEffect=="ATK"||
                passiveEffect=="DEF"||
                passiveEffect=="Ki"||
                passiveEffect=="DR"
                ){
                    if("Building Stat" in passiveLine){
                        totalBuff=2
                    }
                    const dictionaryFormat=
                    {[timingString]:
                        {[targetString]:
                            {[passiveEffect]:
                                (buffMultiplier*passiveLine[passiveEffect])
                            }
                        }
                    }
                    
                    passiveBuffs=addDictionaryValues(passiveBuffs,dictionaryFormat)
                }
                else if(passiveEffect=="Additional attack"){
                    const dictionaryFormat=
                    {[timingString]:
                        {[targetString]:
                            {[passiveEffect]:
                                (buffMultiplier*1)
                            }
                        }
                    };
                    additionalAttacks.push(passiveLine["Additional attack"]["Chance of super"]);
                    passiveBuffs=addDictionaryValues(passiveBuffs,dictionaryFormat)
                }
                else if(passiveEffect=="Guard"){
                    passiveBuffs[timingString][targetString]["Guard"]=("Activated");
                }
                else if(passiveEffect=="ID" || passiveEffect=="Condition" || passiveEffect=="Timing" || passiveEffect=="Target" || passiveEffect=="Length" || passiveEffect=="Buff"||passiveEffect=="Building Stat"||passiveEffect=="Nullification"){
                    continue;
                }
                else{
                    console.log(passiveEffect)
                }
            }
        }

        this.passiveBuffs=passiveBuffs
    }

    returnBuffs(){
        return this.passiveBuffs;
    }

    incrementBuffs(additionalIsSuper){
        console.log("A")
    }
}


// GLOBAL VARIABLES
let currentJson = null;
let linkData=null;
let domainData=null;

let isEza;
let isSeza;

let baseStats={"ATK": 0, "DEF": 0, "HP": 0};

let leaderBuffs={"HP": 400, "ATK": 400, "DEF": 400, "Ki": 6};
let superBuffs={"ATK": 0, "DEF": 0, "Enemy ATK": 0, "Enemy DEF": 0, "Crit": 0, "Evasion": 0};
let linkBuffs={"ATK":0,"DEF":0,"Enemy DEF":0,"Heal":0,"KI":0,"Damage Reduction":0,"Crit":0,"Evasion":0};
let skillOrbBuffs={"Additional":0,"Crit":0,"Evasion":0,"Attack":0,"Defense":0,"SuperBoost":0,"Recovery":0}
let domainBuffs={"ATK":0,"DEF":0,"Increased damage recieved":0}
let currentKiSphere="STR";
let currentKiSphereAmount=0;
let rainbowKiSphereAmount=0;

let currentDomain=null;
let kiSources={"leader":6,"Support":0,"Links":0,"Active":0,"Domain":0,"Orbs":0};
let additionalAttacks={};
let kiCircleDictionary=[];
let passiveQueryList=[];
let startingCausalityList=[];
let relevantPassiveEffects=["Ki","ATK","DEF","Guard","Toggle Other Line","Evasion","Crit Chance","DR","Additional attack"]

export function getJsonPromise(prefix,name,suffix) {
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

export function extractDigitsFromString(string){
    let stringArray=string.split("");
    let digitArray=[];
    for(let i=0;i<stringArray.length;i++){
        if(!isNaN(stringArray[i])){
            digitArray.push(stringArray[i]);
        }
    }
    let digitInteger=digitArray.join("");
    return digitInteger
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

export function arraysHaveOverlap(array1,array2){
    for(let i=0;i<array1.length;i++){
        if(array2.includes(array1[i])){
            return true
        }
    }
    return false
}
  
export function displayDictionary(element,indentation){
    let dictionaryContainer=document.createElement("div");
    if(typeof element === 'object'){
        for (const key in element) {
            const label=document.createElement("label");
            label.innerText=key+":";
            label.style.paddingLeft=indentation+"0px";
            dictionaryContainer.appendChild(label);
            dictionaryContainer.appendChild(displayDictionary(element[key],indentation+2));
        }
    }
    else{
        const label=document.createElement("label");
        label.innerText=element+":";
        label.style.paddingLeft=indentation+"0px";
        dictionaryContainer.appendChild(label);
    }

    return dictionaryContainer
}


export function arrayToggle(originalArray,element){
    if(originalArray.includes(element)){
        originalArray.splice(originalArray.indexOf(element), 1);
        return(false);
    }
    else{
        originalArray.push(element);
        return(true);
    }
}


export function dictionaryToggle(originalDictionary,key,element) {
    if(key in originalDictionary){
        delete originalDictionary[key];
        return(false);
    }
    else{
        originalDictionary[key]=element;
        return(true);
    }
}

export function getFirstInDictionary(originalDictionary,valueList){
    for (const searchedKey in originalDictionary) {
        if(valueList.includes(originalDictionary[searchedKey])){
            return(searchedKey)
        }
    }
}

export function getLastInDictionary(originalDictionary,value){
    let output=""
    for (const searchedKey in originalDictionary) {
        if(originalDictionary[searchedKey]==value){
            output=searchedKey
        }
    }
    return(output)
}


export function iterateCausalityLogic(CausalityLogic,KiCircleObject){
    if("How many attacks has this character performed in battle?" in CausalityLogic){
        CausalityLogic["How many attacks has this character performed in battle?"]++;
    }
    if(KiCircleObject.superPerformed){
        if("How many super attacks has this character performed?" in CausalityLogic){
            CausalityLogic["How many super attacks has this character performed?"]++;
        }
    }
    return(CausalityLogic)
}


export function refreshKiCircle(){
    let superAttackRaise=0;
    let iteratingCausalityLogic=queriesToLogic(passiveQueryList);
    for (const key in kiCircleDictionary){
        kiCircleDictionary[key].display(false);
    }
    for (const key in additionalAttacks){
        additionalAttacks[key]="Unactivated";
    }
    kiCircleDictionary[0].updateCausalityLogic(iteratingCausalityLogic);
    kiCircleDictionary[0].updateConditions(0,true);
    kiCircleDictionary[0].display(true);
    iteratingCausalityLogic=iterateCausalityLogic(iteratingCausalityLogic,kiCircleDictionary[0]);
    superAttackRaise=kiCircleDictionary[0].atkRaise;
    for(const key in kiCircleDictionary[0].additionalAttacks){
        if(kiCircleDictionary[0].additionalAttacks[key]=="Offered" && additionalAttacks[key]=="Unactivated"){
            if(kiCircleDictionary[key]["attackPerformed"]){
                additionalAttacks[key]="Activated";
            }
            else{
                additionalAttacks[key]="Offered";
            }
        }
    }
    let currentRow=2;
    if(skillOrbBuffs["Additional"]>0){
        if(kiCircleDictionary["Hidden potential"]["attackPerformed"]){
            additionalAttacks["Hidden potential"]="Activated";
        }
        else{
            additionalAttacks["Hidden potential"]="Offered";
        }
    }
    additionalAttacks["Predictor1"]="Predictor"
    additionalAttacks[0]="Performed";
    let attackCount=1;
    while(Object.values(additionalAttacks).includes("Activated") || Object.values(additionalAttacks).includes("Offered") || Object.values(additionalAttacks).includes("Predictor")){
        const nextLineToActivate=getFirstInDictionary(additionalAttacks,["Activated","Offered","Predictor"]);
        if(nextLineToActivate=="Hidden potential"){
            let additionalChance=calculateAdditionalChance(skillOrbBuffs["Additional"],attackCount);
            kiCircleDictionary[nextLineToActivate].changePerformedChance(additionalChance["Normal"]+additionalChance["Super"])
            let chanceTheAdditionalIsASuper=additionalChance["Super"]/(additionalChance["Super"]+additionalChance["Normal"])
            kiCircleDictionary[nextLineToActivate].changeSuperChance(chanceTheAdditionalIsASuper)
            if(additionalChance["Normal"]!=0){
                kiCircleDictionary[nextLineToActivate].display(true)
            }
        }
        else {
            kiCircleDictionary[nextLineToActivate].display(true)
        }
        kiCircleDictionary[nextLineToActivate].changeGridRow(currentRow);
        kiCircleDictionary[nextLineToActivate].updateCausalityLogic(iteratingCausalityLogic);
        if(additionalAttacks[nextLineToActivate]=="Activated"){
            kiCircleDictionary[nextLineToActivate].updateConditions(superAttackRaise,true);
            iteratingCausalityLogic=iterateCausalityLogic(iteratingCausalityLogic,kiCircleDictionary[nextLineToActivate])
            superAttackRaise=kiCircleDictionary[nextLineToActivate].atkRaise;
            for(const key in kiCircleDictionary[nextLineToActivate].additionalAttacks){
                if(kiCircleDictionary[nextLineToActivate].additionalAttacks[key]=="Offered" && additionalAttacks[key]=="Unactivated"){
                    if(kiCircleDictionary[key]["performedChance"]==100){
                        additionalAttacks[key]="Activated";
                    }
                    else{
                        additionalAttacks[key]="Offered";
                    }
                }
            }
            additionalAttacks[nextLineToActivate]="Performed";
            currentRow++;
            attackCount++;
        }
        else if(additionalAttacks[nextLineToActivate]=="Offered"){
            kiCircleDictionary[nextLineToActivate].updateKi(0);
            kiCircleDictionary[nextLineToActivate].updateValue(0);        
            kiCircleDictionary[nextLineToActivate].display(true);
            additionalAttacks[nextLineToActivate]="Offer Displayed";
            currentRow++;
            attackCount++;
        }
        else if(additionalAttacks[nextLineToActivate]=="Predictor"){
            kiCircleDictionary[nextLineToActivate].display(false);
            kiCircleDictionary[nextLineToActivate].updateCausalityLogic(iteratingCausalityLogic);
            kiCircleDictionary[nextLineToActivate].updateConditions(0,true);
            let additionalFound=false;
            for(const key in kiCircleDictionary[nextLineToActivate].additionalAttacks){
                if(kiCircleDictionary[nextLineToActivate].additionalAttacks[key]=="Offered" && additionalAttacks[key]=="Unactivated"){
                    if(kiCircleDictionary[key]["performedChance"]==100){
                        additionalAttacks[key]="Activated";
                    }
                    else{
                        additionalAttacks[key]="Offered";
                    }
                    additionalFound=true;
                }
            }
            if(!additionalFound){
                additionalAttacks[nextLineToActivate]="Performed";
            }
        }
        
    }

}

export function calculateAdditionalChance(hiPoAdditional, attacksPerformed){
    let output={};
    output["Super"]=1-(1-hiPoAdditional/100)**attacksPerformed;
    output["Neither"]=(1-(2*hiPoAdditional/100))**attacksPerformed;
    output["Normal"]=1-output["Super"]-output["Neither"];
    //Other option if the first method doesn't work
//    output["Normal"]= -((1+  (2*hiPoAdditional)  )**attacksPerformed)    +     (1-hiPoAdditional)**attacksPerformed;    

    return output
}


export function addDictionaryValues(initialDictionary, additionalDictionary) {
    let finalDictionary = initialDictionary;
    for (const key in additionalDictionary) {
      if (key in initialDictionary) {
        if(typeof initialDictionary[key] === 'string' || typeof initialDictionary[key] === 'number') {
            finalDictionary[key] += additionalDictionary[key];
        }
        else if(typeof initialDictionary[key] === 'object') {
            finalDictionary[key]=addDictionaryValues(initialDictionary[key], additionalDictionary[key]);
        }
      } 
      else {
        finalDictionary[key] = additionalDictionary[key];
      }
    }
    return finalDictionary;
}

export function createLeaderStats(){
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
    seperateOrJoin.addEventListener('click', function(){
      if(seperateOrJoin.classList.contains("SeperateLeader")){
        seperateOrJoin.classList.remove('SeperateLeader');
        seperateOrJoin.classList.add('JointLeader');
  //      seperateOrJoin.style.width="110px";
        //seperateOrJoin.style.background = "url('dbManagement/assets/misc/leader_icon.png') repeat left";
        leaderAInputKi.style.display="none";
        leaderBInputKi.style.display="none";
        leaderTotalInputKi.style.display="block";
        leaderAInputStats.style.display="none";
        leaderBInputStats.style.display="none";
        leaderTotalInputStats.style.display="block";
      } else {
        seperateOrJoin.classList.remove('JointLeader');
        seperateOrJoin.classList.add('SeperateLeader');
        //seperateOrJoin.style.background = "url('dbManagement/assets/misc/sub_leader_icon.png') repeat left";
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
        refreshKiCircle()
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
        refreshKiCircle()
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
        refreshKiCircle()
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
    leaderAInputStats.max=200;
    leaderAInputStats.step=1;
    leaderAInputStats.value=200;

    leaderAInputStats.style.gridColumn="3";
    leaderAInputStats.style.gridRow="2"
    leaderContainer.appendChild(leaderAInputStats);
    
    let leaderBInputStats=document.createElement('input');
    leaderBInputStats.id="leader-B-Input-Stats";
    leaderBInputStats.type="number";
    leaderBInputStats.min=0;
    leaderBInputStats.max=200;
    leaderBInputStats.step=1;
    leaderBInputStats.value=200;

    leaderBInputStats.style.gridColumn="3";
    leaderBInputStats.style.gridRow="3"
    leaderContainer.appendChild(leaderBInputStats);


    let leaderTotalInputStats=document.createElement('input');
    leaderTotalInputStats.id="leader-total-Input-Stats";
    leaderTotalInputStats.type="number";
    leaderTotalInputStats.min=0;
    leaderTotalInputStats.max=400;
    leaderTotalInputStats.step=1;
    leaderTotalInputStats.value=400;

    leaderTotalInputStats.style.gridColumn="3";
    leaderTotalInputStats.style.gridRow="2"
    leaderContainer.appendChild(leaderTotalInputStats);
    

    leaderAInputStats.addEventListener('input', function(){
        if(parseInt(leaderAInputStats.value)>200){
            leaderAInputStats.value=200;
        }
        else if (parseInt(leaderAInputStats.value)<0){
            leaderAInputStats.value=0;
        }
        leaderTotalInputStats.value=parseInt(leaderAInputStats.value)+parseInt(leaderBInputStats.value);
        leaderBuffs.HP=leaderTotalInputStats.value;
        leaderBuffs.ATK=leaderTotalInputStats.value;
        leaderBuffs.DEF=leaderTotalInputStats.value;
        refreshKiCircle()
    });

    leaderBInputStats.addEventListener('input', function(){
        if(parseInt(leaderBInputStats.value)>200){
            leaderBInputStats.value=200;
        }
        else if (parseInt(leaderBInputStats.value)<0){
            leaderBInputStats.value=0;
        }
        leaderTotalInputStats.value=parseInt(leaderAInputStats.value)+parseInt(leaderBInputStats.value);
        leaderBuffs.HP=leaderTotalInputStats.value;
        leaderBuffs.ATK=leaderTotalInputStats.value;
        leaderBuffs.DEF=leaderTotalInputStats.value;
        refreshKiCircle()
    });
    
    leaderTotalInputStats.addEventListener('input', function(){
        if(parseInt(leaderTotalInputStats.value)>400){
            leaderTotalInputStats.value=400;
        }
        else if (parseInt(leaderTotalInputStats.value)<0){
            leaderTotalInputStats.value=0;
        }
        leaderBuffs.HP=leaderTotalInputStats.value;
        leaderBuffs.ATK=leaderTotalInputStats.value;
        leaderBuffs.DEF=leaderTotalInputStats.value;
        refreshKiCircle()
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

export function createLinkStats(){
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
        refreshKiCircle()
      }
      linkSlider.addEventListener('input', function(){
        linkLevel = linkSlider.value;
        linkButton.innerHTML = linkName + " <br>Level: " + linkLevel;
        createLinkBuffs();
        refreshKiCircle()
        
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
      refreshKiCircle()
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
      refreshKiCircle()
    }
    linksContainer.appendChild(allLinksButton);


    //create an paragraph so that none of the sliders are .lastchild
    let linkBuffsDiv = document.createElement('p');
    linkBuffsDiv.innerHTML = "Link Buffs: ";
    linksContainer.appendChild(linkBuffsDiv);
  ;
}


export function updateBaseStats(refreshKi=true){
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
        refreshKiCircle();
    }


  }
  
export function createEzaContainer(){
    let ezaContainer=document.getElementById('eza-container');
    while (ezaContainer.firstChild) {
        ezaContainer.removeChild(ezaContainer.firstChild);
    }
    let ezaButton = document.createElement('a');
    if(currentJson["Can EZA"]){
        ezaButton.id="eza-button";
        if(currentJson["Can SEZA"]){
            ezaButton.style.transform="translate(150px, 170px)"
        }
        else{
            ezaButton.style.transform="translate(180px, 170px)"
        }
        if(isEza == "True"){
            ezaButton.style.backgroundImage = "url('../dbManagement/assets/misc/extra/eZa.png')";
            ezaButton.onclick = function(){
                updateQueryStringParameter('EZA', 'False');
                loadPage();
            }
        }
        else if(isSeza=="True"){
            ezaButton.style.backgroundImage = "url('../dbManagement/assets/misc/extra/eZa.png')";
            ezaButton.onclick = function(){
                updateQueryStringParameter('EZA', 'False');
                updateQueryStringParameter('SEZA', 'False');
                loadPage();
            }
        }
        else{
            ezaButton.style.backgroundImage = "url('../dbManagement/assets/misc/extra/eZa_inactive.png')";
            ezaButton.onclick = function(){
                updateQueryStringParameter('EZA', 'True');
                updateQueryStringParameter('SEZA', 'False');
                loadPage();
            }
        }
        ezaButton.className="eza-button";
        ezaContainer.appendChild(ezaButton);
    }
    let sezaButton = document.createElement('a');
    if(currentJson["Can SEZA"]){
        sezaButton.style.transform="translate(150px, 170px)"
        sezaButton.id="seza-button";
        if(isSeza == "True"){
            sezaButton.style.backgroundImage = "url('../dbManagement/assets/misc/extra/seZa.png')";
            sezaButton.onclick = function(){
                updateQueryStringParameter('SEZA', 'False');
                updateQueryStringParameter('EZA', 'True');
                loadPage();
            }
        }
        else{
            sezaButton.style.backgroundImage = "url('../dbManagement/assets/misc/extra/seZa_inactive.png')";
            sezaButton.onclick = function(){
                updateQueryStringParameter('SEZA', 'True');
                updateQueryStringParameter('EZA', 'False');
                loadPage();
            }
        }
        sezaButton.className="seza-button";
        ezaContainer.appendChild(sezaButton);
    }
}

export function createTransformationContainer(){
    let transformationContainer=document.getElementById('awaken-container');
    let transformations =currentJson["Transformations"];
    const urlParams=new URLSearchParams(window.location.search);
    if( Array.isArray(transformations) && transformations.length){
        for (const transformationID of transformations){
            let unitID = transformationID;
            //creates a button that links to the suburl of the unit with the background set to the unitID within the assets/final_assets folder
            let transformationButton = document.createElement('button');
            transformationButton.style.backgroundImage = "url('../dbManagement/assets/final_assets/"+unitID+".png')";
            transformationButton.id="transformation-button";
            transformationButton.style.gridRow="1";
            transformationContainer.appendChild(transformationButton);
            transformationButton.onclick = function(){
                window.location.href = "?id="+unitID+"&SEZA="+isSeza+"&EZA="+isEza;
            }
        }
        } 
        let previousTransformations = currentJson["Transforms from"]
        if( Array.isArray(previousTransformations) && previousTransformations.length){
        for (const transformationID of previousTransformations){
            let unitID = transformationID;
            //creates a button that links to the suburl of the unit with the background set to the unitID within the assets/final_assets folder
            let transformationButton = document.createElement('button');
            transformationButton.style.backgroundImage = "url('../dbManagement/assets/final_assets/"+unitID+".png')";
            transformationButton.id="transformation-button";
            transformationButton.style.gridRow="2";
            transformationContainer.appendChild(transformationButton);
            transformationButton.onclick = function(){
            window.location.href = "?id="+unitID+"&SEZA="+isSeza+"&EZA="+isEza;
            }
        }
    } 
}

export function createLevelSlider(){
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

export function createStatsContainer(){
    const statsContainer=document.getElementById('stats-container');
    const statsContainerObject= new statsContainerClass(0,0,0);
    statsContainer.appendChild(statsContainerObject.getElement());
}

export function createPathButtons(){
    const pathButtons = Array.from(document.querySelectorAll('.toggle-btn1, .toggle-btn2, .toggle-btn3, .toggle-btn4'));
    pathButtons[0].style.gridColumn = "1"
    pathButtons[0].style.gridRow = "1"

    pathButtons[1].style.gridColumn = "1"
    pathButtons[1].style.gridRow = "3"

    pathButtons[2].style.gridColumn = "3"
    pathButtons[2].style.gridRow = "1"

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

export function createDokkanAwakenContainer(){
    let AwakeningsContainer=document.getElementById('awaken-container');
    let Awakenings =currentJson["Dokkan awakenings"];
    if( Array.isArray(Awakenings) && Awakenings.length){
    for (const AwakeningsID of Awakenings){
        let unitID = AwakeningsID;
        //creates a button that links to the suburl of the unit with the background set to the unitID within the assets/final_assets folder
        let AwakeningsButton = document.createElement('button');
        AwakeningsButton.style.backgroundImage = "url('../dbManagement/assets/final_assets/"+unitID+".png')";
        AwakeningsButton.id="awakenings-button";
        AwakeningsButton.style.gridRow="1";
        AwakeningsContainer.appendChild(AwakeningsButton);
        AwakeningsButton.onclick = function(){
        window.location.href = "?id="+unitID;
        }
    }
    }
    let previousAwakenings = currentJson["Dokkan Reverse awakenings"]
    if( Array.isArray(previousAwakenings) && previousAwakenings.length){
    for (const AwakeningsID of previousAwakenings){
        let unitID = AwakeningsID;
        //creates a button that links to the suburl of the unit with the background set to the unitID within the assets/final_assets folder
        let AwakeningsButton = document.createElement('button');
        AwakeningsButton.style.backgroundImage = "url('../dbManagement/assets/final_assets/"+unitID+".png')";
        AwakeningsButton.id="awakenings-button";
        AwakeningsButton.style.gridRow="2";
        AwakeningsButton.style.margin="0px";
        AwakeningsButton.style.border="none";
        AwakeningsContainer.appendChild(AwakeningsButton);
        AwakeningsButton.onclick = function(){
        window.location.href = "?id="+unitID;
        }
    }
    }
}

export function createStarButton(){
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


export function createKiCirclesWithClass(){
    let kiContainer = document.getElementById("ki-container");
    while (kiContainer.firstChild) {
        kiContainer.removeChild(kiContainer.firstChild);
    }
    
    let row=2;
    for(const attack in additionalAttacks){
        let kiCircle;
        if(attack=="0"){        
            kiCircle = new kiCircleClass(attack,queriesToLogic(passiveQueryList),100,100);
        }
        else if(attack=="Hidden potential"||additionalAttacks[attack]=="Predictor" ){
            kiCircle = new kiCircleClass(attack,queriesToLogic(passiveQueryList),0,0);
        }
        else{
            kiCircle = new kiCircleClass(attack,queriesToLogic(passiveQueryList),currentJson["Passive"][attack]["Chance"]||100,currentJson["Passive"][attack]["Additional attack"]["Chance of super"]);
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


export function updateQueryStringParameter(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({ path: url.href}, '', url.href);
}

export function typingToColor(typing){
    if(typing.toLowerCase()=="agl"){
        return("#0000FF")
    }
    if(typing.toLowerCase()=="str"){
        return("#FF0000")
    }
    if(typing.toLowerCase()=="teq"){
        return("#00FF00")
    }
    if(typing.toLowerCase()=="phy"){
        return("#FFFF00")
    }
    if(typing.toLowerCase()=="int"){
        return("#FF00FF")
    }
}
export function LightenColor(color, percent){
    var num = parseInt(color.slice(1),16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = (num >> 8 & 0x00FF) + amt,
    G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}

export function colorToBackground(color){
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
}

export function updateQueryList(passiveLine){
    if(passiveLine["Condition"]!=undefined){
        for(const CausalityKey of Object.keys(passiveLine["Condition"]["Causalities"])){
            const Causality = passiveLine["Condition"]["Causalities"][CausalityKey];
            let queryUpdated=false;
            startingCausalityList.push(CausalityKey);
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
                else{
                    for (const query of passiveQueryList){
                        if(query.sliderName==Causality.Slider["Name"]){
                            query.min=(Math.min(Causality.Slider["Min"],query.min)||query.min);
                            query.max=(Math.max(Causality.Slider["Max"],query.max)||query.max);
                            query.changeType("slider");
                            queryUpdated=true;
                        }
                    }
                    if(queryUpdated==false){
                        if(passiveLine["Chance"]!=undefined){
                            passiveQueryList.push( new passiveQuery("button",Causality.Button["Name"],Causality.Slider["Name"],Causality.Slider["Min"],Causality.Slider["Max"],"Has the "+passiveLine["Chance"]+"% chance triggered"));
                        }
                        else{
                            passiveQueryList.push( new passiveQuery("button",Causality.Button["Name"],Causality.Slider["Name"],Causality.Slider["Min"],Causality.Slider["Max"]) );
                        }
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
            else{
                passiveQueryList.push( new passiveQuery("slider","",passiveLine["Building Stat"]["Slider"],min,max) );
            }
        }
    }

    
}

export function createDomainContainer(){
    let domainContainer=document.getElementById('domain-container');
    const domainDropDown=document.createElement('div');
    domainDropDown.className="dropdown";
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
    domainDropDown.select.appendChild(nullOption);

    for (const domainKey in domainData){
        const domain = domainData[domainKey];
        const option = document.createElement('option');
        option.value = domain["ID"];
        option.textContent = domain["Name"];
        domainDropDown.select.appendChild(option);
    }
}

export function refreshDomainBuffs(){
    if(currentDomain=="null"){
        domainBuffs={"ATK":0,"DEF":0,"Increased damage recieved":0}
    }
    else{
        domainBuffs={"ATK":0,"DEF":0,"Increased damage recieved":0}
        let domain=domainData[currentDomain]
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
            if(efficiacy["Effect"]["Type"]=="ATK & DEF" && efficiacyActive && efficiacy["Timing"] == "On domain Being out"){
                domainBuffs["ATK"]+=efficiacy["Effect"]["ATK"];
                domainBuffs["DEF"]+=efficiacy["Effect"]["DEF"];
            }
        }
        
    }
    refreshKiCircle()
}

export function createPassiveContainer(){
    passiveQueryList=[]
    let passiveSupportContainer=document.getElementById('passive-support-container');
    let passiveQueryContainer = document.getElementById('passive-query-container');
    while (passiveQueryContainer.firstChild) {
        passiveQueryContainer.removeChild(passiveQueryContainer.firstChild);
    }


    if(!(passiveSupportContainer.firstChild)){
        const passiveATKSupport=document.createElement('div');
        passiveATKSupport.label=document.createElement('label');
        passiveATKSupport.input=document.createElement('input');
        passiveATKSupport.input.type="number";
        passiveATKSupport.input.value="0";
        passiveATKSupport.addEventListener('input', function(){
            refreshKiCircle();
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
            refreshKiCircle();
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
            kiSources.Support=parseInt(passiveKiSupport.input.value);
            refreshKiCircle();
        });
        passiveKiSupport.label.textContent="Ki Support: ";
        passiveSupportContainer.Kisupport=passiveKiSupport;
        passiveSupportContainer.appendChild(passiveKiSupport);
    }
    
    
    
    let passiveList=currentJson.Passive;

    for (const passiveLineKey of Object.keys(passiveList)) {
        if(arraysHaveOverlap(relevantPassiveEffects, Object.keys(passiveList[passiveLineKey]))){
            updateQueryList(passiveList[passiveLineKey]);
        }
    }

    for (const query of passiveQueryList) {
        passiveQueryContainer.appendChild(query.getElement());
    }
    passiveQueryContainer.style.height=passiveQueryContainer.clientHeight+"px";
}


export function initialiseAspects() {
    updateImageContainer('image-container', currentJson["ID"], currentJson.Typing);
    document.getElementById("level-container").style.display="flex";

    //change the background of the slider to the typing color
    document.title="["
    document.title+=currentJson["Leader Skill"]["Name"];
    document.title+="] ";
    document.title+=currentJson.Name;

    additionalAttacks={0: "Unactivated"};
    for (const passiveLineKey of Object.keys(currentJson.Passive)) {
        if("Additional attack" in currentJson.Passive[passiveLineKey]){
            additionalAttacks[passiveLineKey]="Unactivated";
        }
    }
    if(currentJson["Rarity"]=="ur" || currentJson["Rarity"]=="lr"){
        additionalAttacks["Hidden potential"]= "Unactivated";
    }
    additionalAttacks["Predictor1"]="Predictor"

  }

export function createSuperAttackContainer(){

    let superQuestionsContainer= document.getElementById('super-attack-questions-container');
    while (superQuestionsContainer.firstChild) {
        superQuestionsContainer.removeChild(superQuestionsContainer.firstChild);
    }
    let superAttackss=currentJson["Super Attack"];
    for (const key of Object.keys(superAttackss)){
        let superAttack = superAttackss[key];
        let superAttackObject;
        if(superAttack["superStyle"]=="Normal"){
            superAttackObject = new superAttackQueryHolder(superAttack,currentJson["Max Super Attacks"],currentJson["ID"]);
        }
        else{
            superAttackObject = new superAttackQueryHolder(superAttack,1,currentJson["ID"]);
        }
        if(superAttackObject.getElement().firstChild){
            superQuestionsContainer.appendChild(superAttackObject.getElement());
        }
    }
    for(const key of currentJson["Transforms from"]){
        let transformPromise;
        const urlParams=new URLSearchParams(window.location.search);
        if(isSeza=="True"){
            transformPromise=getJsonPromise('../dbManagement/jsonsSEZA/',key,'.json');
        }
        else if(isEza=="True"){
            transformPromise=getJsonPromise('../dbManagement/jsonsEZA/',key,'.json');
        }
        else{
            transformPromise=getJsonPromise('../dbManagement/jsons/',key,'.json');
        }
        transformPromise.then((json)=>{
            let superAttackss=json["Super Attack"];
            for (const key of Object.keys(superAttackss)){
                let superAttack = superAttackss[key];
                let superAttackObject;
                if(superAttack["superStyle"]=="Normal"){
                    superAttackObject = new superAttackQueryHolder(superAttack,json["Max Super Attacks"],json["ID"]);
                }
                else{
                    superAttackObject = new superAttackQueryHolder(superAttack,1,json["ID"]);
                }
                if(superAttackObject.getElement().firstChild){
                superQuestionsContainer.appendChild(superAttackObject.getElement());
            }
            }
        });
    }
}

// Function to update a container with new content
export function updateContainer(containerId, content){
    const container = document.getElementById(containerId);
    container.appendChild(content);
    container.innerHTML = '';
  }   

 // Function to update the image container with a new image
 export function updateImageContainer(imageContainerId, assetSubURL, typing){
  const imageContainer = document.getElementById(imageContainerId);
  while (imageContainer.firstChild) {
    imageContainer.removeChild(imageContainer.firstChild);
  }
  imageContainer.style.backgroundColor = colorToBackground(typingToColor(typing));
  const cardImage = new Image();
  cardImage.onload = function() {
    imageContainer.appendChild(cardImage);
  };
  cardImage.onerror = function() {
    console.error('Error loading image:', cardImage.src);
  };
  cardImage.src = '../dbManagement/assets/final_assets/' + assetSubURL + '.png';


  document.getElementById("cards-body-container").style.backgroundColor=LightenColor(colorToBackground(typingToColor(typing)),50);
}

  // Function to create a paragraph element with the given text
export function createParagraph(text){
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
  }


export function updateSuperAttackStacks(){
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
    refreshKiCircle();
    
}   

export function createLinkBuffs(){
    // Select all link sliders and buttons within a specific parent
    let linksContainer = document.querySelector('#links-container');
    linksContainer.style.width="200px";
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

export function createPassiveBuffs(passiveLine, passiveBuffsHolder){
    //wip add building stats and targeting
    //passiveBuffs["Timing"]["Target"]["Buff type"]["Buff amount"]
    let timing=passiveLine["Timing"];
    let target="Self"
    if("Target" in passiveLine){
        target=passiveLine["Target"]["Target"];
        if("Class" in passiveLine["Target"]){
            target=passiveLine["Target"]["Class"]+" "+target;
        }
        if("Type" in passiveLine["Target"]){
            let allTypes=";"
            for (const type in passiveLine["Target"]["Type"]){
                allTypes+=type+" and ";
            }
            allTypes=allTypes.substring(0,allTypes.length-5);
            target=allTypes+" "+target;
        }
    }
    if(!(target in passiveBuffsHolder[timing])){
        passiveBuffsHolder[timing][target]={};
    }
    let buffType=passiveLine["Buff"]["Type"];
    if(!(buffType in passiveBuffsHolder[timing][target])){
        passiveBuffsHolder[timing][target][buffType]={};
    }
    for (const buffKey in (passiveLine)){
        let buffRecieved=passiveLine[buffKey];
        const disallowedOptions = ["Buff","Nullification", "Condition", "Toggle Other Line", "Once only", "ID", "Additional attack", "Target", "Building Stat", "Length", "Timing"];
        if (!disallowedOptions.includes(buffKey)) {
            if(!(buffKey in passiveBuffsHolder[timing][target][buffType])){
                passiveBuffsHolder[timing][target][buffType][buffKey]=0;
            }
            if(passiveLine["Buff"]["+ or -"]=="-"){
                passiveBuffsHolder[timing][target][buffType][buffKey]-=buffRecieved;
            }
            else if (passiveLine["Buff"]["+ or -"]=="+"){
                passiveBuffsHolder[timing][target][buffType][buffKey]+=buffRecieved;
            }
            else{
                console.error("Error: Buff type not recognized")
            }
        }   
        else if(buffKey=="Additional attack"){
            if(!(buffKey in passiveBuffsHolder[timing][target][buffType])){
                passiveBuffsHolder[timing][target][buffType][buffKey]=[];
            }
            if(buffRecieved["Chance of super"]=="100"){
                passiveBuffsHolder[timing][target][buffType][buffKey].push("Additional Super Attack<br>");
            }
            else if(buffRecieved["Chance of super"]=="0"){
                passiveBuffsHolder[timing][target][buffType][buffKey].push("Additional Normal Attack<br>");
            }
            else{
                passiveBuffsHolder[timing][target][buffType][buffKey].push("Additional Attack with a "+buffRecieved["Chance of super"]+"% chance of being a Super Attack <br>");
            }
        }
        else if(buffKey=="Nullification"){
            if(buffRecieved["Absorbed"]!="0"){
                passiveBuffsHolder[timing][target][buffType][buffKey]="Absorbs "+buffRecieved["Absorbed"]+"% of recieved damage<br>";
            }
            else{
                passiveBuffsHolder[timing][target][buffType][buffKey]="Nullifies all recieved damage<br>";
            }
        }
        else if(buffKey=="Building Stat"){
            //WIP
            console.log()
        }
    }
}

export function queriesToLogic(queries){
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

export function updatePassiveBuffs(refreshKi=true){
    const passiveThinker = new causalityList(queriesToLogic(passiveQueryList));
    passiveThinker.updateBuffs();
    let passiveBuffs=passiveThinker.returnBuffs();
    let passiveBuffsContainer = document.getElementById('passive-buffs-container');
    passiveBuffsContainer.style.display="none";
    while (passiveBuffsContainer.firstChild) {
        passiveBuffsContainer.removeChild(passiveBuffsContainer.firstChild);
    }
    passiveBuffsContainer.appendChild(displayDictionary(passiveBuffs,0));
    if(refreshKi){
        refreshKiCircle();
    }
}

export function createSkillOrbContainer(){
    let skillOrbContainer=document.getElementById('all-skill-orb-container');
    skillOrbContainer.additionalNode=new equipNodeQuery("Additional","../dbManagement/assets/misc/potential/Pot_skill_additional.png")
    skillOrbContainer.appendChild(skillOrbContainer.additionalNode.getElement());

    skillOrbContainer.critNode=new equipNodeQuery("Crit","../dbManagement/assets/misc/potential/Pot_skill_critical.png")
    skillOrbContainer.appendChild(skillOrbContainer.critNode.getElement());

    skillOrbContainer.evasionNode=new equipNodeQuery("Evasion","../dbManagement/assets/misc/potential/Pot_skill_dodge.png")
    skillOrbContainer.appendChild(skillOrbContainer.evasionNode.getElement());

    skillOrbContainer.typeATKBoostNode=new equipNodeQuery("Attack","../dbManagement/assets/misc/potential/Pot_skill_type_damage.png")
    skillOrbContainer.appendChild(skillOrbContainer.typeATKBoostNode.getElement());

    skillOrbContainer.typeDEFBoostNode=new equipNodeQuery("Defense","../dbManagement/assets/misc/potential/Pot_skill_type_defense.png")
    skillOrbContainer.appendChild(skillOrbContainer.typeDEFBoostNode.getElement());

    skillOrbContainer.superAttackBoostNode=new equipNodeQuery("SuperBoost","../dbManagement/assets/misc/potential/Pot_skill_super.png")
    skillOrbContainer.appendChild(skillOrbContainer.superAttackBoostNode.getElement());

    skillOrbContainer.recoveryBoostNode=new equipNodeQuery("Recovery","../dbManagement/assets/misc/potential/Pot_skill_heal.png")
    skillOrbContainer.appendChild(skillOrbContainer.recoveryBoostNode.getElement());


}

export function updateKiSphereBuffs(){
    let kiGain=0;
    kiGain+=rainbowKiSphereAmount;
    if(currentJson["Typing"]==currentKiSphere){
        kiGain+=currentKiSphereAmount;
    }
    if(currentKiSphere!="Candy"){
        kiGain+=currentKiSphereAmount;
    }

    for(const Query of passiveQueryList){
        if(Query.type=="slider"){
            if(Query.sliderName.startsWith("How many ")&& Query.sliderName.endsWith("Ki Spheres have been obtained?")){
                let kiText=Query["sliderName"].substring(9,Query["sliderName"].length-31);
                let kiTypes=kiText.split(" or ");
                let specificKiGain=0;
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
    }
    

    kiSources["Orbs"]=kiGain;

    refreshKiCircle();
}

export function createKiSphereContainer(){
    const kiSphereContainer=document.getElementById("ki-sphere-container");
    const rainbowQuery=document.getElementById("rainbow-sphere-query");
    const otherQuery=document.getElementById("other-sphere-query");
    kiSphereContainer.rainbowQuery=rainbowQuery;
    kiSphereContainer.otherQuery=otherQuery;

    const rainbowlabel=document.createElement("label");
    rainbowQuery.label=rainbowlabel;
    rainbowQuery.appendChild(rainbowlabel);
    rainbowlabel.innerHTML="How many rainbow ki spheres have been obtained: 0"

    const rainbowSlider=document.createElement("input");
    rainbowQuery.slider=rainbowSlider;
    rainbowQuery.appendChild(rainbowSlider)
    rainbowSlider.type="range";
    rainbowSlider.min="0";
    rainbowSlider.max="5";
    rainbowSlider.value="0";
    rainbowSlider.addEventListener("input", function(){
        rainbowKiSphereAmount=parseInt(this.value);
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
        currentKiSphere=otherDropdown.value
        updateKiSphereBuffs()
    })
    for (const orbType of ["STR","AGL","TEQ","INT","PHY","Candy"]){
        const option = document.createElement('option');
        option.textContent = orbType;
        otherDropdown.appendChild(option);
    }

    const otherSuffixLabel=document.createElement("Label");
    otherSuffixLabel.innerHTML="ki spheres have been obtained: 0";
    otherQuery.sufffixLabel=otherSuffixLabel;
    otherQuery.appendChild(otherSuffixLabel)


    const otherSlider=document.createElement("input");
    otherQuery.appendChild(otherSlider)
    otherSlider.type="range";
    otherSlider.min="0";
    otherSlider.max="23";
    otherSlider.value="0";
    otherSlider.addEventListener("input", function(){
        currentKiSphereAmount=parseInt(this.value)
        updateKiSphereBuffs();
        this.parentElement.sufffixLabel.innerHTML="ki spheres have been obtained: "+this.value;
    })
}


export function isEmptyDictionary(dictionary){
    if(dictionary==undefined){
        return(true)
    }
    return(Object.keys(dictionary).length==0 );
}

export function logicReducer(logicString, CausalityLogic){
    //WIP
    logicString=logicString.toUpperCase();
    logicString=" "+logicString+" ";
    logicString=logicString.replaceAll("("," ( ").replaceAll(")"," ) ");
    for (const logic in (CausalityLogic)){
        logicString=logicString.replaceAll(" "+logic+" "," "+CausalityLogic[logic]+" ");
    }
    logicString=logicString.replaceAll("AND","&&").replaceAll("OR","||").replaceAll("NOT","!");
    return(eval(logicString));
}

export function logicCalculator(logicArray,sliderState){
    let logic=logicArray[0];
    logic=logic.replaceAll("and","&&");
    logic=logic.replaceAll("or","||");
    logic=logic.replaceAll("==",sliderState+"==")
    logic=logic.replaceAll(">",sliderState+">")
    logic=logic.replaceAll("<",sliderState+"<")
    return(eval(logic));
}
export function getBaseDomain() {
    let host = window.location.host; // e.g., 'www.example.com', 'staging.example.com'
    let parts = host.split('.');
    if (parts.length > 2) {
        // Remove the subdomain part (e.g., 'www', 'staging')
        parts.shift();
    }
    return parts.join('.');
}

export function loadPage(firstTime=false){
    const urlParams=new URLSearchParams(window.location.search);
    let subURL = urlParams.get('id') || "None";
    isEza = urlParams.get("EZA") || "False";
    isSeza = urlParams.get("SEZA") || "False";
    let jsonPromise;
    if(isSeza == "True" && isEza == "True"){
        isEza="False"
    }
    if(isSeza == "True"){
    jsonPromise=getJsonPromise('../dbManagement/jsonsSEZA/',subURL,'.json');
    }
    else if(isEza == "True"){
    jsonPromise=getJsonPromise('../dbManagement/jsonsEZA/',subURL,'.json');
    }
    else{
    jsonPromise=getJsonPromise('../dbManagement/jsons/',subURL,'.json');
    }
    
    let linksPromise=getJsonPromise("../dbManagement/uniqueJsons/","links",".json");
    let domainPromise=getJsonPromise("../dbManagement/uniqueJsons/","domains",".json");

    jsonPromise.then(json => {
        currentJson=json;
        linksPromise.then(links => {
            linkData=links;
            domainPromise.then(domains => {
                domainData=domains;
                initialiseAspects();
                createPassiveContainer();
                if(firstTime){
                    if(currentJson["Rarity"] == "lr" || currentJson["Rarity"] == "ur"){
                        createSkillOrbContainer();
                        createStarButton();
                        createPathButtons();
                    }
                    createLeaderStats();
                    createLinkStats();
                    createLinkBuffs();
                    createDokkanAwakenContainer();
                    createTransformationContainer();
                    createDomainContainer();
                    createStatsContainer();
                    createKiSphereContainer();
                }
                else{
                    //document.getElementById('ki-slider').dispatchEvent(new Event('input'));	
                }
                createEzaContainer();
                createLevelSlider();
                createSuperAttackContainer();
                updateBaseStats(false);
                if(currentJson["Rarity"] == "lr" || currentJson["Rarity"] == "ur"){
                    const buttonContainer = document.getElementById('hipo-button-container');
                    buttonContainer.style.display = "grid";
                }
                updatePassiveBuffs(false);
                
                createKiCirclesWithClass();
                refreshKiCircle();
            })
        })
    })
    }

    
loadPage(true)