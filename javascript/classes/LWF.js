export class LWFPlayer{

  constructor(LWFUrl, canvas, sceneName, scaleX=null, scaleY=null,translateX=null,translateY=null){
    this.container=canvas;
    this.LWFUrl=LWFUrl;
    this.sceneName=sceneName;
    this.active=true;
    this.needsReset=false;
    this.onLwfLoaded = (lwf) => {
      if(lwf){
        if (lwf.rootMovie) {
            const scene = lwf.rootMovie.attachMovie(this.sceneName, `${this.sceneName}_1`);
            if (scene) {
              if(scaleX && scaleY && translateX && translateY){
                scene.moveTo(translateX, translateY);
                scene.scale( scaleX, scaleY);
              }
              else{
                lwf.scaleForHeight(canvas.width, canvas.height);
                scene.moveTo(lwf.width / 2, lwf.height / 2);
              }
            }
            
        }
        lwf.active = true;
        lwf.parentClass=this;
        startAnimation(lwf);
      }
      
        
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

  play(){
    this.active = true;
    this.needsReset=true;
    
  }
  pause(){
    this.active = false;
  }

}

function startAnimation(lwf) {
  let lastTime = performance.now(); 
  function render(currentTime) {
      if(lwf.parentClass.needsReset){
        Object.keys(lwf.instances[0].attachedMovies).forEach(movieName => {
          Object.keys(lwf.instances[0].attachedMovies[movieName].displayList).forEach(displayName => {
            if(lwf.instances[0].attachedMovies[movieName].displayList[displayName]!=null){
              lwf.instances[0].attachedMovies[movieName].displayList[displayName].currentFrameInternal=0;
            }
          });
          
          lwf.instances[0].attachedMovies[movieName].gotoFrame(1);
          lwf.instances[0].attachedMovies[movieName].play();
        });
        lwf.parentClass.needsReset=false;
      }
      if (lwf && lwf.active && lwf.parentClass.active) {
          const deltaTime = (currentTime - lastTime) / 1000;
          lastTime = currentTime;
          lwf.exec(deltaTime);
          lwf.render();
      }
      requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

