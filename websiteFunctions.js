// Function to fetch JSON data based on sub-URL
export function getJson(prefix,name,suffix) {
    return fetch(prefix + name + suffix)
      .then(response => {
          if (!response.ok) {
            if(name[6]=="0"){
                name=name.slice(0, -1)+ "1";
                updateQueryStringParameter("id",name);
                return(getJson(prefix,name,suffix))
            }
            else{
              throw new Error('Network response was not ok' + response.statusText);
            }
          }
          return response.json();
      })
      .catch(error => {
          console.error('Error fetching JSON:', error);
          throw error; // Re-throw the error to propagate it to the caller
      });
  }

export function createCharacterSelection(){
    const allUnitsJsonPromise=getJson('dbManagement/jsons/','allUnits','.json');
    allUnitsJsonPromise.then(allUnitsJson => {
      document.getElementById("image-container").style.display="none";
      document.getElementById("base-stats").style.display="none";
      document.getElementById("links-and-leads").style.display="none";
      document.getElementById("super-passive-container").style.display="none";
      const UNITSTODISPLAY = 40000;
      const unitsContainer = document.getElementById('unit-selection-container');
      unitsContainer.style.width="100%";
      for (let i = UNITSTODISPLAY; i > 0;i--) {
        if(i<allUnitsJson.length){
          const unitButton = document.createElement('a');
          unitButton.id = "unit-button";
          unitButton.href = "?id=" + allUnitsJson[i];
          unitButton.style.backgroundImage = "url('dbManagement/assets/final_assets/"+allUnitsJson[i]+".png')";
          unitButton.className="unit-selection-button";
          unitsContainer.appendChild(unitButton);
        }
      }
    });
}

export function createLeaderStats(){
    const seperateOrJoin=document.getElementById('seperate-or-join-leader');
    seperateOrJoin.textContent="Joint Leader Skills";
    seperateOrJoin.classList.add('JointLeader');
    seperateOrJoin.addEventListener('click', function(){
      if(seperateOrJoin.textContent=="Seperate Leader Skills"){
        seperateOrJoin.classList.remove('SeperateLeader');
        seperateOrJoin.classList.add('JointLeader');
  //      seperateOrJoin.style.width="110px";
        seperateOrJoin.textContent="Joint Leader Skills";
        //seperateOrJoin.style.background = "url('dbManagement/assets/misc/leader_icon.png') repeat left";
        leaderAInput.style.display="none";
        leaderBInput.style.display="none";
        leaderTotalInput.style.display="block";
      } else {
        seperateOrJoin.classList.remove('JointLeader');
        seperateOrJoin.classList.add('SeperateLeader');
        seperateOrJoin.textContent="Seperate Leader Skills";
        //seperateOrJoin.style.background = "url('dbManagement/assets/misc/sub_leader_icon.png') repeat left";
  //      seperateOrJoin.style.width="220px";
        leaderAInput.style.display="block";
        leaderBInput.style.display="block";
        leaderTotalInput.style.display="none";
      }
    });

    const leaderContainer=document.getElementById('leader-container');
    leaderContainer.style.display="grid";
    let leaderAInput=document.getElementById('leader-1Input');
    leaderAInput.value=200;
    let leaderBInput=document.getElementById('leader-2Input');
    leaderBInput.value=200;
    let leaderTotalInput=document.getElementById('leader-TotalInput');
    leaderTotalInput.value=400;
    leaderAInput.addEventListener('input', function(){
      leaderTotalInput.value=parseInt(leaderAInput.value)+parseInt(leaderBInput.value);
    });

    leaderBInput.addEventListener('input', function(){
      leaderTotalInput.value=parseInt(leaderAInput.value)+parseInt(leaderBInput.value);
    });
    
    leaderTotalInput.addEventListener('input', function(){
      leaderAInput.value=Math.floor(parseInt(leaderTotalInput.value)/2);
      if(parseInt(leaderTotalInput.value)%2==0){
        leaderBInput.value=Math.floor(parseInt(leaderTotalInput.value)/2);
      } else {
        leaderBInput.value=Math.floor(parseInt(leaderTotalInput.value)/2)+1;
      }
    });
    leaderAInput.style.display="none";
    leaderBInput.style.display="none";
    leaderTotalInput.style.display="block";
}

export function createLinkStats(json){
    const linksContainer=document.getElementById('links-container');
    let links =json["Links"];
    let linkNumber=0;
    for (const link of Object.keys(links)){
      let linkName = link;
      let linkLevel = 10;
      let linkData = links[linkName][linkLevel];
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
        createLinkBuffs(json)
      }
      linkSlider.addEventListener('input', function(){
        linkLevel = linkSlider.value;
        linkButton.innerHTML = linkName + " <br>Level: " + linkLevel;
        linkData = links[linkName][linkLevel];
        createLinkBuffs(json);
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
      createLinkBuffs(json);
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
      createLinkBuffs(json);
    }
    linksContainer.appendChild(allLinksButton);


    //create an paragraph so that none of the sliders are .lastchild
    let linkBuffs = document.createElement('p');
    linkBuffs.innerHTML = "Link Buffs: ";
    linksContainer.appendChild(linkBuffs);
    //webFunctions.updateLinkBuffs(json)
  ;
}


export function AdjustBaseStats(json){
    const statsContainer = document.getElementById('stats-container');
    const starButton=document.getElementById('star-button');
    const toggleButtons = Array.from(document.querySelectorAll('.toggle-btn1, .toggle-btn2, .toggle-btn3, .toggle-btn4'));
    let levelSlider=document.getElementById('level-slider');
    statsContainer.innerHTML = '';
    const ATKstat = document.createElement('p');
    const DEFstat = document.createElement('p');
    const HPstat = document.createElement('p');
    let ATK = parseInt(json["Stats at levels"][levelSlider.value]["ATK"]);
    let DEF = parseInt(json["Stats at levels"][levelSlider.value]["DEF"]);
    let HP = parseInt((json["Stats at levels"][levelSlider.value]["HP"]));
    if(starButton.classList.contains('active') || starButton.classList.contains('rainbow')){
      ATK += parseInt(json["Hidden Potential"]["0"]["ATK"])
      DEF += parseInt(json["Hidden Potential"]["0"]["DEF"])
      HP += parseInt(json["Hidden Potential"]["0"]["HP"])
    }
    
    toggleButtons.forEach((button, index) => {
      if(button.classList.contains('active')){
        ATK += parseInt(json["Hidden Potential"][index+1]["ATK"])
        DEF += parseInt(json["Hidden Potential"][index+1]["DEF"])
        HP += parseInt(json["Hidden Potential"][index+1]["HP"])
      }
    })
  
    ATKstat.textContent = "ATK: " + ATK;
    DEFstat.textContent = "DEF: " + DEF;
    HPstat.textContent = "HP: " + HP;

    statsContainer.appendChild(HPstat);
    statsContainer.appendChild(ATKstat);
    statsContainer.appendChild(DEFstat);
  }
  
export function createEzaContainer(json,isEza,isSeza){
    let ezaContainer=document.getElementById('eza-container');
    if(json["Can EZA"]){
    let ezaButton = document.createElement('a');
    ezaButton.id="eza-button";
    if(isEza == "True"){
        ezaButton.style.backgroundImage = "url('dbManagement/assets/misc/eza_icon.png')";
        ezaButton.href = "?id="+json["ID"]+"&EZA=False";
    }
    else{
        ezaButton.style.backgroundImage = "url('dbManagement/assets/misc/eza_icon_inactive.png')";
        ezaButton.href = "?id="+json["ID"]+"&EZA=True";
    }
    ezaButton.className="eza-button";
    ezaContainer.appendChild(ezaButton);
    }
    if(json["Can SEZA"]){
    let ezaButton = document.createElement('a');
    ezaButton.id="seza-button";
    if(isSeza == "True"){
        ezaButton.style.backgroundImage = "url('dbManagement/assets/misc/Seza_icon.png')";
        ezaButton.href = "?id="+json["ID"]+"&SEZA=False";
    }
    else{
        ezaButton.style.backgroundImage = "url('dbManagement/assets/misc/Seza_icon_inactive.png')";
        ezaButton.href = "?id="+json["ID"]+"&SEZA=True";
    }
    ezaButton.className="seza-button";
    ezaContainer.appendChild(ezaButton);
    }
}

export function createTransformationContainer(json){
    let transformationContainer=document.getElementById('transformation-container');
    let transformations =json["Transformations"];
    if( Array.isArray(transformations) && transformations.length){
    for (const transformationID of transformations){
        let unitID = transformationID;
        //creates a button that links to the suburl of the unit with the background set to the unitID within the assets/final_assets folder
        let transformationButton = document.createElement('button');
        transformationButton.style.backgroundImage = "url('dbManagement/assets/final_assets/"+unitID+".png')";
        transformationButton.id="transformation-button";
        transformationButton.style.gridRow="1";
        transformationContainer.appendChild(transformationButton);
        transformationButton.onclick = function(){
        window.location.href = "?id="+unitID;
        }
    }
    } 
    let previousTransformations = json["Transforms from"]
    if( Array.isArray(previousTransformations) && previousTransformations.length){
    for (const transformationID of previousTransformations){
        let unitID = transformationID;
        if(unitID[6]=="1"){
        unitID = unitID.slice(0, -1)+0;
        }
        //creates a button that links to the suburl of the unit with the background set to the unitID within the assets/final_assets folder
        let transformationButton = document.createElement('button');
        transformationButton.style.backgroundImage = "url('dbManagement/assets/final_assets/"+unitID+".png')";
        transformationButton.id="transformation-button";
        transformationButton.style.gridRow="2";
        transformationContainer.appendChild(transformationButton);
        transformationButton.onclick = function(){
        window.location.href = "?id="+unitID;
        }
    }
    } 
}

export function createLevelSlider(json){
    let levelSlider=document.getElementById('level-slider');
    let levelInput=document.getElementById('level-input');
    levelSlider.min=json["Min Level"];
    levelInput.min=json["Min Level"];
    levelSlider.max = json["Max Level"];
    levelInput.max=json["Max Level"];
    levelInput.value=json["Max Level"];
    levelSlider.value=json["Max Level"];
    if(json["Min Level"]==json["Max Level"]){
    levelInput.disabled = true;
    levelSlider.style.display = "none";
    }

    levelSlider.addEventListener('input', function(){
        levelInput.value=levelSlider.value;
        AdjustBaseStats(json);
    });

    levelInput.addEventListener('input', function(){
      if(levelInput.value>levelSlider.max){
        levelInput.value=levelSlider.max;
      }
      levelSlider.value=levelInput.value;
      jsonPromise.then(json => {
        AdjustBaseStats(json);
      });
    });
}

export function createPathButtons(json){
    const pathButtons = Array.from(document.querySelectorAll('.toggle-btn1, .toggle-btn2, .toggle-btn3, .toggle-btn4'));

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
        AdjustBaseStats(json);
      });
    });
}

export function createDokkanAwakenContainer(json){
    let AwakeningsContainer=document.getElementById('dokkan-awaken-container');
    let Awakenings =json["Dokkan awakenings"];
    if( Array.isArray(Awakenings) && Awakenings.length){
    for (const AwakeningsID of Awakenings){
        let unitID = AwakeningsID;
        if(unitID[6]=="1"){
        unitID = unitID.slice(0, -1)+0;
        }
        //creates a button that links to the suburl of the unit with the background set to the unitID within the assets/final_assets folder
        let AwakeningsButton = document.createElement('button');
        AwakeningsButton.style.backgroundImage = "url('dbManagement/assets/final_assets/"+unitID+".png')";
        AwakeningsButton.id="awakenings-button";
        AwakeningsButton.style.gridRow="1";
        AwakeningsContainer.appendChild(AwakeningsButton);
        AwakeningsButton.onclick = function(){
        window.location.href = "?id="+unitID;
        }
    }
    }
    let previousAwakenings = json["Dokkan Reverse awakenings"]
    if( Array.isArray(previousAwakenings) && previousAwakenings.length){
    for (const AwakeningsID of previousAwakenings){
        let unitID = AwakeningsID;
        //creates a button that links to the suburl of the unit with the background set to the unitID within the assets/final_assets folder
        let AwakeningsButton = document.createElement('button');
        AwakeningsButton.style.backgroundImage = "url('dbManagement/assets/final_assets/"+unitID+".png')";
        AwakeningsButton.id="awakenings-button";
        AwakeningsButton.style.gridRow="2";
        AwakeningsButton.style.margin="0px";
        AwakeningsButton.style.border="0px";
        AwakeningsContainer.appendChild(AwakeningsButton);
        AwakeningsButton.onclick = function(){
        window.location.href = "?id="+unitID;
        }
    }
    }
}

export function createStarButton(json){
    const toggleButtons = Array.from(document.querySelectorAll('.toggle-btn1, .toggle-btn2, .toggle-btn3, .toggle-btn4'));
    const starButton=document.getElementById('star-button');
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
        AdjustBaseStats(json);
    });
}

export function createKiCircles(json){
    
    let kiContainer = document.getElementById("ki-container");

    let kiCircle = document.createElement("div");
    kiContainer.appendChild(kiCircle);


    kiCircle.style.width = "220px";
    kiCircle.style.height = "220px";
    let circleBase = document.createElement("img");
    if(json.Typing=="AGL"){
        circleBase.style.backgroundImage = "url('dbManagement/assets/misc/chara_icon/ing_type_gauge_base_00.png')";
    }
    else if(json.Typing=="TEQ"){
        circleBase.style.backgroundImage = "url('dbManagement/assets/misc/chara_icon/ing_type_gauge_base_01.png')";
    }
    else if(json.Typing=="INT"){
        circleBase.style.backgroundImage = "url('dbManagement/assets/misc/chara_icon/ing_type_gauge_base_02.png')";
    }
    else if(json.Typing=="STR"){
        circleBase.style.backgroundImage = "url('dbManagement/assets/misc/chara_icon/ing_type_gauge_base_03.png')";
    }
    else if(json.Typing=="PHY"){
        circleBase.style.backgroundImage = "url('dbManagement/assets/misc/chara_icon/ing_type_gauge_base_04.png')";
    }

    circleBase.style.width = "220px";
    circleBase.style.height = "220px";

    circleBase.style.backgroundSize = "100% 100%";

    circleBase.style.backgroundPosition = "center";

    circleBase.style.backgroundRepeat = "no-repeat";

    circleBase.style.position = "absolute";

    circleBase.style.zIndex = "0";

    kiCircle.appendChild(circleBase);
    let maxKi;
    if(json["Rarity"]=="lr"){
        maxKi=24;
    }
    else{
        maxKi=12
    }

    //create the unit image in the ki circle
    let unitImage = document.createElement("img");
    kiCircle.appendChild(unitImage);
    unitImage.style.width = "220px";
    unitImage.style.height = "220px";
    let assetID=json["ID"].slice(0, -1)+ "0";
    unitImage.style.backgroundImage = "url('dbManagement/assets/circle/" + assetID + ".png')";
    unitImage.style.backgroundSize = "100% 100%";
    unitImage.style.backgroundPosition = "center";
    unitImage.style.backgroundRepeat = "no-repeat";
    unitImage.style.position = "absolute";
    unitImage.style.zIndex = "1";
    

    //for loop that iterates 12 times
    for (let i = 0; i < 12; i++) {
        //create a circle segment
        let circleSegment = document.createElement("div");
        kiCircle.appendChild(circleSegment);
        //reference the style.css
        circleSegment.className = "ki-circle-segment";
        //set the circle segment position
        circleSegment.style.rotate = (15 + (i * 30)) + "deg";
        //place the circle segment in the correct position relative to the kiCircle div
        let xOffset = 61;
        let yOffset = -25;
        circleSegment.style.transformOrigin = "100% 100%";
        circleSegment.style.transform = "translate(" + xOffset + "px, " + yOffset + "px)";
        //set the circle segment to the front of the circle
        circleSegment.style.zIndex = "2";
        //add the circle segment to the circle
    }
    if(maxKi==24){
        for (let i=12; i<24; i++){
            //create a circle segment
            let circleSegment = document.createElement("div");
            kiCircle.appendChild(circleSegment);
            //reference the style.css
            circleSegment.className = "ki-circle-segment";
//            circleSegment.style.height="220px"

            //set the circle segment position
            circleSegment.style.backgroundSize = "100% 100%";
            //place the circle segment in the correct position relative to the kiCircle div
            let rotateAmount = (15 + (i * 30));
            let xOffset = 0;
            let yOffset = -20;
            circleSegment.style.transform = "translateX(55px)"
            circleSegment.style.transformOrigin = "50% 100%";
            circleSegment.style.transform += "rotateZ("+rotateAmount+"deg)" ;
            circleSegment.style.transform += "translateY("+yOffset+"px)";
            circleSegment.style.transform += "translateX("+xOffset+"px)";
            circleSegment.style.transform += "scaleY(1.24)";
//            circleSegment.style.transform = "rotateY(-45deg) scaleY(1.3) scaleX(1.1) translate(50px, -10px)";
            //set the circle segment to the front of the circle
            circleSegment.style.zIndex = "1";
            //add the circle segment to the circle
        }
    }
    



    let kiInput = document.createElement("div");
    kiContainer.appendChild(kiInput);
    //create the slider input
    let slider = document.createElement("input");
    kiInput.appendChild(slider);
    //set the slider class
    slider.className = "ki-slider";
    //set the slider type
    slider.type = "range";
    //set the slider id
    slider.id = "ki-slider";
    //set the slider min
    slider.min = "0";
    //set the slider max
    slider.max = maxKi;
    //set the slider value
    slider.value = maxKi;
    //set the slider step
    slider.step = "1";
    //set the slider oninput function

    let damageText=document.createElement("div");
    kiCircle.appendChild(damageText);
    damageText.className="ki-damage-text";
    damageText.id="ki-damage-text";
    damageText.style.width="220px"
    damageText.style.height="50px"
    damageText.style.position = "absolute";
    damageText.style.transform = "translate(0%, 220px";
    damageText.style.zIndex = "4";
    slider.oninput = function() {
        let attackStat=json["Ki Multiplier"][this.value]*124852.27;

        let baseATK=document.getElementById("stats-container").value;
        attackStat=Math.round(attackStat, 2);
        let numStr=attackStat.toString();
        const attackDisplay=document.getElementById("ki-damage-text");
        //remove all children of attackDisplay
        while (attackDisplay.firstChild) {
            attackDisplay.removeChild(attackDisplay.firstChild);
        }


        for(let char of numStr){
            const numDiv = document.createElement('div');
            numDiv.className="ki-damage-text";
            numDiv.classList.add(`num-${char}`);
            attackDisplay.appendChild(numDiv);
        }


        let segments = document.getElementsByClassName("ki-circle-segment");
        for (let i = 0; i < maxKi; i++) {
            //get the current segment
            let currentSegment = segments[i];
            if (i < this.value && i+12 >= this.value) {
                if(i>=12){
                    currentSegment.style.zIndex = "3";
                    currentSegment.style.display="block";
                }
                if(i<2 && json["Ki Circle Segments"][i+1]=="equal"){
                    currentSegment.classList.add("weaker");

                }
                else{
                    currentSegment.classList.add(json["Ki Circle Segments"][i+1]);
                }
            } else {
                if(i>=12){
                    currentSegment.style.zIndex = "1";
                    currentSegment.style.display="none";
                }
                if(i<2 && json["Ki Circle Segments"][i+1]=="equal"){
                    currentSegment.classList.remove("weaker");

                }
                else{
                    currentSegment.classList.remove(json["Ki Circle Segments"][i+1]);
                }
            }
        }
    }
    
    slider.dispatchEvent(new Event('input'));	



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

export function createPassiveContainer(json){
    //create queries based on the passive skill conditions
    let passiveContainer=document.getElementById('passive-questions-container');
    let superQuestionsContainer= document.getElementById('super-attack-questions-container');
    let superBuffsContainer = document.getElementById('super-attack-buffs-container');
    let conditions=[];
    

let conditionNumber=1;
let passiveLines=json["Passive"];
for (const key of Object.keys(passiveLines)){
    let line = passiveLines[key];
    if("Building Stat" in line){
    let BuildingStat = line["Building Stat"];
    let conditionAdded=false;
    //WIP
    }

    if("Condition" in line){
    let condition = line["Condition"];
    let Causalities = condition["Causalities"];
    for (const slightlySmallerKey of Object.keys(Causalities)){
        let causality=Causalities[slightlySmallerKey];
        let conditionAdded=false;
        for (const conditionsKey of Object.keys(conditions)){
        if(conditionAdded==false){
            //if slider names match
            if((conditions[conditionsKey]["Slider"]==causality["Slider"]["Name"])){
            //if button names match
            if(conditions[conditionsKey]["Button"]==causality["Button"]["Name"]){
                //if the slider name is null
                if(conditions[conditionsKey]["Slider"]==null){
                let Logic=[null,slightlySmallerKey];
                conditions[conditionsKey]["Condition Logic"].push(Logic);
                conditionAdded=true;
                }
                //if the slider has a name
                else{
                conditions[conditionsKey]["Min"]=Math.min(causality["Slider"]["Min"],conditions[conditionsKey]["Min"]);
                conditions[conditionsKey]["Max"]=Math.max(causality["Slider"]["Max"],conditions[conditionsKey]["Max"]);
                let Logic=[(causality["Slider"]["Logic"]),slightlySmallerKey];
                conditions[conditionsKey]["Condition Logic"].push(Logic);
                conditionAdded=true;
                }
                
            }
            //if button names dont match
            else{
                if(conditions[conditionsKey]["Slider"]!=null){
                conditions[conditionsKey]["Min"]=Math.min(causality["Slider"]["Min"],conditions[conditionsKey]["Min"]);
                conditions[conditionsKey]["Max"]=Math.max(causality["Slider"]["Max"],conditions[conditionsKey]["Max"]);
                let Logic=[(causality["Slider"]["Logic"]),slightlySmallerKey];
                conditions[conditionsKey]["Condition Logic"].push(Logic);
                conditions[conditionsKey]["Button or slider"]="slider";
                conditionAdded=true;
                }
                
            }
            }
            //if slider names dont match
            else if(causality["Slider"]["Name"]==null){
            if(conditions[conditionsKey]["Button"]==causality["Button"]["Name"]){
                conditions[conditionsKey]["Min"]=null;
                conditions[conditionsKey]["Max"]=null;
                let Logic=[null,slightlySmallerKey];
                conditions[conditionsKey]["Condition Logic"].push(Logic);
                conditionAdded=true;
            }
            }
        }
        }
        if(conditionAdded==false){
        //if the slider name is null
        if(causality["Slider"]["Name"]==null){
            let conditionObject={};
            conditionObject["Slider"]=null;
            conditionObject["Button"]=causality["Button"]["Name"];
            conditionObject["Min"]=null;
            conditionObject["Max"]=null;
            conditionObject["Button or slider"]="button";
            let Logic=[null,slightlySmallerKey];
            conditionObject["Condition Logic"]=[Logic];
            conditions.push(conditionObject);
            conditionAdded=true;
        }
        //if the slider has a name
        else{
            let conditionObject={};
            conditionObject["Slider"]=causality["Slider"]["Name"];
            conditionObject["Button"]=causality["Button"]["Name"];
            conditionObject["Min"]=causality["Slider"]["Min"];
            conditionObject["Max"]=causality["Slider"]["Max"];
            conditionObject["Button or slider"]="button";
            let Logic=[(causality["Slider"]["Logic"]),slightlySmallerKey];
            conditionObject["Condition Logic"]=[Logic];
            conditions.push(conditionObject);
            conditionAdded=true;
        }
    }
    }
}
}



    let CausalityList=[];
    let CausalityLogic={};
    conditionNumber=1;
    for (const key of Object.keys(conditions)){
    let condition=conditions[key];
    if(condition["Button or slider"]=="button"){
        let button = document.createElement('button');
        CausalityList.push(condition["Condition Logic"][0][1])
        CausalityLogic[condition["Condition Logic"][0][1]]=false;
        button.innerHTML=condition["Button"];
        button.style.gridRow = conditionNumber*2;
        button.style.gridColumn = 1;
        button.style.background="#FF5C35"
        button.addEventListener('click', function(){
        button.classList.toggle('active');
        CausalityLogic[condition["Condition Logic"][0][1]]=button.classList.contains('active');
        updatePassiveBuffs(json,CausalityLogic);
        if(button.classList.contains('active')){
            button.style.background="#00FF00"
        } else {
            button.style.background="#FF5C35"
        }
        });
        passiveContainer.appendChild(button);

    }
    else if(condition["Button or slider"]=="slider"){
        let slider = document.createElement('input');
        let sliderLabel = document.createElement('label');
        for (const logic of condition["Condition Logic"]){
        CausalityList.push(logic[1]);
        CausalityLogic[logic[1]]=logicCalculator(logic, condition["Min"]);
        }
        sliderLabel.innerHTML = condition["Slider"] + ": " + condition["Min"];
        sliderLabel.style.gridRow = conditionNumber*2;
        sliderLabel.style.gridColumn = 1;
        slider.type = "range";
        slider.min = condition["Min"];
        slider.max = condition["Max"];
        slider.value = condition["Min"];
        slider.style.backgroundColor = LightenColor(typingToColor(json.Typing), 30);
        slider.id="passive-slider";
        slider.style.gridRow = conditionNumber*2+1;
        slider.addEventListener('input', function(){
        sliderLabel.innerHTML = condition["Slider"] + ": " + slider.value;
        for (const logic of condition["Condition Logic"]){
            CausalityLogic[logic[1]]=logicCalculator(logic, slider.value);
        }
        updatePassiveBuffs(json,CausalityLogic);
        });
        passiveContainer.appendChild(slider);
        passiveContainer.appendChild(sliderLabel);
    }
    conditionNumber+=1;
    }
    updatePassiveBuffs(json,CausalityLogic);
    CausalityList=Array.from(new Set(CausalityList));
}

export function initialiseAspects(json) {
    updateImageContainer('image-container', json["ID"], json.Typing);
    updateContainer('text-container', createParagraph("Tgus us a text"));
    document.getElementById('text-container').innerHTML = json["ID"];
    

    //change the background of the slider to the typing color
    document.getElementById('level-slider').style.backgroundColor = LightenColor(typingToColor(json.Typing), 30);
    document.getElementById('level-container').style.display="flex";
    document.title="["
    document.title+=json["Leader Skill"]["Name"];
    document.title+="] ";
    document.title+=json.Name;

    updateContainer('typing-container', createParagraph(json.Typing || "Typing data not found"));
    updateContainer('name-container', createParagraph(json.Name || "Name not found"));
  }

export function createSuperAttackContainer(json){
    let superAttackBuffs=document.createElement('label');
    let superBuffsContainer = document.getElementById('super-attack-buffs-container');
    let superQuestionsContainer= document.getElementById('super-attack-questions-container');
    superAttackBuffs.innerHTML = "Super Attack Buffs: ";
    superBuffsContainer.appendChild(superAttackBuffs);
    let superAttackss=json["Super Attack"];
    for (const key of Object.keys(superAttackss)){
        let superAttack = superAttackss[key];
        for (const key of Object.keys(superAttack)){
        let details=["superID",
            "superName",
            "superDescription",
            "superMinKi",
            "superPriority",
            "superStyle",
            "superMinLVL",
            "superCausality",
            "superAimTarget",
            "superIsInactive",
            "SpecialBonus",
            "Multiplier"]
        if(!(details.includes(key))) {
            // non-damage buffs from the super attack
            let buffs = superAttack[key];
            if(buffs["Duration"]!="1" && buffs["Duration"]!="2" && key!="superCondition"){
                let superAttackSlider = document.createElement('input');
                let superAttackQuestion = document.createElement('label');
                superAttackSlider.innerText = "How many times has this unit performed " + superAttack["superName"] + " within the last " + buffs["Duration"] + " turns: 0";
                superAttackQuestion.innerHTML = superAttackSlider.textContent;
                superAttackQuestion.style.gridRow = 1;
                superAttackSlider.type = "range";
                superAttackSlider.style.width = "50%";
                superAttackSlider.style.cursor = "pointer";
                superAttackSlider.min = 0;
                if(superAttack["superStyle"]=="Normal"){
                    superAttackSlider.max = json["Max Super Attacks"]*((buffs["Duration"]-1)/2);
                }
                else{
                    superAttackSlider.max = (buffs["Duration"]-1)/2;
                }
                superAttackSlider.value = 0;
                superAttackSlider.style.backgroundColor = LightenColor(typingToColor(json.Typing), 30);
                superAttackSlider.id="super-slider";
                superAttackSlider.style.gridRow = 2;
                superAttackSlider.addEventListener('input', function(){
                    superAttackSlider.innerText="How many times has this unit performed " + superAttack["superName"] + " within the last " + buffs["Duration"] + " turns: " + superAttackSlider.value;
                    superAttackQuestion.innerHTML = superAttackSlider.textContent;
                    updateSuperAttackStacks(json);
                });
                superQuestionsContainer.appendChild(superAttackSlider);
                superQuestionsContainer.appendChild(superAttackQuestion);
            }
        }
        };
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
  imageContainer.style.backgroundColor = colorToBackground(typingToColor(typing));
  const cardImage = new Image();
  cardImage.onload = function() {
    imageContainer.appendChild(cardImage);
  };
  cardImage.onerror = function() {
    console.error('Error loading image:', cardImage.src);
  };
  cardImage.src = 'dbManagement/assets/final_assets/' + assetSubURL + '.png';
}

  // Function to create a paragraph element with the given text
export function createParagraph(text){
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
  }


export function updateSuperAttackStacks(json){
    let superAttacksQuestionsContainer = document.querySelector('#super-attack-questions-container');
    let superAttackStacks = superAttacksQuestionsContainer.querySelectorAll('input[type=range]');
    let totalATKBuff = 0;
    let totalDEFBuff = 0;
    let totalEnemyDEFBuff = 0;
    let totalEnemyATKBuff = 0;
    let totalCritBuff = 0;
    let totalEvasionBuff = 0;

    for (const stack of superAttackStacks){
        let stackAmount = parseInt(stack.value);
        let superName=stack.textContent.split("How many times has this unit performed ")[1].split(" within the last ")[0];
        let specifiedSuper;
        for (const superAttack in Object.keys(json["Super Attack"])){
            if(superAttack["superName"]==superName){
                specifiedSuper=superAttack;
            }
        };
        for (const Super of Object.keys(json["Super Attack"])){
            if(json["Super Attack"][Super]["superName"]==superName){
                for (const key of Object.keys(json["Super Attack"][Super])){
                    if(!["superID",
                        "superName",
                        "superDescription",
                        "superMinKi",
                        "superPriority",
                        "superStyle",
                        "superMinLVL",
                        "superCausality",
                        "superAimTarget",
                        "superIsInactive",
                        "SpecialBonus",
                        "Multiplier"].includes(key))
                        {
                            let buffs=json["Super Attack"][Super][key];
                            if("ATK" in buffs){
                                if(buffs["Target"]=="Self"){
                                    if(buffs["Buff"]["+ or -"]=="+"){
                                        totalATKBuff+=buffs["ATK"]*stackAmount;
                                    }
                                    else{
                                        totalATKBuff-=buffs["ATK"]*stackAmount;
                                    }
                                }
                                else if(buffs["Target"]=="Enemy"){
                                    if(buffs["Buff"]["+ or -"]=="+"){
                                        totalEnemyATKBuff+=buffs["ATK"]*stackAmount;
                                    }
                                    else{
                                        totalEnemyATKBuff-=buffs["ATK"]*stackAmount;
                                    }
                                }
                            }
                            if("DEF" in buffs){
                                if(buffs["Target"]=="Self"){
                                    if(buffs["Buff"]["+ or -"]=="+"){
                                        totalDEFBuff+=buffs["DEF"]*stackAmount;
                                    }
                                    else{
                                        totalDEFBuff-=buffs["DEF"]*stackAmount;
                                    }
                                }
                                else if(buffs["Target"]=="Enemy"){
                                    if(buffs["Buff"]["+ or -"]=="+"){
                                        totalEnemyDEFBuff+=buffs["DEF"]*stackAmount;
                                    }
                                    else{
                                        totalEnemyDEFBuff-=buffs["DEF"]*stackAmount;
                                    }
                                }
                            }
                            if("Crit" in buffs){
                                totalCritBuff+=buffs["Crit"]*stackAmount;
                            }
                            if("Evasion" in buffs){
                                totalEvasionBuff+=buffs["Evasion"]*stackAmount;
                            }
                        }
                    }
                }
            };
    }
    let superAttackBuffsContainer = document.getElementById('super-attack-buffs-container');
    let superAttackBuffs = document.createElement('p');
    superAttackBuffs.id = "super-attack-buffs";
    superAttackBuffs.innerHTML = "Super Attack Buffs: ";
    if (totalATKBuff) superAttackBuffs.innerHTML += "<br>ATK: " + totalATKBuff + "% ";
    if (totalDEFBuff) superAttackBuffs.innerHTML += "<br>DEF: " + totalDEFBuff + "% ";
    if (totalEnemyDEFBuff) superAttackBuffs.innerHTML += "<br>Enemy DEF: " + totalEnemyDEFBuff + "% ";
    if (totalCritBuff) superAttackBuffs.innerHTML += "<br>Crit: " + totalCritBuff + "% ";
    if (totalEvasionBuff) superAttackBuffs.innerHTML += "<br>Evasion: " + totalEvasionBuff + "% ";
    superAttackBuffsContainer.removeChild(superAttackBuffsContainer.lastChild);
    superAttackBuffsContainer.appendChild(superAttackBuffs);
}   

export function createLinkBuffs(json){
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
      let linkData = json.Links[linkName][linkLevel];

      // Add the link buffs to the total link buffs
      totalATKBuff += linkData.ATK || 0;
      totalDEFBuff += linkData.DEF || 0;
      totalEnemyDEFBuff += linkData.ENEMYDEF || 0;
      totalHealBuff += linkData.HEAL || 0;
      totalKIBuff += linkData.KI || 0;
      totalDamageReductionBuff += linkData.DREDUCTION || 0;
      totalCritBuff += linkData.CRIT || 0;
      totalEvasionBuff += linkData.EVASION || 0;
    });

    // Create a paragraph element to display the total link buffs
    let linkBuffs = document.createElement('p');
    linkBuffs.id = "link-buffs";
    linkBuffs.innerHTML = "Link Buffs: ";
    if (totalATKBuff) linkBuffs.innerHTML += "<br>ATK: " + totalATKBuff + "% ";
    if (totalDEFBuff) linkBuffs.innerHTML += "<br>DEF: " + totalDEFBuff + "% ";
    if (totalEnemyDEFBuff) linkBuffs.innerHTML += "<br>Enemy DEF: " + totalEnemyDEFBuff + "% ";
    if (totalHealBuff) linkBuffs.innerHTML += "<br>Heal: " + totalHealBuff + "% ";
    if (totalKIBuff) linkBuffs.innerHTML += "<br>KI: " + totalKIBuff + " ";
    if (totalDamageReductionBuff) linkBuffs.innerHTML += "<br>Damage Reduction: " + totalDamageReductionBuff + "% ";
    if (totalCritBuff) linkBuffs.innerHTML += "<br>Crit: " + totalCritBuff + "% ";
    if (totalEvasionBuff) linkBuffs.innerHTML += "<br>Evasion: " + totalEvasionBuff + "% ";
    //remove the old paragraph from the links container
    linksContainer.removeChild(linksContainer.lastChild);



    // Append the paragraph element to the links container
    linksContainer.appendChild(linkBuffs);
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

export function updatePassiveBuffs(json,CausalityLogic){
    //passiveBuffs["Timing"]["Target"]["Buff type"]["Buff amount"]
    let passiveBuffs={
        "Start of turn":{},
        "Attacking":{},
        "On Super":{},
        "Attacking the enemy":{},
        "Being hit":{},
        "Hit recieved":{},
        "End of turn":{},
        "After all ki collected":{},
        "Actuvating standby":{},
        "When final blow delivered":{},
        "When ki spheres collected":{}
    }
    let passiveLines=json.Passive;
    for(const passiveLine in passiveLines){
        //if there is a condition
        if("Condition" in passiveLines[passiveLine]){
            //if the condition is met
            if(logicReducer(passiveLines[passiveLine]["Condition"]["Logic"],CausalityLogic)){
                createPassiveBuffs(passiveLines[passiveLine], passiveBuffs);
            }
        }
        //if there is no condition
        else{
            createPassiveBuffs(passiveLines[passiveLine], passiveBuffs);
        }
    }
    let passiveBuffsContainer = document.getElementById('passive-buffs-container');
    passiveBuffsContainer.innerHTML = '';
    let buffNumber=5;
    for(const timing in passiveBuffs){
        if(!(isEmptyDictionary(passiveBuffs[timing]))){
            let timingContainer = document.createElement('div');
            timingContainer.style.width = "200%";
            timingContainer.style.gridColumn = buffNumber;
            timingContainer.innerHTML = timing + " Buffs: ";
            for(const target in passiveBuffs[timing]){
                timingContainer.innerHTML += "<br>" + target + ": ";
                for(const buffType in passiveBuffs[timing][target]){
                    timingContainer.innerHTML += "<br>" +"‎ ‎ ‎ ‎ "+ buffType + ": ";
                    for(const buffKey in passiveBuffs[timing][target][buffType]){
                        if((passiveBuffs[timing][target][buffType][buffKey])!=NaN){
                            timingContainer.innerHTML += '<br>' + "‎ ‎‎ ‎ ‎ ‎  ‎ ‎ "+buffKey + ": " + passiveBuffs[timing][target][buffType][buffKey];
                        }
                    }
                }
            }
            passiveBuffsContainer.appendChild(timingContainer);
            buffNumber++;
        }
    }
}

export function isEmptyDictionary(dictionary){
    return(Object.keys(dictionary).length==0);
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