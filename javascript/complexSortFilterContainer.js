import {removePX} from "./commonFunctions.js";
import {styledRadio} from "./styledRadio.js";
export class complexSortFilterContainer {
    constructor(width, height){
        this.initialise(width, height);
        
        this.createSortHeader();
        
        this.createSortOptions();

        this.createSortFilterDivisionLine();

        this.createFilterContainer();

        
    }

    initialise(width, height){
        this.border=70;
        this.width=width-this.border;
        this.height=height-this.border;
        this.element=document.createElement("div");
        this.element.className="complex-sort-filter-container";
        this.element.style.width=width-this.border+"px";
        this.element.style.height=height-this.border+"px";
        this.element.style.left=window.visualViewport.width/2-removePX(this.element.style.width)/2+"px";
        this.element.style.display="none";

        this.background=new complexSortFilterContainerBackground(width, height,this);
    }

    createSortHeader(){
        this.displayHeader=document.createElement("div");
        this.displayHeader.className="complex-sort-filter-container-header";
        this.displayHeader.innerHTML="Display order";
        this.displayHeader.style.gridRow="1";
        this.element.appendChild(this.displayHeader);

        this.directionOptionContainer=document.createElement("div");
        this.directionOptionContainer.className="direction-option";

        this.directionOptionContainer.text=document.createElement("div");
        this.directionOptionContainer.text.className="direction-option-text";
        this.directionOptionContainer.text.classList.add(window.currentOrder);
        this.directionOptionContainer.appendChild(this.directionOptionContainer.text);
        this.directionOptionContainer.addEventListener(
            "click", function(){
                if(this.text.classList.contains("descending")){
                    this.text.classList.remove("descending");
                    this.text.classList.add("ascending");
                    window.currentOrder="ascending";
                    document.getElementById("sort-direction").src=window.assetBase+"/global/en/layout/en/image/common/btn/filter_icon_ascending.png";
                    window.reSortCards();
                }
                else{
                    this.text.classList.remove("ascending");
                    this.text.classList.add("descending");
                    window.currentOrder="descending";
                    document.getElementById("sort-direction").src=window.assetBase+"/global/en/layout/en/image/common/btn/filter_icon_descending.png";
                    window.reSortCards();
                }
            }
        )

        this.displayHeader.appendChild(this.directionOptionContainer);

        
    }

    createSortOptions(){
        let sortContainerOptionsList=[
            //"Favourite",
            "Type",
            //"Level",
            "Rarity",
            "Cost",
            "HP",
            "Attack",
            "Defense",
            "Release",
            "Character",
            "Sp Atk Lv",
            //"Activation",
            "Max Level"
        ];
        
        const onChangeFunction=function(){
            document.getElementById("sort-text").textContent=this.value;
            window.currentSort=this.value;
            window.reSortCards();
        };
        this.sortContainer=new styledRadio(this.width,sortContainerOptionsList,"Release",3, true, onChangeFunction,window.assetBase+"/global/en/layout/en/image/common/btn/com_btn_18_green_gray.png", 32);
        this.sortContainer.getContainer().style.gridRow="2";
        this.sortContainer.getContainer()
        this.element.appendChild(this.sortContainer.getContainer());
    }

    createSortFilterDivisionLine(){
        this.sortFilterDivisionLine=document.createElement("div");
        this.sortFilterDivisionLine.className="sort-filter-division-line";
        this.sortFilterDivisionLine.style.gridRow="3";
        this.element.appendChild(this.sortFilterDivisionLine);
    }

    

    createFilterContainer(){
        this.filterContainer=document.createElement("div");
        this.filterContainer.className="filter-container";
        this.element.appendChild(this.filterContainer);

        this.createFilterHeader();

        this.createCategorySkillContainer();

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

    createFilterHeader(){

        this.filterHeader=document.createElement("div");
        this.filterHeader.className="complex-sort-filter-container-header";
        this.filterHeader.innerHTML="Filter Select";
        this.filterHeader.style.gridRow="4";
        this.filterContainer.appendChild(this.filterHeader);
    }

    createCategorySkillContainer(){
        this.filterContainer.categorySkillContainer=document.createElement("div");
        this.filterContainer.categorySkillContainer.className="filter-category-skill-container";
        this.filterContainer.appendChild(this.filterContainer.categorySkillContainer);

        this.createCategoryContainer();
        this.createSkillContainer();
    }

    createCategoryContainer(){
        this.filterContainer.categorySkillContainer.categoryContainer=document.createElement("div");
        this.filterContainer.categorySkillContainer.categoryContainer.className="filter-category-container";
        this.filterContainer.categorySkillContainer.categoryContainer.innerHTML="Select Category";
        this.filterContainer.categorySkillContainer.appendChild(this.filterContainer.categorySkillContainer.categoryContainer);
        
        this.filterContainer.categorySkillContainer.categoryContainer.text=document.createElement("div");
        this.filterContainer.categorySkillContainer.categoryContainer.text.className="filter-category-container-text";
        this.filterContainer.categorySkillContainer.categoryContainer.text.innerHTML="Category";
        this.filterContainer.categorySkillContainer.appendChild(this.filterContainer.categorySkillContainer.categoryContainer.text);
    }

    createSkillContainer(){
        this.filterContainer.categorySkillContainer.skillContainer=document.createElement("div");
        this.filterContainer.categorySkillContainer.skillContainer.className="filter-skill-container";
        this.filterContainer.categorySkillContainer.skillContainer.innerHTML="Select Effect";
        this.filterContainer.categorySkillContainer.appendChild(this.filterContainer.categorySkillContainer.skillContainer);

        this.filterContainer.categorySkillContainer.skillContainer.text=document.createElement("div");
        this.filterContainer.categorySkillContainer.skillContainer.text.className="filter-skill-container-text";
        this.filterContainer.categorySkillContainer.skillContainer.text.innerHTML="Skill Effect";
        this.filterContainer.categorySkillContainer.appendChild(this.filterContainer.categorySkillContainer.skillContainer.text);
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
        this.background.handleResize(width,height);
    }

    changeHeight(height){
        this.element.style.height=height+"px";        
        this.background.handleResize(width,height);
    }

    setDisplay(displayed){
        if(displayed){
            this.element.style.display="grid";
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
        // Calculate heights based on aspect ratio (116/640)
        const headerFooterHeight = width * (116/640);

        // Top element
        this.backgroundTop = document.createElement("div");
        this.backgroundTop.className = "complex-sort-filter-container-background-top";
        this.backgroundTop.style.height = headerFooterHeight+"px";
        this.element.appendChild(this.backgroundTop);
        
        // Middle element
        this.backgroundMiddle = document.createElement("div");
        this.backgroundMiddle.className = "complex-sort-filter-container-background-middle";
        this.backgroundMiddle.style.top = headerFooterHeight+"px";
        this.backgroundMiddle.style.height = (height - (2 * headerFooterHeight))+"px";
        this.element.appendChild(this.backgroundMiddle);
        
        // Bottom element
        this.backgroundBottom = document.createElement("div");
        this.backgroundBottom.className = "complex-sort-filter-container-background-bottom";
        this.backgroundBottom.style.height = headerFooterHeight+"px";
        this.element.appendChild(this.backgroundBottom);
        
        // Handle viewport changes
        this.handleResize();
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleResize(width=this.width, height=this.height){
        this.width=width;
        this.height=height;
        const centerPosition = window.visualViewport.width / 2 - this.width / 2;
        this.backgroundTop.style.left = centerPosition+"px";
        this.backgroundTop.style.width = this.width+"px";

        this.backgroundMiddle.style.left = centerPosition+"px";
        this.backgroundMiddle.style.width = this.width+"px";
        this.backgroundMiddle.style.height = removePX(window.visualViewport.height) - (removePX(this.backgroundTop.style.height) + removePX(this.backgroundBottom.style.height))+"px";

        this.backgroundBottom.style.left = centerPosition+"px";
        this.backgroundBottom.style.width = this.width+"px";
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