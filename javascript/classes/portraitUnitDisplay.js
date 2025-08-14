import {LWFPlayer} from "./LWF.js";

import {
  typeToInt,
  classToInt,
  rarityToInt
} from "../commonFunctions.js";
  export function getresourceID(unitID){
    if(unitID[unitID.length-1]=="1"){
      unitID=unitID.slice(0,-1)+"0";
    }
    return unitID;
  }

  
export class portraitUnitDisplay{
    constructor(width,height){

    this.lrAnimationIsSetup=false;
    this.highlightAnimationisSetup=false;

    this.container=document.createElement("div");
    this.container.width=width;
    this.container.height=height;
    this.container.className="portrait-unit-container";
    this.container.style.position="relative";
    this.container.style.display="none";
    
    this.container.unitButton=document.createElement("a");
    this.container.unitButton.className="unit-selection-button";
    this.container.unitButton.style.pointerEvents="none";
    this.container.appendChild(this.container.unitButton);

    this.container.unitRarityImage = document.createElement('img');
    this.container.unitRarityImage.className="unit-rarity-image";
    this.container.unitRarityImage.loading="eager";
    this.container.appendChild(this.container.unitRarityImage);

    this.container.unitTypingImage = document.createElement('img');
    this.container.unitTypingImage.className="unit-typing-image";
    this.container.unitTypingImage.loading="eager";
    this.container.appendChild(this.container.unitTypingImage);

    this.possibleEzaLevel="none";
    this.ezaLevel="none";
    
    this.container.ezaImage = document.createElement('img');
    this.container.ezaImage.src = window.assetBase+"/global/en/layout/en/image/charamenu/dokkan/dok_img_kyokugen.png";
    this.container.ezaImage.loading="lazy";
    this.container.ezaImage.className="unit-eza-image";
    this.container.ezaImage.style.display="none";
    this.container.appendChild(this.container.ezaImage);

    this.container.sezaImage = document.createElement('img');
    this.container.sezaImage.src = window.assetBase+"/global/en/layout/en/image/charamenu/dokkan/dok_img_super_optimal.png";
    this.container.sezaImage.loading="lazy";
    this.container.sezaImage.className="unit-eza-image";
    this.container.sezaImage.style.display="none";
    this.container.appendChild(this.container.sezaImage);
    
    this.createNonLrDisplay();
  }

  setResourceID(resourceID){
    if(resourceID!=this.resourceID){
      this.resourceID = resourceID;
      if(this.rarity=="lr"){
        this.createLRAnimation();
      }
      this.updateNonLrDisplay()
    }
  };

  updateNonLrDisplay(){
    this.container.nonLrDisplay.backgroundImage.src=window.assetBase+"/global/en/character/card/"+this.resourceID+"/card_"+this.resourceID+"_bg.png";
    this.container.nonLrDisplay.unitImage.src=window.assetBase+"/global/en/character/card/"+this.resourceID+"/card_"+this.resourceID+"_character.png";
    this.container.nonLrDisplay.effect.src=window.assetBase+"/global/en/character/card/"+this.resourceID+"/card_"+this.resourceID+"_effect.png";
  }

  createNonLrDisplay(){
    this.container.nonLrDisplay=document.createElement("div");
    this.container.nonLrDisplay.className="portraitUnitDisplay-non-lr-display";
    this.container.appendChild(this.container.nonLrDisplay);

    this.container.nonLrDisplay.backgroundImage=document.createElement("img");
    this.container.nonLrDisplay.backgroundImage.className="portraitUnitDisplay-non-lr-background-image";
    this.container.nonLrDisplay.backgroundImage.src=window.assetBase+"/global/en/character/card/"+this.resourceID+"/card_"+this.resourceID+"_bg.png";
    this.container.nonLrDisplay.appendChild(this.container.nonLrDisplay.backgroundImage);

    this.container.nonLrDisplay.unitImage=document.createElement("img");
    this.container.nonLrDisplay.unitImage.className="portraitUnitDisplay-non-lr-unit-image";
    this.container.nonLrDisplay.unitImage.src=window.assetBase+"/global/en/character/card/"+this.resourceID+"/card_"+this.resourceID+"_character.png";
    this.container.nonLrDisplay.appendChild(this.container.nonLrDisplay.unitImage);

    this.container.nonLrDisplay.effect=document.createElement("img");
    this.container.nonLrDisplay.effect.className="portraitUnitDisplay-non-lr-unit-image";
    this.container.nonLrDisplay.effect.src=window.assetBase+"/global/en/character/card/"+this.resourceID+"/card_"+this.resourceID+"effect.png";
    this.container.nonLrDisplay.appendChild(this.container.nonLrDisplay.effect);
  }

  updateLRAnimation(){
    if(this.lrAnimationIsSetup){
      this.container.lrAnimation.animation.pause();
      this.container.lrAnimation.animation=null;
      this.container.lrAnimation.remove();
      this.container.lrAnimation=null;
    }
    this.createLRAnimation();
  }

  createLRAnimation(){
    this.lrAnimationIsSetup=true;
    this.container.lrAnimation=document.createElement("canvas")
    this.container.lrAnimation.className="portraitUnitDisplay-lr-animation-lwf";
    this.container.lrAnimation.width=234;
    this.container.lrAnimation.height=320;
    
    this.container.appendChild(this.container.lrAnimation);
    this.container.lrAnimation.animation=new LWFPlayer(
          window.assetBase+"/global/en/character/card_bg/"+this.resourceID+"/card_"+this.resourceID+".lwf", 
          this.container.lrAnimation,
          "ef_001"
        );
  }

  createStickerAnimation(){
    //TODO: Implement sticker animation
  }


  
  setClass(Class){
    this.ClassInt=classToInt(Class);
    this.container.unitTypingImage.src=window.assetBase+"/global/en/layout/en/image/character/cha_type_icon_"+this.ClassInt+this.typeInt+".png";
  };
  setType(type){
    this.typeInt=typeToInt(type);
    this.container.unitTypingImage.src=window.assetBase+"/global/en/layout/en/image/character/cha_type_icon_"+this.ClassInt+this.typeInt+".png";
  };

  setRarity(rarity){
    this.rarity=rarity;
    this.rarityInt=rarityToInt(rarity);
    this.container.unitRarityImage.src=window.assetBase+"/global/en/layout/en/image/character/cha_rare_sm_"+this.rarity+".png";
    if(this.rarity=="lr"){
      if(!this.lrAnimationIsSetup && this.lrAnimationIsSetup==false){
        this.createLRAnimation();
      }
      this.container.lrAnimation.animation.play();
      this.container.lrAnimation.style.display="block";
      this.container.nonLrDisplay.style.display="none";
    }
    else{
      if(this.lrAnimationIsSetup){
        this.container.lrAnimation.animation.pause();
        this.container.lrAnimation.style.display="none";
      }
      this.container.nonLrDisplay.style.display="block";
    }
  }

  setLevel(level){
    this.level=level;
  }

  setEzaLevel(ezaLevel){
    this.ezaLevel=ezaLevel;
    if(this.possibleEzaLevel!="seza" && this.ezaLevel=="seza"){
      this.setPossibleEzaLevel("seza");
    }
    else if(this.possibleEzaLevel=="none" && this.ezaLevel!="none"){
      this.setPossibleEzaLevel("eza");
    }

    
    if(this.ezaLevel=="none"){
      this.container.ezaImage.style.filter="grayscale(100%)";
      this.container.sezaImage.style.filter="grayscale(100%)";
    }
    else if(this.ezaLevel=="eza"){
      this.container.ezaImage.style.filter="";
      this.container.sezaImage.style.filter="grayscale(100%)";
    }
    else if(this.ezaLevel=="seza"){
      this.container.ezaImage.style.filter="";
      this.container.sezaImage.style.filter="";
    }
  }

  setPossibleEzaLevel(possibleEzaLevel){
    this.possibleEzaLevel=possibleEzaLevel;
    if(this.possibleEzaLevel=="none"){
      this.container.ezaImage.style.display="none";
      this.container.sezaImage.style.display="none";
    }
    else if(this.possibleEzaLevel=="eza"){
      this.container.ezaImage.style.display="block";
      this.container.sezaImage.style.display="none";
    }
    else if(this.possibleEzaLevel=="seza"){
      this.container.ezaImage.style.display="block";
      this.container.sezaImage.style.display="block";
    }
  }

  setUrl(url){
      this.url=url;
      if(this.url==null){
        this.container.unitButton.style.pointerEvents="none";
      }
      else{
        this.container.unitButton.href=this.url;
        this.container.unitButton.style.pointerEvents="auto";
      }
  }

  setDisplay(displayed){
    this.displayed=displayed;
    if(displayed){
      this.container.style.display="block";
    }
    else{
      this.container.style.display="none";
    }

  }

  getElement(){
    return this.container;
  }

  setWidth(width){
    this.container.style.width=width;
  }

  setHeight(height){
    this.container.style.height=height;
  }
  addPressableEza(onClickFunction){
    if(this.possibleEzaLevel=="seza"){
      this.container.ezaImage.style.bottom="47px";
    }
    this.container.ezaImage.style.cursor="pointer";
    this.container.ezaImage.style.pointerEvents="auto";
    this.container.ezaImage.addEventListener("click",onClickFunction);
  }
  
  addPressableSeza(onClickFunction){
    this.container.sezaImage.style.cursor="pointer";
    this.container.sezaImage.style.pointerEvents="auto";
    this.container.sezaImage.addEventListener("click",onClickFunction);
  }
}


