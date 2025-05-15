export class LWFPlayer{

  constructor(LWFUrl, canvas, sceneName, scaleX, scaleY,translateX,translateY){
    this.container=canvas;
    this.LWFUrl=LWFUrl;
    this.sceneName=sceneName;

    this.onLwfLoaded = (lwf) => {
        if (lwf.rootMovie) {
            // Attach the desired scene from the LWF file to the root movie.
            // The second argument is the instance name, which can be referenced later.
            const scene = lwf.rootMovie.attachMovie(this.sceneName, `${this.sceneName}_1`);
            if (scene) {
                // Positioning depends on the animation you're loading. For LR arts,
                // the scene should be centered in the LWF.
                scene.moveTo(translateX, translateY);
                scene.scale( scaleX, scaleY);
            }
        }
    
        // Scale the animation to fit the canvas dimensions.

        
        // Activate the animation.
        lwf.active = true;
        
        // Start the animation loop.
        startAnimation(lwf);
    };

    this.attachLWF();
  }

  attachLWF(){
    const settings = {
      lwf: this.LWFUrl,
      stage: this.container,
      imageMap: this.defaultImageMap,
      setBackgroundColor: '00000000', // Fully opaque black (ARGB: Alpha=FF, Red=00, Green=00, Blue=00)
      additionalParams: {
          alpha: true,
          premultipliedAlpha: true
      },
      worker: false,
      onload: this.onLwfLoaded,
    };
    LWF.useCanvasRenderer();
    LWF.ResourceCache.get().loadLWF(settings);

    
  }
  defaultImageMap(assetName) {
    const directory = this.lwf.substring(0, this.lwf.lastIndexOf('/') + 1);
    return `${directory}${assetName}`;
  }

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
          // Render the current frame of the animation onto the canvas
          lwf.render();
      }
      // Request the next animation frame. This recursive call keeps the loop running.
      requestAnimationFrame(render);
  }
   
  // Start the animation loop by requesting the first frame.
  requestAnimationFrame(render);
}