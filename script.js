import * as webFunctions from "./websiteFunctions.js";
document.addEventListener('DOMContentLoaded', function() {

  const urlParams=new URLSearchParams(window.location.search);
  let subURL = urlParams.get('id') || "None";
  let characterSelector = urlParams.get("Selection") || "False";
  let isSeza = urlParams.get("SEZA") || "False";
  let isEza;
  let jsonPromise;
  if(isSeza == "False"){
    isEza = urlParams.get("EZA") || "False";
  }
  else{
    isEza = "False";
  }
  if(subURL == "None"){
    characterSelector = "True";
  }
  if(characterSelector == "True"){
    webFunctions.createCharacterSelection();
  }
  else{
    

    let assetSubURL=subURL;

    if(isSeza == "True"){
      jsonPromise=webFunctions.getJson('dbManagement/jsonsSEZA/',subURL,'.json');
    }
    else if(isEza == "True"){
      jsonPromise=webFunctions.getJson('dbManagement/jsonsEZA/',subURL,'.json');
    }
    else{
      jsonPromise=webFunctions.getJson('dbManagement/jsons/',subURL,'.json');
    }

  jsonPromise.then(json => {
    webFunctions.createLeaderStats();
    webFunctions.createLinkStats(json);
    webFunctions.createLinkBuffs(json);
  })
    const starButton=document.getElementById('star-button');
    const toggleButtons = Array.from(document.querySelectorAll('.toggle-btn1, .toggle-btn2, .toggle-btn3, .toggle-btn4'));

    
    let ezaContainer=document.getElementById('eza-container');
    jsonPromise.then(json => {
      if(json["Can EZA"]){
        let ezaButton = document.createElement('a');
        ezaButton.id="eza-button";
        if(isEza == "True"){
          ezaButton.style.backgroundImage = "url('dbManagement/assets/misc/eza_icon.png')";
          ezaButton.href = "?id="+subURL+"&EZA=False";
        }
        else{
          ezaButton.style.backgroundImage = "url('dbManagement/assets/misc/eza_icon_inactive.png')";
          ezaButton.href = "?id="+subURL+"&EZA=True";
        }
        ezaButton.className="eza-button";
        ezaContainer.appendChild(ezaButton);
      }
      if(json["Can SEZA"]){
        let ezaButton = document.createElement('a');
        ezaButton.id="seza-button";
        if(isSeza == "True"){
          ezaButton.style.backgroundImage = "url('dbManagement/assets/misc/Seza_icon.png')";
          ezaButton.href = "?id="+subURL+"&SEZA=False";
        }
        else{
          ezaButton.style.backgroundImage = "url('dbManagement/assets/misc/Seza_icon_inactive.png')";
          ezaButton.href = "?id="+subURL+"&SEZA=True";
        }
        ezaButton.className="seza-button";
        ezaContainer.appendChild(ezaButton);
      }
    });

    let transformationContainer=document.getElementById('transformation-container');
    jsonPromise.then(json => {
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
    );

    let AwakeningsContainer=document.getElementById('dokkan-awaken-container');
    jsonPromise.then(json => {
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
    );


    
    let levelSlider=document.getElementById('level-slider');
    let levelInput=document.getElementById('level-input');
    jsonPromise.then(json => {
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
    });

    levelSlider.addEventListener('input', function(){
      levelInput.value=levelSlider.value;
      jsonPromise.then(json => {
        AdjustBaseStats(json);
      });
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
      jsonPromise.then(json => {
        AdjustBaseStats(json);
      });
    });

    // Add event listeners to toggle buttons
    toggleButtons.forEach(button => {
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
    });

    // Function to fetch JSON data and image based on sub-URL
    function initialiseAspects(jsonPromise) {
      //everything under this can see the data from the json
      jsonPromise.then(data => {
        webFunctions.updateImageContainer('image-container', assetSubURL, data.Typing);
        webFunctions.updateContainer('text-container', webFunctions.createParagraph("Tgus us a text"));
        document.getElementById('text-container').innerHTML = subURL;
        

        //change the background of the slider to the typing color
        document.getElementById('level-slider').style.backgroundColor = webFunctions.LightenColor(webFunctions.typingToColor(data.Typing), 30);
        document.getElementById('level-container').style.display="flex";
        document.title="["
        document.title+=data["Leader Skill"]["Name"];
        document.title+="] ";
        document.title+=data.Name;

        webFunctions.updateContainer('typing-container', webFunctions.createParagraph(data.Typing || "Typing data not found"));
        webFunctions.updateContainer('name-container', webFunctions.createParagraph(data.Name || "Name not found"));

        /*const categoriesList = document.getElementById('categories-list');
        categoriesList.innerHTML = ''; // Clear the categories list before appending items
        data.Categories.forEach(category => {
          const listItem = document.createElement('li');
          listItem.textContent = category;
          categoriesList.appendChild(listItem);
        });
        */
        })
        .catch(error => console.error('Error fetching JSON:', error));
    }

    function AdjustBaseStats(json){
      const statsContainer = document.getElementById('stats-container');
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



    jsonPromise.then(json => {
      //create ki circle
      webFunctions.createKiCircles(json);
    });

    //create queries based on the passive skill conditions
    let passiveContainer=document.getElementById('passive-questions-container');
    let superQuestionsContainer= document.getElementById('super-attack-questions-container');
    let superBuffsContainer = document.getElementById('super-attack-buffs-container');
    let conditions=[];
    /*every time we find a causality that includes a condition we will do one of the following
    1. if the slider name is not already in the conditions object, we will add it
    2. If the slider name is already in the condition object we will check if the button name is the same, if not we will tell it to become a slider
  
    when it is stored within the conditions dictionary it must store the following:
    1. slider name
    2. button name
    3. min value
    4. max value
    5. if its a button or slider
    6. all condition numbers that rely on it

    */
    jsonPromise.then(json => {
      let superAttackBuffs=document.createElement('label');
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
              superAttackSlider.max = parseInt(buffs["Duration"]);
              superAttackSlider.value = 0;
              superAttackSlider.style.backgroundColor = webFunctions.LightenColor(webFunctions.typingToColor(json.Typing), 30);
              superAttackSlider.id="super-slider";
              superAttackSlider.style.gridRow = 2;
              superAttackSlider.addEventListener('input', function(){
                superAttackSlider.innerText="How many times has this unit performed " + superAttack["superName"] + " within the last " + buffs["Duration"] + " turns: " + superAttackSlider.value;
                superAttackQuestion.innerHTML = superAttackSlider.textContent;
                webFunctions.updateSuperAttackStacks(json);
              });
              superQuestionsContainer.appendChild(superAttackSlider);
              superQuestionsContainer.appendChild(superAttackQuestion);
            }
          }
        };
      }
    });

    jsonPromise.then(json => {
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
          webFunctions.updatePassiveBuffs(json,CausalityLogic);
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
          CausalityLogic[logic[1]]=webFunctions.logicCalculator(logic, condition["Min"]);
        }
        sliderLabel.innerHTML = condition["Slider"] + ": " + condition["Min"];
        sliderLabel.style.gridRow = conditionNumber*2;
        sliderLabel.style.gridColumn = 1;
        slider.type = "range";
        slider.min = condition["Min"];
        slider.max = condition["Max"];
        slider.value = condition["Min"];
        slider.style.backgroundColor = webFunctions.LightenColor(webFunctions.typingToColor(json.Typing), 30);
        slider.id="passive-slider";
        slider.style.gridRow = conditionNumber*2+1;
        slider.addEventListener('input', function(){
          sliderLabel.innerHTML = condition["Slider"] + ": " + slider.value;
          for (const logic of condition["Condition Logic"]){
            CausalityLogic[logic[1]]=webFunctions.logicCalculator(logic, slider.value);
          }
          webFunctions.updatePassiveBuffs(json,CausalityLogic);
        });
        passiveContainer.appendChild(slider);
        passiveContainer.appendChild(sliderLabel);
      }
      conditionNumber+=1;
    }
    webFunctions.updatePassiveBuffs(json,CausalityLogic);
    CausalityList=Array.from(new Set(CausalityList));
    });

    


    initialiseAspects(jsonPromise);
    
    jsonPromise.then(json => {
      AdjustBaseStats(json);
      if(json["Rarity"] == "lr" || json["Rarity"] == "ur"){
        const buttonContainer = document.getElementById('hipo-button-container');
        buttonContainer.style.display = "grid";
      }
      
    });
  }
});
