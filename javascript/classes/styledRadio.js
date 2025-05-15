export class styledRadio {
    constructor(width, namesList, firstActivated, optionPerLine, onlyOneSelected, onChangeFunction, assetPath, assetSideWidth) {
        this.width = width;
        this.value=firstActivated;
        this.onChangeFunction = onChangeFunction;
        this.container = document.createElement("div");
        this.container.className = "styled-radio-container";
        this.onlyOneSelected = onlyOneSelected;
        this.optionPerLine = optionPerLine;
        this.assetPath = assetPath;
        this.assetSideWidth = assetSideWidth;
        this.container.style.gridTemplateColumns = `repeat(${optionPerLine}, 1fr)`;
        this.options = [];
        this.setNamesList(namesList);
    }

    getContainer() {
        return this.container;
    }

    getNamesDictionary() {
        return this.namesDictionary;
    }

    getOptionWidth() {
        return this.optionPerLine;
    }

    getOnlyOneSelected() {
        return this.onlyOneSelected;
    }

    setNamesList(namesDictionary) {
        this.namesDictionary = namesDictionary;
        this.options = [];
        let firstActivated = false;
        while (this.container.firstChild) this.container.removeChild(this.container.firstChild);
        
        for (const name of this.namesDictionary) {
            let option;
            

            const onClickFunction = (option) => {
                const inactiveImage=window.assetBase+"/global/en/layout/en/image/common/btn/com_btn_18_green_gray.png"
                const activeImage=window.assetBase+"/global/en/layout/en/image/common/btn/com_btn_18_green.png"
                if (this.onlyOneSelected) {
                    for (const optionIterate of this.options) {
                        optionIterate.element.classList.remove("activeGreen");
                        optionIterate.changeAssetImage(inactiveImage);
                    }
                    option.element.classList.add("activeGreen");
                    option.changeAssetImage(activeImage);
                }
                else{
                    option.element.classList.toggle("activeGreen");
                    if (option.element.classList.contains("activeGreen")) {
                        option.changeAssetImage(activeImage);
                    }
                    else {
                        option.changeAssetImage(inactiveImage);
                    }
                }
                this.value=option.label;
                this.onChangeFunction(this.value);
            }
            // Use the new StyledRadioOption if assetPath is provided
            option = new StyledRadioOption(
                this.assetPath,
                this.assetSideWidth,
                name,
                onClickFunction
            );
            
            option.parentClass = this;
            
            if (option.label == this.value) {
                option.element.classList.add("activeGreen");
                option.changeAssetImage(window.assetBase+"/global/en/layout/en/image/common/btn/com_btn_18_green.png");
            }
            
            
            this.options.push(option);
            this.container.appendChild(option.element);
        }
    }

    setOptionWidth(optionWidth) {
        this.optionPerLine = optionWidth;
        this.container.style.gridTemplateColumns = `repeat(${optionWidth}, 1fr)`;
    }

    setOnlyOneSelected(onlyOneSelected) {
        this.onlyOneSelected = onlyOneSelected;
    }

    setAssetOptions(assetPath, assetSideWidth) {
        this.assetPath = assetPath;
        this.assetSideWidth = assetSideWidth;
        this.setNamesList(this.namesDictionary); // Refresh with new assets
    }
}

export class StyledRadioOption {
    constructor(assetPath, assetSideWidth, label, onClickFunction) {
        this.assetPath = assetPath;
        this.assetSideWidth = assetSideWidth;
        this.label = label;
        this.onClickFunction = onClickFunction;

        // Main container
        this.element = document.createElement("div");
        this.element.parentClass = this;
        this.element.className = "styled-radio-option";
        this.element.style.position = "relative";
        this.element.style.overflow = "hidden";

        
        this.element.addEventListener("click", () => this.onClickFunction(this));
        
        // Left decorative element
        this.leftSection = document.createElement("div");
        this.leftSection.className = "styled-radio-option-left";
        this.element.appendChild(this.leftSection);
        
        // Middle content area
        this.middleSection = document.createElement("div");
        this.middleSection.className = "styled-radio-option-middle";
        //this.middleSection.style.left=this.assetSideWidth+"px";
        //this.middleSection.style.width = width - (2 * this.assetSideWidth) + "px";
        this.middleSection.textContent = label;
        //this.middleSection.style.backgroundSize = this.width + "px " + "100%";
        this.element.appendChild(this.middleSection);
        
        // Right decorative element
        this.rightSection = document.createElement("div");
        this.rightSection.className = "styled-radio-option-right";
        this.element.appendChild(this.rightSection);
        // Apply background images
        this.leftSection.style.backgroundImage = `url(${this.assetPath})`;
        
        this.rightSection.style.backgroundImage = `url(${this.assetPath})`;
        
        // Middle section styling
        this.middleSection.style.backgroundImage = `url(${this.assetPath})`;
        
        const image = new Image();
        image.onload = () => {
            this.element.style.gridTemplateColumns = this.assetSideWidth+"fr "+ (image.width - (2 * this.assetSideWidth))+"fr "+ this.assetSideWidth+"fr"
            this.middleSection.style.backgroundSize = (100 * (1 / ((image.width- (assetSideWidth*2))/image.width)))+"% 100%"
        }
        image.src = this.assetPath;
        // Apply initial styling
        //this.handleResize(width, height);
    }
    setdisplayed(displayed) {
        if (displayed) {
            this.element.style.display = "grid";
        } else {
            this.element.style.display = "none";
        }
    }
    changeAssetImage(assetPath) {
        this.assetPath = assetPath;
        this.leftSection.style.backgroundImage = `url(${this.assetPath})`;
        this.rightSection.style.backgroundImage = `url(${this.assetPath})`;
        this.middleSection.style.backgroundImage = `url(${this.assetPath})`;
    }

    changeCursor(cursor) {
        this.element.style.cursor = cursor;
    }

    getElement() {
        return this.element;
    }
}