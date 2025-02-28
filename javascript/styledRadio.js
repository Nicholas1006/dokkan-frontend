export class styledRadio{
    constructor(namesList,optionPerLine,onlyOneSelected,onChangeFunction){
        this.onChangeFunction=onChangeFunction;
        this.container=document.createElement("div");
        this.container.className="styled-radio-container";
        this.onlyOneSelected=onlyOneSelected;
        this.optionWidth=optionPerLine;
        this.container.style.gridTemplateColumns="repeat("+optionPerLine+",1fr)";
        this.options=[];
        this.value=namesList[0];
        this.setNamesList(namesList);
    }

    getContainer(){
        return(this.container);
    }

    getNamesDictionary(){
        return(this.namesDictionary);
    }

    getOptionWidth(){
        return(this.optionWidth);
    }

    getOnlyOneSelected(){
        return(this.onlyOneSelected);
    }

    setNamesList(namesDictionary){
        this.namesDictionary=namesDictionary;
        this.options=[];
        let firstActivated=false;
        while(this.container.firstChild) this.container.removeChild(this.container.firstChild);
        for (const name of this.namesDictionary){
            let option=document.createElement("div");
            this.options.push(option);
            option.className="styled-radio-option";
            option.innerHTML=name;
            option.parentClass=this;
            if(!firstActivated && this.onlyOneSelected){
                option.classList.add("activeGreen");
                firstActivated=true;
            }
            option.addEventListener(
                "click", function(){
                    if(option.parentClass.onlyOneSelected){
                        for (const optionIterate of this.parentClass.options){
                            optionIterate.classList.remove("activeGreen");
                        }
                        this.classList.add("activeGreen");
                    }
                    else{
                        this.classList.toggle("activeGreen");
                    }
                    this.parentClass.value=this.innerHTML;
                    this.parentClass.onChangeFunction();
                }
            );
            this.container.appendChild(option);
        }
    }

    setOptionWidth(optionWidth){
        this.optionWidth=optionWidth;
    }

    setOnlyOneSelected(onlyOneSelected){
        this.onlyOneSelected=onlyOneSelected;
    }
}
