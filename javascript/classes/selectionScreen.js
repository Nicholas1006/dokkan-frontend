import {complexSortFilterContainerBackground} from "./complexSortFilterContainer.js";
import { StyledRadioOption } from "./styledRadio.js";
export class selectionScreen{
    constructor(type, width, height, border, parentClass,completedFunction){
        this.type=type;
        this.width=width;
        this.height=height;
        this.parentClass=parentClass;
        this.completedFunction=completedFunction;

        this.element=document.createElement("div");
        this.element.className="selection-screen";
        
        if(width.toString().endsWith("px") || width.toString().endsWith("%") || width.toString().endsWith("vh")){
            this.element.style.width=width;
        }
        else{
            this.element.style.width=width+"px";
        }
        if(height.toString().endsWith("px") || height.toString().endsWith("%") || height.toString().endsWith("vh")){
            this.element.style.height=height;
        }
        else{
            this.element.style.height=height+"px";
        }
        this.element.style.display="none";

        this.background=new complexSortFilterContainerBackground(width+border, height,this);
        this.background.getElement().style.zIndex="-2";
        this.element.appendChild(this.background.getElement());

        if(type=="category"){
            fetch("/dbManagement/uniqueJsons/categories.json").then(
                async response=>{
                    this.createCategorySelectionScreen(await response.json());
                }
            )
        }
    }

    createCategorySelectionScreen(categoriesData){

        this.titleAndSearch=document.createElement("div");
        this.titleAndSearch.className="title-and-search";
        this.titleAndSearch.style.gridRow="1";
        this.element.appendChild(this.titleAndSearch);

        this.title=document.createElement("div");
        this.title.className="sort-filter-title";
        this.title.textContent="Category Selection";
        this.titleAndSearch.appendChild(this.title);

        this.search=document.createElement("div");
        this.search.className = "sort-filter-search";
        this.search.style.backgroundImage = "url("+window.assetBase+"/global/en/layout/en/image/common/btn/com_btn_search.png)";
        this.titleAndSearch.appendChild(this.search);



        this.selectionTypeChoice=document.createElement("div");
        this.selectionTypeChoice.className="selection-type-choice";
        this.selectionTypeChoice.style.gridRow="2";
        this.element.appendChild(this.selectionTypeChoice);
        this.selectionTypeChoice.background = new StyledRadioOption(
            window.assetBase+"/global/en/layout/en/image/common/com_checkbox_base.png",
            17, 
            this.selectionTypeChoice.width, 
            this.selectionTypeChoice.height, 
            "", 
            function(){}
        );
        this.selectionTypeChoice.background.changeCursor("default");
        this.selectionTypeChoice.background.getElement().style.position="relative";
        this.selectionTypeChoice.background.getElement().style.gridColumn="1 / span 2";
        this.selectionTypeChoice.background.getElement().style.gridRow="1 / span 2";
        this.selectionTypeChoice.background.getElement().style.zIndex="0";
        this.selectionTypeChoice.appendChild(this.selectionTypeChoice.background.element);

        this.selectionTypeChoice.fullMatch=document.createElement("div");
        this.selectionTypeChoice.fullMatch.parentClass=this;
        this.selectionTypeChoice.fullMatch.className="selection-type-option";
        this.selectionTypeChoice.fullMatch.style.gridColumn="1";
        this.selectionTypeChoice.fullMatch.textContent="Full Match";
        this.selectionTypeChoice.fullMatch.classList.add("active");
        this.selectionTypeChoice.fullMatch.addEventListener("click", function(){
            this.classList.add("active");
            this.parentClass.selectionTypeChoice.partialMatch.classList.remove("active");
            this.parentClass.matchType="full";
            window.currentFilter["Category Match"]="full";
        })
        this.selectionTypeChoice.appendChild(this.selectionTypeChoice.fullMatch);

        this.selectionTypeChoice.partialMatch=document.createElement("div");
        this.selectionTypeChoice.partialMatch.parentClass=this;
        this.selectionTypeChoice.partialMatch.className="selection-type-option";
        this.selectionTypeChoice.partialMatch.style.gridColumn="2";
        this.selectionTypeChoice.partialMatch.textContent="Partial Match";
        this.selectionTypeChoice.appendChild(this.selectionTypeChoice.partialMatch);
        this.selectionTypeChoice.partialMatch.addEventListener("click", function(){
            this.classList.add("active");
            this.parentClass.selectionTypeChoice.fullMatch.classList.remove("active");
            this.parentClass.matchType="partial";
            window.currentFilter["Category Match"]="partial";
        })
        
        
        



        this.categoryButtons=[];
        this.categoryGrid=document.createElement("div");
        this.categoryGrid.className="category-grid";
        this.element.appendChild(this.categoryGrid);

        let idList = Object.values(categoriesData).map(category => category.ID);
        idList.sort((a, b) => categoriesData[b].Priority - categoriesData[a].Priority);
        for(let i=0; i<idList.length; i++){
            const category = categoriesData[idList[i]];
            category.enabled=false;
            category.parentClass=this;
            this.categoryButtons.push(category);
            category.disable=function(){
                this.enabled=false;
                this.element.style.backgroundImage="url('"+window.assetBase+"/global/en/card_category/label/card_category_label_"+("00000"+this.ID).slice(-4)+"_b_off.png')";
            }
            category.element = document.createElement("div");
            category.element.Class=category;
            category.element.style.backgroundImage="url('"+window.assetBase+"/global/en/card_category/label/card_category_label_"+("00000"+category.ID).slice(-4)+"_b_off.png')";
            category.element.className="category-button";
            this.categoryGrid.appendChild(category.element);
            category.element.addEventListener("click", function(){
                if(this.Class.enabled){
                    this.style.backgroundImage="url('"+window.assetBase+"/global/en/card_category/label/card_category_label_"+("00000"+category.ID).slice(-4)+"_b_off.png')"
                    this.Class.enabled=false;
                    window.currentFilter["Categories"].splice(window.currentFilter["Categories"].indexOf(category.Name), 1);
                }
                else if(!this.Class.enabled){
                    this.style.backgroundImage="url('"+window.assetBase+"/global/en/card_category/label/card_category_label_"+("00000"+category.ID).slice(-4)+"_b_on.png')"
                    this.Class.enabled=true;
                    window.currentFilter["Categories"].push(category.Name);
                }
            });
        }
        this.categoryGrid.cancelSelection=function(){
            for(let i=0; i<this.children.length; i++){
                this.children[i].style.backgroundImage="url('"+window.assetBase+"/global/en/card_category/label/card_category_label_"+("00000"+this.children[i].Class.ID).slice(-4)+"_b_off.png')"
                this.children[i].Class.enabled=false;
                window.currentFilter["Categories"]=[];
                window.currentFilter["Category Match"]="full";
                this.children[i].Class.parentClass.selectionTypeChoice.fullMatch.classList.add("active");
                this.children[i].Class.parentClass.selectionTypeChoice.partialMatch.classList.remove("active");
            }
        }

        this.OKCancelContainer=document.createElement("div");
        this.OKCancelContainer.parentClass = this;
        this.OKCancelContainer.className="OKCancelContainer";
        this.OKCancelContainer.style.gridRow="4";
        this.OKCancelContainer.style.display="grid";
        this.element.appendChild(this.OKCancelContainer);

        this.OKCancelContainer.OKButton=document.createElement("div");
        this.OKCancelContainer.OKButton.parentClass = this.OKCancelContainer;
        this.OKCancelContainer.OKButton.className="OKCancelContainer-button";
        this.OKCancelContainer.OKButton.style.backgroundImage="url('"+window.assetBase+"/global/en/layout/en/image/common/btn/com_btn_04_orange.png')";
        this.OKCancelContainer.OKButton.style.gridColumn="2"
        this.OKCancelContainer.OKButton.style.lineHeight="274%";
        this.OKCancelContainer.OKButton.style.fontSize="30px";
        this.OKCancelContainer.OKButton.textDiv=document.createElement("div");
        this.OKCancelContainer.OKButton.textDiv.textContent="OK";
        this.OKCancelContainer.OKButton.appendChild(this.OKCancelContainer.OKButton.textDiv);
        this.OKCancelContainer.appendChild(this.OKCancelContainer.OKButton);
        this.OKCancelContainer.OKButton.addEventListener("click", function(){
            this.parentClass.parentClass.completedSelection();
        });

        this.OKCancelContainer.CancelButton=document.createElement("div");
        this.OKCancelContainer.CancelButton.parentClass = this.OKCancelContainer;
        this.OKCancelContainer.CancelButton.className="OKCancelContainer-button";
        this.OKCancelContainer.CancelButton.style.backgroundImage="url('"+window.assetBase+"/global/en/layout/en/image/common/btn/com_btn_17_yellow.png')";
        this.OKCancelContainer.CancelButton.style.gridColumn="3";
        this.OKCancelContainer.CancelButton.textDiv=document.createElement("div");
        this.OKCancelContainer.CancelButton.textDiv.style.position="relative";
        this.OKCancelContainer.CancelButton.textDiv.style.top="50%";
        this.OKCancelContainer.CancelButton.textDiv.textContent="Cancel";
        this.OKCancelContainer.CancelButton.appendChild(this.OKCancelContainer.CancelButton.textDiv);
        this.OKCancelContainer.appendChild(this.OKCancelContainer.CancelButton);
        this.OKCancelContainer.CancelButton.addEventListener("click", function(){
            this.parentClass.parentClass.categoryGrid.cancelSelection();
        });

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
    getElement(){
        return this.element;
    }

    completedSelection(){
        this.completedFunction();
    }

    cancelSelection(){
        this.categoryGrid.cancelSelection();
    }
}