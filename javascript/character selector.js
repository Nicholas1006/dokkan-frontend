import { unitDisplay } from "./unitDisplay.js";

// GLOBAL VARIABLES
let unitsToDisplay = 200;

let currentSort = "Acquired";
let currentOrder = "Descending";
let currentFilter = "Name";
let currentFilterValue = "";
let currentFilteredUnits = {};
let unitBasics;
let displayBoxes=[];

let unitBasicsDetails={};


function unixToDateTime(unixTimestamp) {
  // Create a new Date object using the Unix timestamp (in milliseconds)
  const date = new Date(unixTimestamp * 1000);

  // Format the date and time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Return the formatted date and time string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


function getJsonPromise(prefix,name,suffix) {
  return fetch(prefix + name + suffix)
    .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok' + response.statusText);
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

function getAssetID(unitID){
  if(unitID.typeof === "string") {
    if(unitID[unitID.length-1]=="1"){
      unitID=unitID.slice(0,-1)+"0";
    }
  }
  else{
    if(unitID%10==1){
      unitID=unitID-1;
    }
  }
  return unitID;
}

function rarityToInt(rarity){
  switch(rarity){
    case "n":
      return 0;
    case "r":
      return 1;
    case "sr":
      return 2;
    case "ssr":
      return 3;
    case "ur":
      return 4;
    case "lr":
      return 5;
  }
}


function createFilterOption(){
  const filterContainer = document.getElementById('filter-container');
  const filterSelect = document.createElement('select');
  const filterOptions = ['Name','Type', 'Rarity', 'Eza', "Seza", "Class","Categories","Super Attack Types", "Links"]; 
  filterOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    filterSelect.appendChild(optionElement);
  });
  filterSelect.addEventListener('change', function() {
    currentFilter = this.value;
    reFilterCards();
  })

  const filterTextInput = document.createElement('input');
  filterTextInput.type="text";
  filterTextInput.id="currentFilterInput";
  filterTextInput.placeholder="Enter text to filter by";
  filterTextInput.setAttribute('autocomplete', 'off');
  filterTextInput.addEventListener('input', function() {
    currentFilterValue = this.value;
    reFilterCards();
  });

  filterContainer.appendChild(filterSelect);
  filterContainer.appendChild(filterTextInput);
}

function reFilterCards() {
  if(Object.keys(unitBasicsDetails).includes(currentFilter)){
    currentFilteredUnits = Object.keys(unitBasicsDetails["Max Level"]);
    if(['Eza',"Seza"].includes(currentFilter)){
      let currentFilteringUnits = [];
      for (const unit of currentFilteredUnits){
        if(unit.endsWith(currentFilter.toUpperCase())){
          currentFilteringUnits.push(unit)
        }
      }
      currentFilteredUnits=currentFilteringUnits;
    }
    else if (['Type', 'Name', 'Rarity','Class'].includes(currentFilter) && currentFilterValue !== "") {
      let currentFilteringUnits = [];
      for (const unit of currentFilteredUnits){
        if(unitBasicsDetails[currentFilter][unit].toLowerCase().includes(currentFilterValue.toLowerCase()) ){
          currentFilteringUnits.push(unit)
        }
      }
      currentFilteredUnits=currentFilteringUnits;
    }

    else if (["Categories","Links","Super Attack Types"].includes(currentFilter) && currentFilterValue !== "") {

      let currentFilteringUnits = [];
      for (const unit of currentFilteredUnits){
        if(unitBasicsDetails[currentFilter][unit].some(category => category.toLowerCase().includes(currentFilterValue.toLowerCase()))){
        //reawaken for exact matching rather than .includes
        //if(unitBasicsDetails[currentFilter][unit].includes(currentFilterValue)){
            currentFilteringUnits.push(unit)
          }
        }
      currentFilteredUnits=currentFilteringUnits;
    }

    reSortCards();
  }
  else{
    const unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/",currentFilter,".json");
    unitBasicsDetailPromise.then(
      unitBasicsDetail =>{
        unitBasicsDetails[currentFilter]=unitBasicsDetail;
        reFilterCards();
      }
    )
  }
}

function createCharacterBoxes() {
  const unitsContainer = document.getElementById('unit-selection-container');
  for (let unitCount = 0; unitCount < unitsToDisplay; unitCount++) {
    displayBoxes[unitCount] = new unitDisplay();
    displayBoxes[unitCount].setExactWidth("164px");
    displayBoxes[unitCount].setExactHeight("150px");
    displayBoxes[unitCount].setDisplayExtraInfo(true);
    unitsContainer.appendChild(displayBoxes[unitCount].container);
  }
}

function createSortOption(){
  const sortContainer = document.getElementById('sort-container');
  const sortSelect = document.createElement('select');
  const sortOptions = ["Acquired", 'ID', 'Max Level', 'Rarity', 'Cost', 'HP', 'Attack', "Defense", "Sp Atk Lv"];
  sortOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    sortSelect.appendChild(optionElement);
  });
  sortSelect.addEventListener('change', function() {
    currentSort = this.value;
    reSortCards();
  })
  sortContainer.appendChild(sortSelect);

}


function reSortCards(){
  if(Object.keys(unitBasicsDetails).includes(currentSort)){
    const startTime=Date.now();

    const unitsContainer = document.getElementById('unit-selection-container');

    let sortedUnits = currentFilteredUnits;
    const order = currentOrder =="Ascending" ? 1 : -1;

    sortedUnits.sort((a, b) => {
      let valueA = unitBasicsDetails[currentSort][a];
      let valueB = unitBasicsDetails[currentSort][b];
      if (currentSort === "Rarity") {
        valueA = rarityToInt(valueA);
        valueB = rarityToInt(valueB);
      }

      if(valueA < valueB) {
        return -1 * order;
      }
      if(valueA > valueB) {
        return 1 * order;
      }
      return 0;
    });

    
    for (let i = 0; i < unitsToDisplay;i++) {
      if(i<sortedUnits.length){
        let otherDisplayedValue=null;
        if(["Cost","HP","Attack","Defense","Sp Atk Lv"].includes(currentSort)){
          otherDisplayedValue=sortedUnits[i][currentSort];
        }
        let ezaLevel = "none";
        if(sortedUnits[i].endsWith("SEZA")){
          ezaLevel = "seza";
        }
        else if(sortedUnits[i].endsWith("EZA")){
          ezaLevel = "eza";
        }
        

        displayBoxes[i].setResourceID(unitBasicsDetails["Resource ID"][sortedUnits[i]]);
        displayBoxes[i].setClass(unitBasicsDetails["Class"][sortedUnits[i]]);
        displayBoxes[i].setType(unitBasicsDetails["Type"][sortedUnits[i]]);
        displayBoxes[i].setRarity(unitBasicsDetails["Rarity"][sortedUnits[i]]);
        displayBoxes[i].setLevel(unitBasicsDetails["Max Level"][sortedUnits[i]]);
        displayBoxes[i].setOtherDisplayedValue(otherDisplayedValue);
        displayBoxes[i].setPossibleEzaLevel(ezaLevel);
        displayBoxes[i].setEzaLevel(ezaLevel);
        displayBoxes[i].setUrl(baseDomain+"/cards/index.html?id=" + sortedUnits[i].substring(0,7) + "&EZA="+(sortedUnits[i].endsWith("EZA"))+"&SEZA="+sortedUnits[i].endsWith("SEZA"));
        displayBoxes[i].setDisplay(true);



        //unitButton.style.backgroundImage = "url('dbManagement/DokkanFiles/global/en/character/card/"+getAssetID(sortedUnits[i]["ID"])+"/card_"+getAssetID(sortedUnits[i]["ID"])+"_full_thumb.png')";


      }
      if(i>=sortedUnits.length){
        displayBoxes[i].setDisplay(false);
      }
    }
  }
  else{
    const unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/",currentSort,".json");
    unitBasicsDetailPromise.then(
      unitBasicsDetail =>{
        unitBasicsDetails[currentSort]=unitBasicsDetail;
        reFilterCards();
      }
    )
  }
  
}

function OLDreSortCards(){
  const startTime=Date.now();

  const unitsContainer = document.getElementById('unit-selection-container');
  while (unitsContainer.firstChild) {
    unitsContainer.removeChild(unitsContainer.firstChild);
  }

  let sortedUnits = Object.values(currentFilteredUnits);
  const order = currentOrder =="Ascending" ? 1 : -1;

  sortedUnits.sort((a, b) => {
    let valueA = a[currentSort];
    let valueB = b[currentSort];
    if (currentSort === "Rarity") {
      valueA = rarityToInt(valueA);
      valueB = rarityToInt(valueB);
    }

    if(valueA < valueB) {
      return -1 * order;
    }
    if(valueA > valueB) {
      return 1 * order;
    }
    return 0;
  });

  for (let i = 0; i < unitsToDisplay;i++) {
    if(i<sortedUnits.length){
      const unitURL = baseDomain+"/cards/index.html?id=" + sortedUnits[i]["ID"] + "&EZA="+sortedUnits[i]["Eza"]+"&SEZA="+sortedUnits[i]["Seza"];
      let otherDisplayedValue=null;
      if(["Cost","HP","Attack","Defense","Sp Atk Lv"].includes(currentSort)){
        otherDisplayedValue=sortedUnits[i][currentSort];
      }
      let ezaLevel = "None";
      if(sortedUnits[i]["Eza"]){
        ezaLevel = "eza";
      }
      else if(sortedUnits[i]["Seza"]){
        ezaLevel = "seza";
      }

      const unitButtonContainer = new unitDisplay(sortedUnits[i]["Resource ID"],sortedUnits[i]["Class"],sortedUnits[i]["Type"],sortedUnits[i]["Rarity"],sortedUnits[i]["Max Level"],otherDisplayedValue,ezaLevel,unitURL);
      unitsContainer.appendChild(unitButtonContainer.container);
      unitButtonContainer.container.offsetWidth;



      //unitButton.style.backgroundImage = "url('dbManagement/DokkanFiles/global/en/character/card/"+getAssetID(sortedUnits[i]["ID"])+"/card_"+getAssetID(sortedUnits[i]["ID"])+"_full_thumb.png')";


    }
  }
  
  console.log("Sorting took " + (Date.now() - startTime) + " ms");
}

function classToInt(Class){
  switch(Class){
    case null:
      return 0;
    case "Super":
      return 1;
    case "Extreme":
      return 2;
  }
}

function typeToInt(type){
  switch(type){
    case "AGL":
      return 0;
    case "TEQ":
      return 1;
    case "INT":
      return 2;
    case "STR":
      return 3;
    case "PHY":
      return 4;
  }
}

function createSortButton(){
  const sortButton = document.getElementById('sort-filter-container');
  sortButton.addEventListener('click', function() {
    if(currentOrder == "Ascending"){
      currentOrder = "Descending";
    }
    else{
      currentOrder = "Ascending";
    }
    const sortDirection = document.getElementById("sort-direction")
    if(currentOrder == "Ascending"){
      sortDirection.src = "dbManagement/DokkanFiles/global/en/layout/en/image/common/btn/filter_icon_ascending.png";
    }
    else{
      sortDirection.src = "dbManagement/DokkanFiles/global/en/layout/en/image/common/btn/filter_icon_descending.png";
    }
    reSortCards();
  })
}


function createCharacterSelection(){
  createCharacterBoxes();
  createSortOption();
  createFilterOption();
  createSortButton();
  const jsonPromises = ["Resource ID", "Class", "Type", "Rarity", "Max Level"].map(field => 
    getJsonPromise("/dbManagement/uniqueJsons/unitBasics/", field, ".json")
  );

  Promise.all(jsonPromises).then(
    results => {
      ["Resource ID", "Class", "Type", "Rarity", "Max Level"].forEach(
        (field, index) => {
          unitBasicsDetails[field] = results[index];
        }
      );
      reFilterCards();
    }
  )
};
const currentUrl=window.location.href;
let baseDomain=window.location.origin;
if(currentUrl.includes("dokkan-frontend")){
  baseDomain=baseDomain+"/dokkan-frontend";
}
createCharacterSelection();