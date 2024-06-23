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
    const allUnitsJsonPromise=webFunctions.getJson('dbManagement/jsons/','allUnits','.json');
    allUnitsJsonPromise.then(allUnitsJson => {
      document.getElementById("base-stats").style.width="0%";
      document.getElementById("base-stats").style.height="0%";
      document.getElementById("links-and-leads").style.width="0%";
      document.getElementById("links-and-leads").style.height="0%";
      document.getElementById("passive-container").style.width="0%";
      document.getElementById("passive-container").style.height="0%";
      const UNITSTODISPLAY = 40000;
      const unitsContainer = document.getElementById('unit-selection-container');
      for (let i = UNITSTODISPLAY; i > 0;i--) {
        if(i<allUnitsJson.length){
          if(allUnitsJson[i][6]=="0"){
            const unitButton = document.createElement('a');
            unitButton.id = "unit-button";
            unitButton.href = "?id=" + allUnitsJson[i];
            unitButton.style.backgroundImage = "url('dbManagement/assets/final_assets/"+allUnitsJson[i]+".png')";
            unitButton.className="unit-selection-button";
            unitsContainer.appendChild(unitButton);
          }
        }
      }
    });

    
  }
  else{
    

    let assetSubURL=subURL;
    /* Get the sub-URL from the window object
    if(subURL[6] == "1"){
      assetSubURL = subURL.slice(0, -1)+0;
    }
    else{
      assetSubURL = subURL;
    }
      */

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
      if((json["Rarity"] == "lr" || json["Rarity"] == "ur") && subURL[6]=="0"){
        let redirectURL = "?id=";
        redirectURL = redirectURL + subURL.slice(0, -1)+ "1";
        jsonPromise=webFunctions.getJson('dbManagement/jsons/',subURL.slice(0, -1)+ "1",'.json');
        webFunctions.updateQueryStringParameter("id",subURL.slice(0, -1)+ "1");
      }
    });
    const starButton=document.getElementById('star-button');
    const toggleButtons = Array.from(document.querySelectorAll('.toggle-btn1, .toggle-btn2, .toggle-btn3, .toggle-btn4'));


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



    const linksContainer=document.getElementById('links-container');
    jsonPromise.then(json => {
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
          webFunctions.updateLinkBuffs(json)
        }
        linkSlider.addEventListener('input', function(){
          linkLevel = linkSlider.value;
          linkButton.innerHTML = linkName + " <br>Level: " + linkLevel;
          linkData = links[linkName][linkLevel];
          webFunctions.updateLinkBuffs(json);
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
        webFunctions.updateLinkBuffs(json);
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
        webFunctions.updateLinkBuffs(json);
      }
      linksContainer.appendChild(allLinksButton);


      //create an paragraph so that none of the sliders are .lastchild
      let linkBuffs = document.createElement('p');
      linkBuffs.innerHTML = "Link Buffs: ";
      linksContainer.appendChild(linkBuffs);
      //webFunctions.updateLinkBuffs(json)
    });


    

    jsonPromise.then(json => {
      webFunctions.updateLinkBuffs(json);
    });

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
          if(unitID[6]=="1"){
            unitID = unitID.slice(0, -1)+0;
          }
          //creates a button that links to the suburl of the unit with the background set to the unitID within the assets/final_assets folder
          let transformationButton = document.createElement('button');
          transformationButton.style.backgroundImage = "url('dbManagement/assets/final_assets/"+unitID+".png')";
          transformationButton.id="transformation-button";
          transformationContainer.appendChild(transformationButton);
          transformationButton.onclick = function(){
            window.location.href = "?id="+unitID;
          }
        }
      } else {
        transformationContainer.style.display = "none";
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
          AwakeningsContainer.appendChild(AwakeningsButton);
          AwakeningsButton.onclick = function(){
            window.location.href = "?id="+unitID;
          }
        }
      } else {
        AwakeningsContainer.style.display = "none";
      }
    }
    );



    let levelSlider=document.getElementById('level-slider');
    let levelInput=document.getElementById('level-input');
    jsonPromise.then(json => {
      levelSlider.max = json["Max Level"];
      levelInput.max=json["Max Level"];
      levelInput.value=json["Max Level"];
      levelSlider.value=json["Max Level"];
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
    function fetchData(subURL) {
      fetch('dbManagement/jsons/' + subURL + '.json')
      .then(response =>{
          if(!response.ok){
            throw new Error('Network response was not ok' + response.statusText);
          }
          return response.json();
        })
      //everything under this can see the data from the json
      .then(data => {
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

    //create queries based on the passive skill conditions
    let passiveContainer=document.getElementById('passive-questions-container');
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

    


    fetchData(subURL);
    
    jsonPromise.then(json => {
      AdjustBaseStats(json);
      if(json["Rarity"] == "lr" || json["Rarity"] == "ur"){
        const buttonContainer = document.getElementById('hipo-button-container');
        buttonContainer.style.display = "grid";
      }
      
    });
  }
});
