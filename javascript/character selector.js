import { unitDisplay } from "./unitDisplay.js";
import { complexSortFilterContainer } from "./complexSortFilterContainer.js";
import {removePX,daysSince} from "./commonFunctions.js";

// GLOBAL VARIABLES
let unitsToDisplay = 200;

window.currentSort = "Release";
window.currentOrder = "descending";
let currentFilter = "Name";
let currentFilterValue = "";
let currentFilteredUnits = {};
let displayBoxes=[];

let unitBasicsDetails={};

const COMPLEXSORTFILTERCONTAINERWIDTH=480;
const COMPLEXSORTFILTERCONTAINERHEIGHT=window.visualViewport.height;

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
    window.currentSort = this.value;
    reSortCards();
  })
  sortContainer.appendChild(sortSelect);

}


function reSortCards(){
  if(Object.keys(unitBasicsDetails).includes(window.currentSort)){

    let sortedUnits = currentFilteredUnits;
    const order = window.currentOrder =="ascending" ? 1 : -1;

    sortedUnits.sort((a, b) => {
      let valueA = unitBasicsDetails[window.currentSort][a];
      let valueB = unitBasicsDetails[window.currentSort][b];
      if (window.currentSort === "Rarity") {
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
        let otherDisplayedValueColor="white";
        if(["Cost","HP","Attack","Defense"].includes(window.currentSort)){
          otherDisplayedValue=unitBasicsDetails[window.currentSort][sortedUnits[i]];
        }
        else if(window.currentSort=="Sp Atk Lv"){
          otherDisplayedValue=unitBasicsDetails["Sp Atk Lv"][sortedUnits[i]];
          otherDisplayedValueColor="yellow";
        }
          
        else if(window.currentSort=="Release"){
          const daysSinceRelease=daysSince(unitBasicsDetails["Release"][sortedUnits[i]]);
          if(Math.abs(daysSinceRelease)==1){
            otherDisplayedValue=Math.abs(daysSinceRelease)+" day";
          }
          else{
            otherDisplayedValue=Math.abs(daysSinceRelease)+" days";
          }
          if(daysSinceRelease<0){
            otherDisplayedValueColor="red";
          }
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
        displayBoxes[i].setOtherDisplayedValueColor(otherDisplayedValueColor);
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
    const unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/",window.currentSort,".json");
    unitBasicsDetailPromise.then(
      unitBasicsDetail =>{
        unitBasicsDetails[window.currentSort]=unitBasicsDetail;
        reFilterCards();
      }
    )
  }
  
}
window.reSortCards=reSortCards;

function createSortButton(){
  const sortFilterContainer=new complexSortFilterContainer(COMPLEXSORTFILTERCONTAINERWIDTH,COMPLEXSORTFILTERCONTAINERHEIGHT);
  document.body.appendChild(sortFilterContainer.getElement());
  document.body.appendChild(sortFilterContainer.getBackground());

  const sortButton = document.getElementById('sort-filter-container');
  sortButton.addEventListener(
    'click', function() {
      sortFilterContainer.setDisplay(!sortFilterContainer.getDisplay());
    }
  )

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
let baseDomain=window.location.origin;
createCharacterSelection();