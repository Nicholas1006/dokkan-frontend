// GLOBAL VARIABLES
let unitsToDisplay = 500;

let currentSort = "Acquired";
let currentOrder = "Descending";
let currentFilter = "Type";
let currentFilterValue = "";
let currentFilteredUnits = {};
let unitBasics;


export function getJsonPromise(prefix,name,suffix) {
  return fetch(prefix + name + suffix)
    .then(response => {
        if (!response.ok) {
          if(name[6]=="0"){
              name=name.slice(0, -1)+ "1";
              updateQueryStringParameter("id",name);
              return(getJsonPromise(prefix,name,suffix))
          }
          else{
            throw new Error('Network response was not ok' + response.statusText);
          }
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

export function getAssetID(unitID){
  if(unitID[unitID.length-1]=="1"){
    unitID=unitID.slice(0,-1)+"0";
  }
  return unitID;
}

export function rarityToInt(rarity){
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


export function createFilterOption(){
  const filterContainer = document.getElementById('filter-container');
  const filterSelect = document.createElement('select');
  const filterOptions = ['Type', 'Name', 'Rarity', 'Eza', "Seza", "Class","Categories","Super Attack Types", "Links"]; 
  filterOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    filterSelect.appendChild(optionElement);
    filterSelect.addEventListener('change', function() {
      currentFilter = this.value;
      reFilterCards();
    })
  });

  const filterTextInput = document.createElement('input');
  filterTextInput.type="text";
  filterTextInput.id="currentFilterInput";
  filterTextInput.placeholder="Enter text to filter by";
  filterTextInput.addEventListener('input', function() {
    currentFilterValue = this.value;
    reFilterCards();
  });

  filterContainer.appendChild(filterSelect);
  filterContainer.appendChild(filterTextInput);
}

export function reFilterCards() {
  currentFilteredUnits = { ...unitBasics };
  if(['Eza',"Seza"].includes(currentFilter)){
    currentFilteredUnits = Object.fromEntries(
      Object.entries(currentFilteredUnits).filter(([key, value]) => 
        value[currentFilter]
      )
    );
  }
  else if (['Type', 'Name', 'Rarity','Class'].includes(currentFilter)) {
    currentFilteredUnits = Object.fromEntries(
      Object.entries(currentFilteredUnits).filter(([key, value]) => 
        value[currentFilter] === null ? currentFilterValue === "" : value[currentFilter].toLowerCase() === currentFilterValue.toLowerCase()
      )
    );
  }

  else if (["Categories","Links","Super Attack Types"].includes(currentFilter)) {
    currentFilteredUnits = Object.fromEntries(
      Object.entries(currentFilteredUnits).filter(([key, value]) => 
        value[currentFilter].map(x => x.toLowerCase()).includes(currentFilterValue.toLowerCase())
      )
    );
  }

  reSortCards();
}



export function createSortOption(){
  const sortContainer = document.getElementById('sort-container');
  const sortSelect = document.createElement('select');
  const sortOptions = ["Acquired", 'ID', 'Max Level', 'Rarity', 'Cost', 'HP', 'Attack', "Defense", "Sp Atk Lv"];
  sortOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    sortSelect.appendChild(optionElement);
    sortSelect.addEventListener('change', function() {
      currentSort = this.value;
      reSortCards();
    })
  });
  sortContainer.appendChild(sortSelect);

  const reverseOrderInput = document.createElement('input');
  reverseOrderInput.type = 'checkbox';
  reverseOrderInput.id = 'reverse-sort';
  const reverseOrderLabel = document.createElement('label');
  reverseOrderLabel.textContent = 'Reverse order';
  reverseOrderLabel.setAttribute('for', 'reverse-sort');
  reverseOrderInput.addEventListener('change', function() {
    currentOrder = this.checked ? 'Ascending' : 'Descending';
    reSortCards();
  })
  const unitBasicsJsonPromise=getJsonPromise('dbManagement/uniqueJsons/','unitBasics','.json');
  unitBasicsJsonPromise.then(unitBasicsJson => {
    unitBasics=unitBasicsJson;
    
    
    currentFilteredUnits=unitBasics;
    sortContainer.appendChild(reverseOrderInput);
    sortContainer.appendChild(reverseOrderLabel);
    reSortCards();
  }
  );
}


export function reSortCards(){
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
      const unitButtonContainer = document.createElement('div');
      unitButtonContainer.className="unit-button-container";

      const unitButton = document.createElement('a');
      unitsContainer.appendChild(unitButtonContainer);
      unitButtonContainer.appendChild(unitButton);
      unitButton.id = "unit-button";
      unitButton.className="unit-selection-button";
      unitButton.href = baseDomain+"/cards/index.html?id=" + sortedUnits[i]["ID"] + "&EZA="+sortedUnits[i]["Eza"]+"&SEZA="+sortedUnits[i]["Seza"];

      const OLDunitImage = document.createElement('img');
      OLDunitImage.src="dbManagement/DokkanFiles/global/en/character/card/"+getAssetID(sortedUnits[i]["ID"])+"/card_"+getAssetID(sortedUnits[i]["ID"])+"_full_thumb.png";
      OLDunitImage.loading="lazy";
      OLDunitImage.style.width="100%";
      OLDunitImage.style.height="100%";
      //unitButton.appendChild(OLDunitImage)

      const unitRarityImage = document.createElement('img');
      unitRarityImage.src="dbManagement/DokkanFiles/global/en/layout/en/image/character/cha_rare_sm_"+sortedUnits[i]["Rarity"]+".png";
      unitRarityImage.loading="eager";
      unitRarityImage.style.width="45%";
      unitRarityImage.style.height="45%";
      unitRarityImage.style.position = "absolute";
      unitRarityImage.style.bottom = "-7px";
      unitRarityImage.style.left = "-1px";
      unitRarityImage.style.border = "none";
      unitRarityImage.style.zIndex = "5";
      unitRarityImage.style.pointerEvents = "none";
      unitButtonContainer.appendChild(unitRarityImage);

      const unitThumbImage = document.createElement('img');
      unitThumbImage.src="dbManagement/DokkanFiles/global/en/character/thumb/card_"+getAssetID(sortedUnits[i]["ID"])+"_thumb.png";
      unitThumbImage.loading="lazy";
      unitThumbImage.style.width="100%";
      unitThumbImage.style.height="100%";
      unitThumbImage.style.position = "absolute";
      unitThumbImage.style.top = "0";
      unitThumbImage.style.left = "0";
      unitThumbImage.style.zIndex = "2";
      unitButton.appendChild(unitThumbImage);

      const unitBackImage = document.createElement('img');
      unitBackImage.src="dbManagement/DokkanFiles/global/en/layout/en/image/character/character_thumb_bg/cha_base_0"+typeToInt(sortedUnits[i]["Type"])+"_0"+rarityToInt(sortedUnits[i]["Rarity"])+".png";
      unitBackImage.loading="eager";
      unitBackImage.style.width="75%";
      unitBackImage.style.height="79%";
      unitBackImage.style.position = "absolute";
      unitBackImage.style.top = "17px";
      unitBackImage.style.left = "12px";
      unitBackImage.style.border = "none";
      unitBackImage.style.zIndex = "1";
      unitBackImage.style.pointerEvents = "none";
      unitButtonContainer.appendChild(unitBackImage);

      const unitTypingImage = document.createElement('img');
      unitTypingImage.src="dbManagement/DokkanFiles/global/en/layout/en/image/character/cha_type_icon_"+classToInt(sortedUnits[i]["Class"])+typeToInt(sortedUnits[i]["Type"])+".png";
      unitTypingImage.loading="eager";
      unitTypingImage.style.width="34%";
      unitTypingImage.style.height="34%";
      unitTypingImage.style.position = "absolute";
      unitTypingImage.style.top = "4px";
      unitTypingImage.style.right = "2px";
      unitTypingImage.style.border = "none";
      unitTypingImage.style.zIndex = "5";
      unitTypingImage.style.pointerEvents = "none";
      unitButtonContainer.appendChild(unitTypingImage);


      
      
      unitButtonContainer.style.position = "relative";



      //unitButton.style.backgroundImage = "url('dbManagement/DokkanFiles/global/en/character/card/"+getAssetID(sortedUnits[i]["ID"])+"/card_"+getAssetID(sortedUnits[i]["ID"])+"_full_thumb.png')";

      if(sortedUnits[i]["Eza"] || sortedUnits[i]["Seza"]){
        const ezaImage = document.createElement('img');
        ezaImage.src = "dbManagement/assets/misc/extra/eZa.png";
        ezaImage.loading="lazy";
        ezaImage.style.width = "20%";
        ezaImage.style.height = "20%";
        ezaImage.style.position = "absolute";
        ezaImage.style.bottom = "0";
        ezaImage.style.right = "30px";
        ezaImage.style.border = "none";
        ezaImage.style.zIndex = "5";
        ezaImage.style.pointerEvents = "none";
        unitButtonContainer.style.position = "relative";
        unitButtonContainer.appendChild(ezaImage);
      }

      if(sortedUnits[i]["Seza"]){
        const sezaImage = document.createElement('img');
        sezaImage.src = "dbManagement/assets/misc/extra/seZa.png";
        sezaImage.loading="lazy";
        sezaImage.style.width = "20%";
        sezaImage.style.height = "20%";
        sezaImage.style.position = "absolute";
        sezaImage.style.bottom = "0";
        sezaImage.style.right = "15px";
        sezaImage.style.border = "none";
        sezaImage.style.zIndex = "5";
        sezaImage.style.pointerEvents = "none";
        unitButtonContainer.style.position = "relative";
        unitButtonContainer.appendChild(sezaImage);
      }

    }
  }
  
  
}

export function classToInt(Class){
  switch(Class){
    case null:
      return 0;
    case "Super":
      return 1;
    case "Extreme":
      return 2;
  }
}

export function typeToInt(type){
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

export function createSortButton(){
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


export function createCharacterSelection(){
  createSortOption();
  createFilterOption();
  createSortButton();
}
const currentUrl=window.location.href;
let baseDomain=window.location.origin;
if(currentUrl.includes("dokkan-frontend")){
  baseDomain=baseDomain+"/dokkan-frontend";
}
createCharacterSelection();

//WIP: Use the json to create filters and sorting for the units