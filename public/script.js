import * as webFunctions from "./websiteFunctions.js";
document.addEventListener('DOMContentLoaded', function() {
  
  let assetSubURL;
  // Get the sub-URL from the window object
  if(window.suburl[6] == "1"){
    assetSubURL = window.suburl.slice(0, -1)+0;
  }
  else{
    assetSubURL = window.suburl;
  }
  let subURL = window.suburl;

  const jsonPromise=webFunctions.getJson(subURL);

  const starButton=document.getElementById('star-button');
  const toggleButtons = Array.from(document.querySelectorAll('.toggle-btn1, .toggle-btn2, .toggle-btn3, .toggle-btn4'));

  const seperateOrJoin=document.getElementById('seperate or join leader');
  seperateOrJoin.textContent="Joint Leader Skills";
  seperateOrJoin.style.background = "url('dbManagement/assets/misc/leader_icon.png') repeat left";
  seperateOrJoin.style.width="110px";
  seperateOrJoin.style.height="50px";
  seperateOrJoin.style.gridRow="1";
  seperateOrJoin.style.gridArea="1/1/2/3";
  seperateOrJoin.addEventListener('click', function(){
    if(seperateOrJoin.textContent=="Seperate Leader Skills"){
      seperateOrJoin.style.width="110px";
      seperateOrJoin.textContent="Joint Leader Skills";
      seperateOrJoin.style.background = "url('dbManagement/assets/misc/leader_icon.png') repeat left";
      leaderAInput.style.display="none";
      leaderBInput.style.display="none";
      leaderTotalInput.style.display="block";
    } else {
      seperateOrJoin.textContent="Seperate Leader Skills";
      seperateOrJoin.style.background = "url('dbManagement/assets/misc/sub_leader_icon.png') repeat left";
      seperateOrJoin.style.width="220px";
      leaderAInput.style.display="block";
      leaderBInput.style.display="block";
      leaderTotalInput.style.display="none";
    }
  });

  
  




  const leaderContainer=document.getElementById('leader-1Input');
  let leaderAInput=document.getElementById('leader-1Input');
  leaderAInput.value=200;
  leaderAInput.style.gridRow=2;
  leaderAInput.style.width="110px"
  leaderAInput.style.margin="0px";
  let leaderBInput=document.getElementById('leader-2Input');
  leaderBInput.value=200;
  leaderBInput.style.gridRow=2;
  leaderBInput.style.width="110px"
  let leaderTotalInput=document.getElementById('leader-TotalInput');
  leaderTotalInput.value=400;
  leaderTotalInput.style.gridRow=2;
  leaderTotalInput.style.width="110px"
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
      linkButton.style.height = "60px";
      linkButton.style.border = "none";
      linkButton.style.margin = "0px";
      linkButton.style.cursor = "pointer";
      linkButton.style.background="#00FF00"
      linkButton.style.gridRow= linkNumber*2;
      linkButton.classList.add('active');
      let linkSlider = document.createElement('input');
      linkSlider.type = "range";
      linkSlider.min = 1;
      linkSlider.max = 10;
      linkSlider.value = 10;
      linkSlider.style.height = "20px";
      linkSlider.style.border = "1px solid black";
      linkSlider.style.margin = "0px";
      linkSlider.style.cursor = "pointer";
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
        updateLinkBuffs(json)
      }
      linkSlider.addEventListener('input', function(){
        linkLevel = linkSlider.value;
        linkButton.innerHTML = linkName + " <br>Level: " + linkLevel;
        linkData = links[linkName][linkLevel];
        updateLinkBuffs(json);
      });
      linkNumber+=1;
    };

    
    let allLinksSlider = document.createElement('input');
    allLinksSlider.type = "range";
    allLinksSlider.min = 1;
    allLinksSlider.max = 10;
    allLinksSlider.value = 10;
    allLinksSlider.style.height = "20px";
    allLinksSlider.style.border = "1px solid black";
    allLinksSlider.style.margin = "0px";
    allLinksSlider.style.cursor = "pointer";
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
      updateLinkBuffs(json);
    });
    linksContainer.appendChild(allLinksSlider);

    let allLinksButton = document.createElement('button');
    allLinksButton.innerHTML = "All Links";
    allLinksButton.style.height = "60px";
    allLinksButton.style.border = "none";
    allLinksButton.style.margin = "0px";
    allLinksButton.style.cursor = "pointer";
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
      updateLinkBuffs(json);
    }
    linksContainer.appendChild(allLinksButton);


    //create an paragraph so that none of the sliders are .lastchild
    let linkBuffs = document.createElement('p');
    linkBuffs.innerHTML = "Link Buffs: ";
    linksContainer.appendChild(linkBuffs);
    //updateLinkBuffs(json)
  });


  function updateLinkBuffs(json){
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

  jsonPromise.then(json => {
    updateLinkBuffs(json);
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
        transformationButton.style.backgroundSize = "100% 100%";
        transformationButton.style.backgroundRepeat = "no-repeat";
        transformationButton.style.backgroundPosition = "center";
        transformationButton.style.width = "109px";
        transformationButton.style.height = "100px";
        transformationButton.style.border = "none";
        transformationButton.style.margin = "5px";
        transformationButton.style.cursor = "pointer";
        transformationContainer.appendChild(transformationButton);
        transformationButton.onclick = function(){
          window.location.href = "/"+unitID;
        }
      }
    } else {
      transformationContainer.style.display = "none";
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
  


  // Function to handle button click event
  function toggleButtonHandler(button, jsonPromise) {
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
    toggleButtonHandler(button, jsonPromise);
  });
  
  // Function to update a container with new content
  function updateContainer(containerId, content){
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    container.appendChild(content);
  }    

  // Function to create a paragraph element with the given text
  function createParagraph(text){
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
  }

  // Function to update the image container with a new image
  function updateImageContainer(imageContainerId, subURL, typing){
    const imageContainer = document.getElementById(imageContainerId);
    imageContainer.style.backgroundColor = webFunctions.colorToBackground(webFunctions.typingToColor(typing));
    const cardImage = new Image();
    cardImage.onload = function() {
      imageContainer.appendChild(cardImage);
    };
    cardImage.onerror = function() {
      console.error('Error loading image:', cardImage.src);
    };
    cardImage.src = 'dbManagement/assets/final_assets/' + assetSubURL + '.png';
  }

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
      if((data["Rarity"] == "lr" || data["Rarity"] == "ur") && subURL[6]=="0"){
        let redirectURL = window.location.protocol + "//" + window.location.host;
        redirectURL = redirectURL + "/" + subURL.slice(0, -1)+ "1";
        window.location.href = redirectURL;
      }

      //change the background of the slider to the typing color
      document.getElementById('level-slider').style.backgroundColor = webFunctions.LightenColor(webFunctions.typingToColor(data.Typing), 30);
      document.title=data["Leader Skill"]["Name"];
      document.title+=data.Name;

      updateContainer('typing-container', createParagraph(data.Typing || "Typing data not found"));
      updateContainer('name-container', createParagraph(data.Name || "Name not found"));

      /*const categoriesList = document.getElementById('categories-list');
      categoriesList.innerHTML = ''; // Clear the categories list before appending items
      data.Categories.forEach(category => {
        const listItem = document.createElement('li');
        listItem.textContent = category;
        categoriesList.appendChild(listItem);
      });
      */
      updateImageContainer('image-container', subURL, data.Typing);
      updateContainer('text-container', createParagraph("Tgus us a text"));
      document.getElementById('text-container').innerHTML = subURL;
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
  let passiveContainer=document.getElementById('passive-container');
  jsonPromise.then(json => {
    let passiveLines=json["Passive"];
    console.log(passiveLines)

    for (const key of Object.keys(passiveLines)){
      let line = passiveLines[key];
      if("Condition" in line){
        let condition = line["Condition"];
        let Causalities = condition["Causalities"];
        for (const slightlySmallerKey of Object.keys(Causalities)){
          let causality=Causalities[slightlySmallerKey];
          let sliderText=causality["Slider"]["Name"];
          let slider = document.createElement('input');
          slider.type = "range";
          slider.min = causality["Slider"]["Min"] || 0;
          slider.max = causality["Slider"]["Max"] || 100;
          slider.value = 1;
          slider.style.height = "20px";
          slider.style.border = "1px solid black";
          slider.style.margin = "0px";
          slider.style.cursor = "pointer";
          passiveContainer.appendChild(slider);
        }
      }
    }
  }
  )
  


  fetchData(subURL);
  
  jsonPromise.then(json => {
    AdjustBaseStats(json);
    if(json["Rarity"] != "lr" && json["Rarity"] != "ur"){
      const buttonContainer = document.getElementById('hipo-button-container');
      buttonContainer.style.display = "none";
    }
    
  });
});
