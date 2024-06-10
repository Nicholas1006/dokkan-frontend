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
      console.log("No transformations found");
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

      const categoriesList = document.getElementById('categories-list');
      categoriesList.innerHTML = ''; // Clear the categories list before appending items
      data.Categories.forEach(category => {
        const listItem = document.createElement('li');
        listItem.textContent = category;
        categoriesList.appendChild(listItem);
      });
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

  


  fetchData(subURL);
  
  jsonPromise.then(json => {
    AdjustBaseStats(json);
    if(json["Rarity"] != "lr" && json["Rarity"] != "ur"){
      const buttonContainer = document.getElementById('hipo-button-container');
      buttonContainer.style.display = "none";
    }
    
  });
});
