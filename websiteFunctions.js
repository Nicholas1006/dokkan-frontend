// Function to fetch JSON data based on sub-URL
export function getJson(subURL) {
    return fetch('dbManagement/jsons/' + subURL + '.json')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok' + response.statusText);
          }
          return response.json();
      })
      .catch(error => {
          console.error('Error fetching JSON:', error);
          throw error; // Re-throw the error to propagate it to the caller
      });
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

// Function to update a container with new content
export function updateContainer(containerId, content){
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    container.appendChild(content);
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



export function updateLinkBuffs(json){
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
    linkBuffs.style.height = "100px";
    linkBuffs.style.width = "200%";
    linkBuffs.style.gridColumnStart = "1";
    linkBuffs.style.gridColumnEnd = "30";
    linkBuffs.style.gridColumn = "1";
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


export function addPassiveLineBuffs(passiveLine, passiveBuffsHolder){
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
                addPassiveLineBuffs(passiveLines[passiveLine], passiveBuffs);
            }
        }
        //if there is no condition
        else{
            addPassiveLineBuffs(passiveLines[passiveLine], passiveBuffs);
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
    logicString=logicString.toUpperCase();
    for (const logic in (CausalityLogic)){
        logicString=logicString.replaceAll(logic,CausalityLogic[logic]);
    }
    logicString=logicString.replaceAll("AND","&&").replaceAll("OR","||").replaceAll("NOT","!");
    return(eval(logicString));
}



export function logicCalculator(logicArray,sliderState){
    let logic=logicArray[0];
    logic=logic.replaceAll("and","&&");
    logic=logic.replaceAll("or","||");
    logic=logic.replaceAll("==",sliderState+"==")
    logic=logic.replaceAll(">=",sliderState+">=")
    logic=logic.replaceAll("<=",sliderState+"<=")
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