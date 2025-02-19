import {removePX} from "./commonFunctions.js";
import {styledRadio} from "./styledRadio.js";
export class complexSortFilterContainer {
    constructor(width, height){
        this.border=25;
        this.element=document.createElement("div");
        this.element.className="complex-sort-filter-container";
        this.element.style.width=width-this.border+"px";
        this.element.style.height=height-this.border+"px";
        this.element.style.left=window.visualViewport.width/2-removePX(this.element.style.width)/2+"px";
        this.element.style.display="none";

        this.background=new complexSortFilterContainerBackground(width, height,this);
        
        let sortContainerOptionsList=[
            "Favourite",
            "Type",
            "Cost",
            "Rarity",
            "Cost",
            "HP",
            "Attack",
            "Defense",
            "Release",
            "Character",
            "Sp Atk Lv",
            "Activation",
            "Max Level"
        ];
        this.sortContainer=new styledRadio(sortContainerOptionsList,3, true);
        this.element.appendChild(this.sortContainer.getContainer());

        this.filterContainer=document.createElement("div");
        this.filterContainer.className="filter-container";
        this.element.appendChild(this.filterContainer);

        this.filterContainer.categorySkillContainer=document.createElement("div");
        this.filterContainer.categorySkillContainer.className="filter-category-skill-container";
        this.filterContainer.appendChild(this.filterContainer.categorySkillContainer);

        this.filterContainer.categorySkillContainer.categoryContainer=document.createElement("div");
        this.filterContainer.categorySkillContainer.categoryContainer.className="filter-category-container";
        this.filterContainer.appendChild(this.filterContainer.categorySkillContainer.categoryContainer);

        this.filterContainer.categorySkillContainer.skillContainer=document.createElement("div");
        this.filterContainer.categorySkillContainer.skillContainer.className="filter-skill-container";
        this.filterContainer.appendChild(this.filterContainer.categorySkillContainer.skillContainer);

        this.filterContainer.rarityContainer=document.createElement("div");
        this.filterContainer.rarityContainer.className="filter-rarity-container";
        this.filterContainer.appendChild(this.filterContainer.rarityContainer);
        
        this.filterContainer.typeClassContainer=document.createElement("div");
        this.filterContainer.typeClassContainer.className="filter-type-class-container";
        this.filterContainer.appendChild(this.filterContainer.typeClassContainer);
        
        this.filterContainer.typeClassContainer.typeContainer=document.createElement("div");
        this.filterContainer.typeClassContainer.typeContainer.className="filter-type-container";
        this.filterContainer.typeClassContainer.appendChild(this.filterContainer.typeClassContainer.typeContainer);
        
        this.filterContainer.typeClassContainer.classContainer=document.createElement("div");    
        this.filterContainer.typeClassContainer.classContainer.className="filter-class-container";
        this.filterContainer.typeClassContainer.appendChild(this.filterContainer.typeClassContainer.classContainer);

        this.filterContainer.awakeningContainer=document.createElement("div");
        this.filterContainer.awakeningContainer.className="filter-awakening-container";
        this.filterContainer.appendChild(this.filterContainer.awakeningContainer);

        this.filterContainer.superAttackContainer=document.createElement("div");
        this.filterContainer.superAttackContainer.className="filter-super-attack-container";
        this.filterContainer.appendChild(this.filterContainer.superAttackContainer);

        this.filterContainer.linkContainer=document.createElement("div");
        this.filterContainer.linkContainer.className="filter-link-container";
        this.filterContainer.appendChild(this.filterContainer.linkContainer);
    }

    getElement(){
        return this.element;
    }

    getBackground(){
        return this.background.getElement();
    }

    changeWidth(width){
        this.element.style.width=width-this.border+"px";
        this.element.style.left="calc(50% - min("+this.element.style.width+", 50vw))";
        this.background.changeWidth(width);
    }

    changeHeight(height){
        this.element.style.height=height+"px";        
        this.background.changeHeight(height);
    }

    setDisplay(displayed){
        if(displayed){
            this.element.style.display="block";
            this.background.setDisplay(true);
        }
        else{
            this.element.style.display="none";
            this.background.setDisplay(false);
        }
    }
    getDisplay(){
        return this.element.style.display!="none";
    }
}

class complexSortFilterContainerBackground {
    constructor(width, height,parentClass){
        this.width=width;
        this.height=height;
        this.parentClass=parentClass;
        this.element=document.createElement("div");
        this.element.className="complex-sort-filter-container-background";

        this.backgroundTop=document.createElement("div");
        this.backgroundTop.style.width=width+"px";
        this.backgroundTop.style.height=width*(116/640)+"px";
        this.backgroundTop.style.top="0px";
        this.backgroundTop.style.left= window.visualViewport.width/2-removePX(this.backgroundTop.style.width)/2+"px";
        this.backgroundTop.className="complex-sort-filter-container-background-top";
        this.element.appendChild(this.backgroundTop);
        
        this.backgroundMiddle=document.createElement("div");
        this.backgroundMiddle.style.width=width+"px";
        this.backgroundMiddle.style.height=height-(2*width*(116/640))+"px";
        this.backgroundMiddle.style.top=this.backgroundTop.style.height;
        this.backgroundMiddle.style.left= window.visualViewport.width/2-removePX(this.backgroundMiddle.style.width)/2+"px";
        this.backgroundMiddle.className="complex-sort-filter-container-background-middle";
        this.element.appendChild(this.backgroundMiddle);
        
        this.backgroundBottom=document.createElement("div");
        this.backgroundBottom.style.width=width+"px";
        this.backgroundBottom.style.top=removePX(this.backgroundTop.style.height)+removePX(this.backgroundMiddle.style.height)+"px";
        this.backgroundBottom.style.height=width*(116/640)+"px";
        this.backgroundBottom.style.left= window.visualViewport.width/2-removePX(this.backgroundBottom.style.width)/2+"px";
        this.backgroundBottom.className="complex-sort-filter-container-background-bottom";
        this.element.appendChild(this.backgroundBottom);
    }

    changeWidth(width){
        this.width=width;
        this.backgroundTop.style.width=width+"px";
        this.backgroundMiddle.style.width=width+"px";
        this.backgroundBottom.style.width=width+"px";

        this.backgroundTop.style.height=width*(116/640)+"px";
        this.backgroundMiddle.style.height=removePX(this.parentClass.element.style.height)-(2*width*(116/640))+"px";
        this.backgroundBottom.style.height=width*(116/640)+"px";

        this.backgroundTop.style.left= window.visualViewport.width/2-removePX(this.element.style.width)/2+"px";
        this.backgroundMiddle.style.left= window.visualViewport.width/2-removePX(this.element.style.width)/2+"px";
        this.backgroundBottom.style.left= window.visualViewport.width/2-removePX(this.element.style.width)/2+"px";

        
        this.backgroundMiddle.style.top=this.backgroundTop.style.height;
        this.backgroundBottom.style.top=removePX(this.backgroundTop.style.height)+removePX(this.backgroundMiddle.style.height)+"px";


    }

    changeHeight(height){
        this.height=height;
        this.backgroundMiddle.style.height=height-(2*width*(116/640))+"px";
        
        this.backgroundMiddle.style.top=this.backgroundTop.style.height;
        this.backgroundBottom.style.top=removePX(this.backgroundTop.style.height)+removePX(this.backgroundMiddle.style.height)+"px";
    }

    setDisplay(displayed){
        if(displayed){
            this.element.style.display="block";
        }
        else{
            this.element.style.display="none";
        }
    }

    getElement(){
        return this.element;
    }
}