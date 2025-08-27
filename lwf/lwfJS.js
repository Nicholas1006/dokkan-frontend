 // Get the canvas element where the animation will be rendered
 const canvas = document.getElementById('lwf-stage');
 
 let lwfUrl;
 // Specify the path to your LWF file. This URL is used to load the animation data.
 lwfUrl = '/backend_assets/global/en/ingame/battle/sp_effect/sp_effect_b4_00204/en/sp_effect_b4_00204.lwf';
 lwfUrl = '/backend_assets/global/en/ingame/battle/sp_effect/sp_effect_b4_00376/en/sp_effect_b4_00376.lwf';
 lwfUrl = '/backend_assets/global/en/ingame/battle/sp_effect/sp_effect_a1_00336/en/sp_effect_a1_00336.lwf';
 lwfUrl = '/backend_assets/global/en/ingame/battle/sp_effect/sp_effect_b4_00336/en/sp_effect_b4_00336.lwf';

 // The name of the scene to attach from your LWF file.
 const sceneName = 'ef_001';
 // ef_001
// ef_002_bg
// ef_002_ch
// ef_002_ch_r
// ef_002_ch_ura
// ef_002_ch_ura_r
// ef_003_bg
// ef_003_ch
// ef_004_bg
// ef_004_ch

 /* 
     Settings Object & LWF Loading:
     The settings object contains all the parameters required to load the LWF file.
     It is defined first so that the resource loading is initiated immediately.
      
     - lwf: Path to the LWF file.
     - stage: The canvas element where the animation will be rendered.
     - imageMap: The function mapping asset names to their full URLs.
     - setBackgroundColor: 'FF000000' sets the background to fully opaque black.
     - additionalParams: Configuration for alpha blending.
     - onload: Callback function executed when the LWF file is loaded.
                      It stores the loaded LWF in a global variable, attaches the desired scene,
                      scales the animation to fit the canvas, activates it, and starts the animation loop.
 */
 const settings = {
     lwf: lwfUrl,
     stage: canvas,
     imageMap: defaultImageMap,
     setBackgroundColor: 'FF000000', // Fully opaque black (ARGB: Alpha=FF, Red=00, Green=00, Blue=00)
     additionalParams: {
         alpha: true,
         premultipliedAlpha: true
     },
     worker: false,
     onload: onLwfLoaded,
 };

 /*
     Choose the Canvas renderer. It's the most flexible option. WebGL is more performant,
     but only one can be on the screen at a time. Then call the resource cache to load
     the LWF based on our settings.
 */
 LWF.useCanvasRenderer();
 LWF.ResourceCache.get().loadLWF(settings);
  
 /* 
     Default Image Map Function:
     This function takes an asset name (like an image file) and constructs its full URL.
     It does so by extracting the directory portion from the lwfUrl and appending the asset name.
     This ensures that the associated asset files, which are typically located alongside the LWF file,
     are loaded from the correct location.
 */
 function defaultImageMap(assetName) {
     // Extract the directory from the lwfUrl (up to and including the last '/')
     const directory = lwfUrl.substring(0, lwfUrl.lastIndexOf('/') + 1);
     return `${directory}${assetName}`;
 }
  
 function onLwfLoaded(lwf) {  
    window.lwf = lwf;       
     if (lwf.rootMovie) {
        //console.log(lwf.rootMovie.)
         // Attach the desired scene from the LWF file to the root movie.
         // The second argument is the instance name, which can be referenced later.
         const scene = lwf.rootMovie.attachMovie(sceneName, `${sceneName}_1`);
         if (scene) {
             // Positioning depends on the animation you're loading. For LR arts,
             // the scene should be centered in the LWF.
             scene.moveTo(lwf.width / 2, lwf.height / 2);
         }
     }
      
     // Scale the animation to fit the canvas dimensions.
     lwf.scaleForHeight(canvas.width, canvas.height);
      
     // Activate the animation.
     lwf.active = true;
      
     // Start the animation loop.
     startAnimation(lwf);

     //play the specific frame I want
     //displayFrame();
     
    //render_frame(document.getElementById("slider").value);
 }

 /* 
     Animation Loop using requestAnimationFrame:

     requestAnimationFrame is a browser API that synchronizes the animation loop with the
     browser's repaint cycle. It provides a more efficient and smoother animation than 
     alternatives like setTimeout or setInterval.
      
     How it works:
     - The render function is defined to update (exec) and render the animation.
     - The first call to requestAnimationFrame (outside the render function) initiates the process.
     - Inside the render function, requestAnimationFrame is called again to schedule the next frame.
     This recursive call ensures the render continues running.
      
     Note: It might seem like requestAnimationFrame is "called twice" because it is called both 
     to start the render and then again within the render to maintain continuous animation.
 */
 function startAnimation(lwf) {
     let lastTime = performance.now(); // Capture the starting time

     // Define the render function that updates and renders the animation on each frame.
     function render(currentTime) {
         if (lwf && lwf.active) {
             // Calculate the elapsed time (delta) in seconds since the last frame
             const deltaTime = (currentTime - lastTime) / 1000;
             lastTime = currentTime;
             // Update the animation state based on the time elapsed
             lwf.exec(deltaTime);
             console.log(deltaTime);
             // Render the current frame of the animation onto the canvas
             lwf.render();
         }
         // Request the next animation frame. This recursive call keeps the loop running.
         requestAnimationFrame(render);
     }
      
     // Start the animation loop by requesting the first frame.
     requestAnimationFrame(render);
 }


 function displayFrame() {
    window.lwf.setPreferredFrameRate(60,1200);
    //window.lwf.exec(1.21);
    window.lwf.exec(1);
    window.lwf.exec(1);
    window.lwf.rootMovie.gotoFrame(50);
    window.lwf.render();
}

function render_frame(time){
    window.lwf.rootMovie.detachMovie(sceneName);
    const scene = lwf.rootMovie.attachMovie(sceneName, `${sceneName}_1`);
         if (scene) {
             // Positioning depends on the animation you're loading. For LR arts,
             // the scene should be centered in the LWF.
             scene.moveTo(lwf.width / 2, lwf.height / 2);
         }
    window.lwf.exec(1);
    for(let timeToMove=time; timeToMove>0;){
        if(timeToMove > 0.02){
            window.lwf.exec(0.02);
            timeToMove -= 0.02;
        }
        else{
            window.lwf.exec(parseInt(timeToMove));
            timeToMove = 0;
        }
    }
    window.lwf.render();
}

//0.9 seconds
//2.56 seconds