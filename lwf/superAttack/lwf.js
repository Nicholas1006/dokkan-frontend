console.log("???");
import {LWFPlayer} from "/javascript/classes/LWF.js";

let lwfUrl;
lwfUrl = "/dbManagement/DokkanFiles/global/en/ingame/battle/effect/battle_116001/battle_116001.lwf";
// Get the canvas element where the animation will be rendered
const canvasA = document.getElementById('lwf-stage-a');

const canvasB = document.getElementById('lwf-stage-b');

const canvasC = document.getElementById('lwf-stage-c');

const canvasD = document.getElementById('lwf-stage-d');


document.getElementById("unit-id").addEventListener('input', (e) => {
    canvasA.renderer= new LWFPlayer(lwfUrl, canvasA, "ef_002_a");
    canvasB.renderer= new LWFPlayer(lwfUrl, canvasB, "ef_002_b");
    canvasC.renderer= new LWFPlayer(lwfUrl, canvasC, "ef_002_c");
    canvasD.renderer= new LWFPlayer(lwfUrl, canvasD, "ef_002_d");
})

document.getElementById("unit-id").dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));


