import * as webFunctions from "./websiteFunctions.js";
document.addEventListener('DOMContentLoaded', function() {

  const urlParams=new URLSearchParams(window.location.search);
  let subURL = urlParams.get('id') || "None";
  let characterSelector = urlParams.get("Selection") || "False";
  let isSeza = urlParams.get("SEZA") || "False";
  let isEza;
  let jsonPromise;
  if(isSeza == "False"){
    isEza = urlParams.get("EZA") || "False";
  }
  else{
    isEza = "False";
  }
  if(subURL == "None"){
    characterSelector = "True";
  }
  if(characterSelector == "True"){
    webFunctions.createCharacterSelection();
  }
  else{
    if(isSeza == "True"){
      jsonPromise=webFunctions.getJson('dbManagement/jsonsSEZA/',subURL,'.json');
    }
    else if(isEza == "True"){
      jsonPromise=webFunctions.getJson('dbManagement/jsonsEZA/',subURL,'.json');
    }
    else{
      jsonPromise=webFunctions.getJson('dbManagement/jsons/',subURL,'.json');
    }
  jsonPromise.then(json => {
    webFunctions.initialiseAspects(json);
    webFunctions.createLeaderStats();
    webFunctions.createLinkStats(json);
    webFunctions.createLinkBuffs(json);
    webFunctions.createStarButton(json);
    webFunctions.createPathButtons(json);
    webFunctions.createEzaContainer(json,isEza,isSeza);
    webFunctions.createTransformationContainer(json);
    webFunctions.createDokkanAwakenContainer(json);
    webFunctions.createLevelSlider(json);
    webFunctions.createKiCircles(json);
    webFunctions.createSuperAttackContainer(json);
    webFunctions.createPassiveContainer(json);
    webFunctions.AdjustBaseStats(json);
      if(json["Rarity"] == "lr" || json["Rarity"] == "ur"){
        const buttonContainer = document.getElementById('hipo-button-container');
        buttonContainer.style.display = "grid";
      }
  })
  }
});
