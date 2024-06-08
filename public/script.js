document.addEventListener('DOMContentLoaded', function() {
  let fetchedData = null;

  const toggleButton1  = document.getElementById('toggle-button1');
  toggleButton1.addEventListener('click', function() {
    toggleButton1.classList.toggle('active');
    toggleButton1.setAttribute('aria-pressed',isActive);
    AdjustHiPo(json);
  });

  const toggleButton2  = document.getElementById('toggle-button2');
  toggleButton2.addEventListener('click', function() {
    toggleButton2.classList.toggle('active');
    toggleButton2.setAttribute('aria-pressed',isActive);
    AdjustHiPo(json);
  });

  const toggleButton3  = document.getElementById('toggle-button3');
  toggleButton3.addEventListener('click', function() {
    toggleButton3.classList.toggle('active');
    toggleButton3.setAttribute('aria-pressed',isActive);
    AdjustHiPo(json);
  });

  const toggleButton4  = document.getElementById('toggle-button4');
  toggleButton4.addEventListener('click', function() {
    toggleButton4.classList.toggle('active');
    toggleButton4.setAttribute('aria-pressed',isActive);
    AdjustHiPo(json);
  });


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
        fetchedData=data;
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

        
        
        return data;
      })
      .catch(error => console.error('Error fetching JSON:', error));
    
    const imageContainer = document.getElementById('image-container');
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
    const ATKstat = document.createElement('p');
    const DEFstat = document.createElement('p');
    const HPstat = document.createElement('p');
    
    let ATK = json;
    let DEF = parseInt(json["Max DEF"]);
    let HP = parseInt(json["Max HP"]);
    if(toggleButton1.classList.contains('active')){
      ATK = 100;
    }

    ATKstat.textContent = "ATK: " + ATK;
    DEFstat.textContent = "DEF: " + DEF;
    HPstat.textContent = "HP: " + HP;

    statsContainer.appendChild(ATKstat);
    statsContainer.appendChild(DEFstat);
    statsContainer.appendChild(HPstat);
    statsContainer.innerHTML = ATKstat.textContent + DEFstat.textContent + HPstat.textContent;
  }

  subURL = window.suburl;
  const json=fetchData(subURL);
  AdjustHiPo(json);

});
