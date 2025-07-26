export function timeSince(epochTime){
  let now = new Date().getTime();
  let distance = now - (epochTime * 1000);
  let minutes = Math.round(distance / (1000 * 60));
  let hours = Math.round(distance / (1000 * 3600));
  let days = Math.round(distance / (1000 * 3600 * 24));
  if(Math.abs(minutes) < 60){
    return [minutes , " minutes"];
  }
  else if(Math.abs(hours) < 24){
    return [hours , " hours"];
  }
  else{
    return [days , " days"];
  }
}

export function removePX(styleWithPx){
  
  if(typeof styleWithPx === "string" && styleWithPx.includes("px")){
    return parseInt(styleWithPx.replace("px",""));
  }
  else{
    return parseInt(styleWithPx);
  }
}

export function extractDigitsFromString(string){
    let stringArray=string.split("");
    let digitArray=[];
    for(let i=0;i<stringArray.length;i++){
        if(!isNaN(stringArray[i])){
            digitArray.push(stringArray[i]);
        }
    }
    let digitInteger=digitArray.join("");
    return digitInteger
}

export function arraysHaveOverlap(array1,array2){
    for(let i=0;i<array1.length;i++){
        if(array2.includes(array1[i])){
            return true
        }
    }
    return false
}


export function getFirstInDictionary(originalDictionary,valueList){
    for (const searchedKey in originalDictionary) {
        if(valueList.includes(originalDictionary[searchedKey])){
            return(searchedKey)
        }
    }
}

export function calculateAdditionalChance(hiPoAdditional, attacksPerformed){
    let output={};
    output["Super"]=1-(1-hiPoAdditional/100)**attacksPerformed;
    output["Neither"]=(1-(2*hiPoAdditional/100))**attacksPerformed;
    output["Normal"]=1-output["Super"]-output["Neither"];
    //Other option if the first method doesn't work
//    output["Normal"]= -((1+  (2*hiPoAdditional)  )**attacksPerformed)    +     (1-hiPoAdditional)**attacksPerformed;    

    return output
}

export function LightenColor(color, percent){
    var num = parseInt(color.slice(1),16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = (num >> 8 & 0x00FF) + amt,
    G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}

export function isEmptyDictionary(dictionary){
    if(dictionary==undefined){
        return(true)
    }
    return(Object.keys(dictionary).length==0 );
}

export function isIdenticalDictionary(dictionary1,dictionary2){
    return(JSON.stringify(dictionary1)==JSON.stringify(dictionary2))
}

export function updateQueryStringParameter(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({ path: url.href}, '', url.href);
}

export function splitTextByWords(text, words) {
    // Sort words by length in descending order to handle overlapping words correctly
    words.sort((a, b) => b.length - a.length);

    // Escape special regex characters in the words
    const escapedWords = words.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    // Create a regex to match any of the words
    const regex = new RegExp(`(${escapedWords.join('|')})`, 'g');

    // Split the text using the regex and preserve the matched words as separate elements
    const result = text.split(regex);

    return result.filter(part => part !== ""); // Remove any empty strings from the result
}

export function advantageCalculator(attackerTyping, attackerClass, defenderTyping, defenderClass,defenderGuard){
    if(defenderGuard){
        return([0.8,0.5]);
    }
    let attackerTypeAdvantage=(typeToInt(attackerTyping,true)-typeToInt(defenderTyping,true));
    if(attackerTypeAdvantage<-1){
        attackerTypeAdvantage+=5;
    }
    if(attackerTypeAdvantage==4){
        attackerTypeAdvantage=-1;
    }
    else if(attackerTypeAdvantage==3 || attackerTypeAdvantage==2){
        attackerTypeAdvantage=0;
    }

    let attackerClassAdvantage;
    if(attackerClass=="None"){
        if(defenderClass=="None"){
            attackerClassAdvantage=0;
        }
        else{
            attackerClassAdvantage=-1;
        }
    }
    else if(defenderClass=="None"){
        //if (attackerClass=="None"){
        //    attackerClassAdvantage=0;
        //}
        //else{
        attackerClassAdvantage=1;
    }
    else{
        if(attackerClass==defenderClass){
            attackerClassAdvantage=0;
        }
        else{
            attackerClassAdvantage=1;
        }
    }

    switch(attackerTypeAdvantage){
        case -1:
            switch(attackerClassAdvantage){
                case -1:
                    return([0.8,0.5]);
                case 0:
                    return([0.8,0.5]);
                case 1:
                    return([1,1]);
            }
        case 0:
            switch(attackerClassAdvantage){
                case -1:
                    return([0.9,0.5]);
                case 0:
                    return([1,1]);
                case 1:
                    return([1.25,1]);
            }
        case 1:
            switch(attackerClassAdvantage){
                case -1:
                    return([1,0.5]);
                case 0:
                    return([1.15,1]);
                case 1:
                    return([1.5,1]);
            }
    }    
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

export function classToInt(Class){
  switch(Class){
    case "None":
      return 0;
    case "Super":
      return 1;
    case "Extreme":
      return 2;
  }
}
  
export function typeToInt(type,advantageConcern=false){
  if(advantageConcern){
    switch(type){
      case "STR":
        return 4;
      case "PHY":
        return 3;
      case "INT":
        return 2;
      case "TEQ":
        return 1;
      case "AGL":
        return 0;
    }
  }
  else{
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
}