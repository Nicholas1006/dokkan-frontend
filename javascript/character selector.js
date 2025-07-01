import { unitDisplay } from "./classes/unitDisplay.js";
import { complexSortFilterContainer } from "./classes/complexSortFilterContainer.js";
import {removePX,timeSince,getJsonPromise,isEmptyDictionary} from "./commonFunctions.js";

// GLOBAL VARIABLES
let unitsToDisplay = 44;

window.currentSort = "Release";
window.currentOrder = "descending";
window.currentFilter = "Name";
window.currentFilterValue = "";
window.currentFilteredUnits = {};
window.displayBoxes=[];
window.MINIMUMLEADERBUFF=150;

window.unitBasicsDetails={};

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
    window.currentFilter = this.value;
    reFilterCards();
  })

  const filterTextInput = document.createElement("input");
  filterTextInput.type="text";
  filterTextInput.id="currentFilterInput";
  filterTextInput.placeholder="Enter text to filter by";
  filterTextInput.setAttribute("autocomplete", "off");
  filterTextInput.addEventListener("input", function() {
    window.currentFilterValue = this.value;
    reFilterCards();
  });

  filterContainer.appendChild(filterSelect);
  filterContainer.appendChild(filterTextInput);
}

async function reFilterCards(sortCutIDBefore=false) {
  


  if(Object.keys(window.unitBasicsDetails).includes(window.currentFilter)){
    window.currentFilteredUnits = Object.keys(window.unitBasicsDetails["Max Level"]);
    if(["Eza","Seza"].includes(window.currentFilter)){
      let currentFilteringUnits = [];
      for (const unit of window.currentFilteredUnits){
        if(unit.endsWith(window.currentFilter.toUpperCase())){
          currentFilteringUnits.push(unit)
        }
      }
      window.currentFilteredUnits=currentFilteringUnits;
    }
    else if (["Type", "Name", "Rarity","Class"].includes(window.currentFilter) && window.currentFilterValue !== "") {
      let currentFilteringUnits = [];
      for (const unit of window.currentFilteredUnits){
        if(window.unitBasicsDetails[window.currentFilter][unit].toLowerCase().includes(window.currentFilterValue.toLowerCase()) ){
          currentFilteringUnits.push(unit)
        }
      }
      window.currentFilteredUnits=currentFilteringUnits;
    }

    else if (["Categories","Links","Super Attack Types"].includes(window.currentFilter) && window.currentFilterValue !== "") {

      let currentFilteringUnits = [];
      for (const unit of window.currentFilteredUnits){
        if(window.unitBasicsDetails[window.currentFilter][unit].some(category => category.toLowerCase().includes(window.currentFilterValue.toLowerCase()))){
        //reawaken for exact matching rather than .includes
        //if(unitBasicsDetails[currentFilter][unit].includes(currentFilterValue)){
            currentFilteringUnits.push(unit)
          }
        }
      window.currentFilteredUnits=currentFilteringUnits;
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
          if(window.leaderView[lead]["Target"]["Type"]!=undefined){
            if(window.leaderView[lead]["Target"]["Type"][0]!=undefined){
              relevantDetails.push("Type");
            }
          }
        }
      }
      if(relevantDetails.includes("Class") && !("Class" in window.unitBasicsDetails)) {
        let unitBasicsDetailPromise;
        unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/","Class",".json");
        window.unitBasicsDetails["Class"]=await unitBasicsDetailPromise;
      }
      if(relevantDetails.includes("Category") && !("Categories" in window.unitBasicsDetails)){
        let unitBasicsDetailPromise;
        unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/","Categories",".json");
        window.unitBasicsDetails["Categories"]=await unitBasicsDetailPromise;
      }
      if(relevantDetails.includes("Type")  && !("Type" in window.unitBasicsDetails)){
        let unitBasicsDetailPromise;
        unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/","Type",".json");
        window.unitBasicsDetails["Type"]=await unitBasicsDetailPromise;
      }



      let currentFilteringUnits=[];
      for (const unit of window.currentFilteredUnits){
        window.unitBasicsDetails["Under Lead Buff"][unit]=calculateUnitUnderLeadBuff(unit);
        if ((window.unitBasicsDetails["Under Lead Buff"][unit]["Ki"]>=window.MINIMUMLEADERBUFF ||
          window.unitBasicsDetails["Under Lead Buff"][unit]["ATK"]>=window.MINIMUMLEADERBUFF ||
          window.unitBasicsDetails["Under Lead Buff"][unit]["DEF"]>=window.MINIMUMLEADERBUFF ||
          window.unitBasicsDetails["Under Lead Buff"][unit]["HP"]>=window.MINIMUMLEADERBUFF 
        ) && 
        window.unitBasicsDetails["Under Lead Buff"][unit]["BuffType"] == "Percentage"){
          currentFilteringUnits.push(unit);
        }
      }
      window.currentFilteredUnits=currentFilteringUnits;
    }

    else if(window.leadUnit!=null){
      if(!("Class" in window.unitBasicsDetails)) {
        let unitBasicsDetailPromise;
        unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/","Class",".json");
        window.unitBasicsDetails["Class"]=await unitBasicsDetailPromise;
      }
      if(!("Categories" in window.unitBasicsDetails)){
        let unitBasicsDetailPromise;
        unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/","Categories",".json");
        window.unitBasicsDetails["Categories"]=await unitBasicsDetailPromise;
      }
      if(!("Type" in window.unitBasicsDetails)){
        let unitBasicsDetailPromise;
        unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/","Type",".json");
        window.unitBasicsDetails["Type"]=await unitBasicsDetailPromise;
      }


      let currentFilteringUnits=[];
      for (const unit of window.currentFilteredUnits){
        window.unitBasicsDetails["Leading Buff"][unit]=calculateUnitLeadingBuff(unit);
        if ((window.unitBasicsDetails["Leading Buff"][unit]["Ki"]>=window.MINIMUMLEADERBUFF ||
          window.unitBasicsDetails["Leading Buff"][unit]["ATK"]>=window.MINIMUMLEADERBUFF ||
          window.unitBasicsDetails["Leading Buff"][unit]["DEF"]>=window.MINIMUMLEADERBUFF ||
          window.unitBasicsDetails["Leading Buff"][unit]["HP"]>=window.MINIMUMLEADERBUFF 
        ) && 
        window.unitBasicsDetails["Leading Buff"][unit]["BuffType"] == "Percentage"){
          currentFilteringUnits.push(unit);
        }
      }
      window.currentFilteredUnits=currentFilteringUnits;

    }

    if(sortCutIDBefore){
      let unitBasicsDetailPromise;
      unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/","ID",".json");
      unitBasicsDetailPromise.then(
        unitBasicsDetail =>{
          window.unitBasicsDetails["ID"]=unitBasicsDetail;
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
    const unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/",window.currentFilter,".json");
    unitBasicsDetailPromise.then(
      unitBasicsDetail =>{
        window.unitBasicsDetails[window.currentFilter]=unitBasicsDetail;
        reFilterCards(sortCutIDBefore);
      }
    )
  }
  updatePageSelector();
}

function calculateUnitLeadingBuff(unit){
  let Ki=0;
  let ATK=0;
  let DEF=0;
  let HP=0;
  let BuffType="Percentage";
  for (const lead in window.unitBasicsDetails["Leader Skill"][unit]){
    if(lead!="Name"){
      if(unitMeetsLeadConditions(window.leadUnit,window.unitBasicsDetails["Leader Skill"][unit][lead])){
        Ki+=window.unitBasicsDetails["Leader Skill"][unit][lead]["Ki"];
        ATK+=window.unitBasicsDetails["Leader Skill"][unit][lead]["ATK"];
        DEF+=window.unitBasicsDetails["Leader Skill"][unit][lead]["DEF"];
        HP+=window.unitBasicsDetails["Leader Skill"][unit][lead]["HP"];
        BuffType=window.unitBasicsDetails["Leader Skill"][unit][lead]["Buff"]["Type"];
      } 
    }
  }
  return(
    {
      "Ki":Ki,
      "ATK":ATK,
      "DEF":DEF,
      "HP":HP,
      "BuffType": BuffType
    }
  );
}

function calculateUnitUnderLeadBuff(unit){
  let Ki=0;
  let ATK=0;
  let DEF=0;
  let HP=0;
  let BuffType="Percentage";

  for (const lead in window.leaderView){
    if(unitMeetsLeadConditions(unit,window.leaderView[lead])){
      Ki+=window.leaderView[lead]["Ki"];
      ATK+=window.leaderView[lead]["ATK"];
      DEF+=window.leaderView[lead]["DEF"];
      HP+=window.leaderView[lead]["HP"];
      if((window.leaderView[lead]["ATK"] + window.leaderView[lead]["DEF"] + window.leaderView[lead]["HP"])>0 ){
        BuffType=window.leaderView[lead]["Buff"]["Type"];
      }
    } 
  }
  return(
    {
      "Ki":Ki,
      "ATK":ATK,
      "DEF":DEF,
      "HP":HP,
      "BuffType": BuffType
    }
  );
}


function unitMeetsLeadConditions(unit,lead){
  if(!isEmptyDictionary(lead["Target"]["Category"])){
    for(const category of lead["Target"]["Category"]){
      if(!window.unitBasicsDetails["Categories"][unit].includes(category)){
        return(false);
      }
    }
  }
  if(!isEmptyDictionary(lead["Target"]["Excluded Category"])){
    if(listHasOverlap(window.unitBasicsDetails["Categories"][unit],lead["Target"]["Excluded Category"])){
      return(false);
    }
  }
  if(!isEmptyDictionary(lead["Target"]["Class"])){
    if(!(lead["Target"]["Class"].includes(window.unitBasicsDetails["Class"][unit]))){
      return(false);
    }
  }
  if(!isEmptyDictionary(lead["Target"]["Type"])){
    if(!(lead["Target"]["Type"].includes(window.unitBasicsDetails["Type"][unit]))){
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
    window.displayBoxes[unitCount] = new unitDisplay();
    window.displayBoxes[unitCount].setWidth("164px");
    window.displayBoxes[unitCount].setHeight("150px");
    window.displayBoxes[unitCount].setDisplayExtraInfo(true);
    unitsContainer.appendChild(window.displayBoxes[unitCount].container);
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
  if(Object.keys(window.unitBasicsDetails).includes(window.currentSort)){

    let sortedUnits = window.currentFilteredUnits;
    const order = window.currentOrder =="ascending" ? 1 : -1;

    sortedUnits.sort((a, b) => {
      let valueA = window.unitBasicsDetails[window.currentSort][a];
      let valueB = window.unitBasicsDetails[window.currentSort][b];
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

    window.currentFilteredUnits = sortedUnits;
    showUpdatedCardPositions();
  }
  else{
    let unitBasicsDetailPromise;
    unitBasicsDetailPromise=getJsonPromise("/dbManagement/uniqueJsons/unitBasics/",window.currentSort,".json");
    unitBasicsDetailPromise.then(
      unitBasicsDetail =>{
        window.unitBasicsDetails[window.currentSort]=unitBasicsDetail;
        reSortCards();
      }
    )
  }
}

function sortCutID(showUpdate=false){
  let sortedUnits = window.currentFilteredUnits;
  const order = window.currentOrder =="ascending" ? 1 : -1;

  sortedUnits.sort((a, b) => {
    let valueA = window.unitBasicsDetails["ID"][a]%1000000;
    let valueB = window.unitBasicsDetails["ID"][b]%1000000;
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
    showUpdatedCardPositions();
  }
}

function showUpdatedCardPositions(){
  for (let i = (unitsToDisplay*(window.currentPage-1)); i < (unitsToDisplay*window.currentPage);i++) {
    if(i<window.currentFilteredUnits.length && i>=0){
      let otherDisplayedValue=null;
      let otherDisplayedValueColor="white";
      if(["Cost","HP","Attack","Defense"].includes(window.currentSort)){
        otherDisplayedValue=window.unitBasicsDetails[window.currentSort][sortedUnits[i]];
      }
      else if(window.currentSort=="Sp Atk Lv"){
        otherDisplayedValue=window.unitBasicsDetails["Sp Atk Lv"][sortedUnits[i]];
        otherDisplayedValueColor="yellow";
      }
        
      else if(window.currentSort=="Release"){
        const [timeSinceRelease,timeMetric]=timeSince(window.unitBasicsDetails["Release"][window.currentFilteredUnits[i]]);
        otherDisplayedValue=Math.abs(timeSinceRelease)+" "+timeMetric;
        if(timeSinceRelease<0){
          otherDisplayedValueColor="red";
        }
      }
      let ezaLevel = "none";
      if(window.currentFilteredUnits[i].endsWith("SEZA")){
        ezaLevel = "seza";
      }
      else if(window.currentFilteredUnits[i].endsWith("EZA")){
        ezaLevel = "eza";
      }
      

      window.displayBoxes[i%unitsToDisplay].setResourceID(window.unitBasicsDetails["Resource ID"][window.currentFilteredUnits[i]]);
      window.displayBoxes[i%unitsToDisplay].setClass(window.unitBasicsDetails["Class"][window.currentFilteredUnits[i]]);
      window.displayBoxes[i%unitsToDisplay].setType(window.unitBasicsDetails["Type"][window.currentFilteredUnits[i]]);
      window.displayBoxes[i%unitsToDisplay].setRarity(window.unitBasicsDetails["Rarity"][window.currentFilteredUnits[i]]);
      window.displayBoxes[i%unitsToDisplay].setLevel(window.unitBasicsDetails["Max Level"][window.currentFilteredUnits[i]]);
      window.displayBoxes[i%unitsToDisplay].setOtherDisplayedValue(otherDisplayedValue);
      window.displayBoxes[i%unitsToDisplay].setOtherDisplayedValueColor(otherDisplayedValueColor);
      window.displayBoxes[i%unitsToDisplay].setPossibleEzaLevel(ezaLevel);
      window.displayBoxes[i%unitsToDisplay].setEzaLevel(ezaLevel);
      window.displayBoxes[i%unitsToDisplay].setUrl(baseDomain+"/cards/index.html?id=" + window.currentFilteredUnits[i].substring(0,7) + "&EZA="+(window.currentFilteredUnits[i].endsWith("EZA"))+"&SEZA="+window.currentFilteredUnits[i].endsWith("SEZA"));
      window.displayBoxes[i%unitsToDisplay].setDisplay(true);
      if(window.leaderView){
        window.displayBoxes[i%unitsToDisplay].setHighlight(window.unitBasicsDetails["Under Lead Buff"][window.currentFilteredUnits[i]]["ATK"]>=200);
      }
      else if(window.leadUnit){
        window.displayBoxes[i%unitsToDisplay].setHighlight(window.unitBasicsDetails["Leading Buff"][window.currentFilteredUnits[i]]["ATK"]>=200);
      }
      //displayBoxes[i].setSezaBorder(window.currentFilteredUnits[i].endsWith("SEZA"));



      //unitButton.style.backgroundImage = "url("+window.assetBase+"/global/en/character/card/"+getAssetID(window.currentFilteredUnits[i]["ID"])+"/card_"+getAssetID(window.currentFilteredUnits[i]["ID"])+"_full_thumb.png')";


    }
    if(i>=window.currentFilteredUnits.length){
      window.displayBoxes[i%unitsToDisplay].setDisplay(false);
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

function updatePageSelector(){
  if(window.currentPage==undefined){
    window.currentPage=1;
  }
  if(window.currentPage>Math.ceil(window.currentFilteredUnits.length/unitsToDisplay)){
    window.currentPage=Math.ceil(window.currentFilteredUnits.length/unitsToDisplay);
  }
  const pageSelectionContainer=document.getElementById("page-selection-container");
  while (pageSelectionContainer.firstChild) {
    pageSelectionContainer.removeChild(pageSelectionContainer.firstChild);
  }
  const minNumber=Math.max(1,window.currentPage-3);
  const maxNumber=Math.min(Math.ceil(window.currentFilteredUnits.length/unitsToDisplay),minNumber+7);
  for(let i=minNumber;i<=maxNumber;i++){
    const pageButton=document.createElement("button");
    pageButton.textContent=i;
    if(i==window.currentPage){
      pageButton.style.background="grey";
    }
    pageButton.addEventListener("click",function(){
      changeCurrentPage(this.textContent);
      updatePageSelector();
    })
    pageSelectionContainer.appendChild(pageButton);
  }

}

function changeCurrentPage(currentPage){
  window.currentPage=parseInt(currentPage);
  showUpdatedCardPositions();
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
          window.unitBasicsDetails[field] = results[index];
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
      if(leadList[listedLead]["ATK"]+leadList[listedLead]["DEF"]+leadList[listedLead]["HP"]>0){
        leadList[listedLead]["Buff"]["Type"]=newLeadSource[lead]["Buff"]["Type"];
      }
      return;
    }
  }
  leadList[lead]=newLeadSource[lead];
}

const urlParams=new URLSearchParams(window.location.search);
if(urlParams.get("leaderView") !== null) {
  window.unitBasicsDetails["Under Lead Buff"]={};
  const json = await getJsonPromise("/dbManagement/jsons/", urlParams.get("leaderView"), ".json");
  window.leaderView = {}
  for (const lead in json["Leader Skill"]){
    addToLeadList(window.leaderView,lead,json["Leader Skill"]);
  }
}
else if(urlParams.get("leadByView") !== null) {
  window.unitBasicsDetails["Leading Buff"]={};
  const json = await getJsonPromise("/dbManagement/jsons/", urlParams.get("leadByView"), ".json");
  window.leadUnit = urlParams.get("leadByView")

  const json2 = await getJsonPromise("/dbManagement/uniqueJsons/unitBasics/", "Leader Skill", ".json");
  window.unitBasicsDetails["Leader Skill"] = json2
}

let baseDomain=window.location.origin;

createCharacterSelection();

window.reSortCards=reSortCards;