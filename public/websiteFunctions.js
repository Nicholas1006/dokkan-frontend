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
 export function updateImageContainer(imageContainerId, subURL, typing){
  const imageContainer = document.getElementById(imageContainerId);
  imageContainer.style.backgroundColor = colorToBackground(typingToColor(typing));
  const cardImage = new Image();
  cardImage.onload = function() {
    imageContainer.appendChild(cardImage);
  };
  cardImage.onerror = function() {
    console.error('Error loading image:', cardImage.src);
  };
  cardImage.src = 'dbManagement/assets/final_assets/' + subURL + '.png';
}

  // Function to create a paragraph element with the given text
export function createParagraph(text){
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
  }


  // Function to handle button click event
export function toggleButtonHandler(button, jsonPromise) {
    button.addEventListener('click', function() {
      button.classList.toggle('active');
      //if 55% is not active, make it active
      if (!starButton.classList.contains('active')) {
        starButton.classList.toggle('active');
      }
      //if every button is active, turn on rainbow star
      if(toggleButtons.every(button => button.classList.contains('active'))){
        starButton.classList.remove('active');
        starButton.classList.add('rainbow')
      }
      //if rainbow star is active, turn it off 
      else{
        starButton.classList.remove('rainbow');
      }
      jsonPromise.then(json => {
        AdjustBaseStats(json);
      });
    });
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

export function updatePassiveBuffs(json,CausalityLogic){
    console.log(CausalityLogic)
    let passiveLines=json.Passive;
    for(const passiveLine in passiveLines){
        console.log(passiveLines[passiveLine])
        if("Condition" in passiveLines[passiveLine]){
            if(logicReducer(passiveLines[passiveLine]["Condition"]["Logic"],CausalityLogic)){
                console.log(passiveLines[passiveLine])
                console.log("Activate this condition")
            }
        }
        else{
            console.log("Activate this condition")
        }
    }
}

export function logicReducer(logicString, CausalityLogic){
    logicString=logicString.replace(" ","");
    logicString=logicString.toUpperCase();
    for (const logic in (CausalityLogic)){
        logicString=logicString.replace(logic,CausalityLogic[logic]);
    }
    while(logicString!="true"&&logicString!="false"){
        console.log(logicString)
        logicString=logicString.replace("falseORfalse","false");
        logicString=logicString.replace("falseORtrue","true");
        logicString=logicString.replace("trueORfalse","true");
        logicString=logicString.replace("trueORtrue","true");

        logicString=logicString.replace("falseANDfalse","false");
        logicString=logicString.replace("falseANDtrue","false");
        logicString=logicString.replace("trueANDfalse","false");
        logicString=logicString.replace("trueANDtrue","true");

        logicString=logicString.replace("NOTfalse","true");
        logicString=logicString.replace("NOTtrue","false");

        logicString=logicString.replace("(false)","false");
        logicString=logicString.replace("(true)","true");
        logicString="true";
    }
}



export function logicCalculator(logicArray,sliderState){
    let logic=logicArray[0];
    logic=logic.substring(0, 2);
    
    if(logic=="=="){
        return(sliderState==(logicArray[0].substring(2)));
    }
    if(logic=="<="){
        return(sliderState<=(logicArray[0].substring(2)));
    }
    if(logic==">="){
        return(sliderState>=(logicArray[0].substring(2)));
    }
    else{
        return(logic);
    }
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