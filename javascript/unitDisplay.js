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
  export function getAssetID(unitID){
    if(unitID[unitID.length-1]=="1"){
      unitID=unitID.slice(0,-1)+"0";
    }
    return unitID;
  }

  
export class unitDisplay{
    constructor(assetID,Class,type,rarity,url){
        this.assetID=assetID;
        this.ClassInt=classToInt(Class);
        this.typeInt=typeToInt(type);
        this.rarity=rarity;
        this.rarityInt=rarityToInt(rarity);
        this.url=url;

        this.container=document.createElement("div");
        this.container.className="unit-container";
        this.container.style.position="relative";
        
        this.container.unitButton=document.createElement("a");
        this.container.unitButton.href=this.url;
        this.container.unitButton.className="unit-selection-button";
        this.container.appendChild(this.container.unitButton);

        this.container.unitRarityImage = document.createElement('img');
        this.container.unitRarityImage.className="unit-rarity-image";
        this.container.unitRarityImage.src="dbManagement/DokkanFiles/global/en/layout/en/image/character/cha_rare_sm_"+this.rarity+".png";
        this.container.unitRarityImage.loading="eager";
        this.container.appendChild(this.container.unitRarityImage);

        this.container.unitThumbImage = document.createElement('img');
        this.container.unitThumbImage.className="unit-thumb-image";
        this.container.unitThumbImage.src="dbManagement/DokkanFiles/global/en/character/thumb/card_"+getAssetID(this.assetID)+"_thumb.png";
        this.container.unitThumbImage.loading="lazy";
        this.container.unitButton.appendChild(this.container.unitThumbImage);

        this.container.unitBackImage = document.createElement('img');
        this.container.unitBackImage.className="unit-back-image";
        this.container.unitBackImage.src="dbManagement/DokkanFiles/global/en/layout/en/image/character/character_thumb_bg/cha_base_0"+this.typeInt+"_0"+this.rarityInt+".png";
        this.container.unitBackImage.loading="eager";
        this.container.appendChild(this.container.unitBackImage);

        this.container.unitTypingImage = document.createElement('img');
        this.container.unitTypingImage.className="unit-typing-image";
        this.container.unitTypingImage.src="dbManagement/DokkanFiles/global/en/layout/en/image/character/cha_type_icon_"+this.ClassInt+this.typeInt+".png";
        this.container.unitTypingImage.loading="eager";
        this.container.appendChild(this.container.unitTypingImage);


        
        
        
    }

    setassetID(assetID){
        this.assetID=assetID;
        this.container.unitThumbImage.src="dbManagement/DokkanFiles/global/en/character/thumb/card_"+this.assetID+"_thumb.png";
    };

    setClass(Class){
        this.ClassInt=Class;
        this.container.unitBackImage.src="dbManagement/DokkanFiles/global/en/layout/en/image/character/character_thumb_bg/cha_base_0"+this.typeInt+"_0"+rarityToInt(this.rarity)+".png";
        this.container.unitTypingImage.src="dbManagement/DokkanFiles/global/en/layout/en/image/character/cha_type_icon_"+this.ClassInt+this.typeInt+".png";
    };
    setType(type){
        this.typeInt=type;
        this.container.unitBackImage.src="dbManagement/DokkanFiles/global/en/layout/en/image/character/character_thumb_bg/cha_base_0"+this.typeInt+"_0"+rarityToInt(this.rarity)+".png";
        this.container.unitTypingImage.src="dbManagement/DokkanFiles/global/en/layout/en/image/character/cha_type_icon_"+this.ClassInt+this.typeInt+".png";
    };
    setRarity(rarity){
        this.rarity=rarity;
        this.container.unitBackImage.src="dbManagement/DokkanFiles/global/en/layout/en/image/character/character_thumb_bg/cha_base_0"+this.typeInt+"_0"+rarityToInt(this.rarity)+".png";
    }
    setUrl(url){
        this.url=url;
        this.container.unitButton.href=this.url;
    }

    


}