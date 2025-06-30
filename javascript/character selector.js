import { unitDisplay } from "./classes/unitDisplay.js";
import { complexSortFilterContainer } from "./classes/complexSortFilterContainer.js";
import {removePX,timeSince,getJsonPromise,isEmptyDictionary} from "./commonFunctions.js";

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
const COMPLEXSORTFILTERCONTAINERHEIGHT="100vh";


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
  const filterContainer = document.getElementById("filter-container");
  const filterSelect = document.createElement("select");
  const filterOptions = ["Name","Type", "Rarity", "Eza", "Seza", "Class","Categories","Super Attack Types", "Links"]; 
  filterOptions.forEach(option => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    filterSelect.appendChild(optionElement);
  });
  filterSelect.addEventListener("change", function() {
    currentFilter = this.value;
    reFilterCards();
  })

  const filterTextInput = document.createElement("input");
  filterTextInput.type="text";
  filterTextInput.id="currentFilterInput";
  filterTextInput.placeholder="Enter text to filter by";
  filterTextInput.setAttribute("autocomplete", "off");
  filterTextInput.addEventListener("input", function() {
    currentFilterValue = this.value;
    reFilterCards();
  });

  filterContainer.appendChild(filterSelect);
  filterContainer.appendChild(filterTextInput);
}

async function reFilterCards(sortCutIDBefore=false) {
  


  if(Object.keys(unitBasicsDetails).includes(currentFilter)){
      currentFilteredUnits = Object.keys(unitBasicsDetails["Max Level"]);
      if(["Eza","Seza"].includes(currentFilter)){
        let currentFilteringUnits = [];
        for (const unit of currentFilteredUnits){
          if(unit.endsWith(currentFilter.toUpperCase())){
            currentFilteringUnits.push(unit)
          }
        }
        currentFilteredUnits=currentFilteringUnits;
      }
      else if (["Type", "Name", "Rarity","Class"].includes(currentFilter) && currentFilterValue !== "") {
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

      if(window.leaderView!=null){
      let relevantDetails=[]
      for(const lead in window.leaderView){
        if(lead!="Name"){
          if(window.leaderView[lead]["Target"]["Category"]!=undefined){
            if(window.leaderView[lead]["Target"]["Category"][0]!=undefined){
              relevantDetails.push("Category");
            }
          }
          if(window.leaderView[lead]["Target"]["Class"]!=undefined){
            if(window.leaderView[lead]["Target"]["Class"][0]!=undefined){
              relevantDetails.push("Class");
            }
          }
          if(window.leaderView[lead]["Target"]["Typing"]!=undefined){
            if(window.leaderView[lead]["Target"]["Typing"][0]!=undefined){
              relevantDetails.push("Typing");
            }
          }
        }
      }
      if(relevantDetails.includes("Class") && !relevantDetails.includes("Class")) {
        let unitBasicsDetailPromise;
        unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/","Class",".json");
        unitBasicsDetails["Class"]=await unitBasicsDetailPromise;
      }
      else if(relevantDetails.includes("Category") && !relevantDetails.includes("Categories")){
        let unitBasicsDetailPromise;
        unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/","Categories",".json");
        unitBasicsDetails["Categories"]=await unitBasicsDetailPromise;
      }
      else if(relevantDetails.includes("Typing")  && !relevantDetails.includes("Typing")){
        let unitBasicsDetailPromise;
        unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/","Typing",".json");
        unitBasicsDetails["Typing"]=await unitBasicsDetailPromise;
      }

      window.Leadthresholds=[];
      for(const lead in window.leaderView){
        if(!(window.Leadthresholds.includes(calculateLeadPriority(window.leaderView[lead])))){
          window.Leadthresholds.push(calculateLeadPriority(window.leaderView[lead])); 
        }
      }



      let currentFilteringUnits=[];
      for (const unit of currentFilteredUnits){
        unitBasicsDetails["Under Lead Buff"][unit]=calculateUnitUnderLeadBuff(unit);
        if (unitBasicsDetails["Under Lead Buff"][unit]["Ki"]>0 ||
          unitBasicsDetails["Under Lead Buff"][unit]["ATK"]>0 ||
          unitBasicsDetails["Under Lead Buff"][unit]["DEF"]>0 ||
          unitBasicsDetails["Under Lead Buff"][unit]["HP"]>0
        ){
          currentFilteringUnits.push(unit);
        }
      }
      currentFilteredUnits=currentFilteringUnits;
    }

    if(sortCutIDBefore){
      let unitBasicsDetailPromise;
      unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/","ID",".json");
      unitBasicsDetailPromise.then(
        unitBasicsDetail =>{
          unitBasicsDetails["ID"]=unitBasicsDetail;
          sortCutID();
          reSortCards();
        }
      )
    }
    else{
      reSortCards();
    }
  }
  else{
    const unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/",currentFilter,".json");
    unitBasicsDetailPromise.then(
      unitBasicsDetail =>{
        unitBasicsDetails[currentFilter]=unitBasicsDetail;
        reFilterCards(sortCutIDBefore);
      }
    )
  }
}
function calculateLeadPriority(lead){
  return(
    (lead["ATK"]/3)+
    (lead["DEF"]/3)+
    (lead["HP"]/3)+
    (lead["Ki"]));
}

function calculateUnitUnderLeadBuff(unit){
  let Ki=0;
  let ATK=0;
  let DEF=0;
  let HP=0;

  for (const lead in window.leaderView){
    if(unitMeetsLeadConditions(unit,window.leaderView[lead])){
      Ki+=window.leaderView[lead]["Ki"];
      ATK+=window.leaderView[lead]["ATK"];
      DEF+=window.leaderView[lead]["DEF"];
      HP+=window.leaderView[lead]["HP"];
    } 
  }
  return(
    {
      "Ki":Ki,
      "ATK":ATK,
      "DEF":DEF,
      "HP":HP
    }
  );
}

function unitMeetsLeadConditions(unit,lead){
  if(!isEmptyDictionary(lead["Target"]["Category"])){
    for(const category of lead["Target"]["Category"]){
      if(!unitBasicsDetails["Categories"][unit].includes(category)){
        return(false);
      }
    }
  }
  if(!isEmptyDictionary(lead["Target"]["Excluded Category"])){
    if(listHasOverlap(unitBasicsDetails["Categories"][unit],lead["Target"]["Excluded Category"])){
      return(false);
    }
  }
  if(!isEmptyDictionary(lead["Target"]["Class"])){
    if(!(lead["Target"]["Class"].includes(unitBasicsDetails["Class"][unit]))){
      return(false);
    }
  }
  if(!isEmptyDictionary(lead["Target"]["Typing"])){
    if(!(lead["Target"]["Typing"].includes(unitBasicsDetails["Type"][unit]))){
      return(false);
    }
  }
  return(true);
}

function listHasOverlap(list1,list2){
  for(const item of list1){
    if(list2.includes(item)){
      return(true);
    }
  }
  return(false);
}

function createCharacterBoxes() {
  const unitsContainer = document.getElementById("unit-selection-container");
  for (let unitCount = 0; unitCount < unitsToDisplay; unitCount++) {
    displayBoxes[unitCount] = new unitDisplay();
    displayBoxes[unitCount].setWidth("164px");
    displayBoxes[unitCount].setHeight("150px");
    displayBoxes[unitCount].setDisplayExtraInfo(true);
    unitsContainer.appendChild(displayBoxes[unitCount].container);
  }
}

function createSortOption(){
  const sortContainer = document.getElementById("sort-container");
  const sortSelect = document.createElement("select");
  const sortOptions = ["Acquired", "ID", "Max Level", "Rarity", "Cost", "HP", "Attack", "Defense", "Sp Atk Lv"];
  sortOptions.forEach(option => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    sortSelect.appendChild(optionElement);
  });
  sortSelect.addEventListener("change", function() {
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
          const [timeSinceRelease,timeMetric]=timeSince(unitBasicsDetails["Release"][sortedUnits[i]]);
          otherDisplayedValue=Math.abs(timeSinceRelease)+" "+timeMetric;
          if(timeSinceRelease<0){
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
        if(window.leaderView){
          displayBoxes[i].setHighlight(unitBasicsDetails["Under Lead Buff"][sortedUnits[i]]["ATK"]>=200);
        }
        //displayBoxes[i].setSezaBorder(sortedUnits[i].endsWith("SEZA"));



        //unitButton.style.backgroundImage = "url("+window.assetBase+"/global/en/character/card/"+getAssetID(sortedUnits[i]["ID"])+"/card_"+getAssetID(sortedUnits[i]["ID"])+"_full_thumb.png')";


      }
      if(i>=sortedUnits.length){
        displayBoxes[i].setDisplay(false);
      }
    }
  }
  else{
    let unitBasicsDetailPromise;
    unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/",window.currentSort,".json");
    unitBasicsDetailPromise.then(
      unitBasicsDetail =>{
        unitBasicsDetails[window.currentSort]=unitBasicsDetail;
        reSortCards();
      }
    )
  }
}

function sortCutID(showUpdate=false){
  let sortedUnits = currentFilteredUnits;
  const order = window.currentOrder =="ascending" ? 1 : -1;

  sortedUnits.sort((a, b) => {
    let valueA = unitBasicsDetails["ID"][a]%1000000;
    let valueB = unitBasicsDetails["ID"][b]%1000000;
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
  if(showUpdate){
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
          const [timeSinceRelease,timeMetric]=timeSince(unitBasicsDetails["Release"][sortedUnits[i]]);
          otherDisplayedValue=Math.abs(timeSinceRelease)+" "+timeMetric;
          if(timeSinceRelease<0){
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



        //unitButton.style.backgroundImage = "url('"+window.assetBase+"/global/en/character/card/"+getAssetID(sortedUnits[i]["ID"])+"/card_"+getAssetID(sortedUnits[i]["ID"])+"_full_thumb.png')";


      }
      if(i>=sortedUnits.length){
        displayBoxes[i].setDisplay(false);
      }
    }
  }
}


function createSortButton(){
  const sortFilterContainer=new complexSortFilterContainer(COMPLEXSORTFILTERCONTAINERWIDTH,COMPLEXSORTFILTERCONTAINERHEIGHT);
  document.body.appendChild(sortFilterContainer.getElement());
  document.body.appendChild(sortFilterContainer.getBackground());

  const sortButton = document.getElementById("sort-filter-container");
  sortButton.addEventListener(
    "click", function() {
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
      reFilterCards(true);
    }
  )
};

function addToLeadList(leadList,lead, newLeadSource){
  if(lead=="Name"){
    return
  }
  for(const listedLead of Object.keys(leadList)){
    if(JSON.stringify(leadList[listedLead]["Target"])==JSON.stringify(newLeadSource[lead]["Target"])){
      leadList[listedLead]["ATK"]+=newLeadSource[lead]["ATK"];
      leadList[listedLead]["DEF"]+=newLeadSource[lead]["DEF"];
      leadList[listedLead]["HP"]+=newLeadSource[lead]["HP"];
      leadList[listedLead]["Ki"]+=newLeadSource[lead]["Ki"];
      return;
    }
  }
  leadList[lead]=newLeadSource[lead];
}

const urlParams=new URLSearchParams(window.location.search);
if(urlParams.get("leaderView") !== null) {
  unitBasicsDetails["Under Lead Buff"]={};
  const json = await getJsonPromise("/dbManagement/jsons/", urlParams.get("leaderView"), ".json");
  window.leaderView = {}
  for (const lead in json["Leader Skill"]){
    addToLeadList(window.leaderView,lead,json["Leader Skill"]);
  }
}

let baseDomain=window.location.origin;

createCharacterSelection();

window.reSortCards=reSortCards;