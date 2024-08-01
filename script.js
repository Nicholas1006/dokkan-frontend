import * as webFunctions from "./websiteFunctions.js";
document.addEventListener('DOMContentLoaded', function() {
  const urlParams=new URLSearchParams(window.location.search);
    let subURL = urlParams.get('id') || "None";
    let characterSelector = urlParams.get("Selection") || "False";
    if(subURL == "None"){
        characterSelector = "True";
    }
    if(characterSelector == "True"){
      webFunctions.createCharacterSelection();
    }
    else{
      webFunctions.loadPage(true);
    }
  }
)