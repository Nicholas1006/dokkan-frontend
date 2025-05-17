console.log("???");
import {LWFPlayer} from "/javascript/classes/LWF.js";

let lwfUrl;
lwfUrl = "/dbManagement/DokkanFiles/global/en/ingame/battle/effect/battle_116001/battle_116001.lwf";
// Get the canvas element where the animation will be rendered
const canvasA = document.getElementById('lwf-stage-a');
canvasA.renderer= new LWFPlayer(lwfUrl, canvasA, "ef_001_a");
const canvasB = document.getElementById('lwf-stage-b');
canvasB.renderer= new LWFPlayer(lwfUrl, canvasB, "ef_001_b");

const canvasC = document.getElementById('lwf-stage-c');
    canvasC.renderer= new LWFPlayer(lwfUrl, canvasC, "ef_001_c");
const canvasD = document.getElementById('lwf-stage-d');

    canvasD.renderer= new LWFPlayer(lwfUrl, canvasD, "ef_001_d");

document.getElementById("unit-id").addEventListener('input', (e) => {
    if (e.target.value.length == 7 && e.target.value[6] != "0") {
        e.target.value = e.target.value.substring(0, 6) + "0";
    }
    const unitID = e.target.value;
    const imageUrl = `${window.assetBase}/global/en/character/card/${unitID}/card_${unitID}_character.png`;
    
    document.getElementById("unit-image").style.backgroundImage = `url('${imageUrl}')`;
    fetch(imageUrl, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                const newDefaultImageMap = function(assetName) {
                    if (assetName.includes("card")) {
                        if (assetName.includes("sp_name")) {
                            const directory = window.assetBase + "/global/en/character/card/" + unitID + "/en/";
                            const newAssetName = assetName.replace("00001", unitID);
                            return `${directory}${newAssetName}`;
                        } else if (assetName.includes("character") || assetName.includes("card")) {
                            const directory = window.assetBase + "/global/en/character/card/" + unitID + "/";
                            const newAssetName = assetName.replace("1000010", unitID);
                            return `${directory}${newAssetName}`;
                        }
                    } else {
                        const directory = lwfUrl.substring(0, lwfUrl.lastIndexOf('/') + 1);
                        return `${directory}${assetName}`;
                    }
                }
                canvasA.renderer.defaultImageMap = newDefaultImageMap
                canvasB.renderer.defaultImageMap = newDefaultImageMap
                canvasC.renderer.defaultImageMap = newDefaultImageMap
                canvasD.renderer.defaultImageMap = newDefaultImageMap
                try{
                    canvasA.renderer.attachLWF()
                    canvasB.renderer.attachLWF()
                    canvasC.renderer.attachLWF()
                    canvasD.renderer.attachLWF()
                }catch(e){}
                
            }
        });



})

document.getElementById("unit-id").dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));


