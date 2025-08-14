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

  
export class squareUnitDisplay{
    constructor(){

      this.lrAnimationIsSetup=false;
      this.highlightAnimationisSetup=false;

      this.container=document.createElement("div");
      this.container.className="square-unit-container";
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





      this.container.unitThumbImage = document.createElement('img');
      this.container.unitThumbImage.className="unit-thumb-image";
      this.container.unitThumbImage.loading="lazy";
      this.container.unitButton.appendChild(this.container.unitThumbImage);

      this.container.unitBackImage = document.createElement('img');
      this.container.unitBackImage.className="unit-back-image";
      this.container.unitBackImage.loading="eager";
      this.container.appendChild(this.container.unitBackImage);

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
      
      this.container.infoHolder = document.createElement("div");
      this.container.infoHolder.className="unit-info-holder";
      this.container.appendChild(this.container.infoHolder);

      this.container.infoHolder.unitLevel=document.createElement("div");
      this.container.infoHolder.unitLevel.className="unit-info-holder-level";
      this.container.infoHolder.appendChild(this.container.infoHolder.unitLevel);
      if(this.otherDisplayedValue!=null){
          this.container.infoHolder.unitLevel.style.animation="fade 4s infinite";
      }
      else{
          this.container.infoHolder.unitLevel.style.animation="none";
      }

      this.container.infoHolder.unitLevel.level=document.createElement("img")
      this.container.infoHolder.unitLevel.level.className="unit-info-holder-level-level";
      this.container.infoHolder.unitLevel.level.src=window.assetBase+"/global/en/layout/en/image/common/label/com_label_large_lv.png";
      this.container.infoHolder.unitLevel.level.loading="eager";
      this.container.infoHolder.unitLevel.appendChild(this.container.infoHolder.unitLevel.level);

      this.container.infoHolder.unitLevel.number=document.createElement("div");
      this.container.infoHolder.unitLevel.number.className="unit-info-holder-level-number";
      this.container.infoHolder.unitLevel.number.innerHTML=this.level;
      this.container.infoHolder.unitLevel.appendChild(this.container.infoHolder.unitLevel.number);

      this.container.infoHolder.unitText=document.createElement("div");
      this.container.infoHolder.unitText.className="unit-info-holder-text";
      this.container.infoHolder.unitText.style.animation="fade 4s infinite";
      this.container.infoHolder.unitText.style.animationDelay="-2s";
      this.container.infoHolder.unitText.innerHTML=this.otherDisplayedValue;
      this.container.infoHolder.appendChild(this.container.infoHolder.unitText);

    }

    setResourceID(resourceID){
      if(resourceID!=this.resourceID){
        this.resourceID = resourceID;
        this.container.unitThumbImage.style.visibility="hidden";
        this.container.unitThumbImage.onload = () => {
          this.container.unitThumbImage.style.visibility="visible";
        };
        this.container.unitThumbImage.src = window.assetBase+"/global/en/character/thumb/card_"+this.resourceID+"_thumb.png";
      }
    };


    createLRAnimation(){
      this.container.lrAnimation=document.createElement("canvas")
      this.container.lrAnimation.className="unit-lr-animation-lwf";
      
      this.container.appendChild(this.container.lrAnimation);
      this.container.lrAnimation.animation=new LWFPlayer(window.assetBase+"/global/en/outgame/effect/icon_rare_20000/en/icon_rare_20000.lwf", this.container.lrAnimation,"ef_001", 
            this.container.lrAnimation.width/300,
            this.container.lrAnimation.height/300,
            this.container.lrAnimation.width/2,
            this.container.lrAnimation.height/1.9);
    }
    setClass(Class){
      this.ClassInt=classToInt(Class);
      this.container.unitBackImage.src=window.assetBase+"/global/en/layout/en/image/character/character_thumb_bg/cha_base_0"+this.typeInt+"_0"+rarityToInt(this.rarity)+".png";
      this.container.unitTypingImage.src=window.assetBase+"/global/en/layout/en/image/character/cha_type_icon_"+this.ClassInt+this.typeInt+".png";
    };
    setType(type){
      this.typeInt=typeToInt(type);
      this.container.infoHolder.style.backgroundImage="url('"+window.assetBase+"/global/en/layout/en/image/character/cha_base_bottom_0"+this.typeInt+".png')";
      this.container.unitBackImage.src=window.assetBase+"/global/en/layout/en/image/character/character_thumb_bg/cha_base_0"+this.typeInt+"_0"+rarityToInt(this.rarity)+".png";
      this.container.unitTypingImage.src=window.assetBase+"/global/en/layout/en/image/character/cha_type_icon_"+this.ClassInt+this.typeInt+".png";
    };

    setRarity(rarity){
      this.rarity=rarity;
      this.rarityInt=rarityToInt(rarity);
      this.container.unitBackImage.src=window.assetBase+"/global/en/layout/en/image/character/character_thumb_bg/cha_base_0"+this.typeInt+"_0"+rarityToInt(this.rarity)+".png";
      this.container.unitRarityImage.src=window.assetBase+"/global/en/layout/en/image/character/cha_rare_sm_"+this.rarity+".png";
      if(this.rarity=="lr"){
        if(!this.lrAnimationIsSetup){
          this.createLRAnimation();
          this.lrAnimationIsSetup=true;
        }
        this.container.lrAnimation.animation.play();
        this.container.lrAnimation.style.display="block";
      }
      else{
        if(this.lrAnimationIsSetup){
          this.container.lrAnimation.animation.pause();
          this.container.lrAnimation.style.display="none";
        }
      //   this.container.lrAnimation.style.display="none";
      //   this.container.lrBackground.style.display="none";
      }
    }

    setLevel(level){
      this.level=level;
      this.container.infoHolder.unitLevel.number.innerHTML=this.level;
    }

    setOtherDisplayedValue(otherDisplayedValue){
      this.otherDisplayedValue=otherDisplayedValue;
      this.container.infoHolder.unitText.innerHTML=this.otherDisplayedValue;
      if(this.otherDisplayedValue==null){
        this.container.infoHolder.unitText.style.display="none";
        this.container.infoHolder.unitLevel.style.animation="none";
      }
      else{
        this.container.infoHolder.unitText.style.display="block";
        this.container.infoHolder.unitLevel.style.animation="fade 4s infinite";
      }
    }

    setOtherDisplayedValueColor(otherDisplayedValueColor){
      this.otherDisplayedValueColor=otherDisplayedValueColor;
      this.container.infoHolder.unitText.style.color=this.otherDisplayedValueColor;
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

    setDisplayExtraInfo(displayed){
      this.displayedExtraInfo=displayed;
      if(displayed){
        this.container.style.marginBottom="24px";
        this.container.infoHolder.style.display="block";
      }
      else{
        this.container.style.marginBottom="0px";
        this.container.infoHolder.style.display="none";
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
        this.container.ezaImage.style.right="33%";
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

    setupHighlight(){
      this.container.highlight=document.createElement("div");
      this.container.highlight.className="unit-highlight";
      this.container.appendChild(this.container.highlight);

      this.container.highlight.background=document.createElement("canvas")
      this.container.highlight.appendChild(this.container.highlight.background);
      this.container.highlight.background.className="unit-highlight-animation-lwf-background";
      this.container.highlight.background.animation=new LWFPlayer(
            window.assetBase+"/global/en/outgame/effect/icon_rare_20000/en/icon_rare_20000.lwf", this.container.highlight.background,"ef_032", 
            this.container.highlight.background.width/300,
            this.container.highlight.background.height/300,
            this.container.highlight.background.width/2,
            this.container.highlight.background.height/1.9);

      this.container.highlight.arrow=document.createElement("canvas")
      this.container.highlight.appendChild(this.container.highlight.arrow);
      this.container.highlight.arrow.className="unit-highlight-animation-lwf-arrow";
      this.container.highlight.arrow.animation=new LWFPlayer(
            window.assetBase+"/global/en/outgame/effect/icon_rare_20000/en/icon_rare_20000.lwf", this.container.highlight.arrow,"ef_033", 
            this.container.highlight.arrow.width/300,
            this.container.highlight.arrow.height/300,
            this.container.highlight.arrow.width/2,
            this.container.highlight.arrow.height/2);

      this.highlightAnimationisSetup=true;
    }


    setHighlight(highlighted){
      
      if(highlighted){
        if(!this.highlightAnimationisSetup){
          this.setupHighlight();
        }
        this.container.highlight.background.animation.play();
        this.container.highlight.arrow.animation.play();
        this.container.highlight.style.display="block";
      }
      else if(this.highlightAnimationisSetup){
        this.container.highlight.background.animation.pause();
        this.container.highlight.arrow.animation.pause();
        this.container.highlight.style.display="none";
      }
    }


}


