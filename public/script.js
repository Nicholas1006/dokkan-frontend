document.addEventListener('DOMContentLoaded', function() {
  function TypingToColor(typing){
    console.log(typing)
    console.log(typing.upperCase());
    switch(typing.upperCase()){
      case "AGL":
        return "#00FF00";
      case "STR":
        return "#FF0000";
      case "PHY":
        return "#FFA500";
      case "INT":
        return "#0000FF";
      case "TEQ":
        return "#FFFF00";
      default:
        return "#FFFFFF";
    }
  }
  const toggleButton1  = document.getElementById('toggle-button1');
  toggleButton1.addEventListener('click', function() {
    toggleButton1.classList.toggle('active');
    jsonPromise.then(json => {
      AdjustHiPo(json);
    });
  });

  const toggleButton2  = document.getElementById('toggle-button2');
  toggleButton2.addEventListener('click', function() {
    toggleButton2.classList.toggle('active');
    jsonPromise.then(json => {
      AdjustHiPo(json);
    });
  });

  const toggleButton3  = document.getElementById('toggle-button3');
  toggleButton3.addEventListener('click', function() {
    toggleButton3.classList.toggle('active');
    jsonPromise.then(json => {
      AdjustHiPo(json);
    });
  });

  const toggleButton4  = document.getElementById('toggle-button4');
  toggleButton4.addEventListener('click', function() {
    toggleButton4.classList.toggle('active');
    jsonPromise.then(json => {
      AdjustHiPo(json);
    });
  });


    function getJson(subURL) {
      return fetch('dbManagement/jsonsCompressed/' + subURL + '.json')
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
  
    

  // Function to fetch JSON data and image based on sub-URL
  function fetchData(subURL) {
    fetch('dbManagement/jsonsCompressed/' + subURL + '.json')
      
    .then(response =>{
        if(!response.ok){
          throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
      })


    .then(data => {
      document.title=data["Leader Skill"]["Name"];
      document.title+=data.Name;
      const typingText = data.Typing || "Typing data not found";
      const typingContainer = document.getElementById('typing-container');
      typingContainer.innerHTML = '';
      const typing = document.createElement('p');
      typing.textContent = typingText;
      typingContainer.appendChild(typing);

      const nameText = data.Name || "Name not found";
      const nameContainer = document.getElementById('name-container');
      nameContainer.innerHTML = '';
      const name = document.createElement('p');
      name.textContent = nameText;
      nameContainer.appendChild(name);

      const categoriesList = document.getElementById('categories-list');
      categoriesList.innerHTML = ''; // Clear the categories list before appending items
      data.Categories.forEach(category => {
        const listItem = document.createElement('li');
        listItem.textContent = category;
        categoriesList.appendChild(listItem);
      });

        
        
        
      })
      .catch(error => console.error('Error fetching JSON:', error));
    
    const imageContainer = document.getElementById('image-container');
    imageContainer.style.backgroundColor = TypingToColor(data.Typing);
    imageContainer.style.backgroundColor = "#00FFFF";
    const cardImage = new Image();
    cardImage.onload = function() {
      imageContainer.appendChild(cardImage);
    };
    cardImage.onerror = function() {
      console.error('Error loading image:', cardImage.src);
    };
    cardImage.src = 'dbManagement/assets/final_assets/' + subURL + '.png';

    
    
    const textContainer = document.getElementById('text-container');
    const text = document.createElement('p');
    text.textContent = "This is a text";
    textContainer.appendChild(text);
    textContainer.innerHTML = subURL;

  }

  function AdjustHiPo(json){
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = '';
    const ATKstat = document.createElement('p');
    const DEFstat = document.createElement('p');
    const HPstat = document.createElement('p');
    let ATK = parseInt(json["Max ATK"]);
    ATK += parseInt(json["Hidden Potential"]["0"]["ATK"])
    let DEF = parseInt(json["Max DEF"]);
    DEF += parseInt(json["Hidden Potential"]["0"]["DEF"])
    let HP = parseInt(json["Max HP"]);
    HP += parseInt(json["Hidden Potential"]["0"]["HP"])
    
    if(toggleButton1.classList.contains('active')){
      ATK += parseInt(json["Hidden Potential"]["1"]["ATK"])
      DEF += parseInt(json["Hidden Potential"]["1"]["DEF"])
      HP += parseInt(json["Hidden Potential"]["1"]["HP"])
    }
    if(toggleButton2.classList.contains('active')){
      ATK += parseInt(json["Hidden Potential"]["2"]["ATK"])
      DEF += parseInt(json["Hidden Potential"]["2"]["DEF"])
      HP += parseInt(json["Hidden Potential"]["2"]["HP"])
    }
    if(toggleButton3.classList.contains('active')){
      ATK += parseInt(json["Hidden Potential"]["3"]["ATK"])
      DEF += parseInt(json["Hidden Potential"]["3"]["DEF"])
      HP += parseInt(json["Hidden Potential"]["3"]["HP"])
    }
    if(toggleButton4.classList.contains('active')){
      ATK += parseInt(json["Hidden Potential"]["4"]["ATK"])
      DEF += parseInt(json["Hidden Potential"]["4"]["DEF"])
      HP += parseInt(json["Hidden Potential"]["4"]["HP"])
    }

    ATKstat.textContent = "ATK: " + ATK;
    DEFstat.textContent = "DEF: " + DEF;
    HPstat.textContent = "HP: " + HP;

    statsContainer.appendChild(ATKstat);
    statsContainer.appendChild(DEFstat);
    statsContainer.appendChild(HPstat);
  }

  if(window.suburl[6] == "1"){
    subURL = window.suburl.slice(0, -1)+0;
    console.log(subURL);
  }
  else{
    subURL = window.suburl;
  }


  fetchData(subURL);
  jsonPromise=getJson(subURL);
  jsonPromise.then(json => {
    if(json["Rarity"] == "lr" || json["Rarity"] == "or"){
      AdjustHiPo(json);
    }
    
  });






});
