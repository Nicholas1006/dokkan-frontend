export class LWFPlayer{

  constructor(LWFUrl, canvas, sceneName, scaleX=null, scaleY=null,translateX=null,translateY=null,filterBlack=false){
    this.container=canvas;
    this.LWFUrl=LWFUrl;
    this.sceneName=sceneName;
    this.active=true;
    this.needsReset=false;
    this.filterBlack=filterBlack;
    this.onLwfLoaded = (lwf) => {
      if(lwf){
        if (lwf.rootMovie) {
            const scene = lwf.rootMovie.attachMovie(this.sceneName, `${this.sceneName}_1`);
            if (scene) {
              if(scaleX!=null && scaleY!=null && translateX!=null && translateY!=null){
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
        this.lwf=lwf;
        startAnimation(lwf);
      }
      
        
    };

    this.attachLWF();
  }

  changeScene(sceneName, scaleX=null, scaleY=null,translateX=null,translateY=null){
    this.sceneName=sceneName;
    this.needsReset=true;
    if(this.lwf){
      this.lwf.active = false;
      this.lwf=null;
    }
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
  const canvas = lwf.stage;
  const ctx = canvas.getContext('2d');

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

          if(lwf.parentClass.filterBlack){  
            // 🖌️ POST PROCESS: Make black transparent
           const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
           const data = imageData.data;
 
           for (let i = 0; i < data.length; i += 4) {
             const r = data[i];
             const g = data[i + 1];
             const b = data[i + 2];
 
             // if near black (allow a small threshold)
             if (r < 128 && g < 128 && b < 128) {
               data[i + 3] = 0; // set alpha to 0
             }
           }
 
           ctx.putImageData(imageData, 0, 0);
          }
      }
      requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}


