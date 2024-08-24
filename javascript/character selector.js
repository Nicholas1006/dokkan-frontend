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

export function createCharacterSelection(){
  const allUnitsJsonPromise=getJsonPromise('dbManagement/jsons/','allUnits','.json');
  allUnitsJsonPromise.then(allUnitsJson => {
    const UNITSTODISPLAY = 10000;
    const unitsContainer = document.getElementById('unit-selection-container');
    unitsContainer.style.width="100%";
    for (let i = UNITSTODISPLAY; i > 0;i--) {
      if(i<allUnitsJson.length){
        const unitButton = document.createElement('a');
        unitButton.id = "unit-button";
        unitButton.href = baseDomain+"/cards/index.html?id=" + allUnitsJson[i];
        unitButton.style.backgroundImage = "url('dbManagement/assets/final_assets/"+allUnitsJson[i]+".png')";
        unitButton.className="unit-selection-button";
        unitsContainer.appendChild(unitButton);
      }
    }
  }
  );
}
const currentUrl=window.location.href;
let baseDomain=window.location.origin;
if(currentUrl.includes("dokkan-frontend")){
  baseDomain=baseDomain+"/dokkan-frontend";
}
createCharacterSelection();