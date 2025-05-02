export class styledRadio {
    constructor(width, namesList, optionPerLine, onlyOneSelected, onChangeFunction, assetPath, assetSideWidth) {
        this.width = width;
        this.onChangeFunction = onChangeFunction;
        this.container = document.createElement("div");
        this.container.className = "styled-radio-container";
        this.onlyOneSelected = onlyOneSelected;
        this.optionPerLine = optionPerLine;
        this.assetPath = assetPath;
        this.assetSideWidth = assetSideWidth;
        this.container.style.gridTemplateColumns = `repeat(${optionPerLine}, 1fr)`;
        this.options = [];
        this.value = namesList[0];
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
                const inactiveImage="/dbManagement/DokkanFiles/global/en/layout/en/image/common/btn/com_btn_03_yellow.png"
                const activeImage="/dbManagement/DokkanFiles/global/en/layout/en/image/common/btn/com_btn_03_green.png"
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
                this.width / this.optionPerLine,
                50, // Default height, adjust as needed
                name,
                onClickFunction
            );
            
            option.parentClass = this;
            
            if (!firstActivated && this.onlyOneSelected) {
                option.element.classList.add("activeGreen");
                option.changeAssetImage("/dbManagement/DokkanFiles/global/en/layout/en/image/common/btn/com_btn_03_green.png");
                firstActivated = true;
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
    constructor(assetPath, assetSideWidth, width, height, label, onClickFunction) {
        this.assetPath = assetPath;
        this.assetSideWidth = assetSideWidth;
        this.width = width;
        this.height = height;
        this.label = label;
        this.onClickFunction = onClickFunction;

        // Main container
        this.element = document.createElement("div");
        this.element.parentClass = this;
        this.element.className = "styled-radio-option";
        this.element.style.width = width + "px";
        this.element.style.height = height + "px";
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
        this.middleSection.style.left=this.assetSideWidth+"px";
        this.middleSection.style.width = width - (2 * this.assetSideWidth) + "px";
        this.middleSection.textContent = label;
        this.middleSection.style.backgroundSize = this.width + "px " + "100%";
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
        
        // Apply initial styling
        this.handleResize(width, height);
    }

    handleResize(width, height) {
        this.width = width;
        this.height = height;
        
        this.element.style.width = width + "px";
        this.element.style.height = height + "px";
        
        // Calculate middle section width
        const middleWidth = Math.max(0, width - (2 * this.assetSideWidth));
        
        // Apply dimensions
        this.leftSection.style.width = this.assetSideWidth + "px";
        this.leftSection.style.position = "absolute";
        this.leftSection.style.left = "0";
        this.leftSection.style.top = "0";
        
        this.middleSection.style.width = middleWidth + "px";
        this.middleSection.style.position = "absolute";
        this.middleSection.style.left = this.assetSideWidth + "px";
        this.middleSection.style.top = "0";
        this.middleSection.style.display = "flex";
        this.middleSection.style.alignItems = "center";
        this.middleSection.style.justifyContent = "center";
        
        this.rightSection.style.width = this.assetSideWidth + "px";
        this.rightSection.style.position = "absolute";
        this.rightSection.style.right = "0";
        this.rightSection.style.top = "0";
        
        
    }

    changeAssetImage(assetPath) {
        this.assetPath = assetPath;
        this.leftSection.style.backgroundImage = `url(${this.assetPath})`;
        this.rightSection.style.backgroundImage = `url(${this.assetPath})`;
        this.middleSection.style.backgroundImage = `url(${this.assetPath})`;
    }
}