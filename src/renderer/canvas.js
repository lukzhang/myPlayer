const myVideo = document.getElementById('my-video');
const myVideo2 = document.getElementById('my-video2');

window.addEventListener('load', ()=>{
  const canvas = document.querySelector('#canvas');
  const ctx = canvas.getContext('2d');

  var nodeConsole = require('console');
  var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

  var topVideoFlipped=false;
  var topVideoFlipped2=false;

  var stack = []; //For storing the lines drawn
  stack.push([5,5,500,500]);
  


  fitToContainer(canvas);

  function fitToContainer(canvas){
    // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    canvas.style.height='100%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  // //Resizing
  // canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  

  //variables
  let painting = false;

  function startPosition(){
    painting = true;
    draw(e);
  }
  function finishedPosition(){
    painting = false;
    ctx.beginPath();
  }
  function draw(e){
    if(!painting) return;
    ctx.lineWidth=3;
    ctx.strokeStyle = "red";
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.moveTo(e.clinetX, e.clientY);
  }
  //EventListeners
  canvas.addEventListener('mousedown',startPosition);
  canvas.addEventListener('mouseup',finishedPosition);
  canvas.addEventListener('mousemove',draw);

  document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    
    myConsole.log(charStr);

    //***************************************** */
    //Perhaps z to stop 1st video, x the 2nd video, c both videos
    if(charStr=='z'){
      
      myConsole.log("pop the stack");

      if(myVideo.paused){
        myVideo.play();
      }
      else{
        myVideo.pause();
      }      
    }
    else if(charStr=='x'){
      if(myVideo2.paused){
        myVideo2.play();
      }
      else{
        myVideo2.pause();
      }   
    }
    else if(charStr=='c'){
      //1st video is the lead: if 1st video paused 2nd playing, both will play
      if(myVideo.paused){
        myVideo.play();
        myVideo2.play();
      }
      else{
        myVideo.pause();
        myVideo2.pause();
      }   
    }
    //Slow down the video
    else if(charStr=='s'){
      
      
      if(myVideo.playbackRate>0.1){
        myVideo.playbackRate-=0.1;
      }
      
      if(myVideo2.playbackRate>0){
        myVideo2.playbackRate-=0.1;
      }    
      
      myConsole.log("speed is now: "+myVideo.playbackRate);

    }
    //speed up
    else if(charStr=='d'){
      myConsole.log("speed "+myVideo.playbackRate);
      
      myVideo.playbackRate+=0.1;    
      myVideo2.playbackRate+=0.1;    

    }
    //flip the top video
    else if(charStr=='f'){
      if(!topVideoFlipped){
        myVideo.style.cssText = "-moz-transform: scale(-1, 1); \
        -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
        transform: scale(-1, 1); filter: FlipH;";
        topVideoFlipped=true;
      }
      else{
        myVideo.style.cssText = "-moz-transform: scale(1, 1); \
        -webkit-transform: scale(1, 1); -o-transform: scale(1, 1); \
        transform: scale(1, 1); filter: FlipH;";
        topVideoFlipped=false;
      }      
    }
    //flip bottom video
    else if(charStr=='g'){
      if(!topVideoFlipped2){
        myVideo2.style.cssText = "-moz-transform: scale(-1, 1); \
        -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
        transform: scale(-1, 1); filter: FlipH;";
        topVideoFlipped2=true;
      }
      else{
        myVideo2.style.cssText = "-moz-transform: scale(1, 1); \
        -webkit-transform: scale(1, 1); -o-transform: scale(1, 1); \
        transform: scale(1, 1); filter: FlipH;";
        topVideoFlipped2=false;
      }      
    }
    //undo drawing
    else if(charStr=='u'){
      var tempStack = [];
      stack.pop();  //remove the top one
      while(!stack.isEmpty()){
        var temp = stack.pop();
        ctx.lineWidth=3;
        ctx.strokeStyle = "red";
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.lineTo(temp[0],temp[1]);
        ctx.lineTo(temp[2],temp[3]);
        ctx.closePath();
        ctx.stroke();
        tempStack.push(temp);
      }

      while(!tempStack.isEmpty()){
        stack.push(tempStack.pop());
      }
      
    }
    //go to time
    else if(charStr=='t'){
      //myVideo.currentTime=112;  //in seconds
      //myVideo.currentTime=24;  //in seconds
      //myVideo.currentTime=151;  //in seconds
      myVideo.currentTime=98;  //in seconds

      //myVideo2.currentTime=39;  //in seconds
      myVideo2.currentTime=9;  //in seconds
    }
    //reverse
    else if(charStr=='r'){
      //myVideo.currentTime-=myVideo.playbackRate;
      myVideo.currentTime-=0.05;
    }
    else if(charStr=='R'){
      //myVideo.currentTime-=myVideo.playbackRate;
      myVideo.currentTime-=1.0;
    }
    //fporward
    else if(charStr=='e'){
      //myVideo.currentTime+=myVideo.playbackRate;
      myVideo.currentTime+=0.05;
    }//reverse
    //fporward
    else if(charStr=='E'){
      //myVideo.currentTime+=myVideo.playbackRate;
      myVideo.currentTime+=1.0;
    }//reverse
    else if(charStr=='n'){
      //myVideo.currentTime-=myVideo.playbackRate;
      myVideo2.currentTime-=0.05;
    }
    else if(charStr=='N'){
      //myVideo.currentTime-=myVideo.playbackRate;
      myVideo2.currentTime-=1.0;
    }
    //fporward
    else if(charStr=='m'){
      //myVideo.currentTime+=myVideo.playbackRate;
      myVideo2.currentTime+=0.05;
    }
    else if(charStr=='M'){
      //myVideo.currentTime+=myVideo.playbackRate;
      myVideo2.currentTime+=1.0;
    }
    else if(charStr=='q'){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    else if(charStr=='1'){
      myVideo.volume=0;
      myVideo2.volume=0;
    }
    //Keys to sync speed, slow down only 1 video or the other,...


};
  
});
